// TODO: this must always be updated if hierarchy definition is modified!
const hierarchyKeys = ['fuel_name', 'asset_name', 'system_name', 'subsystem_name']

/**
 * Returns a list of analytic objects. (i.e. a taxonomy data set)
 *
 */
export function getTaxonomyData () {
  // TODO: replace this with AWS labmda call and delete this file from static directory
  return {
    consumption: [],
    tnd: require('../../static/taxonomy/tnd-taxonomy.json'),
    generation: require('../../static/taxonomy/generation-taxonomy.json')
  }
}

/**
 * Returns a list of unique analytic names from an input taxonomy data set.
 *
 * @param taxonomyData
 */
export function getUniqueAnalytics (taxonomyData) {
  // NOTE: this also filters out any analytics with null names
  let newTaxonomyData = {}
  newTaxonomyData.consumption = mapObjectsByUniqueProperty(taxonomyData.consumption, 'catalog_analytic_name')
  newTaxonomyData.tnd = mapObjectsByUniqueProperty(taxonomyData.tnd, 'catalog_analytic_name')
  // newTaxonomyData.generation = mapObjectsByUniqueProperty(taxonomyData.generation, 'catalog_analytic_name')
  // NOTE: hardcoded Generation analytics have already been filtered to contain only unique analytics
  newTaxonomyData.generation = taxonomyData.generation
  return newTaxonomyData
}

/**
 * Returns a mapping of catalog analytics to their various usage statistics such as confidence level.
 *
 */
export function getAnalyticStats () {
  let tndStats = require('../../static/analytic-stats/tnd-stats.json')
  let genStats = require('../../static/analytic-stats/generation-stats.json')
  return tndStats.concat(genStats)
}

/**
 * Returns necessary data to populate a specific analytic's sample i/o data in the modal view.
 *
 */
export function getAnalyticIODataModel (analyticName) {
  let tndIODataModels = require('../../static/analytic-stats/tnd-io-data-models.json')
  let generationIODataModels = require('../../static/analytic-stats/generation-io-data-models.json')
  let allAnalyticDataModels = tndIODataModels.concat(generationIODataModels)
  let analyticDataModelObject = allAnalyticDataModels.find(x => x.catalog_analytic_name.toLowerCase() === analyticName.toLowerCase())
  return analyticDataModelObject
}

/**
 * Returns data for overall coverage percentage per fuel source (Gas, Coal, Nuclear, etc)
 */
export async function getCoverageFuelData () {
  try {
    let response = await fetch(new Request('https://w3yrpha24g.execute-api.us-west-2.amazonaws.com/dev/GetOverallCoverage'))
    if (response.status !== 200) {
      throw new Error('Unexpected status (status != 200) when obtaining coverage fuel data for coverage page: ' + response.status)
    }

    let bodyJSON = await response.json()
    return bodyJSON.body
  } catch (e) {
    console.error('Error fetching coverage fuel data :\n' + e)
  }
}

/**
 * Returns data to generate coverage pie chart for selected fuel id (Gas, Coal, Nuclear, etc)
 */
export async function getCoveragePieChartData () {
  try {
    // TODO: URL is hardcoded to fetch Gas Analytics data. Modify so query works for Coal, Nuclear, etc.
    let response = await fetch(new Request('https://w3yrpha24g.execute-api.us-west-2.amazonaws.com/dev/AnalyticsDashBoardData?fuelId=2&mode=NERCCauseCode'))
    if (response.status !== 200) {
      throw new Error('Unexpected status (status != 200) when obtaining pie chart data for coverage page: ' + response.status)
    }

    let bodyJSON = await response.json()
    var pieChartData = bodyJSON.body.pieChart
    var sysData = bodyJSON.body.sysData
    var chartData = pieChartData.map(function (slice) {
      let sliceDetails = sysData.filter(x => x.assetName === slice.assetName).map(function (sysDataObj) {
        return {
          title: sysDataObj.system_name,
          value: sysDataObj.highCount
        }
      })
      return {
        percentage: slice.overallPer,
        x: Number(slice.highCount),
        y: slice.assetName,
        sliceDetails: sliceDetails
      }
    })
    return chartData
  } catch (e) {
    console.error('Error fetching coverage pie chart data  :\n' + e)
  }
}

/**
 * Returns the hierarchy for the input type.
 *
 */
export function getHierarchy (analyticType) {
  return require('../../static/hierarchy/' + analyticType + '-hierarchy.json')
}

/**
 * Constructs the hierarchy for each fuel source from an input taxonomy data
 * set in the format used by various Predix components.
 *
 * @param taxonomyData
 * @returns {Array}
 */
export function parseTaxonomyHierarchy (taxonomyData) {
  let parsedHierarchy = []

  let uniqueFuelSourceNames = taxonomyData.filter(x => x.fuel_name !== null).map(x => x.fuel_name);

  // TODO: add comments explaining what's going on since it's confusing
  [...new Set(uniqueFuelSourceNames)].forEach(fuelSourceName => {
    let fuelSourceNode = {id: fuelSourceName.toLowerCase(), label: fuelSourceName.toUpperCase(), children: []}
    parsedHierarchy.push(fuelSourceNode)

    let uniqueAssetNames = taxonomyData.filter(
      x => x.fuel_name === fuelSourceName)
      .map(x => x.asset_name);

    // For each unique asset name for this current fuel source, add as children
    [...new Set(uniqueAssetNames)].forEach(assetName => {
      fuelSourceNode.children.push({id: assetName.toLowerCase(), label: assetName.toUpperCase(), children: []})

      let uniqueSystemNames = taxonomyData.filter(
        x => x.fuel_name === fuelSourceName &&
          x.asset_name === assetName)
        .map(x => x.system_name);

      [...new Set(uniqueSystemNames)].forEach(systemName => {
        let assetNode = fuelSourceNode.children.find(child => child.id === assetName.toLowerCase())
        assetNode.children.push({id: systemName.toLowerCase(), label: systemName.toUpperCase(), children: []})

        let uniqueSubSystemNames = taxonomyData.filter(
          x => x.fuel_name === fuelSourceName &&
            x.asset_name === assetName &&
            x.system_name === systemName)
          .map(x => x.subsystem_name);

        [...new Set(uniqueSubSystemNames)].forEach(subSystemName => {
          let systemNode = assetNode.children.find(child => child.id === systemName.toLowerCase())
          systemNode.children.push({id: subSystemName.toLowerCase(), label: subSystemName.toUpperCase()})
        })
      })
    })
  })

  return parsedHierarchy
}

/**
 * Returns all analytics under the hierarchy defined by the input "route" through the hierarchy.
 *
 * @param taxonomyData
 * @param navRoute
 */
export function filterAnalyticsOnNavigationRoute (taxonomyData, navRoute) {
  // TODO: simplify and add comments
  // navigation route may be empty since it should be passed starting from fuel
  // source type which is not always selected
  if (!navRoute.length) {
    return taxonomyData
    // return mapObjectsByUniqueProperty(taxonomyData, 'catalog_analytic_name')
  }

  let sliceHierarchyKeys = hierarchyKeys.slice(0, navRoute.length)
  let temp = taxonomyData.filter(analytic => {
    let predicate = true
    sliceHierarchyKeys.forEach((key, i) => {
      predicate = predicate &&
        analytic[hierarchyKeys[i]] !== null &&
        analytic[hierarchyKeys[i]].toLowerCase() === navRoute[i].toLowerCase()
    })
    return predicate
  })

  return temp
  // return mapObjectsByUniqueProperty(temp, 'catalog_analytic_name')
}

function mapObjectsByUniqueProperty (data, property) {
  let uniqueFilteredIds = {}
  return data.filter(x => {
    if (!x[property] || uniqueFilteredIds[x[property]]) {
      return false
    }
    uniqueFilteredIds[x[property]] = true
    return true
  })
}
