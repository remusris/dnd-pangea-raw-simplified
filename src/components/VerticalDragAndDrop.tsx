import {
  DragDropContext,
  Droppable,
  type DragUpdate,
  type DropResult,
} from '@hello-pangea/dnd'
import { useCallback, useEffect, useRef, useState } from 'react'
import { StatusBadge } from './StatusBadge'
import { WaypointCard } from './WaypointCard'
import type { Waypoint } from './types'

const initialWaypoints: Waypoint[] = [
  { id: 'waypoint-1', title: 'Mistral Anchor', note: 'Secure the relay' },
  { id: 'waypoint-2', title: 'Shatterline', note: 'Hold the breach' },
  { id: 'waypoint-3', title: 'Ivory Canal', note: 'Guard the convoy' },
  { id: 'waypoint-4', title: 'Obsidian Gate', note: 'Seal the rift' },
  { id: 'waypoint-5', title: 'Sunken Loom', note: 'Recover the cache' },
]

export function VerticalDragAndDrop() {
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
        <div className="flex flex-wrap items-center gap-3">
          <StatusBadge
            isActive={isMainDropDisabled}
            activeLabel="Main list locked"
            inactiveLabel="Main list active"
            activeColors="bg-amber-400/15 text-amber-200"
            inactiveColors="bg-emerald-400/15 text-emerald-200"
          />
          <StatusBadge
            isActive={isOverDropzone}
            activeLabel="Dropzone entered"
            inactiveLabel="Dropzone idle"
            activeColors="bg-cyan-400/15 text-cyan-200"
            inactiveColors="bg-slate-800 text-slate-400"
          />
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
                  <WaypointCard
                    key={waypoint.id}
                    waypoint={waypoint}
                    index={index}
                    isDragging={isDragging}
                    isBeyondRoot={isBeyondRoot}
                  />
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </section>
    </div>
  )
}
