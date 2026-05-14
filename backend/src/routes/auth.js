const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const db = require('../db/database')
const { JWT_SECRET, authMiddleware } = require('../middleware/auth')

// Admin Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body
    if (!email || !password) return res.status(400).json({ error: 'Email et mot de passe requis' })
    const user = await db.users.findOne({ email })
    if (!user || !bcrypt.compareSync(password, user.password)) return res.status(401).json({ error: 'Identifiants invalides' })
    if (user.role !== 'admin') return res.status(403).json({ error: 'Accès réservé aux administrateurs' })
    const token = jwt.sign({ id: user._id, email: user.email, role: user.role, name: user.name }, JWT_SECRET, { expiresIn: '24h' })
    res.json({ token, user: { id: user._id, email: user.email, role: user.role, name: user.name } })
  } catch { res.status(500).json({ error: 'Erreur serveur' }) }
})

// User Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, phone } = req.body
    if (!name || !email || !password) return res.status(400).json({ error: 'Nom, email et mot de passe requis' })
    const exists = await db.users.findOne({ email })
    if (exists) return res.status(400).json({ error: 'Email déjà utilisé' })
    const hash = bcrypt.hashSync(password, 10)
    const user = await db.users.insert({ name, email, password: hash, phone: phone || '', role: 'buyer', avatar: '', createdAt: new Date() })
    const token = jwt.sign({ id: user._id, email: user.email, role: user.role, name: user.name }, JWT_SECRET, { expiresIn: '7d' })
    res.status(201).json({ token, user: { id: user._id, email: user.email, role: user.role, name: user.name } })
  } catch { res.status(500).json({ error: 'Erreur serveur' }) }
})

// User Login (buyers/sellers)
router.post('/user-login', async (req, res) => {
  try {
    const { email, password } = req.body
    if (!email || !password) return res.status(400).json({ error: 'Email et mot de passe requis' })
    const user = await db.users.findOne({ email })
    if (!user || !bcrypt.compareSync(password, user.password)) return res.status(401).json({ error: 'Identifiants invalides' })
    const token = jwt.sign({ id: user._id, email: user.email, role: user.role, name: user.name }, JWT_SECRET, { expiresIn: '7d' })
    res.json({ token, user: { id: user._id, email: user.email, role: user.role, name: user.name } })
  } catch { res.status(500).json({ error: 'Erreur serveur' }) }
})

// Get current user
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const user = await db.users.findOne({ _id: req.user.id })
    if (!user) return res.status(404).json({ error: 'Utilisateur non trouvé' })
    const { password: _, ...safeUser } = user
    res.json({ ...safeUser, id: user._id })
  } catch { res.status(500).json({ error: 'Erreur serveur' }) }
})

// Update profile
router.put('/profile', authMiddleware, async (req, res) => {
  try {
    const { name, phone } = req.body
    await db.users.update({ _id: req.user.id }, { $set: { name, phone } })
    const user = await db.users.findOne({ _id: req.user.id })
    const { password: _, ...safeUser } = user
    res.json({ ...safeUser, id: user._id })
  } catch { res.status(500).json({ error: 'Erreur serveur' }) }
})

// Admin: list all users
router.get('/users', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Non autorisé' })
    const users = await db.users.find({})
    res.json(users.map(u => { const { password: _, ...s } = u; return { ...s, id: u._id } }))
  } catch { res.status(500).json({ error: 'Erreur serveur' }) }
})

// Admin: update user role
router.put('/users/:id', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Non autorisé' })
    const { role } = req.body
    await db.users.update({ _id: req.params.id }, { $set: { role } })
    res.json({ message: 'Rôle mis à jour' })
  } catch { res.status(500).json({ error: 'Erreur serveur' }) }
})

// Admin: delete user
router.delete('/users/:id', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Non autorisé' })
    const user = await db.users.findOne({ _id: req.params.id })
    if (user && user.role === 'admin') return res.status(403).json({ error: 'Impossible de supprimer un admin' })
    await db.users.remove({ _id: req.params.id })
    res.json({ message: 'Utilisateur supprimé' })
  } catch { res.status(500).json({ error: 'Erreur serveur' }) }
})

module.exports = router
