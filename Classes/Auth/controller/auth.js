const model = require("../model/auth"),
      path = require("path"),
      compileFile = require("pug").compileFile,
      passport = require("passport")

exports.signup = (req, res) => {
  model.signup(req, res, (data) => {
    res.send(data);
  });
};

exports.login = (req, res, next) => {
  passport.authenticate("local",{session: true}, (err, user, info)=>{

        req.logIn(user, function(err) {
          console.log(req.isAuthenticated())
          console.log(req.session.token)
          console.log(user)
          console.log(req.user)
          if (err) {
            console.log(err)
          }
          else {
            req.session.token = user._id
            console.log(req.session.token)
            res.send(info);
          }
        });
    })(req, res, next);
};
