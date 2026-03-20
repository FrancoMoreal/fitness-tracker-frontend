"use client"

import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface PaginationControlsProps {
  currentPage: number
  totalPages: number
  totalResults: number
  pageSize: number
  onPageChange: (page: number) => void
}

export function PaginationControls({
  currentPage,
  totalPages,
  totalResults,
  pageSize,
  onPageChange,
}: PaginationControlsProps) {
  if (totalPages <= 1) return null

  const from = (currentPage - 1) * pageSize + 1
  const to = Math.min(currentPage * pageSize, totalResults)

  return (
    <div className="flex items-center justify-between gap-4 pt-2">
      <p className="text-sm text-muted-foreground">
        Mostrando <span className="font-medium">{from}–{to}</span> de{" "}
        <span className="font-medium">{totalResults}</span>
      </p>

      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        {Array.from({ length: totalPages }, (_, i) => i + 1)
          .filter((page) =>
            page === 1 ||
            page === totalPages ||
            Math.abs(page - currentPage) <= 1
          )
          .reduce<(number | "...")[]>((acc, page, idx, arr) => {
            if (idx > 0 && (arr[idx - 1] as number) + 1 < page) acc.push("...")
            acc.push(page)
            return acc
          }, [])
          .map((item, idx) =>
            item === "..." ? (
              <span key={`ellipsis-${idx}`} className="px-1 text-sm text-muted-foreground">…</span>
            ) : (
              <Button
                key={item}
                variant={currentPage === item ? "default" : "outline"}
                size="icon"
                className="h-8 w-8 text-sm"
                onClick={() => onPageChange(item as number)}
              >
                {item}
              </Button>
            )
          )}

        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}