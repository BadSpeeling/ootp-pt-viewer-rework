import * as React from "react";

import { toast } from 'react-toastify';

import DataTable from 'react-data-table-component';
import { TableColumn } from 'react-data-table-component';
import { Bats, Throws, Position, StatsType } from "../../backend/types";
import { TournamentTypePicker } from "../tournamentTypePicker";
import { TournamentBattingStats, TournamentPitchingStats, TournamentResult, TournamentType, } from '../../userInterfaceTypes'
import { TournamentDatePicker } from "../tournamentDatePicker";
import { TournamentRecordResults } from "./tournamentRecordResults";

export function TournamentStats () {

    const [teamName,setTeamName] = React.useState('');

    const [battingStats,setBattingStats] = React.useState([] as TournamentBattingStats[]);
    const [pitchingStats,setPitchingStats] = React.useState([] as TournamentPitchingStats[]);
    const [tournamentTypes, setTournamentTypes] = React.useState([] as TournamentType[]);
    const [selectedTournamentType, setSelectedTournamentType] = React.useState(null as null | TournamentType);
    const [statsTypeID, setStatsType] = React.useState(StatsType.BATTING);
    const [qualifierValue, setQualifierValue] = React.useState('');
    const [positions, setPositions] = React.useState([] as string[])
    const [tournamentStartDate, setTournamentStartDate] = React.useState('1970-01-01');
    const [tournamentEndDate, setTournamentEndDate] = React.useState('2099-01-01');
    const [recentTournamentResults, setRecentTournamentResults] = React.useState([] as TournamentResult[]);

    const columns = getHeaders(statsTypeID);

    React.useEffect(() => {
        
        const getTournamentTypes = async () => {

            const tournamentTypes = await window.electronAPI.getTournamentTypes();
            setTournamentTypes(tournamentTypes);

        }
        
        getTournamentTypes();

    }, []);

    React.useEffect(() => {

        if (selectedTournamentType) {
        
            getRecentTournamentResults(selectedTournamentType!.TournamentTypeID);
            setBattingStats([]);
            setPitchingStats([]);

        }

    }, [selectedTournamentType]);

    const getRecentTournamentResults = async (tournamentTypeID: number) => {

        const currDate = new Date();
        currDate.setDate(currDate.getDate() - 7);

        const recentTournamentResults = await window.electronAPI.getTournamentResults({
            TeamName: "Lil Dicky",
            Timeframe: {
                StartDate: currDate.toISOString().slice(0, 10),
                EndDate: '2099-12-31',
            },
            TournamentTypeID: tournamentTypeID,
        });
        setRecentTournamentResults(recentTournamentResults);

    };

    const dataLoadHandler = async () => {

        if (!selectedTournamentType?.TournamentTypeID) {
            toast.error("Select a tournament!");
        }
        
        if (statsTypeID === StatsType.BATTING) {
            const statsResult = await getBattingStats(selectedTournamentType!.TournamentTypeID, qualifierValue.length > 0 ? parseInt(qualifierValue) : 0, 'ANY', tournamentStartDate, tournamentEndDate, teamName);
            setBattingStats(statsResult);
        }
        else if (statsTypeID === StatsType.PITCHING) {
            const statsResult = await getPitchingStats(selectedTournamentType!.TournamentTypeID, qualifierValue.length > 0 ? parseInt(qualifierValue) : 0, tournamentStartDate, tournamentEndDate, teamName);
            setPitchingStats(statsResult);
        }

    }
    
    const setPositionsHandler = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const options = Array.from(e.target.selectedOptions, option => option.value);
        setPositions(options);
    };

    return (
        <>
            <div>
                <div className="mb-2"><TournamentTypePicker selectedTournamentType={selectedTournamentType} setSelectedTournamentType={setSelectedTournamentType} tournaments={tournamentTypes}/></div>
                <TournamentRecordResults showTournamentName={false} tournamentResults={recentTournamentResults} />
            </div>
            <div>
                <div className="m-4">
                    <div>Data for team: <input value={teamName} onChange={(e) => setTeamName(e.target.value)} /></div>
                    <div className="mb-2"><TournamentDatePicker tournamentStartDate={tournamentStartDate} setTournamentStartDate={setTournamentStartDate} tournamentEndDate={tournamentEndDate} setTournamentEndDate={setTournamentEndDate}/></div>
                    <div className="mb-2">
                        <select className="border-gray border-1 rounded-md" value={statsTypeID} onChange={(e) => setStatsType(parseInt(e.target.value))}>
                            <option value={StatsType.BATTING}>Batting</option>
                            <option value={StatsType.PITCHING}>Pitching</option>
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
                    (battingStats.length > 0 && statsTypeID === StatsType.BATTING) &&
                    <div className="m-4">
                        <DataTable columns={columns as TableColumn<TournamentBattingStats>[]} data={battingStats} pagination />
                    </div>
                }
                { 
                    (pitchingStats.length > 0 && statsTypeID === StatsType.PITCHING) &&
                    <div className="m-4">
                        <DataTable columns={columns as TableColumn<TournamentPitchingStats>[]} data={pitchingStats} pagination />
                    </div>
                }
                <div className="m-4">
                    <button className="cursor-pointer bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full" onClick={dataLoadHandler}>Load</button>
                </div>
            </div>
        </>
    )

}

async function getBattingStats (tournamentTypeID: number, qualifierValue: number, positions: 'ANY'|Position[], tournamentStartDate: string, tournamentEndDate: string, teamName?: string) {

    const response = await window.electronAPI.getTournamentBattingStats({
        TournamentTypeID: tournamentTypeID, 
        Positions: positions, 
        TournamentTimeRange: {
            StartDate:tournamentStartDate,
            EndDate:tournamentEndDate
        },
        TeamName: teamName,
    });
    return response;

}

async function getPitchingStats (tournamentTypeID: number, qualifierValue: number, tournamentStartDate: string, tournamentEndDate: string, teamName?: string) {

    const response = await window.electronAPI.getTournamentPitchingStats({
        TournamentTypeID: tournamentTypeID, 
        TournamentTimeRange: {
            StartDate:tournamentStartDate,
            EndDate:tournamentEndDate
        },
        TeamName: teamName,
    });
    return response;

}

function getHeaders (statsType: StatsType) {

    if (statsType === StatsType.BATTING) {
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
        return columns;
    }
    else if (statsType === StatsType.PITCHING) {
        const columns: TableColumn<TournamentPitchingStats>[] = [
            { name: 'Card Title', selector: r => r.CardTitle, width: '300px', minWidth: '120px' },
            { name: 'Card Value', selector: r => r.CardValue, },
            { name: 'Throws', selector: r => r.Throws, },
            { name: 'G', selector: r => r.G, },
            { name: 'GS', selector: r => r.GS, sortable: true },
            { name: 'K/9', selector: r => r["K/9"], },
            { name: 'BB/9', selector: r => r["BB/9"], },
            { name: 'HR/9', selector: r => r["HR/9"], },
            { name: 'H/9', selector: r => r["H/9"], },
            { name: 'ERA', selector: r => r["ERA"], },
        ];
        return columns;
    }
    else {
        return []
    }
}