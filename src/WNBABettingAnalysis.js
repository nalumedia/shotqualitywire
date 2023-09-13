import React, { useState, useEffect } from 'react';
import client from './Contentful';  // Make sure to import your Contentful client
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';

const WNBABettingAnalysis = () => {
  const [winningMetrics, setWinningMetrics] = useState([]);

  useEffect(() => {
    client.getEntries({
      content_type: 'winningMetrics',
      'fields.targetSite[in]': 'ShotQualityWire'  // Filter by TargetSite
    })
    .then(response => {
      setWinningMetrics(response.items);
    })
    .catch(console.error);
  }, []);

  const tableData = [
    ['Las Vegas Aces', '34 -7', '29 -12', '82%', '70%', '56%', '41%', '86%', '78%'],
    ['New York Liberty', '33 -8', '28 -13', '80%', '68%', '56%', '43%', '68%', '94%'],
    ['Connecticut Sun', '27 -13', '25 -15', '67%', '62%', '50%', '47%', '63%', '72%'],
    ['Dallas Wings', '22 -18', '28 -12', '55%', '70%', '60%', '40%', '50%', '64%'],
    ['Atlanta Dream', '19 -21', '17 -23', '47%', '42%', '42%', '57%', '60%', '18%'],
    ['Minnesota Lynx', '19 -21', '16 -24', '47%', '40%', '57%', '42%', '57%', '25%'],
    ['Washington Mystics', '19 -21', '16 -24', '47%', '40%', '40%', '57%', '44%', '53%'],
    ['Chicago Sky', '18 -22', '15 -25', '45%', '37%', '47%', '50%', '58%', '9%'],
    ['Los Angeles Sparks', '17 -23', '25 -15', '42%', '62%', '42%', '57%', '40%', '41%'],
    ['Indiana Fever', '13 -27', '18 -22', '32%', '45%', '45%', '50%', '29%', '37%'],
    ['Seattle Storm', '11 -29', '16 -24', '27%', '40%', '47%', '50%', '36%', '13%'],
    ['Phoenix Mercury', '9 -31', '8 -32', '22%', '20%', '47%', '50%', '14%', '41%']
  ];

  return (
    <div className="container mt-5">
      <h1>WNBA Betting Analysis</h1>
      
      {/* Table Section */}
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Team</th>
            <th>Record</th>
            <th>SQ Record</th>
            <th>Win%</th>
            <th>SQ Win%</th>
            <th>Over Win %</th>
            <th>Under Win %</th>
            <th>Favorite Win %</th>
            <th>Underdog Win%</th>
          </tr>
        </thead>
        <tbody>
          {tableData.map((row, index) => (
            <tr key={index}>
              {row.map((cell, i) => (
                <td key={i}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Winning Metrics Section */}
      <h2>Winning Metrics</h2>
      <div className="row">
        {winningMetrics.map((metric, index) => (
          <div className="col-md-4" key={index}>
            <div className="card mb-4">
              <div className="card-body">
                <h5 className="card-title">{metric.fields.metricName}</h5>
                <div className="card-text">
                  {documentToReactComponents(metric.fields.definition)}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WNBABettingAnalysis;
