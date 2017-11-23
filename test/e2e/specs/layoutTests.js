module.exports = {
  before: function (client, done) {
    let login = client.page.login()

    login
      .navigate()
      .waitForElementPresent('@loginView', 5000, () => {
        login.setValue('@usernameInput', process.env.USERNAME)
        login.setValue('@pwdInput', process.env.PASSWORD)
        login.click('@submitButton')

        login.waitForElementPresent('@landingView', 5000, () => {
          done()
        })
      })
  },

  after: function (client, done) {
    client.end(() => {
      done()
    })
  },

  'App Nav Loaded': function (client) {
    let landing = client.page.landing()

    landing.expect.section('@appNav').to.be.present

    let appNavSection = landing.section.appNav
    appNavSection.expect.element('@appNavBurger').to.be.present
    appNavSection.expect.element('@appNavUserInfo').to.be.present

    appNavSection.expect.element('@appNavUserInfo').to.have.attribute('userName').to.equal('EVN User')
  },

  'App Nav Loads Links Correctly': function (client) {
    let landing = client.page.landing()

    landing.expect.section('@appNav').to.be.present

    let appNavSection = landing.section.appNav
    appNavSection.expect.element('@appNavMenu').to.be.present
  }
}
