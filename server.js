// Importa as dependências necessárias.
// ======================================================
// IMPORTAÇÃO DE DEPENDÊNCIAS
// ======================================================
const express = require('express');     // Framework para criar servidor HTTP e APIs REST
const bodyParser = require('body-parser'); // Middleware para interpretar corpo de requisições (JSON)
const cors = require('cors');           // Permite requisições de outros domínios (CORS)
const aedes = require('aedes')();       // Broker MQTT
const net = require('net');             // Servidor TCP para MQTT
const http = require('http');           // Servidor HTTP nativo do Node
const fs = require('fs');                // Manipulação de arquivos
const path = require('path');            // Manipulação de caminhos
const winston = require('winston');      // Logger para salvar logs em arquivo
const mongoose = require('mongoose');
const Dados = require('./models/dados.js');



// =========================================
// Configuração do Logger (Arquivo de Logs)
// =========================================
const logDir = path.join(__dirname, 'logs');
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir); // Cria a pasta "logs" se não existir
}

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.printf(info => `${info.timestamp} [${info.level.toUpperCase()}]: ${info.message}`)
    ),
    transports: [
        new winston.transports.File({ filename: path.join(logDir, 'server.log') }),
        new winston.transports.Console()
    ]
});

// ======================================================
// CONFIGURAÇÕES GERAIS
// ======================================================
// Define a porta em que o servidor web Express irá rodar.
const port = 3000; // Porta para interface HTTP/WebSocket
// Cria uma instância do aplicativo Express.
const app = express();
// Define a porta padrão para o broker MQTT. // Porta padrão do protocolo MQTT
const mqttPort = 1883; // Porta padrão do MQTT

// Middlewares globais
// Habilita o CORS para todas as rotas, permitindo requisições de diferentes origens.
app.use(cors()); // Permite acesso de qualquer origem
// Adiciona o middleware bodyParser para que o Express consiga interpretar corpos de requisição no formato JSON.
app.use(bodyParser.json()); // Interpreta corpos JSON

// ======================================================
// Banco de dados - API
// ======================================================
const bdURL = 'mongodb://localhost:27017';

mongoose.connect(bdURL).then(
()=>{ console.log('Conectado ao banco de dados')}).catch((error)=>{
    console.log(error);
});

app.post('/dados',  async (req, res) => {
try {
    const {temperature} = request.body
    const novoDado = new Dados({temperature});
    await novoDado.save()

    console.log("Dados Salvos")
    return res.sendStatus(201).send({message: "Dados Salvos", temperature:temperature});

}   catch (error) {
    return res.sendStatus(500).send({message: "Erro ao salvar", error:error.message});
}
});

app.get('/dados',  async (req, res) => {
try {
    const dados = await Dados.find();
    return res.status(200).json(dados);

}   catch (error) {
    return res.sendStatus(500);
}
});





// ======================================================
// SERVIDOR MQTT (Broker)
// ======================================================
// Cria um servidor TCP puro usando o módulo 'net' do Node.js.
// O aedes.handle é um listener que processa o tráfego de rede de acordo com o protocolo MQTT.
const mqttServer = net.createServer(aedes.handle);


// Inicia o servidor MQTT e o faz "escutar" por conexões na porta definida.
mqttServer.listen(mqttPort, () => {
    console.log(`🚀 Broker MQTT rodando na porta ${mqttPort}`);
});

// --- EVENTOS DO BROKER MQTT ---
// Esses blocos 'aedes.on' são "escutadores de eventos". Eles executam uma função
// sempre que um determinado evento acontece no broker.

// Evento disparado quando um novo cliente MQTT se conecta ao broker.
aedes.on('client', (client) => {
    console.log(`📡 Cliente conectado: ${client.id}`);
});

// Evento disparado quando um cliente MQTT se desconecta.
aedes.on('clientDisconnect', (client) => {
    console.log(`❌ Cliente desconectado: ${client.id}`);
});

// Evento disparado toda vez que uma mensagem é publicada em qualquer tópico.
// Útil para depuração e para ver todo o tráfego de mensagens.
// A linha abaixo está comentada, mas é uma forma mais simples de logar a mensagem.
// aedes.on('publish', (packet, client)=>{
//     console.log( `Mensagem recebida do cliente ${client} - Tópico : ${packet.topic}-> Mensagem: ${packet.payload} ` );
// });

// Versão mais detalhada do log de publicação, com cores no console para facilitar a leitura.
// aedes.on('publish', async function (packet, client) {
//     // O 'client' pode ser nulo se a mensagem for publicada diretamente pelo broker (como no nosso endpoint /send).
//     const clientId = client ? client.id : 'BROKER_' + aedes.id;
//     console.log(`Client \x1b[31m${clientId}\x1b[0m has published "${packet.payload.toString()}" on topic "${packet.topic}" to broker ${aedes.id}`);
// });

aedes.on('publish', (packet, client) => {
    const clientId = client ? client.id : `BROKER_${aedes.id}`;
    console.log(`📩 Publicação do cliente ${clientId}: "${packet.payload.toString()}" no tópico "${packet.topic}"`);
});



// ======================================================
// ROTAS HTTP (API REST)
// ======================================================
// --- CONFIGURAÇÃO DO SERVIDOR EXPRESS (API HTTP) ---

// Rota raiz para checagem rápida
// Define a rota principal (GET /). Útil para verificar se a API está online.
app.get('/', (req, res) => {
    res.send({ message: "API MQTT RODANDO" });
});

// Rota de eco (teste básico)
// Define uma rota de "eco" (POST /echo). Ela simplesmente retorna o mesmo corpo que recebeu.
// Ótima para testar se o recebimento de dados via POST está funcionando.
app.post('/echo', (req, res) => {
    // const {email,senha}= req.body
    // console.log(email);
    // console.log(senha);
    logger.info(`Echo recebido: ${JSON.stringify(req.body)}`);
    res.send(req.body);
})

// Publica mensagens HTTP → MQTT
// Rota principal para a integração HTTP -> MQTT.
// Recebe uma requisição POST e publica a mensagem no broker MQTT.
app.post('/send', (req, res) => {
    try {
        // Extrai o campo 'mensagem' do corpo da requisição JSON.
        const mensagem = req.body.mensagem;
        if (!mensagem) {
            logger.warn('Tentativa de publicação sem mensagem');
            return res.status(400).send({ error: 'Campo "mensagem" é obrigatório' });
        }

        logger.info(`Mensagem recebida via HTTP: ${mensagem}`);
        console.log(`📤 Publicando mensagem recebida via HTTP: ${mensagem}`);

        // Monta pacote para publicar no broker
        // Cria o pacote da mensagem a ser publicada no MQTT.
        const packet = {
            topic: 'esp32/data', // Tópico fixo onde a mensagem será publicada.
            payload: mensagem    // Conteúdo da mensagem.
        };

        // Usa a instância do Aedes para publicar a mensagem.
        // O broker então a enviará para todos os clientes inscritos no tópico 'esp32/data'.
        aedes.publish(packet);
        logger.info(`Mensagem publicada no tópico "esp32/data": ${mensagem}`);

        // Responde à requisição HTTP com sucesso.
        res.status(200).send({ message: 'Mensagem publicada com sucesso' });

    } catch (error) {
        // Em caso de erro (ex: 'mensagem' não existe no corpo da requisição),
        // lança um erro e o servidor provavelmente retornará uma resposta de erro 500.
        logger.error(`Erro ao publicar mensagem: ${error.message}`);
        console.error('❌ Erro ao publicar mensagem:', error);
        res.status(500).send({ error: 'Falha ao publicar mensagem' });
    }
});


// ======================================================
// INTEGRAÇÃO DO CONTEÚDO DO APP.JS
// ======================================================

// Exemplo de rota adicional para simular leitura de dados do ESP32
app.get('/status', (req, res) => {
    res.send({
        device: 'ESP32',
        status: 'online',
        lastUpdate: new Date().toISOString()
    });
});

// Exemplo de rota para dados simulados do sensor
app.get('/sensor', (req, res) => {
    res.send({
        temperature: (20 + Math.random() * 5).toFixed(2),
        humidity: (50 + Math.random() * 10).toFixed(2),
        updatedAt: new Date().toISOString()
    });
});


// ======================================================
// INICIALIZAÇÃO DO SERVIDOR HTTP
// ======================================================
app.listen(port, () => {
    logger.info(`Servidor HTTP rodando na porta ${port}`);
    console.log(`🌐 Servidor HTTP rodando na porta ${port}`);
});