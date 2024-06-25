import { next, rewrite } from '@vercel/edge';

export default function middleware(request) {
  const url = new URL(request.url);

  const serverUri = process.env.REACT_APP_SERVER_URI;
  const serverDomain = process.env.REACT_APP_SERVER_DOMAIN;

  if (!serverUri || !serverDomain) {
    return next();
  }

  if (url.pathname === '/api') {
    return rewrite(new URL(`${serverUri}/api`, request.url));
  }

  if (url.pathname.startsWith('/api/')) {
    return rewrite(
      new URL(`${serverUri}${url.pathname}${url.search}`, request.url),
    );
  }

  // if (url.pathname.startsWith('/socket.io/')) {
  //   return rewrite(
  //     new URL(`${serverUri}/socket.io/${url.search}`, request.url),
  //   );
  // }

  if (url.pathname.startsWith('/graphql')) {
    return rewrite(new URL(`${serverUri}/graphql`, request.url));
  }

  // if (url.pathname.startsWith('/ws/graphql')) {
  //   return rewrite(new URL(`wss://${serverDomain}/graphql`, request.url));
  // }

  return next();
}
