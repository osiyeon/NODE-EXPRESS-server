const { create, getUsers, getUserById, updateUser, deleteUser, getUserByEmail, insertFToken, removeRefreshtoken } = require('./user.model');
const { sign } = require("jsonwebtoken");

// create user
function createUser (req, res) {
    create(req.body, (err, results) => {
        if (err){
            console.log(err);
            return res.status(500).json({
                success: 0,
                message: "Database connection error"
            });
        }
        return res.status(201).json({
            success:1,
            data:results
        });
    });
}

// get User by userID
function getUsersById(req, res){
    const id = req.params.id;
    getUserById(id, (err, results) => {
        if (err) {
            console.log(err);
            return;
        }
        if (!results) {
            return res.status(404).json({
                success: 0,
                message: "Record not Found"
            })
        }
        return res.status(200).json({
            success: 1, 
            data: results,
        })
    })
}

// get All User
function getUser(req, res){
    getUsers((err, results) => {
        if (err) {
            console.log(err);
            return;
        }
        return res.status(200).json({
            success: 1, 
            data: results
        })
    })
}

// Update User
function updateUsers(req, res){
    const body = req.body;
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
        return res.status(201).json({
            success: 1,
            message: "updated successfully"
        })
    })
}

// Delete User
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

// email Login
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
        console.log(results)
        const jsontoken = sign({ result: results }, "access", { expiresIn: '3m' });
        const refreshToken = sign({ result: results }, "refresh" , { expiresIn: '7d'});
        insertFToken(results.id, refreshToken, (err, result) => {
            if(err){
                console.log(err);
                return;
            }
            return res.status(200).json({
                success:1,
                message: "login successfully",
                token: jsontoken,
                refreshToken: refreshToken
            });    
        })
    })
}

function logout(req, res){
    const refreshToken = req.body.refreshToken;
    removeRefreshtoken(refreshToken, (err, results) => {
        if(err){
            console.log(err);
            return;
        }
        return res.json({
            success: 1,
            message: "deleted successfully"
        })
    })
}



module.exports = {
    createUser, 
    getUsersById,
    getUser,
    updateUsers,
    deleteUsers,
    login,
    logout
}