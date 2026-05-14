<template>
  <header class="navbar">
    <!-- Topbar -->
    <div class="topbar">
      <div class="container topbar-inner">
        <span><i class="fa fa-map-marker-alt"></i> {{ t.footer.tagline }}</span>
        <div class="topbar-right">
          <span><i class="fa fa-phone"></i> +250 788 000 000</span>
          <span class="divider">|</span>
          <RouterLink to="/become-seller" class="seller-link"><i class="fa fa-store"></i> {{ t.nav.sellOnKlikTrade }}</RouterLink>
        </div>
      </div>
    </div>

    <!-- Main -->
    <div class="navbar-main">
      <div class="container nav-inner">
        <RouterLink to="/" class="brand">
          <div class="brand-icon">K</div>
          <div class="brand-text">
            <span class="brand-name">KlikTrade</span>
            <span class="brand-tag">Rwanda</span>
          </div>
        </RouterLink>

        <div class="search-box">
          <select v-model="searchCat">
            <option value="">{{ t.nav.allCategories }}</option>
            <option v-for="c in categories" :key="c._id" :value="c.slug">{{ c.name }}</option>
          </select>
          <input v-model="query" :placeholder="t.product.search + '...'" @keyup.enter="search" />
          <button @click="search"><i class="fa fa-search"></i></button>
        </div>

        <div class="nav-icons">
          <!-- Theme toggle -->
          <button class="nav-btn icon-only" @click="themeStore.toggle()" :title="themeStore.isDark ? t.settings.lightMode : t.settings.darkMode">
            <i :class="themeStore.isDark ? 'fa fa-sun' : 'fa fa-moon'"></i>
          </button>

          <!-- Language -->
          <div class="lang-wrap">
            <button class="nav-btn icon-only lang-btn" @click="langOpen = !langOpen">
              <span class="lang-flag">{{ currentLang?.flag }}</span>
            </button>
            <div v-if="langOpen" class="lang-dropdown">
              <button v-for="l in i18nStore.availableLanguages" :key="l.code"
                :class="['lang-opt', { active: i18nStore.lang === l.code }]"
                @click="i18nStore.setLang(l.code); langOpen = false">
                <span>{{ l.flag }}</span><span>{{ l.name }}</span>
                <i v-if="i18nStore.lang === l.code" class="fa fa-check"></i>
              </button>
            </div>
          </div>

          <!-- Wishlist -->
          <RouterLink to="/wishlist" class="nav-btn">
            <i class="fa fa-heart"></i>
            <span>{{ t.nav.wishlist }}</span>
            <span v-if="wishCount" class="icon-count">{{ wishCount }}</span>
          </RouterLink>

          <!-- Cart -->
          <RouterLink to="/cart" class="nav-btn">
            <i class="fa fa-shopping-cart"></i>
            <span>{{ t.nav.cart }}</span>
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
                  <span class="role-chip" :class="userStore.user?.role">{{ userStore.user?.role }}</span>
                </div>
              </div>
              <RouterLink :to="userStore.user?.role === 'seller' ? '/dashboard/seller' : '/dashboard/buyer'" @click="menuOpen=false" class="dd-link">
                <i class="fa fa-tachometer-alt"></i> {{ t.nav.dashboard }}
              </RouterLink>
              <RouterLink v-if="userStore.user?.role === 'seller'" to="/sell" @click="menuOpen=false" class="dd-link">
                <i class="fa fa-plus-circle"></i> {{ t.nav.postAd }}
              </RouterLink>
              <RouterLink to="/wishlist" @click="menuOpen=false" class="dd-link"><i class="fa fa-heart"></i> {{ t.nav.wishlist }}</RouterLink>
              <RouterLink to="/notifications" @click="menuOpen=false" class="dd-link"><i class="fa fa-bell"></i> {{ t.nav.notifications }}</RouterLink>
              <RouterLink to="/settings" @click="menuOpen=false" class="dd-link"><i class="fa fa-cog"></i> {{ t.nav.settings }}</RouterLink>
              <button class="dd-link logout" @click="logout"><i class="fa fa-sign-out-alt"></i> {{ t.nav.signout }}</button>
            </div>
          </div>

          <RouterLink v-else to="/signin" class="btn-signin">
            <i class="fa fa-user-circle"></i>
            {{ t.nav.signin }}
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
          <i class="fa fa-th-large"></i> {{ t.general.all }}
        </RouterLink>
        <RouterLink v-for="c in categories" :key="c._id" :to="`/listing?category=${c.slug}`" class="cat-link" :class="{ active: $route.query.category === c.slug }">
          <i :class="`fa ${c.icon || 'fa-tag'}`"></i> {{ c.name }}
        </RouterLink>
        <RouterLink to="/sell" class="cat-link sell-link">
          <i class="fa fa-plus"></i> {{ t.nav.sell }}
        </RouterLink>
      </div>
    </nav>

    <!-- Mobile Menu -->
    <div v-if="mobileMenu" class="mobile-menu">
      <div class="mob-search">
        <input v-model="query" :placeholder="t.product.search + '...'" @keyup.enter="search(); mobileMenu=false" />
        <button @click="search(); mobileMenu=false"><i class="fa fa-search"></i></button>
      </div>
      <RouterLink to="/" @click="mobileMenu=false" class="mob-link"><i class="fa fa-home"></i> {{ t.nav.home }}</RouterLink>
      <RouterLink to="/listing" @click="mobileMenu=false" class="mob-link"><i class="fa fa-th-large"></i> {{ t.nav.browse }}</RouterLink>
      <RouterLink to="/sell" @click="mobileMenu=false" class="mob-link"><i class="fa fa-plus-circle"></i> {{ t.nav.postAd }}</RouterLink>
      <RouterLink to="/wishlist" @click="mobileMenu=false" class="mob-link"><i class="fa fa-heart"></i> {{ t.nav.wishlist }}</RouterLink>
      <RouterLink to="/cart" @click="mobileMenu=false" class="mob-link"><i class="fa fa-shopping-cart"></i> {{ t.nav.cart }} ({{ cartCount }})</RouterLink>
      <div class="mob-lang">
        <button v-for="l in i18nStore.availableLanguages" :key="l.code" :class="['mob-lang-btn', { active: i18nStore.lang === l.code }]" @click="i18nStore.setLang(l.code)">{{ l.flag }} {{ l.name }}</button>
      </div>
      <RouterLink v-if="!userStore.isLoggedIn" to="/signin" @click="mobileMenu=false" class="mob-link sign-in"><i class="fa fa-sign-in-alt"></i> {{ t.nav.signin }}</RouterLink>
      <button v-else class="mob-link" @click="logout"><i class="fa fa-sign-out-alt"></i> {{ t.nav.signout }}</button>
    </div>
  </header>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '../stores/cart'
import { useUserStore } from '../stores/user'
import { useThemeStore } from '../stores/theme'
import { useI18nStore } from '../stores/i18n'
import axios from 'axios'

const router = useRouter()
const cart = useCartStore()
const userStore = useUserStore()
const themeStore = useThemeStore()
const i18nStore = useI18nStore()
const { t } = i18nStore

const query = ref('')
const searchCat = ref('')
const categories = ref([])
const menuOpen = ref(false)
const mobileMenu = ref(false)
const langOpen = ref(false)

const cartCount = computed(() => cart.count)
const wishCount = computed(() => userStore.wishlistIds.length)
const currentLang = computed(() => i18nStore.availableLanguages.find(l => l.code === i18nStore.lang))

function search() {
  const q = { search: query.value.trim() }
  if (searchCat.value) q.category = searchCat.value
  router.push({ path: '/listing', query: q })
  query.value = ''
}

function logout() {
  userStore.logout(); menuOpen.value = false; mobileMenu.value = false
  router.push('/')
}

function handleOutside(e) {
  if (!e.target.closest('.user-menu-wrap')) menuOpen.value = false
  if (!e.target.closest('.lang-wrap')) langOpen.value = false
}

onMounted(async () => {
  const { data } = await axios.get('/api/categories')
  categories.value = data
  document.addEventListener('click', handleOutside)
})
onUnmounted(() => document.removeEventListener('click', handleOutside))
</script>

<style scoped>
.navbar { position: sticky; top: 0; z-index: 1000; background: var(--surface); box-shadow: 0 2px 8px rgba(0,0,0,0.08); transition: background 0.3s; }

.topbar { background: var(--secondary); color: rgba(255,255,255,0.7); font-size: 12px; }
.topbar-inner { display: flex; align-items: center; height: 32px; gap: 0; }
.topbar-inner i { margin-right: 4px; color: var(--primary-light); }
.topbar-right { margin-left: auto; display: flex; align-items: center; gap: 12px; }
.divider { opacity: 0.3; }
.seller-link { color: var(--accent) !important; font-weight: 600; display: flex; align-items: center; gap: 5px; }
.seller-link:hover { color: #fff !important; }
@media (max-width: 600px) { .topbar { display: none; } }

.navbar-main { border-bottom: 1px solid var(--border); }
.nav-inner { display: flex; align-items: center; gap: 12px; height: 68px; }

.brand { display: flex; align-items: center; gap: 10px; flex-shrink: 0; }
.brand-icon { width: 38px; height: 38px; background: var(--primary); color: #fff; border-radius: var(--radius-sm); display: flex; align-items: center; justify-content: center; font-size: 20px; font-weight: 900; flex-shrink: 0; }
.brand-text { display: flex; flex-direction: column; line-height: 1.1; }
.brand-name { font-size: 17px; font-weight: 900; color: var(--primary); letter-spacing: -0.3px; }
.brand-tag { font-size: 10px; font-weight: 700; color: var(--text-muted); text-transform: uppercase; letter-spacing: 1px; }

.search-box { flex: 1; display: flex; border: 2px solid var(--border); border-radius: var(--radius-sm); overflow: hidden; max-width: 520px; transition: border-color 0.18s; background: var(--surface); }
.search-box:focus-within { border-color: var(--primary); }
.search-box select { width: 130px; border: none; border-right: 1.5px solid var(--border); background: var(--surface-2); font-size: 12px; padding: 0 8px; flex-shrink: 0; border-radius: 0; color: var(--text); }
.search-box input { flex: 1; border: none; padding: 9px 14px; font-size: 14px; background: transparent; min-width: 0; color: var(--text); }
.search-box input:focus { box-shadow: none; }
.search-box button { background: var(--primary); color: #fff; border: none; padding: 0 16px; font-size: 15px; flex-shrink: 0; cursor: pointer; }
.search-box button:hover { background: var(--primary-dark); }

.nav-icons { display: flex; align-items: center; gap: 4px; flex-shrink: 0; }
.nav-btn { display: flex; flex-direction: column; align-items: center; gap: 2px; padding: 6px 10px; border-radius: var(--radius-sm); color: var(--text-muted); position: relative; font-size: 20px; background: none; border: none; cursor: pointer; transition: all 0.18s; }
.nav-btn.icon-only { padding: 8px; }
.nav-btn span { font-size: 10px; font-weight: 600; color: var(--text-muted); }
.nav-btn:hover { color: var(--primary); background: var(--primary-bg); }
.icon-count { position: absolute; top: 2px; right: 4px; background: var(--primary); color: #fff; font-size: 9px; font-weight: 800; min-width: 16px; height: 16px; border-radius: 999px; display: flex; align-items: center; justify-content: center; padding: 0 3px; }

.lang-wrap { position: relative; }
.lang-btn { font-size: 16px !important; }
.lang-flag { font-size: 18px; line-height: 1; }
.lang-dropdown { position: absolute; top: calc(100% + 8px); right: 0; background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); box-shadow: var(--shadow-lg); min-width: 160px; z-index: 200; overflow: hidden; }
.lang-opt { display: flex; align-items: center; gap: 10px; padding: 10px 14px; font-size: 13px; font-weight: 500; color: var(--text); background: none; border: none; cursor: pointer; width: 100%; transition: background 0.15s; }
.lang-opt:hover { background: var(--surface-2); }
.lang-opt.active { background: var(--primary-bg); color: var(--primary); font-weight: 700; }
.lang-opt i { margin-left: auto; font-size: 11px; }

.btn-signin { display: flex; align-items: center; gap: 7px; background: var(--primary); color: #fff; padding: 9px 18px; border-radius: var(--radius-sm); font-size: 13px; font-weight: 700; transition: all 0.18s; white-space: nowrap; }
.btn-signin:hover { background: var(--primary-dark); transform: translateY(-1px); box-shadow: 0 4px 12px rgba(232,93,4,0.3); }
.btn-signin i { font-size: 15px; }

.user-menu-wrap { position: relative; }
.user-trigger { flex-direction: row !important; gap: 7px; font-size: 15px; }
.user-trigger span { font-size: 13px; font-weight: 600; color: var(--text); }
.user-avatar-sm { width: 30px; height: 30px; background: var(--primary); color: #fff; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 13px; flex-shrink: 0; }
.user-dropdown { position: absolute; top: calc(100% + 8px); right: 0; background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); box-shadow: var(--shadow-lg); min-width: 230px; z-index: 100; overflow: hidden; }
.dropdown-header { display: flex; align-items: center; gap: 10px; padding: 14px 16px; border-bottom: 1px solid var(--border); background: var(--surface-2); }
.dh-avatar { width: 36px; height: 36px; background: var(--primary); color: #fff; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 16px; flex-shrink: 0; }
.dropdown-header strong { display: block; font-size: 13px; font-weight: 700; }
.dropdown-header small { font-size: 11px; color: var(--text-muted); display: block; }
.role-chip { display: inline-block; font-size: 10px; font-weight: 700; text-transform: capitalize; padding: 1px 7px; border-radius: 99px; margin-top: 2px; background: var(--primary-bg); color: var(--primary); }
.role-chip.seller { background: var(--primary-bg); color: var(--primary); }
.role-chip.buyer { background: var(--green-bg); color: var(--green); }
.dd-link { display: flex; align-items: center; gap: 10px; padding: 11px 16px; font-size: 13px; font-weight: 500; color: var(--text); transition: background 0.15s; width: 100%; background: none; border: none; cursor: pointer; text-align: left; }
.dd-link:hover { background: var(--surface-2); color: var(--primary); }
.dd-link i { width: 16px; text-align: center; color: var(--text-muted); }
.dd-link.logout { color: var(--danger); border-top: 1px solid var(--border); }

.hamburger { display: none; background: none; border: none; font-size: 22px; color: var(--text); padding: 8px; }

.cat-nav { background: var(--surface); border-bottom: 1px solid var(--border); }
.cat-nav-inner { display: flex; gap: 0; height: 42px; align-items: center; overflow-x: auto; scrollbar-width: none; }
.cat-nav-inner::-webkit-scrollbar { display: none; }
.cat-link { padding: 5px 12px; border-radius: 0; font-size: 12px; font-weight: 600; color: var(--text-muted); white-space: nowrap; border-bottom: 2px solid transparent; height: 100%; display: flex; align-items: center; gap: 5px; transition: all 0.18s; }
.cat-link i { font-size: 11px; }
.cat-link:hover, .cat-link.active { color: var(--primary); border-bottom-color: var(--primary); }
.cat-link.sell-link { margin-left: auto; color: var(--primary); font-weight: 700; flex-shrink: 0; }
.cat-link.sell-link:hover { background: var(--primary-bg); }

.mobile-menu { background: var(--surface); border-top: 1px solid var(--border); padding: 12px; display: flex; flex-direction: column; gap: 2px; }
.mob-search { display: flex; gap: 8px; margin-bottom: 10px; }
.mob-search button { background: var(--primary); color: #fff; border: none; padding: 10px 14px; border-radius: var(--radius-sm); }
.mob-link { display: flex; align-items: center; gap: 10px; padding: 12px 12px; border-radius: var(--radius-sm); font-size: 14px; color: var(--text); transition: background 0.15s; background: none; border: none; cursor: pointer; text-align: left; width: 100%; }
.mob-link:hover { background: var(--surface-2); color: var(--primary); }
.mob-link.sign-in { color: var(--primary); font-weight: 700; background: var(--primary-bg); }
.mob-lang { display: flex; gap: 6px; padding: 8px 0; flex-wrap: wrap; }
.mob-lang-btn { padding: 6px 12px; border: 1.5px solid var(--border); border-radius: var(--radius-sm); font-size: 12px; background: var(--surface-2); color: var(--text-muted); cursor: pointer; font-weight: 600; transition: all 0.15s; }
.mob-lang-btn.active { border-color: var(--primary); background: var(--primary-bg); color: var(--primary); }

@media (max-width: 900px) { .search-box { max-width: 240px; } .search-box select { display: none; } .hamburger { display: flex; } }
@media (max-width: 600px) { .search-box { display: none; } .cat-nav { display: none; } .brand-text { display: none; } }
</style>
