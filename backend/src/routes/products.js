const express = require('express')
const router = express.Router()
const db = require('../db/database')
const { authMiddleware } = require('../middleware/auth')
const multer = require('multer')
const path = require('path')

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, '../../uploads')),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
})
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } })

router.get('/', async (req, res) => {
  try {
    const { category, search, featured, sort, page = 1, limit = 12, seller } = req.query
    let query = {}
    if (category) {
      const cat = await db.categories.findOne({ slug: category })
      if (cat) query.categoryId = cat._id
    }
    if (featured === 'true') query.featured = true
    if (seller) query.sellerId = seller
    if (search) {
      const re = new RegExp(search, 'i')
      query.$or = [{ name: re }, { description: re }, { location: re }]
    }
    let sortObj = { createdAt: -1 }
    if (sort === 'price_asc') sortObj = { price: 1 }
    else if (sort === 'price_desc') sortObj = { price: -1 }
    else if (sort === 'rating') sortObj = { rating: -1 }

    const total = await db.products.count(query)
    const skip = (parseInt(page) - 1) * parseInt(limit)
    const products = await db.products.find(query).sort(sortObj).skip(skip).limit(parseInt(limit))
    res.json({ products: products.map(p => ({ ...p, id: p._id })), total, page: parseInt(page), limit: parseInt(limit) })
  } catch { res.status(500).json({ error: 'Erreur serveur' }) }
})

router.get('/:id', async (req, res) => {
  try {
    const product = await db.products.findOne({ _id: req.params.id })
    if (!product) return res.status(404).json({ error: 'Produit non trouvé' })
    const reviews = await db.reviews.find({ productId: req.params.id }).sort({ createdAt: -1 })
    res.json({ ...product, id: product._id, reviews })
  } catch { res.status(500).json({ error: 'Erreur serveur' }) }
})

// Anyone authenticated can post a product (sellers & buyers)
router.post('/', authMiddleware, upload.single('image'), async (req, res) => {
  try {
    const { name, description, price, originalPrice, stock, categoryId, featured, condition, location, phone } = req.body
    if (!name || !price) return res.status(400).json({ error: 'Nom et prix requis' })
    const image = req.file ? `/uploads/${req.file.filename}` : (req.body.image || '')
    let categoryName = ''
    if (categoryId) {
      const cat = await db.categories.findOne({ _id: categoryId })
      if (cat) categoryName = cat.name
    }
    const seller = await db.users.findOne({ _id: req.user.id })
    const product = await db.products.insert({
      name, description: description || '', price: parseInt(price), originalPrice: originalPrice ? parseInt(originalPrice) : null,
      stock: parseInt(stock) || 1, categoryId: categoryId || null, categoryName, image, featured: req.user.role === 'admin' && (featured === 'true' || featured === true),
      rating: 0, reviewsCount: 0, condition: condition || 'New', location: location || 'Rwanda',
      sellerName: seller ? seller.name : req.user.name, sellerId: req.user.id,
      phone: phone || (seller ? seller.phone : ''), status: 'active', createdAt: new Date()
    })
    res.status(201).json({ ...product, id: product._id })
  } catch { res.status(500).json({ error: 'Erreur serveur' }) }
})

router.put('/:id', authMiddleware, upload.single('image'), async (req, res) => {
  try {
    const existing = await db.products.findOne({ _id: req.params.id })
    if (!existing) return res.status(404).json({ error: 'Produit non trouvé' })
    if (req.user.role !== 'admin' && existing.sellerId !== req.user.id) return res.status(403).json({ error: 'Non autorisé' })
    const { name, description, price, originalPrice, stock, categoryId, featured, condition, location, phone } = req.body
    const image = req.file ? `/uploads/${req.file.filename}` : (req.body.image || existing.image)
    let categoryName = existing.categoryName
    if (categoryId) {
      const cat = await db.categories.findOne({ _id: categoryId })
      if (cat) categoryName = cat.name
    }
    await db.products.update({ _id: req.params.id }, { $set: { name: name || existing.name, description: description ?? existing.description, price: price ? parseInt(price) : existing.price, originalPrice: originalPrice ? parseInt(originalPrice) : existing.originalPrice, stock: stock !== undefined ? parseInt(stock) : existing.stock, categoryId: categoryId || existing.categoryId, categoryName, image, condition: condition || existing.condition, location: location || existing.location, phone: phone || existing.phone, featured: req.user.role === 'admin' ? (featured === 'true') : existing.featured } })
    const product = await db.products.findOne({ _id: req.params.id })
    res.json({ ...product, id: product._id })
  } catch { res.status(500).json({ error: 'Erreur serveur' }) }
})

router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const product = await db.products.findOne({ _id: req.params.id })
    if (!product) return res.status(404).json({ error: 'Produit non trouvé' })
    if (req.user.role !== 'admin' && product.sellerId !== req.user.id) return res.status(403).json({ error: 'Non autorisé' })
    await db.products.remove({ _id: req.params.id })
    res.json({ message: 'Produit supprimé' })
  } catch { res.status(500).json({ error: 'Erreur serveur' }) }
})

router.post('/:id/reviews', async (req, res) => {
  try {
    const { name, rating, comment } = req.body
    if (!name || !rating) return res.status(400).json({ error: 'Nom et note requis' })
    await db.reviews.insert({ productId: req.params.id, name, rating: parseInt(rating), comment: comment || '', createdAt: new Date() })
    const allReviews = await db.reviews.find({ productId: req.params.id })
    const avg = allReviews.reduce((s, r) => s + r.rating, 0) / allReviews.length
    await db.products.update({ _id: req.params.id }, { $set: { rating: parseFloat(avg.toFixed(1)), reviewsCount: allReviews.length } })
    res.status(201).json({ message: 'Avis ajouté' })
  } catch { res.status(500).json({ error: 'Erreur serveur' }) }
})

module.exports = router
