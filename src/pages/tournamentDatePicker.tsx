type TournamentDatePicker = {
    tournamentStartDate: string,
    setTournamentStartDate: React.Dispatch<React.SetStateAction<string>>,
    tournamentEndDate: string,
    setTournamentEndDate: React.Dispatch<React.SetStateAction<string>>,
}

export function TournamentDatePicker ({tournamentStartDate, setTournamentStartDate, tournamentEndDate, setTournamentEndDate}: TournamentDatePicker) {

    const tournamentStartDateHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTournamentStartDate(e.currentTarget.value);
    }

    const tournamentEndDateHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTournamentEndDate(e.currentTarget.value);
    }

    return (
        <>
            <div className="mb-2"><span className="inline-block mr-2">Start Date:</span><input className="border-gray border-1 rounded-md" value={tournamentStartDate} onChange={tournamentStartDateHandler} /></div>
            <div className="mb-2"><span className="inline-block mr-2">End Date:</span><input className="border-gray border-1 rounded-md" value={tournamentEndDate} onChange={tournamentEndDateHandler} /></div>
        </>
    )

}