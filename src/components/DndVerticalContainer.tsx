import {
  DragDropContext,
  Droppable,
  type DragStart,
  type DropResult,
} from '@hello-pangea/dnd'
import type { FC } from 'react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { DndContextProvider, useDndContext } from './DndContext'
import { Header } from './Header'
import { WaypointItem, type Waypoint } from './WaypointItem'

interface DndVerticalContainerProps {
  initialWaypoints: Waypoint[]
}

const dropzonePrefix = 'dropzone-'
const dropzoneIdForWaypoint = (id: string) => `${dropzonePrefix}${id}`

function DndContent({ waypoints, setWaypoints }: { waypoints: Waypoint[]; setWaypoints: (waypoints: Waypoint[]) => void }) {
  const {
    isDragging,
    activeDropzoneId,
    activeDragId,
    dropzoneRefs,
    setIsDragging,
    setActiveDropzoneId,
    setActiveDragId,
  } = useDndContext()
  const isOverDropzone = activeDropzoneId !== null
  const pointerPosition = useRef<{ x: number; y: number } | null>(null)
  const rafId = useRef<number | null>(null)

  const updateActiveDropzoneFromPoint = useCallback(
    (clientX: number, clientY: number) => {
      let nextId: string | null = null
      const expansion = 0.25

      for (const [id, node] of dropzoneRefs.current.entries()) {
        if (!node || id === activeDragId) continue
        const rect = node.getBoundingClientRect()
        const marginX = rect.width * expansion * 0.5
        const marginY = rect.height * expansion * 0.5
        const left = rect.left - marginX
        const right = rect.right + marginX
        const top = rect.top - marginY
        const bottom = rect.bottom + marginY
        if (
          clientX >= left &&
          clientX <= right &&
          clientY >= top &&
          clientY <= bottom
        ) {
          nextId = dropzoneIdForWaypoint(id)
          break
        }
      }

      setActiveDropzoneId(nextId)
    },
    [activeDragId, dropzoneRefs, setActiveDropzoneId],
  )

  const handleDragStart = (start: DragStart) => {
    setIsDragging(true)
    setActiveDragId(start.draggableId)
    setActiveDropzoneId(null)
  }

  const handleDragEnd = (result: DropResult) => {
    setIsDragging(false)
    setActiveDragId(null)
    setActiveDropzoneId(null)

    if (!result.destination) return
    if (result.destination.droppableId !== 'main') return
    if (result.destination.index === result.source.index) return

    const next = Array.from(waypoints)
    const [moved] = next.splice(result.source.index, 1)
    next.splice(result.destination.index, 0, moved)
    setWaypoints(next)
  }

  useEffect(() => {
    if (!isDragging) return

    const handlePointerMove = (event: PointerEvent) => {
      pointerPosition.current = { x: event.clientX, y: event.clientY }
      if (rafId.current !== null) return
      rafId.current = window.requestAnimationFrame(() => {
        rafId.current = null
        const point = pointerPosition.current
        if (!point) return
        updateActiveDropzoneFromPoint(point.x, point.y)
      })
    }

    window.addEventListener('pointermove', handlePointerMove, { passive: true })

    return () => {
      window.removeEventListener('pointermove', handlePointerMove)
      if (rafId.current !== null) {
        window.cancelAnimationFrame(rafId.current)
        rafId.current = null
      }
    }
  }, [isDragging, updateActiveDropzoneFromPoint])

  return (
    <>
      <Header
        isDragging={isDragging}
        isOverDropzone={isOverDropzone}
      />

      <section className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 shadow-[0_35px_80px_rgba(15,23,42,0.45)]">
        <DragDropContext
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <Droppable droppableId="main">
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className={`space-y-4 rounded-2xl border border-dashed px-4 py-5 transition ${
                  snapshot.isDraggingOver
                    ? 'border-slate-500 bg-slate-900/80'
                    : 'border-slate-700/60'
                }`}
              >
                {waypoints.map((waypoint, index) => (
                  <WaypointItem
                    key={waypoint.id}
                    waypoint={waypoint}
                    index={index}
                  />
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </section>
    </>
  )
}

export const DndVerticalContainer: FC<DndVerticalContainerProps> = ({
  initialWaypoints,
}) => {
  const [waypoints, setWaypoints] = useState(initialWaypoints)

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-10 px-6 py-14">
        <DndContextProvider>
          <DndContent waypoints={waypoints} setWaypoints={setWaypoints} />
        </DndContextProvider>
      </div>
    </div>
  )
}

