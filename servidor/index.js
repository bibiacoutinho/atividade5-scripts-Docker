var express = require('express');
var app = express();
var cors = require('cors');
app.use(express.json()); //para conversão de application/json
app.use(express.urlencoded({ extended: true })) // para conversão de application/x-www-form-urlencoded
app.use(cors({
    credentials: true,
    origin: 'http://localhost:3100'
})); //para aceitar requisição de outros domínios

// importar o módulo que possui as operações no SQLite
const bd = require('./modelo');

const PORT = '3101';
//define a porta e a função callback a ser executada após o servidor iniciar
app.listen(PORT, () => {
    console.log(`Rodando na porta ${PORT}...`);
});

// http://localhost:3101/log
app.get('/log', bd.select)

// http://localhost:3101/log/1
app.get('/log/:idlog', bd.remove)

// http://localhost:3101/log/3/2/+
// http://localhost:3101/log/3/2/%2F
app.get('/log/:a/:b/:op', bd.insert)

//aceita qualquer método HTTP e URL
app.use((req, res) => {
    res.send({message:"URL desconhecida"});
})

