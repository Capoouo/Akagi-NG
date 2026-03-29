import { ArrowDownToLine } from 'lucide-react';
import { type FC, useSyncExternalStore } from 'react';

type StoreSnapshot = { version: string };

let snapshot: StoreSnapshot = { version: '' };
const listeners = new Set<() => void>();

const updateSnapshot = (version: string) => {
  snapshot = { version };
  listeners.forEach((l) => l());
};

if (window.electron) {
  window.electron.on('app:update-available', (v) => updateSnapshot(v as string));
}

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

const getSnapshot = () => snapshot;

export const UpdateBadge: FC = () => {
  const { version } = useSyncExternalStore(subscribe, getSnapshot);

  if (!version) {
    return null;
  }

  const handleClick = () => {
    window.electron.invoke(
      'open-external',
      `https://github.com/Xe-Persistent/Akagi-NG/releases/tag/v${version}`,
    );
  };

  return (
    <button
      onClick={handleClick}
      className='-my-0.5 flex items-center gap-1.5 rounded-full bg-rose-500/10 px-2 py-0.5 text-rose-600 transition-colors hover:bg-rose-500/20 dark:text-rose-400'
    >
      <ArrowDownToLine className='h-3 w-3 shrink-0' />
      <span className='w-[5ch] text-center tabular-nums'>v{version}</span>
    </button>
  );
};
