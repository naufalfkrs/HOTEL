const express = require(`express`)
const app = express()
app.use(express.json())
const pemesananController = require(`../controllers/pemesanan_controller`)
const auth = require(`../auth/auth`)
const { checkRole } = require("../middleware/checkRole");

app.get("/", auth.authVerify, checkRole(['resepsionis']), pemesananController.getAllPemesanan)
app.put("/:id", auth.authVerify, checkRole(['resepsionis']), pemesananController.updatePemesanan)
app.post("/name", auth.authVerify, checkRole(['resepsionis']), pemesananController.getPemesananByName)
app.post("/in", auth.authVerify, checkRole(['resepsionis']), pemesananController.getPemesananByTglCheckIn)

app.get("/:id_user", auth.authVerify, checkRole(['customer']), pemesananController.getPemesananById)
app.post("/nomor", auth.authVerify, checkRole(['customer']), pemesananController.getPemesananByNomor)
app.post("/", auth.authVerify, checkRole(['customer']), pemesananController.addPemesanan)

module.exports = app