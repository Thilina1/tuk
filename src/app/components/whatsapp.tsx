'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

declare global {
  interface Window {
    gtag: (param1: string, param2: string, param3: object) => void;
  }
}

type Point = { x: number; y: number };

export default function WhatsAppButton() {
  const buttonRef = useRef<HTMLDivElement>(null);

  const [anchored, setAnchored] = useState(true);
  const [position, setPosition] = useState<Point>({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [offset, setOffset] = useState<Point>({ x: 0, y: 0 });
  const [hasMoved, setHasMoved] = useState(false);

  const PADDING = 16;

  const clamp = (x: number, y: number): Point => {
    const el = buttonRef.current;
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const w = el?.offsetWidth ?? 56;
    const h = el?.offsetHeight ?? 56;
    return {
      x: Math.max(PADDING, Math.min(vw - w - PADDING, x)),
      y: Math.max(PADDING, Math.min(vh - h - PADDING, y)),
    };
  };

  const beginDrag = (clientX: number, clientY: number) => {
    setDragging(true);
    setHasMoved(false);

    const rect = buttonRef.current?.getBoundingClientRect();
    if (rect) {
      if (anchored) {
        setAnchored(false);
        setPosition({ x: rect.left, y: rect.top });
      }
      setOffset({ x: clientX - rect.left, y: clientY - rect.top });
    }
  };

  // Mouse
  const onMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    beginDrag(e.clientX, e.clientY);
  };

  const onMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!dragging) return;
      setHasMoved(true);
      setPosition(clamp(e.clientX - offset.x, e.clientY - offset.y));
    },
    [dragging, offset]
  );

  const onMouseUp = () => setDragging(false);

  // Touch
  const onTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    const t = e.touches[0];
    beginDrag(t.clientX, t.clientY);
  };

  const onTouchMove = useCallback(
    (e: TouchEvent) => {
      if (!dragging) return;
      e.preventDefault();
      const t = e.touches[0];
      setHasMoved(true);
      setPosition(clamp(t.clientX - offset.x, t.clientY - offset.y));
    },
    [dragging, offset]
  );

  const onTouchEnd = () => setDragging(false);

  // Attach global listeners during drag
  useEffect(() => {
    if (!dragging) return;
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    window.addEventListener('touchmove', onTouchMove, { passive: false });
    window.addEventListener('touchend', onTouchEnd);
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
    };
  }, [dragging, onMouseMove, onTouchMove]);

  // Keep it visible on resize (only matters after it's unanchored)
  useEffect(() => {
    const onResize = () => {
      if (!anchored) setPosition((p) => clamp(p.x, p.y));
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [anchored]);

  const handleClick = (e: React.MouseEvent) => {
    if (hasMoved) {
      e.preventDefault();
      return;
    }

    // Fire the conversion event
    if (typeof window.gtag === 'function') {
      window.gtag('event', 'conversion', {
        send_to: 'AW-11504981103/WjtKCKrTk5obEO-ogO4q',
        value: 1.0,
        currency: 'USD',
      });
    }
  };

  // Styles: anchored => bottom-right; unanchored => left/top
  const containerStyle: React.CSSProperties = anchored
    ? {
        position: 'fixed',
        right: 'calc(env(safe-area-inset-right, 0px) + 16px)',
        bottom: 'calc(env(safe-area-inset-bottom, 0px) + 16px)',
        zIndex: 9999,
        cursor: dragging ? 'grabbing' : 'grab',
        userSelect: 'none',
      }
    : {
        position: 'fixed',
        left: `${position.x}px`,
        top: `${position.y}px`,
        zIndex: 9999,
        cursor: dragging ? 'grabbing' : 'grab',
        userSelect: 'none',
      };

  return (
    <div
      ref={buttonRef}
      onMouseDown={onMouseDown}
      onTouchStart={onTouchStart}
      style={containerStyle}
    >
      <a
        href="https://wa.me/94770063780"
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleClick}
        className="whatsapp-button"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 56,
          height: 56,
          borderRadius: 9999,
          backgroundColor: 'rgba(255, 255, 255, 0.15)',
          boxShadow: '0 4px 10px rgba(0,0,0,.15)',
          transition: 'background-color .2s',
        }}
        aria-label="Open WhatsApp chat"
      >
        <DotLottieReact
          src="https://lottie.host/a749ed34-1305-42a8-b492-4f817fe10487/kg0S0bnsxA.lottie"
          autoplay
          loop
          style={{ width: 60, height: 60 }}
        />
      </a>
    </div>
  );
}