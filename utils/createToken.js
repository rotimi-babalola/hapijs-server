import jwt from 'jsonwebtoken';

require('dotenv').config();

const secret = process.env.SECRET_KEY;

export const createToken = ({ username, guid }) =>
  // eslint-disable-next-line implicit-arrow-linebreak
  jwt.sign(
    {
      username,
      guid,
    },
    secret,
    { expiresIn: '12h' },
  );
