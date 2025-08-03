import React, { useState, useEffect } from 'react';

// --- Configuration ---
const XML_URL = 'https://storage.googleapis.com/gcs-fairbid-sdk-assets-prod-useast1/fairbid-sdk/adapters_list.xml';

// --- Helper Component for Ad Type Icons ---
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
          throw new Error(`Network response was not ok: ${response.statusText}`);
        }
        const xmlText = await response.text();

        // --- NATIVE XML PARSING LOGIC ---
        // 1. Use the browser's built-in DOMParser
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlText, "application/xml");

        // 2. Check for parsing errors
        const parseError = xmlDoc.querySelector("parsererror");
        if (parseError) {
          throw new Error("Failed to parse XML.");
        }

        // 3. Select all 'adapter' elements
        const adapterNodes = xmlDoc.querySelectorAll("adapter");

        // 4. Map over the nodes to extract data into a plain JavaScript array
        const adapterList = Array.from(adapterNodes).map(node => {
          // Helper to get an attribute value, returns null if not found
          const getAttr = (attrName) => node.getAttribute(attrName);
          
          // Helper to get version from a platform sub-element
          const getVersion = (platformId) => node.querySelector(`${platformId}-platform`)?.getAttribute('version') || 'N/A';

          return {
            name: getAttr('name'),
            androidVersion: getVersion('android'),
            iosVersion: getVersion('ios'),
            biddingSupport: getAttr('programmatic-support'),
            rewardedVideo: getAttr('rewarded-video-support'),
            interstitial: getAttr('interstitial-support'),
            banner: getAttr('banner-support'),
            mrec: getAttr('mrec-support'),
            guideLink: node.querySelector('integration-guide-link')?.textContent || ''
          };
        });
        
        setAdapters(adapterList);

      } catch (e) {
        console.error("Failed to fetch or process XML data:", e);
        setError("Failed to load adapter data. Please check the console for details.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []); // Empty dependency array ensures this effect runs only once

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
              <td style={{ padding: '12px', border: '1px solid #ddd' }}><strong>{adapter.name}</strong></td>
              <td style={{ padding: '12px', border: '1px solid #ddd' }}>{adapter.androidVersion}</td>
              <td style={{ padding: '12px', border: '1px solid #ddd' }}>{adapter.iosVersion}</td>
              <td style={{ padding: '12px', border: '1px solid #ddd' }}>{adapter.biddingSupport === 'yes' ? 'Yes' : 'No'}</td>
              <td style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'center' }}>
                <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                  <div title="Rewarded Video"><AdTypeIcon supported={adapter.rewardedVideo} /> RV</div>
                  <div title="Interstitial"><AdTypeIcon supported={adapter.interstitial} /> INT</div>
                  <div title="Banner"><AdTypeIcon supported={adapter.banner} /> BAN</div>
                  <div title="MREC"><AdTypeIcon supported={adapter.mrec} /> MREC</div>
                </div>
              </td>
              <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                {adapter.guideLink ? (
                  <a href={adapter.guideLink} target="_blank" rel="noopener noreferrer">
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