import React from 'react';
import { createRoot } from 'react-dom/client';

import { CurrentPage } from './userInterfaceTypes'
import { Landing, CardImporter, StatsImporter } from './pages'

import { ToastContainer } from 'react-toastify';

function App () {

    const [currentPage, setCurrentPage] = React.useState(CurrentPage.LANDING)

    return (
        <div>
            <ToastContainer />
            {currentPage === CurrentPage.LANDING && <div><Landing setCurrentPage={setCurrentPage} /></div>}
            {currentPage === CurrentPage.CARD_IMPORTER && <div><CardImporter /></div>}
            {currentPage === CurrentPage.STATS_IMPORTER && <div><StatsImporter /></div>}
        </div>
    )

}

const root = createRoot(document.body);
root.render(<App/>);

(async () => {
    console.log(await window.electronAPI.get())
})()