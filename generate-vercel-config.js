const fs = require('fs');
require('dotenv').config();

// eslint-disable-next-line prefer-destructuring
const REACT_APP_SERVER_URI = process.env.REACT_APP_SERVER_URI;

if (!REACT_APP_SERVER_URI) {
  console.error('REACT_APP_SERVER_URI environment variable is not set.');
  process.exit(1);
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
      source: '/api/(.*)',
      destination: `${REACT_APP_SERVER_URI}/api/$1`,
    },
    {
      source: '/api',
      destination: `${REACT_APP_SERVER_URI}/api`,
    },
    { source: '/(.*)', destination: '/index.html' },
  ],
};

fs.writeFileSync('vercel.json', JSON.stringify(vercelConfig, null, 2));
console.log('vercel.json has been generated successfully.');
