import React from 'react';
import { PtCardRatings } from '../userInterfaceTypes'

export type PtCardProps = {
    ptCard: PtCardRatings
}

export function PtCard ({ ptCard }: PtCardProps ) {

    const visualMaxRating = 150;
    const ratingCardPercentage = (rating: number) => {
        return Math.ceil((rating / visualMaxRating) * 100) + '%';
    }

    return (
        <div className="playerRatingsView">
            <div>{ptCard.CardTitle}</div>
            <div className="playerRatingsViewWrapper">
                <div>Avoid K<div className="ratingsBarWrapper"><div className="ratingsBar" style={{width:ratingCardPercentage(ptCard.AvoidKs)}}>{ptCard.AvoidKs}</div></div></div>
                <div>BABIP<div className="ratingsBarWrapper"><div className="ratingsBar" style={{width:ratingCardPercentage(ptCard.BABIP)}}>{ptCard.BABIP}</div></div></div>
                <div>Gap<div className="ratingsBarWrapper"><div className="ratingsBar" style={{width:ratingCardPercentage(ptCard.Gap)}}>{ptCard.Gap}</div></div></div>
                <div>Power<div className="ratingsBarWrapper"><div className="ratingsBar" style={{width:ratingCardPercentage(ptCard.Power)}}>{ptCard.Power}</div></div></div>
                <div>Eye<div className="ratingsBarWrapper"><div className="ratingsBar" style={{width:ratingCardPercentage(ptCard.Eye)}}>{ptCard.Eye}</div></div></div>
            </div>
        </div>
    )

}