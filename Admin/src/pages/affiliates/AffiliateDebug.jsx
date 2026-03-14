/**
 * AffiliateDebug — Developer diagnostics page.
 * Tests API connectivity for contacts, testimonials, affiliates,
 * and displays raw MongoDB connection info, collection stats,
 * and sample documents for troubleshooting.
 * @route /affiliates/debug
 */
import { useState, useEffect } from 'react';
import { api } from '../../lib/api';
import { contactService } from '../../services/contactService';
import { testimonialService } from '../../services/testimonialService';
import { affiliateService } from '../../services/affiliateService';
import toast from 'react-hot-toast';

export const AffiliateDebug = () => {
  const [debugInfo, setDebugInfo] = useState({
    connectionStatus: 'Testing...',
    tableExists: false,
    recordCount: 0,
    sampleData: [],
    errors: [],
    rlsStatus: 'Unknown',
    comparisonResults: null
  });

  useEffect(() => {
    runDiagnostics();
  }, []);

  const runDiagnostics = async () => {
    const info = { ...debugInfo, errors: [] };

    try {
      // Test 1: Health check + affiliate count
      console.log('Testing MongoDB API connection...');
      const health = await api.get('/health');

      if (health.database !== 'connected') {
        info.errors.push('MongoDB is not connected');
        info.connectionStatus = 'Database Disconnected';
      } else {
        info.connectionStatus = 'Connected';
        info.tableExists = true;
        info.rlsStatus = 'N/A (MongoDB — no RLS)';
      }

      // Test 2: Fetch affiliates
      if (info.tableExists) {
        try {
          const affiliates = await affiliateService.getAll();
          info.recordCount = affiliates.length;
          info.sampleData = affiliates.slice(0, 3);
        } catch (fetchError) {
          info.errors.push(`Fetch Error: ${fetchError.message}`);
        }
      }

    } catch (error) {
      info.errors.push(`API Error: ${error.message}`);
      info.connectionStatus = 'API Server Unreachable';
    }

    setDebugInfo(info);
  };

  const testInsert = async () => {
    try {
      const testData = {
        full_name: 'Debug Test User',
        email: `debug-${Date.now()}@example.com`,
        mobile_number: '+1234567890',
        description: 'Test registration from admin panel debug',
      };

      await api.post('/affiliates', testData);
      toast.success('Test record inserted successfully!');
      runDiagnostics(); // Refresh data
    } catch (error) {
      toast.error(`Insert failed: ${error.message}`);
    }
  };

  const runComparison = async () => {
    try {
      toast.loading('Running API comparison...');
      
      // Test all services
      const results = {
        contacts: { count: 0, error: null },
        testimonials: { count: 0, error: null },
        affiliates: { count: 0, error: null }
      };

      // Test contacts
      try {
        const contactData = await contactService.getAll();
        results.contacts = { count: contactData.length, error: null, data: contactData.slice(0, 2) };
      } catch (error) {
        results.contacts = { count: 0, error: error.message };
      }

      // Test testimonials
      try {
        const testimonialData = await testimonialService.getAll();
        results.testimonials = { count: testimonialData.length, error: null, data: testimonialData.slice(0, 2) };
      } catch (error) {
        results.testimonials = { count: 0, error: error.message };
      }

      // Test affiliates
      try {
        const affiliateData = await affiliateService.getAll();
        results.affiliates = { count: affiliateData.length, error: null, data: affiliateData.slice(0, 2) };
      } catch (error) {
        results.affiliates = { count: 0, error: error.message };
      }

      setDebugInfo(prev => ({ ...prev, comparisonResults: results }));
      toast.dismiss();
      toast.success('Comparison complete!');
    } catch (error) {
      toast.dismiss();
      toast.error(`Comparison failed: ${error.message}`);
    }
  };

  const createTable = async () => {
    toast.error('Collections are auto-created by MongoDB on first insert. No migration needed.');
  };

  return (
    <div className="debug-panel" style={{ padding: '20px', fontFamily: 'monospace' }}>
      <h1>🔍 Affiliate Debug Panel</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <button onClick={runDiagnostics} style={{ marginRight: '10px' }}>
          🔄 Refresh Diagnostics
        </button>
        <button onClick={testInsert} style={{ marginRight: '10px' }}>
          📝 Test Insert
        </button>
        <button onClick={runComparison} style={{ marginRight: '10px' }}>
          🔍 Compare APIs
        </button>
        {!debugInfo.tableExists && (
          <button onClick={createTable}>
            🏗️ Create Table (SQL Required)
          </button>
        )}
      </div>

      <div className="debug-results">
        <h2>📊 Diagnostic Results</h2>
        
        <div style={{ marginBottom: '15px' }}>
          <strong>Connection Status:</strong> 
          <span style={{ 
            color: debugInfo.connectionStatus === 'Connected' ? 'green' : 'red',
            marginLeft: '10px'
          }}>
            {debugInfo.connectionStatus}
          </span>
        </div>

        <div style={{ marginBottom: '15px' }}>
          <strong>Table Exists:</strong> 
          <span style={{ 
            color: debugInfo.tableExists ? 'green' : 'red',
            marginLeft: '10px'
          }}>
            {debugInfo.tableExists ? 'Yes' : 'No'}
          </span>
        </div>

        <div style={{ marginBottom: '15px' }}>
          <strong>RLS Status:</strong> 
          <span style={{ 
            color: debugInfo.rlsStatus === 'Allowed' ? 'green' : 'orange',
            marginLeft: '10px'
          }}>
            {debugInfo.rlsStatus}
          </span>
        </div>

        <div style={{ marginBottom: '15px' }}>
          <strong>Record Count:</strong> 
          <span style={{ marginLeft: '10px' }}>
            {debugInfo.recordCount}
          </span>
        </div>

        {debugInfo.errors.length > 0 && (
          <div style={{ marginBottom: '15px' }}>
            <strong style={{ color: 'red' }}>Errors:</strong>
            <ul style={{ color: 'red', marginTop: '5px' }}>
              {debugInfo.errors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </div>
        )}

        {debugInfo.sampleData.length > 0 && (
          <div>
            <strong>Sample Data:</strong>
            <pre style={{ 
              background: '#f5f5f5', 
              padding: '10px', 
              marginTop: '10px',
              overflow: 'auto',
              maxHeight: '300px'
            }}>
              {JSON.stringify(debugInfo.sampleData, null, 2)}
            </pre>
          </div>
        )}

        {debugInfo.comparisonResults && (
          <div style={{ marginTop: '20px' }}>
            <strong>🔍 API Comparison Results:</strong>
            <div style={{ 
              background: '#f0f8ff', 
              padding: '15px', 
              marginTop: '10px',
              border: '1px solid #ccc'
            }}>
              <div style={{ marginBottom: '10px' }}>
                <strong>Contacts:</strong> 
                <span style={{ color: debugInfo.comparisonResults.contacts.error ? 'red' : 'green', marginLeft: '10px' }}>
                  {debugInfo.comparisonResults.contacts.error ? 
                    `Error: ${debugInfo.comparisonResults.contacts.error}` : 
                    `${debugInfo.comparisonResults.contacts.count} records`}
                </span>
              </div>
              <div style={{ marginBottom: '10px' }}>
                <strong>Testimonials:</strong> 
                <span style={{ color: debugInfo.comparisonResults.testimonials.error ? 'red' : 'green', marginLeft: '10px' }}>
                  {debugInfo.comparisonResults.testimonials.error ? 
                    `Error: ${debugInfo.comparisonResults.testimonials.error}` : 
                    `${debugInfo.comparisonResults.testimonials.count} records`}
                </span>
              </div>
              <div style={{ marginBottom: '10px' }}>
                <strong>Affiliates:</strong> 
                <span style={{ color: debugInfo.comparisonResults.affiliates.error ? 'red' : 'green', marginLeft: '10px' }}>
                  {debugInfo.comparisonResults.affiliates.error ? 
                    `Error: ${debugInfo.comparisonResults.affiliates.error}` : 
                    `${debugInfo.comparisonResults.affiliates.count} records`}
                </span>
              </div>
              
              {debugInfo.comparisonResults.affiliates.count === 0 && !debugInfo.comparisonResults.affiliates.error && (
                <div style={{ color: 'orange', marginTop: '10px' }}>
                  ⚠️ Affiliates API is working but returning 0 records. This suggests an RLS policy issue.
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="debug-solutions" style={{ marginTop: '30px', padding: '15px', background: '#f0f8ff', border: '1px solid #ccc' }}>
        <h3>🔧 Common Solutions</h3>
        <ol>
          <li><strong>API server not running:</strong> Run <code>node server/index.js</code> in the project root</li>
          <li><strong>MongoDB not connected:</strong> Check <code>MONGODB_URI</code> in your <code>.env</code> file</li>
          <li><strong>No data:</strong> Use the "Test Insert" button or seed data via <code>node server/seed.js</code></li>
          <li><strong>ECONNREFUSED:</strong> Make sure the API server is running on port 5001</li>
        </ol>

        <h4>📋 Quick Start:</h4>
        <ol>
          <li>Start API server: <code>node server/index.js</code></li>
          <li>Start frontend: <code>npx vite</code></li>
          <li>Open <code>http://localhost:5173</code></li>
          <li>Login with <strong>admin / admin123</strong></li>
        </ol>
      </div>
    </div>
  );
};