<template>
  <div>
    <Navbar />

    <!-- Hero -->
    <section class="hero">
      <div class="container hero-wrap">
        <div class="hero-left">
          <div class="hero-badge"><i class="fa fa-bolt"></i> N°1 au Rwanda</div>
          <h1>Achetez, Vendez &amp;<br /><span>Échangez au Rwanda</span></h1>
          <p>Des milliers d'annonces de particuliers et de vendeurs professionnels. Électronique, mode, véhicules, agriculture et plus — tout en Francs Rwandais.</p>
          <div class="hero-btns">
            <RouterLink to="/listing" class="btn btn-primary btn-xl"><i class="fa fa-search"></i> Parcourir les annonces</RouterLink>
            <RouterLink to="/sell" class="btn-hero-outline"><i class="fa fa-plus-circle"></i> Publier une annonce</RouterLink>
          </div>
          <div class="hero-stats">
            <div class="stat"><strong>12K+</strong><span>Annonces</span></div>
            <div class="stat-sep"></div>
            <div class="stat"><strong>8K+</strong><span>Vendeurs</span></div>
            <div class="stat-sep"></div>
            <div class="stat"><strong>50K+</strong><span>Acheteurs</span></div>
          </div>
        </div>
        <div class="hero-right">
          <div class="hero-cards-wrap">
            <div class="hero-main-card">
              <img src="https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400" alt="Product" />
              <div class="hero-card-label">
                <span>Samsung Galaxy A54</span>
                <strong>450,000 RWF</strong>
              </div>
            </div>
            <div class="hero-side-card top">
              <img src="https://images.unsplash.com/photo-1590735213920-68192a487bc2?w=200" alt="Fashion" />
            </div>
            <div class="hero-side-card bottom">
              <img src="https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=200" alt="Agriculture" />
            </div>
          </div>
          <div class="float-card fc1"><i class="fa fa-shield-alt"></i><span>Transactions sécurisées</span></div>
          <div class="float-card fc2"><i class="fa fa-star"></i><span>4.8 / 5 avis</span></div>
        </div>
      </div>
    </section>

    <!-- Trust strip -->
    <div class="trust-strip">
      <div class="container trust-row">
        <div class="trust-item"><i class="fa fa-map-marker-alt"></i><div><strong>Partout au Rwanda</strong><span>Kigali, Huye, Musanze...</span></div></div>
        <div class="trust-item"><i class="fa fa-mobile-alt"></i><div><strong>MTN MoMo &amp; Airtel</strong><span>Paiement mobile sécurisé</span></div></div>
        <div class="trust-item"><i class="fa fa-shield-alt"></i><div><strong>Vendeurs vérifiés</strong><span>Profils authentifiés</span></div></div>
        <div class="trust-item"><i class="fa fa-headset"></i><div><strong>Support 7j/7</strong><span>Assistance rapide</span></div></div>
      </div>
    </div>

    <!-- Categories -->
    <section class="section">
      <div class="container">
        <div class="section-head">
          <div><h2>Parcourir par catégorie</h2><p>Trouvez exactement ce que vous cherchez</p></div>
          <RouterLink to="/listing" class="btn btn-secondary btn-sm">Tout voir <i class="fa fa-arrow-right"></i></RouterLink>
        </div>
        <div class="cats-grid">
          <RouterLink v-for="c in categories" :key="c._id" :to="`/listing?category=${c.slug}`" class="cat-tile">
            <div class="cat-img"><img :src="c.image" :alt="c.name" @error="e => e.target.src='https://placehold.co/160x120'" /></div>
            <div class="cat-label"><strong>{{ c.name }}</strong><span>{{ c.productCount }} annonces</span></div>
          </RouterLink>
        </div>
      </div>
    </section>

    <!-- Featured -->
    <section class="section" style="background:var(--surface); padding-top:48px; padding-bottom:48px;">
      <div class="container">
        <div class="section-head">
          <div><h2>Annonces à la une <span class="head-badge">⭐ En vedette</span></h2><p>Sélectionnés pour vous</p></div>
          <RouterLink to="/listing?featured=true" class="btn btn-secondary btn-sm">Voir tout <i class="fa fa-arrow-right"></i></RouterLink>
        </div>
        <div v-if="featured.length" class="products-grid">
          <ProductCard v-for="p in featured" :key="p._id" :product="p" />
        </div>
        <div v-else class="page-loader"><div class="spinner"></div></div>
      </div>
    </section>

    <!-- Sell Banner -->
    <section class="sell-banner">
      <div class="container sell-banner-inner">
        <div class="sb-left">
          <p class="sb-badge"><i class="fa fa-store"></i> Pour les vendeurs</p>
          <h2>Commencez à vendre aujourd'hui</h2>
          <p>Publiez votre première annonce gratuitement et rejoignez des milliers de vendeurs actifs sur KlikTrade Rwanda.</p>
          <RouterLink to="/become-seller" class="btn btn-primary btn-lg"><i class="fa fa-rocket"></i> Devenir vendeur</RouterLink>
        </div>
        <div class="sb-right">
          <div class="sb-card"><i class="fa fa-camera"></i><div><strong>Ajoutez vos photos</strong><p>Photos claires = plus de ventes</p></div></div>
          <div class="sb-card"><i class="fa fa-tag"></i><div><strong>Fixez votre prix en RWF</strong><p>Contrôlez vos tarifs</p></div></div>
          <div class="sb-card"><i class="fa fa-comments"></i><div><strong>Connectez avec les acheteurs</strong><p>Chat direct et sécurisé</p></div></div>
        </div>
      </div>
    </section>

    <!-- New listings -->
    <section class="section">
      <div class="container">
        <div class="section-head">
          <div><h2>Dernières annonces</h2><p>Fraîchement publiées</p></div>
          <RouterLink to="/listing" class="btn btn-secondary btn-sm">Voir tout <i class="fa fa-arrow-right"></i></RouterLink>
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
          <h2>Rejoignez KlikTrade Rwanda</h2>
          <p>Créez un compte gratuit pour sauvegarder vos favoris, suivre vos commandes et publier vos annonces.</p>
        </div>
        <div class="cta-btns">
          <RouterLink to="/signin?tab=register" class="btn btn-primary btn-lg"><i class="fa fa-user-plus"></i> Créer un compte</RouterLink>
          <RouterLink to="/signin" class="btn-cta-outline"><i class="fa fa-sign-in-alt"></i> Se connecter</RouterLink>
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

.section-head { display: flex; align-items: flex-end; justify-content: space-between; margin-bottom: 24px; flex-wrap: wrap; gap: 12px; }
.section-head h2 { font-size: 22px; font-weight: 800; margin-bottom: 4px; letter-spacing: -0.3px; }
.section-head p { color: var(--text-muted); font-size: 13px; }
.head-badge { background: #FEF3C7; color: var(--warning); font-size: 12px; padding: 2px 8px; border-radius: 99px; font-weight: 600; vertical-align: middle; margin-left: 6px; }

.cats-grid { display: grid; grid-template-columns: repeat(8, 1fr); gap: 12px; }
.cat-tile { border-radius: var(--radius); overflow: hidden; border: 1px solid var(--border); background: var(--surface); transition: all 0.2s; }
.cat-tile:hover { transform: translateY(-3px); box-shadow: var(--shadow-md); border-color: var(--primary); }
.cat-img { aspect-ratio: 4/3; overflow: hidden; background: var(--surface-2); }
.cat-img img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.35s; }
.cat-tile:hover .cat-img img { transform: scale(1.08); }
.cat-label { padding: 10px; text-align: center; }
.cat-label strong { display: block; font-size: 12px; font-weight: 700; }
.cat-label span { font-size: 10px; color: var(--text-muted); }

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

@media (max-width: 1100px) { .cats-grid { grid-template-columns: repeat(4, 1fr); } .products-grid { grid-template-columns: repeat(3, 1fr); } }
@media (max-width: 900px) { .hero-wrap { grid-template-columns: 1fr; } .hero-right { display: none; } .hero-left h1 { font-size: 34px; } .trust-row { grid-template-columns: repeat(2, 1fr); } .trust-item { border-bottom: 1px solid var(--border); } .sell-banner-inner { grid-template-columns: 1fr; } .products-grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 600px) { .hero { padding: 44px 0; } .hero-left h1 { font-size: 26px; } .cats-grid { grid-template-columns: repeat(2, 1fr); } .trust-row { grid-template-columns: 1fr; } .signup-inner { flex-direction: column; align-items: flex-start; } }
</style>
