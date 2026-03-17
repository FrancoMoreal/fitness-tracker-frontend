interface ProfileInfoItemProps {
  label: string
  value?: string | number | null
  icon?: React.ReactNode
}

export function ProfileInfoItem({ label, value, icon }: ProfileInfoItemProps) {
  return (
    <div className="flex items-center gap-3 rounded-lg bg-muted/50 px-4 py-3">
      {icon && (
        <div className="shrink-0 text-muted-foreground">{icon}</div>
      )}
      <div className="flex-1 min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="font-medium">{value ?? "—"}</p>
      </div>
    </div>
  )
}