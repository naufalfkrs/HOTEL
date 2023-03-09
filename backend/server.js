const express = require(`express`)
const app = express()
const PORT = 8000
const cors = require(`cors`)
const bodyParser = require("body-parser")
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(cors())

const userRoute = require(`./routes/user_route`)
const tkamarRoute = require(`./routes/tipe_kamar_route`)
const kamarRoute = require(`./routes/kamar_route`)
const pemesananRoute = require(`./routes/pemesanan_route`)

app.use(`/user`, userRoute)
app.use(`/tkamar`, tkamarRoute) 
app.use(`/kamar`, kamarRoute) 
app.use(`/pemesanan`, pemesananRoute) 
app.use(express.static(__dirname))

app.listen(PORT, () => {
    console.log(`Yaayyy berjalan di port ${PORT}`)
})