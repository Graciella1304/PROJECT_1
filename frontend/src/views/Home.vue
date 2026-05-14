<template>
  <div>
    <Navbar />

    <!-- Hero -->
    <section class="hero">
      <div class="container hero-wrap">
        <div class="hero-left">
          <div class="hero-badge"><i class="fa fa-bolt"></i> N°1 au Rwanda</div>
          <h1>{{ t.home.heroTitle }}<br /><span>{{ t.home.heroSpan }}</span></h1>
          <p>{{ t.home.heroSub }}</p>
          <div class="hero-btns">
            <RouterLink to="/listing" class="btn btn-primary btn-xl"><i class="fa fa-search"></i> {{ t.home.browseAds }}</RouterLink>
            <RouterLink to="/sell" class="btn-hero-outline"><i class="fa fa-plus-circle"></i> {{ t.home.postAd }}</RouterLink>
          </div>
          <div class="hero-stats">
            <div class="stat"><strong>12K+</strong><span>Listings</span></div>
            <div class="stat-sep"></div>
            <div class="stat"><strong>8K+</strong><span>Sellers</span></div>
            <div class="stat-sep"></div>
            <div class="stat"><strong>50K+</strong><span>Buyers</span></div>
          </div>
        </div>
        <div class="hero-right">
          <div class="hero-cards-wrap">
            <div class="hero-main-card">
              <img src="https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400" alt="Samsung" />
              <div class="hero-card-label">
                <span>Samsung Galaxy A54</span>
                <strong>450,000 RWF</strong>
              </div>
            </div>
            <div class="hero-side-card top">
              <img src="https://images.unsplash.com/photo-1590735213920-68192a487bc2?w=200" alt="Fashion" />
            </div>
            <div class="hero-side-card bottom">
              <img src="https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=200" alt="Beauty" />
            </div>
          </div>
          <div class="float-card fc1"><i class="fa fa-shield-alt"></i><span>Secure Transactions</span></div>
          <div class="float-card fc2"><i class="fa fa-star"></i><span>4.8 / 5 reviews</span></div>
        </div>
      </div>
    </section>

    <!-- Trust strip -->
    <div class="trust-strip">
      <div class="container trust-row">
        <div class="trust-item"><i class="fa fa-map-marker-alt"></i><div><strong>Across Rwanda</strong><span>Kigali, Huye, Musanze...</span></div></div>
        <div class="trust-item"><i class="fa fa-mobile-alt"></i><div><strong>MTN MoMo &amp; Airtel</strong><span>Secure mobile payment</span></div></div>
        <div class="trust-item"><i class="fa fa-shield-alt"></i><div><strong>Verified Sellers</strong><span>ID-verified profiles</span></div></div>
        <div class="trust-item"><i class="fa fa-headset"></i><div><strong>7/7 Support</strong><span>Fast assistance</span></div></div>
      </div>
    </div>

    <!-- Amazon-style product banner -->
    <section class="amazon-banner">
      <div class="container">
        <div class="ab-header">
          <div><h2>Shop by Category</h2><p>Explore our most popular departments</p></div>
          <RouterLink to="/listing" class="btn btn-secondary btn-sm">{{ t.home.viewAll }} <i class="fa fa-arrow-right"></i></RouterLink>
        </div>
        <div class="ab-grid">
          <div v-for="cat in categories" :key="cat._id" class="ab-card">
            <RouterLink :to="`/listing?category=${cat.slug}`" class="ab-card-inner">
              <div class="ab-img-wrap">
                <img :src="cat.image" :alt="cat.name" @error="e => e.target.src='https://placehold.co/300x200'" />
                <div class="ab-overlay">
                  <i :class="`fa ${cat.icon || 'fa-tag'}`"></i>
                </div>
              </div>
              <div class="ab-info">
                <strong>{{ cat.name }}</strong>
                <span>{{ cat.productCount || '10+' }} listings</span>
                <div class="ab-action">Shop now <i class="fa fa-arrow-right"></i></div>
              </div>
            </RouterLink>
          </div>
        </div>
      </div>
    </section>

    <!-- Featured products carousel banner -->
    <section class="featured-banner">
      <div class="container">
        <div class="section-head">
          <div><h2>{{ t.home.featured }} <span class="head-badge">⭐ Featured</span></h2><p>{{ t.home.selectedForYou }}</p></div>
          <RouterLink to="/listing?featured=true" class="btn btn-secondary btn-sm">{{ t.home.viewAll }} <i class="fa fa-arrow-right"></i></RouterLink>
        </div>
        <div v-if="featured.length" class="products-grid">
          <ProductCard v-for="p in featured" :key="p._id" :product="p" />
        </div>
        <div v-else class="page-loader"><div class="spinner"></div></div>
      </div>
    </section>

    <!-- Deal banner -->
    <div class="deal-strip">
      <div class="container deal-inner">
        <div class="deal-text">
          <span class="deal-badge"><i class="fa fa-fire"></i> Hot Deals</span>
          <h3>Save up to 40% on top products</h3>
          <p>Limited time offers from our top sellers across Rwanda</p>
          <RouterLink to="/listing?sort=price_asc" class="btn btn-primary">Browse Deals <i class="fa fa-arrow-right"></i></RouterLink>
        </div>
        <div class="deal-products">
          <div v-for="p in dealItems" :key="p._id" class="deal-card" @click="$router.push(`/products/${p._id}`)">
            <div class="deal-img"><img :src="p.image" :alt="p.name" @error="e => e.target.src='https://placehold.co/120x120'" /></div>
            <div class="deal-info">
              <span class="deal-name">{{ p.name }}</span>
              <div class="deal-prices">
                <strong>{{ fmt(p.price) }} RWF</strong>
                <del v-if="p.originalPrice">{{ fmt(p.originalPrice) }}</del>
              </div>
              <span v-if="p.originalPrice" class="deal-save">Save {{ Math.round((1 - p.price/p.originalPrice)*100) }}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Sell Banner -->
    <section class="sell-banner">
      <div class="container sell-banner-inner">
        <div class="sb-left">
          <p class="sb-badge"><i class="fa fa-store"></i> For Sellers</p>
          <h2>Start selling today</h2>
          <p>Post your first listing for free and join thousands of active sellers on KlikTrade Rwanda.</p>
          <RouterLink to="/become-seller" class="btn btn-primary btn-lg"><i class="fa fa-rocket"></i> {{ t.nav.becomeSeller }}</RouterLink>
        </div>
        <div class="sb-right">
          <div class="sb-card"><i class="fa fa-camera"></i><div><strong>Add your photos</strong><p>Clear photos = more sales</p></div></div>
          <div class="sb-card"><i class="fa fa-tag"></i><div><strong>Set your price in RWF</strong><p>You control your pricing</p></div></div>
          <div class="sb-card"><i class="fa fa-comments"></i><div><strong>Connect with buyers</strong><p>Direct and secure chat</p></div></div>
        </div>
      </div>
    </section>

    <!-- New listings -->
    <section class="section">
      <div class="container">
        <div class="section-head">
          <div><h2>{{ t.home.newListings }}</h2><p>{{ t.home.freshlyPosted }}</p></div>
          <RouterLink to="/listing" class="btn btn-secondary btn-sm">{{ t.home.viewAll }} <i class="fa fa-arrow-right"></i></RouterLink>
        </div>
        <div v-if="newest.length" class="products-grid">
          <ProductCard v-for="p in newest" :key="p._id" :product="p" />
        </div>
        <div v-else class="page-loader"><div class="spinner"></div></div>
      </div>
    </section>

    <!-- Sign In CTA -->
    <section v-if="!userStore.isLoggedIn" class="signup-cta">
      <div class="container signup-inner">
        <div>
          <h2>{{ t.home.joinUs }}</h2>
          <p>{{ t.home.joinDesc }}</p>
        </div>
        <div class="cta-btns">
          <RouterLink to="/signin?tab=register" class="btn btn-primary btn-lg"><i class="fa fa-user-plus"></i> {{ t.home.createAccount }}</RouterLink>
          <RouterLink to="/signin" class="btn-cta-outline"><i class="fa fa-sign-in-alt"></i> {{ t.auth.signIn }}</RouterLink>
        </div>
      </div>
    </section>

    <Footer />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import Navbar from '../components/Navbar.vue'
import Footer from '../components/Footer.vue'
import ProductCard from '../components/ProductCard.vue'
import { useUserStore } from '../stores/user'
import { useI18nStore } from '../stores/i18n'

const userStore = useUserStore()
const { t } = useI18nStore()
const categories = ref([])
const featured = ref([])
const newest = ref([])
const dealItems = computed(() => featured.value.filter(p => p.originalPrice && p.originalPrice > p.price).slice(0, 4))

function fmt(n) { return Number(n).toLocaleString('fr-RW') }

onMounted(async () => {
  const [c, f, n] = await Promise.all([
    axios.get('/api/categories'),
    axios.get('/api/products?featured=true&limit=8'),
    axios.get('/api/products?limit=8'),
  ])
  categories.value = c.data
  featured.value = f.data.products
  newest.value = n.data.products
})
</script>

<style scoped>
.hero { background: linear-gradient(135deg, #1A1A2E 0%, #16213E 60%, #0F3460 100%); padding: 72px 0; overflow: hidden; position: relative; }
.hero::before { content: ''; position: absolute; inset: 0; background: radial-gradient(ellipse at 70% 50%, rgba(232,93,4,0.12) 0%, transparent 60%); pointer-events: none; }
.hero-wrap { display: grid; grid-template-columns: 1fr 1fr; gap: 56px; align-items: center; position: relative; }

.hero-badge { display: inline-flex; align-items: center; gap: 6px; background: rgba(232,93,4,0.18); border: 1px solid rgba(232,93,4,0.35); color: #FFA55A; font-size: 12px; font-weight: 700; padding: 5px 12px; border-radius: 99px; margin-bottom: 18px; }
.hero-left h1 { font-size: 48px; font-weight: 900; color: #fff; line-height: 1.15; margin-bottom: 16px; letter-spacing: -1px; }
.hero-left h1 span { color: var(--primary-light); }
.hero-left p { font-size: 15px; color: rgba(255,255,255,0.65); line-height: 1.8; margin-bottom: 28px; max-width: 430px; }
.hero-btns { display: flex; align-items: center; gap: 14px; flex-wrap: wrap; margin-bottom: 32px; }
.btn-hero-outline { display: inline-flex; align-items: center; gap: 8px; background: transparent; color: rgba(255,255,255,0.85); border: 2px solid rgba(255,255,255,0.25); padding: 14px 24px; border-radius: var(--radius); font-size: 15px; font-weight: 600; transition: all 0.18s; }
.btn-hero-outline:hover { background: rgba(255,255,255,0.08); border-color: rgba(255,255,255,0.5); }
.hero-stats { display: flex; align-items: center; gap: 0; }
.stat { display: flex; flex-direction: column; padding: 0 20px; }
.stat:first-child { padding-left: 0; }
.stat strong { font-size: 22px; font-weight: 900; color: #fff; }
.stat span { font-size: 12px; color: rgba(255,255,255,0.5); }
.stat-sep { width: 1px; height: 36px; background: rgba(255,255,255,0.12); }

.hero-right { position: relative; height: 360px; }
.hero-cards-wrap { position: relative; height: 100%; }
.hero-main-card { position: absolute; top: 30px; left: 50%; transform: translateX(-50%); width: 200px; height: 260px; border-radius: var(--radius-lg); overflow: hidden; box-shadow: 0 20px 60px rgba(0,0,0,0.4); }
.hero-main-card img { width: 100%; height: 100%; object-fit: cover; }
.hero-card-label { position: absolute; bottom: 0; left: 0; right: 0; background: linear-gradient(transparent, rgba(0,0,0,0.8)); padding: 20px 12px 10px; color: #fff; }
.hero-card-label span { display: block; font-size: 11px; opacity: 0.8; }
.hero-card-label strong { font-size: 14px; font-weight: 800; }
.hero-side-card { position: absolute; width: 110px; height: 110px; border-radius: var(--radius); overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.35); }
.hero-side-card img { width: 100%; height: 100%; object-fit: cover; }
.hero-side-card.top { top: 0; right: 20px; animation: floatY 3s ease-in-out infinite; }
.hero-side-card.bottom { bottom: 20px; left: 20px; animation: floatY 3s ease-in-out infinite 1.5s; }
@keyframes floatY { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
.float-card { position: absolute; background: #fff; border-radius: var(--radius-sm); padding: 8px 14px; box-shadow: var(--shadow-lg); font-size: 12px; font-weight: 700; color: var(--text); display: flex; align-items: center; gap: 7px; }
.float-card i { color: var(--primary); }
.fc1 { top: 0; left: 0; }
.fc2 { bottom: 30px; right: 10px; }

.trust-strip { background: var(--surface); border-bottom: 1px solid var(--border); }
.trust-row { display: grid; grid-template-columns: repeat(4, 1fr); }
.trust-item { display: flex; align-items: center; gap: 12px; padding: 18px 20px; border-right: 1px solid var(--border); }
.trust-item:last-child { border-right: none; }
.trust-item i { font-size: 22px; color: var(--primary); width: 28px; text-align: center; flex-shrink: 0; }
.trust-item strong { display: block; font-size: 13px; font-weight: 700; }
.trust-item span { font-size: 12px; color: var(--text-muted); }

/* Amazon-style banner */
.amazon-banner { padding: 48px 0; background: var(--bg); }
.ab-header { display: flex; align-items: flex-end; justify-content: space-between; margin-bottom: 24px; flex-wrap: wrap; gap: 12px; }
.ab-header h2 { font-size: 22px; font-weight: 800; margin-bottom: 4px; }
.ab-header p { color: var(--text-muted); font-size: 13px; }
.ab-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
.ab-card { border-radius: var(--radius); overflow: hidden; background: var(--surface); border: 1px solid var(--border); box-shadow: var(--shadow-sm); transition: all 0.25s; }
.ab-card:hover { transform: translateY(-4px); box-shadow: var(--shadow-md); border-color: var(--primary); }
.ab-card-inner { display: block; }
.ab-img-wrap { position: relative; aspect-ratio: 4/3; overflow: hidden; }
.ab-img-wrap img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.4s; }
.ab-card:hover .ab-img-wrap img { transform: scale(1.06); }
.ab-overlay { position: absolute; inset: 0; background: linear-gradient(transparent 50%, rgba(0,0,0,0.5) 100%); display: flex; align-items: flex-end; justify-content: flex-end; padding: 12px; opacity: 0; transition: opacity 0.25s; }
.ab-card:hover .ab-overlay { opacity: 1; }
.ab-overlay i { font-size: 20px; color: #fff; background: var(--primary); width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 14px; }
.ab-info { padding: 14px; }
.ab-info strong { display: block; font-size: 14px; font-weight: 700; margin-bottom: 4px; }
.ab-info span { font-size: 12px; color: var(--text-muted); }
.ab-action { display: flex; align-items: center; gap: 5px; font-size: 12px; font-weight: 700; color: var(--primary); margin-top: 8px; transition: gap 0.15s; }
.ab-card:hover .ab-action { gap: 8px; }

/* Featured banner */
.featured-banner { padding: 48px 0; background: var(--surface); }

/* Deal strip */
.deal-strip { background: linear-gradient(135deg, #1A1A2E 0%, #0F3460 100%); padding: 40px 0; }
.deal-inner { display: grid; grid-template-columns: 1fr 2fr; gap: 40px; align-items: center; }
.deal-badge { display: inline-flex; align-items: center; gap: 6px; background: rgba(232,93,4,0.25); border: 1px solid rgba(232,93,4,0.4); color: #FFA55A; font-size: 12px; font-weight: 700; padding: 4px 12px; border-radius: 99px; margin-bottom: 14px; }
.deal-text h3 { font-size: 26px; font-weight: 900; color: #fff; margin-bottom: 8px; }
.deal-text p { color: rgba(255,255,255,0.6); font-size: 13px; margin-bottom: 20px; }
.deal-products { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; }
.deal-card { background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1); border-radius: var(--radius-sm); padding: 12px; cursor: pointer; transition: all 0.2s; display: flex; flex-direction: column; gap: 10px; }
.deal-card:hover { background: rgba(255,255,255,0.12); transform: translateY(-2px); }
.deal-img { aspect-ratio: 1; border-radius: var(--radius-sm); overflow: hidden; }
.deal-img img { width: 100%; height: 100%; object-fit: cover; }
.deal-name { font-size: 12px; font-weight: 600; color: rgba(255,255,255,0.85); display: block; line-height: 1.3; }
.deal-prices { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
.deal-prices strong { color: var(--primary-light); font-size: 13px; font-weight: 800; }
.deal-prices del { color: rgba(255,255,255,0.3); font-size: 11px; }
.deal-save { display: inline-block; background: var(--primary); color: #fff; font-size: 10px; font-weight: 700; padding: 2px 7px; border-radius: 99px; }

.section-head { display: flex; align-items: flex-end; justify-content: space-between; margin-bottom: 24px; flex-wrap: wrap; gap: 12px; }
.section-head h2 { font-size: 22px; font-weight: 800; margin-bottom: 4px; letter-spacing: -0.3px; }
.section-head p { color: var(--text-muted); font-size: 13px; }
.head-badge { background: rgba(245,158,11,0.12); color: var(--warning); font-size: 12px; padding: 2px 8px; border-radius: 99px; font-weight: 600; vertical-align: middle; margin-left: 6px; }

.products-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }

.sell-banner { background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%); padding: 56px 0; }
.sell-banner-inner { display: grid; grid-template-columns: 1fr 1fr; gap: 48px; align-items: center; }
.sb-badge { display: inline-flex; align-items: center; gap: 6px; background: rgba(255,255,255,0.15); color: rgba(255,255,255,0.9); font-size: 12px; font-weight: 700; padding: 4px 12px; border-radius: 99px; margin-bottom: 14px; }
.sb-left h2 { font-size: 32px; font-weight: 900; color: #fff; margin-bottom: 12px; letter-spacing: -0.5px; }
.sb-left p { color: rgba(255,255,255,0.75); line-height: 1.8; margin-bottom: 24px; font-size: 15px; }
.sb-right { display: flex; flex-direction: column; gap: 14px; }
.sb-card { display: flex; align-items: center; gap: 14px; background: rgba(255,255,255,0.1); border-radius: var(--radius-sm); padding: 14px 18px; }
.sb-card i { font-size: 22px; color: rgba(255,255,255,0.9); width: 28px; text-align: center; flex-shrink: 0; }
.sb-card strong { display: block; color: #fff; font-size: 14px; margin-bottom: 2px; }
.sb-card p { color: rgba(255,255,255,0.65); font-size: 12px; margin: 0; }

.signup-cta { background: var(--secondary); padding: 56px 0; }
.signup-inner { display: flex; align-items: center; justify-content: space-between; gap: 32px; flex-wrap: wrap; }
.signup-inner h2 { font-size: 26px; font-weight: 800; color: #fff; margin-bottom: 8px; }
.signup-inner p { color: rgba(255,255,255,0.6); font-size: 14px; }
.cta-btns { display: flex; gap: 12px; flex-wrap: wrap; align-items: center; }
.btn-cta-outline { display: inline-flex; align-items: center; gap: 8px; color: rgba(255,255,255,0.8); border: 1.5px solid rgba(255,255,255,0.2); padding: 12px 22px; border-radius: var(--radius-sm); font-size: 14px; font-weight: 600; transition: all 0.18s; }
.btn-cta-outline:hover { border-color: rgba(255,255,255,0.5); color: #fff; }

@media (max-width: 1100px) { .ab-grid { grid-template-columns: repeat(4, 1fr); } .products-grid { grid-template-columns: repeat(3, 1fr); } .deal-products { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 900px) { .hero-wrap { grid-template-columns: 1fr; } .hero-right { display: none; } .hero-left h1 { font-size: 34px; } .trust-row { grid-template-columns: repeat(2, 1fr); } .trust-item { border-bottom: 1px solid var(--border); } .sell-banner-inner { grid-template-columns: 1fr; } .products-grid { grid-template-columns: repeat(2, 1fr); } .ab-grid { grid-template-columns: repeat(2, 1fr); } .deal-inner { grid-template-columns: 1fr; } }
@media (max-width: 600px) { .hero { padding: 44px 0; } .hero-left h1 { font-size: 26px; } .trust-row { grid-template-columns: 1fr; } .signup-inner { flex-direction: column; align-items: flex-start; } .ab-grid { grid-template-columns: repeat(2, 1fr); } .deal-products { grid-template-columns: repeat(2, 1fr); } }
</style>
