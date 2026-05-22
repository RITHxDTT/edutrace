import { Tab, Tabs } from "@heroui/tabs";
import { ReactNode } from "react";
import { tv } from "tailwind-variants";

type TabType = {
    key: string;
    title: string;
    content: ReactNode;
}

type tabs = {
    tabs: TabType[];
    colors?: "primary" | "secondary";
    variant?: "underlined";
}

const tabVariant = tv({
    slots: {
        base: "",
        tabList: "",
        cursor: "",
        tab: "",
        tabContent: "",
    },

    variants: {
        color: {
            primary: {
                tabList:
                    "gap-6 w-full relative rounded-none",
                cursor: "w-full bg-menta border-b-[1px]",
                tab: "max-w-fit px-0 h-12 pb-[10px]",
                tabContent: "group-data-[selected=true]:text-menta group-data-[selected=true]:bg-light-lavendar p-[10px] rounded-[6px]",
            },
            secondary : {
                base: "bg-gray rounded-[9px]",
                tabList: "gap-[18px] w-full relative bg-light-gray p-[6px]",
                cursor: "w-full bg-white",
                tab: "px-[10px] py-[3px]",
            }
        },
    },

    defaultVariants: {
        color: "primary",
    },
});

export default function PrimaryTabs({ tabs, colors = "secondary", variant }: tabs) {

    const styles = tabVariant({ color: colors });
    return (
        <Tabs aria-label="Options" classNames={{
            base: styles.base(),
            tabList: styles.tabList(),
            cursor: styles.cursor(),
            tab: styles.tab(),
            tabContent: styles.tabContent(),
        }}>
            {tabs.map((item) => (
                <Tab key={item?.key} title={item?.title}>
                    {item?.content}
                </Tab>
            ))}
        </Tabs>
    )
}