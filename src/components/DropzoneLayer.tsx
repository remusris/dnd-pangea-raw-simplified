import { Droppable } from '@hello-pangea/dnd'
import type { FC, MutableRefObject, RefObject } from 'react'
import { useCallback, useEffect, useRef, useState } from 'react'
import type { Waypoint } from './WaypointItem'

type DropzonePosition = {
  top: number
  left: number
  width: number
  height: number
}

interface DropzoneLayerProps {
  waypoints: Waypoint[]
  dropzoneRefs: MutableRefObject<Map<string, HTMLDivElement>>
  containerRef: RefObject<HTMLDivElement>
  isDragging: boolean
  activeDragId: string | null
}

const dropzoneIdForWaypoint = (id: string) => `dropzone-${id}`

export const DropzoneLayer: FC<DropzoneLayerProps> = ({
  waypoints,
  dropzoneRefs,
  containerRef,
  isDragging,
  activeDragId,
}) => {
  const [positions, setPositions] = useState<Record<string, DropzonePosition>>({})
  const positionsRef = useRef<Record<string, DropzonePosition>>({})

  const updatePositions = useCallback(() => {
    const container = containerRef.current
    if (!container) return

    const containerRect = container.getBoundingClientRect()
    const next: Record<string, DropzonePosition> = {}

    dropzoneRefs.current.forEach((node, id) => {
      if (!node) return
      const rect = node.getBoundingClientRect()
      next[id] = {
        top: rect.top - containerRect.top + container.scrollTop,
        left: rect.left - containerRect.left + container.scrollLeft,
        width: rect.width,
        height: rect.height,
      }
    })

    const previous = positionsRef.current
    let changed = Object.keys(next).length !== Object.keys(previous).length

    if (!changed) {
      for (const [id, rect] of Object.entries(next)) {
        const prevRect = previous[id]
        if (
          !prevRect ||
          rect.top !== prevRect.top ||
          rect.left !== prevRect.left ||
          rect.width !== prevRect.width ||
          rect.height !== prevRect.height
        ) {
          changed = true
          break
        }
      }
    }

    if (changed) {
      positionsRef.current = next
      setPositions(next)
    }
  }, [containerRef, dropzoneRefs])

  useEffect(() => {
    updatePositions()
  }, [updatePositions, waypoints])

  useEffect(() => {
    if (!isDragging) return
    let frameId: number | null = null

    const loop = () => {
      updatePositions()
      frameId = window.requestAnimationFrame(loop)
    }

    frameId = window.requestAnimationFrame(loop)

    return () => {
      if (frameId !== null) {
        window.cancelAnimationFrame(frameId)
      }
    }
  }, [isDragging, updatePositions])

  return (
    <div className="pointer-events-none absolute inset-0">
      {waypoints.map((waypoint) => {
        if (!waypoint.hasDropzone) return null
        const position = positions[waypoint.id]
        const hasPosition = Boolean(position)
        const dropzoneId = dropzoneIdForWaypoint(waypoint.id)

        return (
          <Droppable
            key={dropzoneId}
            droppableId={dropzoneId}
            isDropDisabled={activeDragId === waypoint.id}
          >
            {(dropProvided, dropSnapshot) => (
              <div
                ref={dropProvided.innerRef}
                {...dropProvided.droppableProps}
                data-dropzone-id={dropzoneId}
                className={`flex w-full flex-col items-center justify-center gap-1 rounded-2xl border-2 border-dashed px-4 py-3 text-[0.6rem] uppercase tracking-[0.35em] transition ${
                  isDragging && hasPosition ? 'opacity-100' : 'opacity-0'
                } ${
                  dropSnapshot.isDraggingOver
                    ? 'border-cyan-300 bg-cyan-300/20 text-cyan-100 shadow-[0_0_25px_rgba(34,211,238,0.35)]'
                    : 'border-slate-700/80 bg-slate-900/60 text-slate-500'
                }`}
                style={{
                  position: 'absolute',
                  top: position?.top ?? 0,
                  left: position?.left ?? 0,
                  width: position?.width ?? 0,
                  height: position?.height ?? 0,
                }}
              >
                <span>Dropzone</span>
                <span className="text-[0.5rem] uppercase tracking-[0.25em] text-slate-400">
                  {dropzoneId}
                </span>
                {dropProvided.placeholder}
              </div>
            )}
          </Droppable>
        )
      })}
    </div>
  )
}
