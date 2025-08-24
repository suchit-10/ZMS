import React, { useMemo } from 'react'
import Sidebar from '../components/Sidebar'
import ActivityItem from '../components/ActivityItem'
import Header from '../components/Header'
import StatsCard from '../components/StatsCard'
import { useAuth } from '../contexts/AuthContext'
import { useOverview, type RealtimeAnalyticsResponse } from '../hooks/useOverview'

// ==========================
// Helpers
// ==========================
function toTimeAgo(iso: string) {
  const now = new Date()
  const then = new Date(iso)
  const diffMs = now.getTime() - then.getTime()
  const abs = Math.abs(diffMs)
  const minutes = Math.floor(abs / (60 * 1000))
  if (minutes < 1) return 'just now'
  if (minutes < 60) return `${minutes} min${minutes === 1 ? '' : 's'} ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`
  const days = Math.floor(hours / 24)
  return `${days} day${days === 1 ? '' : 's'} ago`
}

function formatNumber(n: number | undefined) {
  return typeof n === 'number' ? n.toLocaleString() : '—'
}

type FeedItem = {
  animal: string
  species: string
  action: string
  timeAgo: string
  staff?: string
  photo?: string
  type: 'feeding' | 'medical' | 'observation' | 'vaccination' | 'measurement' | 'other'
  createdAt: string
}

function mapApiToFeed(api: RealtimeAnalyticsResponse): FeedItem[] {
  const out: FeedItem[] = []
  const { todayActivities } = api

  todayActivities.animalsOnboarded.details.forEach((d) => {
    out.push({
      animal: d.name,
      species: d.species,
      action: `Onboarded (microchip ${d.microchipId})`,
      timeAgo: toTimeAgo(d.onboardedAt),
      staff: undefined,
      photo: '/images/logo-64.svg',
      type: 'other',
      createdAt: d.onboardedAt,
    })
  })

  todayActivities.feedingRecords.details.forEach((f) => {
    const kg = (f.quantityGiven / 1000).toFixed(2)
    out.push({
      animal: f.animalName,
      species: f.animalSpecies,
      action: `Feeding: ${f.dietItem} • ${kg} kg • appetite ${f.appetiteRating}`,
      timeAgo: toTimeAgo(f.createdAt),
      staff: f.staffName,
      photo: '/images/logo-64.svg',
      type: 'feeding',
      createdAt: f.createdAt,
    })
  })

  todayActivities.observations.details?.forEach((o: any) => {
    const ts = o.createdAt || o.observedAt || api.generatedAt
    out.push({
      animal: o.animalName || o.name || 'Unknown',
      species: o.animalSpecies || o.species || '—',
      action: o.summary || 'Observation recorded',
      timeAgo: toTimeAgo(ts),
      staff: o.staffName,
      photo: '/images/logo-64.svg',
      type: 'observation',
      createdAt: ts,
    })
  })

  todayActivities.medicalRecords.details?.forEach((m: any) => {
    const ts = m.createdAt || m.performedAt || api.generatedAt
    out.push({
      animal: m.animalName || m.name || 'Unknown',
      species: m.animalSpecies || m.species || '—',
      action: m.summary || 'Medical record added',
      timeAgo: toTimeAgo(ts),
      staff: m.staffName,
      photo: '/images/logo-64.svg',
      type: 'medical',
      createdAt: ts,
    })
  })

  todayActivities.newUsers.details?.forEach((u: any) => {
    const ts = u.createdAt || api.generatedAt
    out.push({
      animal: u.name || u.email || 'New User',
      species: '—',
      action: 'User registered',
      timeAgo: toTimeAgo(ts),
      staff: undefined,
      photo: '/images/logo-64.svg',
      type: 'other',
      createdAt: ts,
    })
  })

  out.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  return out
}

export const Home: React.FC = () => {
  const { signOut } = useAuth()
  const { data, isLoading, error } = useOverview()

  const feed: FeedItem[] = useMemo(() => (data ? mapApiToFeed(data) : []), [data])

  const totalAnimals = data?.data.animals ?? 0
  const entriesToday = useMemo(() => {
    if (!data) return 0
    const t = data.todayActivities
    return (t.animalsOnboarded?.count || 0) + (t.medicalRecords?.count || 0) + (t.observations?.count || 0) + (t.feedingRecords?.count || 0) + (t.newUsers?.count || 0)
  }, [data])

  const summaryByType = useMemo(() => {
    const t = data?.todayActivities
    return {
      Onboarded: t?.animalsOnboarded.count ?? 0,
      Feeding: t?.feedingRecords.count ?? 0,
      Medical: t?.medicalRecords.count ?? 0,
      Observations: t?.observations.count ?? 0,
      'New Users': t?.newUsers.count ?? 0,
    }
  }, [data])

  return (
    <div className="min-h-screen overflow-x-hidden" style={{
      background: 'linear-gradient(135deg, #e6f4e6 0%, #f2fff4 50%, #dff0df 100%)',
    }}>
      <div className="flex">
        <Sidebar />

        <main className="flex-1 p-6 pt-8 md:pt-6 md:ml-52">
          <Header
            title="Dashboard"
            subtitle={data ? `Real-time snapshot · Updated ${toTimeAgo(data.generatedAt)}` : 'Management system recent entries'}
            actions={<button onClick={signOut} className="px-3 py-1 rounded bg-red-600 text-white text-sm">Sign Out</button>}
          />

          {isLoading && (
            <div className="mb-6 text-sm text-gray-600">Loading real-time analytics…</div>
          )}
          {error && (
            <div className="mb-6 text-sm text-red-600">Failed to load data</div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <StatsCard label="Total Animals" value={formatNumber(totalAnimals)} />
            <StatsCard label="Entries Today" value={formatNumber(entriesToday)} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <section className="lg:col-span-2">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">Recent Activity</h2>
              <div className="bg-white rounded-lg shadow-sm border p-4 space-y-2">
                {feed.length === 0 && (
                  <div className="text-sm text-gray-500">No activity yet today.</div>
                )}
                {feed.map((r, i) => (
                  <ActivityItem
                    key={i}
                    animal={r.animal}
                    species={r.species}
                    action={r.action}
                    timeAgo={r.timeAgo}
                    staff={r.staff!}
                    photo={r.photo}
                    type={r.type}
                  />
                ))}
              </div>
            </section>

            <aside>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">Today's Summary</h2>
              <div className="bg-white rounded-lg shadow-sm border p-4 space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-700">Entries by Type</h3>
                  <ul className="mt-2 text-sm text-gray-600 space-y-1">
                    {Object.entries(summaryByType).map(([k, v]) => (
                      <li key={k} className="flex justify-between"><span>{k}</span><span>{v}</span></li>
                    ))}
                  </ul>
                </div>
              </div>
            </aside>
          </div>
        </main>
      </div>
    </div>
  )
}

export default Home
