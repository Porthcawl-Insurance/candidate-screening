const passport = require('passport');
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const { Strategy: LocalStrategy } = require('passport-local');

const { Admin } = require('../models');

passport.use(new LocalStrategy({
  usernameField: 'email',
}, (email, password, done) => {
  Admin.findOne({ email }, (err, admin) => {
    if (err) return done(err);
    if (!admin) return done(null, false, { msg: `Email ${email} not found.` });

    admin.comparePassword(password, (err, isMatch) => {
      if (err) { return done(err); }
      if (isMatch) return done(null, admin);
      return done(null, false, 'Invalid email or password.');
    });
  });
}));

passport.use(new JwtStrategy({
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
}, (jwtPayload, done) => {
  if (!jwtPayload.adminId || !jwtPayload.email) return done(null, false, 'Invalid JWT.');

  Admin.findById(jwtPayload.adminId, (err, admin) => {
    if (err) return done(err, false);
    if (admin && admin.email === jwtPayload.email) return done(null, admin);

    return done(null, false, 'Invalid JWT.');
  });
}));
