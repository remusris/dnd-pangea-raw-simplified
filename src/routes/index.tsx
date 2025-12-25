import { createFileRoute } from '@tanstack/react-router'
import { DndVerticalContainer } from '../components/DndVerticalContainer'
import type { Waypoint } from '../components/WaypointItem'

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

function App() {
  return <DndVerticalContainer initialWaypoints={initialWaypoints} />
}
