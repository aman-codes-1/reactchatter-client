// api/middleware.js

export default async function middleware(req) {
  const { pathname, origin } = new URL(req.url);
  const serverUri = process.env.REACT_APP_SERVER_URI;

  if (!serverUri) {
    return new Response('REACT_APP_SERVER_URI is not defined', { status: 500 });
  }

  let destinationUrl;

  if (pathname.startsWith('/api')) {
    destinationUrl = `${serverUri}/api${pathname.slice(4)}`;
  } else if (pathname.startsWith('/socket.io')) {
    destinationUrl = `${serverUri}/socket.io${pathname.slice(10)}`;
  } else if (pathname.startsWith('/graphql')) {
    destinationUrl = `${serverUri}/graphql${pathname.slice(8)}`;
  } else if (pathname.startsWith('/ws/graphql')) {
    destinationUrl = `${serverUri.replace(/^http/, 'ws')}/graphql${pathname.slice(11)}`;
  } else {
    return new Response('Not Found', { status: 404 });
  }

  return Response.redirect(destinationUrl);
}

export const config = {
  matcher: ['/api/:path*', '/socket.io/:path*', '/graphql', '/ws/graphql'],
};
