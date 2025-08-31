# pji410-s3g9
Projeto Integrador IV - Univesp

# ----------------------------------
# models/dados.js
Esse arquivo define o modelo de dados no MongoDB com Mongoose.
# ----------------------------------
// Importa o Mongoose para conectar e manipular MongoDB
// Estrutura dos dados armazenados no banco
// Valor da temperatura
// Data e hora da leitura (default = agora)
// Cria o "modelo" Dados com base no schema
// Exporta para poder usar no server.js

-------------------------
const mongoose = require('mongoose');
const dadosSchema = new mongoose.Schema({ temperature: Number, timestamp: { type: Date, default: Date.now } });
const Dados = mongoose.model('Dados', dadosSchema);
module.exports = Dados;


# ----------------------------------
# server.js
Esse arquivo é o coração do backend.
# ----------------------------------

Ele tem três responsabilidades:
## 1. API REST com Express: 
Fornece endpoints (/dados, /send, etc.) para comunicação com o frontend e outros serviços.

## 2. Broker MQTT com Aedes:
Recebe e envia mensagens do ESP32 via MQTT.

## 3. Conexão com MongoDB:
Salva e lê os dados do banco.

### Principais trechos:
Trecho e O que faz
- Logger com Winston
  Salva logs no arquivo logs/server.log e mostra no console.
- mongoose.connect(...)
  Conecta no banco MongoDB.
- app.post('/dados')
  Endpoint para salvar uma leitura manualmente.
- app.get('/dados')
  Retorna todas as leituras armazenadas no banco.
- Broker MQTT (aedes)
  Cria um servidor na porta 1883 que vai receber dados do ESP32.
- /send
  Permite publicar mensagens HTTP → MQTT (útil para teste).
- /status e /sensor
  Endpoints fictícios para teste.


# ----------------------------------
# frontend/index.html
Esse é o frontend simples que:
# ----------------------------------

- Busca dados do backend (/dados)
- Mostra um gráfico usando Chart.js
- Permite navegar paginando as leituras (20 por vez).
