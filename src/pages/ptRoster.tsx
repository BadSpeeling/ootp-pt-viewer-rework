import React from 'react';
import { PtCardRatings, PtCardRosterStatus } from '../userInterfaceTypes'

import DataTable from 'react-data-table-component';
import { TableColumn } from 'react-data-table-component';
import { PtCard } from './ptCard';
import { Position, Bats, Throws, StatsType } from '../backend/types'

export function PtRoster () {

    React.useEffect(() => {

        const getPtRoster = async () => {

            const ptRoster = await window.electronAPI.getPtRoster();
            setPtRoster(ptRoster);

        };

        getPtRoster();

    }, []);

    const getPositionRatings = () => {
        const positionColumns: TableColumn<PtCardRatings>[] = [];

        if (positionCheckbox.IsCCheckedFlag) {
            positionColumns.push({ name: 'C Rating', selector: r => r.RatingC, sortable: true})
        }
        if (positionCheckbox.Is1BCheckedFlag) {
            positionColumns.push({ name: '1B Rating', selector: r => r.Rating1B, sortable: true})
        }
        if (positionCheckbox.Is2BCheckedFlag) {
            positionColumns.push({ name: '2B Rating', selector: r => r.Rating2B, sortable: true})
        }
        if (positionCheckbox.Is3BCheckedFlag) {
            positionColumns.push({ name: '3B Rating', selector: r => r.Rating3B, sortable: true})
        }
        if (positionCheckbox.IsSSCheckedFlag) {
            positionColumns.push({ name: 'SS Rating', selector: r => r.RatingSS, sortable: true})
        }
        if (positionCheckbox.IsLFCheckedFlag) {
            positionColumns.push({ name: 'LF Rating', selector: r => r.RatingLF, sortable: true})
        }
        if (positionCheckbox.IsCFCheckedFlag) {
            positionColumns.push({ name: 'CF Rating', selector: r => r.RatingCF, sortable: true})
        }
        if (positionCheckbox.IsRFCheckedFlag) {
            positionColumns.push({ name: 'RF Rating', selector: r => r.RatingRF, sortable: true})
        }

        return positionColumns;
    }

    const getSummedRatings = () => {
        if (statsType === StatsType.PITCHING) {
            const ret: TableColumn<PtCardRatings>[] = [
                { name: 'Total Pitching', selector: r => r.TotalPitchingRating, sortable: true, width:'50%'}
            ]
            return ret;
        }
        else if (statsType === StatsType.BATTING) {
            const ret: TableColumn<PtCardRatings>[] = [    
                { name: 'Total Batting', selector: r => r.TotalBattingRating, sortable: true, width:'12.5%'},
                { name: 'On Base', selector: r => r.OnBaseRating, sortable: true, width:'12.5%'},
                { name: 'Slugging', selector: r => r.SluggingRating, sortable: true, width:'12.5%'},
                { name: 'TTO', selector: r => r.ThreeTrueRating, sortable: true, width:'12.5%'}
            ];
            return ret;  
        }
        else {
            return [];
        }
    }

    const [statsType, setStatsType] = React.useState(StatsType.BATTING);
    const [ptRoster, setPtRoster] = React.useState([] as PtCardRatings[]);
    const [selectedPtCard, setSelectedPtCard] = React.useState(null as PtCardRatings | null);
    const [positionCheckbox, setPositionCheckbox] = React.useState({
        IsCCheckedFlag: false,
        Is1BCheckedFlag: false,
        Is2BCheckedFlag: false,
        Is3BCheckedFlag: false,
        IsSSCheckedFlag: false,
        IsLFCheckedFlag: false,
        IsCFCheckedFlag: false,
        IsRFCheckedFlag: false,        
    } as PositionCheckbox)

    const columns: TableColumn<PtCardRatings>[] = [
        { name: 'Card Title', cell: r => (r.CardStatus === PtCardRosterStatus.ACTIVE_ROSTER || r.CardStatus === PtCardRosterStatus.RESERVE_ROSTER) ? <b>{r.CardTitle}</b> : <div>{r.CardTitle}</div>, width: '30%' },
        { name: 'OVR', selector: r => r.CardValue, width: '5%' },
        { name: 'POS', selector: r => Position[r.Position], width: '5%' },
        { name: 'B', selector: r => Bats[r.Bats], width: '5%' },
        { name: 'T', selector: r => Throws[r.Throws], width: '5%' },
        ...getSummedRatings(),
        ...getPositionRatings()
    ];
    
    const sortByRatings = (a: PtCardRatings, b: PtCardRatings) => {
        if (statsType === StatsType.PITCHING) {
            return b.TotalPitchingRating - a.TotalPitchingRating; 
        }
        else if (statsType === StatsType.BATTING) {
            return b.TotalBattingRating - a.TotalBattingRating;
        }
        else {
            return 0;
        }
    }

    const filteredPtRoster = ptRoster
        .filter(r => {

            if (statsType === StatsType.PITCHING) {
                return r.Position === 1;
            }
            else if (statsType === StatsType.BATTING) {
                return 1 === 1
                && (r.Position !== 1)
                && (!positionCheckbox.IsCCheckedFlag || r.RatingC)
                && (!positionCheckbox.Is1BCheckedFlag || r.Rating1B)
                && (!positionCheckbox.Is2BCheckedFlag || r.Rating2B)
                && (!positionCheckbox.Is3BCheckedFlag || r.Rating3B)
                && (!positionCheckbox.IsSSCheckedFlag || r.RatingSS)
                && (!positionCheckbox.IsLFCheckedFlag || r.RatingLF)
                && (!positionCheckbox.IsCFCheckedFlag || r.RatingCF)
                && (!positionCheckbox.IsRFCheckedFlag || r.RatingRF)
            }

        });

    return (
        <div>
            <div style={{width:"1140px"}}>
                {
                    statsType === StatsType.BATTING && 
                    <div>
                        <input type="checkbox" checked={positionCheckbox.IsCCheckedFlag} onChange={(e) => {setPositionCheckbox({...positionCheckbox, IsCCheckedFlag: e.target.checked})}}/> C
                        <input type="checkbox" checked={positionCheckbox.Is1BCheckedFlag} onChange={(e) => {setPositionCheckbox({...positionCheckbox, Is1BCheckedFlag: e.target.checked})}}/> 1B
                        <input type="checkbox" checked={positionCheckbox.Is2BCheckedFlag} onChange={(e) => {setPositionCheckbox({...positionCheckbox, Is2BCheckedFlag: e.target.checked})}}/> 2B
                        <input type="checkbox" checked={positionCheckbox.Is3BCheckedFlag} onChange={(e) => {setPositionCheckbox({...positionCheckbox, Is3BCheckedFlag: e.target.checked})}}/> 3B
                        <input type="checkbox" checked={positionCheckbox.IsSSCheckedFlag} onChange={(e) => {setPositionCheckbox({...positionCheckbox, IsSSCheckedFlag: e.target.checked})}}/> SS
                        <input type="checkbox" checked={positionCheckbox.IsLFCheckedFlag} onChange={(e) => {setPositionCheckbox({...positionCheckbox, IsLFCheckedFlag: e.target.checked})}}/> LF
                        <input type="checkbox" checked={positionCheckbox.IsCFCheckedFlag} onChange={(e) => {setPositionCheckbox({...positionCheckbox, IsCFCheckedFlag: e.target.checked})}}/> CF
                        <input type="checkbox" checked={positionCheckbox.IsRFCheckedFlag} onChange={(e) => {setPositionCheckbox({...positionCheckbox, IsRFCheckedFlag: e.target.checked})}}/> RF
                    </div>
                }
                <div>
                    <select className="border-gray border-1 rounded-md" value={statsType} onChange={(e) => setStatsType(parseInt(e.target.value))}>
                        <option value={StatsType.BATTING}>Batting</option>
                        <option value={StatsType.PITCHING}>Pitching</option>
                    </select>
                </div>
                <DataTable columns={columns} data={filteredPtRoster.sort(sortByRatings)} onRowClicked={(row, e) => {
                    setSelectedPtCard(row);
                }} pagination />
            </div>
            {
                selectedPtCard && <PtCard ptCard={selectedPtCard} />
            }
            {
                filteredPtRoster
                    .filter(r => r.CardStatus === PtCardRosterStatus.ACTIVE_ROSTER)
                    .sort((a,b) => {
                       
                        if (a.Position != b.Position) {
                            return a.Position - b.Position;
                        }

                        return b.CardValue - a.CardValue;

                    })
                    .map(myCard => <div>{myCard.CardTitle}</div>)
            }
        </div>
    )

}

type PositionCheckbox = {
    IsCCheckedFlag: boolean,
    Is1BCheckedFlag: boolean,
    Is2BCheckedFlag: boolean,
    Is3BCheckedFlag: boolean,
    IsSSCheckedFlag: boolean,
    IsLFCheckedFlag: boolean,
    IsCFCheckedFlag: boolean,
    IsRFCheckedFlag: boolean,
    IsDHCheckedFlag: boolean,
}