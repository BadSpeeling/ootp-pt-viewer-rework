import DataTable from 'react-data-table-component';
import { TableColumn } from 'react-data-table-component';
import { Bats, Position, Throws, TournamentBattingStats, TournamentPitchingStats, TournamentResult } from '../../userInterfaceTypes'

type Props = {
    tournamentResult: TournamentResult;
}

const battingColumns: TableColumn<TournamentBattingStats>[] = [
    { name: 'Card Title', selector: row => row.CardTitle, sortable: true },
    { name: 'Card Value', selector: row => row.CardValue, sortable: true },
    { name: 'Position', selector: row => Position[row.Position] },
    { name: 'Bats', selector: row => Bats[row.Bats] },
    { name: 'PA', selector: row => row.PA, sortable: true },
    { name: 'AVG', selector: row => row.AVG, sortable: true },
    { name: 'OBP', selector: row => row.OBP, sortable: true },
    { name: 'SLG', selector: row => row.SLG, sortable: true },
    { name: 'OPS', selector: row => row.OPS, sortable: true },
];

const pitchingColumns: TableColumn<TournamentPitchingStats>[] = [
    { name: 'Card Title', selector: row => row.CardTitle, sortable: true },
    { name: 'Card Value', selector: row => row.CardValue, sortable: true },
    { name: 'Throws', selector: row => Throws[row.Throws] },
    { name: 'G', selector: row => row.G, sortable: true },
    { name: 'GS', selector: row => row.GS, sortable: true },
    { name: 'K/9', selector: row => row['K/9'], sortable: true },
    { name: 'BB/9', selector: row => row['BB/9'], sortable: true },
    { name: 'HR/9', selector: row => row['HR/9'], sortable: true },
    { name: 'H/9', selector: row => row['H/9'], sortable: true },
    { name: 'ERA', selector: row => row.ERA, sortable: true },
];

export function TournamentResult ({ tournamentResult }: Props) {

    const { TournamentRecord: record, TournamentBattingStats: battingStats, TournamentPitchingStats: pitchingStats } = tournamentResult;

    return (
        <div className="m-4">
            <h1 className="text-xl font-bold">{record.TournamentName}</h1>
            <div className="my-2">
                <span className="mr-4">Team: {record.TeamName}</span>
                <span className="mr-4">Date: {record.TournamentStartDate}</span>
                <span>Record: {record.W}-{record.L}</span>
            </div>

            <section className="my-4">
                <h2 className="text-lg font-bold mb-2">Batting</h2>
                {battingStats.length > 0
                    ? <DataTable columns={battingColumns} data={battingStats} pagination />
                    : <div>No batting stats available.</div>}
            </section>

            <section className="my-4">
                <h2 className="text-lg font-bold mb-2">Pitching</h2>
                {pitchingStats.length > 0
                    ? <DataTable columns={pitchingColumns} data={pitchingStats} pagination />
                    : <div>No pitching stats available.</div>}
            </section>
        </div>
    );
}