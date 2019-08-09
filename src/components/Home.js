import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import { firebaseApp } from '../utils/firebase';
import * as firebase from 'firebase'; //needed for fb, google providers
import Helmet from "react-helmet";

import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';
import Paper from '@material-ui/core/Paper';

class Home extends React.Component {

  handleFacebook(e) {
    e.preventDefault();
    const provider = new firebase.auth.FacebookAuthProvider();
    firebaseApp.auth().signInWithPopup(provider).then((result) => {
      //console.log('Facebook login success');
      this.props.history.push('/polls/dashboard');
    }).catch((error) => {
      console.log(error);
    });
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

  render() {
    return (
      <div className="row">
        <div className="col-sm-12 text-xs-center">

          <Helmet title="Home" />

          <Paper>

            <br /><br />
            <h2>Create and share polls, fast and easy. View results in real time!</h2>

            <br /><br />
            <Button variant="contained"
              label="Login with Facebook"
              onClick={this.handleFacebook}
              color="secondary"
              className="buttonWidth"
            ><Icon className="fa fa-facebook-f" /></Button>
            <br /><br />
            <Button variant="contained"
              label="Login with Google"
              onClick={this.handleGoogle}
              color="secondary"
              className="buttonWidth"
            ><Icon className="fa fa-google" /></Button>
            {/* 

            <br /><br />
            <Link to="/polls/login">
              <Button variant="contained"
                label="Login with Email"
                color="secondary"
                icon={<Icon className="fa fa-envelope-o" />}
                className="buttonWidth"
              />
            </Link>
            <br /><br />
            <Link to="/polls/signup">
              <Button variant="contained"
                label="Sign Up"
                primary={true}
                className="buttonWidth"
              />
            </Link>
            <br /><br />
            <br /><br /> */}
          </Paper>

        </div>
      </div >

    );
  }
}


export default withRouter(Home);

