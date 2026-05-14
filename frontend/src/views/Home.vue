<template>
  <div>
    <Navbar />

    <!-- Hero — full width, no placeholder product images -->
    <section class="hero">
      <div class="container hero-wrap">
        <div class="hero-left">
          <div class="hero-badge"><i class="fa fa-bolt"></i> N°1 au Rwanda</div>
          <h1>Buy, Sell &amp;<br /><span>Trade in Rwanda</span></h1>
          <p>Thousands of listings from individuals and professional sellers. Electronics, fashion, vehicles, agriculture and more — all in Rwandan Francs.</p>
          <div class="hero-btns">
            <RouterLink to="/listing" class="btn btn-primary btn-xl"><i class="fa fa-search"></i> Browse Listings</RouterLink>
            <RouterLink v-if="userStore.user?.role === 'seller'" to="/sell" class="btn-hero-outline"><i class="fa fa-plus-circle"></i> Post an Ad</RouterLink>
            <RouterLink v-else to="/become-seller" class="btn-hero-outline"><i class="fa fa-store"></i> Become a Seller</RouterLink>
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
          <div class="hero-brand-showcase">
            <img src="/logo.png" alt="KlikTrade" class="showcase-logo" />
            <h2>KlikTrade</h2>
            <p>Rwanda</p>
            <div class="hero-trust-pills">
              <span><i class="fa fa-shield-alt"></i> Secure</span>
              <span><i class="fa fa-check-circle"></i> Verified</span>
              <span><i class="fa fa-mobile-alt"></i> MoMo Pay</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Trust strip -->
    <div class="trust-strip">
      <div class="container trust-row">
        <div class="trust-item"><i class="fa fa-map-marker-alt"></i><div><strong>Across Rwanda</strong><span>Kigali, Huye, Musanze...</span></div></div>
        <div class="trust-item"><i class="fa fa-mobile-alt"></i><div><strong>MTN MoMo &amp; Airtel</strong><span>Secure mobile payment</span></div></div>
        <div class="trust-item"><i class="fa fa-id-card"></i><div><strong>Verified Sellers</strong><span>ID-verified profiles</span></div></div>
        <div class="trust-item"><i class="fa fa-headset"></i><div><strong>7/7 Support</strong><span>Fast assistance</span></div></div>
      </div>
    </div>

    <!-- Categories banner -->
    <section class="amazon-banner">
      <div class="container">
        <div class="ab-header">
          <div><h2>Shop by Category</h2><p>Explore our most popular departments</p></div>
          <RouterLink to="/listing" class="btn btn-secondary btn-sm">View All <i class="fa fa-arrow-right"></i></RouterLink>
        </div>
        <div class="ab-grid">
          <div v-for="cat in categories" :key="cat._id" class="ab-card">
            <RouterLink :to="`/listing?category=${cat.slug}`" class="ab-card-inner">
              <div class="ab-icon-wrap">
                <i :class="`fa ${cat.icon || 'fa-tag'}`"></i>
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

    <!-- Featured products -->
    <section class="featured-banner">
      <div class="container">
        <div class="section-head">
          <div><h2>Featured Listings <span class="head-badge">⭐ Featured</span></h2><p>Hand-picked top products</p></div>
          <RouterLink to="/listing?featured=true" class="btn btn-secondary btn-sm">View All <i class="fa fa-arrow-right"></i></RouterLink>
        </div>
        <div v-if="featured.length" class="products-grid">
          <ProductCard v-for="p in featured" :key="p._id" :product="p" />
        </div>
        <div v-else class="page-loader"><div class="spinner"></div></div>
      </div>
    </section>

    <!-- Sell Banner — only for non-sellers -->
    <section v-if="!userStore.user || userStore.user?.role !== 'seller'" class="sell-banner">
      <div class="container sell-banner-inner">
        <div class="sb-left">
          <p class="sb-badge"><i class="fa fa-store"></i> For Sellers</p>
          <h2>Start selling today</h2>
          <p>Post your first listing for free and join thousands of active sellers on KlikTrade Rwanda.</p>
          <RouterLink to="/become-seller" class="btn btn-lg" style="background:#fff; color:var(--primary); font-weight:700;">
            <i class="fa fa-rocket"></i> Become a Seller
          </RouterLink>
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
          <div><h2>Newest Listings</h2><p>Freshly posted by sellers near you</p></div>
          <RouterLink to="/listing" class="btn btn-secondary btn-sm">View All <i class="fa fa-arrow-right"></i></RouterLink>
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
          <h2>Join KlikTrade Rwanda</h2>
          <p>Create your free account and start buying or selling today.</p>
        </div>
        <div class="cta-btns">
          <RouterLink to="/signin?tab=register" class="btn btn-primary btn-lg"><i class="fa fa-user-plus"></i> Create Account</RouterLink>
          <RouterLink to="/signin" class="btn-cta-outline"><i class="fa fa-sign-in-alt"></i> Sign In</RouterLink>
        </div>
      </div>
    </section>

    <Footer />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import Navbar from '../components/Navbar.vue'
import Footer from '../components/Footer.vue'
import ProductCard from '../components/ProductCard.vue'
import { useUserStore } from '../stores/user'

const userStore = useUserStore()
const categories = ref([])
const featured = ref([])
const newest = ref([])

onMounted(async () => {
  const [c, f, n] = await Promise.all([
    axios.get('/api/categories'),
    axios.get('/api/products?featured=true&limit=8'),
    axios.get('/api/products?limit=8'),
  ])
  categories.value = c.data
  featured.value = f.data.products || []
  newest.value = n.data.products || []
})
</script>

<style scoped>
/* Hero */
.hero { background: linear-gradient(135deg, var(--secondary) 0%, #3D2B1F 60%, #5D4037 100%); padding: 72px 0; overflow: hidden; position: relative; }
.hero::before { content: ''; position: absolute; inset: 0; background: radial-gradient(ellipse at 70% 50%, rgba(139,90,43,0.18) 0%, transparent 60%); pointer-events: none; }
.hero-wrap { display: grid; grid-template-columns: 1fr 1fr; gap: 56px; align-items: center; position: relative; }

.hero-badge { display: inline-flex; align-items: center; gap: 6px; background: rgba(139,90,43,0.25); border: 1px solid rgba(176,120,64,0.4); color: var(--primary-light); font-size: 12px; font-weight: 700; padding: 5px 12px; border-radius: 99px; margin-bottom: 18px; }
.hero-left h1 { font-size: 48px; font-weight: 900; color: #fff; line-height: 1.15; margin-bottom: 16px; letter-spacing: -1px; }
.hero-left h1 span { color: var(--primary-light); }
.hero-left p { font-size: 15px; color: rgba(255,255,255,0.65); line-height: 1.8; margin-bottom: 28px; max-width: 430px; }
.hero-btns { display: flex; align-items: center; gap: 14px; flex-wrap: wrap; margin-bottom: 32px; }
.btn-hero-outline { display: inline-flex; align-items: center; gap: 8px; background: transparent; color: rgba(255,255,255,0.85); border: 2px solid rgba(255,255,255,0.25); padding: 14px 24px; border-radius: var(--radius); font-size: 15px; font-weight: 600; transition: all 0.18s; }
.btn-hero-outline:hover { background: rgba(255,255,255,0.08); border-color: rgba(255,255,255,0.5); }
.hero-stats { display: flex; align-items: center; }
.stat { display: flex; flex-direction: column; padding: 0 20px; }
.stat:first-child { padding-left: 0; }
.stat strong { font-size: 22px; font-weight: 900; color: #fff; }
.stat span { font-size: 12px; color: rgba(255,255,255,0.5); }
.stat-sep { width: 1px; height: 36px; background: rgba(255,255,255,0.12); }

.hero-right { display: flex; align-items: center; justify-content: center; }
.hero-brand-showcase { background: rgba(255,255,255,0.06); border: 1px solid rgba(176,120,64,0.25); border-radius: var(--radius-lg); padding: 48px 40px; text-align: center; backdrop-filter: blur(8px); display: flex; flex-direction: column; align-items: center; gap: 12px; max-width: 320px; width: 100%; }
.showcase-logo { height: 90px; width: 90px; object-fit: contain; margin-bottom: 8px; filter: drop-shadow(0 4px 16px rgba(139,90,43,0.4)); }
.hero-brand-showcase h2 { font-size: 28px; font-weight: 900; color: #fff; margin: 0; }
.hero-brand-showcase p { font-size: 13px; color: var(--primary-light); font-weight: 700; text-transform: uppercase; letter-spacing: 2px; margin: 0; }
.hero-trust-pills { display: flex; gap: 8px; flex-wrap: wrap; justify-content: center; margin-top: 8px; }
.hero-trust-pills span { display: inline-flex; align-items: center; gap: 5px; background: rgba(139,90,43,0.25); border: 1px solid rgba(176,120,64,0.3); color: rgba(255,255,255,0.8); font-size: 12px; font-weight: 600; padding: 5px 12px; border-radius: 99px; }
.hero-trust-pills i { color: var(--primary-light); font-size: 11px; }

/* Trust strip */
.trust-strip { background: var(--surface); border-bottom: 1px solid var(--border); }
.trust-row { display: grid; grid-template-columns: repeat(4, 1fr); }
.trust-item { display: flex; align-items: center; gap: 12px; padding: 18px 20px; border-right: 1px solid var(--border); }
.trust-item:last-child { border-right: none; }
.trust-item i { font-size: 22px; color: var(--primary); width: 28px; text-align: center; flex-shrink: 0; }
.trust-item strong { display: block; font-size: 13px; font-weight: 700; }
.trust-item span { font-size: 12px; color: var(--text-muted); }

/* Category banner — icon-based, no images needed */
.amazon-banner { padding: 48px 0; background: var(--bg); }
.ab-header { display: flex; align-items: flex-end; justify-content: space-between; margin-bottom: 24px; flex-wrap: wrap; gap: 12px; }
.ab-header h2 { font-size: 22px; font-weight: 800; margin-bottom: 4px; }
.ab-header p { color: var(--text-muted); font-size: 13px; }
.ab-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
.ab-card { border-radius: var(--radius); overflow: hidden; background: var(--surface); border: 1px solid var(--border); box-shadow: var(--shadow-sm); transition: all 0.25s; }
.ab-card:hover { transform: translateY(-4px); box-shadow: var(--shadow-md); border-color: var(--primary); }
.ab-card-inner { display: block; }
.ab-icon-wrap { background: linear-gradient(135deg, var(--primary-bg) 0%, var(--surface-2) 100%); padding: 32px 20px; display: flex; align-items: center; justify-content: center; }
.ab-icon-wrap i { font-size: 36px; color: var(--primary); transition: transform 0.25s; }
.ab-card:hover .ab-icon-wrap i { transform: scale(1.15); }
.ab-info { padding: 14px; }
.ab-info strong { display: block; font-size: 14px; font-weight: 700; margin-bottom: 4px; }
.ab-info span { font-size: 12px; color: var(--text-muted); }
.ab-action { display: flex; align-items: center; gap: 5px; font-size: 12px; font-weight: 700; color: var(--primary); margin-top: 8px; transition: gap 0.15s; }
.ab-card:hover .ab-action { gap: 8px; }

/* Featured / New */
.featured-banner { padding: 48px 0; background: var(--surface); }
.section-head { display: flex; align-items: flex-end; justify-content: space-between; margin-bottom: 24px; flex-wrap: wrap; gap: 12px; }
.section-head h2 { font-size: 22px; font-weight: 800; margin-bottom: 4px; letter-spacing: -0.3px; }
.section-head p { color: var(--text-muted); font-size: 13px; }
.head-badge { background: rgba(217,119,6,0.12); color: var(--warning); font-size: 12px; padding: 2px 8px; border-radius: 99px; font-weight: 600; vertical-align: middle; margin-left: 6px; }
.products-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }

/* Sell banner */
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

/* CTA */
.signup-cta { background: var(--secondary); padding: 56px 0; }
.signup-inner { display: flex; align-items: center; justify-content: space-between; gap: 32px; flex-wrap: wrap; }
.signup-inner h2 { font-size: 26px; font-weight: 800; color: #fff; margin-bottom: 8px; }
.signup-inner p { color: rgba(255,255,255,0.55); font-size: 14px; }
.cta-btns { display: flex; gap: 12px; flex-wrap: wrap; align-items: center; }
.btn-cta-outline { display: inline-flex; align-items: center; gap: 8px; color: rgba(255,255,255,0.8); border: 1.5px solid rgba(255,255,255,0.2); padding: 12px 22px; border-radius: var(--radius-sm); font-size: 14px; font-weight: 600; transition: all 0.18s; }
.btn-cta-outline:hover { border-color: rgba(255,255,255,0.5); color: #fff; }

@media (max-width: 1100px) { .ab-grid { grid-template-columns: repeat(4, 1fr); } .products-grid { grid-template-columns: repeat(3, 1fr); } }
@media (max-width: 900px) { .hero-wrap { grid-template-columns: 1fr; } .hero-right { justify-content: flex-start; } .hero-brand-showcase { max-width: 100%; } .hero-left h1 { font-size: 34px; } .trust-row { grid-template-columns: repeat(2, 1fr); } .trust-item { border-bottom: 1px solid var(--border); } .sell-banner-inner { grid-template-columns: 1fr; } .products-grid { grid-template-columns: repeat(2, 1fr); } .ab-grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 600px) { .hero { padding: 44px 0; } .hero-left h1 { font-size: 26px; } .hero-right { display: none; } .trust-row { grid-template-columns: 1fr; } .signup-inner { flex-direction: column; align-items: flex-start; } }
</style>
