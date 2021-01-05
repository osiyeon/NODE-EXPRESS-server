const { create, getUsers, getUserById, updateUser, deleteUser, getUserByEmail } = require('./user.model');
// const { genSaltSync, hashSync, compareSync} = require("bcrypt");
const { sign } = require("jsonwebtoken");

function createUser (req, res) {
    // const body = req.body;
    // const salt = genSaltSync(10);
    // body.password = hashSync(body.password, salt);
    create(req.body, (err, results) => {
        if (err){
            console.log(err);
            return res.status(500).json({
                success: 0,
                message: "Database connection error"
            });
        }
        return res.status(200).json({
            success:1,
            data:results
        });
    });
}
function getUsersById(req, res){
    const id = req.params.id;
    getUserById(id, (err, results) => {
        if (err) {
            console.log(err);
            return;
        }
        if (!results) {
            return res.json({
                success: 0,
                message: "Record not Found"
            })
        }
        return res.json({
            success: 1, 
            data: results
        })
    })
}

function getUser(req, res){
    getUsers((err, results) => {
        if (err) {
            console.log(err);
            return;
        }
        return res.json({
            success: 1, 
            data: results
        })
    })
}

function updateUsers(req, res){
    const body = req.body;
    // const salt = genSaltSync(10);
    // body.password = hashSync(body.password, salt);
    updateUser(body, (err, results) => {
        if(err) {
            console.log(err);
            return;
        }
        if(!results) {
            return res.json({
                success:0,
                message: "Failed to update user"
            })
        }
        return res.json({
            success: 1,
            message: "updated successfully"
        })
    })
}
function deleteUsers(req, res) {
    const data = req.body;
    deleteUser(data, (err, results) => {
        if(err){
            console.log(err);
            return;
        }
        if(!results) {
            return res.json({
                success: 0,
                message: "Record not found"
            })
        }
        return res.json({
            success: 1,
            message: "deleted successfully"
        })
    })
}

function login(req, res){
    const body = req.body;
    getUserByEmail(body.email, body.password, (err, results) => {
        console.log(results);
        if(err){
            console.log(err)
            return;
        }
        if(!results){
            return res.json({
                success: 0,
                message: "Invalid email or password"
            })
        }
        results.password = undefined;
        const jsontoken = sign({ result: results }, "shhhhh", {
            expiresIn: "1h"
        });
        return res.json({
            success:1,
            message: "login successfully",
            token: jsontoken
        })


        // console.log(body.password)
        // console.log(results.password)
        // const result = compareSync(body.password, results.password, (err, success) => {
        //     if(err) throw err;
        //     console.log(success);
        //     return success;
        // });
        // console.log(result);
        // if(result){
        //     results.password = undefined;
        //     const jsontoken = sign({ result: result }, "shhhhh", {
        //         expiresIn: "1h"
        //     });
        //     return res.json({
        //         success:1,
        //         message: "login successfully",
        //         token: jsontoken
        //     })
        // } else {
        //     return res.json({
        //         success: 0,
        //         message: "Invalid email or password"
        //     });
        // }
    })
}



module.exports = {
    createUser, 
    getUsersById,
    getUser,
    updateUsers,
    deleteUsers,
    login
}