import api from "@/providers/axiosInstance";

export interface PaginatedResponse<T> {
    items: T[];
    page: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
  }
  
  export const fetchDataList = async <T>(
    page: number,
    pageSize: number,
    search: string = "",
    endpoint: string,
    sortBy?: string | number,
    sortOrder?: "asc" | "desc"
  ): Promise<PaginatedResponse<T>> => {
    const res = await api.get(endpoint, {
      params: { page, pageSize, search, sortBy, sortOrder },
    });
    return res.data.data;
  };

  