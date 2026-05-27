import NavbarTitle from "@/components/Topbar/NavbarTitle";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Growthyflow - Communication",
};


export default function page() {
    return (
        <div>
            <NavbarTitle title="Communication Room" override />
            <div>page</div>
        </div>
    )
}
