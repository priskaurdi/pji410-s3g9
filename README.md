# PJI410-S3G9 – Projeto Integrador IV (UNIVESP)

Este projeto integra **IoT (ESP32)**, **Node.js com Express e MQTT**, **MongoDB** e **um frontend simples** para visualização das leituras de temperatura.

Ele permite:
- Receber dados do sensor via MQTT.
- Armazenar leituras em um banco MongoDB.
- Exibir gráficos e histórico dos dados no frontend.

---

## **1. Pré-requisitos**

Certifique-se de ter instalado:
- [Node.js](https://nodejs.org/) (v18 ou superior)
- [MongoDB Community](https://www.mongodb.com/try/download/community) (local ou em nuvem)
- [Git](https://git-scm.com/)
- [http-server](https://www.npmjs.com/package/http-server) (para rodar o frontend)
  ```bash
  npm install -g http-server

## **2. Clonando o repositório**
git clone https://github.com/priskaurdi/pji410-s3g9.git
cd pji410-s3g9

## **3. Criando um branch para trabalhar**
Antes de iniciar alterações, crie seu branch:
git checkout -b nome-da-sua-branch

Exemplo:
git checkout -b feature/ajuste-grafico

## **4. Configurando o backend**
Vá para a pasta raiz do projeto:
cd pji410-s3g9

Instale as dependências:
npm install

Configure a URL do MongoDB:
Crie um arquivo .env na raiz com:

MONGO_URI=mongodb://localhost:27017/pji410
PORT=3000

Inicie o servidor backend:
node server.js

Se tudo estiver certo, o console mostrará:
Servidor rodando em http://localhost:3000
Broker MQTT ativo na porta 1883
Conectado ao MongoDB

## **5. Rodando o frontend**

Vá para a pasta do frontend:
cd frontend

Inicie o servidor local:
http-server

Acesse no navegador:
http://127.0.0.1:8080

## **6. Usando o MQTT (para testes)**
O broker MQTT está disponível em:

mqtt://localhost:1883

Para publicar dados manualmente:

mosquitto_pub -h localhost -p 1883 -t "sensor/temperatura" -m "25.5"

Para verificar mensagens:

mosquitto_sub -h localhost -p 1883 -t "sensor/temperatura"

## **7. Fluxo de trabalho com Git**
Sempre que fizer alterações:

Verifique em qual branch está:

git branch

Adicione e comite suas alterações:

git add .
git commit -m "Descrição das alterações"

Envie para o repositório remoto:

git push origin nome-da-sua-branch

Crie um Pull Request no GitHub para revisar e integrar suas mudanças.

## **8. Estrutura de Pastas**
pji410-s3g9/
├── frontend/            # Frontend simples com Chart.js
│   └── index.html
├── models/              # Schemas do MongoDB
│   └── dados.js
├── server.js            # Backend (API + MQTT Broker)
├── .env.example         # Exemplo de configuração
├── package.json
└── README.md

## **9. Troubleshooting**
Problemas comuns
Erro	-----------------  Possível solução
MongoNetworkError	-----  Verifique se o MongoDB está rodando na porta correta.
EADDRINUSE	-----------  A porta já está em uso. Mude no .env ou encerre processos ocupando a porta.
Frontend 404 no JSON	-  Certifique-se de que o arquivo JSON está dentro da pasta frontend ou ajuste o caminho no fetch.

## **10. Tecnologias**

Backend: Node.js, Express, MQTT (Aedes), Mongoose
Banco de Dados: MongoDB
Frontend: HTML, JavaScript, Chart.js
Controle de Versão: Git + GitHub

## **11. Contribuição**
Crie uma branch (git checkout -b feature/nome-da-feature)
Commit suas alterações (git commit -m "mensagem descritiva")
Envie para o remoto (git push origin feature/nome-da-feature)
Abra um Pull Request para análise.

## **12. Licença**
Este projeto é de uso educacional, parte do Projeto Integrador IV – UNIVESP.

## **13. .gitignore**
Crie o arquivo .gitignore, conforme o exemplo abaixo:

# Node.js
node_modules/
npm-debug.log
yarn-debug.log
yarn-error.log
package-lock.json

# Logs
logs/
*.log

# Sistema operacional
.DS_Store
Thumbs.db

# Ambiente e credenciais
.env

# Build do frontend (se houver)
dist/
build/

# Arquivos temporários
*.tmp
*.swp

# IDEs
.vscode/
.idea/
