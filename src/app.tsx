import React from 'react';
import { createRoot } from 'react-dom/client';

import { CurrentPage, TournamentResult } from './userInterfaceTypes'
import { Landing, CardImporter, StatsImporter, TournamentStats, PtRoster } from './pages'

import { ToastContainer } from 'react-toastify';
import { TournamentResult as TournamentResultUI } from './pages/tournament-results/tournamentResult';

function App () {

    const [currentPage, setCurrentPage] = React.useState(CurrentPage.LANDING)
    const [tournamentResult, setTournamentResult] = React.useState(null as TournamentResult|null);

    React.useEffect(() => {
        if (tournamentResult != null) {
            setCurrentPage(CurrentPage.TOURNAMENT_RESULT);
        }
    }, [tournamentResult]);

    return (
        <div>
            <ToastContainer />
            {currentPage === CurrentPage.LANDING && <div><Landing setTournamentResult={setTournamentResult} setCurrentPage={setCurrentPage} /></div>}
            {currentPage === CurrentPage.CARD_IMPORTER && <div><CardImporter /></div>}
            {currentPage === CurrentPage.STATS_IMPORTER && <div><StatsImporter /></div>}
            {currentPage === CurrentPage.TOURNAMENT_STATS && <div><TournamentStats /></div>}
            {currentPage === CurrentPage.PT_ROSTER && <div><PtRoster /></div>}
            {currentPage === CurrentPage.TOURNAMENT_RESULT && <div><TournamentResultUI tournamentResult={tournamentResult!}/></div>}
        </div>
    )

}

const root = createRoot(document.body);
root.render(<App/>);

(async () => {
    console.log(await window.electronAPI.get())
})()