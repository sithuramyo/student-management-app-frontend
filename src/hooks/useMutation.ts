// hooks/useApiMutation.ts
import api from "@/providers/axiosInstance";
import { useMutation, UseMutationOptions } from "@tanstack/react-query"

export function useApiMutation<TReq = any, TRes = any>(
    options?: UseMutationOptions<ApiResponse<TRes>, Error, MutationPayload<TReq>>
  ) {
    return useMutation<ApiResponse<TRes>, Error, MutationPayload<TReq>>({
      mutationFn: async ({ endpoint, method = 'POST', body }) => {
        const response = await api.request<ApiResponse<TRes>>({
          url: endpoint,
          method,
          data: body,
        })
  
        return response.data
      },
      ...options,
    })
  }
  
