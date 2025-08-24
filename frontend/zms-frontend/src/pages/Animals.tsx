import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { useEffect, useMemo, useState, useRef } from "react";
import AnimalCard from "../components/AnimalCard";
import type { Animal } from "../components/AnimalCard";
import SearchBar from "../components/SearchBar";
import FilterChips from "../components/FilterChips";
import OnboardLauncher from "../components/OnboardModal/OnboardLauncher";
import { api } from "../lib/http-client";

type AnimalsResponse = { success: boolean; data: Array<Record<string, unknown>>; meta?: { total?: number; page?: number; limit?: number; pages?: number } }

const CATEGORY_OPTIONS = ["All", "Mammals", "Birds", "Reptiles", "Marine"];

export const Animals = () => {
  const [query, setQuery] = useState<string>("");
  const [filter, setFilter] = useState<string>("All");
  const [loading, setLoading] = useState<boolean>(false)
  const [animals, setAnimals] = useState<Animal[]>([])
  const [page, setPage] = useState<number>(1)
  const [limit] = useState<number>(12)
  const [total, setTotal] = useState<number>(0)
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false)
  const initialLoaded = useRef(false)

  useEffect(() => {
    const load = async (isRefresh = false) => {
      if (isRefresh && initialLoaded.current) {
        setIsRefreshing(true)
      } else {
        setLoading(true)
      }

      try {
  const res = await api.get<AnimalsResponse>('/v1/animals', { params: { q: query, species: filter, page, limit } })
        const list = (res && (res as AnimalsResponse).data) || []
        const meta = (res as any)?.meta
        if (meta) {
          setTotal(meta.total || 0)
        }
        // map to Animal shape used by AnimalCard
        const mapped: Animal[] = list.map((a: Record<string, unknown>) => ({
          id: String(a._id ?? a.id ?? ''),
          name: String(a.name ?? ''),
          species: String(a.species ?? ''),
          age: a.age ? `${String(a.age)} years` : 'N/A',
          health: 'Unknown',
          img: String(a.images ?? '/images/logo-128.svg')
        }))
        setAnimals(mapped)
      } catch (err) {
        console.error('Failed to load animals', err)
      } finally {
        if (isRefresh && initialLoaded.current) {
          setIsRefreshing(false)
        } else {
          setLoading(false)
          initialLoaded.current = true
        }
      }
    }

    // debounce calls when query/filter/page changes
    const timer = setTimeout(() => load(), 150)

    const onRefresh = () => load(true)
    window.addEventListener('animals:refresh', onRefresh as EventListener)
    return () => {
      clearTimeout(timer)
      window.removeEventListener('animals:refresh', onRefresh as EventListener)
    }
  }, [query, filter, page, limit])

  // reset to page 1 when filter or query changes
  useEffect(() => {
    setPage(1)
  }, [query, filter])

  // With server-side filtering, the animals list is already filtered; still allow lightweight client filter as a fallback
  const filtered = useMemo(() => animals.filter((a) => {
    if (filter !== "All" && !a.species.toLowerCase().includes(filter.toLowerCase())) return false
    if (!query) return true
    const q = query.toLowerCase()
    return a.name.toLowerCase().includes(q) || a.species.toLowerCase().includes(q)
  }), [animals, query, filter])

  return (
    <div className="min-h-screen overflow-x-hidden" style={{ background: "linear-gradient(135deg, #e6f4e6 0%, #f2fff4 50%, #dff0df 100%)" }}>
      <div className="flex">
        <Sidebar />

        <main className="flex-1 p-6 pt-8 md:pt-6">
          <div className="flex items-center justify-between mb-4">
            <Header title="Animals List" subtitle="Search and browse registered animals" />
            {isRefreshing && <div className="ml-4 text-sm text-gray-600">Refreshing…</div>}
          </div>

          {/* Add Animal fixed top-right when we have animals */}
          {((total ?? animals.length) > 0) && (
            <div className="fixed top-6 right-6 z-50">
              <OnboardLauncher />
            </div>
          )}

          <section className="mb-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex-1">
                <SearchBar value={query} onChange={setQuery} placeholder="Search animals by name, species or ID..." />
              </div>

              <FilterChips options={CATEGORY_OPTIONS} value={filter} onChange={setFilter} />
            </div>
          </section>

          <section>
            {((total ?? animals.length) === 0) ? (
              <div className="py-20">
                <div className="max-w-2xl mx-auto text-center p-8 bg-white/60 rounded-lg shadow-sm">
                  <h3 className="text-xl font-semibold mb-2">No animals yet</h3>
                  <p className="text-sm text-gray-600 mb-6">There are no animals registered. Add your first animal to get started.</p>
                  <div className="mt-4">
                    {/* Place Add Animal button here when no animals */}
                    <OnboardLauncher />
                  </div>
                </div>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {loading ? <div>Loading...</div> : filtered.map((a) => <AnimalCard key={a.id} animal={a} />)}
                </div>

                {/* Pagination controls */}
                <div className="mt-6 flex items-center justify-center space-x-3">
                  <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="px-3 py-2 border rounded disabled:opacity-50">Prev</button>
                  <div className="text-sm text-gray-700">Page {page} • {Math.ceil((total || 0) / limit) || 1}</div>
                  <button onClick={() => setPage((p) => p + 1)} disabled={(page * limit) >= total} className="px-3 py-2 border rounded disabled:opacity-50">Next</button>
                </div>
              </>
            )}
          </section>
        </main>
      </div>
    </div>
  )
}

export default Animals
