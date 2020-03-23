import React from 'react';
import 'fomantic-ui-css/semantic.css';
import { Switch, Route } from 'react-router';
import { BrowserRouter } from 'react-router-dom';
import Game from './pages/Game';
import Login from './pages/Login';
import UserContainer from './state/UserContainer';
import { Loader } from 'semantic-ui-react';

const Routes = () => {
  const { loading, userInfo } = UserContainer.useContainer();

  console.log(userInfo, loading);

  return loading ? (
    <Loader active inverted>
      Loading
    </Loader>
  ) : (
    <BrowserRouter>
      <Switch>
        <Route path="/game/:id">
          <Game />
        </Route>
        <Route path="/">
          <Login />
        </Route>
      </Switch>
    </BrowserRouter>
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
