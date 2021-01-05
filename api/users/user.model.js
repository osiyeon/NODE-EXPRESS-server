const db = require('../../config/database');

function create (data, callBack) {
    var name = data.name;
    var age = data.age;
    var email = data.email;
    var password = data.password;
    db.query(`INSERT INTO USER (name, email, password, age) values (?, ?, password(?), ?);`, [name, email, password, age], (err,results) => {
        if(err) {
            return callBack(err);            
            // throw err;
        }
        console.log(results.password)
        return callBack(null, results);
    })
}

function getUsers (callBack) {
    db.query(`SELECT * FROM USER`, (err, results) => {
        if(err) {
            callBack(err);
        };
        console.log(results.password);
        return callBack(null, results);
    })
}

function getUserById (id, callBack) {
    db.query(`SELECT * FROM USER WHERE id = ${id}`, (err, results) => {
        if(err) {
            return callBack(err);
        }
        callBack(null, results[0]);
    })
}

function updateUser (data, callBack) {
    db.query(`UPDATE USER SET name = ?, age = ?, password = password(?) WHERE id = ?`, [data.name, data.age, data.password, data.id], (error, results) => {
        if(error) {
            return callBack(error);
        }
        return callBack(null, results);
    })
}

function deleteUser (data, callBack) {
    db.query(`DELETE FROM USER WHERE id = ${data.id}`, (error, results) => {
        if(error) {
            return callBack(error);
        } 
        return callBack(null, results[0]);
    })
}

function getUserByEmail(email, pwd, callBack){
    db.query(`select * from USER where email = ? and password = password(?)`, [email, pwd], (error, results) => {
        if(error){
            callBack(error);
        }
        console.log(results[0])
        return callBack(null, results[0]);
    })
}





module.exports = {
    create,
    getUsers,
    getUserById,
    updateUser,
    deleteUser,
    getUserByEmail
};