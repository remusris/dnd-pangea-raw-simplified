import { createFileRoute } from '@tanstack/react-router'
import { VerticalDnD } from '../components'

export const Route = createFileRoute('/')({ component: App })

function App() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <VerticalDnD />
    </div>
  )
}
