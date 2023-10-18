const express = require(`express`)
const app = express()
app.use(express.json())
const kamarController = require(`../controllers/kamar_controller`)
const auth = require(`../auth/auth`)
const { checkRole } = require("../middleware/checkRole");

// app.post("/find", auth.authVerify, checkRole(['admin']), kamarController.findKamar)
app.get("/", auth.authVerify, checkRole(['admin']), kamarController.getAllKamar)
app.post("/", auth.authVerify, checkRole(['admin']), kamarController.addKamar)
app.put("/:id", auth.authVerify, checkRole(['admin']), kamarController.updateKamar)
app.delete("/:id", auth.authVerify, checkRole(['admin']), kamarController.deleteKamar)

app.post("/avaible", auth.authVerify, checkRole(['customer']), kamarController.getKamarAvaible )

module.exports = app