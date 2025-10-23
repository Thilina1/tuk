"use client";

import React, { useRef, useState, useEffect, useCallback } from 'react';
import type { FC } from 'react';

type Point = { x: number; y: number };

interface WhatsAppWidgetProps {
    phoneNumber: string;
}

const POPUP_WIDTH = 360;
const POPUP_HEIGHT = 280;
const BUTTON_SIZE = 64;

const WhatsAppIcon: FC<{ className?: string }> = ({ className = "w-8 h-8" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="currentColor" className={`${className} text-white`}>
        <path d="M16.004 3C9.378 3 4 8.377 4 15.004c0 2.592.862 4.99 2.314 6.943L4 29l7.207-2.281c1.731.7 3.618 1.079 5.613 1.079C22.63 27.798 28 22.424 28 15.798S22.63 3 16.004 3zm0 22.758c-1.728 0-3.36-.471-4.769-1.281l-.34-.201-4.276 1.354 1.406-4.146-.221-.354A9.758 9.758 0 016.242 15c0-5.385 4.379-9.758 9.762-9.758 5.382 0 9.762 4.373 9.762 9.758 0 5.385-4.38 9.758-9.762 9.758zm5.188-7.451c-.281-.139-1.647-.805-1.905-.898-.256-.095-.444-.14-.631.14-.188.278-.724.898-.887 1.084-.163.185-.326.208-.607.07-.279-.139-1.176-.433-2.238-1.379-.828-.735-1.386-1.64-1.547-1.938-.163-.278-.017-.429.123-.567.126-.126.28-.326.42-.489.14-.163.186-.28.28-.466.093-.186.047-.35-.023-.49-.07-.14-.631-1.522-.865-2.078-.228-.536-.463-.464-.637-.472l-.543-.01c-.188 0-.495.07-.753.35-.258.28-.986 0.953-.986 2.324 0 1.372 1.01 2.7 1.152 2.882.14.186 1.925 2.938 4.667 4.117.652.281 1.157.449 1.55.575.65.207 1.242.179 1.711.108.522-.077 1.604-.654 1.829-1.285.225-.63.225-1.17.157-1.285-.07-.115-.256-.183-.536-.322z" />
    </svg>
);

const SendIcon: FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
    </svg>
);

const CloseIcon: FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className={`${className} text-white`}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
);

const ChatPopup: FC<{ onClose: () => void; phoneNumber: string }> = ({ onClose, phoneNumber }) => (
    <div className={`w-[360px] max-w-[calc(100vw-32px)] h-[${POPUP_HEIGHT}px] rounded-2xl shadow-2xl flex flex-col bg-[#272a2e] animate-scale-in-br overflow-hidden`}>
        <div className="bg-[#22c55e] p-3 flex items-center justify-between text-white">
            <div className="flex items-center gap-3">
                <WhatsAppIcon className="w-7 h-7" />
                <h3 className="font-bold text-lg">WhatsApp</h3>
            </div>
            <button onClick={onClose} className="p-1 rounded-full bg-black/20 hover:bg-black/30 transition-colors" aria-label="Close chat">
                <CloseIcon />
            </button>
        </div>
        <div className="flex-grow p-6 flex flex-col justify-between">
            <div className="relative self-start max-w-[85%]">
                <div
                    className="absolute left-[-4px] bottom-0 w-3 h-3 bg-gray-600"
                    style={{ clipPath: 'polygon(0 100%, 100% 100%, 100% 0)' }}
                />
                <div className="bg-gray-600 text-white py-2 px-4 rounded-lg shadow-md">
                    <p>Hello 👋</p>
                    <p>How can we help you?</p>
                </div>
            </div>
            <a
                href={`https://wa.me/${phoneNumber}?text=Hello! I need more info about Booking https://tuktukdrive.com/.`}
                target="_blank"
                rel="noopener noreferrer"
                className="self-end mt-4 bg-[#22c55e] hover:bg-[#16a34a] text-white font-bold py-3 px-5 rounded-full flex items-center gap-2 transition-all duration-300 shadow-lg"
            >
                <span>Open chat</span>
                <SendIcon />
            </a>
        </div>
    </div>
);

export default function WhatsAppWidget({ phoneNumber = "+94770063780" }) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [isOpen, setIsOpen] = useState(false);
    const [showNotification, setShowNotification] = useState(true);
    const [anchored, setAnchored] = useState(true);
    const [position, setPosition] = useState<Point>({ x: 0, y: 0 });
    const [dragging, setDragging] = useState(false);
    const [offset, setOffset] = useState<Point>({ x: 0, y: 0 });
    const [hasMoved, setHasMoved] = useState(false);

    const PADDING = 16;

    const clamp = useCallback(
        (x: number, y: number): Point => {
            const vw = window.innerWidth;
            const vh = window.innerHeight;

            if (isOpen && !anchored) {
                const maxX = vw - PADDING - BUTTON_SIZE;
                const minX = PADDING + POPUP_WIDTH - BUTTON_SIZE;
                const maxY = vh - PADDING - BUTTON_SIZE;
                const minY = PADDING + POPUP_HEIGHT - BUTTON_SIZE;
                return {
                    x: Math.max(minX, Math.min(maxX, x)),
                    y: Math.max(minY, Math.min(maxY, y)),
                };
            } else {
                const minX = PADDING;
                const maxX = vw - PADDING - BUTTON_SIZE;
                const minY = PADDING;
                const maxY = vh - PADDING - BUTTON_SIZE;
                return {
                    x: Math.max(minX, Math.min(maxX, x)),
                    y: Math.max(minY, Math.min(maxY, y)),
                };
            }
        },
        [isOpen, anchored]
    );

    const beginDrag = useCallback(
        (clientX: number, clientY: number) => {
            setDragging(true);
            setHasMoved(false);
            if (isOpen) setIsOpen(false);

            const rect = containerRef.current?.getBoundingClientRect();
            if (rect) {
                if (anchored) {
                    setAnchored(false);
                    setPosition({ x: rect.left, y: rect.top });
                }
                setOffset({ x: clientX - rect.left, y: clientY - rect.top });
            }
        },
        [anchored, isOpen]
    );

    const onMouseDown = useCallback(
        (e: React.MouseEvent<HTMLButtonElement>) => {
            e.preventDefault();
            beginDrag(e.clientX, e.clientY);
        },
        [beginDrag]
    );

    const onTouchStart = useCallback(
        (e: React.TouchEvent<HTMLButtonElement>) => {
            const t = e.touches[0];
            beginDrag(t.clientX, t.clientY);
        },
        [beginDrag]
    );

    const onMouseMove = useCallback(
        (e: MouseEvent) => {
            if (!dragging) return;
            setHasMoved(true);
            setPosition(clamp(e.clientX - offset.x, e.clientY - offset.y));
        },
        [dragging, offset, clamp]
    );

    const onTouchMove = useCallback(
        (e: TouchEvent) => {
            if (!dragging) return;
            e.preventDefault();
            const t = e.touches[0];
            setHasMoved(true);
            setPosition(clamp(t.clientX - offset.x, t.clientY - offset.y));
        },
        [dragging, offset, clamp]
    );

    const onMouseUp = useCallback(() => setDragging(false), []);
    const onTouchEnd = useCallback(() => setDragging(false), []);

    useEffect(() => {
        if (!dragging) return;
        const options: AddEventListenerOptions = { passive: false };
        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mouseup', onMouseUp);
        window.addEventListener('touchmove', onTouchMove, options);
        window.addEventListener('touchend', onTouchEnd);
        return () => {
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('mouseup', onMouseUp);
            window.removeEventListener('touchmove', onTouchMove, options);
            window.removeEventListener('touchend', onTouchEnd);
        };
    }, [dragging, onMouseMove, onMouseUp, onTouchMove, onTouchEnd]);

    useEffect(() => {
        const onResize = () => {
            if (!anchored) setPosition((p) => clamp(p.x, p.y));
        };
        window.addEventListener('resize', onResize);
        return () => window.removeEventListener('resize', onResize);
    }, [anchored, clamp]);

    useEffect(() => {
        if (!isOpen) return;

        function handleClickOutside(event: MouseEvent) {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    const handleClick = () => {
        if (hasMoved) return;
        setIsOpen((prev) => {
            const willBeOpen = !prev;
            if (willBeOpen) {
                setShowNotification(false);
            }
            return willBeOpen;
        });
    };

    const containerStyle: React.CSSProperties = anchored
        ? {
              position: 'fixed',
              right: `calc(env(safe-area-inset-right, 0px) + ${PADDING}px)`,
              bottom: `calc(env(safe-area-inset-bottom, 0px) + ${PADDING}px)`,
              zIndex: 9999,
              userSelect: 'none',
          }
        : {
              position: 'fixed',
              left: `${isOpen ? position.x + BUTTON_SIZE - POPUP_WIDTH : position.x}px`,
              top: `${isOpen ? position.y + BUTTON_SIZE - POPUP_HEIGHT : position.y}px`,
              zIndex: 9999,
              userSelect: 'none',
          };

    return (
        <div ref={containerRef} style={containerStyle}>
            {isOpen ? (
                <ChatPopup onClose={() => setIsOpen(false)} phoneNumber={phoneNumber} />
            ) : (
                <div className="relative">
                    <button
                        onMouseDown={onMouseDown}
                        onTouchStart={onTouchStart}
                        onClick={handleClick}
                        className={`w-16 h-16 rounded-full bg-green-500 hover:bg-green-600 shadow-lg flex items-center justify-center transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-green-400/50 ${
                            dragging ? 'cursor-grabbing' : 'cursor-pointer'
                        }`}
                        aria-label="Open WhatsApp chat"
                    >
                        <WhatsAppIcon />
                    </button>
                    {showNotification && (
                        <div className="absolute top-0 right-0 w-6 h-6 bg-red-600 rounded-full flex items-center justify-center text-white text-xs font-bold border-2 border-white shadow-md">
                            1
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}