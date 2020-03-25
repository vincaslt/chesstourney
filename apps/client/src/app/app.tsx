import React from 'react';
import { Switch, Route } from 'react-router';
import { BrowserRouter } from 'react-router-dom';
import Game from './pages/Game';
import Login from './pages/Login';
import UserContainer from './state/UserContainer';
import { Loader } from 'semantic-ui-react';
import Landing from './pages/Landing';
import Register from './pages/Register';
import Tournaments from './pages/Tournaments';

import 'fomantic-ui-css/semantic.css';

const Routes = () => {
  const { loading, userInfo } = UserContainer.useContainer();

  const publicRoutes = (
    <Switch>
      <Route exact path="/">
        <Landing />
      </Route>
      <Route exact path="/login">
        <Login />
      </Route>
      <Route exact path="/register">
        <Register />
      </Route>
    </Switch>
  );

  const privateRoutes = (
    <Switch>
      <Route exact path="/">
        <Tournaments />
      </Route>
      <Route exact path="/game/:id">
        <Game />
      </Route>
    </Switch>
  );

  return loading ? (
    <Loader active inverted>
      Loading
    </Loader>
  ) : (
    <BrowserRouter>{userInfo ? privateRoutes : publicRoutes}</BrowserRouter>
  );
};

export const App = () => {
  return (
    <UserContainer.Provider>
      <Routes />
    </UserContainer.Provider>
  );
};

export default App;
