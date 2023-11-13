import { useEffect } from 'react';

const ScrollToTop = ({ children, pathname }: any) => {
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
  }, [pathname]);

  return children || null;
};

export default ScrollToTop;
