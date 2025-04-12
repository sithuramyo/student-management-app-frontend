import { CreateButton } from "@/components/ui/admins/create-button";
import AdminTable, { Column } from "@/components/ui/admins/table";
import { Separator } from "@/components/ui/separator";
import EditButton from "@/components/ui/admins/edit-button";
import DeleteSection from "@/components/ui/admins/delete-section";
import { usePaginatedQuery } from "@/hooks/usePaginatedQuery";
import { CheckCircle, MinusCircle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";


export interface Prerequisite {
    id: string;
    requiredCourseCode: string;
    requiredMinimumGrade: string;
    isMandatory: boolean;
    notes: string;
}


export default function Prerequisites() {

    const columns: Column<Prerequisite>[] = [
        { label: "Required Course Code", accessor: "requiredCourseCode" },
        { label: "Required Minimum Grade", accessor: "requiredMinimumGrade" },
        {
            label: "Mandatory", render: (row) => (
                <span
                    className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-sm font-semibold ${row.isMandatory
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-700"
                        }`}
                >
                    {row.isMandatory ? (
                        <>
                            <CheckCircle className="w-4 h-4" />
                            Mandatory
                        </>
                    ) : (
                        <>
                            <MinusCircle className="w-4 h-4" />
                            Optional
                        </>
                    )}
                </span>
            )
        },
        {
            label: "Notes",
            render: (row) => (
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <span className="line-clamp-1 max-w-[200px] truncate text-sm cursor-default">
                                {row.notes || "-"}
                            </span>
                        </TooltipTrigger>
                        <TooltipContent className="max-w-xs whitespace-pre-line">
                            {row.notes}
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            ),
        },
        {
            label: "Actions",
            render: (row) => {
                const href = `/admin/prerequisite/edit/${row.id}`;
                const apiUrl = `/prerequisite/${row.id}`;
                return (
                    <div className="flex items-center gap-2">
                        <EditButton href={href} />
                        <DeleteSection label={row.requiredCourseCode} apiUrl={apiUrl} queryKey={'prerequisites'} />
                    </div>
                );
            },
        },
    ];


    return (
        <div className="flex flex-col gap-2">
            <div className="flex justify-end">
                <CreateButton href="/admin/prerequisite/create" />
            </div>
            <Separator />
            <AdminTable<Prerequisite>
                useData={(...args) => usePaginatedQuery<Prerequisite>("/prerequisite", ["prerequisites"], ...args)}
                columns={columns}
            />
        </div>
    );
}
