import {
  DragDropContext,
  Draggable,
  Droppable,
  type DragStart,
  type DropResult,
} from '@hello-pangea/dnd'
import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'

export const Route = createFileRoute('/')({ component: App })

type ItemType = 'SIMPLE' | 'CONTAINER'

interface Item {
  id: string
  content: string
  type: ItemType
}

const initialItems: Item[] = [
  { id: 'item-1', content: 'Simple Task', type: 'SIMPLE' },
  { id: 'item-2', content: 'Project Folder', type: 'CONTAINER' },
  { id: 'item-3', content: 'Another Simple Task', type: 'SIMPLE' },
  { id: 'item-4', content: 'Archive', type: 'CONTAINER' },
  { id: 'item-5', content: 'Final Task', type: 'SIMPLE' },
]

function App() {
  const [items, setItems] = useState(initialItems)
  const [isDraggingContainer, setIsDraggingContainer] = useState(false)

  const handleDragStart = (start: DragStart) => {
    const item = items.find((i) => i.id === start.draggableId)
    if (item?.type === 'CONTAINER') {
      setIsDraggingContainer(true)
    }
  }

  const handleDragEnd = (result: DropResult) => {
    setIsDraggingContainer(false)

    if (!result.destination) return

    // Handle reordering in the main list
    if (result.destination.droppableId === 'main-list') {
      const newItems = Array.from(items)
      const [removed] = newItems.splice(result.source.index, 1)
      newItems.splice(result.destination.index, 0, removed)
      setItems(newItems)
    }

    // You can add logic here for handling drops into nested zones
    // e.g. if (result.destination.droppableId.startsWith('nested-')) { ... }
    console.log('Dropped into:', result.destination.droppableId)
  }

  return (
    <div className="min-h-screen bg-slate-50 p-8 text-slate-900">
      <div className="mx-auto max-w-lg space-y-6">
        <header className="space-y-2">
          <h1 className="text-2xl font-bold">Mixed Item Types</h1>
          <p className="text-slate-500">
            Drag items. 'Container' items have a nested drop zone that lights up
            on hover.
          </p>
        </header>

        <DragDropContext
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <Droppable droppableId="main-list">
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className={`flex flex-col gap-3 rounded-xl border-2 border-dashed p-4 transition-colors ${
                  snapshot.isDraggingOver
                    ? 'border-blue-400 bg-blue-50/50'
                    : 'border-slate-200'
                }`}
              >
                {items.map((item, index) => (
                  <Draggable key={item.id} draggableId={item.id} index={index}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        style={provided.draggableProps.style}
                        className={`group rounded-lg border bg-white p-4 shadow-sm transition-all ${
                          snapshot.isDragging
                            ? 'ring-2 ring-blue-400 shadow-lg z-50 pointer-events-none'
                            : 'border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-slate-700">
                            {item.content}
                          </span>
                          <span className="rounded bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-500">
                            {item.type}
                          </span>
                        </div>

                        {item.type === 'CONTAINER' && (
                          <Droppable
                            droppableId={`nested-${item.id}`}
                            isDropDisabled={isDraggingContainer}
                          >
                            {(nestedProvided, nestedSnapshot) => (
                              <div
                                ref={nestedProvided.innerRef}
                                {...nestedProvided.droppableProps}
                                className={`mt-4 flex h-24 items-center justify-center rounded-md border-2 border-dashed transition-all ${
                                  nestedSnapshot.isDraggingOver
                                    ? 'border-emerald-500 bg-emerald-50 text-emerald-600'
                                    : 'border-slate-200 bg-slate-50 text-slate-400'
                                }`}
                              >
                                <span className="text-xs font-medium uppercase tracking-wider">
                                  {nestedSnapshot.isDraggingOver
                                    ? 'Drop Here'
                                    : 'Nested Zone'}
                                </span>
                                {nestedProvided.placeholder}
                              </div>
                            )}
                          </Droppable>
                        )}
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>
    </div>
  )
}
