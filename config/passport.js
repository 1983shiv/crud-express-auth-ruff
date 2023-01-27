const GoogleStrategy = require("passport-google-oauth20");
const User = require("../models/User");

module.exports = function (passport) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "/auth/google/callback",
      },
      async (accessToken, refreshToken, profile, done) => {
        // console.log("profile", profile);
        const newUser = {
          googleId: profile.id,
          displayName: profile.displayName,
          firstName: profile.name.givenName,
          lastName: profile.name.familyName,
          image: profile.photos[0].value,
        };

        try {
          let user = await User.findOne({ googleId: profile.id });
          if (user) {
            done(null, user);
          } else {
            user = await User.create(newUser);
            done(null, user);
          }
        } catch (err) {
          console.log(
            "error occured during passport registeration or login",
            err.message
          );
        }
      }
    )
  );

  passport.serializeUser((user, done) =>
    process.nextTick(() => done(null, { id: user.id }))
  );

  passport.deserializeUser(function (user, done) {
    User.findById(user.id, function (err, user) {
      done(err, user);
    });
  });

  // passport.deserializeUser((user, done) =>
  //   process.nextTick(() => {
  //     return done(null, user);
  //   })
  // );

  //   passport.serializeUser((user, done) => {
  //     done(null, user.id);
  //   done(null, { id: user.id, username: user.username, name: user.name })
  //   });

  //   passport.deserializeUser(function (id, done) {
  // User.findById(id, function (err, user) {
  //   done(err, user);
  // });
  //   });

  // updated version of above code using es6, rather than callback, user arrow function
  //   passport.deserializeUser((id, done) =>
  //     User.findById(id, (err, user) => done(err, user))
  //   );
};
