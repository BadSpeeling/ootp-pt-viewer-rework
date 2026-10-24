import React from 'react';
import { createRoot } from 'react-dom/client';

import { CurrentPage, TournamentResult } from './userInterfaceTypes'
import { Landing, CardImporter, StatsImporter, TournamentStats } from './pages'

import { ToastContainer } from 'react-toastify';

function App () {

    React.useEffect(() => {

        const getRecentTournamentResults = async () => {

            const currDate = new Date();
            currDate.setDate(currDate.getDate() - 7);

            const recentTournamentResults = await window.electronAPI.getTournamentResults({
                TeamName: "Lil Dicky",
                Timeframe: {
                    StartDate: currDate.toISOString().slice(0, 10),
                    EndDate: '2099-12-31',
                }
            });
            setRecentTournamentResults(recentTournamentResults);

        };

        getRecentTournamentResults();

    }, []);

    const [currentPage, setCurrentPage] = React.useState(CurrentPage.LANDING)
    const [recentTournamentResults, setRecentTournamentResults] = React.useState([] as TournamentResult[]);

    return (
        <div>
            <ToastContainer />
            {currentPage === CurrentPage.LANDING && <div><Landing setCurrentPage={setCurrentPage} /></div>}
            {currentPage === CurrentPage.CARD_IMPORTER && <div><CardImporter /></div>}
            {currentPage === CurrentPage.STATS_IMPORTER && <div><StatsImporter /></div>}
            {currentPage === CurrentPage.TOURNAMENT_STATS && <div><TournamentStats /></div>}
            <table>
                <tr>
                    <th>Tournament</th>
                    <th>Date</th>
                    <th>W</th>
                    <th>L</th>
                </tr>
            { recentTournamentResults.map( t => {
                return (
                    <tr>
                        <td >{t.TournamentName}</td>
                        <td >{t.TournamentStartDate}</td>
                        <td>{t.W}</td>
                        <td >{t.L}</td>
                    </tr>
                )
            }) }
            </table>
        </div>
    )

}

const root = createRoot(document.body);
root.render(<App/>);

(async () => {
    console.log(await window.electronAPI.get())
})()