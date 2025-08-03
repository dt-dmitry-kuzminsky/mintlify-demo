import React, { useState, useEffect } from 'react';
import { XMLParser } from 'fast-xml-parser';

// --- Configuration ---
const XML_URL = 'https://storage.googleapis.com/gcs-fairbid-sdk-assets-prod-useast1/fairbid-sdk/adapters_list.xml';

// --- Helper Component for Ad Type Icons ---
// This component displays a checkmark or a cross based on the support status.
const AdTypeIcon = ({ supported }) => {
  const isSupported = supported === 'yes';
  const icon = isSupported ? '✔️' : '❌';
  const color = isSupported ? 'green' : 'red';
  return <span style={{ color }} title={isSupported ? 'Supported' : 'Not Supported'}>{icon}</span>;
};

// --- Main Table Component ---
const AdaptersTable = () => {
  const [adapters, setAdapters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(XML_URL);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const xmlText = await response.text();

        // Configure parser to handle attributes
        const parser = new XMLParser({
          ignoreAttributes: false,
          attributeNamePrefix: "@_"
        });
        const parsedData = parser.parse(xmlText);

        // Extract the adapter list from the parsed object
        const adapterList = parsedData['dev-portal-configs']?.adapters?.adapter || [];
        setAdapters(adapterList);

      } catch (e) {
        console.error("Failed to fetch or parse XML data:", e);
        setError("Failed to load adapter data. Please check the console for more details.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []); // The empty dependency array ensures this effect runs only once on mount

  if (loading) {
    return <p>Loading adapter data...</p>;
  }

  if (error) {
    return <p style={{ color: 'red' }}>{error}</p>;
  }

  return (
    <div style={{ fontFamily: 'Arial, sans-serif' }}>
      <h1>Network Adapter Compatibility</h1>
      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
        <thead>
          <tr style={{ backgroundColor: '#f2f2f2' }}>
            <th style={{ padding: '12px', border: '1px solid #ddd' }}>Network</th>
            <th style={{ padding: '12px', border: '1px solid #ddd' }}>Android SDK</th>
            <th style={{ padding: '12px', border: '1px solid #ddd' }}>iOS SDK</th>
            <th style={{ padding: '12px', border: '1px solid #ddd' }}>Bidding</th>
            <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'center' }}>Ad Types</th>
            <th style={{ padding: '12px', border: '1px solid #ddd' }}>Integration Guide</th>
          </tr>
        </thead>
        <tbody>
          {adapters.map((adapter, index) => (
            <tr key={index} style={{ borderBottom: '1px solid #ddd' }}>
              <td style={{ padding: '12px', border: '1px solid #ddd' }}><strong>{adapter['@_name']}</strong></td>
              <td style={{ padding: '12px', border: '1px solid #ddd' }}>{adapter['android-platform']?.['@_version'] || 'N/A'}</td>
              <td style={{ padding: '12px', border: '1px solid #ddd' }}>{adapter['ios-platform']?.['@_version'] || 'N/A'}</td>
              <td style={{ padding: '12px', border: '1px solid #ddd' }}>{adapter['@_programmatic-support'] === 'yes' ? 'Yes' : 'No'}</td>
              <td style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'center' }}>
                <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                  <div title="Rewarded Video">
                    <AdTypeIcon supported={adapter['@_rewarded-video-support']} /> RV
                  </div>
                  <div title="Interstitial">
                    <AdTypeIcon supported={adapter['@_interstitial-support']} /> INT
                  </div>
                  <div title="Banner">
                    <AdTypeIcon supported={adapter['@_banner-support']} /> BAN
                  </div>
                   <div title="MREC">
                    <AdTypeIcon supported={adapter['@_mrec-support']} /> MREC
                  </div>
                </div>
              </td>
              <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                {adapter['integration-guide-link'] ? (
                  <a href={adapter['integration-guide-link']} target="_blank" rel="noopener noreferrer">
                    View Guide
                  </a>
                ) : (
                  'Not Available'
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdaptersTable;