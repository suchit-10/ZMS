export default function StatsCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="bg-white rounded-lg p-4 shadow-sm border">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-2xl font-bold mt-1">{value}</p>
    </div>
  )
}
