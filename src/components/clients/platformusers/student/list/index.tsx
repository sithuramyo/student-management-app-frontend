import AdminTable, { Column } from "@/components/ui/admins/table";
import { CreateButton } from "@/components/ui/admins/create-button";
import { Separator } from "@/components/ui/separator";
import { usePaginatedQuery } from "@/hooks/usePaginatedQuery";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import EditButton from "@/components/ui/admins/edit-button";
import DeleteSection from "@/components/ui/admins/delete-section";


export interface Student {
  id: string;
  code: string;
  name: string;
  profile: string;
  birthDate: string;
  gender: string;
  status: string;
}

export default function Students() {
  const columns: Column<Student>[] = [
    {
      label: "Profile",
      render: (row) => (
        <div className="flex items-center gap-3">
          <img
            src={row.profile || "/default-profile.png"}
            alt="Profile"
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
      render: (row) => (
        <Badge
          className={`capitalize ${row.status === "active"
            ? "bg-green-100 text-green-800"
            : "bg-gray-200 text-gray-700"}`}
        >
          {row.status}
        </Badge>
      ),
    },
    {
      label: "Actions",
      render: (row) => {
        const href = `/admin/student/edit/${row.id}`;
        const apiUrl = `/student/${row.id}`;
        return (
          <div className="flex items-center gap-2">
            <EditButton href={href} />
            <DeleteSection label={row.name} apiUrl={apiUrl} queryKey={'students'} />
          </div>
        );
      },
    },
  ];

  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-end">
        <CreateButton href="/admin/student/create" />
      </div>
      <Separator />
      <AdminTable<Student>
        useData={(...args) =>
          usePaginatedQuery<Student>("/student", ["students"], ...args)
        }
        columns={columns}
      />
    </div>
  );
}