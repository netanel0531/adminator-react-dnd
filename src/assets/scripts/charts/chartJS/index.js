import React from 'react';
import ReactDOM from 'react-dom';
import ReactGridLayout from 'react-grid-layout';
import ElasticSearch from 'elasticsearch';
import * as _ from 'lodash';

import Chart from 'chart.js';
import { COLORS } from '../../constants/colors';
import Axios from 'axios';


export default (function () {
  // ------------------------------------------------------
  // @Line Charts
  // ------------------------------------------------------

  const lineChartBox = document.getElementById('line-chart');

  if (lineChartBox) {
    const lineCtx = lineChartBox.getContext('2d');
    lineChartBox.height = 80;

    new Chart(lineCtx, {
      type: 'line',
      data: {
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
        datasets: [{
          label                : 'Series A',
          backgroundColor      : 'rgba(237, 231, 246, 0.5)',
          borderColor          : COLORS['deep-purple-500'],
          pointBackgroundColor : COLORS['deep-purple-700'],
          borderWidth          : 2,
          data                 : [60, 50, 70, 60, 50, 70, 60],
        }, {
          label                : 'Series B',
          backgroundColor      : 'rgba(232, 245, 233, 0.5)',
          borderColor          : COLORS['blue-500'],
          pointBackgroundColor : COLORS['blue-700'],
          borderWidth          : 2,
          data                 : [70, 75, 85, 70, 75, 85, 70],
        }],
      },

      options: {
        legend: {
          display: false,
        },
      },

    });
  }

  // ------------------------------------------------------
  // @Bar Charts
  // ------------------------------------------------------

  const barChartBox = document.getElementById('bar-chart');

  if (barChartBox) {
    const barCtx = barChartBox.getContext('2d');

    new Chart(barCtx, {
      type: 'bar',
      data: {
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
        datasets: [{
          label           : 'Dataset 1',
          backgroundColor : COLORS['deep-purple-500'],
          borderColor     : COLORS['deep-purple-800'],
          borderWidth     : 1,
          data            : [10, 50, 20, 40, 60, 30, 70],
        }, {
          label           : 'Dataset 2',
          backgroundColor : COLORS['light-blue-500'],
          borderColor     : COLORS['light-blue-800'],
          borderWidth     : 1,
          data            : [10, 50, 20, 40, 60, 30, 70],
        }],
      },

      options: {
        responsive: true,
        legend: {
          position: 'bottom',
        },
      },
    });
  }

  // ------------------------------------------------------
  // @Area Charts
  // ------------------------------------------------------

  const areaChartBox = document.getElementById('area-chart');

  if (areaChartBox) {
    const areaCtx = areaChartBox.getContext('2d');

    new Chart(areaCtx, {
      type: 'line',
      data: {
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
        datasets: [{
          backgroundColor : 'rgba(3, 169, 244, 0.5)',
          borderColor     : COLORS['light-blue-800'],
          data            : [10, 50, 20, 40, 60, 30, 70],
          label           : 'Dataset',
          fill            : 'start',
        }],
      },
    });
  }

  // ------------------------------------------------------
  // @Scatter Charts
  // ------------------------------------------------------

  const scatterChartBox = document.getElementById('scatter-chart');

  if (scatterChartBox) {
    const scatterCtx = scatterChartBox.getContext('2d');

    Chart.Scatter(scatterCtx, {
      data: {
        datasets: [{
          label           : 'My First dataset',
          borderColor     : COLORS['red-500'],
          backgroundColor : COLORS['red-500'],
          data: [
            { x: 10, y: 20 },
            { x: 30, y: 40 },
            { x: 50, y: 60 },
            { x: 70, y: 80 },
            { x: 90, y: 100 },
            { x: 110, y: 120 },
            { x: 130, y: 140 },
          ],
        }, {
          label           : 'My Second dataset',
          borderColor     : COLORS['green-500'],
          backgroundColor : COLORS['green-500'],
          data: [
            { x: 150, y: 160 },
            { x: 170, y: 180 },
            { x: 190, y: 200 },
            { x: 210, y: 220 },
            { x: 230, y: 240 },
            { x: 250, y: 260 },
            { x: 270, y: 280 },
          ],
        }],
      },
    });
  }

}()
)

class ReactPie extends React.Component {

  componentDidMount() {

  // ------------------------------------------------------
    // @My React Pie Chart
    // ------------------------------------------------------
    var randomScalingFactor = function() {
      return Math.round(Math.random() * 100);
    };
    var myData = [];
    var getData = function() {
      var client = new ElasticSearch.Client({
        host: 'localhost:9200',
        log: 'trace'
      });
      client.search({
        body: {
          query: {
            "bool": {
              "must": [
                {
                  "match_all": {}
                },
                {
                  "query_string": {
                    "query": "exec_1",
                    "analyze_wildcard": true
                  }
                },
                {
                  "range": {
                    "executionTimestamp": {
                      "gte": 1514757600000,
                      "lte": 1546293599999,
                      "format": "epoch_millis"
                    }
                  }
                }
              ],
              "must_not": []
            }
          },
          "size": 0,
          "_source": {
            "excludes": []
          },
          "aggs": {
            "2": {
              "terms": {
                "field": "status",
                "size": 5,
                "order": {
                  "1": "desc"
                }
              },
              "aggs": {
                "1": {
                  "cardinality": {
                    "field": "uid"
                  }
                }
              }
            }
          },
          "version": true,

        }
      }).then(function (resp) {
        myData = resp.aggregations["2"]["buckets"];
        console.log(myData);
        if (myReactPieContainer) {
          let pieCtx = myReactPieContainer.getContext('2d');
          new Chart(pieCtx, {
            type: 'pie',
            data: {
              datasets: [{
                data: [
                  myData[0]['doc_count'],
                  myData[1]['doc_count'],
                  myData[2]['doc_count'],
                  myData[3]['doc_count']
                ],
                backgroundColor: [
                  'rgb(0,128,0)',
                  'rgb(255, 0, 0)',
                  'rgb(255, 165, 0)',
                  'rgb(255, 255, 0)',
                ]
              }],
              labels: [
                myData[0]['key'],
                myData[1]['key'],
                myData[2]['key'],
                myData[3]['key']
              ]
            },
            options: {
              responsive: true
            }
      
          });
  
        } else {
          console.log('No React pie container');
        }
      }, function (err) {
          console.trace(err.message);
      });
      
      // Axios.get("http://localhost:9200/_search?source={%20%22query%22:%20{%20%22bool%22:%20{%20%22must%22:%20[%20{%20%22match_all%22:%20{}%20},%20{%20%22match_all%22:%20{}%20},%20{%20%22range%22:%20{%20%22executionTimestamp%22:%20{%20%22gte%22:%201514757600000,%20%22lte%22:%201546293599999,%20%22format%22:%20%22epoch_millis%22%20}%20}%20}%20],%20%22must_not%22:%20[]%20}%20},%20%22size%22:%200,%20%22_source%22:%20{%20%22excludes%22:%20[]%20},%20%22aggs%22:%20{%20%222%22:%20{%20%22terms%22:%20{%20%22field%22:%20%22status%22,%20%22size%22:%205,%20%22order%22:%20{%20%221%22:%20%22desc%22%20}%20},%20%22aggs%22:%20{%20%221%22:%20{%20%22cardinality%22:%20{%20%22field%22:%20%22uid%22%20}%20}%20}%20}%20},%20%22version%22:%20true,%20%22highlight%22:%20{%20%22pre_tags%22:%20[%20%22@kibana-highlighted-field@%22%20],%20%22post_tags%22:%20[%20%22@/kibana-highlighted-field@%22%20],%20%22fields%22:%20{%20%22*%22:%20{%20%22highlight_query%22:%20{%20%22bool%22:%20{%20%22must%22:%20[%20{%20%22match_all%22:%20{}%20},%20{%20%22match_all%22:%20{}%20},%20{%20%22range%22:%20{%20%22executionTimestamp%22:%20{%20%22gte%22:%201514757600000,%20%22lte%22:%201546293599999,%20%22format%22:%20%22epoch_millis%22%20}%20}%20}%20],%20%22must_not%22:%20[]%20}%20}%20}%20},%20%22fragment_size%22:%202147483647%20}%20}", {crossDomain:true} )
      // .then(function (response) {
      //   console.log(response);
      // })
      // .catch(function (error) {
      //   console.log(error);
      // });

    }

    let myReactPieContainer = document.getElementById('react_pie_'+this.props.id);
    if (this.props.id === '1') {
      getData();
    } else {
      if (myReactPieContainer) {
        let pieCtx = myReactPieContainer.getContext('2d');
    
        new Chart(pieCtx, {
          type: 'pie',
          data: {
            datasets: [{
              data: [
                randomScalingFactor(),
                randomScalingFactor(),
                randomScalingFactor(),
                randomScalingFactor(),
                randomScalingFactor(),
              ],
              backgroundColor: [
                'rgb(255, 99, 132)',
                'rgb(255, 159, 64)',
                'rgb(255, 205, 86)',
                'rgb(75, 192, 192)',
                'rgb(54, 162, 235)',
              ],
              label: 'Dataset 1'
            }],
            labels: [
              'Red',
              'Orange',
              'Yellow',
              'Green',
              'Blue'
            ]
          },
          options: {
            responsive: true
          }
    
        });

      } else {
        console.log('No React pie container');
      }
    
    }
  }
  
  
  render() {
    return (
      <div>
        <h6 className="c-grey-900">React Pie Chart</h6>
        <canvas id={"react_pie_"+this.props.id}></canvas>
      </div>);
  }
}

class MyFirstGrid extends React.Component {
  constructor(props) {
    //TODO: create state with some items/widgets.
    //TODO: create a function that generate a widget and append it to button.
    //this.state.items = {LIST OF ITEMS}
    super(props);

    this.state = {
      items: [0, 1, 2].map(function(i, key, list) {
        return {
          i: i.toString(),
          x: i * 2,
          y: 0,
          w: 3,
          h: 5,
        };
      }),
      newCounter: 0
    };
    this.onAddItem = this.onAddItem.bind(this);
  }

  onAddItem() {
    this.setState({
      // Add a new item. It must have a unique key!
      items: this.state.items.concat({
        i: "n" + this.state.newCounter,
        x: (this.state.items.length * 3) % (this.state.cols || 12),
        y: Infinity, // puts it at the bottom
        w: 3,
        h: 5
      }),
      // Increment the counter to ensure key is always unique.
      newCounter: this.state.newCounter + 1
    });
  }
  onRemoveItem(i) {
    console.log("removing", i);
    this.setState({ items: _.reject(this.state.items, { i: i }) });
  }
  createElement(el) {
    const removeStyle = {
      position: "absolute",
      right: "2px",
      top: 0,
      cursor: "pointer"
    };
    const i = el.i;
    return (
      <div key={i} data-grid={el}>
        <ReactPie id={i}/>
        <span
          className="remove"
          style={removeStyle}
          onClick={this.onRemoveItem.bind(this, i)}
        >
          x
        </span>
      </div>
    );
  }
  render() {
    //var height = 10;
    // layout is an array of objects, see the demo for more complete usage
    // var layout = [
    //   {i: 'a', x: 0, y: 0, w: height-3, h: height, minH: 10, minW: 5},
    //   {i: 'b', x: 1, y: 0, w: 3, h: 5, minW: 2, maxW: 4},
    //   {i: 'c', x: 4, y: 0, w: 5, h: 5, minH: 5, minW: 5},
    // ];
    return (
      <div>
        <div> 
          <button onClick={this.onAddItem}>Add Random Chart</button>
          <button onClick={this.getData}>Add exec_1 Chart</button>
        </div>
      

      <ReactGridLayout className="layout" rowHeight={30} width={1200}>
        {/*layout={layout}
          /* <div key="a">
          <ReactPie id="1"/>
        </div>
        <div key="b">
          <ReactPie id="2"/>
        </div>
        <div key="c">
          <ReactPie id="3"/>
        </div> */}
        {_.map(this.state.items, el => this.createElement(el))}
      </ReactGridLayout>
      </div>
    )
  }
} ;

export class App extends React.Component{
  render() {
    return (
    <div>
      <MyFirstGrid />
    </div>);
  }
}
