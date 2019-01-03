import React, { Component } from 'react';
import './App.css';
import { resolve } from 'path';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      posts: [],
      postCount: 0,
      shiftcount: 0,
      previousMonth: {
        posts: [],
        postCount: 0,
        shiftcount: 0
      },
      searchMonth: {
        posts: [],
        postCount: 0,
        shiftcount:0
      }
    }
  }
  

  componentWillMount() {
    // current month
    var date = new Date();
    var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 1);

    firstDay = firstDay.toISOString();
    lastDay = lastDay.toISOString();

    this.getDataMonth(firstDay, lastDay).then((data) => {
      this.setState({
        ...data
      })
    });

    

    // previous month
    var prevFirstDay = new Date(date.getFullYear(), date.getMonth() - 1, 1);
    var prevLastDay = new Date(date.getFullYear(), date.getMonth(), 1);

    prevFirstDay = prevFirstDay.toISOString();
    prevLastDay = prevLastDay.toISOString();

    this.getDataMonth(prevFirstDay, prevLastDay).then((data) => {
      this.setState({
        previousMonth: {
          ...data
        }
      })
    });
  }

  getDataMonth(start, end){

    return fetch('https://www.thurrott.com/wp-json/wp/v2/posts?author=948&per_page=100&after=' + start + '&before=' + end).then((response) => response.json())
      .then((responseJson) => {
                
        var tempShiftCount = 0;

        responseJson.map((post) => {
          var postPubDate = post.date;
          var postPubTime = new Date(postPubDate);

          var postDate = postPubDate.split("T")[0];

          var startTime = postDate + "T02:00:00";
          var endTime = postDate + "T07:00:00";

          startTime = new Date(startTime);
          endTime = new Date(endTime);

          if(postPubTime.getTime() >= startTime.getTime() && postPubTime.getTime() <= endTime.getTime()){
            tempShiftCount++;
          }

        })

        var data = {
          posts: responseJson,
          postCount: responseJson.length,
          shiftcount: tempShiftCount
        }

        return data;

      })
      .catch((error) => {
        console.error(error);
      }
    );

  }

  render() {
    return (
      <div className="app">
          <div className="main">
            <h1>
              You posted {this.state.postCount} articles this month.
            </h1>

            <h2>{this.state.shiftcount} of which were between 2am and 7am.</h2>
          </div>

          <div className="main">
            <h1>
              You posted {this.state.previousMonth.postCount} articles last month.
            </h1>

            <h2>{this.state.previousMonth.shiftcount} of which were between 2am and 7am.</h2>
          </div>
          
      </div>
    );
  }
}

export default App;
