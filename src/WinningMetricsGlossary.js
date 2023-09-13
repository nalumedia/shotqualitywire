import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import client from './Contentful';
import { Link } from 'react-router-dom';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';

const WinningMetricsGlossary = () => {
  const [winningMetrics, setWinningMetrics] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    client.getEntries({
      content_type: 'winningMetrics',
      'fields.targetSite[in]': 'ShotQualityWire',
      'fields.targetPage': 'Glossary'
    })
    .then(response => {
      setWinningMetrics(response.items);
    })
    .catch(console.error);
  }, []);

  const filteredMetrics = winningMetrics.filter((metric) => {
    const metricName = metric.fields.metricName.toLowerCase();
    const definitionText = JSON.stringify(metric.fields.definition).toLowerCase();
    return (
      metricName.includes(searchTerm.toLowerCase()) ||
      definitionText.includes(searchTerm.toLowerCase())
    );
  });

  const mapTargetSiteToURL = (targetSite) => {
    const urlMap = {
      'ShotQualityWire': 'https://shotqualitywire.com',
      'ShotQualityBets': 'https://shotqualitybets.com',
      'ShotQuality': 'https://shotquality.com'
    };
    return urlMap[targetSite];
  };

  return (
    <div className="container mt-5">
      <Helmet>
        <title>ShotQualityWire - Winning Metrics</title>
        <meta name="description" content="ShotQualityWire Winning Metrics glossary" />
        <link rel="canonical" href="https://shotqualitywire.com/BasketballAnalytics" />
      </Helmet>
      <h1>Winning Metrics Glossary</h1>

      {/* Search Input */}
      <input
        type="text"
        placeholder="Search Metrics..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="form-control mb-4"
      />

      <div className="row">
        {filteredMetrics.map((metric, index) => (
          <div className="col-md-4" key={index}>
            <div className="card mb-4">
              <div className="card-body">
              <h5><Link to={`/winningmetric/${metric.sys.id}`} className="card-title">{metric.fields.metricName}</Link></h5>
                <div className="card-text">
                  {documentToReactComponents(metric.fields.definition)}
                </div>
                {metric.fields.targetSite && (
                  <p><strong>See on:</strong> 
                    {metric.fields.targetSite.map(site => (
                      <a href={mapTargetSiteToURL(site)} target="_blank" rel="noreferrer" key={site}> {site} </a>
                    ))}
                  </p>
                )}
                {metric.fields.targetPage && <p><strong>Used On:</strong> {metric.fields.targetPage.join(', ')}</p>}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WinningMetricsGlossary;
