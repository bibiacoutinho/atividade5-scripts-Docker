// importar o módulo sqlite3
// ao definir verbose (detalhado) poderemos rastrear a pilha de execução
const sqlite3 = require('sqlite3').verbose();

// cria o BD e abre a conexão com ele, e após, dispara a função callback
const bd = new sqlite3.Database('./bdaula.db', 
    function(error){
        if( error )
            console.log(error.message)
        else
            console.log('BD criado')
    }
);

//cria a tabela no bdaula
bd.run(
    'create table if not exists tblog(' +
    'idlog integer primary key autoincrement,' +
    'operacao text not null,' +
    'horario text not null' +
    ')',
    function(error){
        if( error )
            console.log(error.message)
        else
            console.log('Tabela criada')
    }
);

const getDate = () => {
    const d = new Date();
    const dia = d.getDate() < 10 ? '0' + d.getDate() : d.getDate();
    const mes = d.getMonth() < 9 ? '0' + (d.getMonth() + 1) : d.getMonth() + 1;
    const hora = d.getHours() < 10 ? '0' + d.getHours() : d.getHours();
    const minuto = d.getMinutes() < 10 ? '0' + d.getMinutes() : d.getMinutes();
    const segs = d.getSeconds() < 10 ? '0' + d.getSeconds() : d.getSeconds();
    return `${dia}/${mes}/${d.getFullYear()} ${hora}:${minuto}:${segs}`;
};

// retorna todos os registros da tblog
const select = (req, res) => {
    // o método all é usado para fazer uma consulta que retorna vários registros
    // a resposta é um array de JSON
    bd.all('select * from tblog order by idlog desc', (error, rows) => {
        if (error)
            res.send({ erro: error.message });
        else
            res.send({ result: rows });
    });
};

// insere um registro na tblog com os dados passados no corpo da requisição (request)
const insert = (req, res) => {
    try {
        const { a, b, op } = req.params
        if (isNaN(parseInt(a)) || isNaN(parseInt(b)) )
            res.send({ erro: 'Operadores inválidos' })
        else {
            const r = eval(a + op + b)
            const operacao = '' + a + op + b + '=' + r
            const horario = getDate()
            bd.run('insert into tblog(operacao,horario) values (?,?)',
                [operacao, horario],
                function (error) { /* para ter o objeto this não pode ser Arrow Function */
                    if (error)
                        res.send({ erro: error.message })
                    else if (this.lastID)
                        res.send({ result: r, obj: { idlog: this.lastID, operacao, horario } })
                    else
                        res.send({ erro: 'Problemas para obter o registro inserido' });
                }
            );
        }
    } catch (e) {
        res.send({ erro: e.message });
    }

};

// insere um registro na tblog com os dados passados no corpo da requisição (request)
const remove = (req, res) => {
    const { idlog } = req.params
    bd.run('delete from tblog where idlog=?',
        [idlog],
        function (error) { 
            if (error)
                res.send({ erro: error.message });
            else if (this.changes == 1)
                res.send({ result: 'Registro removido com sucesso' });
            else
                res.send({ erro: 'O registro não existe' });
        }
    );
};

module.exports = {
    select,
    insert,
    remove
};