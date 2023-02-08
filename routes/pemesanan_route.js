const express = require(`express`)
const app = express()
app.use(express.json())
const pemesananController = require(`../controllers/pemesanan_controller`)
const auth = require(`../auth/auth`)

app.get("/", auth.authVerify,pemesananController.getAllPemesanan)
app.post("/", auth.authVerify, pemesananController.addPemesanan)
app.post("/find", auth.authVerify, pemesananController.findPemesanan)
app.put("/:id", auth.authVerify, pemesananController.updatePemesanan)
app.delete("/:id", auth.authVerify, pemesananController.deletePemesanan)

module.exports = app