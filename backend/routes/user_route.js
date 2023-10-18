const express = require(`express`)
const app = express()
app.use(express.json())
const userController = require(`../controllers/user_controller`)
const auth = require(`../auth/auth`)
const { checkRole } = require("../middleware/checkRole");

// app.post("/find", auth.authVerify, checkRole(['admin']), userController.findUser)
app.post("/login", userController.login)
app.post("/register", userController.register)

app.get("/", auth.authVerify, checkRole(['admin']), userController.getAllUser)
app.post("/", auth.authVerify, checkRole(['admin']), userController.addUser)
app.put("/:id", auth.authVerify, checkRole(['admin']), userController.updateUser)
app.delete("/:id", auth.authVerify, checkRole(['admin']), userController.deleteUser)

module.exports = app