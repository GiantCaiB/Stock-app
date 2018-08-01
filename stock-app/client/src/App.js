import React, { Component } from 'react';
import './App.css';
import buildConfig from 'highcharts-config';
const ProfitParser = require('./models/Profit_parser');
const InputValidation = require('./models/Input_validation');
const moment = require('moment');
const ReactHighcharts = require('react-highcharts');
var date_rec = [];
var value_rec = [];
var selected_value_rec = [];
var best_profit_value_rec = [];
var display_value_rec = [];
var start_date = null;
var end_date = null;
// use highcharts-config to build the chart
var config = buildConfig()
// use shorthand methods to set properties on the object
.title('text', 'NASDAQ: QCOM')
.colors([
  'blue',
  'red'
])
// then add types of charts
.addType('spline', {
  data: value_rec,
  name: 'Close Price'
})
.addType('spline', {
  data: display_value_rec,
  name: 'Best Profit'
})
// set X axis with date
.xAxis({
  categories: date_rec,
  name: 'Date'
})
// finally, retrieve the built config
.get(); 


class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      close_price_data: [],
      show_result: false,
    };
    this.handleSDChange = this.handleSDChange.bind(this);
    this.handleEDChange = this.handleEDChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    // get data from the backend router
    fetch('/data')
      .then(res => res.json())
      .then(close_price_data => this.setState({ close_price_data }));
  }

  handleSDChange(event) {
    start_date = moment(event.target.value);
  }
  
  handleEDChange(event) {
    end_date = moment(event.target.value);
  }

  handleSubmit(event) {
    // validation 
    if(InputValidation(start_date,end_date, event)){
      // clean last query graph
      let chart = this.refs.chart.getChart();
      for(let i=0; i<value_rec.length;i++){
        chart.series[1].removePoint(i);
      }
      display_value_rec.length=0;
      // get a date array for the user valid input
      var input_start = date_rec.indexOf(moment(start_date).format("YYYY-MM-DD"));
      var input_end = date_rec.indexOf(moment(end_date).format("YYYY-MM-DD"));
      selected_value_rec = value_rec.slice(input_start,input_end+1);
      // use profit algorithm
      best_profit_value_rec = ProfitParser(selected_value_rec);
      // generate value data for the new graph
      var bpvr_start = value_rec.indexOf(best_profit_value_rec[0],input_start);
      var front_null_arr = new Array(bpvr_start);
      front_null_arr.forEach(element=>{
        element = null;
      });
      display_value_rec = front_null_arr.concat(best_profit_value_rec);
      // Select the chart and draw a new graph 
      for(let i=0; i<value_rec.length;i++){
        chart.series[1].addPoint({x:i, y :display_value_rec[i]},false);
      }
      chart.redraw();
      event.preventDefault();
    }
  }

  render() {
    // empty the arrays
    date_rec.length = 0;
    value_rec.length = 0;
    // load data from state to these 2 arrays
    this.state.close_price_data.map((stock) =>{
      date_rec.push(stock.date);
      value_rec.push(stock.value);
    });

    return (
      /*
      <h1>Close Price History</h1>
        {this.state.close_price_data.map(stock =>
          <div key={stock.date}>{stock.date} : {stock.value}</div>
        )}
      */
      <div className="App" >
        <ReactHighcharts config = {config} ref="chart"></ReactHighcharts>
        <form onSubmit={this.handleSubmit}>
          <label>
            Start Date(YYYY-MM-DD):
            <input type="text"  onChange={this.handleSDChange} />
          </label>
          <br />
          <label>
            End Date(YYYY-MM-DD):
            <input type="text"  onChange={this.handleEDChange} />
          </label>
          <br />
          <input type="submit" value="Submit" />
        </form>
        
      </div>
    );
  }
}

export default App;