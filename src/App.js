import React, { Component } from 'react';
import './App.css';
import loader from "./loader.svg";

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      author: "948",
      posts: [],
      postCount: 0,
      shiftcount: 0,
      display: false,
      previousMonth: {
        posts: [],
        postCount: 0,
        shiftcount: 0,
        display: false
      },
      searchMonth: {
        posts: [],
        postCount: 0,
        shiftcount: 0,
        date: "",
        display: true
      },
      searchValues: {
        month: "01",
        year: ""
      }
    }

    this.getCurrentMonth = this.getCurrentMonth.bind(this);
    this.getPreviousMonth = this.getPreviousMonth.bind(this);
    this.search = this.search.bind(this);
    this.updateAuthor = this.updateAuthor.bind(this);
  }

  componentDidMount() { 
    this.getCurrentMonth();
    this.getPreviousMonth();    
  }

  getCurrentMonth(){
    var date = new Date();
    var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 1);

    firstDay = firstDay.toISOString();
    lastDay = lastDay.toISOString();

    this.getDataMonth(firstDay, lastDay).then((data) => {
      this.setState({
        ...data,
        display: true
      })
    });
  }

  getPreviousMonth(){
    var date = new Date();
    var prevFirstDay = new Date(date.getFullYear(), date.getMonth() - 1, 1);
    var prevLastDay = new Date(date.getFullYear(), date.getMonth(), 1);

    prevFirstDay = prevFirstDay.toISOString();
    prevLastDay = prevLastDay.toISOString();


    this.getDataMonth(prevFirstDay, prevLastDay).then((data) => {
      this.setState({
        previousMonth: {
          ...data,
          display: true
        }
      })
    });
  }


  getDataMonth(start, end){

    return fetch('https://www.thurrott.com/wp-json/wp/v2/posts?author=' + this.state.author + '&per_page=100&after=' + start + '&before=' + end).then((response) => response.json())
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
    this.setState({searchMonth: {display: false}});
    
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
          date: date.toLocaleString('en-us', { month: 'long' }) + " " + date.getFullYear(),
          display: true
        }
      })
    });
  }

  updateAuthor(){
    this.setState({display: false});
    this.setState({previousMonth: {display: false}});

    if(this.state.searchMonth.postCount !== 0){
      this.setState({searchMonth: {display: true}});
    }

    this.getCurrentMonth();
    this.getPreviousMonth();  
    
    if(this.state.searchValues.month !== "" && this.state.searchValues.year !== ""){
      this.search();
    }
  }

  render() {
    return (
      <div className="app">
          <header>
            <h1>THURROTT 💸💰</h1>

          </header>
          <label>Author ID</label>
         

          <input type="text" value={this.state.author} onChange={(event) => {this.setState({author: event.target.value})}} />
          <input type="button" value="submit" onClick={this.updateAuthor}/>

          <div className="main">
            {
              this.state.display === false ? <img src={loader} className="App-logo" alt="logo" /> :

              <React.Fragment>
                <h1>
                  You posted {this.state.postCount} articles this month.
                </h1>
    
                <h2>{this.state.shiftcount} of which were between 2am and 7am.</h2>

              </React.Fragment>

            }
          </div>

          <div className="main">

            {
              this.state.previousMonth.display === false ? <img src={loader} className="App-logo" alt="logo" /> :

              <React.Fragment>
                <h1>
                  You posted {this.state.previousMonth.postCount} articles last month.
                </h1>

                <h2>{this.state.previousMonth.shiftcount} of which were between 2am and 7am.</h2>

              </React.Fragment>

            }

          </div>
          
          <div className="main">
            <h1>Search</h1>

            <label>month number</label>
            <select value={this.state.searchValues.month} onChange={(event) => {this.setState({searchValues: {month: event.target.value, year: this.state.searchValues.year}})}}>
              <option value="01">January</option>
              <option value="02">February</option>
              <option value="03">March</option>
              <option value="04">April</option>
              <option value="05">May</option>
              <option value="06">June</option>
              <option value="07">July</option>
              <option value="08">August</option>
              <option value="09">September</option>
              <option value="10">October</option>
              <option value="11">November</option>
              <option value="12">December</option>
            </select>

            
            <label>year</label>
            <input type="text" value={this.state.searchValues.year} onChange={(event) => {this.setState({searchValues: {month: this.state.searchValues.month, year: event.target.value}})}} />
            
            <input type="button" value="submit" onClick={this.search}/>

            {
              this.state.searchMonth.display === false ? <img src={loader} className="App-logo" alt="logo" /> :

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
