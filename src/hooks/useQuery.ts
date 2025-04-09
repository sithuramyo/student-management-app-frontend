import api from "@/providers/axiosInstance";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface QueryPayload<T = any> {
  endpoint: string;
  params?: T;
  queryKey?: any[]; // optional override key
}

export function useApiQuery<TParams = any, TRes = any>(
  { endpoint, params, queryKey }: QueryPayload<TParams>,
  options?: UseQueryOptions<TRes, Error>
) {
  return useQuery<TRes, Error>({
    queryKey: queryKey ?? [endpoint, params],
    queryFn: async () => {
      const res = await api.get<ApiResponse<TRes>>(endpoint, {
        params,
      });
      return res.data.data;
    },
    ...options,
  });
}
