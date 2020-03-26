import React, { useState } from 'react';
import Page from '../components/Page';
import UserContainer from '../state/UserContainer';
import { Link } from 'react-router-dom';
import { Button, Input, Grid } from 'semantic-ui-react';
import TournamentsContainer from '../state/ActiveGamesContainer';
import { startTournament, joinTournament } from '../api';

function Tournaments() {
  const { userInfo } = UserContainer.useContainer();
  const { tournaments } = TournamentsContainer.useContainer();
  const [tournamentId, setTournamentId] = useState('');

  const onClickStart = (id: string) => () => {
    startTournament(id);
  };

  const onClickJoin = () => {
    joinTournament(tournamentId);
  };

  return (
    <Page>
      <div>{userInfo?.username} here are your tournaments</div>

      <Grid>
        <Grid.Row>
          <Grid.Column>
            <Input
              onChange={(_, { value }) => setTournamentId(value)}
              value={tournamentId}
              placeholder="id123456789"
            ></Input>
            <Button onClick={onClickJoin}>Join tournament</Button>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column>
            <Link to="/tournament/create">
              <Button>Create tournament</Button>
            </Link>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row columns={6}>
          {tournaments
            .filter(
              ({ isStarted, createdBy }) =>
                !isStarted && createdBy === userInfo?._id
            )
            .map(({ _id, name }) => (
              <Grid.Column key={_id}>
                <Button onClick={onClickStart(_id)}>Start "{name}"</Button>
              </Grid.Column>
            ))}
        </Grid.Row>
        {tournaments.map(({ _id, name, isStarted }) => (
          <Grid.Row key={_id} columns={6}>
            <Grid.Column>{_id}:</Grid.Column>
            <Grid.Column>
              "{name}" {!isStarted && '(pending)'}
            </Grid.Column>
          </Grid.Row>
        ))}
      </Grid>
    </Page>
  );
}

export default Tournaments;
