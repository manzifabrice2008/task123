const session = require('express-session');

module.exports = session({
  secret: process.env.SESSION_SECRET || 'fallback_secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: parseInt(process.env.SESSION_EXPIRY) || 3600000,
    sameSite: 'lax',
  },
});
