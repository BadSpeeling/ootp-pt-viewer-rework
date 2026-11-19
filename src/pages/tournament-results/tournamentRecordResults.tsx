import { TournamentRecord, TournamentResult } from "../../userInterfaceTypes"

type TournamentRecordResultsProps = {
    tournamentResults: TournamentRecord[],
    showTournamentName: boolean,
    setTournamentResult: React.Dispatch<React.SetStateAction<TournamentResult | null>>,
}

export function TournamentRecordResults ({tournamentResults, showTournamentName, setTournamentResult}: TournamentRecordResultsProps) {

    const loadTournamentResult = async (statsBatchID: number) => {
        const tournamentResult = await window.electronAPI.getTournamentResult(statsBatchID);
        setTournamentResult(tournamentResult);
    }

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
                    <tr onClick={_ => loadTournamentResult(t.StatsBatchID)}>
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