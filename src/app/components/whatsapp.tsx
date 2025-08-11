'use client';

import { useRef, useState, useEffect, useCallback } from 'react';

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

  // Keep it visible on resize (only matters after it’s unanchored)
  useEffect(() => {
    const onResize = () => {
      if (!anchored) setPosition((p) => clamp(p.x, p.y));
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [anchored]);

  const handleClick = (e: React.MouseEvent) => {
    if (hasMoved) e.preventDefault();
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
    <div ref={buttonRef} onMouseDown={onMouseDown} onTouchStart={onTouchStart} style={containerStyle}>
      <a
        href="https://wa.me/94770063780"
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleClick}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 56,
          height: 56,
          borderRadius: 9999,
          backgroundColor: '#22c55e',
          boxShadow: '0 4px 10px rgba(0,0,0,.15)',
          transition: 'background-color .2s',
        }}
        onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.backgroundColor = '#16a34a')}
        onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.backgroundColor = '#22c55e')}
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="currentColor" style={{ width: 28, height: 28, color: '#fff' }}>
          <path d="M16.004 3C9.378 3 4 8.377 4 15.004c0 2.592.862 4.99 2.314 6.943L4 29l7.207-2.281c1.731.7 3.618 1.079 5.613 1.079C22.63 27.798 28 22.424 28 15.798S22.63 3 16.004 3zm0 22.758c-1.728 0-3.36-.471-4.769-1.281l-.34-.201-4.276 1.354 1.406-4.146-.221-.354A9.758 9.758 0 016.242 15c0-5.385 4.379-9.758 9.762-9.758 5.382 0 9.762 4.373 9.762 9.758 0 5.385-4.38 9.758-9.762 9.758zm5.188-7.451c-.281-.139-1.647-.805-1.905-.898-.256-.095-.444-.14-.631.14-.188.278-.724.898-.887 1.084-.163.185-.326.208-.607.07-.279-.139-1.176-.433-2.238-1.379-.828-.735-1.386-1.64-1.547-1.938-.163-.278-.017-.429.123-.567.126-.126.28-.326.42-.489.14-.163.186-.28.28-.466.093-.186.047-.35-.023-.49-.07-.14-.631-1.522-.865-2.078-.228-.536-.463-.464-.637-.472l-.543-.01c-.188 0-.495.07-.753.35-.258.28-.986 0.953-.986 2.324 0 1.372 1.01 2.7 1.152 2.882.14.186 1.925 2.938 4.667 4.117.652.281 1.157.449 1.55.575.65.207 1.242.179 1.711.108.522-.077 1.604-.654 1.829-1.285.225-.63.225-1.17.157-1.285-.07-.115-.256-.183-.536-.322z" />
        </svg>
      </a>
    </div>
  );
}
