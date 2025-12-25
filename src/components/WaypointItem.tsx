import { Draggable } from '@hello-pangea/dnd'
import type { FC } from 'react'

export type Waypoint = {
  id: string
  title: string
  note: string
  hasDropzone: boolean
}

interface WaypointItemProps {
  waypoint: Waypoint
  index: number
  isDragging: boolean
  activeDropzoneId: string | null
  onDropzoneRef?: (id: string, node: HTMLDivElement | null) => void
}

export const WaypointItem: FC<WaypointItemProps> = ({
  waypoint,
  index,
  isDragging,
  activeDropzoneId,
  onDropzoneRef,
}) => {
  const dropzoneId = `dropzone-${waypoint.id}`
  const isDropzoneActive = activeDropzoneId === dropzoneId
  const dropzoneVisibility = isDragging
    ? 'pointer-events-none opacity-100'
    : 'pointer-events-none opacity-0'

  return (
    <Draggable draggableId={waypoint.id} index={index}>
      {(draggableProvided, draggableSnapshot) => (
        <div
          ref={draggableProvided.innerRef}
          {...draggableProvided.draggableProps}
          className="flex w-full flex-col gap-3"
          style={draggableProvided.draggableProps.style}
        >
          <div
            {...draggableProvided.dragHandleProps}
            className={`flex w-full flex-col gap-2 rounded-2xl border px-4 py-3 shadow-sm transition ${
              draggableSnapshot.isDragging
                ? 'border-cyan-400/80 bg-slate-900 text-white shadow-[0_20px_50px_rgba(34,211,238,0.25)]'
                : 'border-slate-800 bg-slate-900/80 text-slate-100'
            }`}
          >
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-base font-semibold">{waypoint.title}</p>
                <p className="text-xs uppercase tracking-[0.25em] text-slate-400">
                  {waypoint.note}
                </p>
              </div>
              <span className="text-[0.6rem] uppercase tracking-[0.3em] text-slate-400">
                Drag
              </span>
            </div>
          </div>
          {waypoint.hasDropzone ? (
            <div
              id={dropzoneId}
              ref={(node) => onDropzoneRef?.(waypoint.id, node)}
              data-dropzone-id={dropzoneId}
              data-dropzone-owner={waypoint.id}
              className={`flex w-full flex-col items-center justify-center gap-1 rounded-2xl border-2 border-dashed px-4 py-3 text-[0.6rem] uppercase tracking-[0.35em] transition ${dropzoneVisibility} ${
                isDropzoneActive
                  ? 'border-cyan-300 bg-cyan-300/20 text-cyan-100 shadow-[0_0_25px_rgba(34,211,238,0.35)]'
                  : 'border-slate-700/80 bg-slate-900/60 text-slate-500'
              }`}
            >
              <span>Dropzone</span>
              <span className="text-[0.5rem] uppercase tracking-[0.25em] text-slate-400">
                {dropzoneId}
              </span>
            </div>
          ) : null}
        </div>
      )}
    </Draggable>
  )
}
