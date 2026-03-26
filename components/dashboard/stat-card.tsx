import { Card, CardContent, CardHeader } from "@/components/ui/card"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface StatCardProps {
  label: string
  value: number | string
  icon: React.ReactNode
  href?: string
  highlight?: boolean
  description?: string
}

export function StatCard({ label, value, icon, href, highlight, description }: StatCardProps) {
  const content = (
    <Card className={cn(
      "transition-shadow",
      href && "hover:shadow-md cursor-pointer",
      highlight && "border-primary/50 bg-primary/5"
    )}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">{label}</p>
          <div className={cn(
            "flex h-9 w-9 items-center justify-center rounded-full",
            highlight ? "bg-primary/20" : "bg-muted"
          )}>
            {icon}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-3xl font-bold">{value}</p>
        {description && (
          <p className="mt-1 text-xs text-muted-foreground">{description}</p>
        )}
      </CardContent>
    </Card>
  )

  if (href) return <Link href={href}>{content}</Link>
  return content
}