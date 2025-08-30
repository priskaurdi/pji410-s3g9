const mongoose = require('mongoose'); // 885.9k (gzipped: 237.2k)

const dadosSchema = new mongoose.Schema({
    temperature: Number ,
    timestamp :{type: Date, default: Date.now}
});

const Dados = mongoose.model('Dados', dadosSchema);

module.exports = Dados;

