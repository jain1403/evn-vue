<template>
  <div class="evn-catalog">
    <!--Import Animate.css for use with transitions-->
    <link href="https://cdn.jsdelivr.net/npm/animate.css@3.5.1" rel="stylesheet" type="text/css">

    <!--Contains button to toggle hierarchy menu, hierarchy breadcrumbs and "typeahead" search bar-->
    <div class="catalog-sub-nav">
      <px-context-browser-trigger id="catalog-sub-nav-button"
        @click="handleHierarchyToggle">
      </px-context-browser-trigger>

      <px-typeahead id="catalog-sub-nav-search"
        :placeholder.prop="'Enter a keyword or search term'"
        @input-value-changed="handleSearch">
      </px-typeahead>
    </div>

    <!--Hierarchy menu-->
    <transition name="custom-classes-transition"
                enterActiveClass="animated slideInLeft"
                leaveActiveClass="animated slideOutLeft">
      <px-tree id="catalog-hierarchy-menu"
        :items.prop="hierarchyItems"
        :selected-route.prop="selectedRoute"
        @px-app-asset-selected="handleSelectedRoute"
        v-show="showHierarchy">
      </px-tree>
    </transition>

    <!--Main content-->
    <div class="catalog-main-content" @click="showHierarchy = false">
      <px-spinner size="100" v-if="isContentLoading"></px-spinner>

      <!--Header for main content (grid of analytic tiles)-->
      <p id="catalog-main-content-header">
        {{ selectedRouteHeader }} Analytics ({{ displayedAnalytics.length }})
      </p>

      <!--Grid of analytic tiles-->
      <div class="catalog-analytics-grid" v-if="!isContentLoading">
        <analytic-tile v-for="analytic in displayedAnalytics" :key="analytic.analytic_id"
          @click.native="handleShowModal(analytic)"
          style="cursor: pointer"
          :name="analytic.catalog_analytic_name"
          :description="analytic.analytic_description"
          :valueProposition="analytic.value_proposition"
          :confidence-level="getAnalyticConfidenceLevel(analytic)"
          :isNew="analytic.isNew">
        </analytic-tile>

        <analytic-tile
          name="Create a New Analytic"
          description="Create your own analytics using the Digital Twin Model Builder"
          @click.native="openModelBuilder">
        </analytic-tile>
      </div>
    </div>

    <!--Modal to display when an analytic tile is selected-->
    <analytic-modal v-if="showModal" @close="showModal = false" :analytic="selectedAnalytic"></analytic-modal>
    <modal-overlay v-if="showModal" @click.native="showModal = false"></modal-overlay>
  </div>
</template>

<script>
import AnalyticTile from '../components/catalog/AnalyticTile.vue'
import AnalyticModal from '../components/catalog/AnalyticModal.vue'
import ModalOverlay from '../components/misc/ModalOverlay.vue'

import {
  getTaxonomyData,
  getUniqueAnalytics,
  getAnalyticStats,
  getHierarchy,
  filterAnalyticsOnNavigationRoute
} from '../js/helpers'

export default {
  name: 'evn-catalog',
  components: {
    'analytic-tile': AnalyticTile,
    'analytic-modal': AnalyticModal,
    'modal-overlay': ModalOverlay
  },
  data () {
    return {
      'isContentLoading': false,
      'showHierarchy': false,
      'selectedRoute': [''],
//      'selectedRouteHeader': null,
      'showModal': false,
      'selectedAnalytic': {},
      'isNewAnalyticCreated': false
    }
  },
  methods: {
    handleSelectedRoute (e) {
      // start spinner
      let self = this
      this.isContentLoading = true

      this._hierarchyRoot = e.detail.route[0]
      this.selectedRoute = e.detail.route

      this.displayedAnalytics = filterAnalyticsOnNavigationRoute(
        this._allUniqueAnalytics[this._hierarchyRoot], this.selectedRoute.slice(1, this.selectedRoute.length))
      // TODO: 'TND' needs to say 'T&D'
      this.selectedRouteHeader = this.selectedRoute[this.selectedRoute.length - 1].toUpperCase()

      // removes spinner
      setTimeout(function () {
        self.isContentLoading = false
      }, 250)
    },
    handleHierarchyToggle () {
      this.showHierarchy = !this.showHierarchy
    },
    handleSearch (e) {
      // TODO: support searching on analytic's description as well
      // start spinner
      let self = this
      this.isContentLoading = true

      // if search query is blank, return all analytics for the currently navigated route
      if (e.detail.value === null || e.detail.value === undefined || e.detail.value === '') {
        this.displayedAnalytics = filterAnalyticsOnNavigationRoute(
          this._allUniqueAnalytics[this._hierarchyRoot], this.selectedRoute.slice(1, this.selectedRoute.length))
        this.selectedRouteHeader = this.selectedRoute[this.selectedRoute.length - 1].toUpperCase()

        // removes spinner
        setTimeout(function () {
          self.isContentLoading = false
        }, 250)
        return
      }

      this.displayedAnalytics = filterAnalyticsOnNavigationRoute(
        this._allUniqueAnalytics[this._hierarchyRoot], this.selectedRoute.slice(1, this.selectedRoute.length))
          .filter(x => x.catalog_analytic_name.toLowerCase().includes(e.detail.value.toLowerCase()))
      this.selectedRouteHeader = '"' + e.detail.value.toUpperCase() + '"'

      // removes spinner
      setTimeout(function () {
        self.isContentLoading = false
      }, 250)
    },
    handleShowModal (analytic) {
      this.showModal = true
      this.selectedAnalytic = analytic
      this.selectedAnalytic.confidenceLevel = this.getAnalyticConfidenceLevel(analytic)
      this.selectedAnalytic.failure_name = this._nercFailures.find(
        x => x.failure_id === parseInt(this.selectedAnalytic.failure_id)).nerc_failure_name
    },
    openModelBuilder () {
      let win = window.open('https://dtwin.run.aws-usw02-dev.ice.predix.io/digitaltwins', '_blank')
      win.focus()
    },
    getAnalyticConfidenceLevel (analytic) {
      let stats = this._analyticStats.find(x => x.catalog_analytic_name === analytic.catalog_analytic_name)
      // TODO: how to properly handle if confidence level is not found?
      return stats ? stats.confidence_level : -1
    }
  },
  beforeMount: function () {
    // can pre-select analytics via specified query parameter
    if (this.$route.query.selectedRoute) {
      let querySelectedRoute = this.$route.query.selectedRoute.split(',')
      this.selectedRoute = querySelectedRoute.map(x => x.toLowerCase())
      this.selectedRouteHeader = querySelectedRoute[querySelectedRoute.length - 1].toUpperCase()
    }

    // load list of NERC failure codes and names
    this._nercFailures = require('../../static/nerc/failures.json')

    // must set hierarchy root to display analytics appropriately
    this._hierarchyRoot = this._hierarchyRoot ? this._hierarchyRoot : this.$route.query.analyticType

    // load all analytics raw and filter out any non-unique entries
    this._rawTaxonomyData = getTaxonomyData()
    this._allUniqueAnalytics = getUniqueAnalytics(this._rawTaxonomyData)

    // load analytics to be rendered as well as hierarchy items for navigation
    // initial display of analytics is either whatever is specified by 'selectedRoute' query parameter or all analytics
    this.displayedAnalytics = this.selectedRouteHeader
      ? filterAnalyticsOnNavigationRoute(this._allUniqueAnalytics[this._hierarchyRoot], this.selectedRoute)
      : this._hierarchyRoot ? this._allUniqueAnalytics[this._hierarchyRoot] : []
    this.hierarchyItems = [
      {id: 'consumption', label: 'CONSUMPTION', children: []},
      {id: 'tnd', label: 'T&D', children: getHierarchy('tnd')},
      {id: 'generation', label: 'GENERATION', children: getHierarchy('generation')}
    ]

    // initialize selected route (if it wasn't set already) which is needed for hierarchy menu and search bar logic
    this.selectedRoute = this.selectedRoute ? this.selectedRoute : [this._hierarchyRoot]
    this.selectedRouteHeader = this.selectedRouteHeader ? this.selectedRouteHeader
      : this.hierarchyItems.find(x => x.id === this._hierarchyRoot).label

    // analytics statistics
    this._analyticStats = getAnalyticStats()
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
  @import '../../static/bower_components/px-colors-design/settings.colors';

  .evn-catalog {
    height: calc(100vh - 80px);

    #catalog-hierarchy-menu {
      color: $gray5;
      background-color: $gray19;

      width: 25%;
      height: auto;
      /*TODO: this needs to adjust if any of the navigation elements are hidden*/
      /*height: calc(100vh - 90px - 32px);*/

      position: absolute;
      z-index: 1;

      /*opacity: 0.95;*/
      box-shadow: 1px 1px 5px 0px $black;
    }
  }
  /*li.px-tree-node {*/
    /*border-top: thin solid red;*/
    /*border-bottom: thin solid red;*/
  /*}*/

  .catalog-sub-nav {
    background-color: $gray16;

    padding: 10px;

    display: flex;

    * {
      /*vertical-align: middle;*/
    }
    #catalog-sub-nav-button:hover {
      /*flex-grow: 0;*/
      background-color: $gray16;
    }
    #catalog-sub-nav-search {
      margin-left: 5px;
      margin-right: 5px;
      flex-grow: 0.05;
    }
  }

  .catalog-main-content {
    width: 100%;
    /*TODO: this needs to adjust if any of the navigation elements are hidden*/
    /*32px for sub-nav height; 20px for sub-nav padding*/
    height: calc(100% - 32px - 20px);

    overflow-y: scroll;

    #catalog-main-content-header {
      /*TODO: make this always line up with margin of grid container of tiles*/
      margin: 1.25rem;
      color: $gray9;
      font-size: 20px;
    }
  }

  .catalog-analytics-grid {
    width: 100%;
    /*TODO: this needs to adjust if any of the navigation elements are hidden or if size of content header changes*/
    height: calc(100% - 34px - 1.25rem);

    /*margin: 0px;*/
    /*margin-left: 15px;*/
    /*margin-right: 15px;*/

    display: grid;
    /*TODO: this column height depends on height of individual tile; make it more automatic*/
    grid-template-columns: repeat(auto-fill, 303px);
    grid-gap: 2.5rem;

    justify-content: center;

    .analytic-tile {
      /*align-self: center;*/
      justify-self: center;
    }
  }

  px-spinner {
    width: 100%;
    height: 50%;

    top: calc(50% - 100px);

    position: absolute;
    z-index: 1;

    text-align: center;
  }
</style>
