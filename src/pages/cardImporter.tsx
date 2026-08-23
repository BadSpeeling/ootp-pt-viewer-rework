import { LiveUpdate } from "../userInterfaceTypes";

import * as React from "react";

export function CardImporter () {

    const [liveUpdates, setLiveUpdates] = React.useState([] as LiveUpdate[]);

    React.useEffect(() => {

        (async () => {
            const liveUpdates = await window.electronAPI.getLiveUpdates();
            setLiveUpdates(liveUpdates);
        })()

    }, []);


    return (
        <div className="m-8">
            { 
                liveUpdates.map(liveUpdate => {
                    return <div key={liveUpdate.LiveUpdateID}>{liveUpdate.EffectiveDate}</div>
                })
            }
        </div>
    )

}