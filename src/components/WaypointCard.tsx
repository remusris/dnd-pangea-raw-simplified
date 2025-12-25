import { Draggable } from '@hello-pangea/dnd'
import { WaypointDropzone } from './WaypointDropzone'
import type { Waypoint } from './types'

type WaypointCardProps = {
  waypoint: Waypoint
  index: number
  isDragging: boolean
  isBeyondRoot: boolean
}

export function WaypointCard({
  waypoint,
  index,
  isDragging,
  isBeyondRoot,
}: WaypointCardProps) {
  return (
    <Draggable draggableId={waypoint.id} index={index}>
      {(draggableProvided, draggableSnapshot) => (
        <div
          ref={draggableProvided.innerRef}
          {...draggableProvided.draggableProps}
          className="relative w-full"
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
          <WaypointDropzone
            waypointId={waypoint.id}
            isDropDisabled={!isBeyondRoot || draggableSnapshot.isDragging}
            isDragging={isDragging}
            isBeyondRoot={isBeyondRoot}
          />
        </div>
      )}
    </Draggable>
  )
}
