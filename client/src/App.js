import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Provider } from "react-redux";
import jwt_decode from "jwt-decode";
import setAuthToken from "./utils/setAuthToken";
import { setCurrentUser, logoutUser } from "./actions/authActions";
import store from "./store";

import PrivateRoute from "./components/common/PrivateRoute";
import Header from "./components/layout/Header";
import Landing from "./components/layout/Landing";
import Footer from "./components/layout/Footer";
import Receive from "./components/orders/Receive";
import Deliver from "./components/orders/Deliver";
import Reports from "./components/reports/Reports";
import Login from "./components/auth/login";
import "./App.css";

//check for token's presence
if (localStorage.jwtToken) {
  //set auth token header auth
  setAuthToken(localStorage.jwtToken);
  //decode token and get user info and expiration
  const decoded = jwt_decode(localStorage.jwtToken);
  //Set user and isAuthenticated
  store.dispatch(setCurrentUser(decoded));

  //Check for expired token
  const currentTime = Date.now() / 1000;
  if (decoded.exp < currentTime) {
    //Logout user
    store.dispatch(logoutUser());
    //TODO Clear current profile

    //Redirect to login
    window.location.href = "/login";
  }
}
class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Router>
          <div className="App">
            <Header />
            <Route exact path="/" component={Landing} />
            <div className="container">
              <Route exact path="/login" component={Login} />
              <Switch>
                <PrivateRoute exact path="/orderreceive" component={Receive} />
              </Switch>
              <Switch>
                <PrivateRoute exact path="/orderdeliver" component={Deliver} />
              </Switch>
              <Switch>
                <PrivateRoute exact path="/reports" component={Reports} />
              </Switch>
            </div>
            <Footer />
          </div>
          {/* <script>
            if ('serviceWorker' in navigator){" "}
            {window.addEventListener("load", function() {
              navigator.serviceWorker.register("/myservice-worker.js");
            })}
          </script> */}
        </Router>
      </Provider>
    );
  }
}

export default App;
