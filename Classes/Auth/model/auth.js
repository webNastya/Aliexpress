const db = require("../../../db").get();
const bcrypt = require("bcryptjs");
var jsdom = require("jsdom");
const { JSDOM } = jsdom;
const { window } = new JSDOM();
const { document } = new JSDOM("").window;
global.document = document;

var $ = (jQuery = require("jquery")(window));

exports.register = (req, res, callback) => {
  const loginPattern = new RegExp(/^[a-z0-9_-]{5,16}$/);
  const passwordPattern = new RegExp(/^[a-z0-9_-]{5,16}$/);

  const { regLogin, regPassword, repassword } = req.body;
  let errors = [];
  if (!loginPattern.test(regLogin)) {
    errors.push("Ошибка ввода логина");
  }
  if (!passwordPattern.test(regPassword) || regPassword != repassword) {
    errors.push("Ошибка ввода пароля");
  }

  let data = {
    regLogin: regLogin,
    regPassword: regPassword,
    repassword: repassword,
    errors: errors,
    layout: "auth",
  };
  if (errors.length == 0) {
    const collectionProfile = db.collection("profiles");
    collectionProfile.findOne({ login: regLogin }).then((user) => {
      if (user) {
        //user already exists
        errors.push("nickname already exists");
        callback(data);
      } else {
        //user registration part
        //user formation and registration
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(regPassword, salt, (err, hash) => {
            if (err) throw err;
            let passwordHash = hash;
            collectionProfile.insertOne(
              {
                login: regLogin,
                password: passwordHash,
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
      regLogin: regLogin,
      regPassword: regPassword,
      repassword: repassword,
      errors: errors,
      layout: "auth",
    };
    callback(data);
  }
};
