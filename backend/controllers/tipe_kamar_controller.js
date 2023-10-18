const tkamarModel = require(`../models/index`).tipe_kamar
const Op = require(`sequelize`).Op
const upload = require(`./upload_tipekamar`).single(`foto`)
const path = require(`path`)
const fs = require(`fs`)

exports.getAllTkamar = async (request, response) => {
    let tkamars = await tkamarModel.findAll()
    return response.json({
        success: true,
        data: tkamars,
        message: `All tipe kamar have been loaded`
    })
}

exports.addTkamar = (request, response) => {
    upload(request, response, async error => {
        if (error) {
            return response.json({
                message: error
            })
        }
        if (!request.file) {
            return response.json({
                message: `Nothing to Upload`
            })
        }

        let newTkamar = {
            nama_tipe_kamar: request.body.nama_tipe_kamar,
            harga: request.body.harga,
            deskripsi: request.body.deskripsi,
            foto: request.file.filename
        }

        let tipe = await tkamarModel.findAll({
            where: {
                [Op.or]: [{ nama_tipe_kamar: newTkamar.nama_tipe_kamar }],
            },
        });

        if (
            newTkamar.nama_tipe_kamar === "" ||
            newTkamar.harga === "" ||
            newTkamar.deskripsi === ""
        ) {
            const oldFotoUser = newTkamar.foto;
            const patchFoto = path.join(__dirname, `../gambar/tipe_kamar`, oldFotoUser);
            if (fs.existsSync(patchFoto)) {
                fs.unlink(patchFoto, (error) => console.log(error));
            }

            return response.status(400).json({
                success: false,
                message: "Harus diisi semua",
            });
        } else {

            if (tipe.length > 0) {
                const oldFotoUser = newTkamar.foto;
                const patchFoto = path.join(__dirname, `../gambar/tipe_kamar`, oldFotoUser);
                if (fs.existsSync(patchFoto)) {
                    fs.unlink(patchFoto, (error) => console.log(error));
                }
                return response.status(400).json({
                    success: false,
                    message: "Cari nama tipe kamar lain",
                });
            }
            tkamarModel.create(newTkamar)
                .then(result => {
                    return response.json({
                        success: true,
                        data: result,
                        message: `New Tipe Kamar has been inserted`
                    })
                })
                .catch(error => {
                    return response.json({
                        success: false,
                        message: error.message
                    })
                })
        }
    })
}

exports.updateTkamar = (request, response) => {
    upload(request, response, async error => {
        if (error) {
            return response.json({ message: error })
        }

        let id = request.params.id

        let getId = await tkamarModel.findAll({
            where: {
                [Op.and]: [{ id: id }],
            },
        });

        if (getId.length === 0) {
            return response.status(400).json({
                success: false,
                message: "Tipe Kamar dengan id tersebut tidak ada",
            });
        }
        let dataTkamar = {
            nama_tipe_kamar: request.body.nama_tipe_kamar,
            harga: request.body.harga,
            deskripsi: request.body.deskripsi
        }

        if (request.file) {
            const selectedFoto = await tkamarModel.findOne({
                where: { id: id }
            })
            const oldFoto = selectedFoto.foto
            const pathFoto = path.join(__dirname, `../gambar/tipe_kamar`, oldFoto)
            if (fs.existsSync(pathFoto)) {
                fs.unlink(pathFoto, error =>
                    console.log(error))
            }
            dataTkamar.foto = request.file.filename
        }

        let tipe = await tkamarModel.findAll({
            where: {
                [Op.or]: [{ nama_tipe_kamar: dataTkamar.nama_tipe_kamar }],
            },
        });

        if (
            dataTkamar.nama_tipe_kamar === "" ||
            dataTkamar.harga === "" ||
            dataTkamar.deskripsi === ""
        ) {
            const oldFotoUser = dataTkamar.foto;
            const patchFoto = path.join(__dirname, `../gambar/tipe_kamar`, oldFotoUser);
            if (fs.existsSync(patchFoto)) {
                fs.unlink(patchFoto, (error) => console.log(error));
            }

            return response.status(400).json({
                success: false,
                message: "Harus diisi semua",
            });
        } else {

            if (tipe.length > 0) {
                const oldFotoUser = dataTkamar.foto;
                const patchFoto = path.join(__dirname, `../gambar/tipe_kamar`, oldFotoUser);
                if (fs.existsSync(patchFoto)) {
                    fs.unlink(patchFoto, (error) => console.log(error));
                }
                return response.status(400).json({
                    success: false,
                    message: "Cari nama tipe kamar lain",
                });
            }

        tkamarModel.update(dataTkamar, { where: { id: id } })
            .then(result => {
                return response.json({
                    success: true,
                    message: `Data tipe kamar has been updated`
                })
            })
            .catch(error => {
                return response.json({
                    success: false,
                    message: error.message
                })
            })
        }
    })
}

exports.deleteTkamar = async (request, response) => {
    let id = request.params.id

    let getId = await tkamarModel.findAll({
        where: {
            [Op.and]: [{ id: id }],
        },
    });

    if (getId.length === 0) {
        return response.status(400).json({
            success: false,
            message: "Tipe Kamar dengan id tersebut tidak ada",
        });
    }

    const tkamar = await tkamarModel.findOne({ where: { id: id } })
    const oldFoto = tkamar.foto
    const pathFoto = path.join(__dirname, '../gambar/tipe_kamar', oldFoto)

    if (fs.existsSync(pathFoto)) {
        fs.unlink(pathFoto, error => console.log(error))
    }

    tkamarModel.destroy({ where: { id: id } })
        .then(result => {
            return response.json({
                success: true,
                message: 'Data tipe kamar has been deleted'
            })
        })
        .catch(error => {
            return response.json({
                success: false,
                message: error.message
            })
        })
}