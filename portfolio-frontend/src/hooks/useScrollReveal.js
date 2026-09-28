import { useEffect, useRef } from 'react';

export function useScrollReveal(dependencies = []) {
  const containerRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
          }
        });
      },
      {
        threshold: 0.15,
        rootMargin: '0px 0px -40px 0px'
      }
    );

    const el = containerRef.current;
    if (el) {
      const items = el.querySelectorAll('.reveal-item');
      items.forEach((item) => observer.observe(item));
    }

    return () => {
      observer.disconnect();
    };
  }, dependencies);

  return containerRef;
}
