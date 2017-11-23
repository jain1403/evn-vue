<template>
  <div class="landing-page">
    <div class="catalog-categories">
      <div class="catalog-category">
        <router-link :to="{ path: 'catalog', query: { analyticType: 'consumption' }}">CONSUMPTION</router-link>
      </div>
      <div class="catalog-category">
        <router-link :to="{ path: 'catalog', query: { analyticType: 'tnd' }}">T&D</router-link>
      </div>
      <div class="catalog-category">
        <router-link :to="{ path: 'catalog', query: { analyticType: 'generation' }}">GENERATION</router-link>
      </div>
    </div>
  </div>
</template>

<script>
  import '../assets/landingPageBg.png'
</script>

<style scoped>
  .landing-page {
    height: calc(100% - 80px);
    background-color: #1e2c30;
    background: url('../assets/landingPageBg.png') no-repeat center center fixed;
    -webkit-background-size: cover;
    -moz-background-size: cover;
    -o-background-size: cover;
    background-size: cover;
  }
  .catalog-categories {
    display: flex;
    align-items: center;
    justify-content: center;
    /*padding: 25vh;*/
  }
  .catalog-category {
    padding-top: 25vh;
    padding-right: 5vh;
    padding-left: 5vh;
  }
  .catalog-category a, a:visited {
    color: #748a98;
    font-weight: lighter;
    font-size: 4.5em;
    letter-spacing: 10px;
    text-decoration: none;
  }
  .catalog-category a:hover {
    color: #2D7399;
  }
</style>
