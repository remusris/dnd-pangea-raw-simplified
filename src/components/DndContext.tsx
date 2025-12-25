import { createContext, useContext, useCallback, useRef, useState } from 'react'

interface DndContextValue {
  isDragging: boolean
  activeDropzoneId: string | null
  activeDragId: string | null
  setDropzoneRef: (id: string, node: HTMLDivElement | null) => void
  dropzoneRefs: React.MutableRefObject<Map<string, HTMLDivElement>>
  setIsDragging: (value: boolean) => void
  setActiveDropzoneId: (value: string | null) => void
  setActiveDragId: (value: string | null) => void
}

const DndContext = createContext<DndContextValue | null>(null)

export const useDndContext = () => {
  const context = useContext(DndContext)
  if (!context) {
    throw new Error('useDndContext must be used within DndContextProvider')
  }
  return context
}

interface DndContextProviderProps {
  children: React.ReactNode
}

export const DndContextProvider: React.FC<DndContextProviderProps> = ({
  children,
}) => {
  const [isDragging, setIsDragging] = useState(false)
  const [activeDropzoneId, setActiveDropzoneId] = useState<string | null>(null)
  const [activeDragId, setActiveDragId] = useState<string | null>(null)
  const dropzoneRefs = useRef(new Map<string, HTMLDivElement>())

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

  const value: DndContextValue = {
    isDragging,
    activeDropzoneId,
    activeDragId,
    setDropzoneRef,
    dropzoneRefs,
    setIsDragging,
    setActiveDropzoneId,
    setActiveDragId,
  }

  return <DndContext.Provider value={value}>{children}</DndContext.Provider>
}

