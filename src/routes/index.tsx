import {
  DragDropContext,
  Draggable,
  Droppable,
  type DragUpdate,
  type DropResult,
} from '@hello-pangea/dnd'
import { createFileRoute } from '@tanstack/react-router'
import { useCallback, useEffect, useRef, useState } from 'react'

export const Route = createFileRoute('/')({ component: App })

type Waypoint = {
  id: string
  title: string
  note: string
}

const initialWaypoints: Waypoint[] = [
  { id: 'waypoint-1', title: 'Mistral Anchor', note: 'Secure the relay' },
  { id: 'waypoint-2', title: 'Shatterline', note: 'Hold the breach' },
  { id: 'waypoint-3', title: 'Ivory Canal', note: 'Guard the convoy' },
  { id: 'waypoint-4', title: 'Obsidian Gate', note: 'Seal the rift' },
  { id: 'waypoint-5', title: 'Sunken Loom', note: 'Recover the cache' },
]

function App() {
  const [waypoints, setWaypoints] = useState(initialWaypoints)
  const [isDragging, setIsDragging] = useState(false)
  const [pointerX, setPointerX] = useState<number | null>(null)
  const [rootRight, setRootRight] = useState<number | null>(null)
  const [activeDropzoneId, setActiveDropzoneId] = useState<string | null>(null)
  const droppableRef = useRef<HTMLDivElement | null>(null)

  const updateRootRight = useCallback(() => {
    if (!droppableRef.current) return
    const rect = droppableRef.current.getBoundingClientRect()
    setRootRight(rect.right)
  }, [])

  useEffect(() => {
    updateRootRight()
    window.addEventListener('resize', updateRootRight)
    return () => window.removeEventListener('resize', updateRootRight)
  }, [updateRootRight])

  useEffect(() => {
    if (!isDragging) return
    const handlePointerMove = (event: PointerEvent) => {
      setPointerX(event.clientX)
    }
    const handleMouseMove = (event: MouseEvent) => {
      setPointerX(event.clientX)
    }
    const handleTouchMove = (event: TouchEvent) => {
      if (event.touches.length > 0) {
        setPointerX(event.touches[0].clientX)
      }
    }

    window.addEventListener('pointermove', handlePointerMove)
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('touchmove', handleTouchMove, { passive: true })
    return () => {
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('touchmove', handleTouchMove)
    }
  }, [isDragging])

  const isBeyondRoot =
    rootRight !== null && pointerX !== null && pointerX > rootRight
  const isMainDropDisabled = isDragging && isBeyondRoot
  const isOverDropzone = activeDropzoneId !== null

  const handleDragStart = () => {
    setIsDragging(true)
    setActiveDropzoneId(null)
    updateRootRight()
  }

  const handleDragUpdate = (update: DragUpdate) => {
    const destination = update.destination
    if (!destination) {
      setActiveDropzoneId(null)
      return
    }
    const { droppableId } = destination
    setActiveDropzoneId(droppableId.startsWith('dropzone-') ? droppableId : null)
  }

  const handleDragEnd = (result: DropResult) => {
    setIsDragging(false)
    setPointerX(null)
    setActiveDropzoneId(null)

    if (!result.destination) return
    if (result.destination.droppableId !== 'main') return
    if (result.destination.index === result.source.index) return

    const next = Array.from(waypoints)
    const [moved] = next.splice(result.source.index, 1)
    next.splice(result.destination.index, 0, moved)
    setWaypoints(next)
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-10 px-6 py-14">
        <header className="flex flex-col gap-4">
          <p className="text-xs uppercase tracking-[0.35em] text-slate-400">
            Pangea drag lanes
          </p>
          <h1 className="text-3xl font-semibold text-slate-100 md:text-4xl">
            Vertical sort with right-hand dropzones
          </h1>
          <p className="max-w-2xl text-sm text-slate-300 md:text-base">
            Drag a waypoint to reorder the main list. When your cursor crosses the
            right boundary, the main list locks and the dropzones light up.
          </p>
          <div className="flex flex-wrap items-center gap-3 text-[0.6rem] uppercase tracking-[0.3em]">
            <span
              className={`rounded-full px-4 py-2 ${
                isMainDropDisabled
                  ? 'bg-amber-400/15 text-amber-200'
                  : 'bg-emerald-400/15 text-emerald-200'
              }`}
            >
              Main list {isMainDropDisabled ? 'locked' : 'active'}
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
          </div>
        </header>

        <section className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 shadow-[0_35px_80px_rgba(15,23,42,0.45)]">
          <DragDropContext
            onDragStart={handleDragStart}
            onDragUpdate={handleDragUpdate}
            onDragEnd={handleDragEnd}
          >
            <Droppable droppableId="main" isDropDisabled={isMainDropDisabled}>
              {(provided, snapshot) => (
                <div
                  ref={(node) => {
                    droppableRef.current = node
                    provided.innerRef(node)
                  }}
                  {...provided.droppableProps}
                  className={`space-y-4 rounded-2xl border border-dashed px-4 py-5 transition ${
                    snapshot.isDraggingOver
                      ? 'border-slate-500 bg-slate-900/80'
                      : 'border-slate-700/60'
                  }`}
                >
                  {waypoints.map((waypoint, index) => (
                    <Draggable key={waypoint.id} draggableId={waypoint.id} index={index}>
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
                          <Droppable
                            droppableId={`dropzone-${waypoint.id}`}
                            isDropDisabled={!isBeyondRoot || draggableSnapshot.isDragging}
                          >
                            {(dropProvided, dropSnapshot) => (
                              <div
                                id={`dropzone-${waypoint.id}`}
                                ref={dropProvided.innerRef}
                                {...dropProvided.droppableProps}
                                className={`absolute inset-y-0 left-full ml-4 flex w-40 flex-col items-center justify-center gap-1 rounded-2xl border-2 border-dashed text-[0.6rem] uppercase tracking-[0.35em] transition ${
                                  isDragging
                                    ? 'opacity-100'
                                    : 'pointer-events-none opacity-0'
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
                                  {`dropzone-${waypoint.id}`}
                                </span>
                                {dropProvided.placeholder}
                              </div>
                            )}
                          </Droppable>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </section>
      </div>
    </div>
  )
}
