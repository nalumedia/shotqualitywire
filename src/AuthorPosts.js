import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import client from './Contentful';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';

const WinningMetricDetails = () => {
  const { id } = useParams();
  const [metricDetails, setMetricDetails] = useState(null);
  const [otherMetrics, setOtherMetrics] = useState([]);
  // Placeholder for related blogs
  const [relatedBlogs, setRelatedBlogs] = useState([]);

  useEffect(() => {
    // Fetch details for the current metric
    client.getEntry(id)
      .then((entry) => {
        setMetricDetails(entry);
      })
      .catch(console.error);

    // Fetch other random metrics for the sidebar
    client.getEntries({ 'content_type': 'metric', 'limit': 5 })
      .then((response) => {
        setOtherMetrics(response.items);
      })
      .catch(console.error);

    // Fetch related blogs (Placeholder, replace with your actual logic)
    setRelatedBlogs([
      { title: "Blog 1", id: 1 },
      { title: "Blog 2", id: 2 }
    ]);
  }, [id]);

  if (!metricDetails) {
    return <p>Loading...</p>;
  }

  const mapTargetSitesToLinks = (targetSites) => {
    // Your existing code for mapping target sites to links
  };

  return (
    <div className="container mt-5">
      <div className="sidebar">
        <h2>Other Metrics You Might Like</h2>
        <ul>
          {otherMetrics.map((metric) => (
            <li key={metric.sys.id}>
              <Link to={`/winningmetrics/${metric.sys.id}`}>{metric.fields.metricName}</Link>
            </li>
          ))}
        </ul>
      </div>
      <div className="main-content">
        <Link to="/winningmetricsglossary">← Back to Winning Metrics Glossary</Link>
        <h1>{metricDetails.fields.metricName}</h1>
        <div className="metric-details">
          {documentToReactComponents(metricDetails.fields.longDefinition)}
        </div>
        {metricDetails.fields.targetSite && <p><strong>See on:</strong> {mapTargetSitesToLinks(metricDetails.fields.targetSite)}</p>}
        {metricDetails.fields.targetPage && <p><strong>Used On:</strong> {metricDetails.fields.targetPage.join(', ')}</p>}
      </div>
      <div className="related-blogs">
        <h2>Blogs That Talk About This</h2>
        {relatedBlogs.map((blog) => (
          <div className="blog-card" key={blog.id}>
            <Link to={`/blogs/${blog.id}`}>{blog.title}</Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WinningMetricDetails;
