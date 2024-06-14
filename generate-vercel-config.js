/* eslint-disable prefer-destructuring */
const fs = require('fs');
require('dotenv').config();

const REACT_APP_SERVER_DOMAIN = process.env.REACT_APP_SERVER_DOMAIN;
const REACT_APP_SERVER_URI = process.env.REACT_APP_SERVER_URI;

if (!REACT_APP_SERVER_DOMAIN) {
  console.error('REACT_APP_SERVER_DOMAIN environment variable is not set.');
  process.exit(1);
}

if (!REACT_APP_SERVER_URI) {
  console.error('REACT_APP_SERVER_URI environment variable is not set.');
  process.exit(1);
}
console.log(REACT_APP_SERVER_DOMAIN, REACT_APP_SERVER_URI);

const vercelConfig = {
  version: 2,
  builds: [
    {
      src: 'package.json',
      use: '@vercel/static-build',
      config: {
        distDir: 'build',
      },
    },
  ],
  rewrites: [
    {
      source: '/api',
      destination: `${REACT_APP_SERVER_URI}/api`,
    },
    {
      source: '/api:path*',
      destination: `${REACT_APP_SERVER_URI}/api:path*`,
    },
    {
      source: '/api/(.*)',
      destination: `${REACT_APP_SERVER_URI}/api/$1`,
    },
    {
      source: '/socket.io',
      destination: `${REACT_APP_SERVER_URI}/socket.io`,
    },
    {
      source: '/socket.io/:path*',
      destination: `${REACT_APP_SERVER_URI}/socket.io/:path*`,
    },
    {
      source: '/socket.io/(.*)',
      destination: `${REACT_APP_SERVER_URI}/socket.io/$1`,
    },
    {
      source: '/graphql',
      destination: `${REACT_APP_SERVER_URI}/graphql`,
    },
    {
      source: '/graphql/:path*',
      destination: `${REACT_APP_SERVER_URI}/graphql/:path*`,
    },
    {
      source: '/graphql/(.*)',
      destination: `${REACT_APP_SERVER_URI}/graphql/$1`,
    },
    {
      source: '/ws/graphql',
      destination: `wss://${REACT_APP_SERVER_DOMAIN}/graphql`,
    },
    { source: '/(.*)', destination: '/index.html' },
  ],
};

fs.writeFileSync('vercel.json', JSON.stringify(vercelConfig, null, 2));
console.log('vercel.json has been generated successfully.');
