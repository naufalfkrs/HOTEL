const express = require(`express`)
const app = express()
app.use(express.json())
const userController = require(`../controllers/user_controller`)
const auth = require(`../auth/auth`)

app.post("/login", userController.login)
app.get("/", auth.authVerify, userController.getAllUser)
app.post("/find", auth.authVerify, userController.findUser)
app.post("/", auth.authVerify, userController.addUser)
app.put("/:id", auth.authVerify, userController.updateUser)
app.delete("/:id", auth.authVerify, userController.deleteUser)

module.exports = app