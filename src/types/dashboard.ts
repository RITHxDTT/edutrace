
interface Task {
    title: string;
    value: string | number;
    subtitle?: string;
    subValue?: string;
    role?: string[];
}

interface Summery {
    title: string;
    value: string | number;
    subtitle?: string;
    subValue?: string;
    role: ('student' | 'teacher')[];
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