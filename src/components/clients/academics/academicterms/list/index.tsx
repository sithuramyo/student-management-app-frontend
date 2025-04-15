import { CreateButton } from "@/components/ui/admins/create-button";
import AdminTable, { Column } from "@/components/ui/admins/table";
import { Separator } from "@/components/ui/separator";
import EditButton from "@/components/ui/admins/edit-button";
import DeleteSection from "@/components/ui/admins/delete-section";
import { usePaginatedQuery } from "@/hooks/usePaginatedQuery";
import { CheckCircle, MinusCircle } from "lucide-react";
import { format } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export interface AcademicTerm {
  id: string;
  profile: string;
  name: string;
  startDate: string;
  endDate: string;
  isCurrentTerm: string;
}


export default function AcademicTerms() {

  const columns: Column<AcademicTerm>[] = [
    {
      label: "Terms",
      render: (row) => (
        <div className="flex items-center gap-4">
          <Avatar className="w-12 h-12 border shadow-sm">
            {row.profile && row.profile !== "N/A" ? (
              <AvatarImage src={row.profile} alt={row.name} className="object-cover" />
            ) : (
              <AvatarFallback className="bg-gray-200 text-gray-600 text-sm">
                {row.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()}
              </AvatarFallback>
            )}
          </Avatar>
          <div className="flex flex-col">
            <span className="font-semibold text-base">{row.name}</span>
            <span className="text-xs text-muted-foreground">
              {row.profile !== "N/A" ? "Custom banner" : "No image"}
            </span>
          </div>
        </div>
      ),
    },
    {
      label: "Academic Year",
      render: (row) => {
        const startDate = new Date(row.startDate);
        const startYear = startDate.getFullYear();
        const endYearShort = String(startYear + 1).slice(-2);
        return (
          <span
            className="text-sm font-medium text-blue-700"
            title="Derived from start date"
          >
            {startYear}–{endYearShort}
          </span>
        );
      },
    },
    {
      label: "Start Date",
      render: (row) => (
        <span className="text-sm text-muted-foreground">
          {format(new Date(row.startDate), "MMM dd, yyyy")}
        </span>
      ),
    },
    {
      label: "End Date",
      render: (row) => (
        <span className="text-sm text-muted-foreground">
          {format(new Date(row.endDate), "MMM dd, yyyy")}
        </span>
      ),
    },
    {
      label: "Current Term",
      render: (row) => (
        <span
          className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-sm font-semibold
          ${row.isCurrentTerm
              ? "bg-green-100 text-green-800 ring-1 ring-green-400 shadow-sm animate-pulse"
              : "bg-gray-100 text-gray-700"}`}
        >
          {row.isCurrentTerm ? (
            <>
              <CheckCircle className="w-4 h-4" />
              Current
            </>
          ) : (
            <>
              <MinusCircle className="w-4 h-4" />
              Not Current
            </>
          )}
        </span>
      ),
    },
    {
      label: "Actions",
      render: (row) => {
        const today = new Date();
        const endDate = new Date(row.endDate);

        if (endDate < today) {
          return null; // Hide actions if term has ended
        }
        const href = `/admin/academic-term/edit/${row.id}`;
        const apiUrl = `/academicterm/${row.id}`;
        return (
          <div className="flex items-center gap-2">
            <EditButton href={href} />
            <DeleteSection label={row.name} apiUrl={apiUrl} queryKey={'academicterms'} />
          </div>
        );
      },
    },
  ];


  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-end">
        <CreateButton href="/admin/academic-term/create" />
      </div>
      <Separator />
      <AdminTable<AcademicTerm>
        useData={(...args) => usePaginatedQuery<AcademicTerm>("/academicterm", ["academicterms"], ...args)}
        columns={columns}
      />
    </div>
  );
}
