<template>
  <footer class="footer">
    <div class="footer-top">
      <div class="container footer-grid">
        <div class="col-brand">
          <div class="footer-logo">
            <img src="@assets/logo.png" alt="KlikTrade" />
            <div>
              <h3>KlikTrade</h3>
              <span>Rwanda</span>
            </div>
          </div>
          <p>La plateforme N°1 du Rwanda pour acheter, vendre et échanger. Électronique, mode, maison et plus — en Francs Rwandais.</p>
          <div class="socials">
            <a href="#"><i class="fab fa-facebook-f"></i></a>
            <a href="#"><i class="fab fa-instagram"></i></a>
            <a href="#"><i class="fab fa-whatsapp"></i></a>
            <a href="#"><i class="fab fa-twitter"></i></a>
          </div>
        </div>
        <div class="col-links">
          <h4>Liens rapides</h4>
          <ul>
            <li><RouterLink to="/">Accueil</RouterLink></li>
            <li><RouterLink to="/listing">Toutes les annonces</RouterLink></li>
            <li><RouterLink to="/become-seller">Devenir vendeur</RouterLink></li>
            <li><RouterLink to="/sell">Publier une annonce</RouterLink></li>
            <li><RouterLink to="/wishlist">Mes favoris</RouterLink></li>
            <li><RouterLink to="/cart">Panier</RouterLink></li>
          </ul>
        </div>
        <div class="col-links">
          <h4>Catégories</h4>
          <ul>
            <li><RouterLink to="/listing?category=electronics">Électronique</RouterLink></li>
            <li><RouterLink to="/listing?category=fashion">Mode & Vêtements</RouterLink></li>
            <li><RouterLink to="/listing?category=home-kitchen">Maison & Cuisine</RouterLink></li>
            <li><RouterLink to="/listing?category=vehicles">Véhicules</RouterLink></li>
            <li><RouterLink to="/listing?category=agriculture">Agriculture</RouterLink></li>
          </ul>
        </div>
        <div class="col-contact">
          <h4>Contact</h4>
          <ul>
            <li><i class="fa fa-envelope"></i> kliktradeshop@gmail.com</li>
            <li><i class="fa fa-phone"></i> +250 788 000 000</li>
            <li><i class="fa fa-map-marker-alt"></i> Kigali, Rwanda</li>
            <li><i class="fa fa-clock"></i> Lun – Sam: 8h – 18h</li>
          </ul>
          <div class="payment-note">
            <p>Paiement accepté</p>
            <div class="pay-logos">
              <span class="pay-chip">MTN MoMo</span>
              <span class="pay-chip">Airtel Money</span>
              <span class="pay-chip">Cash</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="footer-bottom">
      <div class="container footer-bottom-inner">
        <p>&copy; {{ new Date().getFullYear() }} KlikTrade Rwanda. Tous droits réservés.</p>
        <div class="bottom-links">
          <RouterLink to="/admin">Admin</RouterLink>
          <span>·</span>
          <a href="#">Confidentialité</a>
          <span>·</span>
          <a href="#">Conditions d'utilisation</a>
        </div>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.footer { background: #0F172A; color: #94A3B8; margin-top: 60px; }
.footer-top { padding: 52px 0 40px; }
.footer-grid { display: grid; grid-template-columns: 2fr 1fr 1fr 1.4fr; gap: 40px; }
.footer-logo { display: flex; align-items: center; gap: 10px; margin-bottom: 14px; }
.footer-logo img { width: 40px; }
.footer-logo h3 { font-size: 18px; font-weight: 900; color: #fff; margin: 0; }
.footer-logo span { font-size: 10px; font-weight: 700; color: var(--primary-light); text-transform: uppercase; }
.col-brand p { font-size: 13px; line-height: 1.8; margin-bottom: 18px; }
.socials { display: flex; gap: 8px; }
.socials a { width: 34px; height: 34px; background: rgba(255,255,255,0.07); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #94A3B8; font-size: 14px; transition: all 0.18s; }
.socials a:hover { background: var(--primary); color: #fff; }
.col-links h4, .col-contact h4 { font-size: 12px; font-weight: 700; color: #fff; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 16px; }
.col-links ul, .col-contact ul { list-style: none; display: flex; flex-direction: column; gap: 9px; }
.col-links ul li a { font-size: 13px; color: #94A3B8; transition: color 0.15s; }
.col-links ul li a:hover { color: var(--primary-light); }
.col-contact ul li { display: flex; align-items: flex-start; gap: 8px; font-size: 13px; }
.col-contact ul li i { color: var(--primary-light); width: 14px; margin-top: 2px; flex-shrink: 0; }
.payment-note { margin-top: 18px; }
.payment-note p { font-size: 11px; color: #64748B; margin-bottom: 7px; }
.pay-logos { display: flex; gap: 6px; flex-wrap: wrap; }
.pay-chip { background: rgba(255,255,255,0.07); color: #94A3B8; font-size: 11px; font-weight: 600; padding: 3px 10px; border-radius: 99px; }
.footer-bottom { border-top: 1px solid rgba(255,255,255,0.06); padding: 18px 0; }
.footer-bottom-inner { display: flex; align-items: center; justify-content: space-between; font-size: 12px; flex-wrap: wrap; gap: 10px; }
.bottom-links { display: flex; gap: 10px; align-items: center; }
.bottom-links a { color: #64748B; }
.bottom-links a:hover { color: var(--primary-light); }
.bottom-links span { color: #334155; }
@media (max-width: 900px) { .footer-grid { grid-template-columns: 1fr 1fr; } }
@media (max-width: 560px) { .footer-grid { grid-template-columns: 1fr; } .footer-bottom-inner { flex-direction: column; align-items: center; } }
</style>
