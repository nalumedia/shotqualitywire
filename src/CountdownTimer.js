import React, { useState, useEffect } from 'react';

function CountdownTimer() {
    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

    useEffect(() => {
        const timer = setTimeout(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        return () => clearTimeout(timer);
    });

    function calculateTimeLeft() {
        const ncaaEventDate = new Date('November 6, 2023 10:00:00 EST');
        const nbaEventDate = new Date('October 24, 2023 10:00:00 EST'); // Change this to your NBA event date

        const now = new Date();

        const ncaaDifference = ncaaEventDate - now;
        const nbaDifference = nbaEventDate - now;

        return {
            ncaa: {
                days: Math.floor(ncaaDifference / (1000 * 60 * 60 * 24)),
                hours: Math.floor((ncaaDifference / (1000 * 60 * 60)) % 24),
                minutes: Math.floor((ncaaDifference / (1000 * 60)) % 60),
                seconds: Math.floor((ncaaDifference / 1000) % 60),
            },
            nba: {
                days: Math.floor(nbaDifference / (1000 * 60 * 60 * 24)),
                hours: Math.floor((nbaDifference / (1000 * 60 * 60)) % 24),
                minutes: Math.floor((nbaDifference / (1000 * 60)) % 60),
                seconds: Math.floor((nbaDifference / 1000) % 60),
            }
        };
    }

    return (
        <div>
            🏀 NCAA: <strong>{timeLeft.ncaa.days}d {timeLeft.ncaa.hours}h {timeLeft.ncaa.minutes}m {timeLeft.ncaa.seconds}s</strong> till Season Start<br />
            🏀 NBA: <strong>{timeLeft.nba.days}d {timeLeft.nba.hours}h {timeLeft.nba.minutes}m {timeLeft.nba.seconds}s</strong> till Season Start
        </div>
    );
}

export default CountdownTimer;
