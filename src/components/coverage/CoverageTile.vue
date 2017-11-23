<template>
  <div class="coverage-tile">
      <div class="coverage-info-container">
        <img :src="imgSrc"/>
        <h1>{{ title }}</h1>
        <p>{{ description }}</p>
      </div>
  </div>

</template>

<script>
  export default {
    name: 'coverage-tile',
    props: ['title', 'imgSrc', 'description']
  }
</script>

<style scoped>
  .coverage-tile {
    width: 33%;
  }
  .coverage-tile:hover {
    background: #04080b;
  }
  .coverage-info-container {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
  }
  .coverage-info-container img {
    width: 40%;
    height: 28%;
    padding: 10%;
  }
  .coverage-info-container h1, p {
    color: #748a98;
    text-align: center;
    font-weight: lighter;
  }
  /* Bubble Bottom */
  .hvr-bubble-bottom {
    display: inline-block;
    vertical-align: middle;
    -webkit-transform: perspective(1px) translateZ(0);
    transform: perspective(1px) translateZ(0);
    /*box-shadow: 0 0 50px #888888;*/
    position: relative;
  }
  .hvr-bubble-bottom:before {
    pointer-events: none;
    position: absolute;
    z-index: -1;
    content: '';
    border-style: solid;
    -webkit-transition-duration: 0.3s;
    transition-duration: 0.3s;
    -webkit-transition-property: transform;
    transition-property: transform;
    left: calc(50% - 10px);
    bottom: 0;
    border-width: 10px 10px 0 10px;
    /*border-color: #04080b transparent transparent transparent;*/
    border-color: whitesmoke transparent transparent transparent;
  }
  .hvr-bubble-bottom:hover:before, .hvr-bubble-bottom:focus:before, .hvr-bubble-bottom:active:before {
    /*-webkit-transform: translateY(10px);*/
    /*transform: translateY(10px);*/
  }
</style>
