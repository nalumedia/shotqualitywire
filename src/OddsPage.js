import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Papa from 'papaparse';

const OddsPage = () => {
    const [data, setData] = useState([]);

    useEffect(() => {
        axios.get('/projected_scores.csv').then(response => {
            // Parse CSV data
            Papa.parse(response.data, {
                complete: (result) => {
                    setData(result.data);
                },
                header: true
            });
        });
    }, []);

    const has_odds = true; // Set this to true or false manually

    return (
        <div>
            <h1>Projected Scores</h1>
            {has_odds ? (
                <table className="table table-bordered table-hover">
                    <thead className="thead-light">
                        <tr>
                            <th>Date</th>
                            <th>Match</th>
                            <th>Projected Score</th>
                            <th>Winner</th>
                            <th>Wins By</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((row, index) => (
                            <tr key={index}>
                                <td>{row.Date}</td>
                                <td>{row.Match}</td>
                                <td>{row["Projected Score"]}</td>
                                <td>{row.Winner}</td>
                                <td>{row["Wins By"]}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>Sorry, there are no upcoming games available.</p>
            )}
        </div>
    );
};

export default OddsPage;
