const db = require('../../../db').get()
const bcrypt = require("bcryptjs")

exports.register = (req, res, callback)=> {
    const loginPattern = new RegExp(/^[a-z0-9_-]{5,16}$/)
    const passwordPattern = new RegExp(/^[a-z0-9_-]{5,16}$/)

    const { login, password, repassword } = req.body
    let errors = []
    if (!loginPattern.test(login)) {
        errors.push("Ошибка ввода логина")
    }
    if (!passwordPattern.test(password) || password != repassword) {
        errors.push("Ошибка ввода пароля")
    }

    let data = {
        login: login,
        password: password,
        repassword: repassword,
        errors: errors,
        layout: "auth"
    }
    if (errors.length == 0) {

        const collectionProfile = db.collection("profiles")
        collectionProfile.findOne({ login: login }).then((user) => {
            if (user) {
                //user already exists
                errors.push("nickname already exists")
                callback(data)
            } else {
                //user registration part
                //user formation and registration
                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(password, salt, (err, hash) => {
                        if (err) throw err
                        let passwordHash = hash
                        collectionProfile
                            .insertOne({
                                    login: login,
                                    password: passwordHash
                                },
                                function(err, profile){
                                    callback(data)
                                })
                    })
                })
            }
        })
    } else {
        let data = {
            login: login,
            password: password,
            repassword: repassword,
            errors: errors,
            layout: "auth"
        }
        callback(data)
    }
}
