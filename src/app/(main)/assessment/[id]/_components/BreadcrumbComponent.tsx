'use client'

import { firstCharUppercase } from '@/utils/firstCharUppercase'
import { Breadcrumbs, BreadcrumbItem, BreadcrumbsProps } from '@heroui/breadcrumbs';
import Link from 'next/link';

import { usePathname } from 'next/navigation'

type BreadcrumbType = {
    title: string,
    href: string,
}

type BreadcrumbProps = {
    props?: BreadcrumbType
}

export default function Breadcrumb({ props }: BreadcrumbProps) {
    const pathname = usePathname();

    const breadcrumb: BreadcrumbType[] = pathname.split('/').filter(Boolean).map((crumb, index, array) => ({
        title: firstCharUppercase(crumb, 0),
        href: '/' + array[index]
    }));

    const breadcrumbs: BreadcrumbType[] = props ? [breadcrumb[0], props] : [breadcrumb[0]];
    return (
        <Breadcrumbs>
            {breadcrumbs.map((crumb) => (
                <BreadcrumbItem><Link href={crumb.href}>{crumb.title}</Link></BreadcrumbItem>
            ))}
        </Breadcrumbs>
    )
}
