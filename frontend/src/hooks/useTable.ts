import { useState, useMemo } from "react";

// want to take in data and be able to paginate, sort and filter the data

interface UseTableOptions<T> {
  data: T[];
  initialPageSize?: number;
  initialSortField?: keyof T;
  initialAscendingOrder?: boolean;
  filterFunction?: (item: T) => boolean;
}

export default function useTable<T>({
  data,
  initialPageSize = 10,
  initialSortField,
  initialAscendingOrder = true,
  filterFunction = () => true,
}: UseTableOptions<T>) {
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [sortField, setSortField] = useState<keyof T | undefined>(
    initialSortField,
  );
  const [sortAscending, setSortAscending] = useState(initialAscendingOrder);

  // first we filter the data, then we sort it, then paginate it
  const filteredData = useMemo(() => {
    return data.filter((item: T) => filterFunction(item));
  }, [data, filterFunction]);

  const sortedData = useMemo(() => {
    if (!sortField) return filteredData;
    return filteredData.sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];

      if (initialAscendingOrder) return aValue > bValue ? 1 : -1;
      return aValue < bValue ? 1 : -1;
    });
  }, [filteredData, sortField, initialAscendingOrder]);

  const paginatedData = useMemo(() => {
    return sortedData.slice(page * pageSize, (1 + page) * pageSize);
  }, [page, pageSize, sortedData]);

  const handleChangePage = (newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (rowsPerPage: number) => {
    setPageSize(rowsPerPage);
    setPage(0);
  };

  return {
    paginatedData,
    handleChangePage,
    handleChangeRowsPerPage,
    setSortField,
    setSortAscending,
    setPageSize,
    sortField,
    sortAscending,
    pageSize,
    page,
  };
}
