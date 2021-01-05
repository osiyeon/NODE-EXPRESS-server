// CRUD 위해 처음 만들었던 app.js
require("dotenv").config();

const express = require('express');
const app = express();

const bodyParser = require('body-parser');


app.use(bodyParser.json());


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

// create a User - signup
app.post('/createUser', (req, res) => {
    console.log(req.body);
    var name = req.body.name;
    var age = req.body.age;
    var email = req.body.email;
    var password = req.body.password;

    db.query(`INSERT INTO USER (name, email, password, age) values (?, ?, ?, ?);`, [name, email, password, age], (err,results) => {
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
            var password = req.body.password || results[0].password;
            db.query(`UPDATE USER SET name = ?, age = ?, password = ? WHERE id = ${req.params.id}`, [name, age, password], (error, result) => {
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

app.listen(process.env.APP_PORT, () => {
    console.log(`Example app listening at http://localhost:${process.env.APP_PORT}`);
});