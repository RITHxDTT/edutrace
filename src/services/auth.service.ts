export const loginService = async (req: Partial<Record<"email" | "password", unknown>>) => {
    const formData = {
        email: req?.email,
        password: req?.password
    }

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
    });
    
    if (!res.ok) {
        return null;
    }

    const user = await res.json();

    return user;
}

export const registerService = async (req: Record<"firstName" | "lastName" | "email" | "password", unknown>) => {
    const formData = {
        firstName: req?.firstName,
        lastName: req?.lastName,
        email: req?.email,
        password: req?.password,
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            body: JSON.stringify({
                formData,
                classroom: async() => {
                    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/classrooms`);
                    const data = await response.json();
                    return data.payload;
                }
            })
        }
    })
}