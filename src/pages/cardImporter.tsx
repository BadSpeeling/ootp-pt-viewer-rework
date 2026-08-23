import { LiveUpdate } from "../userInterfaceTypes";

import * as React from "react";

export function CardImporter () {

    const [liveUpdates, setLiveUpdates] = React.useState([] as LiveUpdate[]);

    React.useEffect(() => {

        (async () => {
            //const liveUpdates = await window.electronAPI.getLiveUpdates();
            //setLiveUpdates(liveUpdates);
        })()

    }, []);

    const importCardHandler = async () => {
        console.log(await window.electronAPI.importCards());
    }

    return (
        <div className="m-8">
            <div><button onClick={importCardHandler}>Import Cards</button></div>
            { 
                liveUpdates.map(liveUpdate => {
                    return <div key={liveUpdate.LiveUpdateID}>{liveUpdate.EffectiveDate}</div>
                })
            }
        </div>
    )

}