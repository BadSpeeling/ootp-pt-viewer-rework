import { LiveUpdate } from '../../types';
import { LiveUpdate as LiveUpdateUI } from '../../../userInterfaceTypes';

export class LiveUpdateMapper {

    public static mapLiveUpdate (liveUpdate: LiveUpdate): LiveUpdateUI {
        return {
            ...liveUpdate   
        };
    }

}