import React from 'react';
import { Link,withRouter } from 'react-router-dom';
import { firebaseApp } from '../utils/firebase';
import { ThemeProvider } from '@material-ui/styles';
import Button from '@material-ui/core/Button';
import { createMuiTheme } from '@material-ui/core/styles';
import AppRouter from './Router'

const muiTheme = createMuiTheme({
    fontFamily: 'Roboto, sans-serif',
    palette: {
        primary1Color: '#DC3912',
        accent1Color: '#FF9900'
    }
});

const LoginButton = () =>{
    return(
        <Link to="/polls/login">
        <Button
        color="secondary"
        >
            Login
        </Button>
    </Link>
    )
}

class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            loggedIn: false, //currentUser is null when not loggedin 
            currentUser:null,
            userEmail:``,
            isAdmin:false
        };
        this.handleLogout = this.handleLogout.bind(this)
        console.log(this.props.history)
    }

    checkIsAdmin(uid) {
        this.adminRef = firebaseApp.database().ref(`admin/${uid}`);
        this.adminRef.on('value', (snapshot) => { 
            console.log(`admin-snap`, snapshot.val(), uid)
            const isAdmin= snapshot.val()
            this.setState({isAdmin})
        })
    }

    componentDidMount() {
        firebaseApp.auth().onAuthStateChanged(user => {
            console.log(`user`, user)
            const { email,uid } = user || ``
            this.setState({
                loggedIn: (null !== user), //user is null when not loggedin ,
                currentUser: user,
                userEmail: email
            })
            this.checkIsAdmin(uid)
        });
    }

    componentWillUnmount() {
        this.adminRef.off();
    }

    componentWillReceiveProps() {
        window.previousLocation = this.props.location
      }

    handleLogout() {
        firebaseApp.auth().signOut().then(() => {
            //console.log("sign out succesful");
            this.props.history.push('/');
            this.setState({
                userEmail: ``,
                loggedIn:false
            })
        }, (error) => {
            console.log(error);
        });
    }

    render() {

        const { pathname } = this.props.location
        const isIndexPath = pathname === `/`
        const isLoginPath = pathname === `/polls/login`
        console.log(`curr`,pathname,isLoginPath)
        // console.log(`this.props.children`, this.props.children)
        return (
            <ThemeProvider theme={muiTheme}>
                <div className="container">

                    <div className="row">

                        <div className="col-sm-6 text-xs-left">
                            <br />
                            {this.state.isAdmin ?
                                <Link to="/polls/dashboard">
                                    <Button
                                        color="primary"
                                    >
                                        My Polls
                                    </Button>
                                </Link>
                                : ''}
                        </div>

                        <div className="col-sm-6 text-xs-right">
                            <br />
                            {this.state.userEmail}
                            {this.state.loggedIn ?
                                <Button
                                    onClick={this.handleLogout}
                                    color="secondary"
                                >
                                    Logout
                                 </Button>
                                :
                                <>{ !(isIndexPath || isLoginPath) && <LoginButton/> }</>
                                }
                        </div>

                    </div>

                    <div className="row">

                        <div className="col-sm-12 text-xs-center">
                            <a style={{ fontFamily: 'roboto', fontSize: "60px", textShadow: "2px 2px #ccc", color: "#DC3912", textDecoration: 'none' }} href={this.state.loggedIn ? '/polls/dashboard' : '/'} >
                                Voting app
                            </a>
                            <br /><br />
                        </div>

                    </div>

                    <AppRouter isAdmin={this.state.isAdmin} />

                </div>
            </ThemeProvider>

        );
    }
}

export default withRouter(App);
