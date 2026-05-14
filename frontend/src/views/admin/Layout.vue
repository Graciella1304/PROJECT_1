<template>
  <div class="admin-shell">
    <aside :class="['sidebar', { collapsed: sideCollapsed }]">
      <div class="sb-logo">
        <img src="@assets/logo.png" alt="KlikTrade" />
        <div v-if="!sideCollapsed" class="sb-logo-text"><strong>KlikTrade</strong><span>Admin Panel</span></div>
        <button class="collapse-btn" @click="sideCollapsed = !sideCollapsed"><i :class="sideCollapsed ? 'fa fa-chevron-right' : 'fa fa-chevron-left'"></i></button>
      </div>
      <nav class="sb-nav">
        <p v-if="!sideCollapsed" class="nav-label">PRINCIPAL</p>
        <RouterLink to="/admin/dashboard" class="sb-link" :class="{ active: $route.path === '/admin/dashboard' }"><i class="fa fa-chart-line"></i><span v-if="!sideCollapsed">Tableau de bord</span></RouterLink>
        <RouterLink to="/admin/products" class="sb-link" :class="{ active: $route.path.includes('/admin/products') }"><i class="fa fa-box"></i><span v-if="!sideCollapsed">Produits</span></RouterLink>
        <RouterLink to="/admin/orders" class="sb-link" :class="{ active: $route.path.includes('/admin/orders') }"><i class="fa fa-shopping-bag"></i><span v-if="!sideCollapsed">Commandes</span><span v-if="!sideCollapsed" class="nav-count">15</span></RouterLink>
        <RouterLink to="/admin/categories" class="sb-link" :class="{ active: $route.path.includes('/admin/categories') }"><i class="fa fa-tags"></i><span v-if="!sideCollapsed">Catégories</span></RouterLink>
        <RouterLink to="/admin/users" class="sb-link" :class="{ active: $route.path.includes('/admin/users') }"><i class="fa fa-users"></i><span v-if="!sideCollapsed">Utilisateurs</span></RouterLink>
        <p v-if="!sideCollapsed" class="nav-label" style="margin-top:16px">LIENS</p>
        <RouterLink to="/" class="sb-link"><i class="fa fa-store"></i><span v-if="!sideCollapsed">Voir le site</span></RouterLink>
        <button class="sb-link logout" @click="doLogout"><i class="fa fa-sign-out-alt"></i><span v-if="!sideCollapsed">Déconnexion</span></button>
      </nav>
    </aside>
    <div class="main-area">
      <header class="admin-header">
        <div class="ah-left">
          <button class="hamburger" @click="sideCollapsed = !sideCollapsed"><i class="fa fa-bars"></i></button>
          <h2>{{ pageTitle }}</h2>
        </div>
        <div class="ah-right">
          <span class="ah-date"><i class="fa fa-calendar-alt"></i> {{ today }}</span>
          <div class="ah-user">
            <div class="ah-avatar">{{ auth.user?.name?.[0]?.toUpperCase() }}</div>
            <div class="ah-info"><strong>{{ auth.user?.name }}</strong><small>Administrateur</small></div>
          </div>
        </div>
      </header>
      <div class="page-content"><RouterView /></div>
    </div>
  </div>
</template>
<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth'
const auth = useAuthStore(); const router = useRouter(); const route = useRoute()
const sideCollapsed = ref(window.innerWidth < 768)
const today = new Date().toLocaleDateString('fr-RW', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
const titles = { '/admin/dashboard': 'Tableau de bord', '/admin/products': 'Produits', '/admin/orders': 'Commandes', '/admin/categories': 'Catégories', '/admin/users': 'Utilisateurs' }
const pageTitle = computed(() => titles[route.path] || 'Admin')
function doLogout() { auth.logout(); router.push('/admin') }
</script>
<style scoped>
.admin-shell { display: flex; min-height: 100vh; background: #F0F2F5; }
.sidebar { width: 240px; background: #1A1A2E; display: flex; flex-direction: column; transition: width 0.25s; flex-shrink: 0; position: sticky; top: 0; height: 100vh; overflow-y: auto; overflow-x: hidden; }
.sidebar.collapsed { width: 64px; }
.sb-logo { display: flex; align-items: center; gap: 10px; padding: 18px 16px 16px; border-bottom: 1px solid rgba(255,255,255,0.07); min-height: 64px; }
.sb-logo img { width: 32px; flex-shrink: 0; }
.sb-logo-text { overflow: hidden; }
.sb-logo-text strong { display: block; font-size: 14px; font-weight: 900; color: #fff; white-space: nowrap; }
.sb-logo-text span { font-size: 10px; color: rgba(255,255,255,0.35); white-space: nowrap; }
.collapse-btn { margin-left: auto; background: rgba(255,255,255,0.06); border: none; color: rgba(255,255,255,0.45); width: 24px; height: 24px; border-radius: 6px; display: flex; align-items: center; justify-content: center; font-size: 10px; cursor: pointer; flex-shrink: 0; transition: all 0.15s; }
.collapse-btn:hover { background: rgba(255,255,255,0.14); color: #fff; }
.sb-nav { padding: 12px 10px; display: flex; flex-direction: column; gap: 2px; flex: 1; }
.nav-label { font-size: 10px; font-weight: 700; color: rgba(255,255,255,0.25); letter-spacing: 1px; padding: 6px 8px 4px; white-space: nowrap; }
.sb-link { display: flex; align-items: center; gap: 10px; padding: 10px 12px; border-radius: 8px; color: rgba(255,255,255,0.52); font-size: 13px; font-weight: 500; transition: all 0.18s; background: none; border: none; cursor: pointer; text-align: left; width: 100%; white-space: nowrap; }
.sb-link i { font-size: 15px; width: 18px; text-align: center; flex-shrink: 0; }
.sb-link span:not(.nav-count) { overflow: hidden; }
.sb-link:hover { background: rgba(255,255,255,0.08); color: rgba(255,255,255,0.88); }
.sb-link.active { background: var(--primary); color: #fff; font-weight: 700; }
.sb-link.logout { color: rgba(255,100,100,0.65); margin-top: auto; }
.sb-link.logout:hover { background: rgba(220,38,38,0.12); color: #FCA5A5; }
.nav-count { margin-left: auto; background: var(--primary); color: #fff; font-size: 10px; font-weight: 800; padding: 2px 6px; border-radius: 99px; }
.main-area { flex: 1; display: flex; flex-direction: column; min-width: 0; overflow: hidden; }
.admin-header { background: #fff; border-bottom: 1px solid #E2E8F0; padding: 0 24px; height: 64px; display: flex; align-items: center; justify-content: space-between; gap: 16px; position: sticky; top: 0; z-index: 50; }
.ah-left { display: flex; align-items: center; gap: 12px; min-width: 0; }
.hamburger { background: none; border: none; font-size: 18px; color: var(--text-muted); cursor: pointer; padding: 6px; flex-shrink: 0; }
.ah-left h2 { font-size: 17px; font-weight: 700; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.ah-right { display: flex; align-items: center; gap: 14px; flex-shrink: 0; }
.ah-date { font-size: 12px; color: var(--text-muted); display: flex; align-items: center; gap: 6px; white-space: nowrap; }
.ah-user { display: flex; align-items: center; gap: 9px; }
.ah-avatar { width: 36px; height: 36px; background: var(--primary); color: #fff; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 15px; flex-shrink: 0; }
.ah-info strong { display: block; font-size: 13px; font-weight: 700; }
.ah-info small { font-size: 11px; color: var(--text-muted); }
.page-content { padding: 24px; flex: 1; }
@media (max-width: 700px) { .ah-date, .ah-info { display: none; } }
</style>
