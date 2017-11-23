module.exports = {
  url: function () {
    return this.api.globals.devServerURL + '/login'
  },
  elements: {
    loginView: {
      selector: '.evn-catalog-login'
    },
    usernameInput: {
      selector: '#login-username-input'
    },
    pwdInput: {
      selector: '#login-pwd-input'
    },
    submitButton: {
      selector: '#login-button'
    },
    landingView: {
      selector: '.landing-page'
    }
  }
}
