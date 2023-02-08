const express = require(`express`)
const app = express()
app.use(express.json())
const kamarController = require(`../controllers/kamar_controller`)
const auth = require(`../auth/auth`)

app.get("/", auth.authVerify,kamarController.getAllKamar)
app.post("/find", auth.authVerify, kamarController.findKamar)
app.get("/avaible", auth.authVerify, kamarController.getKamarAvaible )
app.post("/", auth.authVerify, kamarController.addKamar)
app.put("/:id", auth.authVerify, kamarController.updateKamar)
app.delete("/:id", auth.authVerify, kamarController.deleteKamar)

module.exports = app