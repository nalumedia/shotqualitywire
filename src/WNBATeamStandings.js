import React, { useState, useEffect } from 'react';
import client from './Contentful';  // Make sure to import your Contentful client
import { Helmet } from 'react-helmet';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import { Link } from 'react-router-dom';  // Import the Link component

const WNBATeamStandings = () => {
  const [winningMetrics, setWinningMetrics] = useState([]);

  useEffect(() => {
    client.getEntries({
      content_type: 'winningMetrics',
      'fields.targetSite[in]': 'ShotQualityWire',  // Filter by TargetSite
      'fields.targetPage': 'TeamStandings'  // Filter by TargetPage
    })
    .then(response => {
      setWinningMetrics(response.items);
    })
    .catch(console.error);
  }, []);

  const tableData = [
    ['Las Vegas Aces', '+0.071', '1.081', '1.011', '63%', '34-7', '27-14', '82%', '64%', '-17.99'],
    ['Dallas Wings', '+0.042', '1.082', '1.045', '62%', '22-18', '24-16', '55%', '60%', '+5.06'],
    ['New York Liberty', '+0.033', '1.083', '1.056', '69%', '33-8', '24-17', '80%', '58%', '-22.43'],
    ['Connecticut Sun', '+0.024', '1.054', '1.034', '66%', '27-13', '22-18', '67%', '54%', '-12.83'],
    ['Los Angeles Sparks', '+0.015', '1.028', '1.012', '60%', '17-23', '21-19', '42%', '53%', '+10.92'],
    ['Washington Mystics', '0.006', '1.011', '1.013', '62%', '19-21', '20-20', '47%', '49%', '+1.94'],
    ['Indiana Fever', '-0.027', '1.045', '1.057', '63%', '13-27', '19-21', '32%', '46%', '+14.44'],
    ['Minnesota Lynx', '-0.028', '1.036', '1.058', '58%', '19-21', '18-22', '47%', '45%', '-2.45'],
    ['Seattle Storm', '-0.039', '1.011', '1.051', '61%', '11-29', '18-22', '27%', '44%', '+16.71'],
    ['Atlanta Dream', '-0.031', '1.037', '1.059', '60%', '19-21', '18-22', '47%', '44%', '-3.04'],
    ['Chicago Sky', '-0.031', '1.029', '1.051', '56%', '18-22', '17-23', '45%', '43%', '-1.88'],
    ['Phoenix Mercury', '-0.051', '1.12', '1.061', '57%', '9-31', '14-26', '22%', '35%', '+12.57']
  ];
  

  return (
    <div className="container mt-5">
      <Helmet>
        <title>ShotQualityWire - WNBA Team Standings</title>
        <meta name="description" content="WNBA Team Standings Analysis" />
        <link rel="canonical" href="https://shotqualitywire.com/BasketballAnalytics" />
      </Helmet>
      <h1>WNBA Team Standings</h1>
      
      {/* Table Section */}
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Team</th>
            <th>adj SQ</th>
            <th>adjOFF SQ</th>
            <th>adjDEF SQ</th>
            <th>Rim & 3 Rate</th>
            <th>Record</th>
            <th>SQ Record</th>
            <th>Win%</th>
            <th>SQ Win%</th>
            <th>Record Luck</th>
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
                <h5 className="card-title">
                  <Link to={`/winningmetric/${metric.sys.id}`}>{metric.fields.metricName}</Link>
                </h5>
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

export default WNBATeamStandings;
