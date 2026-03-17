import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check, X, Loader2, Clock } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { es } from "date-fns/locale"
import type { AssignmentRequest } from "@/services/assignment.service"

interface PendingRequestCardProps {
  request: AssignmentRequest
  isLoading: boolean
  onAccept: (requestId: number) => void
  onReject: (requestId: number) => void
}

export function PendingRequestCard({
  request,
  isLoading,
  onAccept,
  onReject,
}: PendingRequestCardProps) {
  const timeAgo = formatDistanceToNow(new Date(request.requestedAt), {
    addSuffix: true,
    locale: es,
  })

  return (
    <Card className="border-yellow-200 bg-yellow-50/50 dark:border-yellow-900 dark:bg-yellow-950/20">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 font-semibold text-primary">
              {request.memberName
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()
                .slice(0, 2)}
            </div>
            <div>
              <p className="font-medium leading-tight">{request.memberName}</p>
              <div className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                <span>{timeAgo}</span>
              </div>
            </div>
          </div>
          <Badge
            variant="outline"
            className="border-yellow-400 bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-400"
          >
            Pendiente
          </Badge>
        </div>
      </CardHeader>

      {request.memberMessage && (
        <CardContent className="pb-3">
          <p className="rounded-md bg-background/70 px-3 py-2 text-sm italic text-muted-foreground">
            "{request.memberMessage}"
          </p>
        </CardContent>
      )}

      <CardFooter className="gap-2 pt-0">
        <Button
          size="sm"
          className="flex-1"
          disabled={isLoading}
          onClick={() => onAccept(request.id)}
        >
          {isLoading ? (
            <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
          ) : (
            <Check className="mr-2 h-3.5 w-3.5" />
          )}
          Aceptar
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="flex-1 border-destructive/50 text-destructive hover:bg-destructive/10"
          disabled={isLoading}
          onClick={() => onReject(request.id)}
        >
          {isLoading ? (
            <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
          ) : (
            <X className="mr-2 h-3.5 w-3.5" />
          )}
          Rechazar
        </Button>
      </CardFooter>
    </Card>
  )
}