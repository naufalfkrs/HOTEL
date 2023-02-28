const kamarModel = require(`../models/index`).kamar
const tkamarModel = require(`../models/index`).tipe_kamar
const Op = require(`sequelize`).Op
const moment = require(`moment`)

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
    const tgl_akses_satu = new Date (request.body.tgl_akses_satu);
    const tgl_akses_dua = new Date (request.body.tgl_akses_dua);
    let tgl1 = moment(tgl_akses_satu).format("YYYY-MM-DD");
    let tgl2 = moment(tgl_akses_dua).format("YYYY-MM-DD");
  
    const result = await sequelize.query(
      `SELECT tipe_kamars.nama_tipe_kamar, kamars.nomor_kamar FROM kamars LEFT JOIN tipe_kamars ON kamars.id_tipe_kamar = tipe_kamars.id LEFT JOIN detail_pemesanans ON detail_pemesanans.id_kamar = kamars.id WHERE kamars.id NOT IN (SELECT id_kamar from detail_pemesanans WHERE tgl_akses BETWEEN '${tgl1}' AND '${tgl2}') GROUP BY kamars.nomor_kamar`
    );
  
    return response.json({
      success: true,
      sisa_kamar: result[0].length,
      data: result[0],
      message: `Room have been loaded`,
    });
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