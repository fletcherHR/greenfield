import React from 'react';
import Header from './Header.js';
import TaskList from './TaskList.js';
import GoogleMaps from './Map.js';
import axios from 'axios';
import Auth from './Auth.js';

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tasks: [],
      status: false,
      username: Auth.username,
    };
  }

  componentWillMount() {
    axios.get(`/tasks`).then(results => {
      const tasks = results.data;
      this.setState({
        tasks,
      });
    });

    axios.get('/status').then(results => {
      if (!results.data) {
        console.log("Session doesn't exist!", results.data);
        this.props.history.push('/login'); //actual redirection
      }
      this.setState({
        status: results.data,
      });
    });
  }

  render() {
    return (
      <div className="ui container" style={{paddingTop: '50px'}}>
        <Header name={this.state.username} />
        <div className="ui stackable grid">
          <div
            className="six wide column"
            style={{ height: '88vh', overflowY: 'scroll', transform: 'scaleX(-1)' }}
          >
            <div style={{ transform: 'scaleX(-1)' }}>
              <TaskList username={this.state.username} tasks={this.state.tasks} />
            </div>
          </div>
          <script
            async
            defer
            src={`https://maps.googleapis.com/maps/api/js?key=AIzaSyBH-6-MO2reXrAZ4fDQuzkOghyIBPkLyhE&callback=initMap`}
            type="text/javascript"
          />
          <div
            className="ten wide column"
            //style={{ height: '80%' }}
          >
            <GoogleMaps
              isMarkerShown
              googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyBH-6-MO2reXrAZ4fDQuzkOghyIBPkLyhE&v=3.exp&libraries=geometry,drawing,places"
              loadingElement={<div style={{height: `100%`}} />}
              containerElement={<div style={{height: `100%`}} />}
              mapElement={<div style={{height: `100%`}} />}
              tasks={this.state.tasks}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default Home;
