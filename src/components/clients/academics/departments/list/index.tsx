import { CreateButton } from "@/components/ui/admins/create-button";
import AdminTable, { Column } from "@/components/ui/admins/table";
import { Separator } from "@/components/ui/separator";
import EditButton from "@/components/ui/admins/edit-button";
import DeleteSection from "@/components/ui/admins/delete-section";
import { fetchDepartmentList, useDepartmentList } from "@/hooks/academics/useDepartmentList";
import { usePaginatedQuery } from "@/hooks/usePaginatedQuery";

export interface DepartmentType {
  id: string;
  code: string;
  name: string;
  description: string;
  phoneNumber: string;
  email: string;
  officeLocation: string;
}


export default function Departments() {

  const columns: Column<DepartmentType>[] = [
    { label: "Code", accessor: "code", sortable: true },
    { label: "Name", accessor: "name", sortable: true },
    { label: "Phone", accessor: "phoneNumber" },
    { label: "Email", accessor: "email" },
    { label: "Office", accessor: "officeLocation" },
    { label: "Description", accessor: "description" },
    {
      label: "Actions",
      render: (row) => {
        const href = `/admin/departments/edit/${row.id}`;
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
        <CreateButton href="/admin/departments/create" />
      </div>
      <Separator />
      <AdminTable<DepartmentType>
        useData={(...args) => usePaginatedQuery<DepartmentType>("/department", ["departments"], ...args)}
        columns={columns}
      />

    </div>
  );
}
