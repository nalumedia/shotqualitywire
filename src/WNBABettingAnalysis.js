import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import client from './Contentful';  // Make sure to import your Contentful client
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';

const WNBABettingAnalysis = () => {
  const [tableData, setTableData] = useState([]);
  const [winningMetrics, setWinningMetrics] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('/wnba_results_page.csv');
      const reader = response.body.getReader();
      const result = await reader.read();
      const decoder = new TextDecoder('utf-8');
      const csv = decoder.decode(result.value);
      const results = Papa.parse(csv, { header: true });
      setTableData(results.data);
    };
    fetchData();
  }, []);

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

  return (
    <div className="container mt-5">
      <h1>WNBA Betting Analysis</h1>
      
      {/* Table Section */}
      <table className="table table-striped">
        <thead>
          <tr>
            {/* Replace with your table headers */}
            <th>Game ID</th>
            <th>Type</th>
            <th>Date</th>
            {/* ... Add other headers here */}
          </tr>
        </thead>
        <tbody>
          {tableData.map((row, index) => (
            <tr key={index}>
              {/* Replace with your table data */}
              <td>{row.game_id}</td>
              <td>{row.type}</td>
              <td>{row.date}</td>
              {/* ... Add other table data here */}
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
