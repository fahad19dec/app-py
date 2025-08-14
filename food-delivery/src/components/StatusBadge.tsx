export default function StatusBadge({ status }: { status: string }) {
	const color = status === 'DELIVERED' ? 'bg-green-100 text-green-800' : status === 'CANCELLED' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
	return (
		<span className={`inline-flex items-center rounded px-2 py-0.5 text-xs font-medium ${color}`}>{status}</span>
	)
}