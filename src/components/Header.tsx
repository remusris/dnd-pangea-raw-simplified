import type { FC } from 'react'

interface HeaderProps {
  isDragging: boolean
  isOverDropzone: boolean
  dropzoneMode: 'manual' | 'portal'
  onDropzoneModeChange: (mode: 'manual' | 'portal') => void
}

export const Header: FC<HeaderProps> = ({
  isDragging,
  isOverDropzone,
  dropzoneMode,
  onDropzoneModeChange,
}) => {
  return (
    <header className="flex flex-col gap-4">
      <p className="text-xs uppercase tracking-[0.35em] text-slate-400">
        Pangea drag lanes
      </p>
      <h1 className="text-3xl font-semibold text-slate-100 md:text-4xl">
        Vertical sort with mixed dropzones
      </h1>
      <p className="max-w-2xl text-sm text-slate-300 md:text-base">
        Drag a waypoint to reorder the main list. Only select waypoints reveal
        a dropzone beneath them while you drag.
      </p>
      <div className="flex flex-wrap items-center gap-3 text-[0.6rem] uppercase tracking-[0.3em]">
        <span
          className={`rounded-full px-4 py-2 ${
            isDragging
              ? 'bg-emerald-400/15 text-emerald-200'
              : 'bg-slate-800 text-slate-400'
          }`}
        >
          Drag state {isDragging ? 'active' : 'idle'}
        </span>
        <span
          className={`rounded-full px-4 py-2 ${
            isOverDropzone
              ? 'bg-cyan-400/15 text-cyan-200'
              : 'bg-slate-800 text-slate-400'
          }`}
        >
          Dropzone {isOverDropzone ? 'entered' : 'idle'}
        </span>
        <div className="flex items-center gap-2">
          <span className="text-slate-400">Mode</span>
          <button
            type="button"
            onClick={() => onDropzoneModeChange('manual')}
            disabled={isDragging}
            className={`rounded-full px-3 py-2 transition ${
              dropzoneMode === 'manual'
                ? 'bg-slate-100 text-slate-900'
                : 'bg-slate-800 text-slate-400 hover:bg-slate-700/80 hover:text-slate-100'
            } ${isDragging ? 'cursor-not-allowed opacity-50' : ''}`}
          >
            Manual
          </button>
          <button
            type="button"
            onClick={() => onDropzoneModeChange('portal')}
            disabled={isDragging}
            className={`rounded-full px-3 py-2 transition ${
              dropzoneMode === 'portal'
                ? 'bg-slate-100 text-slate-900'
                : 'bg-slate-800 text-slate-400 hover:bg-slate-700/80 hover:text-slate-100'
            } ${isDragging ? 'cursor-not-allowed opacity-50' : ''}`}
          >
            Portal
          </button>
        </div>
      </div>
    </header>
  )
}
