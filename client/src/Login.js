import React from 'react';
import {Link, Redirect} from 'react-router-dom';
import axios from 'axios';
import './signup.css';
import Auth from './Auth.js';
import { GoogleLogin, GoogleLogout } from 'react-google-login';
import moment from 'moment-timezone';

class Login extends React.Component {
  constructor(props) {
    super(props);

    this.handleUsernameInput = this.handleUsernameInput.bind(this);
    this.handlePasswordInput = this.handlePasswordInput.bind(this);
    this.login = this.login.bind(this);
    this.responseGoogle = this.responseGoogle.bind(this);
    this.state = {
      props: props,
      redirectToReferrer: false,
      username: '',
      password: '',
    };

  }

  responseGoogle(response) {
    console.log(response.profileObj)

      axios.post('/googleLogin', response.profileObj)
      .then((res) => {
        Auth.isAuthenticated = true;
        Auth.username = res.data.username;
        Auth.password = res.data.password;
        this.setState({redirectToReferrer: true})
      })
  }

  login() {
      Auth.username = this.state.username;
      Auth.password = this.state.password;
      let that = this;
      console.log(that);
      console.log('Logging in ...');
      Auth.authenticate(isAuthenticated => {
        if (!isAuthenticated) {
          axios
            .post(`/login`, {
              username: that.state.username,
              password: that.state.password,
            })
            .then(res => {
              console.log('successfully logged in');
              that.setState({redirectToReferrer: true});
            });
        } else {
          console.log('Already authed login is unnnecessery');
          that.setState({redirectToReferrer: true});
        }
      });
  }

  handleUsernameInput(e) {
    console.log(e.target.value);
    this.setState({username: e.target.value});
  }

  handlePasswordInput(e) {
    this.setState({password: e.target.value});
  }

  render() {
    const {redirectToReferrer} = this.state;

    if (redirectToReferrer) {
      console.log('This is happening');
    }

    return redirectToReferrer ? (
      <Redirect to="/" />
    ) : (
      <div className="ui container" style={{paddingTop: '100px'}}>
        <div className="ui middle aligned center aligned grid">
          <div className="column" style={{maxWidth: '450px'}}>
            <h2 className="ui blue image header">
              <div className="content">Log-in to uVolunteer</div>
            </h2>
            <div className="ui large form">
              <div className="ui stacked segment">
                <div className="field">
                  <div className="ui left input">
                    <label htmlFor="username" />
                    <input
                      type="text"
                      id="username"
                      name="username"
                      placeholder="Username"
                      onChange={this.handleUsernameInput}
                    />
                  </div>
                </div>
                <div className="field">
                  <div className="ui left input">
                    <label htmlFor="password" />
                    <input
                      type="password"
                      id="password"
                      placeholder="Password"
                      onChange={this.handlePasswordInput}
                      onKeyPress={(e)=>{if(e.key==='Enter') this.login()}}
                    />
                  </div>
                </div>
                <div
                  onClick={this.login}
                  className="ui fluid large blue submit button">
                  Login
                </div>
              </div>
              <div className="ui error message" />
            </div>
            <div className="ui message">
              <Link className="ui fluid large blue submit button" to="/signup">
                New Volunteer? Register NOW!
              </Link>
            </div>
            <GoogleLogin
              clientId="328482894747-igpb1a9uppg0906r03radh7ll1qlnftm.apps.googleusercontent.com"
              buttonText="Google Login"
              onSuccess={this.responseGoogle}
              onFailure={this.responseGoogle}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default Login;
