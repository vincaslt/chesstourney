import React from 'react';
import Page from '../components/Page';
import { Link } from 'react-router-dom';

function Landing() {
  return (
    <Page>
      Create your correspondence chess tournament:{' '}
      <Link to="/register">Register</Link> | <Link to="/login">Login</Link>
    </Page>
  );
}

export default Landing;
