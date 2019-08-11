import React from 'react';
import { Link } from 'react-router-dom';
import { firebaseApp } from '../utils/firebase';
import Helmet from "react-helmet";


import Button from '@material-ui/core/Button';
import {IconButton,Icon,Paper,Divider,DialogTitle,DialogActions,Dialog} from '@material-ui/core';

import Loading from './Loading';

class Dashboard extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            dialogOpen: false,
            loading: true,
            publicPolls:[],
            polls: [] //items like { id: 34324, title: 'sdf'},
        };

        this.poll2Delete = '';
        this.poll2DeleteTitle = ''

        this.handleClose = this.handleClose.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
    }

    componentDidMount() {
        //const uid = getLocalUserId();
        this.publicPollsRef = firebaseApp.database().ref(`polls/`);

          //check if user has no polls to quit loading indicator
          this.publicPollsRef.once('value').then(snapshot => {
            if (!snapshot.hasChildren()) {
                if (this.mounted) {
                    this.setState({ loading: false });
                }
            }
        });

        this.publicPollsRef.on('child_added', ((newPollIdSnapshot) => {
            const pollId = newPollIdSnapshot.key;


            firebaseApp.database().ref(`polls/${pollId}/title`).once('value').then(snapshot => {
                const title = snapshot.val();

                const publicPolls = this.state.publicPolls;
                publicPolls.push({ title: title, id: pollId })
                console.log(`publicPolls`,publicPolls)

                if (this.mounted) {
                    this.setState({
                        publicPoll: publicPolls,
                        loading: false
                    });
                }
            });

        })).bind(this);


        this.publicPollsRef.on('child_removed', ((removedPollIdSnapshot) => {
            const pollId = removedPollIdSnapshot.key;
            const publicPolls = this.state.publicPolls.filter(poll => poll.id !== pollId);

            if (this.mounted) {
                this.setState({
                    publicPolls: publicPolls
                });
            }

        })).bind(this);

        firebaseApp.auth().onAuthStateChanged(user => {
            if (user) { //this can get called after componentWillUnmount, make sure its there to avoid errors

                const uid = user.uid;

                this.userPollsRef = firebaseApp.database().ref(`user-polls/${uid}`);

                //check if user has no polls to quit loading indicator
                this.userPollsRef.once('value').then(snapshot => {
                    if (!snapshot.hasChildren()) {
                        if (this.mounted) {
                            this.setState({ loading: false });
                        }
                    }
                });

                this.userPollsRef.on('child_added', ((newPollIdSnapshot) => {
                    const pollId = newPollIdSnapshot.key;

                    firebaseApp.database().ref(`polls/${pollId}/title`).once('value').then(snapshot => {
                        const title = snapshot.val();

                        const polls = this.state.polls;
                        polls.push({ title: title, id: pollId })

                        if (this.mounted) {
                            this.setState({
                                polls: polls,
                                loading: false
                            });
                        }
                    });

                })).bind(this);

                this.userPollsRef.on('child_removed', ((removedPollIdSnapshot) => {
                    const pollId = removedPollIdSnapshot.key;
                    const polls = this.state.polls.filter(poll => poll.id !== pollId);

                    if (this.mounted) {
                        this.setState({
                            polls: polls
                        });
                    }

                })).bind(this);
            }
        });

        this.mounted = true; //the callbacks above can be called after componentWillUnmount(), to avoid errors, check
    }

    componentWillUnmount() {
        this.userPollsRef.off();
        this.mounted = false;
    }

    handleOpen(pollId) {
        this.setState({ dialogOpen: true });
        this.poll2Delete = pollId;
        this.poll2DeleteTitle = this.state.polls.find(poll => poll.id === this.poll2Delete).title;
    }

    handleClose() {
        this.setState({ dialogOpen: false });
    }

    handleDelete() {
        // updating to null deletes
        const updates = {};
        updates[`/polls/${this.poll2Delete}`] = null;
        updates[`/user-polls/${firebaseApp.auth().currentUser.uid}/${this.poll2Delete}`] = null;

        firebaseApp.database().ref().update(updates);

        this.setState({ dialogOpen: false });
    }

    renderUser()
    {
        let pollsUIs = this.state.publicPolls.map((poll) => {
            return (
                <div key={poll.id} >
                    <Link to={`/polls/poll/${poll.id}`}>
                        <Button
                            style={{ textAlign: 'left', width: '50%' }}
                        >
                            {poll.title}
                        </Button>
                    </Link>
                    <Divider />

                </div>
            );
        });
        return(
            <div className="row">
            <div className="col-sm-12 text-xs-center">

                <Helmet title="Dashboard" />

                <Paper>

                    <br />
                    <h2>All Polls</h2>
                    <br />
                        
                    {pollsUIs}
                    <br /><br />

                <Loading loading={this.state.loading} />            
                </Paper>
            </div >
            </div>
        )
    }

    renderAdmin() {
        const actions = [
            <Button
                key="cancel"
             color="primary"
                onClick={this.handleClose}
            >
                Cancel
                </Button>,
            <Button
            key="delete"
            color="secondary"
                onClick={this.handleDelete}
            >
                Delete
            </Button>,
        ];

        let pollsUIs = this.state.polls.map((poll) => {
            return (
                <div key={poll.id} >
                    <IconButton
                        tooltip={<span>Delete</span>}
                        onClick={() => this.handleOpen(poll.id)}

                    >
                    <Icon className="fa fa-trash"/>
                    </IconButton>
                    <Link to={`/polls/poll/${poll.id}`}>
                        <Button
                            style={{ textAlign: 'left', width: '50%' }}
                        >
                            {poll.title}
                        </Button>
                    </Link>
                    <Divider />

                </div>
            );
        });
        return ( <div className="row">
        <div className="col-sm-12 text-xs-center">

            <Helmet title="Dashboard" />

            <Paper>

                <br />
                <h2>Your Polls</h2>
                <br />

                <Dialog
                    modal={false}
                    open={this.state.dialogOpen}
                    onRequestClose={this.handleClose}
                >
                    <DialogTitle id="alert-dialog-title">Delete "{this.poll2DeleteTitle}"?</DialogTitle>
                    <DialogActions>
 {actions}
</DialogActions>

            </Dialog>

                <Link to="/polls/new">
                    <Button variant="contained"
                        color="primary"
                    >
                        New Poll
                    </Button>

                </Link>
                <br /><br />

                {pollsUIs}

                <Loading loading={this.state.loading} />

                <br /><br />
            </Paper>
        </div>
        </div>
        );
    }

    render() {    
        return (
            <>
                {this.props.isAdmin ?  this.renderAdmin()  : this.renderUser() }
            </>
        )
    }
}


export default Dashboard;
