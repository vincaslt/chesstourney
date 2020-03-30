import React from 'react';
import {
  Segment,
  Header,
  Message,
  Menu,
  Table,
  Icon,
  Button
} from 'semantic-ui-react';
import { Tournament } from '../interfaces/tournament';
import { useHistory } from 'react-router';

interface Props {
  tournament: Tournament;
  onStart: () => void;
  onRefresh: () => void;
}

function TournamentTable({ tournament, onStart, onRefresh }: Props) {
  const h = useHistory();
  console.log(h);
  return (
    <div>
      <Segment attached="top">
        <Header>{tournament.name}</Header>
      </Segment>
      {!tournament.isStarted && (
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
