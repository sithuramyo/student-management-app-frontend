import { CreateButton } from "@/components/ui/admins/create-button";
import AdminTable, { Column } from "@/components/ui/admins/table";
import { Separator } from "@/components/ui/separator";
import { usePaginatedQuery } from "@/hooks/usePaginatedQuery";


interface CourseOffering {
  academicTermId: string;
  academicTerm: string;
  courseFacultyInfos: CourseFacultyInfo[];
}

interface CourseFacultyInfo {
  courseId: string;
  courseName: string;
  facultyId: string;
  facultyName: string;
}
export default function CourseOfferings() {

  const columns: Column<CourseOffering>[] = [
    {
      label: "Academic Term",
      accessor: "academicTerm",
    },
    {
      label: "Course Count",
      render: (row) => {
        const courseCount = new Set(row.courseFacultyInfos.map(info => info.courseId)).size;
        return <span className="font-semibold">{courseCount}</span>;
      },
    },
    {
      label: "Faculty Count",
      render: (row) => {
        const facultyCount = new Set(row.courseFacultyInfos.map(info => info.facultyId)).size;
        return <span className="font-semibold">{facultyCount}</span>;
      },
    },
    {
      label: "Offered Courses",
      render: (row) => (
        <div className="flex flex-col gap-1">
          {row.courseFacultyInfos.map((info, index) => (
            <div key={index} className="bg-gray-100 px-3 py-1 rounded-md flex justify-between items-center text-sm border border-gray-300">
              <span className="font-medium">{info.courseName}</span>
              <span className="italic text-gray-600">by {info.facultyName}</span>
            </div>
          ))}
        </div>
      ),
    },
  ];
  

  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-end">
        <CreateButton href="/admin/course-offering/create" />
      </div>
      <Separator />
      <AdminTable<CourseOffering>
        useData={(...args) => usePaginatedQuery<CourseOffering>("/courseoffering", ["courseofferings"], ...args)}
        columns={columns}
      />
    </div>
  )
}
