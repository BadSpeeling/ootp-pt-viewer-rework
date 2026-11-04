import { Database } from "../Database";
import { Repository } from "./Repository";
import { TournamentType } from '../../types'

export class TournamentTypeRepository extends Repository {

    constructor (database: Database) {
        super(database);
    }

    async getTournamentTypes () {

        const tournamentTypeScript = this.getTournamentTypesScript();
        await this.database.openConnection();
        const tournamentTypes = this.database.getAllMapped<TournamentType>(tournamentTypeScript);
        await this.database.closeConnection();

        return tournamentTypes;

    }

    private getTournamentTypesScript () {
        return `
SELECT TournamentTypeID,Name FROM TournamentType
`
    }

}