var moment = require('moment');
module.exports = function(a,b,e){
    // a and b have to be date format
  if(!a.isValid()||!b.isValid()){
    alert("Invalid Input!");
    e.preventDefault();
    return false;
  }// a has to be ealier than b
  else if(a>=b){
    alert("Start date must be ealier than end date");
    e.preventDefault();
    return false;
  }// a and b must be in this range
  else if(a<moment("2017-06-01")||b>moment("2018-06-01")){
    alert("Please enter the date from \"2017-06-01\" to \"2018-06-01\"!");
    e.preventDefault();
    return false;
  }else{
    return true;
  }
}