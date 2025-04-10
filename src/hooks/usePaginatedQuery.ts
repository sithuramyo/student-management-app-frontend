import { fetchDataList, PaginatedResponse } from "@/lib/data";
import { useQuery } from "@tanstack/react-query";

export const usePaginatedQuery = <T>(
    endpoint: string,
    queryKey: string[],
    page: number,
    pageSize: number,
    search: string = "",
    sortBy: string = "",
    sortOrder?: "asc" | "desc"
) => {
    return useQuery<PaginatedResponse<T>>({
        queryKey: [...queryKey, page, pageSize, search, sortBy, sortOrder],
        queryFn: () => fetchDataList<T>(page, pageSize, search, endpoint, sortBy, sortOrder),
        placeholderData: (prev) => prev,
    });
};
