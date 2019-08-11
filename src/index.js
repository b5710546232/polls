import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom'

import App from './components/App';
import { createBrowserHistory } from 'history';


import './index.css';

// Needed for onClick
// http://stackoverflow.com/a/34015469/988941

//A note on security: users can access data as explained in the use cases, but they can not modify data beyond that
//All client-based code can be tampered with, so this app relies on server-side validation of data on the firebase side

ReactDOM.render(
  <Router history={createBrowserHistory}>
    <App>
    </App>
  </Router >,
  document.getElementById('root')
);

{/* <Router history={browserHistory}>
    <Route path='/polls/' component={App}>
      <IndexRoute component={Home} />
      <Route path="/polls/dashboard" component={Dashboard} />
      <Route path="/polls/signup" component={Signup} />
      <Route path="/polls/login" component={Login} />
      <Route path="/polls/recover" component={Recover} />
      <Route path="/polls/new" component={New} />
      <Route path="/polls/update/:pollId" component={Update} />
      <Route path="/polls/poll/:pollId" component={Poll} />
      <Route path="/polls/*" component={NotFound} />
    </Route>
  </Router> */}