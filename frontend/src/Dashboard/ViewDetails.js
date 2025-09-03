import React from "react";
import { useLocation } from "react-router-dom";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import { useNavigate } from "react-router-dom";
import "./PatientBoard.css";
import { grey } from "@mui/material/colors";
import { useSelector } from "react-redux";
import axios from "axios";
import { useEffect } from "react";
import './ViewDetails.css'

const BaseUrl = process.env.REACT_APP_API_BASE_URL;

const paperview = {
  width: "9rem",
  textAlign: "left",
  marginBottom: "10px",
};

const viewinput = {
  width: "30rem",
  fontWeight: "bold",
};

function ViewDetails() {
  const location = useLocation();
  const { token = null, tokenname = null } = useSelector(
    (state) => state.PatientIdentifier ?? {}
  );

  const patient = location.state?.patient;

  const fetchDataview = async () => {
    try {
      // Redirect to login if token is missing
      if (!token || !tokenname) {
        navigate("/");
        return;
      }
      const response = await axios.get(`${BaseUrl}/dbget`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Fetched data:", response.data.data);
      // Handle fetched data if needed
    } catch (error) {
      console.error("Error fetching data:", error);
      navigate("/"); // Redirect to login on error
    }
  };

  useEffect(() => {
    fetchDataview();
  }, []);

  const navigate = useNavigate();
  const name = location.state?.name;
  const pageNo = location.state?.currentPage;
  const handlehomebtn = () => {
    const storedState = localStorage.getItem("patientListState");
    if (storedState) {
      const parsedState = JSON.parse(storedState);
      localStorage.setItem("searchInput", parsedState.searchInput);
      localStorage.setItem(
        "activeStatusFilter",
        parsedState.activeStatusFilter
      );
      localStorage.setItem("mediAssistFilter", parsedState.mediAssistFilter);
      localStorage.setItem("dateFilter", parsedState.dateFilter);
      localStorage.setItem("pharmacyfilter", parsedState.pharmacyfilter);
      localStorage.setItem(
        "packpharmacyfilter",
        parsedState.packpharmacyfilter
      );
      localStorage.setItem("sortColumn", parsedState.sortColumn);
      localStorage.setItem("sortOrder", parsedState.sortOrder);
      localStorage.setItem("currentPage", parsedState.currentPage);

      // localStorage.setItem('currentPage', parsedState.currentPage);
      // localStorage.setItem('filteredData', JSON.stringify(parsedState.filteredData));
    }
    navigate("/patientdet", { state: { name, pageNo } });
  };

  const formatdate = (date) => {
    // return (date?.split(' ')[0])
    if (!date) return "  -";

    const [year, month, day] = date.split(" ")[0].split("-");
    return `${month}/${day}/${year}`;
  };

  return (
    <div>
      {/* <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          "& > :not(style)": {
            m: 3,
            marginLeft: "18rem",
            width: 800,
            height: 600,
            p: 4,
            paddingLeft: "3rem",
          },
        }}
      >
        <Paper
          elevation={3}
          sx={{
            height: "600",
            overflowY: "auto",
            " ::-webkit-scrollbar": {
              width: "4px",
              height: "5px",
              background: "#c5c5c5",
              borderRadius: "5px",
            },
            " ::-webkit-scrollbar-thumb": {
              background: "#808080",
              height: "5px",
            },
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginBottom: "15px",
            }}
          >
            <h3 style={{ fontWeight: 600, marginLeft: "auto" }}>
              Patient Details
            </h3>
            <button
              onClick={() => handlehomebtn()}
              style={{ marginLeft: "auto" }}
            >
              Back
            </button>
          </div>

          <label style={paperview}>Global&nbsp;Id:</label>
          <input style={viewinput} value={patient?.GlobalId} disabled />
          <br />
          <label style={paperview}>SSN:</label>
          <input style={viewinput} value={patient?.SSN} disabled />
          <br />

          <label style={paperview}>Patient&nbsp;Name:</label>
          <input style={viewinput} value={patient?.DisplayName} disabled />
          <br />
          <label style={paperview}>Date&nbsp;Of&nbsp;Birth:</label>
          <input
            style={viewinput}
            value={formatdate(patient?.DateOfBirth)}
            disabled
          />
          <br />

          <label style={paperview}>Street:</label>
          <input style={viewinput} value={patient?.street} disabled />
          <br />
          <label style={paperview}>City:</label>
          <input style={viewinput} value={patient?.city} disabled />
          <br />
          <label style={paperview}>Phone:</label>
          <input style={viewinput} value={patient?.Phone} disabled />
          <br />
          <label style={paperview}>Zip:</label>
          <input style={viewinput} value={patient?.zip} disabled />
          <br />
          <label style={paperview}>Home&nbsp;Pharmacy:</label>
          <input style={viewinput} value={patient?.HomePharmarcy} disabled />
          <br />
          <label style={paperview}>Notes:</label>
          <input style={viewinput} value={patient?.Notes || "  -"} disabled />
          <br />
          <label style={paperview}>LastPack&nbsp;Date:</label>
          <input
            style={viewinput}
            value={formatdate(patient?.LastPackDate)}
            disabled
          />
          <br />
          <label style={paperview}>NextPack&nbsp;Date:</label>
          <input
            style={viewinput}
            value={formatdate(patient?.NextPackDate)}
            disabled
          />
          <br />
          <label style={paperview}>ActiveStatus:</label>
          <input style={viewinput} value={patient?.ActiveStatus} disabled />
          <br />
          <label style={paperview}>MediAssist:</label>
          <input style={viewinput} value={patient?.MediAssist} disabled />
          <br />
          <label style={paperview}>Modified&nbsp;By:</label>
          <input style={viewinput} value={patient?.RecordModifiedBy} disabled />
          <br />
          <label style={paperview}>Modified&nbsp;Date:</label>
          <input
            style={viewinput}
            value={formatdate(patient?.RecordModifiedDate)}
            disabled
          />
          <br />

          <label style={paperview}>Created&nbsp;By:</label>
          <input style={viewinput} value={patient?.RecordCreatedBy} disabled />
          <br />
          <label style={paperview}>Created&nbsp;Date:</label>
          <input
            style={viewinput}
            value={formatdate(patient?.RecordCreatedDate)}
            disabled
          />
          <br />
        </Paper>
      </Box> */}

        <div style={{width:'100%',display:'flex',justifyContent:'center'}}>
         <Paper elevation={3} sx={{padding:'1.7rem 3rem',marginTop:'2%',width:'55%',height: '93vh',            // Set a fixed height for scroll area
    overflowY: 'auto',  overflowX: 'hidden',        // Enable vertical scrolling
    // Optional: Custom scrollbar for webkit browsers
    '::-webkit-scrollbar': {
      width: "4px",
      background: "#c5c5c5",
      borderRadius: "5px",
    },
    '::-webkit-scrollbar-thumb': {
      background: "#808080",
    },
    }}>
          <div className="pat-view-heading">
            <h3>Patient Details</h3>
            <button className="patview-btn" onClick={handlehomebtn}>Back</button>
          </div>
          <div className="patview-label-input">
           <span className="patview-span">
           <label className="patview-label">Global Id:</label>
              <input className="patview-input" value= {patient?.GlobalId} disabled/><br/>
           </span>
           <span className="patview-span">
           <label className="patview-label">SSN:</label>
              <input className="patview-input" value= {patient?.SSN} disabled/><br/>
           </span>
           <span className="patview-span">
           <label className="patview-label">Patient Name:</label>
              <input className="patview-input" value= {patient?.DisplayName} disabled/><br/>
           </span>

           <span className="patview-span">
           <label className="patview-label">Date Of Birth:</label>
              <input className="patview-input" value= {patient?.DateOfBirth} disabled/><br/>
           </span>

           <span className="patview-span">
           <label className="patview-label">Street:</label>
              <input className="patview-input" value= {patient?.street} disabled/><br/>
           </span>

           <span className="patview-span">
           <label className="patview-label">City:</label>
              <input className="patview-input" value= {patient?.city} disabled/><br/>
           </span>

           <span className="patview-span">
           <label className="patview-label">Phone:</label>
              <input className="patview-input" value= {patient?.phone} disabled/><br/>
           </span>

           <span className="patview-span">
           <label className="patview-label">Zip:</label>
              <input className="patview-input" value= {patient?.zip} disabled/><br/>
           </span>

           <span className="patview-span">
           <label className="patview-label">Home Pharmacy:</label>
              <input className="patview-input" value= {patient?.HomePharmarcy} disabled/><br/>
           </span>

           <span className="patview-span">
           <label className="patview-label">Notes:</label>
              <input className="patview-input" value= {patient?.Notes || "  -"} disabled/><br/>
           </span>

           <span className="patview-span">
           <label className="patview-label">LastPack Date:</label>
              <input className="patview-input" value= {formatdate(patient?.LastPackDate)} disabled/><br/>
           </span>

           <span className="patview-span">
           <label className="patview-label">NextPack Date:</label>
              <input className="patview-input" value= {formatdate(patient?.NextPackDate)} disabled/><br/>
           </span>

           <span className="patview-span">
           <label className="patview-label">ActiveStatus:</label>
              <input className="patview-input" value= {patient?.ActiveStatus} disabled/><br/>
           </span>

           <span className="patview-span">
           <label className="patview-label">MediAssist:</label>
              <input className="patview-input" value= {patient?.MediAssist} disabled/><br/>
           </span>

           <span className="patview-span">
           <label className="patview-label">Modified By:</label>
              <input className="patview-input" value= {patient?.RecordModifiedBy} disabled/><br/>
           </span>

           <span className="patview-span">
           <label className="patview-label">Modified Date:</label>
              <input className="patview-input" value= {formatdate(patient?.RecordModifiedDate)} disabled/><br/>
           </span>

           <span className="patview-span">
           <label className="patview-label">Created By:</label>
              <input className="patview-input" value= {patient?.RecordCreatedBy} disabled/><br/>
           </span>

           <span className="patview-span">
           <label className="patview-label">Created Date:</label>
              <input className="patview-input" value= {formatdate(patient?.RecordCreatedDate)} disabled/><br/>
           </span>
            
          </div>
         </Paper>
      </div>
    </div>
  );
}

export default ViewDetails;
