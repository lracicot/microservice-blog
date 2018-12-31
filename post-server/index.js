import mongoose from 'mongoose';
import jwt from 'express-jwt';
import jwksRsa from 'jwks-rsa';
import app from './src/server';

require('dotenv').config();

mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true });

app.use(jwt({
  // Dynamically provide a signing key based on the kid in the header and the singing keys provided by the JWKS endpoint.
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 60,
    jwksUri: `${process.env.AUTH0_DOMAIN}.well-known/jwks.json`
  }),

  // Validate the audience and the issuer.
  audience: process.env.AUTH0_AUDIENCE,
  issuer: process.env.AUTH0_DOMAIN,
  algorithms: ['RS256']
}));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  /* eslint-disable no-console */
  console.log(`Server is running on ${PORT}`);
});
