require('dotenv').config();
const fs = require('fs');

const serverUri = process.env.REACT_APP_SERVER_URI;
const serverDomain = process.env.REACT_APP_SERVER_DOMAIN;

if (!serverUri || !serverDomain) {
  console.error('Environment variables must be set');
  process.exit(1);
}

const template = fs.readFileSync('vercel.json', 'utf8');

const result = template
  .replace(/__REACT_APP_SERVER_URI__/g, serverUri)
  .replace(/__REACT_APP_SERVER_DOMAIN__/g, serverDomain);

fs.writeFileSync('vercel.json', result);

console.log('vercel.json generated successfully');
