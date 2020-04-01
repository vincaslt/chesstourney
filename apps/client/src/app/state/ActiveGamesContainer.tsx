import { createContainer } from 'unstated-next';
import { useState, useEffect } from 'react';
import { getUserTournaments } from '../api';
import { useLoading } from '../utils/useLoading';
import { GameInfo } from '../interfaces/game';
import { Tournament } from '../interfaces/tournament';

function useTournaments() {
  const [activeGames, setActiveGames] = useState<GameInfo[]>([]);
  const [tournamentGames, setTournamentGames] = useState<GameInfo[]>([]);
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [loading, withLoading] = useLoading(true);

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');

    if (accessToken) {
      withLoading(
        getUserTournaments().then(({ activeGames, tournaments, games }) => {
          setActiveGames(activeGames);
          setTournaments(tournaments);
          setTournamentGames(games);
        })
      );
    }
  }, [withLoading]);

  const getTournamentGames = (tournamentId: string) => {
    return tournamentGames.filter(game => game.tournament === tournamentId);
  };

  return {
    activeGames,
    tournaments,
    tournamentGames,
    loading,
    getTournamentGames
  };
}

const TournamentsContainer = createContainer(useTournaments);

export default TournamentsContainer;
