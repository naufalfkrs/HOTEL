const express = require(`express`)
const app = express()
app.use(express.json())
const tkamarController = require(`../controllers/tipe_kamar_controller`)
const auth = require(`../auth/auth`)
const { checkRole } = require("../middleware/checkRole");

// app.post("/find", auth.authVerify, checkRole(['admin']), tkamarController.findTkamar)
app.get("/", auth.authVerify, checkRole(['admin']), tkamarController.getAllTkamar)
app.post("/", auth.authVerify, checkRole(['admin']), tkamarController.addTkamar)
app.put("/:id", auth.authVerify, checkRole(['admin']), tkamarController.updateTkamar)
app.delete("/:id", auth.authVerify, checkRole(['admin']), tkamarController.deleteTkamar)

module.exports = app