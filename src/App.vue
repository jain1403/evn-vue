<template>
  <div id="app">
    <!-- Import Animate.css -->
    <link href="https://cdn.jsdelivr.net/npm/animate.css@3.5.1" rel="stylesheet" type="text/css">

    <div class="app-header">
      <px-branding-bar :application-title.prop="'Electricity Value Network'"></px-branding-bar>

      <!--TODO: make a Vue component of this-->
      <div class="app-nav">
        <h1 class="app-nav-burger-icon" v-if="isUserAuthenticated" @click="handleBurgerClick">≡</h1>

        <span class="app-nav-title">Analytics Catalog</span>

        <px-login v-if="isUserAuthenticated" do-not-fetch-user-info-on-load :userName.prop="userFullName"></px-login>
      </div>

      <transition name="custom-classes-transition"
                  enterActiveClass="animated slideInDown"
                  leaveActiveClass="animated slideOutUp">
        <px-tree class="app-nav-menu"
          :items.prop="appNavItems" v-show="showAppNavMenu" @px-app-asset-selected="handleNavSelect">
        </px-tree>
      </transition>
    </div>

    <router-view
      @click.native="showAppNavMenu = showAppNavMenu ? false : showAppNavMenu"
      @userAuthenticated="handleUserLogin">
    </router-view>
  </div>
</template>

<script>
import { hasCredentials, validateToken } from './js/auth'
export default {
  name: 'app',
  data () {
    return {
      'isUserAuthenticated': false,
      'showAppNavMenu': false,
      'appNavSelectedRoute': this.$route.path.slice(1, this.$route.path.length).split('/'),
      'appNavItems': [
        {id: 'catalog', label: 'Catalog', path: '/catalog'},
        {id: 'coverage', label: 'Coverage', path: '/coverage'},
        {id: 'testbench', label: 'Test Bench'},
        {id: 'settings', label: 'Settings'}
      ],
      'shouldFetchUserInfo': false,
      'userFullName': 'Sign In'
    }
  },
  methods: {
    handleNavSelect (e) {
      if (this.isUserAuthenticated) {
        this.showAppNavMenu = !this.showAppNavMenu
        this.appNavSelectedRoute = e.detail.route
        // only open page if a path is specified (i.e. if that respective page is actually fleshed out)
        if (this.appNavItems.find(x => x.id.toLowerCase() === this.appNavSelectedRoute[0]).path) {
          this.$router.push({path: this.appNavSelectedRoute.reduce((prev, next) => prev + '/' + next, '')})
        }
      }
    },
    handleBurgerClick () {
      if (this.isUserAuthenticated) {
        this.showAppNavMenu = !this.showAppNavMenu
      }
    },
    handleUserLogin () {
      let userDetails = JSON.parse(localStorage.getItem('userDetails'))
      this.userFullName = userDetails.firstName + ' ' + userDetails.lastName
      this.isUserAuthenticated = true
    }
  },
  beforeMount: async function () {
    // first check if authentication info is even present at all
    if (!hasCredentials(localStorage)) {
      this.$router.push({path: '/login'})
      return
    }
    // validate token in user's info
    try {
      // TODO: validate user info parsed from localStorage
      let userDetails = JSON.parse(localStorage.getItem('userDetails'))
      let response = await validateToken(userDetails.refreshToken)
      if (!response) {
        console.error('Invalid credentials')
        localStorage.clear()
        this.$router.push({path: '/login'})
        return
      }
      // user is authenticated, so display appropriate user info
      this.userFullName = userDetails.firstName + ' ' + userDetails.lastName
      this.isUserAuthenticated = true
    } catch (e) {
      console.error('Error validating user token')
      localStorage.clear()
      this.$router.push({path: '/login'})
    }
  }
}
</script>

<style lang="scss" scoped>
  @import '../static/bower_components/px-colors-design/settings.colors';
  #app {
    height: 100vh;
  }
  .app-header {
    width: 100%;
  }
  px-branding-bar {
    color: $gray5;
    background-color: $gray16;
    position: relative;
    z-index: 99;
  }
  .app-nav {
    color: $gray5;
    background-color: $gray19;
    width: 100%;
    height: 50px;
    display: flex;
    align-items: center;
    position: relative;
    z-index: 3;
  }
  .app-nav * {
    flex: 1;
  }
  .app-nav-burger-icon {
    flex-grow: 0;
    padding-left: 1%;
    padding-right: 1%;
    font-weight: 100;
    border-right: thin solid $gray16;
    cursor: pointer;
  }
  .app-nav-title {
    padding-left: 1%;
    font-size: 1.5em;
  }
  .app-nav px-login {
    flex-grow: 0;
    padding-right: 1%;
  }
  px-tree {
    color: $gray5;
    background-color: $gray19;
    width: 10%;
    position: absolute;
    z-index: 2;
    box-shadow: 1px 1px 5px 0px $black;
  }
</style>