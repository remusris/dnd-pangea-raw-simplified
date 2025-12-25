import { Droppable } from '@hello-pangea/dnd'

type WaypointDropzoneProps = {
  waypointId: string
  isDropDisabled: boolean
  isDragging: boolean
  isBeyondRoot: boolean
}

export function WaypointDropzone({
  waypointId,
  isDropDisabled,
  isDragging,
  isBeyondRoot,
}: WaypointDropzoneProps) {
  const droppableId = `dropzone-${waypointId}`

  return (
    <Droppable droppableId={droppableId} isDropDisabled={isDropDisabled}>
      {(dropProvided, dropSnapshot) => (
        <div
          id={droppableId}
          ref={dropProvided.innerRef}
          {...dropProvided.droppableProps}
          className={`absolute inset-y-0 left-full ml-4 flex w-40 flex-col items-center justify-center gap-1 rounded-2xl border-2 border-dashed text-[0.6rem] uppercase tracking-[0.35em] transition ${
            isDragging ? 'opacity-100' : 'pointer-events-none opacity-0'
          } ${
            dropSnapshot.isDraggingOver
              ? 'border-cyan-300 bg-cyan-300/20 text-cyan-100 shadow-[0_0_25px_rgba(34,211,238,0.35)]'
              : isBeyondRoot
                ? 'border-cyan-300/80 bg-cyan-400/15 text-cyan-200'
                : 'border-slate-700/80 bg-slate-900/60 text-slate-500'
          }`}
        >
          <span>Dropzone</span>
          <span className="text-[0.5rem] uppercase tracking-[0.25em] text-slate-400">
            {droppableId}
          </span>
          {dropProvided.placeholder}
        </div>
      )}
    </Droppable>
  )
}
