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

interface FacultyOption {
  id: string;
  name: string;
}

interface AcademicTermOption {
  id: string;
  name: string;
}

interface ChatRoomOption {
  id: string;
  name: string;
  isGroup: boolean;
  createdAt: Date;
}

export interface ChatUserOption {
  id: string;
  name: string;
  email: string;
  profile: string;
  chatRoomId: string;
}

export interface ChatMessageOption {
  id: string;
  senderId: string;
  content: string;
  sentAt: Date;
  isOwnMessage: boolean;
  seenBy: string[];
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

export const useFacultyOptions = () =>
  useApiQuery<undefined, { faculties: FacultyOption[] }>(
    {
      endpoint: "/common/faculties",
    },
    {
      select: (res) => ({ faculties: res.faculties }),
      queryKey: ["faculty-options"]
    }
  );

export const useAcademicTermOptions = () =>
  useApiQuery<undefined, { academicTerms: AcademicTermOption[] }>(
    {
      endpoint: "/common/academic-terms",
    },
    {
      select: (res) => ({ academicTerms: res.academicTerms }),
      queryKey: ["academicterm-options"]
    }
  );


export const useChatRoomOptions = () =>
  useApiQuery<ChatRoomOption[]>(
    {
      endpoint: "/chat/rooms",
    },
    {
      select: (res) => (res),
      queryKey: ["chatroom-options"]
    }
  );

export const useUserOptions = (search: string) =>
  useApiQuery<ChatUserOption[]>(
    {
      endpoint: `/chat/chat-users?search=${search}`,
    },
    {
      select: (res) => (res),
      queryKey: ["chatusers-options", search]
    }
  );



export const useChatMessageOptions = (roomId: string, page: number, pageSize: number) =>
  useApiQuery<ChatMessageOption[]>(
    {
      endpoint: roomId ? `/chat/room/${roomId}/messages?page=${page}&pageSize=${pageSize}` : "",
    },
    {
      enabled: !!roomId,
      select: (res) => (res),
      queryKey: ["chatusers-options", roomId, page, pageSize]
    }
  );