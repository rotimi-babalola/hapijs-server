import bcrypt from 'bcrypt';

const verifyPassword = (password, hashedPassword) => {
  if (!password || !hashedPassword) {
    return false;
  }
  return bcrypt.compareSync(password, hashedPassword);
};

export default verifyPassword;
