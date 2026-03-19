"use client"

import { useState, useMemo } from "react"

interface UsePaginationSearchProps<T> {
  data: T[]
  searchFields: (item: T) => string[]
  pageSize?: number
}

export function usePaginationSearch<T>({
  data,
  searchFields,
  pageSize = 10,
}: UsePaginationSearchProps<T>) {
  const [search, setSearch] = useState("")
  const [currentPage, setCurrentPage] = useState(1)

  const filtered = useMemo(() => {
    if (!search.trim()) return data
    const q = search.toLowerCase()
    return data.filter((item) =>
      searchFields(item).some((field) => field?.toLowerCase().includes(q))
    )
  }, [data, search, searchFields])

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))

  const safePage = Math.min(currentPage, totalPages)

  const paginated = useMemo(() => {
    const start = (safePage - 1) * pageSize
    return filtered.slice(start, start + pageSize)
  }, [filtered, safePage, pageSize])

  const handleSearch = (value: string) => {
    setSearch(value)
    setCurrentPage(1)
  }

  return {
    search,
    setSearch: handleSearch,
    currentPage: safePage,
    setCurrentPage,
    totalPages,
    totalResults: filtered.length,
    paginated,
  }
}