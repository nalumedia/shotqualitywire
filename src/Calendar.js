import React from 'react';
import { Helmet } from 'react-helmet';

function Calendar() {
  return (
    <div>
      <Helmet>
        <title>Calendar - Hoopsbot 🏀🤖</title>
        <meta name="description" content="Hoopsbot calendar" />
        <link rel="canonical" href="https://hoopsbot.com/calendar" />
      </Helmet>

      <h2>Hoopsbot Calendar</h2>
      <div class="container">
    <div class="row">
        <div class="col-12">
            <h3>September:</h3>
            <ul>
                <li>WNBA: Regular Season Ends (10th)</li>
                <li>WNBA: Playoffs Begin (13th)</li>
            </ul>
            
            <h3>October:</h3>
            <ul>
                <li>NBA: Preseason</li>
                <li>NCAA: Midnight Madness</li>
                <li>WNBA: Last Possible Finals Date (20th)</li>
            </ul>
            
            <h3>Late October/Early November:</h3>
            <ul>
                <li>NBA: Regular Season Start</li>
                <li>NCAA: Start of Regular Season</li>
            </ul>
            
            <h3>November through January:</h3>
            <p>(No major events listed)</p>
            
            <h3>February:</h3>
            <ul>
                <li>NBA: All-Star Game</li>
            </ul>
            
            <h3>March:</h3>
            <ul>
                <li>NCAA: Conference Tournaments</li>
                <li>NCAA: Selection Sunday</li>
            </ul>
            
            <h3>Mid-March to Early April:</h3>
            <ul>
                <li>NCAA: Tournament (March Madness)</li>
            </ul>
            
            <h3>April:</h3>
            <ul>
                <li>NBA: Playoffs begin (extends to June)</li>
                <li>NCAA: Final Four and National Championship Game</li>
            </ul>
            
            <h3>May:</h3>
            <ul>
                <li>NBA: Draft Lottery</li>
            </ul>
            
            <h3>June:</h3>
            <ul>
                <li>NBA: Draft (also sometimes extends to July)</li>
                <li>NBA: Playoffs continue</li>
                <li>NBA: Finals</li>
            </ul>
            
            <h3>July:</h3>
            <ul>
                <li>NBA: Draft (if extended from June)</li>
                <li>NBA: Free Agency begins</li>
                <li>NBA: Summer League (also extends into August)</li>
            </ul>
            
            <h3>August:</h3>
            <ul>
                <li>NBA: Continuation of Summer League</li>
            </ul>
        </div>
    </div>
</div>

    </div>
  );
}

export default Calendar;
