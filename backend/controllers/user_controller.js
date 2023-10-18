const userModel = require(`../models/index`).user
const Op = require(`sequelize`).Op
const upload = require(`./upload_user`).single(`foto`)
const path = require(`path`)
const fs = require(`fs`)
const md5 = require("md5")

const jsonwebtoken = require("jsonwebtoken")
const SECRET_KEY = "secretcode"

exports.login = async (request, response) => {
    try {
        const params = {
            email: request.body.email,
            password: md5(request.body.password),
        };

        const findUser = await userModel.findOne({ where: params });
        if (findUser == null) {
            return response.status(400).json({
                message: "email or password doesn't match"
            });
        }
        console.log(findUser);
        //generate jwt token
        let tokenPayLoad = {
            id: findUser.id,
            email: findUser.email,
            role: findUser.role,
            nama_user: findUser.nama_user,
        };
        tokenPayLoad = JSON.stringify(tokenPayLoad);
        let token = await jsonwebtoken.sign(tokenPayLoad, SECRET_KEY);

        return response.status(200).json({
            message: "Success login",
            data: {
                token: token,
                id: findUser.id,
                nama_user: findUser.nama_user,
                email: findUser.email,
                role: findUser.role,
            },
        });
    } catch (error) {
        console.log(error);
        return response.status(400).json({
            message: error,
        });
    }
}

exports.register = (request, response) => {
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
            role: 'customer',
            foto: request.file.filename
        }


        let user = await userModel.findAll({
            where: {
                [Op.or]: [{ nama_user: newUser.nama_user }, { email: newUser.email }],
            },
        });

        if (
            newUser.nama_user === "" ||
            newUser.email === "" ||
            newUser.password === ""
        ) {
            const oldFotoUser = newUser.foto;
            const patchFoto = path.join(__dirname, `../gambar/user`, oldFotoUser);
            if (fs.existsSync(patchFoto)) {
                fs.unlink(patchFoto, (error) => console.log(error));
            }

            return response.status(400).json({
                success: false,
                message: "Harus diisi semua",
            });
        } else {
            //nama dan email tidak boleh sama
            if (user.length > 0) {
                const oldFotoUser = newUser.foto;
                const patchFoto = path.join(__dirname, `../gambar/user`, oldFotoUser);
                if (fs.existsSync(patchFoto)) {
                    fs.unlink(patchFoto, (error) => console.log(error));
                }
                return response.status(400).json({
                    success: false,
                    message: "Cari nama atau email lain",
                });
            } else {
                console.log(newUser);
                userModel
                    .create(newUser)
                    .then((result) => {
                        return response.json({
                            success: true,
                            data: result,
                            message: `New User has been inserted`,
                        });
                    })
                    .catch((error) => {
                        return response.status(400).json({
                            success: false,
                            message: error.message,
                        });
                    });
            }
        }
    })
}

exports.getAllUser = async (request, response) => {
    let users = await userModel.findAll()
    return response.json({
        success: true,
        data: users,
        message: `All users have been loaded`
    })
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


        let user = await userModel.findAll({
            where: {
                [Op.or]: [{ nama_user: newUser.nama_user }, { email: newUser.email }],
            },
        });

        if (
            newUser.nama_user === "" ||
            newUser.email === "" ||
            newUser.password === "" ||
            newUser.role === ""
        ) {
            const oldFotoUser = newUser.foto;
            const patchFoto = path.join(__dirname, `../gambar/user`, oldFotoUser);
            if (fs.existsSync(patchFoto)) {
                fs.unlink(patchFoto, (error) => console.log(error));
            }

            return response.status(400).json({
                success: false,
                message: "Harus diisi semua",
            });
        } else {
            //nama dan email tidak boleh sama
            if (user.length > 0) {
                const oldFotoUser = newUser.foto;
                const patchFoto = path.join(__dirname, `../gambar/user`, oldFotoUser);
                if (fs.existsSync(patchFoto)) {
                    fs.unlink(patchFoto, (error) => console.log(error));
                }
                return response.status(400).json({
                    success: false,
                    message: "Cari nama atau email lain",
                });
            } else {
                console.log(newUser);
                userModel
                    .create(newUser)
                    .then((result) => {
                        return response.json({
                            success: true,
                            data: result,
                            message: `New User has been inserted`,
                        });
                    })
                    .catch((error) => {
                        return response.status(400).json({
                            success: false,
                            message: error.message,
                        });
                    });
            }
        }
    })
}

exports.updateUser = (request, response) => {
    upload(request, response, async error => {
        if (error) {
            return response.json({ message: error })
        }

        let id = request.params.id

        let getId = await userModel.findAll({
            where: {
                [Op.and]: [{ id: id }],
            },
        });

        if (getId.length === 0) {
            return response.status(400).json({
                success: false,
                message: "User dengan id tersebut tidak ada",
            });
        }

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
            const pathFoto = path.join(__dirname, `../gambar/user`, oldFoto)
            if (fs.existsSync(pathFoto)) {
                fs.unlink(pathFoto, error =>
                    console.log(error))
            }
            dataUser.foto = request.file.filename
        }

        let user = await userModel.findAll({
            where: {
                [Op.or]: [{ nama_user: dataUser.nama_user }, { email: dataUser.email }],
            },
        });
        if (
            dataUser.nama_user === "" ||
            dataUser.email === "" ||
            dataUser.password === "" ||
            dataUser.role === ""
        ) {
            const oldFotoUser = dataUser.foto;
            const patchFoto = path.join(__dirname, `../gambar/user`, oldFotoUser);
            if (fs.existsSync(patchFoto)) {
                fs.unlink(patchFoto, (error) => console.log(error));
            }

            return response.status(400).json({
                success: false,
                message: "Harus diisi semua",
            });
        } else {

            if (user.length > 0) {
                const oldFotoUser = dataUser.foto;
                const patchFoto = path.join(__dirname, `../gambar/user`, oldFotoUser);
                if (fs.existsSync(patchFoto)) {
                    fs.unlink(patchFoto, (error) => console.log(error));
                }
                return response.status(400).json({
                    success: false,
                    message: "Cari nama atau email lain",
                });
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
        }
    })
}

exports.deleteUser = async (request, response) => {
    let id = request.params.id

    let getId = await userModel.findAll({
        where: {
            [Op.and]: [{ id: id }],
        },
    });

    if (getId.length === 0) {
        return response.status(400).json({
            success: false,
            message: "User dengan id tersebut tidak ada",
        });
    }

    const user = await userModel.findOne({ where: { id: id } })
    const oldFoto = user.foto
    const pathFoto = path.join(__dirname, '../gambar/user', oldFoto)

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