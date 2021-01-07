const { verify, sign } = require("jsonwebtoken");
const db = require('../config/database');


// get userId By refreshToken in database
async function getUserByRT(refreshToken) {
    console.log(refreshToken)
    return new Promise((resolve, reject) => {
        db.query(`SELECT * FROM AUTH WHERE refreshToken = ?`,[refreshToken], (err, results) => {
            if(err){
                throw err;
            }
            else{
                console.log(results);
                resolve(results[0].user_id);    
            }
        })    
    }
)}


function renewAccessToken ( refreshToken, req, res) {
    if(!refreshToken){
        return res.status(403).json({ 
            success: 0,
            message: "Access denied! User has not Refresh Token"
        });
    } else {
        verify(refreshToken, "refresh", async(err, decoded) => {
            let result = await getUserByRT(refreshToken);
            if(!err) {
                const accessToken = sign({ result: result }, "access", { expiresIn: "1h" });
                console.log("accessToken:" + accessToken)
            } else {
                return res.status(403).json({
                    success: 0,
                    message: "Access denied! unauthorized user"
                })
            }
        })        
    }
}

function checkToken(req, res, next){
    let refreshToken = req.body.refreshToken;
    let token = req.get("authorization");
    if(token){
        token = token.slice(7);
        verify(token, "access", (err, decoded) => {
            if(err){
                renewAccessToken(refreshToken);
                next();        
            } else {
                req.decoded = decoded;
                next();
            }
        })
    } else {
        res.status(401).json({
            success: 0,
            message: "Access denied! unauthorized user"
        })
    }
}


module.exports = {
    checkToken,
}