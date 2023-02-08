const pemesananModel = require(`../models/index`).pemesanan
const detailpemesananModel = require(`../models/index`).detail_pemesanan
const tkamarModel = require(`../models/index`).tipe_kamar
const userModel = require(`../models/index`).user
const Op = require(`sequelize`).Op

const Sequelize = require("sequelize");
const sequelize = new Sequelize("hotel", "root", "", {
  host: "localhost",
  dialect: "mysql",
})

exports.getAllPemesanan = async (request, response) => { 
    const data = await sequelize.query(
        "SELECT pemesanans.*,users.*,tipe_kamars.*,kamars.*, detail_pemesanans.* from pemesanans JOIN users ON pemesanans.id_user=users.id JOIN tipe_kamars ON pemesanans.id_tipe_kamar=tipe_kamars.id JOIN detail_pemesanans ON pemesanans.id=detail_pemesanans.id_pemesanan JOIN kamars ON detail_pemesanans.id_kamar=kamars.id"
      )
    return response.json({
        success: true,
        data: data,
        message: `All pemesanan have been loaded`
    })
}

exports.findPemesanan = async (request, response) => { 
    let nomor_pemesanan= request.body.nomor_pemesanan

    const data = await sequelize.query(
        `SELECT pemesanans.*,users.*,tipe_kamars.*,kamars.*, detail_pemesanans.* from pemesanans JOIN users ON pemesanans.id_user=users.id JOIN tipe_kamars ON pemesanans.id_tipe_kamar=tipe_kamars.id JOIN detail_pemesanans ON pemesanans.id=detail_pemesanans.id_pemesanan JOIN kamars ON detail_pemesanans.id_kamar=kamars.id where pemesanans.nomor_pemesanan= ${nomor_pemesanan} ORDER BY pemesanans.id ASC`
      )
    return response.json({
        success: true,
        data: data,
        message: `All pemesanan have been loaded`
    })
}

exports.addPemesanan = async (request, response) => {
    let nama_tipe_kamar = request.body.nama_tipe_kamar;
    let nama_user = request.body.nama_user;
    let tipeId = await tkamarModel.findOne({
        where: {
        [Op.and]: [{ nama_tipe_kamar: { [Op.substring]: nama_tipe_kamar } }],
        },
    })
    let userId = await userModel.findOne({
        where: {
        [Op.and]: [{ nama_user: { [Op.substring]: nama_user } }],
        },
    })

    let newPemesanan = {
        nomor_pemesanan: request.body.nomor_pemesanan,
        nama_pemesanan: request.body.nama_pemesanan,
        email_pemesanan: request.body.email_pemesanan,
        tgl_pemesanan: request.body.tgl_pemesanan,
        tgl_check_in: request.body.tgl_check_in,
        tgl_check_out: request.body.tgl_check_out,
        nama_tamu: request.body.nama_tamu,
        jumlah_kamar: request.body.jumlah_kamar,
        id_tipe_kamar: tipeId.id,
        status_pemesanan: request.body.status_pemesanan,
        id_user: userId.id
    }

    pemesananModel
        .create(newPemesanan)
        .then((result) => {
            let id_pemesanan = result.id
            let detailsPemesanan = request.body.detailsPemesanan
            for (let i = 0; i < detailsPemesanan.length; i++) {
                detailsPemesanan[i].id_pemesanan = id_pemesanan
            }

            detailpemesananModel.bulkCreate(detailsPemesanan)    
            .then(result => {
                return response.json({
                    success: true,
                    message: `New Pemesanan has been inserted`
                })
            })
            .catch(error => {
                return response.json({
                    success: false,
                    message: error.message
                })
            })
        })
        .catch((error) => {
            return response.json({
                success: false,
                message: error.message,
            })
        })
}

exports.updatePemesanan = async (request, response) => {
    let nama_tipe_kamar = request.body.nama_tipe_kamar;
    let nama_user = request.body.nama_user;
    let tipeId = await tkamarModel.findOne({
        where: {
        [Op.and]: [{ nama_tipe_kamar: { [Op.substring]: nama_tipe_kamar } }],
        },
    })
    let userId = await userModel.findOne({
        where: {
        [Op.and]: [{ nama_user: { [Op.substring]: nama_user } }],
        },
    })

    let newData = {
        nomor_pemesanan: request.body.nomor_pemesanan,
        nama_pemesanan: request.body.nama_pemesanan,
        email_pemesanan: request.body.email_pemesanan,
        tgl_pemesanan: request.body.tgl_pemesanan,
        tgl_check_in: request.body.tgl_check_in,
        tgl_check_out: request.body.tgl_check_out,
        nama_tamu: request.body.nama_tamu,
        jumlah_kamar: request.body.jumlah_kamar,
        id_tipe_kamar: tipeId.id,
        status_pemesanan: request.body.status_pemesanan,
        id_user: userId.id
    }

    let id_pemesanan = request.params.id
    pemesananModel.update(newData, { where: { id: id_pemesanan } })
        .then(async result => {
            await detailpemesananModel.destroy(
                { where: { id_pemesanan: id_pemesanan } }
            )

            let detailsPemesanan = request.body.detailspemesanan
            for (let i = 0; i < detailsPemesanan.length; i++) {
                detailsPemesanan[i].id_pemesanan = id_pemesanan
            }

            detailpemesananModel.bulkCreate(detailsPemesanan)
                .then(result => {
                    return response.json({
                        success: true,
                        message: `Pemesanan has been updated`
                    })
                })
                .catch(error => {
                    return response.json({
                        success: false,
                        message: error.message
                    })
                })
        })
        .catch(error => {
            return response.json({
                success: false,
                message: error.message
            })
        })
}

exports.deletePemesanan = async (request, response) => {
    let id_pemesanan = request.params.id
    detailpemesananModel.destroy(
        { where: { id_pemesanan: id_pemesanan } }
    )

    .then(result => {
        pemesananModel.destroy({ where: { id: id_pemesanan } })

        .then(result => {
            return response.json({
                success: true,
                message: `Pemesanan's has deleted`
            })
        })
        .catch(error => {
            return response.json({
                success: false,
                message: error.message
            })
        })
    })
    .catch(error => {
        return response.json({
            success: false,
            message: error.message
        })
    })
}