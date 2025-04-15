import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CreateButton } from "@/components/ui/admins/create-button";
import AdminTable, { Column } from "@/components/ui/admins/table";
import EditButton from "@/components/ui/admins/edit-button";
import DeleteSection from "@/components/ui/admins/delete-section";
import { Separator } from "@/components/ui/separator";
import { usePaginatedQuery } from "@/hooks/usePaginatedQuery";
import { useAuthStore } from "@/store/auth";

export interface SystemUser {
    id: string;
    name: string;
    email: string;
    profile: string | null;
    role: string;
}

export default function SystemUsers() {
    const { user } = useAuthStore();
    const columns: Column<SystemUser>[] = [
        {
            label: "User",
            render: (row) => (
                <div className="flex items-center gap-3">
                    <Avatar>
                        {row.profile && row.profile !== "N/A" ? (
                            <AvatarImage src={row.profile} alt={row.name} />
                        ) : (
                            <AvatarFallback className="bg-muted text-muted-foreground">
                                {row.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")
                                    .toUpperCase()}
                            </AvatarFallback>
                        )}
                    </Avatar>
                    <div className="flex flex-col">
                        <span className="font-medium">{row.name}</span>
                        <span className="text-sm text-muted-foreground">{row.email}</span>
                    </div>
                </div>
            ),
        },
        {
            label: "Role",
            render: (row) => (
                <Badge variant="outline" className="capitalize px-2 py-1 text-xs">
                    {row.role}
                </Badge>
            ),
        },
        {
            label: "Actions",
            render: (row) => {
                if (row.role === "SuperAdmin" || row.id === user?.sub || row.role === user?.typ) {
                    return null;
                  }
                const href = `/admin/system-user/edit/${row.id}`;
                const apiUrl = `/systemuser/${row.id}`;
                return (
                    <div className="flex items-center gap-2">
                        <EditButton href={href} />
                        <DeleteSection label={row.name} apiUrl={apiUrl} queryKey={"systemusers"} />
                    </div>
                );
            },
        },
    ];

    return (
        <div className="flex flex-col gap-2">
            <div className="flex justify-end">
                <CreateButton href="/admin/system-user/create" />
            </div>
            <Separator />
            <AdminTable<SystemUser>
                useData={(...args) => usePaginatedQuery<SystemUser>("/systemuser", ["systemusers"], ...args)}
                columns={columns}
            />
        </div>
    );
}
