import { TournamentResult } from "../../userInterfaceTypes"

type TournamentRecordResultsProps = {
    tournamentResults: TournamentResult[],
    showTournamentName: boolean,
}

export function TournamentRecordResults ({tournamentResults, showTournamentName}: TournamentRecordResultsProps) {

    return (
        <table>
            <tr>
                {showTournamentName ? <th>Tournament</th> : <></>}
                <th>Date</th>
                <th>W</th>
                <th>L</th>
            </tr>
            { tournamentResults.map( t => {
                return (
                    <tr>
                        {showTournamentName ? <td>{t.TournamentName}</td> : <></>}
                        <td>{t.TournamentStartDate}</td>
                        <td>{t.W}</td>
                        <td>{t.L}</td>
                    </tr>
                )
            }) }
        </table>
    )

}