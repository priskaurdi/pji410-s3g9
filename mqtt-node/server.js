const express = require('express');
const bodyParser = require('body-parser');
const aedes = require('aedes')();
const cors = require('cors');


const app = express();

const mqttServer = require('net').createServer(aedes.handle);
const mqttPort = 1883;

mqttServer.listen(mqttPort, ()=>{
    console.log(`MQTT Server is runing on port ${mqttPort}`);
});

aedes.on('client',(client)=>{
    console.log("New client connected: ", client);
});

aedes.on('clientDisconnect',(clitent)=>{
    console.log("Client disconnected: ", clitent);
})

aedes.on('publish', (packet, client)=>{
    console.log( `Mensagem recebida do cliente ${client} - Tópico : $(packet.topic) => ${packet.payload.toString()} ` );
})

app.use(cors());

app.use(bodyParser.json());

app.get('/',(req,res)=>{
    res.send({message:"API MQTT RODANDO"});
});

app.post('/send', (req,res)=>{
    try{
        const mensagem = req.body.mensagem;
        aedes.publish({topic:'esp32/data', payload: mensagem});
        res.status(200).send({message: 'Mensagem publicada'});
    } catch (error) {
        throw new Error("Falha ao publicar mensagem")
    }
});

const port = 3000;

app.listen(port,()=>{
    console.log("Servidor rodando na porta "+port);
});
