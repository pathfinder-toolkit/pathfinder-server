const jwt = require("express-jwt");
const jwtAuthz = require("express-jwt-authz");
const jwksRsa = require("jwks-rsa");

const axios = require('axios');

const checkJwt = jwt({
    secret: jwksRsa.expressJwtSecret({
      cache: true,
      rateLimit: true,
      jwksRequestsPerMinute: 5,
      jwksUri: `https://dev-cwz8v54y.eu.auth0.com/.well-known/jwks.json`,
    }),
  
    audience: process.env.AUTH_AUDIENCE,
    issuer: process.env.AUTH_ISSUER,
    algorithms: ["RS256"],
});

const getUserInfo = async (token) => {

  const address = encodeURI(
    process.env.AUTH_ISSUER + 'userinfo'
  );

  const axiosConfig = {
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    },
  };

  const response = await axios.get(address, axiosConfig);

  return response.data;

}

module.exports = {
    checkJwt,
    getUserInfo
};
