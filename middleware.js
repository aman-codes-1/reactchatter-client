import { next, rewrite } from '@vercel/edge';

export default function middleware(request) {
  const url = new URL(request?.url);

  const serverUri = process.env.REACT_APP_SERVER_URI;

  if (!serverUri) {
    return next();
  }

  if (url.pathname === '/api') {
    return rewrite(new URL(`${serverUri}/api`, request?.url));
  }

  if (url.pathname.startsWith('/api/')) {
    return rewrite(
      new URL(`${serverUri}${url.pathname}${url.search}`, request?.url),
    );
  }

  if (url.pathname.startsWith('/graphql')) {
    const upgradeHeader = request?.headers?.get?.('upgrade');
    if (upgradeHeader && upgradeHeader?.toLowerCase() === 'websocket') {
      return rewrite(
        new URL(`${serverUri?.replace?.(/^http/, 'ws')}/graphql`, request?.url),
      );
    }
    return rewrite(new URL(`${serverUri}/graphql`, request?.url));
  }

  return next();
}

export const config = {
  matcher: ['/api', '/api/*', '/graphql', '/graphql/*'],
};
