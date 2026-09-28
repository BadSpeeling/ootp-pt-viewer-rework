import { ImportCardResult, LiveUpdate } from "../../userInterfaceTypes";

import * as React from "react";

import { toast } from 'react-toastify';
import { NewLiveUpdate } from "./newLiveUpdate";

export function CardImporter () {

    const [liveUpdates, setLiveUpdates] = React.useState([] as LiveUpdate[]);
    const [importResult, setImportResult] = React.useState(null as null | ImportCardResult);
    const [pageStatus, setPageStatus] = React.useState('Ready to import cards');
    const [createdLiveUpdate, setCreatedLiveUpdate] = React.useState(null as null | LiveUpdate)

    const importCardHandler = async () => {

        const importResult = await window.electronAPI.importCards();
        setImportResult(importResult);

        if (importResult === ImportCardResult.SUCCESS) {
            setPageStatus('The OOTP card import was successful');
        }
        else if (importResult === ImportCardResult.LIVE_UPDATE_NEEDED) {

            setPageStatus('A live update was detected.  Please provide the date of the live update')

            const liveUpdates = await window.electronAPI.getLiveUpdates();
            setLiveUpdates(liveUpdates);

        }
        else if (importResult === ImportCardResult.FAIL) {
            toast.error('There was an error attempting to import OOTP cards');
        }

    }

    const showImportCardsButton = (importResult === null || importResult === ImportCardResult.FAIL) || (importResult === ImportCardResult.LIVE_UPDATE_NEEDED && createdLiveUpdate !== null);

    return (
        <div className="m-8">
            <div>{pageStatus}</div>
            { showImportCardsButton && <div><button onClick={importCardHandler}>Import Cards</button></div>}
            { (importResult === ImportCardResult.LIVE_UPDATE_NEEDED && createdLiveUpdate === null) && <NewLiveUpdate liveUpdates={liveUpdates} setPageStatus={setPageStatus} setLiveUpdates={setLiveUpdates} setCreatedLiveUpdate={setCreatedLiveUpdate} /> }
        </div>
    )

}