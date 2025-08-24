import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { useEffect, useMemo, useState, useRef } from "react";
import AnimalCard from "../components/AnimalCard";
import type { Animal } from "../components/AnimalCard";
import SearchBar from "../components/SearchBar";
import AddAnimalButton from "../components/AddAnimalButton";
import { api } from "../lib/http-client";

type AnimalsResponse = { success: boolean; data: Array<Record<string, unknown>>; meta?: { total?: number; page?: number; limit?: number; pages?: number } }

export const Animals = () => {
  const [query, setQuery] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false)
  const [animals, setAnimals] = useState<Animal[]>([])
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
        const res = await api.get<AnimalsResponse>('/v1/animals')
        const list = (res && (res as AnimalsResponse).data) || []
        // map to Animal shape used by AnimalCard
        const mapped: Animal[] = list.map((a: Record<string, unknown>) => ({
          id: String(a._id ?? a.id ?? ''),
          name: String(a.name ?? ''),
          species: String(a.species ?? ''),
          age: a.age ? `${String(a.age)} years` : 'N/A',
          gender: String(a.sex ?? 'Unknown'),
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

    // Load once on mount
    if (!initialLoaded.current) {
      load()
    }

    const onRefresh = () => load(true)
    window.addEventListener('animals:refresh', onRefresh as EventListener)
    return () => {
      window.removeEventListener('animals:refresh', onRefresh as EventListener)
    }
  }, [])

  // Frontend search filtering
  const filtered = useMemo(() => {
    if (!query) return animals
    const q = query.toLowerCase()
    return animals.filter((a) => 
      a.name.toLowerCase().includes(q) || 
      a.species.toLowerCase().includes(q) ||
      (a.id && a.id.toLowerCase().includes(q))
    )
  }, [animals, query])

  return (
    <div className="min-h-screen overflow-x-hidden" style={{ background: "linear-gradient(135deg, #e6f4e6 0%, #f2fff4 50%, #dff0df 100%)" }}>
      <div className="flex">
        <Sidebar />

        <main className="flex-1 p-6 pt-8 md:pt-6 md:ml-52">
          <div className="flex items-center justify-between mb-4">
            <Header title="Animals List" subtitle="Search and browse registered animals" />
            {isRefreshing && <div className="ml-4 text-sm text-gray-600">Refreshing…</div>}
          </div>

          {/* Add Animal fixed top-right when we have animals */}
          {animals.length > 0 && (
            <div className="fixed top-6 right-6 z-50">
              <AddAnimalButton />
            </div>
          )}

          <section className="mb-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex-1">
                <SearchBar value={query} onChange={setQuery} placeholder="Search animals by name" />
              </div>
            </div>
          </section>

          <section>
            {animals.length === 0 ? (
              <div className="py-20">
                <div className="max-w-2xl mx-auto text-center p-8 bg-white/60 rounded-lg shadow-sm">
                  <h3 className="text-xl font-semibold mb-2">No animals yet</h3>
                  <p className="text-sm text-gray-600 mb-6">There are no animals registered. Add your first animal to get started.</p>
                  <div className="mt-4">
                    {/* Place Add Animal button here when no animals */}
                    <AddAnimalButton />
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                  <div className="col-span-full text-center py-8">Loading...</div>
                ) : filtered.length === 0 ? (
                  <div className="col-span-full text-center py-8">
                    <p className="text-gray-600">No animals found matching "{query}"</p>
                  </div>
                ) : (
                  filtered.map((a) => <AnimalCard key={a.id} animal={a} />)
                )}
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  )
}

export default Animals
