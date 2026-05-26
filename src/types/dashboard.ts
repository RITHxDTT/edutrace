interface Summery {
    title: string;
    value: string | number;
    subtitle?: string;
    subValue?: string;
    allowedRoles: ('student' | 'instructor')[];
}
interface RecentTask {
    id: string;
    name: string;
    deadline: string;
    submission: string;
    status: "Overdue" | "Finish";
}
interface ActivityLogItem {
    id: number;
    message: string;
    timestamp: string;
    type: 'join' | 'leave';
}