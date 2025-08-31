//models/dados.js
//Esse arquivo define o modelo de dados no MongoDB com Mongoose.


// Importa o Mongoose para conectar e manipular MongoDB
const mongoose = require('mongoose'); 

// Estrutura dos dados armazenados no banco
const dadosSchema = new mongoose.Schema({
    temperature: Number ,                       // Valor da temperatura
    timestamp :{type: Date, default: Date.now}  // Data e hora da leitura (default = agora)
});

// Cria o "modelo" Dados com base no schema
const Dados = mongoose.model('Dados', dadosSchema);

// Exporta para poder usar no server.js
module.exports = Dados;

