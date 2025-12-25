import {
  DragDropContext,
  Droppable,
  type DropResult,
} from '@hello-pangea/dnd'
import { useState } from 'react'
import { ContainerItemCard } from './ContainerItemCard'
import { SimpleItemCard } from './SimpleItemCard'
import { type DnDItem, type ContainerItem, isContainerItem } from './types'

const initialItems: DnDItem[] = [
  {
    id: 'container-1',
    title: 'Waypoint Alpha',
    note: 'Container with nested items',
    type: 'container',
    children: [
      { id: 'nested-1', title: 'Sub-task A', note: 'First nested item', type: 'simple' },
      { id: 'nested-2', title: 'Sub-task B', note: 'Second nested item', type: 'simple' },
    ],
  },
  {
    id: 'simple-1',
    title: 'Waypoint Beta',
    note: 'Simple item - no nesting',
    type: 'simple',
  },
  {
    id: 'container-2',
    title: 'Waypoint Gamma',
    note: 'Another container',
    type: 'container',
    children: [
      { id: 'nested-3', title: 'Sub-task C', note: 'Third nested item', type: 'simple' },
    ],
  },
  {
    id: 'simple-2',
    title: 'Waypoint Delta',
    note: 'Another simple item',
    type: 'simple',
  },
  {
    id: 'container-3',
    title: 'Waypoint Epsilon',
    note: 'Empty container',
    type: 'container',
    children: [],
  },
]

export function VerticalDnD() {
  const [items, setItems] = useState<DnDItem[]>(initialItems)

  const handleDragEnd = (result: DropResult) => {
    const { source, destination, draggableId } = result

    if (!destination) return

    const sourceDroppableId = source.droppableId
    const destDroppableId = destination.droppableId

    // Same position, no change
    if (sourceDroppableId === destDroppableId && source.index === destination.index) {
      return
    }

    setItems((prevItems) => {
      const newItems = structuredClone(prevItems)

      // Find and remove the dragged item from its source
      let draggedItem: DnDItem | null = null

      if (sourceDroppableId === 'main') {
        // Dragged from main list
        draggedItem = newItems[source.index]
        newItems.splice(source.index, 1)
      } else {
        // Dragged from a nested list
        const sourceContainerId = sourceDroppableId.replace('nested-', '')
        const sourceContainer = newItems.find(
          (item) => item.id === sourceContainerId
        ) as ContainerItem | undefined

        if (sourceContainer && isContainerItem(sourceContainer)) {
          draggedItem = sourceContainer.children[source.index]
          sourceContainer.children.splice(source.index, 1)
        }
      }

      if (!draggedItem) return prevItems

      // Insert the dragged item at the destination
      if (destDroppableId === 'main') {
        // Dropping into main list
        newItems.splice(destination.index, 0, draggedItem)
      } else {
        // Dropping into a nested list
        const destContainerId = destDroppableId.replace('nested-', '')
        const destContainer = newItems.find(
          (item) => item.id === destContainerId
        ) as ContainerItem | undefined

        if (destContainer && isContainerItem(destContainer)) {
          // Convert to simple item if it was a container (flatten it)
          const itemToInsert: DnDItem = isContainerItem(draggedItem)
            ? {
                id: draggedItem.id,
                title: draggedItem.title,
                note: draggedItem.note,
                type: 'simple',
              }
            : draggedItem

          destContainer.children.splice(destination.index, 0, itemToInsert)
        }
      }

      return newItems
    })
  }

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-8 px-6 py-12">
      <header className="flex flex-col gap-3">
        <p className="text-xs uppercase tracking-[0.35em] text-slate-400">
          Nested Drag & Drop
        </p>
        <h1 className="text-3xl font-semibold text-slate-100">
          Vertical List with Nested Dropzones
        </h1>
        <p className="max-w-2xl text-sm text-slate-400">
          Drag items to reorder. Container items (blue border) have nested dropzones.
          Drag any item into a container's nested area, or drag nested items back to the main list.
        </p>
      </header>

      <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="main" type="ITEM">
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className={`space-y-3 rounded-xl border-2 border-dashed p-4 transition-colors ${
                  snapshot.isDraggingOver
                    ? 'border-cyan-500/50 bg-cyan-950/20'
                    : 'border-slate-700/50'
                }`}
              >
                {items.map((item, index) =>
                  isContainerItem(item) ? (
                    <ContainerItemCard key={item.id} item={item} index={index} />
                  ) : (
                    <SimpleItemCard key={item.id} item={item} index={index} />
                  )
                )}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </section>
    </div>
  )
}
