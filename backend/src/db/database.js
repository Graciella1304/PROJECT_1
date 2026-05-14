const Datastore = require('nedb-promises')
const bcrypt = require('bcryptjs')
const path = require('path')

const dataDir = path.join(__dirname, '../../data')

const db = {
  users: Datastore.create({ filename: path.join(dataDir, 'users.db'), autoload: true }),
  categories: Datastore.create({ filename: path.join(dataDir, 'categories.db'), autoload: true }),
  products: Datastore.create({ filename: path.join(dataDir, 'products.db'), autoload: true }),
  orders: Datastore.create({ filename: path.join(dataDir, 'orders.db'), autoload: true }),
  reviews: Datastore.create({ filename: path.join(dataDir, 'reviews.db'), autoload: true }),
  wishlists: Datastore.create({ filename: path.join(dataDir, 'wishlists.db'), autoload: true }),
}

async function seedDB() {
  const userCount = await db.users.count({})
  if (userCount === 0) {
    const adminHash = bcrypt.hashSync('cortis2005', 10)
    const userHash = bcrypt.hashSync('password123', 10)
    await db.users.insert([
      { email: 'kliktradeshop@gmail.com', password: adminHash, role: 'admin', name: 'Admin', phone: '', avatar: '', createdAt: new Date() },
      { email: 'alice@example.com', password: userHash, role: 'seller', name: 'Alice Uwimana', phone: '+250 788 123 456', avatar: '', createdAt: new Date() },
      { email: 'bob@example.com', password: userHash, role: 'buyer', name: 'Bob Nkurunziza', phone: '+250 722 987 654', avatar: '', createdAt: new Date() },
    ])
  }

  const catCount = await db.categories.count({})
  if (catCount === 0) {
    await db.categories.insert([
      { name: 'Electronics', slug: 'electronics', image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400', createdAt: new Date() },
      { name: 'Fashion', slug: 'fashion', image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400', createdAt: new Date() },
      { name: 'Home & Kitchen', slug: 'home-kitchen', image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400', createdAt: new Date() },
      { name: 'Sports', slug: 'sports', image: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=400', createdAt: new Date() },
      { name: 'Beauty', slug: 'beauty', image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400', createdAt: new Date() },
      { name: 'Books', slug: 'books', image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400', createdAt: new Date() },
      { name: 'Vehicles', slug: 'vehicles', image: 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=400', createdAt: new Date() },
      { name: 'Agriculture', slug: 'agriculture', image: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=400', createdAt: new Date() },
    ])
  }

  const prodCount = await db.products.count({})
  if (prodCount === 0) {
    const cats = await db.categories.find({})
    const catMap = {}
    cats.forEach(c => { catMap[c.slug] = c._id })

    await db.products.insert([
      { name: 'Samsung Galaxy A54', description: 'Smartphone 6.4", 128GB, Double SIM, batterie 5000mAh. Excellent état, peu utilisé.', price: 450000, originalPrice: 580000, stock: 10, categoryId: catMap['electronics'], categoryName: 'Electronics', image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500', featured: true, rating: 4.7, reviewsCount: 34, condition: 'Used', location: 'Kigali', sellerName: 'Alice Uwimana', createdAt: new Date() },
      { name: 'iPhone 14 Pro', description: 'iPhone 14 Pro 256GB couleur Space Black. Débloqué tout opérateur. Accessoires inclus.', price: 1200000, originalPrice: 1500000, stock: 5, categoryId: catMap['electronics'], categoryName: 'Electronics', image: 'https://images.unsplash.com/photo-1678685888221-cda773a3dcdb?w=500', featured: true, rating: 4.9, reviewsCount: 89, condition: 'Like New', location: 'Kigali', sellerName: 'Alice Uwimana', createdAt: new Date() },
      { name: 'Ordinateur Portable Dell', description: 'Dell Latitude Core i5, 8GB RAM, 256GB SSD. Parfait pour le bureau ou les études.', price: 750000, originalPrice: 950000, stock: 8, categoryId: catMap['electronics'], categoryName: 'Electronics', image: 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=500', featured: true, rating: 4.5, reviewsCount: 21, condition: 'Used', location: 'Musanze', sellerName: 'Bob Nkurunziza', createdAt: new Date() },
      { name: 'Robe Africaine Traditionnelle', description: 'Belle robe africaine faite à la main. Tissu kitenge de haute qualité. Disponible en plusieurs tailles.', price: 35000, originalPrice: 50000, stock: 25, categoryId: catMap['fashion'], categoryName: 'Fashion', image: 'https://images.unsplash.com/photo-1590735213920-68192a487bc2?w=500', featured: true, rating: 4.8, reviewsCount: 67, condition: 'New', location: 'Kigali', sellerName: 'Alice Uwimana', createdAt: new Date() },
      { name: 'Chaussures en Cuir Homme', description: 'Chaussures en cuir véritable artisanales. Confortables et élégantes pour toutes occasions.', price: 45000, originalPrice: 65000, stock: 15, categoryId: catMap['fashion'], categoryName: 'Fashion', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500', featured: false, rating: 4.3, reviewsCount: 28, condition: 'New', location: 'Kigali', sellerName: 'Bob Nkurunziza', createdAt: new Date() },
      { name: 'Machine à Coudre Singer', description: 'Machine à coudre Singer électrique. Parfaite pour couturières et artisans. Fonctionne très bien.', price: 180000, originalPrice: 250000, stock: 3, categoryId: catMap['home-kitchen'], categoryName: 'Home & Kitchen', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500', featured: true, rating: 4.6, reviewsCount: 45, condition: 'Used', location: 'Huye', sellerName: 'Alice Uwimana', createdAt: new Date() },
      { name: 'Canapé 3 Places', description: 'Canapé 3 places en tissu beige, très confortable. En excellent état, légèrement utilisé.', price: 280000, originalPrice: 400000, stock: 2, categoryId: catMap['home-kitchen'], categoryName: 'Home & Kitchen', image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500', featured: false, rating: 4.4, reviewsCount: 12, condition: 'Used', location: 'Kigali', sellerName: 'Bob Nkurunziza', createdAt: new Date() },
      { name: 'Vélo de Montagne', description: 'VTT 26 pouces avec 21 vitesses. Freins à disque, cadre aluminium léger. Parfait pour les routes rwandaises.', price: 120000, originalPrice: 180000, stock: 6, categoryId: catMap['sports'], categoryName: 'Sports', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500', featured: false, rating: 4.5, reviewsCount: 19, condition: 'Used', location: 'Musanze', sellerName: 'Alice Uwimana', createdAt: new Date() },
      { name: 'Crème Hydratante Visage', description: 'Crème hydratante naturelle pour peaux africaines. Formule enrichie en beurre de karité et aloe vera.', price: 12000, originalPrice: 18000, stock: 50, categoryId: catMap['beauty'], categoryName: 'Beauty', image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=500', featured: true, rating: 4.7, reviewsCount: 156, condition: 'New', location: 'Kigali', sellerName: 'Alice Uwimana', createdAt: new Date() },
      { name: 'Set Perruques Naturelles', description: 'Collection de perruques naturelles de qualité supérieure. Cheveux naturels 100%, longue durée.', price: 85000, originalPrice: 120000, stock: 20, categoryId: catMap['beauty'], categoryName: 'Beauty', image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=500', featured: false, rating: 4.2, reviewsCount: 73, condition: 'New', location: 'Kigali', sellerName: 'Bob Nkurunziza', createdAt: new Date() },
      { name: 'Moto Honda CB125', description: 'Honda CB125 2021 en parfait état. Faible kilométrage, documents complets. Idéale pour Kigali.', price: 2800000, originalPrice: 3500000, stock: 1, categoryId: catMap['vehicles'], categoryName: 'Vehicles', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500', featured: true, rating: 4.8, reviewsCount: 8, condition: 'Used', location: 'Kigali', sellerName: 'Alice Uwimana', createdAt: new Date() },
      { name: 'Sacs de Haricots 50kg', description: 'Haricots rouges locaux frais récolte 2024. Prix par sac de 50kg. Disponible en grande quantité.', price: 65000, originalPrice: 80000, stock: 100, categoryId: catMap['agriculture'], categoryName: 'Agriculture', image: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=500', featured: false, rating: 4.6, reviewsCount: 34, condition: 'New', location: 'Ruhango', sellerName: 'Bob Nkurunziza', createdAt: new Date() },
    ])
  }

  const orderCount = await db.orders.count({})
  if (orderCount === 0) {
    const statuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled']
    const sampleOrders = []
    for (let i = 1; i <= 15; i++) {
      sampleOrders.push({
        orderNumber: `KT-${String(1000 + i).padStart(4, '0')}`,
        customerName: `Acheteur ${i}`,
        customerEmail: `buyer${i}@example.com`,
        customerPhone: `+250 78${i} 000 000`,
        address: `KG ${i * 5} Ave`,
        city: ['Kigali', 'Huye', 'Musanze', 'Rubavu', 'Ruhango'][i % 5],
        items: [{ name: 'Produit exemple', qty: (i % 3) + 1, price: (i * 15000) }],
        total: (i * 15000) * ((i % 3) + 1),
        status: statuses[i % 5],
        paymentMethod: ['momo', 'cash', 'card'][i % 3],
        notes: '',
        createdAt: new Date(Date.now() - i * 24 * 60 * 60 * 1000),
      })
    }
    await db.orders.insert(sampleOrders)
  }
}

seedDB().catch(console.error)

module.exports = db
