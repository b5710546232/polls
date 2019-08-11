import React from 'react';
import { firebaseApp } from '../utils/firebase';

import Helmet from "react-helmet";

import Button from '@material-ui/core/Button';
import {TextField,FormControl,Input,InputLabel,FormHelperText} from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import { withRouter } from "react-router-dom";

class Signup extends React.Component {
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

    firebaseApp.auth().createUserWithEmailAndPassword(email, password).then((user) => {
      this.props.history.push('/polls/dashboard');
    }).catch((error) => {
      if (error.code === 'auth/weak-password') {
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

          <Helmet title="Register" />

          <Paper>
            <br /><br />
            <h2>Register</h2>

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
              Register
              </Button>

            </form>
            <br /><br />
          </Paper>
        </div>
      </div>

    );
  }
}


export default Signup;
