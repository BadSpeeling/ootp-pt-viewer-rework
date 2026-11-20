import React from 'react';

import { TournamentRecord, TournamentResult } from "../userInterfaceTypes"
import { TournamentRecordResults } from './tournament-results/tournamentRecordResults';

type LandingProps = {
    setTournamentResult: React.Dispatch<React.SetStateAction<TournamentResult | null>>,
}

export function Landing ({ setTournamentResult }: LandingProps) {

    React.useEffect(() => {

        const getRecentTournamentResults = async () => {

            const lastTournamentResults = await window.electronAPI.getLatestTournamentResults({
                TeamName: "Lil Dicky",
                TournamentCount: 10,
            });
            setLastTournamentResults(lastTournamentResults);

        };

        getRecentTournamentResults();

    }, []);

    const [lastTournamentResults, setLastTournamentResults] = React.useState([] as TournamentRecord[]);

    return (
        <div>
            <div className="font-bold text-xl my-2 w-40 m-auto text-center">
                Perfect Team Viewer
            </div>
            <TournamentRecordResults showTournamentName={true} tournamentResults={lastTournamentResults} setTournamentResult={setTournamentResult} />
        </div>
    )
}