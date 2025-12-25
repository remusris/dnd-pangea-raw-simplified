import {
  DragDropContext,
  Droppable,
  type DragStart,
  type DropResult,
} from '@hello-pangea/dnd'
import { createFileRoute } from '@tanstack/react-router'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Header } from '../components/Header'
import { WaypointItem, type Waypoint } from '../components/WaypointItem'

export const Route = createFileRoute('/')({ component: App })

const initialWaypoints: Waypoint[] = [
  {
    id: 'waypoint-1',
    title: 'Mistral Anchor',
    note: 'Secure the relay',
    hasDropzone: true,
  },
  {
    id: 'waypoint-2',
    title: 'Shatterline',
    note: 'Hold the breach',
    hasDropzone: false,
  },
  {
    id: 'waypoint-3',
    title: 'Ivory Canal',
    note: 'Guard the convoy',
    hasDropzone: true,
  },
  {
    id: 'waypoint-4',
    title: 'Obsidian Gate',
    note: 'Seal the rift',
    hasDropzone: false,
  },
  {
    id: 'waypoint-5',
    title: 'Sunken Loom',
    note: 'Recover the cache',
    hasDropzone: true,
  },
  {
    id: 'waypoint-6',
    title: 'Cinder Vault',
    note: 'Anchor the beacon',
    hasDropzone: false,
  },
]

const dropzonePrefix = 'dropzone-'
const dropzoneIdForWaypoint = (id: string) => `${dropzonePrefix}${id}`

function App() {
  const [waypoints, setWaypoints] = useState(initialWaypoints)
  const [isDragging, setIsDragging] = useState(false)
  const [activeDragId, setActiveDragId] = useState<string | null>(null)
  const [activeDropzoneId, setActiveDropzoneId] = useState<string | null>(null)
  const isOverDropzone = activeDropzoneId !== null
  const dropzoneRefs = useRef(new Map<string, HTMLDivElement>())
  const pointerPosition = useRef<{ x: number; y: number } | null>(null)
  const rafId = useRef<number | null>(null)

  const setDropzoneRef = useCallback(
    (id: string, node: HTMLDivElement | null) => {
      const map = dropzoneRefs.current
      if (node) {
        map.set(id, node)
      } else {
        map.delete(id)
      }
    },
    [],
  )

  const updateActiveDropzoneFromPoint = useCallback(
    (clientX: number, clientY: number) => {
      let nextId: string | null = null

      for (const [id, node] of dropzoneRefs.current.entries()) {
        if (!node || id === activeDragId) continue
        const rect = node.getBoundingClientRect()
        if (
          clientX >= rect.left &&
          clientX <= rect.right &&
          clientY >= rect.top &&
          clientY <= rect.bottom
        ) {
          nextId = dropzoneIdForWaypoint(id)
          break
        }
      }

      setActiveDropzoneId((prev) => (prev === nextId ? prev : nextId))
    },
    [activeDragId],
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
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-10 px-6 py-14">
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
                      isDragging={isDragging}
                      activeDropzoneId={activeDropzoneId}
                      onDropzoneRef={setDropzoneRef}
                    />
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
