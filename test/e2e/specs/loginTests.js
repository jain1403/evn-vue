// For authoring Nightwatch tests, see
// http://nightwatchjs.org/guide#usage

module.exports = {
  before: function (client, done) {
    // navigate to login page before test suite runs
    client.page.login()
      .navigate()
      .waitForElementPresent('@loginView', 5000, () => {
        done()
      })
  },

  after: function (client, done) {
    client.end(() => {
      done()
    })
  },

  // test cases
  'Login Page Is Loaded': function (client) {
    let login = client.page.login()

    login.expect.element('@loginView').to.be.present

    // navigation and user info components should not be rendered on login screen
    login.expect.element('.app-nav-burger-icon').to.not.be.present
    login.expect.element('.app-nav > px-login').to.not.be.present

    // login form components should render
    login.expect.element('@usernameInput').to.be.present
    login.expect.element('@pwdInput').to.be.present
    login.expect.element('@submitButton').to.be.present
  },

  'Login Form Initializes With No Validation Error': function (client) {
    let login = client.page.login()

    login.expect.element('@usernameInput').to.be.present
    login.expect.element('@usernameInput').to.have.attribute('class').to.not.contain('validation-error')

    login.expect.element('@pwdInput').to.be.present
    login.expect.element('@pwdInput').to.have.attribute('class').to.not.contain('validation-error')
  },

  'Login Form Presents Validation Error On Failed Authentication': function (client) {
    let login = client.page.login()

    // submit without setting any form data should always fail authentication
    login.click('@submitButton', () => {
      // briefly wait for request to authenticate to complete
      client.pause(1000)

      // input elements should present with Predix design 'validation-error' class
      login.expect.element('@usernameInput').to.have.attribute('class').to.contain('validation-error')
      login.expect.element('@pwdInput').to.have.attribute('class').to.contain('validation-error')
    })
  },

  'Login Form Redirects On Successful Authentication': function (client) {
    let login = client.page.login()

    // submit with valid credentials
    login.setValue('@usernameInput', process.env.USERNAME)
    login.setValue('@pwdInput', process.env.PASSWORD)
    login.click('@submitButton', () => {
      // should redirect to and load catalog landing page
      client
        .waitForElementPresent('.landing-page', 1000)
        .assert.elementPresent('.app-nav-burger-icon')
        .assert.elementPresent('.app-nav > px-login')
    })
  }
}
