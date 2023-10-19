import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import client from './Contentful';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';

const WinningMetricDetails = () => {
  const { id } = useParams();
  const [metricDetails, setMetricDetails] = useState(null);

  useEffect(() => {
    client.getEntry(id)
      .then((entry) => {
        setMetricDetails(entry);
      })
      .catch(console.error);
  }, [id]);

  if (!metricDetails) {
    return <p>Loading...</p>;
  }

  const mapTargetSitesToLinks = (targetSites) => {
    return targetSites.map((site) => {
      const urlMap = {
        "ShotQualityWire": "https://shotqualitywire.com",
        "ShotQualityBets": "https://shotqualitybets.com",
        "ShotQuality": "https://shotquality.com"
      };
      return <a href={urlMap[site]} target="_blank" rel="noopener noreferrer">{site}</a>;
    }).reduce((prev, curr) => [prev, ', ', curr]);
  };

  return (
    <div className="container mt-5">
      <Link to="/winningmetricsglossary">← Back to Winning Metrics Glossary</Link>
      <h1>{metricDetails.fields.metricName}</h1>
      <div className="metric-details">
        <h3>Short Definition:</h3>
        {documentToReactComponents(metricDetails.fields.definition)}
        <hr />
        <h3>Long Definition:</h3>
        {documentToReactComponents(metricDetails.fields.longDefinition)}
        <hr />
        <h3>Technical Definition:</h3>
        {documentToReactComponents(metricDetails.fields.technicalDefinition)}
        <hr />
      </div>
      {metricDetails.fields.targetSite && <p><strong>See on:</strong> {mapTargetSitesToLinks(metricDetails.fields.targetSite)}</p>}
      {metricDetails.fields.targetPage && <p><strong>Used On:</strong> {metricDetails.fields.targetPage.join(', ')}</p>}
    </div>
  );
};

export default WinningMetricDetails;
