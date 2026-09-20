import { ImportCardResult, LiveUpdate } from "../userInterfaceTypes";

import * as React from "react";

import { toast } from 'react-toastify';

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

type NewLiveUpdateProps = {
    liveUpdates: LiveUpdate[],
    setLiveUpdates: React.Dispatch<React.SetStateAction<LiveUpdate[]>>,
    setPageStatus: React.Dispatch<React.SetStateAction<string>>,
    setCreatedLiveUpdate: React.Dispatch<React.SetStateAction<LiveUpdate | null>>,
}

function NewLiveUpdate ({liveUpdates, setPageStatus, setLiveUpdates, setCreatedLiveUpdate}: NewLiveUpdateProps) {

    const [newLiveUpdateEffectiveDate, setNewLiveUpdateDate] = React.useState('');    

    const newLiveUpdateHandler = async () => {

        const dateRegex = /\d{4}-((0\d)|(1[012]))-[012]\d/
        
        if (dateRegex.test(newLiveUpdateEffectiveDate)) {
            
            const createdLiveUpdate = await window.electronAPI.createLiveUpdate(newLiveUpdateEffectiveDate);

            if (createdLiveUpdate) {
                setPageStatus('Live update created! Ready to import cards');
                setLiveUpdates([...liveUpdates, createdLiveUpdate]);
                setCreatedLiveUpdate(createdLiveUpdate);
            }
            else {
                toast.error('Failed creating the live update!');
            }

        }
        else {
            toast.error('Please enter a valid YYYY-MM-DD');
        }

    }

    const liveUpdatesRows = liveUpdates.map(liveUpdate => {
        return <div key={liveUpdate.LiveUpdateID}>{liveUpdate.EffectiveDate}</div>
    })

    return (
        <div>
            <div>Previous Live Updates</div>
            <div>{liveUpdatesRows}</div>
            <div>
                <div>
                    <div><span>Date of newest Live Update:</span><input type="text" value={newLiveUpdateEffectiveDate} onChange={e => setNewLiveUpdateDate(e.target.value)}/></div>
                </div>
            </div>
            <div>
                <button onClick={newLiveUpdateHandler}>Submit</button>
            </div>
        </div>
    )

}