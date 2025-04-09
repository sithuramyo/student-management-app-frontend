import { CreateButton } from "@/components/ui/admins/create-button";
import AdminTable, { Column } from "@/components/ui/admins/table";
import { Separator } from "@/components/ui/separator";
import api from "@/providers/axiosInstance";
import { BadgeX } from "lucide-react";
import { toast } from "sonner";
import EditButton from "@/components/ui/admins/edit-button";

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

  const handleDelete = async (row: DepartmentType) => {
    try {
      await api.delete(`/department/${row.id}`);
      toast.success("Deleted successfully");
    } catch (err) {
      toast.error("Failed to delete");
    }
  };

  const columns: Column<DepartmentType>[] = [
    { label: "Code", accessor: "code", sortable: true },
    { label: "Name", accessor: "name", sortable: true },
    { label: "Description", accessor: "description" },
    { label: "Phone", accessor: "phoneNumber" },
    { label: "Email", accessor: "email" },
    { label: "Office", accessor: "officeLocation" },
    {
      label: "Actions",
      render: (row) => {
        const href = `/admin/departments/edit/${row.id}`;
        return (
          <div className="flex items-center gap-2">
            <EditButton href={href} />
            <button
              onClick={() => handleDelete(row)}
              title="Delete"
              className="text-red-600 hover:bg-red-100 rounded-full p-1.5 transition"
            >
              <BadgeX size={18} />
            </button>
          </div>
        );
      },
    },
  ];

  const fetchData = async (
    page: number,
    pageSize: number,
    search: string = "",
    sortBy?: string | number,
    sortOrder?: "asc" | "desc"
  ) => {
    const res = await api.get("/department", {
      params: {
        page,
        pageSize,
        search,
        sortBy,
        sortOrder,
      },
    });

    return res.data.data;
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-end">
        <CreateButton href="/admin/departments/create" />
      </div>
      <Separator />
      <AdminTable fetchData={fetchData} columns={columns} />
    </div>
  );
}
