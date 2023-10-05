const express = require(`express`)
const app = express()
app.use(express.json())
const tkamarController = require(`../controllers/tipe_kamar_controller`)
const auth = require(`../auth/auth`)

app.get("/", auth.authVerify, tkamarController.getAllTkamar)
app.post("/", auth.authVerify, tkamarController.addTkamar)
app.post("/find", auth.authVerify, tkamarController.findTkamar)
app.put("/:id", auth.authVerify, tkamarController.updateTkamar)
app.delete("/:id", auth.authVerify, tkamarController.deleteTkamar)

module.exports = app