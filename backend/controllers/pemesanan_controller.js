const pemesananModel = require(`../models/index`).pemesanan
const detailpemesananModel = require(`../models/index`).detail_pemesanan
const kamarModel = require(`../models/index`).kamar
const userModel = require(`../models/index`).user
const Op = require(`sequelize`).Op
const moment = require(`moment`)

const Sequelize = require("sequelize");
const sequelize = new Sequelize("hotel", "root", "", {
  host: "localhost",
  dialect: "mysql",
})

exports.getAllPemesanan = async (request, response) => { 
    const data = await sequelize.query(
        "SELECT pemesanans.*,users.*,tipe_kamars.* from pemesanans JOIN users ON pemesanans.id_user=users.id JOIN tipe_kamars ON pemesanans.id_tipe_kamar=tipe_kamars.id "
      )
    return response.json({
        success: true,
        data: data[0],
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
    let nomor_kamar = request.body.nomor_kamar;
    let room = await kamarModel.findOne({
      where: {
        [Op.and]: [{ nomor_kamar: { [Op.substring]: nomor_kamar } }],
      },
      attributes: [
        "id",
        "nomor_kamar",
        "id_tipe_kamar",
        "createdAt",
        "updatedAt",
      ],
    });
    let nama_user = request.body.nama_user;
    let userId = await userModel.findOne({
        where: {
        [Op.and]: [{ nama_user: { [Op.substring]: nama_user } }],
        },
    })

    if (room === null) {
        return response.json({
          success: false,
          message: `Kamar yang anda inputkan tidak ada`,
        });
    } else if (userId === null) {
        return response.json({
            success: false,
            message: `User yang anda inputkan tidak ada`,
        });
    } else {
        let newPemesanan = {
            nomor_pemesanan: request.body.nomor_pemesanan,
            nama_pemesanan: request.body.nama_pemesanan,
            email_pemesanan: request.body.email_pemesanan,
            tgl_pemesanan: request.body.tgl_pemesanan,
            tgl_check_in: request.body.tgl_check_in,
            tgl_check_out: request.body.tgl_check_out,
            nama_tamu: request.body.nama_tamu,
            jumlah_kamar: request.body.jumlah_kamar,
            id_tipe_kamar: room.id_tipe_kamar,
            status_pemesanan: "baru",
            id_user: userId.id
        }

        let roomCheck = await sequelize.query(
            `SELECT * FROM detail_pemesanans WHERE id_kamar = ${room.id} AND tgl_akses= "${request.body.tgl_check_in}" ;`
        );

        if (roomCheck[0].length === 0) {
            pemesananModel
            .create(newPemesanan)
            .then((result) => {
                let id_pemesanan = result.id
                let detailsPemesanan = request.body.detailsPemesanan
                for (let i = 0; i < detailsPemesanan.length; i++) {
                    detailsPemesanan[i].id_pemesanan = id_pemesanan
                }

                let tgl1 = new Date(request.body.tgl_check_in);
                let tgl2 = new Date(request.body.tgl_check_out);
                let checkIn = moment(tgl1).format("YYYY-MM-DD");
                let checkOut = moment(tgl2).format("YYYY-MM-DD");

                if (
                    !moment(checkIn, "YYYY-MM-DD").isValid() ||
                    !moment(checkOut, "YYYY-MM-DD").isValid()
                ) {
                    return response
                        .status(400)
                        .send({ message: "Invalid date format" });
                }

                let success = true;
                let message = '';

                for (
                    let m = moment(checkIn, "YYYY-MM-DD");
                    m.isBefore(checkOut);
                    m.add(1, "days")
                ) {
                    let date = m.format("YYYY-MM-DD");
                    let newDetail = {
                    id_pemesanan: id_pemesanan,
                    id_kamar: room.id,
                    tgl_akses: date,
                    harga: detailsPemesanan[0].harga,
                    };
                    detailpemesananModel
                    .create(newDetail)
                    .catch((error) => {
                        success = false;
                        message = error.message;
                    });
                }
                
                if (success) {
                    return response.json({
                        success: true,
                        message: `New transactions have been inserted`,
                    });
                    } else {
                    return response.json({
                        success: false,
                        message: message,
                    });
                }
            })
            .catch((error) => {
                return response.json({
                    success: false,
                    message: error.message,
                })
            })
        } else {
            return response.json({
                success: false,
                message: `Kamar yang anda pesan sudah di booking`,
            });
        }
    }    
}

exports.updatePemesanan = async (request, response) => {
    let nomor_kamar = request.body.nomor_kamar;
    let room = await kamarModel.findOne({
      where: {
        [Op.and]: [{ nomor_kamar: { [Op.substring]: nomor_kamar } }],
      },
      attributes: [
        "id",
        "nomor_kamar",
        "id_tipe_kamar",
        "createdAt",
        "updatedAt",
      ],
    });
  
    let nama_user = request.body.nama_user;
    let userId = await userModel.findOne({
      where: {
        [Op.and]: [{ nama_user: { [Op.substring]: nama_user } }],
      },
    });
  
    let newData = {
        nomor_pemesanan: request.body.nomor_pemesanan,
        nama_pemesanan: request.body.nama_pemesanan,
        email_pemesanan: request.body.email_pemesanan,
        tgl_pemesanan: request.body.tgl_pemesanan,
        tgl_check_in: request.body.tgl_check_in,
        tgl_check_out: request.body.tgl_check_out,
        nama_tamu: request.body.nama_tamu,
        jumlah_kamar: request.body.jumlah_kamar,
        id_tipe_kamar: room.id_tipe_kamar,
        status_pemesanan: request.body.status_pemesanan,
        id_user: userId.id
    };
  
    let id_pemesanan = request.params.id;
  
    pemesananModel
      .update(newData, { where: { id: id_pemesanan } })
      .then(async (result) => {
        await detailpemesananModel.destroy({
          where: { id_pemesanan: id_pemesanan },
        });
  
        let detailsPemesanan = request.body.detailsPemesanan; 
        for (let i = 0; i < detailsPemesanan.length; i++) {
          detailsPemesanan[i].id_pemesanan = id_pemesanan;
        }
  
        let tgl1 = new Date(request.body.tgl_check_in);
        let tgl2 = new Date(request.body.tgl_check_out);
        let checkIn = moment(tgl1).format("YYYY-MM-DD");
        let checkOut = moment(tgl2).format("YYYY-MM-DD");
  
        // check if the dates are valid
        if (
          !moment(checkIn, "YYYY-MM-DD").isValid() ||
          !moment(checkOut, "YYYY-MM-DD").isValid()
        ) {
          return response
            .status(400)
            .send({ message: "Invalid date format" });
        }
  
        let success = true;
        let message = '';
        
        for (
          let m = moment(checkIn, "YYYY-MM-DD");
          m.isBefore(checkOut);
          m.add(1, "days")
        ) {
          let date = m.format("YYYY-MM-DD");
          let newDetail = {
            id_pemesanan: id_pemesanan,
            id_kamar: room.id,
            tgl_akses: date,
            harga: detailsPemesanan[0].harga,
          };
          detailpemesananModel
            .create(newDetail)
            .catch((error) => {
              success = false;
              message = error.message;
            });
        }
        
        if (success) {
          return response.json({
            success: true,
            message: `New transactions have been inserted`,
          });
        } else {
          return response.json({
            success: false,
            message: message,
          });
        }
  })          
      .catch((error) => {
        return response.json({
          success: false,
          message: error.message,
        });
      });
}
