module.exports = {
  url: function () {
    return this.api.globals.devServerURL
  },
  elements: {
    landingView: {
      selector: '.landing-page'
    }
  },
  sections: {
    appNav: {
      selector: '.app-nav',
      elements: {
        appNavBurger: {
          selector: '.app-nav-burger-icon'
        },
        appNavUserInfo: {
          selector: '.app-nav > px-login'
        },
        appNavMenu: {
          selector: '.app-nav-menu'
        }
      }
    }
  }
}
