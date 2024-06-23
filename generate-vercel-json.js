require('dotenv').config();

const fs = require('fs');

const serverUri = process.env.REACT_APP_SERVER_URI;
const serverDomain = process.env.REACT_APP_SERVER_DOMAIN;

if (!serverUri || !serverDomain) {
  throw new Error('Environment Variables are not defined');
}

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
      destination: `${serverUri}/api`,
    },
    {
      source: '/api/(.*)',
      destination: `${serverUri}/api/$1`,
    },
    {
      source: '/socket.io/',
      destination: `${serverUri}/socket.io/`,
    },
    {
      source: '/graphql',
      destination: `${serverUri}/graphql`,
    },
    {
      source: '/ws/graphql',
      destination: `wss://${serverDomain}/graphql`,
    },
    {
      source: '/(.*)',
      destination: '/index.html',
    },
  ],
};

fs.writeFileSync('vercel.json', JSON.stringify(vercelConfig, null, 2));
