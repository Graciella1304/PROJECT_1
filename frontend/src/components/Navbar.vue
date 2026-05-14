<template>
  <header class="navbar">
    <!-- Topbar -->
    <div class="topbar">
      <div class="container topbar-inner">
        <span><i class="fa fa-map-marker-alt"></i> Rwanda's #1 Marketplace</span>
        <div class="topbar-right">
          <span><i class="fa fa-phone"></i> +250 788 000 000</span>
          <span class="divider">|</span>
          <RouterLink to="/become-seller" class="seller-link"><i class="fa fa-store"></i> Sell on KlikTrade</RouterLink>
        </div>
      </div>
    </div>

    <!-- Main -->
    <div class="navbar-main">
      <div class="container nav-inner">
        <!-- Logo -->
        <RouterLink to="/" class="brand">
          <img src="@assets/logo.png" alt="KlikTrade" />
          <div class="brand-text">
            <span class="brand-name">KlikTrade</span>
            <span class="brand-tag">Rwanda</span>
          </div>
        </RouterLink>

        <!-- Search -->
        <div class="search-box">
          <select v-model="searchCat">
            <option value="">Toutes catégories</option>
            <option v-for="c in categories" :key="c._id" :value="c.slug">{{ c.name }}</option>
          </select>
          <input v-model="query" placeholder="Rechercher des produits..." @keyup.enter="search" />
          <button @click="search"><i class="fa fa-search"></i></button>
        </div>

        <!-- Nav Icons -->
        <div class="nav-icons">
          <!-- Wishlist -->
          <RouterLink to="/wishlist" class="nav-btn">
            <i class="fa fa-heart"></i>
            <span>Favoris</span>
            <span v-if="wishCount" class="icon-count">{{ wishCount }}</span>
          </RouterLink>

          <!-- Cart -->
          <RouterLink to="/cart" class="nav-btn">
            <i class="fa fa-shopping-cart"></i>
            <span>Panier</span>
            <span v-if="cartCount" class="icon-count">{{ cartCount }}</span>
          </RouterLink>

          <!-- User Menu -->
          <div v-if="userStore.isLoggedIn" class="user-menu-wrap">
            <button class="nav-btn user-trigger" @click="menuOpen = !menuOpen">
              <div class="user-avatar-sm">{{ userStore.user?.name?.[0]?.toUpperCase() }}</div>
              <span>{{ userStore.user?.name?.split(' ')[0] }}</span>
              <i class="fa fa-chevron-down" style="font-size:10px"></i>
            </button>
            <div v-if="menuOpen" class="user-dropdown">
              <div class="dropdown-header">
                <div class="dh-avatar">{{ userStore.user?.name?.[0]?.toUpperCase() }}</div>
                <div>
                  <strong>{{ userStore.user?.name }}</strong>
                  <small>{{ userStore.user?.email }}</small>
                </div>
              </div>
              <RouterLink to="/sell" @click="menuOpen=false" class="dd-link"><i class="fa fa-plus-circle"></i> Publier une annonce</RouterLink>
              <RouterLink to="/wishlist" @click="menuOpen=false" class="dd-link"><i class="fa fa-heart"></i> Mes favoris</RouterLink>
              <RouterLink to="/notifications" @click="menuOpen=false" class="dd-link"><i class="fa fa-bell"></i> Notifications</RouterLink>
              <RouterLink to="/settings" @click="menuOpen=false" class="dd-link"><i class="fa fa-cog"></i> Paramètres</RouterLink>
              <button class="dd-link logout" @click="logout"><i class="fa fa-sign-out-alt"></i> Déconnexion</button>
            </div>
          </div>

          <!-- Sign In (prominent, always visible when not logged in) -->
          <RouterLink v-else to="/signin" class="btn-signin">
            <i class="fa fa-user-circle"></i>
            Connexion
          </RouterLink>

          <button class="hamburger" @click="mobileMenu = !mobileMenu">
            <i :class="mobileMenu ? 'fa fa-times' : 'fa fa-bars'"></i>
          </button>
        </div>
      </div>
    </div>

    <!-- Categories Nav -->
    <nav class="cat-nav">
      <div class="container cat-nav-inner">
        <RouterLink to="/listing" class="cat-link" :class="{ active: $route.path==='/listing' && !$route.query.category }">
          <i class="fa fa-th-large"></i> Tout voir
        </RouterLink>
        <RouterLink v-for="c in categories" :key="c._id" :to="`/listing?category=${c.slug}`" class="cat-link" :class="{ active: $route.query.category === c.slug }">
          {{ c.name }}
        </RouterLink>
        <RouterLink to="/sell" class="cat-link sell-link">
          <i class="fa fa-plus"></i> Vendre
        </RouterLink>
      </div>
    </nav>

    <!-- Mobile Menu -->
    <div v-if="mobileMenu" class="mobile-menu">
      <div class="mob-search">
        <input v-model="query" placeholder="Rechercher..." @keyup.enter="search(); mobileMenu=false" />
        <button @click="search(); mobileMenu=false"><i class="fa fa-search"></i></button>
      </div>
      <RouterLink to="/" @click="mobileMenu=false" class="mob-link"><i class="fa fa-home"></i> Accueil</RouterLink>
      <RouterLink to="/listing" @click="mobileMenu=false" class="mob-link"><i class="fa fa-th-large"></i> Annonces</RouterLink>
      <RouterLink to="/sell" @click="mobileMenu=false" class="mob-link"><i class="fa fa-plus-circle"></i> Publier annonce</RouterLink>
      <RouterLink to="/wishlist" @click="mobileMenu=false" class="mob-link"><i class="fa fa-heart"></i> Favoris</RouterLink>
      <RouterLink to="/cart" @click="mobileMenu=false" class="mob-link"><i class="fa fa-shopping-cart"></i> Panier ({{ cartCount }})</RouterLink>
      <RouterLink v-if="!userStore.isLoggedIn" to="/signin" @click="mobileMenu=false" class="mob-link sign-in"><i class="fa fa-sign-in-alt"></i> Connexion / Inscription</RouterLink>
      <button v-else class="mob-link" @click="logout"><i class="fa fa-sign-out-alt"></i> Déconnexion</button>
    </div>
  </header>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '../stores/cart'
import { useUserStore } from '../stores/user'
import axios from 'axios'

const router = useRouter()
const cart = useCartStore()
const userStore = useUserStore()

const query = ref('')
const searchCat = ref('')
const categories = ref([])
const menuOpen = ref(false)
const mobileMenu = ref(false)

const cartCount = computed(() => cart.count)
const wishCount = computed(() => userStore.wishlistIds.length)

function search() {
  const q = { search: query.value.trim() }
  if (searchCat.value) q.category = searchCat.value
  router.push({ path: '/listing', query: q })
  query.value = ''
}

function logout() {
  userStore.logout(); menuOpen.value = false; mobileMenu.value = false
  router.push('/signin')
}

function handleOutside(e) {
  if (!e.target.closest('.user-menu-wrap')) menuOpen.value = false
}

onMounted(async () => {
  const { data } = await axios.get('/api/categories')
  categories.value = data
  document.addEventListener('click', handleOutside)
})
onUnmounted(() => document.removeEventListener('click', handleOutside))
</script>

<style scoped>
.navbar { position: sticky; top: 0; z-index: 1000; background: #fff; box-shadow: 0 2px 8px rgba(0,0,0,0.08); }

.topbar { background: var(--secondary); color: rgba(255,255,255,0.7); font-size: 12px; }
.topbar-inner { display: flex; align-items: center; height: 32px; gap: 0; }
.topbar-inner i { margin-right: 4px; color: var(--primary-light); }
.topbar-right { margin-left: auto; display: flex; align-items: center; gap: 12px; }
.divider { opacity: 0.3; }
.seller-link { color: var(--accent) !important; font-weight: 600; display: flex; align-items: center; gap: 5px; }
.seller-link:hover { color: #fff !important; }
@media (max-width: 600px) { .topbar { display: none; } }

.navbar-main { border-bottom: 1px solid var(--border); }
.nav-inner { display: flex; align-items: center; gap: 16px; height: 68px; }

.brand { display: flex; align-items: center; gap: 10px; flex-shrink: 0; }
.brand img { width: 38px; height: 38px; object-fit: contain; }
.brand-text { display: flex; flex-direction: column; line-height: 1.1; }
.brand-name { font-size: 17px; font-weight: 900; color: var(--primary); letter-spacing: -0.3px; }
.brand-tag { font-size: 10px; font-weight: 700; color: var(--text-muted); text-transform: uppercase; letter-spacing: 1px; }

.search-box { flex: 1; display: flex; border: 2px solid var(--border); border-radius: var(--radius-sm); overflow: hidden; max-width: 520px; transition: border-color 0.18s; }
.search-box:focus-within { border-color: var(--primary); }
.search-box select { width: 130px; border: none; border-right: 1.5px solid var(--border); background: var(--bg); font-size: 12px; padding: 0 8px; flex-shrink: 0; border-radius: 0; }
.search-box input { flex: 1; border: none; padding: 9px 14px; font-size: 14px; background: transparent; min-width: 0; }
.search-box input:focus { box-shadow: none; }
.search-box button { background: var(--primary); color: #fff; border: none; padding: 0 16px; font-size: 15px; flex-shrink: 0; cursor: pointer; }
.search-box button:hover { background: var(--primary-dark); }

.nav-icons { display: flex; align-items: center; gap: 4px; flex-shrink: 0; }
.nav-btn { display: flex; flex-direction: column; align-items: center; gap: 2px; padding: 6px 10px; border-radius: var(--radius-sm); color: var(--text-muted); position: relative; font-size: 20px; background: none; border: none; cursor: pointer; transition: all 0.18s; }
.nav-btn span { font-size: 10px; font-weight: 600; color: var(--text-muted); }
.nav-btn:hover { color: var(--primary); background: var(--primary-bg); }
.icon-count { position: absolute; top: 2px; right: 4px; background: var(--primary); color: #fff; font-size: 9px; font-weight: 800; min-width: 16px; height: 16px; border-radius: 999px; display: flex; align-items: center; justify-content: center; padding: 0 3px; }

.btn-signin { display: flex; align-items: center; gap: 7px; background: var(--primary); color: #fff; padding: 9px 18px; border-radius: var(--radius-sm); font-size: 13px; font-weight: 700; transition: all 0.18s; white-space: nowrap; }
.btn-signin:hover { background: var(--primary-dark); transform: translateY(-1px); box-shadow: 0 4px 12px rgba(232,93,4,0.3); }
.btn-signin i { font-size: 15px; }

.user-menu-wrap { position: relative; }
.user-trigger { flex-direction: row; gap: 7px; font-size: 15px; }
.user-trigger span { font-size: 13px; font-weight: 600; color: var(--text); }
.user-avatar-sm { width: 30px; height: 30px; background: var(--primary); color: #fff; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 13px; flex-shrink: 0; }
.user-dropdown { position: absolute; top: calc(100% + 8px); right: 0; background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); box-shadow: var(--shadow-lg); min-width: 220px; z-index: 100; overflow: hidden; }
.dropdown-header { display: flex; align-items: center; gap: 10px; padding: 14px 16px; border-bottom: 1px solid var(--border); background: var(--bg); }
.dh-avatar { width: 36px; height: 36px; background: var(--primary); color: #fff; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 16px; flex-shrink: 0; }
.dropdown-header strong { display: block; font-size: 13px; font-weight: 700; }
.dropdown-header small { font-size: 11px; color: var(--text-muted); }
.dd-link { display: flex; align-items: center; gap: 10px; padding: 11px 16px; font-size: 13px; font-weight: 500; color: var(--text); transition: background 0.15s; width: 100%; background: none; border: none; cursor: pointer; text-align: left; }
.dd-link:hover { background: var(--bg); color: var(--primary); }
.dd-link i { width: 16px; text-align: center; color: var(--text-muted); }
.dd-link.logout { color: var(--danger); border-top: 1px solid var(--border); }

.hamburger { display: none; background: none; border: none; font-size: 22px; color: var(--text); padding: 8px; }

.cat-nav { background: var(--surface); border-bottom: 1px solid var(--border); }
.cat-nav-inner { display: flex; gap: 0; height: 40px; align-items: center; overflow-x: auto; scrollbar-width: none; }
.cat-nav-inner::-webkit-scrollbar { display: none; }
.cat-link { padding: 5px 14px; border-radius: 0; font-size: 13px; font-weight: 500; color: var(--text-muted); white-space: nowrap; border-bottom: 2px solid transparent; height: 100%; display: flex; align-items: center; transition: all 0.18s; }
.cat-link:hover, .cat-link.active { color: var(--primary); border-bottom-color: var(--primary); }
.cat-link.sell-link { margin-left: auto; color: var(--primary); font-weight: 700; flex-shrink: 0; }
.cat-link.sell-link:hover { background: var(--primary-bg); }

.mobile-menu { background: var(--surface); border-top: 1px solid var(--border); padding: 12px; display: flex; flex-direction: column; gap: 2px; }
.mob-search { display: flex; gap: 8px; margin-bottom: 10px; }
.mob-search button { background: var(--primary); color: #fff; border: none; padding: 10px 14px; border-radius: var(--radius-sm); }
.mob-link { display: flex; align-items: center; gap: 10px; padding: 12px 12px; border-radius: var(--radius-sm); font-size: 14px; color: var(--text); transition: background 0.15s; background: none; border: none; cursor: pointer; text-align: left; width: 100%; }
.mob-link:hover { background: var(--bg); color: var(--primary); }
.mob-link.sign-in { color: var(--primary); font-weight: 700; background: var(--primary-bg); }

@media (max-width: 900px) { .search-box { max-width: 240px; } .search-box select { display: none; } .hamburger { display: flex; } }
@media (max-width: 600px) { .search-box { display: none; } .cat-nav { display: none; } .brand-text { display: none; } }
</style>
