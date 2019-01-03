import React, { Component } from 'react';
import './App.css';

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
    var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  
    firstDay = firstDay.toISOString();
    lastDay = lastDay.toISOString();

    fetch('https://www.thurrott.com/wp-json/wp/v2/posts?author=948&per_page=100&after=' + firstDay + '&before=' + lastDay).then((response) => response.json())
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

        this.setState({
          posts: responseJson,
          postCount: responseJson.length,
          shiftcount: tempShiftCount
        })

      })
      .catch((error) => {
        console.error(error);
      });
  }

  render() {
    return (
      <div className="app">
          <div class="main">
            <h1>
              You posted {this.state.postCount} articles this month.
            </h1>

            <h2>{this.state.shiftcount} of which were between 2am and 7am.</h2>
          </div>
          
      </div>
    );
  }
}

export default App;
