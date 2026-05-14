<template>
  <div class="dashboard">
    <div class="stats-grid">
      <div class="stat-card"><div class="sc-icon revenue"><i class="fa fa-money-bill-wave"></i></div><div class="sc-body"><p class="sc-label">Revenus totaux</p><h3 class="sc-value">{{ fmt(stats.revenue) }} <span>RWF</span></h3><p class="sc-trend up"><i class="fa fa-arrow-up"></i> +12.5% ce mois</p></div></div>
      <div class="stat-card"><div class="sc-icon orders"><i class="fa fa-shopping-bag"></i></div><div class="sc-body"><p class="sc-label">Commandes</p><h3 class="sc-value">{{ stats.orders }}</h3><p class="sc-trend up"><i class="fa fa-arrow-up"></i> +8.3% ce mois</p></div></div>
      <div class="stat-card"><div class="sc-icon products"><i class="fa fa-box"></i></div><div class="sc-body"><p class="sc-label">Produits actifs</p><h3 class="sc-value">{{ stats.products }}</h3><p class="sc-trend up"><i class="fa fa-arrow-up"></i> +5 cette semaine</p></div></div>
      <div class="stat-card"><div class="sc-icon users"><i class="fa fa-users"></i></div><div class="sc-body"><p class="sc-label">Utilisateurs</p><h3 class="sc-value">{{ stats.users }}</h3><p class="sc-trend up"><i class="fa fa-arrow-up"></i> +24 nouveaux</p></div></div>
    </div>
    <div class="dash-row">
      <div class="card dash-card">
        <div class="dc-head"><h3><i class="fa fa-shopping-bag"></i> Commandes récentes</h3><RouterLink to="/admin/orders" class="btn btn-secondary btn-sm">Tout voir</RouterLink></div>
        <div v-if="loadingOrders" class="page-loader"><div class="spinner"></div></div>
        <table v-else class="dt"><thead><tr><th>Commande</th><th>Client</th><th>Montant</th><th>Paiement</th><th>Statut</th></tr></thead>
          <tbody><tr v-for="o in recentOrders" :key="o._id"><td><strong>#{{ o.orderNumber }}</strong></td><td>{{ o.customerName }}</td><td><strong>{{ fmt(o.total) }} RWF</strong></td><td><span class="pay-m">{{ payLabel(o.paymentMethod) }}</span></td><td><span :class="['status-chip', o.status]">{{ statusLabel(o.status) }}</span></td></tr></tbody>
        </table>
      </div>
      <div class="card dash-card">
        <div class="dc-head"><h3><i class="fa fa-star"></i> Top produits</h3><RouterLink to="/admin/products" class="btn btn-secondary btn-sm">Tout voir</RouterLink></div>
        <div v-if="loadingProds" class="page-loader"><div class="spinner"></div></div>
        <div v-else class="top-prods">
          <div v-for="(p, i) in topProducts" :key="p._id" class="tp-row">
            <span class="tp-rank">{{ i+1 }}</span>
            <img :src="p.image" :alt="p.name" @error="e => e.target.src='https://placehold.co/40x40'" />
            <div class="tp-info"><strong>{{ p.name }}</strong><p>{{ p.categoryName }}</p></div>
            <div class="tp-price"><strong>{{ fmt(p.price) }} RWF</strong><span :class="p.stock > 0 ? 'in' : 'out'">{{ p.stock > 0 ? 'Dispo' : 'Rupture' }}</span></div>
          </div>
        </div>
      </div>
    </div>
    <div class="dash-row-3">
      <div class="card dash-card">
        <div class="dc-head"><h3><i class="fa fa-tags"></i> Ventes par catégorie</h3></div>
        <div class="cat-bars">
          <div v-for="c in catBars" :key="c.name" class="cbar-row"><span class="cbar-name">{{ c.name }}</span><div class="cbar-track"><div class="cbar-fill" :style="{ width: c.pct + '%', background: c.color }"></div></div><span class="cbar-pct">{{ c.pct }}%</span></div>
        </div>
      </div>
      <div class="card dash-card">
        <div class="dc-head"><h3><i class="fa fa-bolt"></i> Actions rapides</h3></div>
        <div class="qa-grid">
          <RouterLink to="/admin/products" class="qa-btn"><i class="fa fa-plus-circle"></i><span>Ajouter produit</span></RouterLink>
          <RouterLink to="/admin/orders" class="qa-btn"><i class="fa fa-shopping-bag"></i><span>Commandes</span></RouterLink>
          <RouterLink to="/admin/categories" class="qa-btn"><i class="fa fa-tags"></i><span>Catégories</span></RouterLink>
          <RouterLink to="/admin/users" class="qa-btn"><i class="fa fa-users"></i><span>Utilisateurs</span></RouterLink>
          <RouterLink to="/" class="qa-btn"><i class="fa fa-store"></i><span>Voir le site</span></RouterLink>
          <button class="qa-btn"><i class="fa fa-download"></i><span>Exporter</span></button>
        </div>
        <div class="activity-section">
          <h4>Activité récente</h4>
          <div class="act-item"><div class="act-dot new-order"></div><p>Nouvelle commande <strong>KT-1015</strong></p><small>2 min</small></div>
          <div class="act-item"><div class="act-dot new-user"></div><p>Nouvel utilisateur inscrit</p><small>15 min</small></div>
          <div class="act-item"><div class="act-dot prod"></div><p>Produit modifié par Alice Uwimana</p><small>1h</small></div>
          <div class="act-item"><div class="act-dot order"></div><p>Commande <strong>KT-1012</strong> livrée</p><small>2h</small></div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useAuthStore } from '../../stores/auth'
const auth = useAuthStore()
const stats = ref({ revenue: 0, orders: 156, products: 12, users: 324 })
const recentOrders = ref([]); const topProducts = ref([])
const loadingOrders = ref(true); const loadingProds = ref(true)
const catBars = [
  { name: 'Électronique', pct: 38, color: '#E85D04' },
  { name: 'Mode & Vêtements', pct: 24, color: '#3B82F6' },
  { name: 'Maison & Cuisine', pct: 16, color: '#10B981' },
  { name: 'Véhicules', pct: 12, color: '#F59E0B' },
  { name: 'Agriculture', pct: 10, color: '#8B5CF6' },
]
function fmt(n) { return Number(n).toLocaleString('fr-RW') }
function payLabel(m) { return { momo:'MTN MoMo', airtel:'Airtel Money', cash:'Espèces', card:'Carte' }[m] || m }
function statusLabel(s) { return { pending:'En attente', processing:'Traitement', shipped:'Expédiée', delivered:'Livrée', cancelled:'Annulée' }[s] || s }
onMounted(async () => {
  const h = { Authorization: `Bearer ${auth.token}` }
  const [ord, prods] = await Promise.all([
    axios.get('/api/orders?limit=8', { headers: h }),
    axios.get('/api/products?limit=5', { headers: h }),
  ])
  recentOrders.value = ord.data.orders || ord.data.slice(0, 8); loadingOrders.value = false
  topProducts.value = (prods.data.products || prods.data).slice(0, 5); loadingProds.value = false
  stats.value.revenue = recentOrders.value.reduce((s, o) => s + (o.total || 0), 0) * 8
  stats.value.products = (prods.data.products || prods.data).length
})
</script>
<style scoped>
.dashboard { display: flex; flex-direction: column; gap: 20px; }
.stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
.stat-card { background: #fff; border-radius: var(--radius); border: 1px solid var(--border); padding: 20px; display: flex; align-items: center; gap: 16px; }
.sc-icon { width: 52px; height: 52px; border-radius: var(--radius-sm); display: flex; align-items: center; justify-content: center; font-size: 22px; flex-shrink: 0; }
.sc-icon.revenue { background: #FFF4EE; color: var(--primary); }
.sc-icon.orders { background: #DBEAFE; color: var(--info); }
.sc-icon.products { background: var(--green-bg); color: var(--green); }
.sc-icon.users { background: #F3E8FF; color: #7C3AED; }
.sc-label { font-size: 12px; color: var(--text-muted); font-weight: 600; margin-bottom: 4px; }
.sc-value { font-size: 26px; font-weight: 900; letter-spacing: -0.5px; margin-bottom: 4px; display: flex; align-items: baseline; gap: 4px; }
.sc-value span { font-size: 13px; font-weight: 600; color: var(--text-muted); }
.sc-trend { font-size: 12px; font-weight: 600; display: flex; align-items: center; gap: 4px; }
.sc-trend.up { color: var(--green); }
.dash-row { display: grid; grid-template-columns: 1.5fr 1fr; gap: 16px; }
.dash-card { padding: 20px; }
.dc-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 18px; }
.dc-head h3 { font-size: 15px; font-weight: 700; display: flex; align-items: center; gap: 8px; }
.dc-head h3 i { color: var(--primary); font-size: 14px; }
.dt { width: 100%; border-collapse: collapse; font-size: 13px; }
.dt th { text-align: left; padding: 8px 10px; font-size: 11px; font-weight: 700; color: var(--text-muted); text-transform: uppercase; border-bottom: 1px solid var(--border); background: var(--bg); }
.dt td { padding: 10px; border-bottom: 1px solid var(--border-light); }
.dt tr:last-child td { border-bottom: none; }
.pay-m { font-size: 11px; font-weight: 700; background: var(--surface-2); color: var(--text-muted); padding: 2px 8px; border-radius: 99px; }
.status-chip { display: inline-block; padding: 3px 9px; border-radius: 99px; font-size: 11px; font-weight: 700; }
.status-chip.pending { background: #FEF3C7; color: var(--warning); }
.status-chip.processing { background: #DBEAFE; color: var(--info); }
.status-chip.shipped { background: #F3E8FF; color: #7C3AED; }
.status-chip.delivered { background: var(--green-bg); color: var(--green); }
.status-chip.cancelled { background: #FEF2F2; color: var(--danger); }
.top-prods { display: flex; flex-direction: column; gap: 4px; }
.tp-row { display: flex; align-items: center; gap: 10px; padding: 8px 6px; border-radius: var(--radius-sm); transition: background 0.15s; }
.tp-row:hover { background: var(--bg); }
.tp-rank { width: 20px; text-align: center; font-size: 12px; font-weight: 800; color: var(--text-muted); }
.tp-row img { width: 40px; height: 40px; border-radius: var(--radius-sm); object-fit: cover; flex-shrink: 0; }
.tp-info { flex: 1; min-width: 0; }
.tp-info strong { display: block; font-size: 13px; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.tp-info p { font-size: 11px; color: var(--text-muted); }
.tp-price { text-align: right; flex-shrink: 0; }
.tp-price strong { display: block; font-size: 13px; font-weight: 700; color: var(--primary); }
.tp-price span.in { color: var(--green); font-size: 11px; font-weight: 700; }
.tp-price span.out { color: var(--danger); font-size: 11px; font-weight: 700; }
.dash-row-3 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.cat-bars { display: flex; flex-direction: column; gap: 14px; }
.cbar-row { display: flex; align-items: center; gap: 10px; }
.cbar-name { font-size: 12px; font-weight: 600; color: var(--text-muted); width: 130px; flex-shrink: 0; }
.cbar-track { flex: 1; height: 8px; background: var(--surface-2); border-radius: 99px; overflow: hidden; }
.cbar-fill { height: 100%; border-radius: 99px; }
.cbar-pct { font-size: 12px; font-weight: 700; width: 32px; text-align: right; color: var(--text-muted); }
.qa-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; margin-bottom: 18px; }
.qa-btn { display: flex; flex-direction: column; align-items: center; gap: 6px; padding: 14px 8px; border-radius: var(--radius-sm); background: var(--bg); border: 1.5px solid var(--border); color: var(--text-muted); font-size: 11px; font-weight: 600; cursor: pointer; text-align: center; transition: all 0.18s; }
.qa-btn i { font-size: 18px; color: var(--primary); }
.qa-btn:hover { background: var(--primary-bg); border-color: var(--primary); color: var(--primary); }
.activity-section h4 { font-size: 11px; font-weight: 700; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 10px; }
.act-item { display: flex; align-items: flex-start; gap: 10px; margin-bottom: 8px; }
.act-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; margin-top: 5px; }
.act-dot.new-order { background: var(--primary); }
.act-dot.new-user { background: var(--green); }
.act-dot.prod { background: var(--info); }
.act-dot.order { background: var(--green); }
.act-item p { font-size: 12px; flex: 1; }
.act-item small { font-size: 10px; color: var(--text-muted); flex-shrink: 0; }
@media (max-width: 1100px) { .stats-grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 900px) { .dash-row, .dash-row-3 { grid-template-columns: 1fr; } }
</style>
