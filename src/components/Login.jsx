import React from 'react';
import { firebaseApp } from '../utils/firebase';
import * as firebase from 'firebase'; //needed for fb, google providers
import { Link } from 'react-router-dom';
import Helmet from "react-helmet";


import {TextField,Icon,Button,Paper} from '@material-ui/core';

import {withRouter} from 'react-router-dom'
class Login extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      password: '',
      emailError: '',
      passwordError: ''
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handleEmailChange = this.handleEmailChange.bind(this);

    console.log(`this.props.history`,this.props.history)
  }

  handleGoogle(e) {
    e.preventDefault();
    const provider = new firebase.auth.GoogleAuthProvider();
    firebaseApp.auth().signInWithPopup(provider).then((result) => {
      //console.log('Google login success');
      this.props.history.push('/polls/dashboard');
    }).catch((error) => {
      console.log(error);
    });
  }

  handleEmailChange(e) {
    this.setState({ email: e.target.value });
  }

  handlePasswordChange(e) {
    this.setState({ password: e.target.value });
  }

  handleSubmit(e) {
    e.preventDefault();
    const email = this.state.email.trim();
    const password = this.state.password.trim();

    firebaseApp.auth().signInWithEmailAndPassword(email, password).then((user) => {
      this.props.history.push('/polls/dashboard');
    }).catch((error) => {

      if (error.code === 'auth/wrong-password') {
        this.setState({ passwordError: error.message, emailError: '' });
      } else {
        this.setState({ emailError: error.message, passwordError: '' });
      }

      //console.log(error);
    });
  }

  render() {
    return (

      <div className="row">
        <div className="col-sm-12 text-xs-center">

          <Helmet title="Login" />

          <Paper>

            <br /><br />
            <h2>Login</h2>

            <form onSubmit={this.handleSubmit}>

            <TextField
               margin="normal"
              error={this.state.emailError!==''}
                label="Email"
                value={this.state.email}
                onChange={this.handleEmailChange}
                helperText={this.state.emailError}
              />

              <br /><br />
            

            <TextField
                label="Password"
                value={this.state.password}
                onChange={this.handlePasswordChange}
                type="password"
                error={this.state.passwordError!==''}
                helperText={this.state.passwordError}
              />

              <br /><br />
              <Button variant="contained"
                type="submit"
                color="primary"
              >
              Login
              </Button>

            </form>

            <br />
            <Link to="/polls/recover">
              <Button
              >
              Forgot your password?
              </Button>
            </Link>
            <br/><br/>

            <Button variant="contained"
              onClick={(event)=>{this.handleGoogle(event)}}
              color="secondary"
              className="buttonWidth"
            >
              <Icon className="fa fa-google" /> 
              <span style={{marginLeft:"8px"}}>Login with Google</span>
            </Button>

            
            <br /><br />
            
            
          </Paper>
        </div>
      </div>

    );
  }
}


export default Login;

