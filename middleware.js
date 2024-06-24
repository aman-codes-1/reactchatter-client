/* eslint-disable prefer-destructuring */
// middleware.js

export default function middleware(request) {
  const REACT_APP_SERVER_URI = process.env.REACT_APP_SERVER_URI;

  if (!REACT_APP_SERVER_URI) {
    throw new Error('REACT_APP_SERVER_URI is not defined');
  }

  const url = new URL(request.url);

  // Rewriting based on path
  if (url.pathname.startsWith('/api')) {
    return new Response(null, {
      headers: {
        Location: `${REACT_APP_SERVER_URI}${url.pathname}${url.search}`,
      },
      status: 307,
    });
  }

  if (url.pathname.startsWith('/socket.io')) {
    return new Response(null, {
      headers: {
        Location: `${REACT_APP_SERVER_URI}/socket.io${url.search}`,
      },
      status: 307,
    });
  }

  if (url.pathname.startsWith('/graphql')) {
    return new Response(null, {
      headers: {
        Location: `${REACT_APP_SERVER_URI}/graphql${url.search}`,
      },
      status: 307,
    });
  }

  if (url.pathname.startsWith('/ws/graphql')) {
    const newUrl = REACT_APP_SERVER_URI.replace('https', 'wss');
    return new Response(null, {
      headers: {
        Location: `${newUrl}/graphql${url.search}`,
      },
      status: 307,
    });
  }

  // Default rewrite to /index.html for all other paths
  return new Response(null, {
    headers: {
      Location: '/index.html',
    },
    status: 307,
  });
}

export const config = {
  matcher: [
    '/api/:path*',
    '/socket.io/:path*',
    '/graphql',
    '/ws/graphql',
    '/:path*',
  ],
};
