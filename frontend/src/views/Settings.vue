<template>
  <div><Navbar />
  <div class="container settings-page">
    <h1><i class="fa fa-cog"></i> Paramètres</h1>
    <div v-if="!userStore.isLoggedIn" class="not-logged"><i class="fa fa-lock"></i><h2>Connectez-vous d'abord</h2><RouterLink to="/signin" class="btn btn-primary">Se connecter</RouterLink></div>
    <div v-else class="settings-grid">
      <aside class="settings-nav card">
        <button v-for="s in sections" :key="s.id" :class="['sn-btn', { active: active === s.id }]" @click="active = s.id"><i :class="s.icon"></i> {{ s.label }}</button>
      </aside>
      <div class="settings-body">
        <div v-if="active === 'profile'" class="card settings-card">
          <h2>Profil personnel</h2>
          <div class="avatar-row">
            <div class="big-avatar">{{ userStore.user?.name?.[0]?.toUpperCase() }}</div>
            <div><strong>{{ userStore.user?.name }}</strong><p>{{ userStore.user?.email }}</p></div>
          </div>
          <div class="form-group"><label>Nom complet</label><input v-model="pf.name" /></div>
          <div class="form-group"><label>Téléphone (MoMo)</label><input v-model="pf.phone" placeholder="+250 788 000 000" /></div>
          <button class="btn btn-primary" @click="saveProfile"><i class="fa fa-save"></i> Enregistrer</button>
        </div>
        <div v-if="active === 'security'" class="card settings-card">
          <h2>Sécurité &amp; Mot de passe</h2>
          <div class="form-group"><label>Mot de passe actuel</label><input type="password" placeholder="••••••••" /></div>
          <div class="form-group"><label>Nouveau mot de passe</label><input type="password" placeholder="••••••••" /></div>
          <div class="form-group"><label>Confirmer le nouveau mot de passe</label><input type="password" placeholder="••••••••" /></div>
          <button class="btn btn-primary"><i class="fa fa-lock"></i> Changer le mot de passe</button>
        </div>
        <div v-if="active === 'notifs'" class="card settings-card">
          <h2>Notifications</h2>
          <div class="notif-toggle"><div><strong>Nouvelles commandes</strong><p>Soyez notifié quand quelqu'un achète votre annonce</p></div><label class="toggle"><input type="checkbox" checked /><span class="slider"></span></label></div>
          <div class="notif-toggle"><div><strong>Messages</strong><p>Recevoir les messages des acheteurs</p></div><label class="toggle"><input type="checkbox" checked /><span class="slider"></span></label></div>
          <div class="notif-toggle"><div><strong>Offres promotionnelles</strong><p>Recevoir les offres et promotions KlikTrade</p></div><label class="toggle"><input type="checkbox" /><span class="slider"></span></label></div>
        </div>
        <div v-if="active === 'account'" class="card settings-card">
          <h2>Mon compte</h2>
          <div class="account-info"><i class="fa fa-user-circle"></i><div><strong>{{ userStore.user?.name }}</strong><p>{{ userStore.user?.email }}</p><span :class="['role-badge', userStore.user?.role]">{{ userStore.user?.role }}</span></div></div>
          <div class="danger-zone"><h3><i class="fa fa-exclamation-triangle"></i> Zone dangereuse</h3><button class="btn btn-danger" @click="logout"><i class="fa fa-sign-out-alt"></i> Se déconnecter</button></div>
        </div>
      </div>
    </div>
  </div>
  <Footer /></div>
</template>
<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import Navbar from '../components/Navbar.vue'
import Footer from '../components/Footer.vue'
import { useUserStore } from '../stores/user'
import { useToastStore } from '../stores/toast'
import axios from 'axios'
const userStore = useUserStore()
const toast = useToastStore()
const router = useRouter()
const active = ref('profile')
const sections = [{ id:'profile', icon:'fa fa-user', label:'Profil' }, { id:'security', icon:'fa fa-lock', label:'Sécurité' }, { id:'notifs', icon:'fa fa-bell', label:'Notifications' }, { id:'account', icon:'fa fa-cog', label:'Compte' }]
const pf = reactive({ name: userStore.user?.name || '', phone: userStore.user?.phone || '' })
async function saveProfile() {
  try {
    await axios.put('/api/auth/profile', pf, { headers: { Authorization: `Bearer ${userStore.token}` } })
    toast.success('Profil mis à jour !')
  } catch { toast.error('Erreur lors de la mise à jour') }
}
function logout() { userStore.logout(); router.push('/'); toast.info('Déconnecté') }
</script>
<style scoped>
.settings-page { padding: 40px 0 80px; }
h1 { font-size: 24px; font-weight: 800; margin-bottom: 28px; display: flex; align-items: center; gap: 10px; }
h1 i { color: var(--primary); }
.not-logged { text-align: center; padding: 60px; }
.not-logged i { font-size: 52px; color: var(--border); display: block; margin-bottom: 16px; }
.not-logged h2 { margin-bottom: 20px; }
.settings-grid { display: grid; grid-template-columns: 200px 1fr; gap: 24px; align-items: start; }
.settings-nav { padding: 12px; display: flex; flex-direction: column; gap: 2px; }
.sn-btn { display: flex; align-items: center; gap: 9px; padding: 11px 14px; border-radius: var(--radius-sm); font-size: 13px; font-weight: 600; color: var(--text-muted); background: none; border: none; cursor: pointer; width: 100%; text-align: left; transition: all 0.15s; }
.sn-btn:hover { background: var(--bg); color: var(--text); }
.sn-btn.active { background: var(--primary-bg); color: var(--primary); }
.settings-card { padding: 28px; }
.settings-card h2 { font-size: 18px; font-weight: 700; margin-bottom: 24px; padding-bottom: 14px; border-bottom: 1px solid var(--border); }
.avatar-row { display: flex; align-items: center; gap: 16px; margin-bottom: 24px; }
.big-avatar { width: 64px; height: 64px; background: var(--primary); color: #fff; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 28px; font-weight: 800; }
.avatar-row strong { display: block; font-size: 16px; font-weight: 700; }
.avatar-row p { font-size: 13px; color: var(--text-muted); }
.notif-toggle { display: flex; align-items: center; justify-content: space-between; padding: 16px 0; border-bottom: 1px solid var(--border-light); }
.notif-toggle strong { display: block; font-size: 14px; font-weight: 600; margin-bottom: 3px; }
.notif-toggle p { font-size: 12px; color: var(--text-muted); }
.toggle { position: relative; display: inline-block; width: 44px; height: 24px; flex-shrink: 0; }
.toggle input { opacity: 0; width: 0; height: 0; }
.slider { position: absolute; cursor: pointer; inset: 0; background: var(--border); border-radius: 24px; transition: 0.3s; }
.slider::before { content: ''; position: absolute; width: 18px; height: 18px; left: 3px; top: 3px; background: #fff; border-radius: 50%; transition: 0.3s; }
.toggle input:checked + .slider { background: var(--primary); }
.toggle input:checked + .slider::before { transform: translateX(20px); }
.account-info { display: flex; gap: 16px; align-items: center; padding: 20px; background: var(--bg); border-radius: var(--radius-sm); margin-bottom: 28px; }
.account-info i { font-size: 44px; color: var(--primary); }
.account-info strong { display: block; font-size: 16px; font-weight: 700; }
.account-info p { font-size: 13px; color: var(--text-muted); margin-bottom: 4px; }
.role-badge { font-size: 11px; font-weight: 700; text-transform: uppercase; padding: 2px 8px; border-radius: 99px; background: var(--primary-bg); color: var(--primary); }
.role-badge.admin { background: #f3e8ff; color: #7C3AED; }
.danger-zone { border: 1px solid #fca5a5; border-radius: var(--radius-sm); padding: 20px; background: #fef2f2; }
.danger-zone h3 { font-size: 14px; font-weight: 700; color: var(--danger); margin-bottom: 14px; display: flex; align-items: center; gap: 7px; }
@media (max-width: 700px) { .settings-grid { grid-template-columns: 1fr; } }
</style>
