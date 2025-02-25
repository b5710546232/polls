import React from 'react'
import { Route, Switch } from 'react-router-dom'
import Home from './Home'
import Signup from './Signup'
import Dashboard from './Dashboard'
import Poll from './Poll'
import Update from './Update'
import Login from './Login'
// import Recover from './Recover'
import New from './New'
import NotFound from './NotFound'

export default (props) => {
    console.log(`props`,props)
    return(
        <Switch>
            <Route key="/" exact path="/" component={Home} />
            <Route key="/polls/signup" path="/polls/signup" component={Signup} />
            <Route key="/polls/dashboard" path="/polls/dashboard"
                render={(routeProps) => <Dashboard {...routeProps} isAdmin={props.isAdmin} />}
            />
            <Route path="/polls/update/:pollId" component={Update} />
            <Route path="/polls/login" component={Login} />
            {/* <Route path="/polls/recover" component={Recover} /> */}
            <Route path="/polls/new" component={New} />
            <Route path="/polls/poll/:pollId" component={Poll} />
            <Route component={NotFound}/>
      </Switch>
    )
}