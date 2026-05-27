type ClassroomType = {
    classroomId: string;
    className: string;
    classroomAbbre: string;
}

export interface ClassroomProps {
    classrooms: ClassroomType[]
}