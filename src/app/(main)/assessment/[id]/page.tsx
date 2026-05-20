import Breadcrumb from './_components/BreadcrumbComponent';
import NavbarTitle from '@/components/Topbar/NavbarTitle';

type PageProps = {
  params: {
    id: string
  }
}

export default async function page({ params }: PageProps) {
  const { id } = await params;
  const res = await fetch(`https://69e20510b1cb62b9f317a888.mockapi.io/users/${id}`);
  const data = await res.json();
  const crumbs = { title: data?.username, href: "#" }

  return (
    <div>
      {res.status !== 200 ? <NavbarTitle title="Not Found" override /> : <NavbarTitle title="Assessment" override />}

      <Breadcrumb props={crumbs} />
    </div>
  )
}
