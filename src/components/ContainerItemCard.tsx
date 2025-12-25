import { Draggable, Droppable } from '@hello-pangea/dnd'
import type { ContainerItem } from './types'
import { SimpleItemCard } from './SimpleItemCard'

type ContainerItemCardProps = {
  item: ContainerItem
  index: number
}

export function ContainerItemCard({ item, index }: ContainerItemCardProps) {
  return (
    <Draggable draggableId={item.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          style={provided.draggableProps.style}
          className="w-full"
        >
          <div
            className={`rounded-xl border-2 transition-all ${
              snapshot.isDragging
                ? 'border-cyan-400 bg-slate-800 shadow-lg shadow-cyan-500/20'
                : 'border-cyan-600/40 bg-slate-900/80'
            }`}
          >
            {/* Header - Drag Handle */}
            <div
              {...provided.dragHandleProps}
              className="flex cursor-grab items-center justify-between gap-4 rounded-t-xl border-b border-slate-700/50 px-4 py-3 active:cursor-grabbing"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="rounded bg-cyan-600/20 px-2 py-0.5 text-[0.65rem] uppercase tracking-wider text-cyan-300">
                    Container
                  </span>
                  <p className="font-semibold text-slate-100">{item.title}</p>
                </div>
                <p className="mt-1 text-xs text-slate-400">{item.note}</p>
              </div>
              <span className="text-xs uppercase tracking-widest text-slate-500">
                Drag
              </span>
            </div>

            {/* Nested Dropzone */}
            <Droppable droppableId={`nested-${item.id}`} type="ITEM">
              {(droppableProvided, droppableSnapshot) => (
                <div
                  ref={droppableProvided.innerRef}
                  {...droppableProvided.droppableProps}
                  className={`min-h-[60px] rounded-b-xl border-2 border-dashed p-3 transition-all ${
                    droppableSnapshot.isDraggingOver
                      ? 'border-emerald-400/60 bg-emerald-950/30'
                      : 'border-slate-700/40 bg-slate-950/40'
                  }`}
                >
                  {item.children.length === 0 ? (
                    <div className="flex h-10 items-center justify-center">
                      <span className="text-xs text-slate-500">
                        Drop items here
                      </span>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {item.children.map((child, childIndex) => (
                        <SimpleItemCard
                          key={child.id}
                          item={child}
                          index={childIndex}
                          isNested
                        />
                      ))}
                    </div>
                  )}
                  {droppableProvided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        </div>
      )}
    </Draggable>
  )
}
