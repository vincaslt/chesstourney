declare module 'react-chessground' {
  import { Config } from 'chessground/config';
  import * as cg from 'chessground/types';

  const val: React.SFC<Config & {
    onChange?: () => void;
    onMove?: (orig: cg.Key, dest: cg.Key, capturedPiece?: cg.Piece) => void;
    onDropNewPiece?: (piece: cg.Piece, key: cg.Key) => void;
    onSelect?: (key: cg.Key) => void;
    onInsert?: (elements: cg.Elements) => void;
  }>;
  export = val;
}
