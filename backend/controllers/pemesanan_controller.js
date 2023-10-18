const pemesananModel = require(`../models/index`).pemesanan
const detailpemesananModel = require(`../models/index`).detail_pemesanan
const kamarModel = require(`../models/index`).kamar
const tkamarModel = require(`../models/index`).tipe_kamar
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
    "SELECT pemesanans.*, users.nama_user, tipe_kamars.nama_tipe_kamar, detail_pemesanans.harga from pemesanans JOIN users ON pemesanans.id_user=users.id JOIN tipe_kamars ON pemesanans.id_tipe_kamar=tipe_kamars.id JOIN detail_pemesanans ON pemesanans.id=detail_pemesanans.id_pemesanan GROUP BY pemesanans.id ORDER BY pemesanans.id DESC"
  )

  return response.json({
    success: true,
    data: data[0],
    message: `All pemesanan have been loaded`
  })
}

exports.getPemesananByName = async (request, response) => {
  let nama_tamu = request.body.nama_tamu
  let getId = await pemesananModel.findAll({
    where: {
      [Op.and]: [{ nama_tamu: nama_tamu }],
    }, attributes: ["id", "nomor_pemesanan", "nama_pemesanan", "email_pemesanan", "tgl_pemesanan", "tgl_check_in", "tgl_check_out", "nama_tamu", "jumlah_kamar", "id_tipe_kamar", "status_pemesanan", "id_user", "createdAt", "updatedAt"],
  });

  if (getId.length === 0) {
    return response.status(400).json({
      success: false,
      message: "Pemesanan dengan nama tamu tersebut tidak ada",
    });
  }

  const data = await sequelize.query(
    `SELECT pemesanans.*, users.nama_user, tipe_kamars.nama_tipe_kamar, detail_pemesanans.harga from pemesanans JOIN users ON pemesanans.id_user=users.id JOIN tipe_kamars ON pemesanans.id_tipe_kamar=tipe_kamars.id JOIN detail_pemesanans ON pemesanans.id=detail_pemesanans.id_pemesanan where pemesanans.nama_tamu = "${nama_tamu}" GROUP BY pemesanans.id ORDER BY pemesanans.id DESC`
  )
  return response.json({
    success: true,
    data: data[0],
    message: `All pemesanan have been loaded`
  })
}

exports.getPemesananByTglCheckIn = async (request, response) => {
  const tgl_check_in = new Date(request.body.check_in);
  let checkin = moment(tgl_check_in).format("YYYY-MM-DD");
  // let checkin = request.body.check_in

  let getId = await pemesananModel.findAll({
    where: {
      [Op.and]: [{ tgl_check_in: checkin }],
    }, attributes: ["id", "nomor_pemesanan", "nama_pemesanan", "email_pemesanan", "tgl_pemesanan", "tgl_check_in", "tgl_check_out", "nama_tamu", "jumlah_kamar", "id_tipe_kamar", "status_pemesanan", "id_user", "createdAt", "updatedAt"],
  });

  if (getId.length === 0) {
    return response.status(400).json({
      success: false,
      message: `Pemesanan dengan tanggal tersebut tidak ada`,
    });
  }

  const data = await sequelize.query(
    `SELECT pemesanans.*, users.nama_user, tipe_kamars.nama_tipe_kamar, detail_pemesanans.harga from pemesanans JOIN users ON pemesanans.id_user=users.id JOIN tipe_kamars ON pemesanans.id_tipe_kamar=tipe_kamars.id JOIN detail_pemesanans ON pemesanans.id=detail_pemesanans.id_pemesanan where pemesanans.tgl_check_in = '${checkin}' GROUP BY pemesanans.id ORDER BY pemesanans.id DESC`
  )
  return response.json({
    success: true,
    data: data[0],
    message: `All pemesanan have been loaded`
  })
}

exports.getPemesananById = async (request, response) => {
  let id_user = request.params.id_user
  let getId = await pemesananModel.findAll({
    where: {
      [Op.and]: [{ id_user: id_user }],
    }, attributes: ["id", "nomor_pemesanan", "nama_pemesanan", "email_pemesanan", "tgl_pemesanan", "tgl_check_in", "tgl_check_out", "nama_tamu", "jumlah_kamar", "id_tipe_kamar", "status_pemesanan", "id_user", "createdAt", "updatedAt"],
  });

  if (getId.length === 0) {
    return response.status(400).json({
      success: false,
      message: "Pemesanan dengan user tersebut tidak ada",
    });
  }

  const data = await sequelize.query(
    `SELECT pemesanans.*, users.nama_user, tipe_kamars.nama_tipe_kamar, detail_pemesanans.harga from pemesanans JOIN users ON pemesanans.id_user=users.id JOIN tipe_kamars ON pemesanans.id_tipe_kamar=tipe_kamars.id JOIN detail_pemesanans ON pemesanans.id=detail_pemesanans.id_pemesanan where pemesanans.id_user= ${id_user} GROUP BY pemesanans.id ORDER BY pemesanans.id DESC`
  )
  return response.json({
    success: true,
    data: data[0],
    message: `All pemesanan have been loaded`
  })
}

exports.getPemesananByNomor = async (request, response) => {
  let nomor_pemesanan = request.body.nomor_pemesanan

  const data = await sequelize.query(
    `SELECT pemesanans.*, users.nama_user, tipe_kamars.nama_tipe_kamar, detail_pemesanans.harga from pemesanans JOIN users ON pemesanans.id_user=users.id JOIN tipe_kamars ON pemesanans.id_tipe_kamar=tipe_kamars.id JOIN detail_pemesanans ON pemesanans.id=detail_pemesanans.id_pemesanan where pemesanans.nomor_pemesanan = ${nomor_pemesanan} GROUP BY pemesanans.id ORDER BY pemesanans.id DESC`
  )
  return response.json({
    success: true,
    data: data[0],
    message: `All pemesanan have been loaded`
  })
}

exports.addPemesanan = async (request, response) => {
  const nama_tipe_kamar = request.body.nama_tipe_kamar;
  const nama_user = request.body.nama_user;

  try {
    // Find the 'tipe' based on 'tipe_kamar'
    const tipe = await tkamarModel.findOne({
      where: {
        nama_tipe_kamar: {
          [Op.substring]: nama_tipe_kamar,
        },
      },
    });

    if (tipe === null) {
      return response.status(404).json({
        success: false,
        message: `Tipe Kamar ${nama_tipe_kamar} tidak ditemukan`,
      });
    }
    // console.log("tipe object:", tipe);
    console.log("tipe.id:", tipe.id);

    // const tgl_check_in = new Date(request.body.tgl_check_in);
    // const tgl_check_out = new Date(request.body.tgl_check_out);
    // let checkin = moment(tgl_check_in).format("YYYY-MM-DD");
    // let checkout = moment(tgl_check_out).format("YYYY-MM-DD");
    // if (checkin = checkout) {
    //   return response.status(404).json({
    //     success: false,
    //     message: `Tanggal check out tidak boleh sama dengan tanggal check in`,
    //   });
    // } else if(checkout < checkin){
    //   return response.status(404).json({
    //     success: false,
    //     message: `Tanggal check out tidak boleh kurang dari tanggal check in`,
    //   });
    // }

    // Check for booked rooms within the specified date range
    const bookedRooms = await sequelize.query(
      `SELECT id_kamar FROM detail_pemesanans WHERE tgl_akses BETWEEN "${request.body.tgl_check_in}" AND "${request.body.tgl_check_out}"`
    );
    const bookedRoomIds = bookedRooms[0].map((row) => row.id_kamar);

    // Find available rooms for the specified 'tipe_kamar'
    const rooms = await kamarModel.findAll({
      where: {
        id_tipe_kamar: tipe.id,
        id: {
          [Op.notIn]: bookedRoomIds,
        },
      },
      attributes: ['id', 'nomor_kamar', 'id_tipe_kamar', 'createdAt', 'updatedAt'],
    });



    // Find the user based on 'nama_user'
console.log(nama_user, " nama use")

    const user = await userModel.findOne({
      where: {
        nama_user: {
          [Op.substring]: nama_user,
        },
      },
    });
    if (rooms.length === 0) {
      return response.json({
        success: false,
        message: `Waduh Habis Sam Kamarnya`,
      });
    } else if (user === null) {
      return response.json({
        success: false,
        message: `User yang anda inputkan tidak ditemukan`,
      });
    } else {
      const date = moment();
      const tgl = date.format('YYYY-MM-DD');
      let numberRandom = Math.floor(
        Math.random() * (10000000 - 99999999) + 99999999
      );
      // const tgl_pesan = ${tgl}-${randomString};
      const today = new Date();


      const newData = {
        nomor_pemesanan: numberRandom,
        nama_pemesanan: request.body.nama_pemesanan,
        email_pemesanan: request.body.email_pemesanan,
        tgl_pemesanan: today,
        tgl_check_in: request.body.tgl_check_in,
        tgl_check_out: request.body.tgl_check_out,
        nama_tamu: request.body.nama_tamu,
        jumlah_kamar: request.body.jumlah_kamar,
        id_tipe_kamar: tipe.id,
        status_pemesanan: 'baru',
        id_user: user.id,
      };

      // Check if the room is already booked on 'tgl_check_in'
      const roomCheck = await sequelize.query(
        `SELECT * FROM detail_pemesanans WHERE id_kamar = '${newData.id_tipe_kamar}' AND tgl_akses= "${request.body.tgl_check_in}"`
      );

      if (roomCheck[0].length === 0) {
        let success = true;
        let message = '';

        const availableRooms = rooms.slice(0, newData.jumlah_kamar);

        if (availableRooms.length < newData.jumlah_kamar) {
          return response.json({
            success: false,
            message: `Hanya Wonten ${availableRooms.length} kamar for tipe kamar ${tipe_kamar}`,
          });
        }

        // Create a new pemesanan
        const result = await pemesananModel.create(newData);

        const pemesananID = result.id;
        const detail_pemesanan = tipe.harga;

        const tgl_check_in = moment(request.body.tgl_check_in, 'YYYY-MM-DD');
        const tgl_check_out = moment(request.body.tgl_check_out, 'YYYY-MM-DD');
        const totalDays = tgl_check_out.diff(tgl_check_in, 'days');

        const totalHarga = tipe.harga * newData.jumlah_kamar * totalDays;

        // Create detail_pemesanan entries for each day and room
        for (
          let m = moment(newData.tgl_check_in, 'YYYY-MM-DD');
          m.isBefore(newData.tgl_check_out);
          m.add(1, 'days')
        ) {
          const date = m.format('YYYY-MM-DD');

          for (let i = 0; i < availableRooms.length; i++) {
            const roomNumber =
              availableRooms.length > 1
                ? `${availableRooms[i].nomor_kamar}-${m.diff(
                  moment(request.body.tgl_check_in, 'YYYY-MM-DD'),
                  'days'
                ) + 1}`
                : availableRooms[i].nomor_kamar;

            const newDetail = {
              id_pemesanan: pemesananID,
              id_kamar: availableRooms[i].id,
              tgl_akses: date,
              harga: totalHarga,
              nomor_kamar: roomNumber,
            };

            await detailpemesananModel
              .create(newDetail)
              .catch((error) => {
                success = false;
                message = error.message;
              });
          }
        }

        if (success) {
          return response.json({
            success: numberRandom,
            message: 'New transactions',
            nomor_pemesanan: numberRandom,
          });
        } else {
          return response.json({
            success: false,
            message: message,
            nomor_pemesanan: null,
          });
        }
      } else {
        return response.json({
          success: false,
          message: 'Kamar yang akan dipesan sudah di booking',
        });
      }
    }
  } catch (error) {
    return response.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.updatePemesanan = async (request, response) => {

  let newPemesanan = {
    status_pemesanan: request.body.status_pemesanan,
  }

  let IdPemesanan = request.params.id

  let getId = await pemesananModel.findAll({
    where: {
      [Op.and]: [{ id: IdPemesanan }],
    }, attributes: ["id", "nomor_pemesanan", "nama_pemesanan", "email_pemesanan", "tgl_pemesanan", "tgl_check_in", "tgl_check_out", "nama_tamu", "jumlah_kamar", "id_tipe_kamar", "status_pemesanan", "id_user", "createdAt", "updatedAt"],
  });

  if (getId.length === 0) {
    return response.status(400).json({
      success: false,
      message: "Pemesanan dengan id tersebut tidak ada",
    });
  }

  pemesananModel
    .update(newPemesanan, { where: { id: IdPemesanan } })
    .then((result) => {
      return response.json({
        success: true,
        message: `Status Pemesanan has been update`,
      })
    })
    .catch((error) => {
      return response.json({
        success: false,
        message: error.message,
      })
    })

}