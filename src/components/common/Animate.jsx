import useScrollAnimation from '../../hooks/useScrollAnimation';

export default function Animate({
  children,
  direction = 'up',   // 'up' | 'down' | 'left' | 'right' | 'fade'
  delay     = 0,      // ms
  duration  = 500,    // ms
  threshold = 0.12,
  className = '',
  style     = {},
}) {
  const [ref, isVisible] = useScrollAnimation({ threshold });

  const transforms = {
    up:    'translateY(40px)',
    down:  'translateY(-40px)',
    left:  'translateX(-50px)',
    right: 'translateX(50px)',
    fade:  'translateY(0px)',
  };

  return (
    <div
      ref={ref}
      className={className}
      style={{
        ...style,
        opacity:    isVisible ? 1 : 0,
        transform:  isVisible ? 'translate(0,0)' : transforms[direction],
        transition: `opacity ${duration}ms ease ${delay}ms, transform ${duration}ms ease ${delay}ms`,
        willChange: 'opacity, transform',
      }}
    >
      {children}
    </div>
  );
}