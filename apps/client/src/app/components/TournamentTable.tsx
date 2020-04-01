import React from 'react';
import {
  Segment,
  Header,
  Message,
  Menu,
  Table,
  Button,
  Icon,
  Card
} from 'semantic-ui-react';
import { Tournament } from '../interfaces/tournament';
import { GameInfo } from '../interfaces/game';
import styled from 'styled-components';
import TournamentsContainer from '../state/ActiveGamesContainer';
import UserContainer from '../state/UserContainer';
import GamePreview from './GamePreview';

const TournamentHeading = styled(Segment)`
  display: flex;
  justify-content: space-between;
`;

const isGameActive = (game: GameInfo) => {
  return (
    !game.outcome &&
    game.millisPerMove > Date.now() - game.lastMoveDate.getTime()
  );
};

interface Props {
  tournament: Tournament;
  onStart: () => void;
  onRefresh: () => void;
}

function TournamentTable({ tournament, onStart, onRefresh }: Props) {
  const { getTournamentGames } = TournamentsContainer.useContainer();
  const { userInfo } = UserContainer.useContainer();

  const games = getTournamentGames(tournament._id);
  const userGames = games.filter(
    game =>
      isGameActive(game) &&
      (game.black === userInfo?._id || game.white === userInfo?._id)
  );
  const isTournamentActive = games.some(isGameActive);

  return (
    <div>
      <TournamentHeading
        attached="top"
        color={
          isTournamentActive
            ? 'green'
            : !tournament.isStarted
            ? 'yellow'
            : undefined
        }
      >
        <Header style={{ marginBottom: 0 }}>{tournament.name}</Header>
        {isTournamentActive ? (
          <div>
            <Icon color="green" name="attention" />
            <span style={{ color: '#21BA45' }}>Active</span>
          </div>
        ) : (
          !tournament.isStarted && (
            <div>
              <Icon color="yellow" name="attention" />
              <span style={{ color: '#FBBD08' }}>Pending</span>
            </div>
          )
        )}
      </TournamentHeading>
      {!tournament.isStarted && tournament.createdBy === userInfo?._id && (
        <>
          <Message info attached>
            Share the link below to invite players. Start the tournament when
            ready.
          </Message>
          <Menu compact attached>
            <Menu.Item onClick={onRefresh} icon="refresh" />
            <Menu.Item>
              <a href={`/tournament/${tournament._id}/join`}>
                {// eslint-disable-next-line no-restricted-globals
                location.origin + `/tournament/${tournament._id}/join`}
              </a>
            </Menu.Item>
            <Menu.Item
              position="right"
              fitted="horizontally"
              style={{ flex: 1, paddingLeft: '0.5em', paddingRight: '0.5em' }}
            >
              <Button fluid primary onClick={onStart}>
                Start
              </Button>
            </Menu.Item>
          </Menu>
        </>
      )}
      {!!userGames.length && (
        <Segment attached>
          <Card.Group>
            {userGames.map(game => (
              <GamePreview key={game._id} game={game} />
            ))}
          </Card.Group>
        </Segment>
      )}
      <Table celled attached="bottom">
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>#</Table.HeaderCell>
            <Table.HeaderCell>Name</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {tournament.players.map((player, i) => (
            <Table.Row key={player._id}>
              <Table.Cell>{i + 1}</Table.Cell>
              <Table.Cell>{player.username}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </div>
  );
}

export default TournamentTable;
