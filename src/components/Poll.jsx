import React from 'react';
import { firebaseApp } from '../utils/firebase';
import Helmet from "react-helmet";

import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import Fab from '@material-ui/core/Fab';
import Icon from '@material-ui/core/Icon';
import Paper from '@material-ui/core/Paper';
import { Chart } from 'react-google-charts';
import Loading from './Loading';
import { withRouter } from "react-router-dom";

class Poll extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            title: '',
            options: [], //of the form [{'some option': 34}]
            canVote: false,
            showSnackbar: false,
            loggedIn: false,
            currentUser:null,
            loading: true
        };
        console.log(this.state.canVote)
    }

    checkIsAbleTocanVote(uid) {
        // http://localhost:3000/polls/poll/-LluqIbVKCXdaUFsX4dO
        // :TODO for test
        // this.setState({canVote:true})
        // return
        
        try {
            const pollID = this.props.match.params.pollId
            this.votesRef = firebaseApp.database().ref(`voters/${pollID}/${uid}`);
            this.votesRef.on('value', (snapshot) => {
                const isVoted = snapshot.val() || false
                console.log(`isVoted`,isVoted)
                let isAbleToVote = true
                isAbleToVote = !isVoted
                let canVoteWithAuth = this.state.loggedIn && isAbleToVote
                console.log(`checkIsAbleTocanVote`,canVoteWithAuth,this.state.canVote)
                this.setState({canVote:canVoteWithAuth})
                
            })
        }
        catch (error) {
            console.error(error)
        }

    }

    componentDidMount() {

        firebaseApp.auth().onAuthStateChanged(user => {
            this.setState({
                loggedIn: (null !== user), //user is null when not loggedin ,
                currentUser:user
            })
            let uid = user.uid || ''
            this.checkIsAbleTocanVote(uid)
        });
        this.pollRef = firebaseApp.database().ref(`polls/${this.props.match.params.pollId}`);
        this.pollRef.on('value', ((snapshot) => {
        const dbPoll = snapshot.val();

            try {
                const options = Object.keys(dbPoll).reduce((a, key) => {
                    if (key !== 'title') {
                        a.push({ [key]: dbPoll[key] }); //[key] is an es6 computed property name
                    }
                    return a;
                }, []);
                this.setState({ title: dbPoll.title, options: options, loading: false })
        }
            catch (error) {
                console.error(error)
        }

        })).bind(this);
    }

    componentWillUnmount() {
        this.pollRef.off();
        if(this.votesRef)
            this.votesRef.off();

    }

    handleVote(option) {
        let currentCount = this.state.options.filter(o => {
            return o.hasOwnProperty(option);
        })[0][option];

        // // Write the new poll's data simultaneously in the polls list and the user's polls list.
        // var updates = {};
        // updates[`/polls/${newPollKey}`] = pollData;
        // updates[`/user-polls/${uid}/${newPollKey}`] = true;

        // firebaseApp.database().ref().update(updates);

        let updates = {};
        // votes>{pollID}>{uid:true}
        try {
            const uid = firebaseApp.auth().currentUser.uid;
            updates[`voters/${this.props.match.params.pollId}/${uid}`] = true
            updates[`polls/${this.props.match.params.pollId}/${option}`] =  currentCount += 1 
            // firebaseApp.database().ref().update()
            // firebaseApp.database().ref().update({ [`polls/${this.props.match.params.pollId}/${option}`]: currentCount += 1 })
            firebaseApp.database().ref().update(updates);
            localStorage.setItem(this.props.match.params.pollId, 'true');
            this.setState({ canVote: false, showSnackbar: true });    
        }
        catch(error){
            console.error(error)
        }
        
    }

    render() {
        //[["Task","Hours per Day"],["Work",11],["Eat",2],["Commute",2],["Watch TV",2],["Sleep",7]]
        const data = this.state.options.map(option => {
            return [Object.keys(option)[0], option[Object.keys(option)[0]]];
        });
        data.unshift(['option', 'votes']);

        //let isAuthUser = getLocalUserId() ? true : false;
        let isAuthUser = firebaseApp.auth().currentUser ? true : false;
        let isAdminUser = this.props.isAdmin

        let addOptionUI;
        if (isAdminUser) {
            addOptionUI = (
                <div>
                    <a href={`/polls/update/${this.props.match.params.pollId}`} >
                        <Fab
                            color="secondary"
                        >
                            <Icon className="fa fa-plus"></Icon>
                        </Fab>
                    </a>
                </div>
            );
        }

        let optionsUI = this.state.options.map(option => {
            return (
                <div key={Object.keys(option)[0]}>
                    <Button variant="contained"
                        onClick={() => this.handleVote(Object.keys(option)[0])}
                        style={{ width: '90%' }}
                        disabled={!this.state.canVote}
                        color="secondary"
                    >
                        {Object.keys(option)[0]}
                    </Button>
                    <br /><br />
                </div>
            );
        });

        return (
            <div className="row">
                <div className="col-sm-12 text-xs-center">

                    <Helmet title={this.state.title} />

                    <Snackbar
                        open={this.state.showSnackbar}
                        message="Thanks for your vote!"
                        autoHideDuration={4000}
                    />

                    <Paper>
                        <br /><br />
                        <h2>{this.state.title}</h2>
                        <br />

                        <Loading loading={this.state.loading} />

                        {optionsUI}

                        {addOptionUI}

                        <br />
                        <Chart
                            chartTitle="DonutChart"
                            chartType="PieChart"
                            width="100%"
                            data={data}
                            options={{ is3D: 'true' }}
                        />

                        <br /><br />

                    </Paper>
                </div>
            </div>
        );
    }
}

export default Poll;
