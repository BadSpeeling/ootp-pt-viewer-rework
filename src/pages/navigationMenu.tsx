import React from 'react';

import { CurrentPage } from "../userInterfaceTypes"

type NavigationMenuProps = {
    setCurrentPage: React.Dispatch<React.SetStateAction<CurrentPage>>,
}

export function NavigationMenu ({ setCurrentPage }: NavigationMenuProps) {

    return (
        <div className="flex mx-40">
            <div style={{display:"inline-block", marginRight:"5px"}}><button onClick={() => setCurrentPage(CurrentPage.STATS_IMPORTER)}>Stats Importer</button></div>
            <div style={{display:"inline-block", marginRight:"5px"}}><button onClick={() => setCurrentPage(CurrentPage.TOURNAMENT_STATS)}>Tournament Stats</button></div>
            <div style={{display:"inline-block", marginRight:"5px"}}><button onClick={() => setCurrentPage(CurrentPage.LANDING)}>Season Stats</button></div>
            <div style={{display:"inline-block", marginRight:"5px"}}><button onClick={() => setCurrentPage(CurrentPage.CARD_IMPORTER)}>Card Importer</button></div>
            <div style={{display:"inline-block", marginRight:"5px"}}><button onClick={() => setCurrentPage(CurrentPage.PT_ROSTER)}>PT Roster</button></div>
        </div>
    )

}