import React, { useState, useEffect } from "react";
import "./Reports.css";
import sampleReport from "../../assets/documents/Sample-Report.pdf";

function Reports() {
  const [reportsData, setReportsData] = useState([]);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/appointments/reports");
        const data = await res.json();
        setReportsData(data); 
      } catch (err) {
        console.error("Error fetching reports:", err);
      }
    };

    fetchReports();
  }, []);

  // Open PDF in new tab
  const handleView = (doctor) => {
     alert(`Viewing report for ${doctor.name}`);
    window.open(doctor.reportUrl, "_blank");
  };

  // Download PDF
  const handleDownload = (doctor) => {
    alert(`Downloading report for ${doctor.name}`);
    const link = document.createElement("a");
    link.href = doctor.reportUrl;
    link.download = "Sample-Report.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="reports-container">
      <h2 className="reports-title">Reports Overview</h2>

      {reportsData.length > 0 ? (
      <table className="reports-table">
        <thead>
          <tr>
            <th>S.No.</th>
            <th>Doctor Name</th>
            <th>Specialty</th>
            <th>View Report</th>
            <th>Download Report</th>
          </tr>
        </thead>

        <tbody>
          {reportsData.map((doctor, index) => (
            <tr key={doctor.id}>
              <td>{index + 1}</td>
              <td>{doctor.name}</td>
              <td>{doctor.specialty}</td>
              <td width='18%'>
                <button
                  className="view-btn"
                  onClick={() => handleView(doctor)}
                >
                  View Report
                </button>
              </td>
              <td width='18%'>
                <button
                  className="download-btn"
                  onClick={() => handleDownload(doctor)}
                >
                  Download Report
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      ) : (
        <p className="no-report-msg">No reports available.</p>
      )}
    </div>
  );
}

export default Reports;
