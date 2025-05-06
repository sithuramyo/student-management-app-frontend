import { CreateButton } from "@/components/ui/admins/create-button";
import DeleteSection from "@/components/ui/admins/delete-section";
import AdminTable, { Column } from "@/components/ui/admins/table";
import { Separator } from "@/components/ui/separator";
import { usePaginatedQuery } from "@/hooks/usePaginatedQuery";
import clsx from "clsx";
import { CalendarDays, Clock } from "lucide-react";

export interface ClassSchedule {
    id: string;
    courseTitle: string;
    facultyName: string;
    scheduleDate:string;
    dayOfWeek: string;
    startTime: string;
    endTime: string;
}


const currentDay = new Date().toLocaleDateString("en-US", { weekday: "long" });
const dayMap = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export default function ClassSchedules() {

    const columns: Column<ClassSchedule>[] = [
        {
            label: "Course & Faculty",
            render: (row) => (
                <div className="flex flex-col">
                    <span className="font-semibold text-base text-primary">{row.courseTitle}</span>
                    <span className="text-sm text-muted-foreground">{row.facultyName}</span>
                </div>
            ),
        },
        {
            label: "Date",
            render: (row) => {
                const date = new Date(row.scheduleDate);
                const formatted = date.toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                });
                return <span className="text-sm text-muted-foreground">{formatted}</span>;
            },
        },
        {
            label: "Schedule",
            render: (row) => {
                const dayName = dayMap[Number(row.dayOfWeek)];
                const isToday = dayName === currentDay;

                return (
                    <div className="flex flex-col text-sm">
                        <span
                            className={clsx(
                                "inline-flex items-center gap-2 font-medium px-2 py-0.5 rounded-full w-fit text-xs",
                                isToday
                                    ? "bg-green-100 text-green-800 ring-1 ring-green-300"
                                    : "bg-gray-100 text-gray-700 ring-1 ring-gray-300"
                            )}
                            title={isToday ? "This is today's class" : `Scheduled on ${dayName}`}
                        >
                            <CalendarDays className="w-4 h-4" />
                            {dayName}
                        </span>
                        <span className="inline-flex items-center gap-2 text-muted-foreground mt-1">
                            <Clock className="w-4 h-4" />
                            {row.startTime} – {row.endTime}
                        </span>
                    </div>
                );
            },
        },
        {
            label: "Actions",
            render: (row) => {
                const apiUrl = `/classschedule/${row.id}`;
                return (
                    <div className="flex items-center gap-2">
                        <DeleteSection label={row.courseTitle} apiUrl={apiUrl} queryKey="classschedules" />
                    </div>
                );
            },
        },
    ];

    return (
        <div className="flex flex-col gap-2">
            <div className="flex justify-end">
                <CreateButton href="/admin/class-schedule/create" />
            </div>
            <Separator />
            <AdminTable<ClassSchedule>
                useData={(...args) => usePaginatedQuery<ClassSchedule>("/classschedule", ["classschedules"], ...args)}
                columns={columns}
            />
        </div>
    )
}
