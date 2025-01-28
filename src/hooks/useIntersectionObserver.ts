import { DependencyList, useLayoutEffect, useRef } from 'react';

export const useIntersectionObserver = <T extends HTMLElement>(
  callback: () => void,
  deps: DependencyList,
  initValues?: IntersectionObserverInit,
) => {
  const nodeRef = useRef<T | null>(null);

  useLayoutEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries?.[0].isIntersecting) callback();
    }, initValues);

    if (nodeRef?.current) {
      observer?.observe(nodeRef?.current);
    }

    return () => {
      observer?.disconnect();
    };
  }, [...deps, callback, nodeRef?.current]);

  return nodeRef;
};
