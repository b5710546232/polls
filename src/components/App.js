import React from 'react';
import { Link } from 'react-router-dom';
import { firebaseApp } from '../utils/firebase';

import { ThemeProvider } from '@material-ui/styles';
import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';
import { createMuiTheme } from '@material-ui/core/styles';

const muiTheme = createMuiTheme({
    fontFamily: 'Roboto, sans-serif',
    palette: {
        primary1Color: '#DC3912',
        accent1Color: '#FF9900'
    }
});

class App extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            loggedIn: (null !== firebaseApp.auth().currentUser) //currentUser is null when not loggedin 
        };
    }

    componentDidMount() {
        firebaseApp.auth().onAuthStateChanged(user => {
            this.setState({
                loggedIn: (null !== user) //user is null when not loggedin 
            })
        });
    }

    handleLogout() {
        firebaseApp.auth().signOut().then(() => {
            //console.log("sign out succesful");
            this.props.history.push('/polls/');
        }, (error) => {
            console.log(error);
        });
    }

    render() {

        return (
            <ThemeProvider theme={muiTheme}>
                <div className="container">

                    <div className="row">

                        <div className="col-sm-6 text-xs-left">
                            <br />
                            {this.state.loggedIn ?
                                <Link to="/polls/dashboard">
                                    <Button
                                        label="My Polls"
                                        primary={true}
                                    />
                                </Link>
                                : ''}
                        </div>

                        <div className="col-sm-6 text-xs-right">
                            <br />
                            {this.state.loggedIn ?
                                <Button
                                    onClick={this.handleLogout}
                                    label="Logout"
                                    secondary={true}
                                />
                                : ''}
                        </div>

                    </div>

                    <div className="row">

                        <div className="col-sm-12 text-xs-center">
                            <a style={{ fontFamily: 'Monoton', fontSize: "60px", textShadow: "2px 2px #ccc", color: "#DC3912", textDecoration: 'none' }} href={this.state.loggedIn ? '/polls/dashboard' : '/polls/'} >
                                Poolster
                            </a>
                            <br /><br />
                        </div>

                    </div>

                    {this.props.children}

                    <div className="row">
                        <div className="col-sm-12 text-xs-center">
                            <br />
                            <a href="https://github.com/sebnun/polls">
                                <Button
                                    label="Source Code"
                                    icon={<Icon className="fa fa-github" />}
                                />
                            </a>
                        </div>
                    </div>

                </div>
            </ThemeProvider>

        );
    }
}

export default App;
