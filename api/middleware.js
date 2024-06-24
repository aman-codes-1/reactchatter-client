// api/middleware.js

export default async function middleware(req) {
  const url = new URL(req.url);
  const serverUri = process.env.REACT_APP_SERVER_URI;

  if (!serverUri) {
    return new Response('REACT_APP_SERVER_URI is not defined', { status: 500 });
  }

  if (url.pathname.startsWith('/api')) {
    url.href = `${serverUri}/api${url.pathname.slice(4)}`;
    return Response.redirect(url.href);
  }

  if (url.pathname.startsWith('/socket.io')) {
    url.href = `${serverUri}/socket.io${url.pathname.slice(10)}`;
    return Response.redirect(url.href);
  }

  if (url.pathname.startsWith('/graphql')) {
    url.href = `${serverUri}/graphql${url.pathname.slice(8)}`;
    return Response.redirect(url.href);
  }

  if (url.pathname.startsWith('/ws/graphql')) {
    url.protocol = 'wss:';
    url.href = `${serverUri}/graphql${url.pathname.slice(11)}`;
    return Response.redirect(url.href);
  }

  return new Response('Not Found', { status: 404 });
}

export const config = {
  matcher: ['/api/:path*', '/socket.io/:path*', '/graphql', '/ws/graphql'],
};
