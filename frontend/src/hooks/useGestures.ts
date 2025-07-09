import { useEffect, useRef, useState } from 'react';

interface SwipeHandlers {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
}

interface SwipeOptions {
  threshold?: number;
  preventDefault?: boolean;
}

export const useSwipeGestures = (
  handlers: SwipeHandlers,
  options: SwipeOptions = {}
) => {
  const {
    threshold = 50,
    preventDefault = true
  } = options;

  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null);
  const [touchEnd, setTouchEnd] = useState<{ x: number; y: number } | null>(null);
  const elementRef = useRef<HTMLElement | null>(null);

  const handleTouchStart = (e: TouchEvent) => {
    if (preventDefault) {
      e.preventDefault();
    }
    setTouchEnd(null);
    setTouchStart({
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY
    });
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (preventDefault) {
      e.preventDefault();
    }
    if (!touchStart) return;
    
    setTouchEnd({
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY
    });
  };

  const handleTouchEnd = (e: TouchEvent) => {
    if (preventDefault) {
      e.preventDefault();
    }
    if (!touchStart || !touchEnd) return;

    const distanceX = touchStart.x - touchEnd.x;
    const distanceY = touchStart.y - touchEnd.y;
    const isLeftSwipe = distanceX > threshold;
    const isRightSwipe = distanceX < -threshold;
    const isUpSwipe = distanceY > threshold;
    const isDownSwipe = distanceY < -threshold;

    // Determine if horizontal or vertical swipe is more pronounced
    const isHorizontalSwipe = Math.abs(distanceX) > Math.abs(distanceY);

    if (isHorizontalSwipe) {
      if (isLeftSwipe && handlers.onSwipeLeft) {
        handlers.onSwipeLeft();
      } else if (isRightSwipe && handlers.onSwipeRight) {
        handlers.onSwipeRight();
      }
    } else {
      if (isUpSwipe && handlers.onSwipeUp) {
        handlers.onSwipeUp();
      } else if (isDownSwipe && handlers.onSwipeDown) {
        handlers.onSwipeDown();
      }
    }

    setTouchStart(null);
    setTouchEnd(null);
  };

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    element.addEventListener('touchstart', handleTouchStart, { passive: !preventDefault });
    element.addEventListener('touchmove', handleTouchMove, { passive: !preventDefault });
    element.addEventListener('touchend', handleTouchEnd, { passive: !preventDefault });

    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchmove', handleTouchMove);
      element.removeEventListener('touchend', handleTouchEnd);
    };
  }, [touchStart, touchEnd, handlers, preventDefault, threshold]);

  return elementRef;
};

// Custom hook for improved scroll behavior
export const useScrollDirection = () => {
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down' | null>(null);
  const [isScrolling, setIsScrolling] = useState(false);
  const lastScrollY = useRef(0);
  const scrollTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    let ticking = false;

    const updateScrollDirection = () => {
      const scrollY = window.scrollY;
      const direction = scrollY > lastScrollY.current ? 'down' : 'up';
      
      if (direction !== scrollDirection && Math.abs(scrollY - lastScrollY.current) > 10) {
        setScrollDirection(direction);
      }
      
      lastScrollY.current = scrollY;
      setIsScrolling(true);
      
      // Clear existing timeout
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }
      
      // Set scrolling to false after 150ms of no scroll
      scrollTimeout.current = setTimeout(() => {
        setIsScrolling(false);
      }, 150);
      
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(updateScrollDirection);
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', onScroll);
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }
    };
  }, [scrollDirection]);

  return { scrollDirection, isScrolling };
};

// Hook for handling click outside
export const useClickOutside = (
  ref: React.RefObject<HTMLElement | null>,
  handler: (event: MouseEvent | TouchEvent) => void
) => {
  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      if (!ref.current || ref.current.contains(event.target as Node)) {
        return;
      }
      handler(event);
    };

    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);

    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, handler]);
};

// Hook for managing focus trap in mobile menu
export const useFocusTrap = (isActive: boolean) => {
  const containerRef = useRef<HTMLElement | null>(null);
  
  useEffect(() => {
    if (!isActive || !containerRef.current) return;

    const container = containerRef.current;
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    const firstFocusableElement = focusableElements[0] as HTMLElement;
    const lastFocusableElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstFocusableElement) {
          lastFocusableElement.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastFocusableElement) {
          firstFocusableElement.focus();
          e.preventDefault();
        }
      }
    };

    document.addEventListener('keydown', handleTabKey);
    
    // Focus first element when trap becomes active
    if (firstFocusableElement) {
      firstFocusableElement.focus();
    }

    return () => {
      document.removeEventListener('keydown', handleTabKey);
    };
  }, [isActive]);

  return containerRef;
};
