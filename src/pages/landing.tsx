import React from 'react';

import { CurrentPage, TournamentResult } from "../userInterfaceTypes"
import { TournamentRecordResults } from './tournament-results/tournamentRecordResults';

type LandingProps = {
    setCurrentPage: React.Dispatch<React.SetStateAction<CurrentPage>>,
}

export function Landing ({ setCurrentPage }: LandingProps) {

    React.useEffect(() => {

        const getRecentTournamentResults = async () => {

            const lastTournamentResults = await window.electronAPI.getTournamentResults({
                TeamName: "Lil Dicky",
                TournamentCount: 10,
            });
            setLastTournamentResults(lastTournamentResults);

        };

        getRecentTournamentResults();

    }, []);

    const [lastTournamentResults, setLastTournamentResults] = React.useState([] as TournamentResult[]);

    return (
        <div>
            <div className="font-bold text-xl my-2 w-40 m-auto text-center">
                Perfect Team Viewer
            </div>
            <div className="flex mx-40">
                <div className="text-center flex-1 mr-4"><button className="w-full mx-8 cursor-pointer bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full" onClick={() => setCurrentPage(CurrentPage.STATS_IMPORTER)}>Stats Importer</button></div>
                <div className="text-center flex-1 mr-4"><button className="w-full mx-8 cursor-pointer bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full" onClick={() => setCurrentPage(CurrentPage.TOURNAMENT_STATS)}>Tournament Stats</button></div>
                <div className="text-center flex-1 mr-4"><button className="w-full mx-8 cursor-pointer bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full" onClick={() => setCurrentPage(CurrentPage.LANDING)}>Season Stats</button></div>
                <div className="text-center flex-1 mr-4"><button className="w-full mx-8 cursor-pointer bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full" onClick={() => setCurrentPage(CurrentPage.CARD_IMPORTER)}>Card Importer</button></div>
            </div>
            <TournamentRecordResults showTournamentName={true} tournamentResults={lastTournamentResults} />
        </div>
    )
}