export type ItemType = 'container' | 'simple'

export type BaseItem = {
  id: string
  title: string
  note: string
  type: ItemType
}

export type SimpleItem = BaseItem & {
  type: 'simple'
}

export type ContainerItem = BaseItem & {
  type: 'container'
  children: BaseItem[]
}

export type DnDItem = SimpleItem | ContainerItem

export function isContainerItem(item: DnDItem): item is ContainerItem {
  return item.type === 'container'
}
