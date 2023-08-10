import React from 'react';

const DataTable = ({ data }) => {
  return (
    <table>
      <thead>
        <tr>
          <th>First Name</th>
          <th>Last Name</th>
          <th>Country Code</th>
          <th>Whatapp Number</th>
          <th>Email</th>
          <th>Tags</th>
        </tr>
      </thead>
      <tbody>
        {data.map((item) => (
            <tr>
            <td>{item.First_Name}</td>
            <td>{item.Last_Name}</td>
            <td>{item.Country_Code}</td>
            <td>{item.Whatapp_Number}</td>
            <td>{item.Email}</td>
            <td>{item.Tags}</td>
            {/* Add more table cells if needed */}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default DataTable;
