<template>
  <footer class="site-footer">
    <h1 class="footer-title">Passion Lecture</h1>
    <div class="footer-content">
      <div class="footer-section">
        <h2 class="section-title">App Creators:</h2>
        <ul class="creator-list">
          <li>Yosef N.</li>
          <li>Antoine P.</li>
          <li>Charles-Henri M.</li>
        </ul>
      </div>
      <div class="footer-section">
        <h2 class="section-title">Contacts</h2>
        <ul class="contact-list">
          <li><a href="mailto:pn25kdv@eduvaud.ch">pn25kdv@eduvaud.ch</a></li>
          <li><a href="mailto:pn01kbc@eduvaud.ch">pn01kbc@eduvaud.ch</a></li>
          <li><a href="mailto:pc01zcg@eduvaud.ch">pc01zcg@eduvaud.ch</a></li>
        </ul>
      </div>
    </div>
    <router-link to="/admin" style="display: flex; justify-content: center">
      <div>AdminPage</div>
    </router-link>
  </footer>
</template>

<script>
export default {
  name: 'AppFooter',
}
</script>

<style scoped>
h1 {
  text-align: center;
  color: #f5ffed;
  font-size: 2rem;
  font-weight: 600;
}

.site-footer {
  width: 100vw;
  margin-left: calc(-50vw + 50%);
  background-color: #b6e1c6;
  color: white;
  padding: 20px 0;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.footer-content {
  display: flex;
  justify-content: space-around;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.footer-section {
  text-align: center;
}

.section-title {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 0.8rem;
  color: #f5ffed;
}

.creator-list,
.contact-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.creator-list li,
.contact-list li {
  margin: 0.5rem 0;
  font-size: 1rem;
}

.contact-list a {
  color: white;
  text-decoration: none;
  transition: color 0.3s;
}

.contact-list a:hover {
  color: #2c3e50;
  border-radius: 5%;
}

@media (max-width: 768px) {
  .footer-content {
    flex-direction: column;
    gap: 1.5rem;
  }

  .footer-title {
    font-size: 1.3rem;
    margin-bottom: 1rem;
  }
}
</style>
