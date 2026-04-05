import { useEffect, useRef, useState } from 'react';

export default function useScrollAnimation(options = {}) {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        observer.unobserve(entry.target); // animate once only
      }
    }, {
      threshold: options.threshold || 0.12,
      rootMargin: options.rootMargin || '0px 0px -40px 0px',
    });

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return [ref, isVisible];
}