import { LiveUpdate, TournamentType } from './types';
import { LiveUpdate as LiveUpdateUI, TournamentType as TournamentTypeUI, PtCardRatings } from '../userInterfaceTypes';
import { PtRosterResult } from './database/repositories/types';

export function mapLiveUpdate (liveUpdate: LiveUpdate): LiveUpdateUI {
    return {
        ...liveUpdate   
    };
}

export function mapTournamentTypes (tournamentTypes: TournamentType[]): TournamentTypeUI[] {
    return tournamentTypes.map(tt => mapTournamentType(tt));
}

export function mapTournamentType (tournamentType: TournamentType): TournamentTypeUI {
    return {
        TournamentName: tournamentType.Name,
        TournamentTypeID: tournamentType.TournamentTypeID,
    }
}

export function mapPtRoster (allPtRoster: PtRosterResult[]): PtCardRatings[] {
    return allPtRoster.map(ptRoster => {
        return {
                ...ptRoster,
                RatingC: ptRoster.CatcherFrame * 1.05 + ptRoster.CatcherArm * 1.00 + ptRoster.CatcherAbil * 0.95,
                Rating1B: ptRoster.InfieldRange * 1.00 + ptRoster.InfieldError * 1.00 + ptRoster.InfieldArm * 0.10 + ptRoster.DP * 0.25 + playerHeightValue(ptRoster.Height),
                Rating2B: ptRoster.InfieldRange * 1.05 + ptRoster.InfieldError * 0.90 + ptRoster.InfieldArm * 0.80 + ptRoster.DP * 1.00,
                Rating3B: ptRoster.InfieldRange * 0.90 + ptRoster.InfieldError * 0.85 + ptRoster.InfieldArm * 1.10 + ptRoster.DP * 0.75,
                RatingSS: ptRoster.InfieldRange * 1.00 + ptRoster.InfieldError * 0.85 + ptRoster.InfieldArm * 0.95 + ptRoster.DP * 0.95,
                RatingLF: ptRoster.OFRange * 1.00 + ptRoster.OFArm * 0.70 + ptRoster.OFError * 0.50,
                RatingCF: ptRoster.OFRange * 1.00 + ptRoster.OFArm * 0.80 + ptRoster.OFError * 0.50,
                RatingRF: ptRoster.OFRange * 1.00 + ptRoster.OFArm * 1.00 + ptRoster.OFError * 0.50,
        }
    });
}

function playerHeightValue (heightInCm: number) {

    switch (heightInCm) {
        case 160:
            return 20;
        case 163:
            return 24;
        case 165:
            return 28;
        case 168:
            return 33;
        case 170:
            return 43;
        case 173:
            return 47;
        case 175:
            return 52;
        case 178:
            return 57;
        case 180:
            return 63;
        case 183:
            return 70;
        case 185:
            return 73;
        case 188:
            return 75;
        case 191:
            return 77;
        case 193:
            return 80;
        case 196:
            return 83;
        case 198:
            return 85;
        case 201:
            return 88;
        case 203:
            return 92;
        case 206:
            return 96;
        case 208:
            return 100;
        default:
            return 999;
    }

}