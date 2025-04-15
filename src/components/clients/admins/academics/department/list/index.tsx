import { CreateButton } from "@/components/ui/admins/create-button";
import AdminTable, { Column } from "@/components/ui/admins/table";
import { Separator } from "@/components/ui/separator";
import EditButton from "@/components/ui/admins/edit-button";
import DeleteSection from "@/components/ui/admins/delete-section";
import { usePaginatedQuery } from "@/hooks/usePaginatedQuery";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export interface Department {
  id: string;
  code: string;
  name: string;
  description: string;
  phoneNumber: string;
  email: string;
  officeLocation: string;
}


export default function Departments() {

  const columns: Column<Department>[] = [
    { label: "Code", accessor: "code", sortable: true },
    { label: "Name", accessor: "name", sortable: true },
    { label: "Phone", accessor: "phoneNumber" },
    { label: "Email", accessor: "email" },
    { label: "Office", accessor: "officeLocation" },
    {
      label: "Description",
      render: (row) => (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="max-w-[200px] w-[200px] truncate text-sm cursor-default text-muted-foreground">
                {row.description || "-"}
              </div>
            </TooltipTrigger>
            <TooltipContent className="max-w-xs whitespace-pre-line text-sm">
              {row.description}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ),
    },
    {
      label: "Actions",
      render: (row) => {
        const href = `/admin/department/edit/${row.id}`;
        const apiUrl = `/department/${row.id}`;
        return (
          <div className="flex items-center gap-2">
            <EditButton href={href} />
            <DeleteSection label={row.name} apiUrl={apiUrl} queryKey={'departments'} />
          </div>
        );
      },
    },
  ];


  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-end">
        <CreateButton href="/admin/department/create" />
      </div>
      <Separator />
      <AdminTable<Department>
        useData={(...args) => usePaginatedQuery<Department>("/department", ["departments"], ...args)}
        columns={columns}
      />
    </div>
  );
}
