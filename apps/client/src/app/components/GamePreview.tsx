import React from 'react';
import { Card, Icon } from 'semantic-ui-react';
import Chessground from 'react-chessground';
import { GameInfo } from '../interfaces/game';
import styled from 'styled-components';
import UserContainer from '../state/UserContainer';
import { useHistory } from 'react-router';

const GamePreviewCard = styled(Card)`
  &&& {
    width: 328px;
  }
`;

interface Props {
  game: GameInfo;
}

function GamePreview({ game }: Props) {
  const { push } = useHistory();
  const { userInfo } = UserContainer.useContainer();

  const timeLeft =
    game.millisPerMove - (Date.now() - game.lastMoveDate.getTime());

  const isWhite = game.white === userInfo?._id;
  const handleClick = () => push(`/game/${game._id}`);

  return (
    <GamePreviewCard link onClick={handleClick}>
      <Chessground
        viewOnly
        width="328px"
        height="328px"
        orientation={isWhite ? 'white' : 'black'}
        fen={game.lastPosition}
      />
      <Card.Content extra>
        <Icon name="clock outline" />
        {timeLeft}
      </Card.Content>
    </GamePreviewCard>
  );
}

export default GamePreview;
