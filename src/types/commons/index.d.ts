import { LucideIcon } from "lucide-react"

declare global {
    interface ApiRequest<T> {
        request: T
    }

    interface ApiResponse<T> {
        isSuccess: boolean
        message: string
        data?: T
        statusCode: number
        errors: string[]
    }

    type HttpMethod = 'POST' | 'PUT' | 'PATCH' | 'DELETE'

    interface MutationPayload<TReq> {
        endpoint: string
        method?: HttpMethod
        body: ApiRequest<TReq>
    }

    interface SidebarMenuItem {
        id: number;
        label: string;
        icon: LucideIcon;
        isDropdown?: boolean;
        path?: string;
        children?: ChildSidebarMenuItem[];
    }

    interface ChildSidebarMenuItem {
        id: number;
        label: string;
        path: string;
    }

    interface NavbarMenuItem {
        id: number;
        label: string;
        isDropdown?: boolean;
        path?: string;
        children?: ChildNavbarMenuItem[];
    }

    interface ChildNavbarMenuItem {
        id: number;
        label: string;
        path: string;
    }
}

export { }