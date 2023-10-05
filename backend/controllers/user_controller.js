const userModel = require(`../models/index`).user
const Op = require(`sequelize`).Op
const upload = require(`./upload`).single(`foto`)
const path = require(`path`)
const fs = require(`fs`)
const md5 = require("md5")

const jsonwebtoken = require("jsonwebtoken")
const SECRET_KEY = "secretcode"

exports.getAllUser = async (request, response) => {
    let users = await userModel.findAll()
    return response.json({
        success: true,
        data: users,
        message: `All users have been loaded`
    })
}

exports.findUser = async (request, response) => {
    let nama_user = request.body.nama_user
    let users = await userModel.findAll({
        where: {
            [Op.or]: [
                { nama_user: { [Op.substring]: nama_user } }
            ]
        }
    })
    return response.json({
        success: true,
        data: users,
        message: `All users have been loaded`
    })
}

exports.login = async (request, response) => {
    try {
        const params = {
            email: request.body.email,
            password: md5(request.body.password),
        }

        const findUser = await userModel.findOne({ where: params })
        if (findUser == null) {
            return response.status(404).json({
                message: "email or password doesn't match",
                err: error,
            })
        }
        console.log(findUser)
        let tokenPayload = {
            id_user: findUser.id_customer,
            email: findUser.email,
            role: findUser.role,
        }
        tokenPayload = JSON.stringify(tokenPayload)
        let token = await jsonwebtoken.sign(tokenPayload, SECRET_KEY)

        return response.status(200).json({
            message: "Succes Login",
            data: {
                token: token,
                id_user: findUser.id_user,
                email: findUser.email,
                role: findUser.role,
            }
        })
    } catch (error) {
        console.log(error)
        return response.status(500).json({
            message: "Internal error",
            err: error,
        })
    }
}
       
exports.addUser = (request, response) => {
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

        let newUser = {
            nama_user: request.body.nama_user,
            email: request.body.email,
            password: md5(request.body.password),
            role: request.body.role,
            foto: request.file.filename
        }

        
        userModel.create(newUser)
            .then(result => {
                return response.json({
                    success: true,
                    data: result,
                    message: `New User has been inserted`
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

exports.updateUser = (request, response) => {
    upload(request, response, async error => {
        if (error) {
            return response.json({ message: error })
        }

        let id = request.params.id
        let dataUser = {
            nama_user: request.body.nama_user,
            email: request.body.email,
            password: md5(request.body.password),
            role: request.body.role
        }

        if (request.file) {
            const selectedFoto = await userModel.findOne({
                where: { id: id }
            })
            const oldFoto = selectedFoto.foto
            const pathFoto = path.join(__dirname, `../gambar`, oldFoto)
            if (fs.existsSync(pathFoto)) {
                fs.unlink(pathFoto, error =>
                console.log(error))
            }
            dataUser.foto = request.file.filename
        }
        
        userModel.update(dataUser, { where: { id: id } })
            .then(result => {
                return response.json({
                    success: true,
                    message: `Data user has been updated`
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

exports.deleteUser = async (request, response) => {
    let id = request.params.id
    const user = await userModel.findOne({ where: { id: id } })
    const oldFoto = user.foto
    const pathFoto = path.join(__dirname, '../gambar', oldFoto)

    if (fs.existsSync(pathFoto)) {
        fs.unlink(pathFoto, error => console.log(error))
    }

    userModel.destroy({ where: { id: id } })
        .then(result => {
            return response.json({
                success: true,
                message: 'Data user has been deleted'
            })
        })
        .catch(error => {
            return response.json({
                success: false,
                message: error.message
            })
        })
}