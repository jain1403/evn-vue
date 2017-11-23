module.exports = {
  before: function (client, done) {
    let login = client.page.login()

    login
      .navigate()
      .waitForElementPresent('@loginView', 5000, () => {
        login.setValue('@usernameInput', process.env.USERNAME)
        login.setValue('@pwdInput', process.env.PASSWORD)
        login.click('@submitButton')

        client.pause(1000)

        client.page.coverage()
          .navigate()
          .waitForElementPresent('@coverageView', 5000, () => {
            done()
          })
      })
  },

  after: function (client, done) {
    client.end(() => {
      done()
    })
  },

  'Coverage Page Loaded': function (client) {
    let coverage = client.page.coverage()

    coverage.expect.element('@coverageView').to.be.present
  }
}
