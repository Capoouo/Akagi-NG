import { ArrowDownToLine, CheckCircle2, Loader2 } from 'lucide-react';
import { type FC, useOptimistic, useSyncExternalStore, useTransition } from 'react';

import { cn } from '@/lib/utils.ts';

type UpdateState = 'idle' | 'available' | 'downloading' | 'ready';
type StoreSnapshot = { status: UpdateState; version: string; progress: number };

let snapshot: StoreSnapshot = { status: 'idle', version: '', progress: 0 };
const listeners = new Set<() => void>();

const updateSnapshot = (partial: Partial<StoreSnapshot>) => {
  snapshot = { ...snapshot, ...partial };
  listeners.forEach((l) => l());
};

if (window.electron) {
  window.electron.on('app:update-available', (v) =>
    updateSnapshot({ status: 'available', version: v as string }),
  );
  window.electron.on('app:update-progress', (p: { percent: number }) =>
    updateSnapshot({ status: 'downloading', progress: p?.percent ? Math.round(p.percent) : 0 }),
  );
  window.electron.on('app:update-downloaded', () => updateSnapshot({ status: 'ready' }));
}

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

const getSnapshot = () => snapshot;

export const UpdateBadge: FC = () => {
  const coreState = useSyncExternalStore(subscribe, getSnapshot);

  const [optimisticStatus, addOptimisticStatus] = useOptimistic(
    coreState.status,
    (_, optimisticValue: UpdateState) => optimisticValue,
  );

  const [isPending, startTransition] = useTransition();

  const handleUpdateClick = () => {
    if (optimisticStatus === 'available') {
      startTransition(async () => {
        addOptimisticStatus('downloading');

        try {
          await window.electron.invoke('app:start-download');
        } catch {
          // React 19 会自动回滚挂起的 ui 状态
        }
      });
    } else if (optimisticStatus === 'ready') {
      startTransition(async () => {
        await window.electron.invoke('app:install-update');
      });
    }
  };

  if (optimisticStatus === 'idle') {
    return null;
  }

  const colorStyles: Record<string, string> = {
    available: 'bg-rose-500/10 text-rose-600 hover:bg-rose-500/20 dark:text-rose-400',
    downloading: 'cursor-default bg-blue-500/10 text-blue-600 dark:text-blue-400',
    ready: 'bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 dark:text-emerald-400',
  };

  return (
    <button
      onClick={handleUpdateClick}
      disabled={optimisticStatus === 'downloading' || isPending}
      className={cn(
        '-my-0.5 flex items-center gap-1.5 rounded-full px-2 py-0.5 transition-colors',
        colorStyles[optimisticStatus],
      )}
    >
      {optimisticStatus === 'available' && (
        <>
          <ArrowDownToLine className='h-3 w-3 shrink-0' />
          <span className='w-[5ch] text-center tabular-nums'>v{coreState.version}</span>
        </>
      )}
      {optimisticStatus === 'downloading' && (
        <>
          <Loader2 className='h-3 w-3 shrink-0 animate-spin' />
          <span className='w-[5ch] text-center tabular-nums'>{coreState.progress}%</span>
        </>
      )}
      {optimisticStatus === 'ready' && (
        <>
          <CheckCircle2 className='h-3 w-3 shrink-0' />
          <span className='w-[5ch] text-center tabular-nums'>v{coreState.version}</span>
        </>
      )}
    </button>
  );
};
