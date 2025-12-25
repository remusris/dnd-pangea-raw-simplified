type StatusBadgeProps = {
  isActive: boolean
  activeLabel: string
  inactiveLabel: string
  activeColors: string
  inactiveColors: string
}

export function StatusBadge({
  isActive,
  activeLabel,
  inactiveLabel,
  activeColors,
  inactiveColors,
}: StatusBadgeProps) {
  return (
    <span
      className={`rounded-full px-4 py-2 text-[0.6rem] uppercase tracking-[0.3em] ${
        isActive ? activeColors : inactiveColors
      }`}
    >
      {isActive ? activeLabel : inactiveLabel}
    </span>
  )
}
