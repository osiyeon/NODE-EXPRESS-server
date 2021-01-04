const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

app.use(bodyParser.json());

const db = mysql.createConnection({
    host: 'localhost',
    database: 'testing',
    user: 'root',
    password: ''
});

db.connect(err => {
    if(err) {
        throw err
    }
    console.log('MySQL Connected');
});

// root route
app.get('/', (req, res) => {res.send("Hello from Hompage");});

// get All Users
app.get('/getUsers', (req, res) => {
    let query = db.query(`SELECT * FROM USER`, (err, results) => {
        if(err) {
            throw err;
        };
        console.log(results);
        res.send(results);
    })
});

// get Single User
app.get('/getUser/:id', (req, res) => {
    db.query(`SELECT * FROM USER WHERE id = ${req.params.id}`, (err, results) => {
        if(err) {
            throw err;
        }
        res.send(results);
    });
});

// create a User
app.post('/createUser', (req, res) => {
    console.log(req.body);
    var name = req.body.name;
    var age = req.body.age;

    db.query(`INSERT INTO USER (name, age) values (?, ?);`, [name, age], (err,results) => {
        if(err) {
            throw err;
        }
        res.send(results);
    });
})


//update User
app.put('/updateUser/:id', async (req, res) => {
    db.query(`SELECT * FROM USER WHERE id = ${req.params.id}`, (err, results) => {
        if(err){
            throw err;
        }
        if(results === undefined || results.length == 0){
            res.send("User does not exist");
        } else {
            var name = req.body.name || results[0].name;
            var age = req.body.age || results[0].age;
            db.query(`UPDATE USER SET name = ?, age = ? WHERE id = ${req.params.id}`, [name, age], (error, result) => {
                if(error) {
                    throw error;
                }
                res.send({data: result, message: "USER updated"});
            });        
        }
    })
});

//delete User
app.delete('/deleteUser/:id', (req, res) => {
    db.query(`SELECT * FROM USER WHERE id = ${req.params.id}`, (err, results) => {
        if(err){
            throw err;
        }
        if(results === undefined || results.length == 0){
            res.send("User does not exist");
        } else {
            db.query(`DELETE FROM USER WHERE id = ${req.params.id}`, (error) => {
                if(error) {
                    throw error;
                } 
                res.send("USER deleted");
            });        
        }
    })
})

app.use(function(req, res, next){
    res.status(404).send("Not found");
    next();
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});