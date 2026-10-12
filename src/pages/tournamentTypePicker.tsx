import * as React from "react";
import { TournamentType } from "../userInterfaceTypes"

type Props = {
    tournaments: TournamentType[],
    selectedTournamentType: null | TournamentType,
    setSelectedTournamentType: React.Dispatch<React.SetStateAction<null | TournamentType>>,
}

export function TournamentTypePicker ({tournaments, selectedTournamentType, setSelectedTournamentType}: Props) {
    
    const optionElements = [
        <option value={0} id="defaultTournament">Select an option</option>,
        ...tournaments.map((value) => {
            return <option value={value.TournamentTypeID}>{value.TournamentName}</option>
        })
    ]

    return (
        <select className="border-gray border-1 rounded-md" value={selectedTournamentType?.TournamentTypeID ?? 0} onChange={(e) => { setSelectedTournamentType(tournaments.find(t => t.TournamentTypeID === parseInt(e.target.value)) ?? null) }} id="tournamentType">
            ${optionElements}
        </select>
    )

}