import * as React from "react";

import { toast } from 'react-toastify';

import DataTable from 'react-data-table-component';
import { TableColumn } from 'react-data-table-component';
import { Bats, Throws, Position } from "../../backend/types";
import { TournamentTypePicker } from "../tournamentTypePicker";
import { TournamentBattingStats, TournamentType } from '../../userInterfaceTypes'
import { TournamentDatePicker } from "../tournamentDatePicker";

export function TournamentStats () {

    const [playerStats,setPlayerStats] = React.useState([] as TournamentBattingStats[]);
    // const [headers, setHeaders] = React.useState([] as TableColumn<TournamentBattingStats>[])
    const [tournamentTypes, setTournamentTypes] = React.useState([] as TournamentType[]);
    const [selectedTournamentType, setSelectedTournamentType] = React.useState(null as null | TournamentType);
    const [statsTypeID, setStatsType] = React.useState(0);
    const [qualifierValue, setQualifierValue] = React.useState('');
    const [positions, setPositions] = React.useState([] as string[])
    const [tournamentStartDate, setTournamentStartDate] = React.useState('1970-01-01');
    const [tournamentEndDate, setTournamentEndDate] = React.useState('2099-01-01');

    const columns: TableColumn<TournamentBattingStats>[] = [
        { name: 'Card Title', selector: r => r.CardTitle, width: '300px', minWidth: '120px' },
        { name: 'CardValue', selector: r => r.CardValue, },
        { name: 'Position', selector: r => r.Position, },
        { name: 'Bats', selector: r => r.Bats, },
        { name: 'PA', selector: r => r.PA, sortable: true },
        { name: 'AVG', selector: r => r.AVG, },
        { name: 'OBP', selector: r => r.OBP, },
        { name: 'SLG', selector: r => r.SLG, },
        { name: 'OPS', selector: r => r.OPS, },
    ];

    React.useEffect(() => {
        
        const getTournamentTypes = async () => {

            const tournamentTypes = await window.electronAPI.getTournamentTypes();
            setTournamentTypes(tournamentTypes);

        }

        getTournamentTypes();

    }, []);

    const dataLoadHandler = async () => {

        if (!selectedTournamentType?.TournamentTypeID) {
            toast.error("Select a tournament!");
        }

        const statsResult = await getPlayerStats(selectedTournamentType!.TournamentTypeID, statsTypeID, qualifierValue.length > 0 ? parseInt(qualifierValue) : 0, 'ANY', tournamentStartDate, tournamentEndDate);
        setPlayerStats(statsResult);

    }
    
    const setPositionsHandler = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const options = Array.from(e.target.selectedOptions, option => option.value);
        setPositions(options);
    };

    return (
        <>
            <div className="m-4">
                <div className="mb-2"><TournamentTypePicker selectedTournamentType={selectedTournamentType} setSelectedTournamentType={setSelectedTournamentType} tournaments={tournamentTypes}/></div>
                <div className="mb-2"><TournamentDatePicker tournamentStartDate={tournamentStartDate} setTournamentStartDate={setTournamentStartDate} tournamentEndDate={tournamentEndDate} setTournamentEndDate={setTournamentEndDate}/></div>
                <div className="mb-2">
                    <select className="border-gray border-1 rounded-md" value={statsTypeID} onChange={(e) => setStatsType(parseInt(e.target.value))}>
                        <option value={0}>Batting</option>
                        <option value={1}>Pitching</option>
                    </select>
                </div>
                <div className="mb-2">
                    <select className="border-gray border-1 rounded-md" multiple value={positions.map(position => position.toString())} onChange={setPositionsHandler}>
                        <option value={1}>P</option>
                        <option value={2}>C</option>
                        <option value={3}>1B</option>
                        <option value={4}>2B</option>
                        <option value={5}>3B</option>
                        <option value={6}>SS</option>
                        <option value={7}>LF</option>
                        <option value={8}>CF</option>
                        <option value={9}>RF</option>
                        <option value={10}>DH</option>
                    </select>
                </div>
                {/* <div>Min {getQualifierName(statsTypeID)} to qualify: <input className="border-gray border-1 rounded-md" value={qualifierValue} onChange={(e) => setQualifierValue(e.target.value)}/></div> */}
            </div>
            { 
                playerStats.length > 0 &&
                <div className="m-4">
                    <DataTable  columns={columns} data={playerStats} pagination />
                </div>
            }
            <div className="m-4">
                <button className="cursor-pointer bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full" onClick={dataLoadHandler}>Load</button>
            </div>
        </>
    )

}

async function getPlayerStats (tournamentTypeID: number, statsTypeID: number, qualifierValue: number, positions: 'ANY'|Position[], tournamentStartDate: string, tournamentEndDate: string) {

    const response = await window.electronAPI.getTournamentBattingStats({
        TournamentTypeID: tournamentTypeID, 
        Positions: positions, 
        TournamentTimeRange: {
            StartDate:tournamentStartDate,
            EndDate:tournamentEndDate
        }
    });
    return response;

}