import bcrypt from 'bcrypt';

const hashPassword = (password, cb) => {
  bcrypt.genSalt(10, (error, salt) => {
    bcrypt.hash(password, salt, (err, hash) => cb(err, hash));
  });
};

export default hashPassword;
