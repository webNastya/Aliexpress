const db = require("../../../db").get();
const bcrypt = require("bcryptjs");

exports.signup = (req, res, callback) => {
  const loginPattern = new RegExp(/^[a-zA-Z0-9_-]{5,16}$/);
  const passwordPattern = new RegExp(/^[a-zA-Z0-9_-]{5,16}$/);

  const { login, password } = req.body;
  let errors = [];
  if (!loginPattern.test(login)) {
    errors.push("Ошибка ввода логина");
  }
  if (!passwordPattern.test(password)) {
    errors.push("Ошибка ввода пароля");
  }

  let data = {
    login: login,
    password: password,
    errors: errors,
  };
  if (errors.length === 0) {
    const collectionProfile = db.collection("profiles");
    collectionProfile.findOne({ login: login }).then((user) => {
      if (user) {
        //user already exists
        errors.push("nickname already exists");
        callback(data);
      } else {
        //user registration part
        //user formation and registration
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(password, salt, (err, passwordHash) => {
            if (err) throw err;
            collectionProfile.insertOne(
              {
                login: login,
                password: passwordHash,
                basket: [],
                favorites: []
              },
              function (err, profile) {
                callback(data);
              }
            );
          });
        });
      }
    });
  } else {
    //error
    let data = {
      login: login,
      password: password,
      errors: errors,
      layout: "auth",
    };
    callback(data);
  }
};
