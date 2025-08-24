import Sidebar from '../components/Sidebar'
import ActivityItem from '../components/ActivityItem'
import Header from '../components/Header'
import StatsCard from '../components/StatsCard'
import { useAuth } from '../contexts/AuthContext'

export const Home = () => {
  const { signOut } = useAuth()

  // Mock data — replace with real data hooks / API calls later
  const totalAnimals = 248
  const entriesToday = 17
  // staffActive removed per request

  const recent = [
    { animal: 'Simba', species: 'Male Lion', action: 'Morning feeding logged', timeAgo: '2 hours ago', staff: 'Dr. Sarah', photo: '/images/logo-64.svg', type: 'feeding' as const },
    { animal: 'Molly', species: 'Penguin', action: 'Feeding logged', timeAgo: '3 hours ago', staff: 'Mark Williams', photo: '/images/logo-64.svg', type: 'feeding' as const },
    { animal: 'Max', species: 'Tiger', action: 'Health observation recorded', timeAgo: '4 hours ago', staff: 'Dr. Sarah', photo: '/images/logo-64.svg', type: 'observation' as const },
    { animal: 'Bella', species: 'Elephant', action: 'Weight measured', timeAgo: '5 hours ago', staff: 'Maintenance Team', photo: '/images/logo-64.svg', type: 'measurement' as const },
    { animal: 'Koko', species: 'Gorilla', action: 'Vaccination given', timeAgo: '6 hours ago', staff: 'Dr. Anna', photo: '/images/logo-64.svg', type: 'vaccination' as const },
    { animal: 'Zara', species: 'Zebra', action: 'Feeding logged', timeAgo: '7 hours ago', staff: 'Mark Williams', photo: '/images/logo-64.svg', type: 'feeding' as const },
    { animal: 'Penny', species: 'Parrot', action: 'Observation recorded', timeAgo: '8 hours ago', staff: 'Alex', photo: '/images/logo-64.svg', type: 'observation' as const },
    { animal: 'Sam', species: 'Snake', action: 'Medical check recorded', timeAgo: '9 hours ago', staff: 'Dr. Lee', photo: '/images/logo-64.svg', type: 'medical' as const },
  ]

  const summary = {
    byType: { Feeding: 8, Medical: 3, Observations: 4, Vaccinations: 2 },
    mostActive: ['Simba', 'Molly', 'Bella'],
    staff: ['Dr. Sarah', 'Mark Williams', 'Dr. Anna']
  }

  return (
    <div
      className="min-h-screen overflow-x-hidden"
      style={{
        background:
          'linear-gradient(135deg, #e6f4e6 0%, #f2fff4 50%, #dff0df 100%)',
      }}
    >
      <div className="flex">
        <Sidebar />

        <main className="flex-1 p-6 pt-8 md:pt-6">
          <Header
            title="Dashboard"
            subtitle="Management system recent entries"
            actions={<button onClick={signOut} className="px-3 py-1 rounded bg-red-600 text-white text-sm">Sign Out</button>}
          />

          {/* Top Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <StatsCard label="Total Animals" value={totalAnimals} />
            <StatsCard label="Entries Today" value={entriesToday} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Activity Feed */}
            <section className="lg:col-span-2">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">Recent Activity</h2>
              <div className="bg-white rounded-lg shadow-sm border p-4 space-y-2">
                {recent.map((r, i) => (
                  <ActivityItem key={i} {...r} />
                ))}
              </div>
            </section>

            {/* Today's Summary */}
            <aside>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">Today's Summary</h2>
              <div className="bg-white rounded-lg shadow-sm border p-4 space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-700">Entries by Type</h3>
                  <ul className="mt-2 text-sm text-gray-600 space-y-1">
                    {Object.entries(summary.byType).map(([k, v]) => (
                      <li key={k} className="flex justify-between"><span>{k}</span><span>{v}</span></li>
                    ))}
                  </ul>
                </div>

                {/* Removed Most Active Animals and Active Staff as requested */}
              </div>
            </aside>
          </div>
        </main>
      </div>
    </div>
  )
}