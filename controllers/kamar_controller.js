const kamarModel = require(`../models/index`).kamar
const tkamarModel = require(`../models/index`).tipe_kamar
const Op = require(`sequelize`).Op

const Sequelize = require("sequelize");
const sequelize = new Sequelize("hotel", "root", "", {
  host: "localhost",
  dialect: "mysql",
})

exports.getAllKamar = async (request, response) => {
    const result = await sequelize.query(
        "SELECT kamars.id,kamars.nomor_kamar,tipe_kamars.nama_tipe_kamar FROM kamars JOIN tipe_kamars ON tipe_kamars.id = kamars.id_tipe_kamar ORDER BY kamars.id ASC"
      )
    return response.json({
        success: true,
        data: result[0],
        message: `Kamar have been loaded`,
    })
}

exports.findKamar = async (request, response) => {
    let nomor_kamar = request.body.nomor_kamar

    const result = await sequelize.query(
        `SELECT kamars.id,kamars.nomor_kamar,tipe_kamars.nama_tipe_kamar FROM kamars JOIN tipe_kamars ON tipe_kamars.id = kamars.id_tipe_kamar where kamars.nomor_kamar= ${nomor_kamar} ORDER BY kamars.id ASC `
    )
    return response.json({
        success: true,
        data: result[0],
        message: `Kamar have been loaded`,
    })
}

exports.getKamarAvaible = async (request, response) => {
    const result = await sequelize.query(
        `SELECT tipe_kamars.*, count(kamars.id) as sisa_kamar FROM kamars LEFT JOIN tipe_kamars ON kamars.id_tipe_kamar = tipe_kamars.id LEFT JOIN detail_pemesanans ON detail_pemesanans.id_kamar = kamars.id AND  detail_pemesanans.tgl_akses BETWEEN "2023-01-20" AND "2023-01-23" WHERE detail_pemesanans.tgl_akses IS NULL GROUP BY tipe_kamars.id `
    )
    return response.json({
        success: true,
        data: result[0],
        message: ` Avaible Kamar have been loaded`,
    })
}

exports.addKamar = async (request, response) => {
    let nama_tipe_kamar = request.body.nama_tipe_kamar;
    let tipeId = await tkamarModel.findOne({
        where: {
        [Op.and]: [{ nama_tipe_kamar: { [Op.substring]: nama_tipe_kamar } }],
        },
    })

    let newKamar = {
        nomor_kamar: request.body.nomor_kamar,
        id_tipe_kamar: tipeId.id,
    }

    kamarModel
        .create(newKamar)
        .then((result) => {
            return response.json({
                success: true,
                data: result,
                message: `New Kamar has been inserted`,
            })
        })
        .catch((error) => {
            return response.json({
                success: false,
                message: error.message,
            })
        })
}

exports.updateKamar = async (request, response) => {  
    let nama_tipe_kamar = request.body.nama_tipe_kamar;
    let tipeId = await tkamarModel.findOne({
      where: {
        [Op.and]: [{ nama_tipe_kamar: { [Op.substring]: nama_tipe_kamar } }],
      },
    })
  
    let newKamar = {
      nomor_kamar: request.body.nomor_kamar,
      id_tipe_kamar: tipeId.id,
    }

    let idKamar=request.params.id
    kamarModel
        .update(newKamar, { where: { id: idKamar } })
        .then((result) => {
            return response.json({
                success: true,
                message: `Data kamar has been update`,
            })
        })
        .catch((error) => {
            return response.json({
                success: false,
                message: error.message,
            })
        })
}

exports.deleteKamar = (request, response) => {
    let idKamar = request.params.id
    kamarModel.destroy({ where: { id: idKamar } })
        .then(result => {
            return response.json({
                success: true,
                message: `Data Kamar has been deleted`
            })
        })
        .catch(error => {
            return response.json({
                success: false,
                message: error.message
            })
        })
}