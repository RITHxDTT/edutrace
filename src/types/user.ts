interface ProfileData {
    payload: {
        firstName: string;
        lastName: string;
        email: string;
        role: string;
        username: string;
        fullName: string;
        profileImageUrl: string
    }
}

type UserProfile = {
    userId: string;
    username?: string;
    firstName?: string;
    lastName?: string;
    fullName?: string;
    email?: string;
    profileImageUrl?: string;
    role?: string;
    classroom?: {
        classroomId: string;
        className: string;
        classroomAbbre: string;
    };
};

export type { ProfileData, UserProfile }
