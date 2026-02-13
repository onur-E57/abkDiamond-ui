import { useEffect } from 'react';

export default function MouseDetecter() {
  useEffect(() => {
    const handleTouchDetect = () => {
      const isTouchDevice = window.matchMedia('(hover: none)').matches;

      if (isTouchDevice) {
        document.body.classList.add('is-touch');
        document.body.classList.remove('can-hover');
      } else {
        document.body.classList.add('can-hover');
        document.body.classList.remove('is-touch');
      }
    };

    handleTouchDetect();

    window.addEventListener('resize', handleTouchDetect);

    return () => window.removeEventListener('resize', handleTouchDetect);
  }, []);

  return null;
}