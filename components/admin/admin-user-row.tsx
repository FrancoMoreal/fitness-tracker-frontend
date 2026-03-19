import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Trash2, RotateCcw, Loader2 } from "lucide-react"
import type { UserData } from "@/services/admin.service"

interface AdminUserRowProps {
  user: UserData
  showRestore?: boolean
  isLoading: boolean
  onDelete?: (id: number) => void
  onRestore?: (id: number) => void
}

const ROLE_STYLES: Record<string, string> = {
  ADMIN: "border-destructive/50 text-destructive",
  USER:  "border-primary/50 text-primary",
}

const TYPE_LABELS: Record<string, string> = {
  MEMBER:  "Miembro",
  TRAINER: "Entrenador",
}

export function AdminUserRow({ user, showRestore, isLoading, onDelete, onRestore }: AdminUserRowProps) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border bg-card px-4 py-3">
      <div className="flex-1 min-w-0 space-y-0.5">
        <div className="flex items-center gap-2 flex-wrap">
          <p className="font-medium leading-tight">{user.username}</p>
          <Badge variant="outline" className={ROLE_STYLES[user.role] ?? ""}>
            {user.role}
          </Badge>
          {user.userType && (
            <Badge variant="outline" className="text-muted-foreground">
              {TYPE_LABELS[user.userType] ?? user.userType}
            </Badge>
          )}
          {!user.enabled && (
            <Badge variant="outline" className="border-yellow-500/50 text-yellow-600">
              Deshabilitado
            </Badge>
          )}
        </div>
        <p className="text-xs text-muted-foreground">{user.email}</p>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        {showRestore && onRestore && (
          <Button
            size="sm"
            variant="outline"
            className="border-green-500/50 text-green-600 hover:bg-green-500/10"
            disabled={isLoading}
            onClick={() => onRestore(user.id)}
          >
            {isLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <RotateCcw className="h-3.5 w-3.5" />}
          </Button>
        )}

        {!showRestore && onDelete && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                size="sm"
                variant="ghost"
                className="text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                disabled={isLoading}
              >
                {isLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>¿Eliminar usuario?</AlertDialogTitle>
                <AlertDialogDescription>
                  Vas a eliminar a <span className="font-semibold">{user.username}</span>. El usuario
                  quedará desactivado pero sus datos se conservan.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  onClick={() => onDelete(user.id)}
                >
                  Eliminar
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>
    </div>
  )
}