import React, { useState } from 'react';
import FileUpload from './FileUpload';
import DataTable from './DataTable';

const App = () => {
  const [tableData, setTableData] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const updateTableData = (data) => {
    setTableData(data); // This function updates the tableData state
  };

  return (
    <div>
      <h1>CSV File Upload and Data Table</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <FileUpload updateTableData={updateTableData} setError={setError}/>
      {tableData.length > 0 && <DataTable data={tableData} />}
      {loading && <p>Loading...</p>}
     
    </div>
  );
};

export default App;
