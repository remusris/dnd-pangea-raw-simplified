import { Draggable } from '@hello-pangea/dnd'
import type { BaseItem } from './types'

type SimpleItemCardProps = {
  item: BaseItem
  index: number
  isNested?: boolean
}

export function SimpleItemCard({ item, index, isNested = false }: SimpleItemCardProps) {
  return (
    <Draggable draggableId={item.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          style={provided.draggableProps.style}
          className={`cursor-grab rounded-lg border px-4 py-3 transition-all active:cursor-grabbing ${
            snapshot.isDragging
              ? 'border-amber-400 bg-slate-800 shadow-lg shadow-amber-500/20'
              : isNested
                ? 'border-slate-600/50 bg-slate-800/60'
                : 'border-slate-700 bg-slate-900/80'
          } ${isNested ? 'text-sm' : ''}`}
        >
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                {!isNested && (
                  <span className="rounded bg-amber-600/20 px-2 py-0.5 text-[0.65rem] uppercase tracking-wider text-amber-300">
                    Simple
                  </span>
                )}
                <p className={`font-medium text-slate-100 ${isNested ? 'text-sm' : ''}`}>
                  {item.title}
                </p>
              </div>
              <p className={`mt-1 text-slate-400 ${isNested ? 'text-xs' : 'text-xs'}`}>
                {item.note}
              </p>
            </div>
            <span className="text-xs uppercase tracking-widest text-slate-500">
              Drag
            </span>
          </div>
        </div>
      )}
    </Draggable>
  )
}
