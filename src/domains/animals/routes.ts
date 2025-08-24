import { Router } from 'express'
import { Animal } from './model'

const router = Router()

// GET / - list animals
router.get('/', async (req, res) => {
  try {
    // Query params: q (search), species (filter), page, limit
    const q = String(req.query.q ?? '').trim()
    const species = req.query.species ? String(req.query.species) : undefined
    const page = Math.max(1, Number(req.query.page) || 1)
    const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 24))

    const filter: any = {}
    if (species && species.toLowerCase() !== 'all') {
      // partial, case-insensitive match (so chips like 'Mammals' match 'African Mammals')
      const esc = String(species).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
      filter.species = new RegExp(esc, 'i')
    }

    if (q) {
      // simple regex across name, species and microchipId
      const escaped = q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
      const re = new RegExp(escaped, 'i')
      filter.$or = [{ name: re }, { species: re }, { microchipId: re }]
    }

    const total = await Animal.countDocuments(filter)
    const animals = await Animal.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean()

    res.json({ success: true, data: animals, meta: { total, page, limit, pages: Math.ceil(total / limit) } })
  } catch (err) {
    console.error('Failed to fetch animals', err)
    res.status(500).json({ success: false, message: 'Failed to fetch animals' })
  }
})

export default router
