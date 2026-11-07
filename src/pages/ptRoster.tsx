import React from 'react';
import { PtCardRatings } from '../userInterfaceTypes'

import DataTable from 'react-data-table-component';
import { TableColumn } from 'react-data-table-component';

export function PtRoster () {

    React.useEffect(() => {

        const getPtRoster = async () => {

            const ptRoster = await window.electronAPI.getPtRoster();
            setPtRoster(ptRoster);

        };

        getPtRoster();

    }, []);

    const getPositionColumns = () => {
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

    const [ptRoster, setPtRoster] = React.useState([] as PtCardRatings[]);
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
        { name: 'Card Title', selector: r => r.CardTitle, width: '400px', minWidth: '120px' },
        { name: 'CardValue', selector: r => r.CardValue, sortable: true },
        { name: 'Position', selector: r => r.Position, },
        { name: 'Bats', selector: r => r.Bats, },
        { name: 'Throws', selector: r => r.Throws, },
        { name: 'Total Batting', selector: r => r.TotalBattingRating, sortable: true},
        { name: 'On Base', selector: r => r.OnBaseRating, sortable: true},
        { name: 'Slugging', selector: r => r.SluggingRating, sortable: true},
        { name: 'TTO', selector: r => r.ThreeTrueRating, sortable: true},
        ...getPositionColumns()
    ]; 

    const filteredPtRoster = ptRoster.filter(r => {
        return 1 === 1
        && (!positionCheckbox.IsCCheckedFlag || r.RatingC)
        && (!positionCheckbox.Is1BCheckedFlag || r.Rating1B)
        && (!positionCheckbox.Is2BCheckedFlag || r.Rating2B)
        && (!positionCheckbox.Is3BCheckedFlag || r.Rating3B)
        && (!positionCheckbox.IsSSCheckedFlag || r.RatingSS)
        && (!positionCheckbox.IsLFCheckedFlag || r.RatingLF)
        && (!positionCheckbox.IsCFCheckedFlag || r.RatingCF)
        && (!positionCheckbox.IsRFCheckedFlag || r.RatingRF)
    });

    return (
        <>
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
            <DataTable columns={columns} data={filteredPtRoster} pagination />
        </>
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