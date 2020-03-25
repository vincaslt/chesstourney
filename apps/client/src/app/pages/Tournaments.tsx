import React from 'react';
import Page from '../components/Page';
import UserContainer from '../state/UserContainer';

function Tournaments() {
  const { userInfo } = UserContainer.useContainer();

  return <Page>{userInfo?.username} here are your tournaments</Page>;
}

export default Tournaments;
