import React from 'react';
import { firebaseApp } from '../utils/firebase';
import { Link } from 'react-router-dom';
import Helmet from "react-helmet";

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';

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
                floatingLabelText="Email"
                value={this.state.email}
                onChange={this.handleEmailChange}
                errorText={this.state.emailError}
              />

              <br /><br />
              <TextField
                floatingLabelText="Password"
                value={this.state.password}
                onChange={this.handlePasswordChange}
                type="password"
                errorText={this.state.passwordError}
              />

              <br /><br />
              <Button variant="contained"
                label="Login"
                type="submit"
                primary={true}
              />

            </form>

            <br />
            <Link to="/polls/recover">
              <Button
                label="Forgot your password?"
              />
            </Link>

            <br /><br />
          </Paper>
        </div>
      </div>

    );
  }
}


export default Login;

