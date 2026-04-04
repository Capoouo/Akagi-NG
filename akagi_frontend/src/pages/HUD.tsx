import { X } from 'lucide-react';
import type { PointerEvent } from 'react';
import { useRef } from 'react';

import StreamPlayer from '@/components/StreamPlayer';
import { HudControlButton } from '@/components/ui/hud-control-button';
import { ModelStatusIndicator } from '@/components/ui/model-status-indicator';
import { HUD_MAX_WIDTH, HUD_MIN_WIDTH } from '@/config/constants';

export default function Hud() {
  const startPosRef = useRef<{ x: number; w: number; active: boolean }>({
    x: 0,
    w: 0,
    active: false,
  });
  const rafIdRef = useRef<number | null>(null);
  const pendingBoundsRef = useRef<{ width: number; height: number } | null>(null);

  const handlePointerDown = (e: PointerEvent) => {
    e.preventDefault();
    const target = e.currentTarget as HTMLElement;
    target.setPointerCapture(e.pointerId);

    startPosRef.current = {
      x: e.screenX,
      w: window.innerWidth,
      active: true,
    };
    document.body.style.cursor = 'nwse-resize';
  };

  const handlePointerMove = (e: PointerEvent) => {
    if (!startPosRef.current.active) return;

    // 计算新尺寸
    const deltaX = e.screenX - startPosRef.current.x;
    const width = Math.min(HUD_MAX_WIDTH, Math.max(HUD_MIN_WIDTH, startPosRef.current.w + deltaX));
    // 强制 16:9 比例
    const height = Math.round((width * 9) / 16);

    pendingBoundsRef.current = { width, height };
    if (rafIdRef.current === null) {
      rafIdRef.current = requestAnimationFrame(() => {
        rafIdRef.current = null;
        if (pendingBoundsRef.current) {
          window.electron.invoke('set-window-bounds', pendingBoundsRef.current);
        }
      });
    }
  };

  const handlePointerUp = (e: PointerEvent) => {
    if (!startPosRef.current.active) return;

    startPosRef.current.active = false;
    document.body.style.cursor = '';
    pendingBoundsRef.current = null;
    if (rafIdRef.current !== null) {
      cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = null;
    }

    try {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      // 忽略
    }
  };

  return (
    <div className='draggable relative h-screen w-full overflow-hidden'>
      <StreamPlayer className='h-full w-full' />

      {/* Model Status Indicator */}
      <ModelStatusIndicator className='top-3 left-3' />

      {/* Close Button */}
      <HudControlButton
        className='absolute top-2 right-2'
        onClick={() => window.electron.invoke('toggle-hud', false)}
      >
        <X className='h-4 w-4' />
      </HudControlButton>

      {/* Resize Handle */}
      <HudControlButton
        className='absolute right-1 bottom-1 cursor-nwse-resize'
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp} // 安全兜底
      >
        <svg
          width='12'
          height='12'
          viewBox='0 0 24 24'
          fill='none'
          stroke='currentColor'
          strokeWidth='2'
          strokeLinecap='round'
        >
          <line x1='22' y1='10' x2='10' y2='22' />
          <line x1='22' y1='16' x2='16' y2='22' />
        </svg>
      </HudControlButton>
    </div>
  );
}
