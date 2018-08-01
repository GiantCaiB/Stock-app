import React, { Component } from 'react';
import './App.css';
import buildConfig from 'highcharts-config';
const ProfitParser = require('./models/Profit_parser');
var moment = require('moment');
const ReactHighcharts = require('react-highcharts');
var date_rec = [];
var value_rec = [];
var config = {};
var selected_value_rec = [];
var best_profit_value_rec = [];
var display_value_rec = [];
var start_date = null;
var end_date = null;


class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      close_price_data: [],
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
    // use highcharts-config to build the chart
    config = buildConfig()
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
    
    // set X axis with date
    .xAxis({
      categories: date_rec,
      name: 'Date'
    })
    // finally, retrieve the built config
    .get();
  }

  handleSDChange(event) {
    start_date = moment(event.target.value);
  }
  
  handleEDChange(event) {
    end_date = moment(event.target.value);
  }

  handleSubmit(event) {
    // validation 
    if(validateInput(start_date,end_date, event)){
      var start = date_rec.indexOf(moment(start_date).format("YYYY-MM-DD"));
      var end = date_rec.indexOf(moment(end_date).format("YYYY-MM-DD"));
      selected_value_rec = value_rec.slice(start,end+1);
      // use profit algorithm
      best_profit_value_rec = ProfitParser(selected_value_rec);
      var frontNullArr = new Array(value_rec.indexOf(best_profit_value_rec[0]));
      frontNullArr.forEach(element => {
        element = 10;
      });
      var backNullArr = new Array(value_rec.length-frontNullArr.length-best_profit_value_rec.length);
      backNullArr.forEach(element=>{
        element = 10;
      })
      display_value_rec = frontNullArr.concat(best_profit_value_rec,backNullArr);
      // TO DO
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
        <ReactHighcharts config = {config} ></ReactHighcharts>
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

function validateInput(a,b,e)
{
  if(!a.isValid()||!b.isValid()){
    alert("Invalid Input!");
    e.preventDefault();
    return false;
  }else if(a>=b){
    alert("Start date must be ealier than end date");
    e.preventDefault();
    return false;
  }else if(a<moment("2017-06-01")||b>moment("2018-06-01")){
    alert("Please enter the date from \"2017-06-01\" to \"2018-06-01\"!");
    e.preventDefault();
    return false;
  }else{
    return true;
  }
}



export default App;