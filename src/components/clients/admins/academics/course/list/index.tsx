import { CreateButton } from "@/components/ui/admins/create-button";
import AdminTable, { Column } from "@/components/ui/admins/table";
import { Separator } from "@/components/ui/separator";
import EditButton from "@/components/ui/admins/edit-button";
import DeleteSection from "@/components/ui/admins/delete-section";
import { usePaginatedQuery } from "@/hooks/usePaginatedQuery";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ExternalLink } from "lucide-react";

export interface Course {
  id: string;
  code: string;
  title: string;
  profile: string;
  departmentName: string;
  description: string;
  creditHours: number;
  semesterOffered: string;
  maxEnrollment: number;
  syllabusUrl: string;
  deliveryMode: string;
}


export default function Courses() {

  const columns: Column<Course>[] = [
    { label: "Code", accessor: "code", sortable: true },
    { label: "Title", accessor: "title", sortable: true },
    {
      label: "Profile",
      render: (row) =>
        row.profile ? (
          <img
            src={row.profile}
            alt="Profile"
            className="h-10 w-10 rounded-full object-cover border"
          />
        ) : (
          <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium text-gray-600">
            {row.title?.[0] ?? "?"}
          </div>
        ),
    },
    { label: "Department", accessor: "departmentName" },
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
    { label: "Credit Hours", accessor: "creditHours" },
    { label: "Semester", accessor: "semesterOffered" },
    { label: "Max Enrollment", accessor: "maxEnrollment" },
    {
      label: "Syllabus",
      render: (row) =>
        row.syllabusUrl ? (
          <a
            href={row.syllabusUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline inline-flex items-center gap-1"
          >
            View <ExternalLink className="w-4 h-4" />
          </a>
        ) : (
          <span className="text-muted-foreground">-</span>
        ),
    },
    {
      label: "Delivery",
      render: (row) => (
        <span
          className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${row.deliveryMode === "Online"
            ? "bg-blue-100 text-blue-800"
            : row.deliveryMode === "Hybrid"
              ? "bg-yellow-100 text-yellow-800"
              : "bg-green-100 text-green-800"
            }`}
        >
          {row.deliveryMode}
        </span>
      ),
    },
    {
      label: "Actions",
      render: (row) => {
        const href = `/admin/course/edit/${row.id}`;
        const apiUrl = `/course/${row.id}`;
        return (
          <div className="flex items-center gap-2">
            <EditButton href={href} />
            <DeleteSection
              label={row.title}
              apiUrl={apiUrl}
              queryKey={"courses"}
            />
          </div>
        );
      },
    },
  ];

  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-end">
        <CreateButton href="/admin/course/create" />
      </div>
      <Separator />
      <AdminTable<Course>
        useData={(...args) => usePaginatedQuery<Course>("/course", ["courses"], ...args)}
        columns={columns}
      />
    </div>
  );
}
