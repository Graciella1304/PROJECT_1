<template>
  <div class="signin-page">
    <div class="signin-left">
      <RouterLink to="/" class="back-home"><i class="fa fa-arrow-left"></i> Retour à l'accueil</RouterLink>
      <div class="brand-block">
        <img src="@assets/logo.png" alt="KlikTrade" />
        <div>
          <h2>KlikTrade <span>Rwanda</span></h2>
          <p>Marketplace N°1</p>
        </div>
      </div>

      <div class="tabs">
        <button :class="{ active: tab === 'login' }" @click="tab='login'">Connexion</button>
        <button :class="{ active: tab === 'register' }" @click="tab='register'">Inscription</button>
      </div>

      <!-- Login form -->
      <form v-if="tab === 'login'" @submit.prevent="doLogin" class="auth-form">
        <h1>Bon retour !</h1>
        <p class="sub">Connectez-vous à votre compte KlikTrade</p>
        <div class="form-group">
          <label>Adresse email</label>
          <div class="inp-icon"><i class="fa fa-envelope"></i><input v-model="loginForm.email" type="email" required placeholder="exemple@email.com" /></div>
        </div>
        <div class="form-group">
          <label>Mot de passe</label>
          <div class="inp-icon"><i class="fa fa-lock"></i><input v-model="loginForm.password" :type="showPw ? 'text' : 'password'" required placeholder="••••••••" /><button type="button" class="eye-btn" @click="showPw=!showPw"><i :class="showPw ? 'fa fa-eye-slash' : 'fa fa-eye'"></i></button></div>
        </div>
        <div v-if="error" class="err-box"><i class="fa fa-exclamation-circle"></i> {{ error }}</div>
        <button type="submit" class="btn btn-primary btn-block btn-lg" :disabled="loading">
          <span v-if="loading"><i class="fa fa-spinner fa-spin"></i> Connexion...</span>
          <span v-else><i class="fa fa-sign-in-alt"></i> Se connecter</span>
        </button>
        <p class="switch-tab">Pas encore de compte ? <button type="button" @click="tab='register'">Créer un compte</button></p>
        <div class="admin-hint"><i class="fa fa-info-circle"></i> Admin ? <RouterLink to="/admin">Accéder au panneau admin</RouterLink></div>
      </form>

      <!-- Register form -->
      <form v-else @submit.prevent="doRegister" class="auth-form">
        <h1>Rejoindre KlikTrade</h1>
        <p class="sub">Créez votre compte gratuit en quelques secondes</p>
        <div class="form-group">
          <label>Nom complet</label>
          <div class="inp-icon"><i class="fa fa-user"></i><input v-model="regForm.name" required placeholder="Jean Uwimana" /></div>
        </div>
        <div class="form-group">
          <label>Email</label>
          <div class="inp-icon"><i class="fa fa-envelope"></i><input v-model="regForm.email" type="email" required placeholder="exemple@email.com" /></div>
        </div>
        <div class="form-group">
          <label>Numéro de téléphone (MoMo)</label>
          <div class="inp-icon"><i class="fa fa-phone"></i><input v-model="regForm.phone" placeholder="+250 788 000 000" /></div>
        </div>
        <div class="form-group">
          <label>Mot de passe</label>
          <div class="inp-icon"><i class="fa fa-lock"></i><input v-model="regForm.password" :type="showPw ? 'text' : 'password'" required placeholder="Min. 6 caractères" /></div>
        </div>
        <div v-if="error" class="err-box"><i class="fa fa-exclamation-circle"></i> {{ error }}</div>
        <button type="submit" class="btn btn-primary btn-block btn-lg" :disabled="loading">
          <span v-if="loading"><i class="fa fa-spinner fa-spin"></i> Création...</span>
          <span v-else><i class="fa fa-user-plus"></i> Créer mon compte</span>
        </button>
        <p class="switch-tab">Déjà membre ? <button type="button" @click="tab='login'">Se connecter</button></p>
      </form>
    </div>

    <div class="signin-right">
      <div class="sr-content">
        <h2>Achetez &amp; Vendez<br /><span>en toute confiance</span></h2>
        <p>Rejoignez plus de 50,000 utilisateurs qui font confiance à KlikTrade pour leurs transactions quotidiennes au Rwanda.</p>
        <div class="sr-features">
          <div class="sr-feat"><i class="fa fa-check-circle"></i><span>Inscription 100% gratuite</span></div>
          <div class="sr-feat"><i class="fa fa-check-circle"></i><span>Publiez vos annonces facilement</span></div>
          <div class="sr-feat"><i class="fa fa-check-circle"></i><span>Paiement MTN MoMo & Airtel</span></div>
          <div class="sr-feat"><i class="fa fa-check-circle"></i><span>Transactions sécurisées</span></div>
          <div class="sr-feat"><i class="fa fa-check-circle"></i><span>Support client 7j/7</span></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '../stores/user'
import { useToastStore } from '../stores/toast'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const toast = useToastStore()
const tab = ref(route.query.tab === 'register' ? 'register' : 'login')
const showPw = ref(false)
const loading = ref(false)
const error = ref('')
const loginForm = ref({ email: '', password: '' })
const regForm = ref({ name: '', email: '', password: '', phone: '' })

onMounted(() => { if (userStore.isLoggedIn) router.push('/') })

async function doLogin() {
  error.value = ''; loading.value = true
  try { await userStore.login(loginForm.value.email, loginForm.value.password); toast.success('Bienvenue !'); router.push('/') }
  catch (e) { error.value = e.response?.data?.error || 'Identifiants incorrects' }
  finally { loading.value = false }
}

async function doRegister() {
  error.value = ''; loading.value = true
  try { await userStore.register(regForm.value.name, regForm.value.email, regForm.value.password, regForm.value.phone); toast.success('Compte créé ! Bienvenue sur KlikTrade'); router.push('/') }
  catch (e) { error.value = e.response?.data?.error || 'Erreur lors de la création' }
  finally { loading.value = false }
}
</script>

<style scoped>
.signin-page { display: flex; min-height: 100vh; }
.signin-left { width: 480px; flex-shrink: 0; background: #fff; padding: 32px 48px; display: flex; flex-direction: column; overflow-y: auto; }
.back-home { display: inline-flex; align-items: center; gap: 7px; font-size: 13px; color: var(--text-muted); margin-bottom: 32px; transition: color 0.15s; }
.back-home:hover { color: var(--primary); }
.brand-block { display: flex; align-items: center; gap: 12px; margin-bottom: 32px; }
.brand-block img { width: 44px; }
.brand-block h2 { font-size: 20px; font-weight: 900; color: var(--text); margin: 0; }
.brand-block h2 span { color: var(--primary); }
.brand-block p { font-size: 11px; color: var(--text-muted); margin: 0; }
.tabs { display: flex; gap: 0; border: 1.5px solid var(--border); border-radius: var(--radius-sm); overflow: hidden; margin-bottom: 28px; }
.tabs button { flex: 1; padding: 10px; font-size: 14px; font-weight: 600; background: none; border: none; color: var(--text-muted); cursor: pointer; transition: all 0.18s; }
.tabs button.active { background: var(--primary); color: #fff; }
.auth-form h1 { font-size: 24px; font-weight: 800; margin-bottom: 6px; }
.auth-form .sub { color: var(--text-muted); font-size: 14px; margin-bottom: 24px; }
.inp-icon { position: relative; }
.inp-icon > i:first-child { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: var(--text-muted); font-size: 13px; z-index: 1; }
.inp-icon input { padding-left: 36px; padding-right: 40px; }
.eye-btn { position: absolute; right: 10px; top: 50%; transform: translateY(-50%); background: none; border: none; color: var(--text-muted); font-size: 13px; cursor: pointer; padding: 4px; }
.err-box { background: #fef2f2; border: 1px solid #fca5a5; color: var(--danger); padding: 10px 14px; border-radius: var(--radius-sm); font-size: 13px; margin-bottom: 14px; display: flex; align-items: center; gap: 7px; }
.switch-tab { text-align: center; font-size: 13px; color: var(--text-muted); margin-top: 16px; }
.switch-tab button { background: none; border: none; color: var(--primary); font-weight: 700; cursor: pointer; text-decoration: underline; }
.admin-hint { text-align: center; font-size: 12px; color: var(--text-muted); margin-top: 12px; padding: 10px; background: var(--bg); border-radius: var(--radius-sm); }
.admin-hint a { color: var(--primary); font-weight: 600; }
.signin-right { flex: 1; background: linear-gradient(135deg, #1A1A2E 0%, #16213E 60%, #0F3460 100%); display: none; flex-direction: column; align-items: center; justify-content: center; padding: 60px; position: relative; }
@media (min-width: 860px) { .signin-right { display: flex; } }
.sr-content { max-width: 400px; }
.sr-content h2 { font-size: 42px; font-weight: 900; color: #fff; margin-bottom: 16px; line-height: 1.2; letter-spacing: -1px; }
.sr-content h2 span { color: var(--primary-light); }
.sr-content p { color: rgba(255,255,255,0.6); font-size: 15px; line-height: 1.8; margin-bottom: 32px; }
.sr-features { display: flex; flex-direction: column; gap: 12px; }
.sr-feat { display: flex; align-items: center; gap: 12px; color: rgba(255,255,255,0.8); font-size: 14px; }
.sr-feat i { color: var(--green); font-size: 16px; }
@media (max-width: 480px) { .signin-left { width: 100%; padding: 20px; } }
</style>
