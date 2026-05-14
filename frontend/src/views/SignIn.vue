<template>
  <div class="signin-page" :class="{ dark: isDark }">
    <div class="signin-left">
      <RouterLink to="/" class="back-home"><i class="fa fa-arrow-left"></i> {{ t.general.back }}</RouterLink>
      <div class="brand-block">
        <div class="brand-icon-sm">K</div>
        <div>
          <h2>KlikTrade <span>Rwanda</span></h2>
          <p>Marketplace N°1</p>
        </div>
      </div>

      <div class="tabs">
        <button :class="{ active: tab === 'login' }" @click="tab='login'">{{ t.auth.login }}</button>
        <button :class="{ active: tab === 'register' }" @click="tab='register'">{{ t.auth.register }}</button>
      </div>

      <!-- Login form -->
      <form v-if="tab === 'login'" @submit.prevent="doLogin" class="auth-form">
        <h1>{{ t.auth.welcomeBack }}</h1>
        <p class="sub">{{ t.auth.loginSubtitle }}</p>
        <div class="form-group">
          <label>{{ t.auth.email }}</label>
          <div class="inp-icon"><i class="fa fa-envelope"></i><input v-model="loginForm.email" type="email" required :placeholder="t.auth.email" /></div>
        </div>
        <div class="form-group">
          <label>{{ t.auth.password }}</label>
          <div class="inp-icon"><i class="fa fa-lock"></i><input v-model="loginForm.password" :type="showPw ? 'text' : 'password'" required placeholder="••••••••" /><button type="button" class="eye-btn" @click="showPw=!showPw"><i :class="showPw ? 'fa fa-eye-slash' : 'fa fa-eye'"></i></button></div>
        </div>
        <div v-if="error" class="err-box"><i class="fa fa-exclamation-circle"></i> {{ error }}</div>
        <button type="submit" class="btn btn-primary btn-block btn-lg" :disabled="loading">
          <span v-if="loading"><i class="fa fa-spinner fa-spin"></i> {{ t.general.loading }}</span>
          <span v-else><i class="fa fa-sign-in-alt"></i> {{ t.auth.signIn }}</span>
        </button>
        <p class="switch-tab">{{ t.auth.noAccount }} <button type="button" @click="tab='register'">{{ t.auth.register }}</button></p>
      </form>

      <!-- Register form -->
      <form v-else @submit.prevent="doRegister" class="auth-form">
        <h1>{{ t.auth.joinKlikTrade }}</h1>
        <p class="sub">{{ t.auth.registerSubtitle }}</p>

        <!-- Account type selector -->
        <div class="form-group">
          <label>{{ t.auth.accountType }}</label>
          <div class="role-selector">
            <button type="button" :class="['role-opt', { active: regForm.accountType === 'buyer' }]" @click="regForm.accountType = 'buyer'">
              <i class="fa fa-shopping-bag"></i>
              <span>{{ t.auth.buyer }}</span>
              <small>{{ t.auth.buyerRole }}</small>
            </button>
            <button type="button" :class="['role-opt', { active: regForm.accountType === 'seller' }]" @click="regForm.accountType = 'seller'">
              <i class="fa fa-store"></i>
              <span>{{ t.auth.seller }}</span>
              <small>{{ t.auth.sellerRole }}</small>
            </button>
          </div>
          <p v-if="regForm.accountType === 'seller'" class="seller-note"><i class="fa fa-info-circle"></i> {{ t.auth.sellerNote }}</p>
        </div>

        <div class="form-group">
          <label>{{ t.auth.name }}</label>
          <div class="inp-icon"><i class="fa fa-user"></i><input v-model="regForm.name" required :placeholder="t.auth.name" /></div>
        </div>
        <div class="form-group">
          <label>{{ t.auth.email }}</label>
          <div class="inp-icon"><i class="fa fa-envelope"></i><input v-model="regForm.email" type="email" required :placeholder="t.auth.email" /></div>
        </div>
        <div class="form-group">
          <label>{{ t.auth.nationalId }}</label>
          <div class="inp-icon"><i class="fa fa-id-card"></i><input v-model="regForm.nationalId" required :placeholder="t.auth.nationalIdHint" maxlength="16" /></div>
        </div>
        <div class="form-group">
          <label>{{ t.auth.phone }}</label>
          <div class="inp-icon"><i class="fa fa-phone"></i><input v-model="regForm.phone" placeholder="+250 788 000 000" /></div>
        </div>
        <div class="form-group">
          <label>{{ t.auth.password }}</label>
          <div class="inp-icon"><i class="fa fa-lock"></i><input v-model="regForm.password" :type="showPw ? 'text' : 'password'" required placeholder="Min. 6 characters" /><button type="button" class="eye-btn" @click="showPw=!showPw"><i :class="showPw ? 'fa fa-eye-slash' : 'fa fa-eye'"></i></button></div>
        </div>
        <div v-if="error" class="err-box"><i class="fa fa-exclamation-circle"></i> {{ error }}</div>
        <button type="submit" class="btn btn-primary btn-block btn-lg" :disabled="loading">
          <span v-if="loading"><i class="fa fa-spinner fa-spin"></i> {{ t.general.loading }}</span>
          <span v-else><i class="fa fa-user-plus"></i> {{ t.auth.createAccount }}</span>
        </button>
        <p class="switch-tab">{{ t.auth.alreadyMember }} <button type="button" @click="tab='login'">{{ t.auth.signIn }}</button></p>
      </form>
    </div>

    <div class="signin-right">
      <div class="sr-content">
        <h2>{{ t.home.heroTitle }}<br /><span>{{ t.home.heroSpan }}</span></h2>
        <p>{{ t.home.heroSub }}</p>
        <div class="sr-features">
          <div class="sr-feat"><i class="fa fa-check-circle"></i><span>100% Free Registration</span></div>
          <div class="sr-feat"><i class="fa fa-check-circle"></i><span>Post your listings easily</span></div>
          <div class="sr-feat"><i class="fa fa-check-circle"></i><span>MTN MoMo &amp; Airtel payments</span></div>
          <div class="sr-feat"><i class="fa fa-check-circle"></i><span>Secure transactions</span></div>
          <div class="sr-feat"><i class="fa fa-check-circle"></i><span>7/7 customer support</span></div>
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
import { useI18nStore } from '../stores/i18n'
import { useThemeStore } from '../stores/theme'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const toast = useToastStore()
const { t } = useI18nStore()
const themeStore = useThemeStore()
const isDark = themeStore.isDark

const tab = ref(route.query.tab === 'register' ? 'register' : 'login')
const showPw = ref(false)
const loading = ref(false)
const error = ref('')
const loginForm = ref({ email: '', password: '' })
const regForm = ref({ name: '', email: '', password: '', phone: '', nationalId: '', accountType: 'buyer' })

onMounted(() => { if (userStore.isLoggedIn) router.push('/') })

async function doLogin() {
  error.value = ''; loading.value = true
  try {
    await userStore.login(loginForm.value.email, loginForm.value.password)
    toast.success('Welcome back!')
    const user = userStore.user
    if (user?.role === 'seller') router.push('/dashboard/seller')
    else router.push('/dashboard/buyer')
  } catch (e) { error.value = e.response?.data?.error || 'Invalid credentials' }
  finally { loading.value = false }
}

async function doRegister() {
  error.value = ''; loading.value = true
  if (!regForm.value.nationalId) { error.value = t.auth.nationalIdHint; loading.value = false; return }
  try {
    await userStore.register(regForm.value.name, regForm.value.email, regForm.value.password, regForm.value.phone, regForm.value.nationalId, regForm.value.accountType)
    if (regForm.value.accountType === 'seller') {
      toast.info('Account created! Your seller request is pending admin approval.')
      router.push('/dashboard/buyer')
    } else {
      toast.success('Account created! Welcome to KlikTrade')
      router.push('/')
    }
  } catch (e) { error.value = e.response?.data?.error || 'Registration error' }
  finally { loading.value = false }
}
</script>

<style scoped>
.signin-page { display: flex; min-height: 100vh; background: var(--bg); }
.signin-left { width: 500px; flex-shrink: 0; background: var(--surface); padding: 32px 48px; display: flex; flex-direction: column; overflow-y: auto; }
.back-home { display: inline-flex; align-items: center; gap: 7px; font-size: 13px; color: var(--text-muted); margin-bottom: 28px; transition: color 0.15s; }
.back-home:hover { color: var(--primary); }
.brand-block { display: flex; align-items: center; gap: 12px; margin-bottom: 28px; }
.brand-icon-sm { width: 40px; height: 40px; background: var(--primary); color: #fff; border-radius: var(--radius-sm); display: flex; align-items: center; justify-content: center; font-size: 20px; font-weight: 900; flex-shrink: 0; }
.brand-block h2 { font-size: 20px; font-weight: 900; color: var(--text); margin: 0; }
.brand-block h2 span { color: var(--primary); }
.brand-block p { font-size: 11px; color: var(--text-muted); margin: 0; }
.tabs { display: flex; gap: 0; border: 1.5px solid var(--border); border-radius: var(--radius-sm); overflow: hidden; margin-bottom: 24px; }
.tabs button { flex: 1; padding: 10px; font-size: 14px; font-weight: 600; background: none; border: none; color: var(--text-muted); cursor: pointer; transition: all 0.18s; }
.tabs button.active { background: var(--primary); color: #fff; }
.auth-form h1 { font-size: 22px; font-weight: 800; margin-bottom: 5px; color: var(--text); }
.auth-form .sub { color: var(--text-muted); font-size: 13px; margin-bottom: 20px; }

.role-selector { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 4px; }
.role-opt { display: flex; flex-direction: column; align-items: center; gap: 4px; padding: 14px 10px; border: 2px solid var(--border); border-radius: var(--radius-sm); background: var(--surface); cursor: pointer; transition: all 0.18s; text-align: center; }
.role-opt i { font-size: 22px; color: var(--text-muted); margin-bottom: 4px; }
.role-opt span { font-size: 13px; font-weight: 700; color: var(--text); }
.role-opt small { font-size: 10px; color: var(--text-muted); line-height: 1.4; }
.role-opt.active { border-color: var(--primary); background: var(--primary-bg); }
.role-opt.active i, .role-opt.active span { color: var(--primary); }
.seller-note { font-size: 11px; color: var(--warning); background: rgba(217,119,6,0.08); padding: 8px 12px; border-radius: var(--radius-sm); margin-top: 8px; display: flex; align-items: flex-start; gap: 6px; line-height: 1.5; }

.inp-icon { position: relative; }
.inp-icon > i:first-child { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: var(--text-muted); font-size: 13px; z-index: 1; }
.inp-icon input { padding-left: 36px; padding-right: 40px; }
.eye-btn { position: absolute; right: 10px; top: 50%; transform: translateY(-50%); background: none; border: none; color: var(--text-muted); font-size: 13px; cursor: pointer; padding: 4px; }
.err-box { background: rgba(220,38,38,0.08); border: 1px solid rgba(220,38,38,0.2); color: var(--danger); padding: 10px 14px; border-radius: var(--radius-sm); font-size: 13px; margin-bottom: 14px; display: flex; align-items: center; gap: 7px; }
.switch-tab { text-align: center; font-size: 13px; color: var(--text-muted); margin-top: 16px; }
.switch-tab button { background: none; border: none; color: var(--primary); font-weight: 700; cursor: pointer; text-decoration: underline; }

.signin-right { flex: 1; background: linear-gradient(135deg, #1A1A2E 0%, #16213E 60%, #0F3460 100%); display: none; flex-direction: column; align-items: center; justify-content: center; padding: 60px; position: relative; overflow: hidden; }
.signin-right::before { content: ''; position: absolute; inset: 0; background: radial-gradient(ellipse at 50% 50%, rgba(232,93,4,0.12) 0%, transparent 60%); pointer-events: none; }
@media (min-width: 860px) { .signin-right { display: flex; } }
.sr-content { max-width: 400px; position: relative; z-index: 1; }
.sr-content h2 { font-size: 40px; font-weight: 900; color: #fff; margin-bottom: 16px; line-height: 1.2; letter-spacing: -1px; }
.sr-content h2 span { color: var(--primary-light); }
.sr-content p { color: rgba(255,255,255,0.6); font-size: 14px; line-height: 1.8; margin-bottom: 32px; }
.sr-features { display: flex; flex-direction: column; gap: 12px; }
.sr-feat { display: flex; align-items: center; gap: 12px; color: rgba(255,255,255,0.8); font-size: 14px; }
.sr-feat i { color: var(--green); font-size: 16px; }
@media (max-width: 480px) { .signin-left { width: 100%; padding: 20px; } }
</style>
