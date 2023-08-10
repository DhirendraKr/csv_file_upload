import Papa from 'papaparse/papaparse.min'
import React, { useState } from 'react';
import axios from 'axios';

const FileUpload = ({ updateTableData }) => {
  const [selectedFile, setSelectedFile] = useState(null);

  const [error, setError] = useState('');

  const [loading, setLoading] = useState(false);

  const handleFileChange = async (event) => {
    const file = event.target.files[0];

    const allowedTypes = ['text/csv']; // Add more types if needed
    const maxFileSize = 1 * 1024 * 1024; // 1 MB (in bytes)
    

      setError('');
      setSelectedFile(file);

      // Check File Type
      if (!allowedTypes.includes(file.type)) {
        setError('Invalid file type. Please select a CSV file.');
        setSelectedFile(null);
        return
      } 
      // Check File size
      if (file.size > maxFileSize) {
        setError('File size exceeds the maximum allowed limit (5 MB).');
        setSelectedFile(null);
        return
      }

      try {

        const result = await new Promise((resolve, reject) => {
          Papa.parse(file, {
            complete: resolve,
            error: reject,
          });
        });

        // Check headers 
        if (!validateHeader(result.data)) {
          setError('CSV file headers do not match the expected format.');
          setSelectedFile(null);
          return
        }

        // check valid number of columns
        if (!validateNumCol(result.data)) {
          setError('CSV data is invalid. Please check the number of columns.');
          setSelectedFile(null);
          return
        }
        // Check data type
        const vsdt = validateCSVDataTypes(result.data);
        if (vsdt.length > 0) {
          setError(vsdt.join(', '));
          setSelectedFile(null);
          return
        }
        //check duplicate columns
        const vd = validateduplicates(result.data);
        if (vd.length > 0) {
          setError(vd.join(', '));
          setSelectedFile(null);
          return
        }

      } catch (error) {
        setError('Error parsing CSV.');
        setSelectedFile(null);
        return
      }
  
  };


  const validateduplicates = (csvData) => {
    const emailSet = new Set();
    const mobileSet = new Set();
    const countryCode = new Set(["+91"]);
    const duplicates = [];
    
    const expectedDataTypes = {
      Country_Code: 'Country_Code',
      Whatapp_Number: 'mobile',
      Email: 'email',
    }
    const header = csvData[0];
    for (let i = 1; i < csvData.length; i++) {

      for (const key in csvData[i]) {
         
        if(expectedDataTypes[header[key]]=='email'){
          if(emailSet.has(csvData[i][key])){
              duplicates.push(`Duplicate email row ${i}`);
            } else{
              emailSet.add(csvData[i][key]);
            }
        }

        if(expectedDataTypes[header[key]]=='mobile'){
          if(mobileSet.has(csvData[i][key])){
            duplicates.push(`Duplicate mobile row ${i}`);
          } else{
            mobileSet.add(csvData[i][key]);
          }

        }

        if(expectedDataTypes[header[key]]=='Country_Code'){
          if(!countryCode.has(csvData[i][key])){
            duplicates.push(`Invalid country code row ${i}`);
          } 

        }
      }
    }
    return duplicates;
  }


  const validateCSVDataTypes = (csvData) => {
    const expectedDataTypes = {
      First_Name: 'string',
      Last_Name: 'string',
      Country_Code: 'string',
      Whatapp_Number: 'mobile',
      Email: 'email',
      Tags: 'string',
     
    }
    const validationErrors = [];
    const header = csvData[0];
    for (let i = 1; i < csvData.length; i++) {

      for (const key in csvData[i]) {
         
         if (expectedDataTypes[header[key]] && !isValidDataType(expectedDataTypes[header[key]], csvData[i][key])) {
            validationErrors.push(`Row ${i}, Column ${expectedDataTypes[header[key]]}: Invalid data type.`);
          }
      }
      
    }
    return validationErrors;
  };


  const isValidDataType = (expectedType, value) => {
    if (expectedType === 'string') {
      if (typeof value ===  'string'  && value.trim() != '') {
        return true
      }
    } else if (expectedType === 'email') {
      if (isValidEmail(value)  && value.trim() !== '') {
        return true
      }
    } else if (expectedType === 'mobile') {
      if (isValidMobileNumber(value) && value.trim() != '') {
        return true
      }
    }
    
    return false;
  };


  const isValidEmail = (email) => {
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    return emailRegex.test(email);
  };

  function isValidMobileNumber(number) {
    const pattern = /^[+]?\d{0,3}[-\s]?\d{10}$/;
    return pattern.test(number);
  }
  
  const validateNumCol = (csvData) => {
    const expectedColumnSize = 6;
    for (let i = 1; i < csvData.length; i++) {
      const rowData = csvData[i];
      if (rowData.length !== expectedColumnSize) {
        return false;
      }
    }
    return true;
  };


  const validateHeader = (csvData) => {
    const expectedHeaders = ['First_Name', 'Last_Name', 'Country_Code', 'Whatapp_Number', 'Email', 'Tags'];
    const headers = csvData[0]
    if (headers.length !== expectedHeaders.length) {
      return false;
    }
    return headers.every((value, index) => value === expectedHeaders[index]);
  };

  


  const handleFileUpload = async () => {
    setError('')
    if (!selectedFile) {
      setError('No file selected.');
      console.log('No file selected.');
      return;
    }
    setLoading(true);
    const formData = new FormData();
    formData.append('file', selectedFile);
    const csvApiEndpoint = 'http://localhost:4300/';
    try {
      const response = await axios.post(csvApiEndpoint+'file/upload/', formData);
    } catch (error) {
      setLoading(false);
      setError('Error Api is Not working.');
    }

    try {
      const response = await axios.get(csvApiEndpoint+'data/', {});
      setLoading(false);
      updateTableData(response.data.data);
    } catch (error) {
      setLoading(false);
      setError('Error Api is Not working.');
    }


  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleFileUpload}>Upload</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {loading && <p>Loading...</p>}
    </div>
  );
};

export default FileUpload;
