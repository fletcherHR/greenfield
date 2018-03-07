import React from 'react';
import {Link, Redirect} from 'react-router-dom';
import './signup.css';
import Header from './Header.js';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import moment from 'moment';

import 'react-datepicker/dist/react-datepicker.css';

class Create extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      time: '',
      organization: '',
      date: '',
      location: '',
      title: '',
      description: '',
      needed: '',
      orgs: [],
      username: this.props.match.params.username,
      dateAndTime: null,
    };
    this.handleDateChange = this.handleDateChange.bind(this);
    this.handleTime = this.handleTime.bind(this);
    this.handleOrg = this.handleOrg.bind(this);
    this.handleDate = this.handleDate.bind(this);
    this.handleDesc = this.handleDesc.bind(this);
    this.handleTitle = this.handleTitle.bind(this);
    this.handleLoc = this.handleLoc.bind(this);
    this.handleCreate = this.handleCreate.bind(this);
  }

  componentWillMount() {
    axios.get(`/orgs/user/${this.state.username}`).then(results => {
      console.log(results)
      const orgs = results.data.map(r => r.name);
      this.setState({
        orgs,
      });
    });
  }

  handleDateChange(date) {
    this.setState({
      dateAndTime: date,
    },() => {
      console.log('this is the new date and time: ', this.state.dateAndTime.format());
    });
  }

  handleCreate() {
    const queryString = `https://maps.googleapis.com/maps/api/geocode/json?address=${this.state.location}&key=AIzaSyBH-6-MO2reXrAZ4fDQuzkOghyIBPkLyhE`;
    // const queryString = 'https://maps.googleapis.com/maps/api/geocode/json?address=1600+Amphitheatre+Parkway,+Mountain+View,+CA&key=AIzaSyBH-6-MO2reXrAZ4fDQuzkOghyIBPkLyhE'
    console.log('this is the queryString: ', queryString);
    axios.get(queryString)
      .then((res) => {
        axios.post('/tasks', {
          time: this.state.time,
          organization: this.state.organization,
          date: this.state.date,
          location: this.state.location,
          title: this.state.title,
          description: this.state.description,
          needed: this.state.needed,
          latitude: res.data.results[0].geometry.location.lat,
          longitude: res.data.results[0].geometry.location.lng,
        })
          .then(() => {
            this.props.history.push('/');
          })
          .catch((err) => {
            console.log('ERROR in handleCreate(), error: ', err);
          });
      })
  }

  // If this looks redundant, it's because it is.
  // During Solo Week I learned how to handle simple form/state updates with
  // arrow functions. I'll leave that up to the inheriter of this code to
  // figure out.
  handleTime(e) {
    this.setState({
      time: e.target.value,
    });
  }

  handleOrg(e) {
    if(e.target.selectedIndex > 1){
      this.setState({
        organization: e.target.options[e.target.selectedIndex].text,
      });
    } else if (e.target.selectedIndex === 1) {
      this.props.history.push(`/createOrg/${this.state.username}`);
    }
  }

  handleDate(e) {
    this.setState({
      date: e.target.value,
    });
  }

  handleDesc(e) {
    this.setState({
      description: e.target.value,
    });
  }

  handleTitle(e) {
    this.setState({
      title: e.target.value,
    });
  }

  handleLoc(e) {
    this.setState({
      location: e.target.value,
    });
  }

  handleNeeded(e) {
    this.setState({
      needed: e.target.value
    });
  }

  render() {
    console.log('in create', this.props.location.param1);
    return (
    <div>
      <Header name={this.state.username}/>
      <div className="ui container" style={{paddingTop: '100px'}}>
        <div className="ui middle aligned center aligned grid">
          <div className="column" style={{maxWidth: '450px'}}>
            <h2 className="ui blue image header">
              <div className="content">Create new task</div>
            </h2>

            <div className="ui large form">
              <div className="ui stacked segment">

                <div className="field">
                  <select
                    className="ui search dropdown"
                    onChange={e => {this.handleOrg(e)}}
                    >
                    <option>Organization</option>
                    <option>Create New Organization</option>
                    {this.state.orgs.map(m => <option>{m}</option>)}
                  </select>
                </div>

                <div className="field">
                  <div className="ui left input">
                    <label htmlFor="title" />
                    <input
                      value={this.state.title}
                      onChange={e => {
                        this.handleTitle(e);
                      }}
                      type="text"
                      id="title"
                      name="title"
                      placeholder="What kind of task?"
                      />
                  </div>
                </div>

                <div className="field">
                  <div className="ui left input">
                    <label htmlFor="description" />
                    <input
                      value={this.state.description}
                      onChange={e => {
                        this.handleDesc(e);
                      }}
                      type="text"
                      id="description"
                      name="description"
                      placeholder="Describe your task"
                      />
                  </div>
                </div>

                <div className="field">
                  <div className="ui left input">
                    <label htmlFor="location" />
                    <input
                      value={this.state.location}
                      onChange={e => {
                        this.handleLoc(e);
                      }}
                      type="text"
                      id="location"
                      name="location"
                      placeholder="Location"
                      />
                  </div>
                </div>

                <div className="field">
                  <style>
                    {
                      `.react-datepicker__time-container .react-datepicker__time .react-datepicker__time-box ul.react-datepicker__time-list {
                        padding-left: 0;
                        padding-right: 0;
                        width: 100px;
                      }
                      .react-datepicker-wrapper {
                        width: 100%
                      }
                      .react-datepicker__input-container {
                        width: 100%
                      }
                      `
                    }
                  </style>
                  <DatePicker
                    className="ui fluid input"
                    selected={this.state.dateAndTime}
                    onChange={this.handleDateChange}
                    placeholderText="Click to Select Date and Time"
                    showTimeSelect
                    showMonthDropdown
                    dateFormat="LLL"
                  />
                </div>

                <div className="field">
                  <div className="ui left input">
                    <label htmlFor="needed" />
                    <input
                      value={this.state.needed}
                      onChange={e => {
                        this.handleNeeded(e);
                      }}
                      type="text"
                      id="volunteers"
                      name="volunteers"
                      placeholder="Volunteers Needed"
                      />
                  </div>
                </div>

                <button
                  onClick={() => {
                    this.handleCreate();
                  }}
                  className="ui fluid large blue submit button">
                  Create
                </button>
              </div>
            </div>

            <div className="ui message">
              <Link className="ui fluid large blue submit button" to="/">
                Back to the main page!
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
    );
  }
}

export default Create;

// axios.get('https://maps.googleapis.com/maps/api/geocode/json?address=1600+Amphitheatre+Parkway,+Mountain+View,+CA&key=AIzaSyBH-6-MO2reXrAZ4fDQuzkOghyIBPkLyhE')
//   .then((res) => {
//     console.log('this is the latitude: ', res.data.results[0].geometry.location.lat);
//     console.log('this is the longitude: ', res.data.results[0].geometry.location.lng);
//   })

// <div className="field">
//   <div className="ui left icon input">
//     <label htmlFor="date" />
//     <input
//       value={this.state.date}
//       onChange={e => {
//         this.handleDate(e);
//       }}
//       type="text"
//       id="date"
//       name="date"
//       placeholder="Date? (YYYY-MM-DD)"
//       />
//   </div>
// </div>
//
// <div className="field">
//   <div className="ui left icon input">
//     <label htmlFor="time" />
//     <input
//       value={this.state.time}
//       onChange={e => {
//         this.handleTime(e);
//       }}
//       type="text"
//       id="time"
//       name="time"
//       placeholder="Event Time?"
//       />
//   </div>
// </div>
