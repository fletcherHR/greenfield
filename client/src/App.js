import React, {Component} from 'react';
import {Route, Redirect} from 'react-router-dom';
import Login from './Login.js';
import Signup from './Signup.js';
import TaskDetails from './TaskDetails.js';
import Profile from './profile.js';
import Organization from './Organization.js';
import Home from './Home.js';
import Create from './create.js';
import CreateOrg from './CreateOrg.js';
import Auth from './Auth.js';

// For [fake] auth, taken from
// https://tylermcginnis.com/react-router-protected-routes-authentication/
const PrivateRoute = ({component: Component, ...rest}) => (
  <Route
    {...rest}

    render={(props) => {
      console.log('here are rest',...rest);
      console.log('here are props', props);
      return (
        Auth.isAuthenticated === true ? (
          <Component {...props} />
        ) : (
          <Redirect to="/login" />
        )
      )
    }}
  />
);

// This should make sense, en if you don't know that much about React Router.
class App extends Component {
  render() {
    return (
      <div>
        <PrivateRoute exact path="/" component={Home} params="test"/>
        <Route path="/login" component={Login} />
        <Route path="/signup" component={Signup} />
        <PrivateRoute path="/tasks/:taskId" component={TaskDetails} />
        <PrivateRoute path="/users/:username" component={Profile} />
        <PrivateRoute path="/orgs/:orgname" component={Organization} />
        <PrivateRoute path="/create/:username" component={Create} />
        <PrivateRoute path="/createOrg/:username" component={CreateOrg} />
      </div>
    );
  }
}

export default App;
