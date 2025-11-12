import React from "react";
import "./Reports.css";
import sampleReport from "../../assets/documents/Sample-Report.pdf";

function Reports() {
  // Sample data — replace with your actual data later
  const reportsData = [
    { id: 1, name: "Dr. Arjun Mehta", specialty: "Cardiologist" },
    { id: 2, name: "Dr. Priya Sharma", specialty: "Dermatologist" },
    { id: 3, name: "Dr. Karan Patel", specialty: "Neurologist" },
    { id: 4, name: "Dr. Neha Kapoor", specialty: "Pediatrician" },
  ];

  // Open PDF in new tab
  const handleView = (doctor) => {
     alert(`Viewing report for ${doctor.name}`);
    window.open(sampleReport, "_blank");
  };

  // Download PDF
  const handleDownload = (doctor) => {
    alert(`Downloading report for ${doctor.name}`);
    const link = document.createElement("a");
    link.href = sampleReport;
    link.download = "Sample-Report.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="reports-container">
      <h2 className="reports-title">Reports Overview</h2>

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
    </div>
  );
}

export default Reports;
