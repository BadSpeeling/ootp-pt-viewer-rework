import { LiveUpdate } from "../../userInterfaceTypes";

import * as React from "react";

import { toast } from 'react-toastify';

type NewLiveUpdateProps = {
    liveUpdates: LiveUpdate[],
    setLiveUpdates: React.Dispatch<React.SetStateAction<LiveUpdate[]>>,
    setPageStatus: React.Dispatch<React.SetStateAction<string>>,
    setCreatedLiveUpdate: React.Dispatch<React.SetStateAction<LiveUpdate | null>>,
}

export function NewLiveUpdate ({liveUpdates, setPageStatus, setLiveUpdates, setCreatedLiveUpdate}: NewLiveUpdateProps) {

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