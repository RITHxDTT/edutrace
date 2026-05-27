export default async function page({ searchParams }: { searchParams: { id: string } }) {
    const { id } = searchParams;
    return (
        <div>page</div>
    )
}
