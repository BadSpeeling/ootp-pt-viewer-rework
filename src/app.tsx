import React from 'react';
import { createRoot } from 'react-dom/client';

import { CurrentPage } from './userInterfaceTypes'
import { Landing, CardImporter } from './pages'

function App () {

    const [currentPage, setCurrentPage] = React.useState(CurrentPage.LANDING)

    return (
        <div>
            {currentPage === CurrentPage.LANDING && <div><Landing setCurrentPage={setCurrentPage} /></div>}
            {currentPage === CurrentPage.CARD_IMPORTER && <div><CardImporter /></div>}
        </div>
    )

}

const root = createRoot(document.body);
root.render(<App/>);

(async () => {
    console.log(await window.electronAPI.get())
})()