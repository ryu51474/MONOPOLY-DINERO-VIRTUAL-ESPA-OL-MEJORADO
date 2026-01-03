import React from "react";
import { Card } from "react-bootstrap";
import ConnectedStateDot from "../../components/ConnectedStateDot";
import { formatCurrency, getPlayerEmoji } from "../../utils";

interface IPlayerCardProps {
  name: string;
  playerId?: string;
  connected: boolean | null;
  balance: number;
  onClick: () => void;
}

const PlayerCard: React.FC<IPlayerCardProps> = ({ name, playerId, connected, balance, onClick }) => {
  const emoji = playerId ? getPlayerEmoji(playerId) : null;

  return (
    <Card className="player-card text-center">
      {connected !== null && <ConnectedStateDot connected={connected} className="m-2" />}
      <Card.Body className="p-3" onClick={onClick}>
        <div className="player-name-with-emoji">
          {playerId && emoji ? (
            <>
              <span className="player-emoji" role="img" aria-label="animal">
                {emoji}
              </span>
              <span>{name}</span>
              {name.length <= 5 && (
                <span className="player-emoji-end" role="img" aria-label="animal">
                  {emoji}
                </span>
              )}
            </>
          ) : (
            name
          )}
        </div>
        <div>{Number.isFinite(balance) ? formatCurrency(balance) : "∞"}</div>
      </Card.Body>
    </Card>
  );
};

export default PlayerCard;
