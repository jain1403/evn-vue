<template>
  <div class="coverage-container">
    <!--Section for selecting which coverage report from: APM, BO, and OO-->
    <div class="coverage-tile-container">
      <coverage-tile v-for="coverageTile in coverageTiles"
                     :key="coverageTile.title"
                     :title="coverageTile.title"
                     :imgSrc="coverageTile.imgSrc"
                     :description="coverageTile.description"
                     @click.native="generateCoverageDetails(coverageTile.title)" style="cursor: pointer">
      </coverage-tile>
    </div>

    <!--Section which lists all fuel types and their coverage percentages for the selected coverage report-->
    <div class="coverage-category-percentages-container" v-if="showCoverageDetails">
      <div class="coverage-category-px-percent-circle-container" v-for="coverageCategory in apmCoverageCategories"
           @click="generateCoverageCategoryDetails(coverageCategory.fuel_name)">
        <px-percent-circle :val.prop="coverageCategory.overallcount" max="100" thickness="30"></px-percent-circle>

        <p>{{ coverageCategory.fuel_name }}</p>
      </div>
    </div>

    <!--Section which displays coverage breakdown per asset within the selected fuel source-->
    <div class="coverage-category-details-container" v-if="showCoverageCategoryDetails">
      <div class="coverage-category-pie-chart-container">
        <px-vis-pie-chart
          @px-vis-pie-slice-clicked="setSelectedSliceDetails"
          prevent-resize="true"
          hide-register
          use-percentage
          width="250"
          height="250"
          preserve-data-order="true"
          chart-horizontal-alignment="left"
          chart-vertical-alignment="center"
          :chart-data.prop="chartData"
          series-config='{"mySerie":{"xAxisUnit":"","y":"y","x":"x"}}'
          inner-radius="0">
        </px-vis-pie-chart>
      </div>

      <div class="coverage-category-pie-chart-slice-details">
        <div class="coverage-category-pie-chart-slice-details-header">
          <h2>{{ selectedSliceDetails.selectedSliceTitle }}</h2>
        </div>

        <div class="coverage-category-pie-chart-slice-breakdown">
          <div class="coverage-category-pie-chart-slice-detail" v-for="detail in selectedSliceDetails.sliceDetails">
            <h1>{{ detail.value }}</h1>
            <h2>{{ detail.title }}</h2>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import CoverageTile from '../components/coverage/CoverageTile.vue'
  import apmCoverageTile from '../assets/apmCoverageTile.jpg'
  import boCoverageTile from '../assets/boCoverageTile.jpg'
  import ooCoverageTile from '../assets/ooCoverageTile.jpg'
  import {
    getCoverageFuelData,
    getCoveragePieChartData
  } from '../js/helpers'
  // var Highcharts = require('highcharts')
  export default {
    components: {
      'coverage-tile': CoverageTile
    },
    data () {
      return {
        coverageTiles: [
          {
            title: 'ASSET PERFORMANCE MANAGEMENT',
            imgSrc: apmCoverageTile,
            description: 'Asset Performance Management enables intelligent asset strategies that reduce cost and improve availability and reliability of assets'
          },
          {
            title: 'BUSINESS OPTIMIZATION',
            imgSrc: boCoverageTile,
            description: 'Business Optimization enhances existing business processes and constructs new processes to make organization effective'
          },
          {
            title: 'OPERATIONS OPTIMIZATION',
            imgSrc: ooCoverageTile,
            description: 'Operations Optimization increases operational efficiency with real-time visibility into data, reduces production costs and enhances plant flexibility'
          }
        ],
        apmCoverageCategories: [
        ],
        showCoverageDetails: false,
        showCoverageCategoryDetails: false,
        selectedSliceDetails: {
          selectedSliceTitle: '',
          sliceDetails: []
        }
      }
    },
    methods: {
      generateCoverageDetails (title) {
        // TODO: hardcoded to only show APM coverage report since we have no data for the others yet
        if (title === 'ASSET PERFORMANCE MANAGEMENT') {
          if (this.showCoverageDetails) {
            this.showCoverageDetails = false
            this.showCoverageCategoryDetails = false
          } else {
            this.showCoverageDetails = !this.showCoverageDetails
          }
        }
      },
      generateCoverageCategoryDetails (title) {
        this.showCoverageCategoryDetails = !this.showCoverageCategoryDetails
      },
      setSelectedSliceDetails (e) {
        this.selectedSliceDetails.selectedSliceTitle = e.detail.datum.data.y
        this.selectedSliceDetails.sliceDetails = e.detail.datum.data.sliceDetails
      }
    },
    async beforeMount () {
      this.apmCoverageCategories = await getCoverageFuelData()
      this.chartData = await getCoveragePieChartData()
    }
  }
</script>

<!--TODO: migrate and reorganize to use SCSS like rest of project-->
<style scoped>
  .coverage-container {
    background: #0a1417;
    height: 100vh;
    overflow-y: visible;
  }

  .coverage-tile-container {
    display: flex;
    justify-content: space-around;
    flex-wrap: wrap;
  }

  .coverage-category-percentages-container {
    height: 200px;
    background: #0a1417;
    display: flex;
    flex-direction: row;
  }

  .coverage-category-percentages-container px-percent-circle {
    width: 40%;
  }

  .coverage-category-px-percent-circle-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-around;
  }

  .coverage-category-px-percent-circle-container p {
    color: #748a98;
  }

  .coverage-category-px-percent-circle-container:hover {
    background: #04080b;
    cursor: pointer
  }

  .coverage-category-details-container {
    height: 300px;
    background: #0a1417;
    display: flex;
    flex-direction: row;
  }

  .coverage-category-pie-chart-container {
    width: 25%;
    padding-left: 50px;
  }

  .coverage-category-pie-chart-slice-details {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    color: #748a98;
  }

  .coverage-category-pie-chart-slice-details-header h2 {
    font-weight: lighter;
  }

  .coverage-category-pie-chart-slice-breakdown {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
  }

  .coverage-category-pie-chart-slice-detail {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 30px;
    text-align: center;
  }

  .coverage-category-pie-chart-slice-detail h2 {
    font-weight: lighter;
  }
</style>
