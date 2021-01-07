const { createUser, getUsersById, getUser, updateUsers, deleteUsers, login, logout } = require("./user.controller")
const router = require("express").Router();
const { checkToken, /*renewAccessToken*/ } = require("../../auth/token_validation")

router.post("/", createUser);
router.get("/", checkToken, getUser);
router.get("/:id", checkToken, getUsersById);
router.patch("/", checkToken, updateUsers);
router.delete("/", checkToken, deleteUsers);

// router.post("/renewAccessToken", renewAccessToken)
router.post("/login", login);
router.delete("/logout", checkToken, logout);

module.exports = router;