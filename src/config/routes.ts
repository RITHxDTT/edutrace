type RouteConfig = {
    path: string;
    label: string;
    matcher: (pathname: string) => boolean;
};

export const ROUTES: RouteConfig[] = [
    {
        path: "/dashboard",
        label: "Dashboard",
        matcher: (pathname) => pathname === "/dashboard",
    },

    {
        path: "/assessment",
        label: "Assessment",
        matcher: (pathname) => pathname === "/assessment",
    },

    {
        path: "/assessment/communication",
        label: "Not Found",
        matcher: (pathname) => {
            const segments = pathname.split("/").filter(Boolean);

            return (
                segments.length === 2 &&
                segments[0] === "assessment" &&
                segments[1] === "communication"
            )
        }
    },  

    // I disabled to debug navbar
    // {   
    //     path: "/assessment/:id",
    //     label: "Assessment",
    //     matcher: (pathname) => {
    //         const segments = pathname.split("/").filter(Boolean);

    //         return (
    //             segments.length === 2 &&
    //             segments[0] === "assessment"
    //         );
    //     },
    // },

    {
        path: "/assessment/communication/:id",
        label: "Communication Room",
        matcher: (pathname) => {
            const segments = pathname.split("/").filter(Boolean);

            return (
                segments.length === 3 &&
                segments[0] === "assessment" &&
                segments[1] === "communication"
            )
        }
    },

    {
        path: "/calendar",
        label: "Calendar",
        matcher: (pathname) => pathname === "/calendar",
    },

    {
        path: "/report",
        label: "Report",
        matcher: (pathname) => pathname === "/report",
    },
];