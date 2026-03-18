export default function Dashboard({ params }: { params: { slug: string } }) {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold">Dashboard - {params.slug}</h1>
      <p className="mt-4 text-gray-600">Visão geral da organização.</p>
    </div>
  );
}
