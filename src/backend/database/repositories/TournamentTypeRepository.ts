import { Database } from "../Database";
import { Repository } from "./Repository";
import { TournamentType } from '../../types'

export class TournamentTypeRepository extends Repository {

    constructor (database: Database) {
        super(database);
    }

    getTournamentTypes () {

        const tournamentTypeScript = this.getTournamentTypesScript();
        const tournamentTypes = this.database.getAllMapped<TournamentType>(tournamentTypeScript);

        return tournamentTypes;

    }

    private getTournamentTypesScript () {
        return `
SELECT TournamentTypeID,Name FROM TournamentType
`
    }

}