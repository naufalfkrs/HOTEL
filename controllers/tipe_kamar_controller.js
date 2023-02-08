const tkamarModel = require(`../models/index`).tipe_kamar
const Op = require(`sequelize`).Op
const upload = require(`./upload`).single(`foto`)
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

exports.findTkamar = async (request, response) => {
    let nama_tipe_kamar = request.body.nama_tipe_kamar
    let tkamars = await tkamarModel.findAll({
        where: {
            [Op.or]: [
                { nama_tipe_kamar: { [Op.substring]: nama_tipe_kamar } }
            ]
        }
    })
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
    })        
}

exports.updateTkamar = (request, response) => {
    upload(request, response, async error => {
        if (error) {
            return response.json({ message: error })
        }

        let id = request.params.id
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
            const pathFoto = path.join(__dirname, `../gambar`, oldFoto)
            if (fs.existsSync(pathFoto)) {
                fs.unlink(pathFoto, error =>
                console.log(error))
            }
            dataTkamar.foto = request.file.filename
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
    })
} 

exports.deleteTkamar = async (request, response) => {
    let id = request.params.id
    const tkamar = await tkamarModel.findOne({ where: { id: id } })
    const oldFoto = tkamar.foto
    const pathFoto = path.join(__dirname, '../gambar', oldFoto)

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