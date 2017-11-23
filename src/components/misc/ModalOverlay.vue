<template>
  <div class="modal-overlay">
  </div>
</template>

<script>
  export default {
    name: 'modal-overlay'
  }
</script>

<style lang="scss" scoped>
  .modal-overlay {
    width: 100%;
    height: 100vh;

    top: 0;

    background-color: black;
    opacity: 0.5;

    position: absolute;
    z-index: 100;
  }
</style>
