//tools and shiet
const db = require("../db").get();
const localStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");

//require User Model
module.exports = function (passport) {
  const collectionProfile = db.collection("profiles");
  passport.use(
    new localStrategy(
      { passReqToCallback: true, usernameField: "login",
        passwordField: 'password' },
      function (req, login, password, done) {
          console.log("login", login)
          console.log("password", password)
        //match user
          collectionProfile.findOne({ login: login })
          .then((user) => {
            // no match
            if (!user) {
              return done(
                  null,
                  false,
                  "unserializable"
              );
            }
            //match
            bcrypt.compare(password, user.password, (err, ismatch) => {
              if (err) {
                throw err;
              }
              if (ismatch) {
                return done(null, user, "serialize")
              } else {
                return done(
                    null,
                    false,
                    "bad_password"
                );
              }
            });
          })
          .catch((err) => console.log(err));
      }
    )
  );
  passport.serializeUser(function (user, done) {
    console.log("user", user)
    console.log("serializeUser")
    done(null, user, "serialize");
  });

  passport.deserializeUser(function (id, done) {
      collectionProfile.findOne({ id: id }, function (err, user) {
        done(err, user, "deserialize");
    });
  });
};
