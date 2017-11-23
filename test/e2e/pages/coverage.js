module.exports = {
  url: function () {
    return this.api.globals.devServerURL + '/coverage'
  },
  elements: {
    coverageView: {
      selector: '.coverage-container'
    }
  }
}
