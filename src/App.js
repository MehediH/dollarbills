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
        shiftcount: 0,
        date: ""
      },
      searchValues: {
        month: "",
        year: ""
      }
    }

    this.search = this.search.bind(this);
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

  search(){
    var date = this.state.searchValues.year + "-" + this.state.searchValues.month + "-01T00:00:00";

    date = new Date(date);
    
    var searchFirstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    var searchLastDay = new Date(date.getFullYear(), date.getMonth() + 1, 1);

    searchFirstDay = searchFirstDay.toISOString();
    searchLastDay = searchLastDay.toISOString();

    this.getDataMonth(searchFirstDay, searchLastDay).then((data) => {
      this.setState({
        searchMonth: {
          ...data,
          date: date.toLocaleString('en-us', { month: 'long' }) + ", " + date.getFullYear()
        }
      })
    });
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
          
          <div className="main">
            <h1>Search</h1>

            <label>month number</label>
            <input type="text" value={this.state.searchValues.month} onChange={(event) => {this.setState({searchValues: {month: event.target.value, year: this.state.searchValues.year}})}} />
            
            <label>year</label>
            <input type="text" value={this.state.searchValues.year} onChange={(event) => {this.setState({searchValues: {month: this.state.searchValues.month, year: event.target.value}})}} />
            
            <input type="button" value="submit" onClick={this.search}/>

            {
              this.state.searchMonth.postCount != 0 &&
              
              <React.Fragment>
                <h1>
                  You posted {this.state.searchMonth.postCount} articles on {this.state.searchMonth.date}.
                </h1>
  
                <h2>{this.state.searchMonth.shiftcount} of which were between 2am and 7am.</h2>
              </React.Fragment>
            }
          </div>
      </div>
    );
  }
}

export default App;
