import { CreateButton } from "@/components/ui/admins/create-button";
import DeleteSection from "@/components/ui/admins/delete-section";
import AdminTable, { Column } from "@/components/ui/admins/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { usePaginatedQuery } from "@/hooks/usePaginatedQuery";
import { Copy } from "lucide-react";
import { toast } from "sonner";

interface Faculty {
    id: string;
    code: string;
    name: string;
    birthDate: string;
    profile: string;
    gender: string;
    status: string;
    phoneNumber: string;
    specialization: string;
}

const statusMap: Record<string, { label: string; className: string }> = {
    active: {
        label: "Active",
        className: "bg-green-100 text-green-800",
    },
    onLeave: {
        label: "OnLeave",
        className: "bg-gray-100 text-gray-800",
    },
    retired: {
        label: " Retired",
        className: "bg-blue-100 text-blue-800",
    }
};

export default function Faculties() {
    const columns: Column<Faculty>[] = [
        {
            label: "Profile",
            render: (row) => (
                <div className="flex items-center gap-3">
                    <img
                        src={row.profile || "/default-profile.png"}
                        alt={row.name}
                        className="w-10 h-10 rounded-full object-cover border shadow-sm"
                    />
                    <div>
                        <div className="font-semibold">{row.name}</div>
                        <div className="text-xs text-gray-500">{row.code}</div>
                    </div>
                </div>
            ),
        },
        {
            label: "Phone",
            render: (row) => (
                <div className="flex items-center gap-2 text-sm text-gray-800">
                    📞 {row.phoneNumber}
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                            navigator.clipboard.writeText(row.phoneNumber);
                            toast.success("Phone copied!");
                        }}
                    >
                        <Copy className="w-4 h-4 text-muted-foreground" />
                    </Button>
                </div>
            ),
        },
        {
            label: "Specialization",
            render: (row) => (
                <Tooltip>
                    <TooltipTrigger asChild>
                        <span className="truncate max-w-[160px] block text-sm text-gray-700">
                            {row.specialization}
                        </span>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>{row.specialization}</p>
                    </TooltipContent>
                </Tooltip>
            ),
        },
        {
            label: "Birth Date",
            render: (row) => {
                const date = new Date(row.birthDate);
                return (
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <span className="text-sm text-gray-700">
                                📅 {date.toLocaleDateString("en-CA")}
                            </span>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Born on {date.toDateString()}</p>
                        </TooltipContent>
                    </Tooltip>
                );
            },
        },
        {
            label: "Gender",
            render: (row) => (
                <Badge variant="outline" className="capitalize">
                    {row.gender}
                </Badge>
            ),
        },
        {
            label: "Status",
            render: (row) => {
                const status = row.status?.toLowerCase();
                const mapped = statusMap[status] ?? {
                    label: row.status,
                    className: "bg-gray-200 text-gray-700",
                };

                return (
                    <Badge className={`capitalize ${mapped.className}`}>
                        {mapped.label}
                    </Badge>
                );
            },
        },
        {
            label: "Actions",
            render: (row) => {
                const apiUrl = `/faculty/${row.id}`;
                return (
                    <div className="flex items-center gap-2">
                        <DeleteSection
                            label={row.name}
                            apiUrl={apiUrl}
                            queryKey={"faculties"}
                        />
                    </div>
                );
            },
        },
    ];
    return (
        <div className="flex flex-col gap-2">
            <div className="flex justify-end">
                <CreateButton href="/admin/faculty/create" />
            </div>
            <Separator />
            <AdminTable<Faculty>
                useData={(...args) =>
                    usePaginatedQuery<Faculty>("/faculty", ["faculties"], ...args)
                }
                columns={columns}
            />
        </div>
    )
}
