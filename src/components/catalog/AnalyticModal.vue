<template>
  <div class="analytic-modal">
    <!--Header for modal containing analytic's name and a button to close modal-->
    <div class="modal-header">
      {{ analytic.catalog_analytic_name }}
      <div class="modal-exit-btn" @click="$emit('close')">
        <px-icon icon="px-nav:close"></px-icon>
      </div>
    </div>

    <!--Modal section for description, value prop, confidence level, and similar info about the analytic-->
    <div class="modal-analytic-details-container">
      <!--If confidence level is present and non-negative, render a percent circle; else display a placeholder-->
      <div v-if="analytic.confidenceLevel > -1" class="modal-percent-circle-container">
        <px-percent-circle :val.prop="analytic.confidenceLevel" max="100" thickness="30" :title.prop="'Confidence Level'"></px-percent-circle>
        <p>Confidence Level</p>
      </div>
      <div v-else>
        <p class="modal-analytic-details-confidence-level-placeholder">Confidence Level Not Available</p>
      </div>

      <div class="modal-analytic-details">
        <p>{{ analytic.analytic_description }}</p>

        <p>Value Proposition - {{ analytic.value_proposition }}</p>

        <!--TODO: reorganize the classes-->
        <table>
          <tr>
            <th class="modal-analytic-details-th">Failure Mode</th>
            <th class="modal-analytic-details-th">Coverage</th>
            <th class="modal-analytic-details-th">Documentation</th>
          </tr>

          <tr>
            <td class="modal-analytic-details-sub-th">Failure</td>

            <!--If this analytic has an associated failure mode, display it; else display a placeholder-->
            <td v-if="analytic.failure_name">{{ analytic.failure_name }}</td>
            <td v-else>--</td>

            <td><a :href="analytic.analytic_technical_document_link">Technical Documentation</a></td>
          </tr>

          <tr>
            <td class="modal-analytic-details-sub-th">Failure ID</td>
            <td>{{ analytic.failure_id }}</td>
            <td><a :href="analytic.analytic_marketing_document_link">Marketing Materials</a></td>
          </tr>

          <tr>
            <td class="modal-analytic-details-sub-th">NERC Code</td>
            <td>{{ analytic.nerc_cause_code }}</td>
          </tr>
        </table>

        <!--TODO: is this div around the button needed?-->
        <div>
          <!--TODO: externalize and genericize links to Workbench-->
          <a href="https://dtwin.run.aws-usw02-dev.ice.predix.io/490e9375-4e9f-4ba0-b7ce-c109afcdb9f9/model" target="_blank">
            <button id="modal-btn-workbench" class="modal-btn">Try it out on the Workbench... >></button>
          </a>
        </div>
      </div>
    </div>

    <!--Modal section for sample input and output data for the specific analytic-->
    <div class="modal-analytic-io-container">
      <p class="modal-analytic-io-main-header">How Does It Work?</p>

      <p class="modal-analytic-io-sample-io-header">Sample Input Data</p>

      <px-data-table
        include-all-columns
        :table-data.prop="analyticIOData.sample_output_data">
      </px-data-table>

      <p class="modal-analytic-io-sample-io-header">Sample Output Data</p>

      <px-tabs :selected.prop="selected" @selected-changed="handleSelected">
        <px-tab>Data</px-tab>
        <px-tab>Graph</px-tab>
      </px-tabs>

      <br>
      <br>

      <iron-pages :selected.prop="selected">
        <px-data-table
          include-all-columns
          :table-data.prop="analyticIOData.sample_output_data">
        </px-data-table>

        <px-vis-timeseries v-if="this.timeGraph"
          prevent-resize
          hide-register
          width="650"
          height="400"
          margin='{"top":0,"bottom":60,"left":0,"right":0}'
          :chart-data.prop="analyticIOData.sample_chart_data"
          :series-config.prop="analyticIOData.sample_chart_series_config"
          :x-axis-config.prop="analyticIOData.sample_chart_x_axis">
        </px-vis-timeseries>
        <px-vis-xy-chart v-else
          prevent-resize
          hide-register
          width="650"
          height="400"
          margin='{"top":0,"bottom":60,"left":0,"right":0}'
          :chart-data.prop="analyticIOData.sample_chart_data"
          :series-config.prop="analyticIOData.sample_chart_series_config"
          :x-axis-config.prop="analyticIOData.sample_chart_x_axis">
        </px-vis-xy-chart>
      </iron-pages>

      <br>
      <br>

      <div style="padding: 10px">
        <button id="modal-btn-testbench" class="modal-btn">Show Me an Actual Output >></button>
      </div>
    </div>
  </div>
</template>

<script>
  import {
    getAnalyticIODataModel
  } from '../../js/helpers'

  export default {
    name: 'analytic-modal',
    props: ['analytic', 'analyticConfidenceLevel'],
    data () {
      return {
        selected: 0,
        analyticIOData: {
          // TODO: externalize this
          'sample_input_data': [
            {
              'InputVoltage': '230',
              'WaterContent': '3.65',
              'DielectricStrengthD1816': '62.04',
              'IFTD971': '36.154',
              'Color': '1.5',
              'AcidNumber': '0.016',
              'DissipationFactor25C': '0.3',
              'H2': '12.12',
              'CH4': '6.94',
              'C2H6': '3.22',
              'C2H4': '9.98',
              'C2H2': '37.51',
              'CO': '119.02',
              'CO2': '911.53',
              'CO2/CO': '0.13',
              'PowerDissipationFactor': '0.374',
              'PrioritizedCorrectiveMaintenance': '3.0',
              'Loading_NA': '108',
              'Loading_NB': '4',
              'Loading_NC': '8',
              'Loading_ND': '1',
              'Loading_NE': '0',
              'Age_Alpha': '77',
              'Age_Beta': '0.152',
              'Age_Time': '17',
              'DRF1': '0.97',
              'DRF2': '1.0',
              'DRF3': '1.0',
              'DRF4': '0.97'
            },
            {
              'InputVoltage': '230',
              'WaterContent': '10.95',
              'DielectricStrengthD1816': '65.8',
              'IFTD971': '34.447',
              'Color': '1.5',
              'AcidNumber': '0.01',
              'DissipationFactor25C': '0.3',
              'H2': '39.89',
              'CH4': '12.14',
              'C2H6': '3.54',
              'C2H4': '15.32',
              'C2H2': '50.73',
              'CO': '148.83',
              'CO2': '1015.63',
              'CO2/CO': '0.146',
              'PowerDissipationFactor': '0.374',
              'PrioritizedCorrectiveMaintenance': '3.0',
              'Loading_NA': '260',
              'Loading_NB': '128',
              'Loading_NC': '40',
              'Loading_ND': '4',
              'Loading_NE': '0',
              'Age_Alpha': '77',
              'Age_Beta': '0.152',
              'Age_Time': '18',
              'DRF1': '0.95',
              'DRF2': '1.0',
              'DRF3': '1.0',
              'DRF4': '0.95'
            },
            {
              'InputVoltage': '230',
              'WaterContent': '17.956',
              'DielectricStrengthD1816': '48',
              'IFTD971': '37.1',
              'Color': '1.5',
              'AcidNumber': '0.016',
              'DissipationFactor25C': '0.3',
              'H2': '10.93',
              'CH4': '5.69',
              'C2H6': '2.35',
              'C2H4': '2.58',
              'C2H2': '0.24',
              'CO': '103.36',
              'CO2': '793.82',
              'CO2/CO': '0.13',
              'PowerDissipationFactor': '0.374',
              'PrioritizedCorrectiveMaintenance': '3.0',
              'Loading_NA': '198',
              'Loading_NB': '63',
              'Loading_NC': '20',
              'Loading_ND': '2',
              'Loading_NE': '0',
              'Age_Alpha': '77',
              'Age_Beta': '0.152',
              'Age_Time': '19',
              'DRF1': '0.93',
              'DRF2': '1.0',
              'DRF3': '1.0',
              'DRF4': '0.93'
            },
            {
              'InputVoltage': '230',
              'WaterContent': '6.177',
              'DielectricStrengthD1816': '46.4',
              'IFTD971': '32.06',
              'Color': '2',
              'AcidNumber': '0.024',
              'DissipationFactor25C': '0.3',
              'H2': '10.11',
              'CH4': '5.95',
              'C2H6': '2.42',
              'C2H4': '3.38',
              'C2H2': '0.1',
              'CO': '85.49',
              'CO2': '851.54',
              'CO2/CO': '0.1',
              'PowerDissipationFactor': '0.374',
              'PrioritizedCorrectiveMaintenance': '3.0',
              'Loading_NA': '339',
              'Loading_NB': '29',
              'Loading_NC': '2',
              'Loading_ND': '0',
              'Loading_NE': '0',
              'Age_Alpha': '77',
              'Age_Beta': '0.152',
              'Age_Time': '20',
              'DRF1': '0.90',
              'DRF2': '1.0',
              'DRF3': '1.0',
              'DRF4': '0.90'
            },
            {
              'InputVoltage': '230',
              'WaterContent': '10.854',
              'DielectricStrengthD1816': '54',
              'IFTD971': '36.74',
              'Color': '1.5',
              'AcidNumber': '0.023',
              'DissipationFactor25C': '0.3',
              'H2': '13.87',
              'CH4': '11.43',
              'C2H6': '5.62',
              'C2H4': '9.47',
              'C2H2': '0.2',
              'CO': '162.14',
              'CO2': '1141.42',
              'CO2/CO': '0.14',
              'PowerDissipationFactor': '0.374',
              'PrioritizedCorrectiveMaintenance': '3.0',
              'Loading_NA': '310',
              'Loading_NB': '70',
              'Loading_NC': '23',
              'Loading_ND': '2',
              'Loading_NE': '0',
              'Age_Alpha': '77',
              'Age_Beta': '0.152',
              'Age_Time': '21',
              'DRF1': '0.87',
              'DRF2': '1.0',
              'DRF3': '1.0',
              'DRF4': '0.87'
            },
            {
              'InputVoltage': '230',
              'WaterContent': '7.39',
              'DielectricStrengthD1816': '50.77',
              'IFTD971': '36.87',
              'Color': '2',
              'AcidNumber': '0.014',
              'DissipationFactor25C': '0.3',
              'H2': '12.08',
              'CH4': '8.07',
              'C2H6': '4.39',
              'C2H4': '7.21',
              'C2H2': '2.98',
              'CO': '134.77',
              'CO2': '963.09',
              'CO2/CO': '0.135',
              'PowerDissipationFactor': '0.374',
              'PrioritizedCorrectiveMaintenance': '3.0',
              'Loading_NA': '342',
              'Loading_NB': '18',
              'Loading_NC': '3',
              'Loading_ND': '0',
              'Loading_NE': '1',
              'Age_Alpha': '77',
              'Age_Beta': '0.152',
              'Age_Time': '22',
              'DRF1': '0.85',
              'DRF2': '1.0',
              'DRF3': '1.0',
              'DRF4': '0.85'
            }
          ],
          'sample_output_data': [
            {
              'Age': 0,
              'Health Index Score (%)': 68.3889389646
            },
            {
              'Age': 1,
              'Health Index Score (%)': 66.847618901
            },
            {
              'Age': 2,
              'Health Index Score (%)': 65.4901947615
            },
            {
              'Age': 3,
              'Health Index Score (%)': 63.4928154512
            },
            {
              'Age': 4,
              'Health Index Score (%)': 61.2965093163
            },
            {
              'Age': 5,
              'Health Index Score (%)': 59.9698295408
            }
          ],
          'sample_chart_data': [
            {
              'Age': 0,
              'Health Index Score (%)': 68.3889389646
            },
            {
              'Age': 1,
              'Health Index Score (%)': 66.847618901
            },
            {
              'Age': 2,
              'Health Index Score (%)': 65.4901947615
            },
            {
              'Age': 3,
              'Health Index Score (%)': 63.4928154512
            },
            {
              'Age': 4,
              'Health Index Score (%)': 61.2965093163
            },
            {
              'Age': 5,
              'Health Index Score (%)': 59.9698295408
            }
          ],
          'sample_chart_x_axis': {
            'title': 'Age',
            'labelPosition': 'center',
            'orientation': 'bottom'
          },
          'sample_chart_series_config': {
            'firstSerie': {
              'type': 'line',
              'name': 'Serie1',
              'xAxisUnit': 'Age',
              'yAxisUnit': 'Health Index Score (%)',
              'x': 'Age',
              'y': 'Health Index Score (%)'
            }
          }
        },
        timeGraph: false
      }
    },
    methods: {
      handleSelected (e) {
        this.selected = e.detail.value
      }
    },
    beforeMount: function () {
      let analyticIODataModel = getAnalyticIODataModel(this.analytic.catalog_analytic_name)
      if (analyticIODataModel.sample_io_data) {
        // TODO: This assumes all graphs from json files plot time on the x axis. Graphs that do not plot time use px-vix-xy-chart
        this.analyticIOData = analyticIODataModel.sample_io_data
        this.timeGraph = true
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import '../../../static/bower_components/px-colors-design/settings.colors';

  a {
    text-decoration: none;
    color: $select-default;
  }
  a:hover {
    text-decoration: underline;
  }

  .analytic-modal {
    /*TODO: make size of modal dynamic?*/
    width: 700px;
    height: 820px;
    max-height: 100vh;

    margin: auto;
    background-color: $white;

    position: absolute;
    z-index: 200;

    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
  }

  .modal-header {
    font-size: 20px;
    /*height: 40px;*/
    height: 4.87804878%;
    /*height: calc(40 / 820);*/
    color: $gray13;
    /*padding: 10px;*/
    padding: 1.2195121951219513%;
  }

  .modal-analytic-details-container {
    /*height: 240px;*/
    height: 29.26829268292683%;
    display: flex;
  }

  .modal-percent-circle-container {
    width: 25%;
    float: left;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    p {
      font-size: 15px;
      color: $gray8;
      padding-bottom: 30px;
    }

    px-percent-circle {
      height: 100%;
    }
  }

  .modal-analytic-details-confidence-level-placeholder {
    text-align: center;
    padding-top: 50px;
    color: $gray8;
  }

  .modal-analytic-details {
    width: 75%;
    float: left;
    padding: 10px;
    overflow: auto;
    display: flex;
    justify-content: space-between;
    flex-direction: column;

    p {
      color: $gray8;
      text-align: left;
      font-size: 12px;
    }

    td {
      font-size: 12px;
      color: $gray8;
    }
  }

  .modal-analytic-details-th {
    font-size: 15px;
    color: $gray11;
    font-weight: normal;
    text-align: left;
    padding-right: 10px;
  }

  .modal-analytic-details-sub-th {
    color: $gray12;
    font-size: 12px;
  }

  .modal-analytic-io-container {
    background-color: $gray16;
    /*height: 500px;*/
    height: 60.97560975609756%;
    padding: 10px;
    display:flex;
    flex-direction: column;
    overflow: auto;
  }

  .modal-analytic-io-main-header {
    font-size: 20px;
    color: $gray9;
  }

  .modal-analytic-io-sample-io-header {
    font-size: 15px;
    color: $gray9;
  }

  .modal-exit-btn {
    float: right;
    cursor: pointer;
  }

  .modal-btn {
    background-color: $primary-default;
    border: none;
    color: $white;
    padding: 5px 20px;
    text-align: center;
    text-decoration: none;
    font-size: 14px;
    cursor: pointer;
    float: right;
  }
</style>
