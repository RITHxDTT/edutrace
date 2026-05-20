
import { notFound } from 'next/navigation';

type PageProps = {
  params: {
    id: string
  }
}

export default async function page({ params }: PageProps) {
  const { id } = await params;
  const res = await fetch(`https://69e20510b1cb62b9f317a888.mockapi.io/users/${id}`);
  if (!res.ok) {
    notFound();
  }
  const data = await res.json()
  return (
    <div>page</div>
  )
}
