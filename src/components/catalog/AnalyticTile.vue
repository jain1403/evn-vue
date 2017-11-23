<template>
  <div class="analytic-tile" :title="description">
    <div v-if="isNew" class="analytic-tile-new-flag">
      <p align="center">New</p>
    </div>

    <p class="analytic-tile-title">{{ name }}</p>
    <div class="analytic-tile-details">
      <p v-if="description">{{ description.length < 75 ? description : description.slice(0, 75) + '...' }}</p>
      <p v-if="valueProposition">{{ valueProposition.length < 75 ? valueProposition : valueProposition.slice(0, 75) + '...' }}</p>
    </div>

    <div class="analytic-tile-stats">
      <div class="analytic-tile-stats-px-wrapper" v-if="confidenceLevel > -1">
        <px-percent-circle :val.prop="confidenceLevel" max="100" thickness="30"></px-percent-circle>
      </div>
      <div class="analytic-tile-stats-title" v-if="confidenceLevel > -1">
        <p align="center">Confidence Level</p>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'analytic-tile',
    props: ['name', 'description', 'valueProposition', 'confidenceLevel', 'leadTime', 'link', 'isNew']
  }
</script>

<style lang="scss" scoped>
  @import "../../../static/bower_components/px-colors-design/settings.colors";

  .analytic-tile {
    background-color: #ffffff;
    width: 250px;
    height: 300px;
    border: 1px solid gray;
    grid-gap: 2%;
    position: relative;
    text-decoration: none;
    display: inline-block;
  }
  .analytic-tile:hover {
    border: 2px solid $primary-hover;
    color: $black;
  }

  .analytic-tile-new-flag {
    color: white;
    background-color: $yellow-green5;

    position: absolute;
    right: 0;

    margin: -10px;
    padding: 1px 10px 1px 10px;

    p {
      margin: 0;
    }
  }

  .analytic-tile-title {
    font-size: 15px;
    color: #59717f;
    padding: 10px;
    margin: 0;
    height: 40px;
    text-align: center;
  }
  .analytic-tile-details {
    font-size: 12px;
    color: #889aa5;
    padding: 10px;
    margin: 0px;
  }
  /*anchors percentage circles to bottom*/
  .analytic-tile-stats {
    position: absolute;
    bottom: 0;
    height: 33%;

  }
  .analytic-tile-stats-px-wrapper {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    margin: -25px;
  }
  .analytic-tile-stats-px-wrapper px-percent-circle {
    bottom: 0;
    width: 30%;
  }
  .analytic-tile-stats-title {
    font-size: 12px;
    font-weight: bold;
    color: #59717f;
    margin: 30px;
  }
</style>
