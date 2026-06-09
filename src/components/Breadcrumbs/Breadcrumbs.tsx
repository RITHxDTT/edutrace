"use client";

import { Breadcrumbs, BreadcrumbItem } from "@heroui/breadcrumbs";

type BreadcrumbData = {
    label: string;
    href?: string;
};

type PrimaryBreadcrumbsProps = {
    items: BreadcrumbData[];
};

export default function PrimaryBreadcrumbs({
    items,
}: PrimaryBreadcrumbsProps) {
    return (
        <Breadcrumbs>
            {items.map((item) => (
                <BreadcrumbItem
                    key={item.label}
                    href={item.href}
                >
                    {item.label}
                </BreadcrumbItem>
            ))}
        </Breadcrumbs>
    );
}