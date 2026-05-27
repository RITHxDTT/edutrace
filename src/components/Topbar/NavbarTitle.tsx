"use client";

import { useNavbar } from "@/context/NavbarContext";
import { useEffect } from "react";

export default function NavbarTitle({ title, override = false }: { title: string; override?: boolean }) {
    const { setTitle } = useNavbar();
    useEffect(() => {
        setTitle(title, override);
    }, [title, override]);
    return null;
}