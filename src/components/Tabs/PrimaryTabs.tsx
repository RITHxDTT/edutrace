"use client"
import { Tab, Tabs } from "@heroui/tabs";
import { ReactNode } from "react";
import { tv } from "tailwind-variants";

type TabType = {
    key: string;
    title: string;
    content?: ReactNode;
}

type tabs = {
    tabs: TabType[];
    colors?: "primary" | "secondary";
    variant?: "underlined";
    selectedKey?: string;
    onSelectionChange?: (key: string) => void;
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
                    "gap-6 w-full relative rounded-none bg-transparent",

                cursor:
                    "w-full shadow-none w-fit border-menta border-b-[1px] rounded-none",

                tab: "outline-none py-7 data-[focus-visible=true]:ring-2 data-[focus-visible=true]:ring-menta/40",

                tabContent:
                    "w-full flex items-center justify-center px-6 py-[10px] rounded-md transition-colors group-data-[selected=true]:bg-light-lavendar group-data-[selected=true]:text-menta"
            },
            secondary: {
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

export default function PrimaryTabs({ tabs, colors = "secondary", variant, selectedKey, onSelectionChange }: tabs) {

    const styles = tabVariant({ color: colors });
    console.log(tabs)
    return (
        <Tabs
            aria-label="Options"
            {...(selectedKey !== undefined && { selectedKey })}
            {...(onSelectionChange && { onSelectionChange: (key) => onSelectionChange(key as string) })}
            classNames={{
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
