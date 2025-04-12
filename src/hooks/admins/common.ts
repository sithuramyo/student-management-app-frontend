import { useApiQuery } from "../useQuery";

interface PrerequisiteOption {
  id: string;
  requiredCourseCode: string;
  requiredMinimumGrade: string;
  isMandatory: boolean;
  notes: string;
}

interface DepartmentOption {
  id: string;
  code: string;
  name: string;
}

interface CourseOption {
  id: string;
  code: string;
}

export const usePrerequisiteOptions = () =>
  useApiQuery<undefined, { prerequisites: PrerequisiteOption[] }>(
    {
      endpoint: "/common/prerequisites",
    },
    {
      select: (res) => ({ prerequisites: res.prerequisites }),
      queryKey: ["prerequisite-options"]
    }
  );

export const useDepartmentOptions = () =>
  useApiQuery<undefined, { departments: DepartmentOption[] }>(
    {
      endpoint: "/common/departments",
    },
    {
      select: (res) => ({ departments: res.departments }),
      queryKey: ["department-options"]
    }
  );

  export const useCourseOptions = () =>
    useApiQuery<undefined, { courses: CourseOption[] }>(
      {
        endpoint: "/common/courses",
      },
      {
        select: (res) => ({ courses: res.courses }),
        queryKey: ["course-options"]
      }
    );
  