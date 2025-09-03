import { React, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import { useNavigate } from "react-router-dom";
import "./PatientBoard.css";
import { grey } from "@mui/material/colors";
import { useSelector } from "react-redux";
import axios from "axios";
import './Viewmedlist.css'

const BaseUrl = process.env.REACT_APP_API_BASE_URL;

const paperview = {
  width: "10rem",
  textAlign: "left",
  marginBottom: "10px",
};

const viewinput = {
  width: "30rem",
  fontWeight: "bold",
};

function Viewmedlist() {
  const location = useLocation();
  const patient = location.state?.listmed;
  const { patientname } = location.state || {};

  //  console.log(PatientName)

  const navigate = useNavigate();
  const name = location.state?.name;
  const PatientIdentifier = location.state?.PatientIdentifier;
  const { token = null, tokenname = null } = useSelector(
    (state) => state.PatientIdentifier ?? {}
  );

  const fetchMedList = async () => {
    try {
      if (!token || !tokenname) {
        navigate("/");
        return;
      }

      const response = await axios.get(
        `${BaseUrl}/mediget/${location.state?.PatientIdentifier}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(response.data.data);
    } catch (error) {
      console.error("Error fetching medication list:", error);
    }
  };

  useEffect(() => {
    fetchMedList();
  }, []);

  const pageNo = location.state?.currentPage;
  const handlehomebtn = () => {
    const storedStatemed = localStorage.getItem("medListState");
    if (storedStatemed) {
      const parsedState = JSON.parse(storedStatemed);
      localStorage.setItem("searchInput", parsedState.searchInput);
      localStorage.setItem("dateFilter", parsedState.dateFilter);
      localStorage.setItem("sortColumn", parsedState.sortColumn);
      localStorage.setItem("sortOrder", parsedState.sortOrder);
      localStorage.setItem("ispackfilter", parsedState.ispackfilter);
      localStorage.setItem("reviewfilter", parsedState.reviewfilter);
    }
    // navigate(`/medilist/`, {state:{name,pageNo, PatientIdentifier}})

    const source = location.state?.source || "patient";
    if (source === "calendar") {
      navigate(`/medilist/`, {
        state: {
          name,
          PatientIdentifier,
          calenderview: true,
          source: "calendar",
        },
      });
    } else {
      navigate(`/medilist/`, {
        state: {
          name,
          pageNo,
          PatientIdentifier,
          source: "patient",
        },
      });
    }
  };

  console.log(patient, "Patientlist");

  const formatdate = (date) => {
    // return (date?.split(' ')[0])
    if (!date) return "-";

    const [year, month, day] = date.split(" ")[0].split("-");
    return `${month}/${day}/${year}`;
  };

  const formatdatetime = (date) => {
    if (!date) return "-";

    const [datePart, timePart] = date.split(" ");

    if (!datePart) return "-";

    const [year, month, day] = datePart.split("-");

    let formattedDate = `${month}/${day}/${year}`;

    if (timePart) {
      const [hour, minute, second] = timePart.split(":");
      formattedDate += ` ${hour}:${minute}:${second}`;
      // If you want to include seconds, use this line instead:
      // formattedDate += ` ${hour}:${minute}:${second}`;
    }

    return formattedDate;
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
              Medicine Details
            </h3>
            <button
              onClick={() => handlehomebtn()}
              style={{ marginLeft: "auto" }}
            >
              Back
            </button>
          </div>
          <label style={paperview}>Global&nbsp;Id:</label>
          <input style={viewinput} value={patient?.Globalid} disabled />
          <br />
          <label style={paperview}>SSN:</label>
          <input style={viewinput} value={patient?.SSN} disabled />
          <br />

          <label style={paperview}>Patient&nbsp;Name:</label>
          <input style={viewinput} value={patientname} disabled />
          <br />
          <label style={paperview}>Date&nbsp;Of&nbsp;Birth:</label>
          <input
            style={viewinput}
            value={formatdate(patient?.DateOfBirth)}
            disabled
          />
          <br />

          <label style={paperview}>Drug&nbsp;Name:</label>
          <input style={viewinput} value={patient?.Drug_name} disabled />
          <br />
          <label style={paperview}>Sig:</label>
          <input style={viewinput} value={patient?.sigs} disabled />
          <br />
          <label style={paperview}>Quantity&nbsp;Dispensed:</label>
          <input
            style={viewinput}
            value={patient?.QuantityDispensed}
            disabled
          />
          <br />
          <label style={paperview}>Pharmacy:</label>
          <input style={viewinput} value={patient?.Pharmacy} disabled />
          <br />
          <label style={paperview}>Date&nbsp;Dispensed:</label>
          <input
            style={viewinput}
            value={formatdate(patient?.DateDispensedSQL)}
            disabled
          />
          <br />
          <label style={paperview}>Date&nbsp;Written:</label>
          <input
            style={viewinput}
            value={formatdate(patient?.DateWritten)}
            disabled
          />
          <br />

          <label style={paperview}>OnHold:</label>
          <input style={viewinput} value={patient?.OnHold} disabled />
          <br />
          <label style={paperview}>Prescriber:</label>
          <input style={viewinput} value={patient?.Prescriber} disabled />
          <br />

          <label style={paperview}>Created&nbsp;By:</label>
          <input style={viewinput} value={patient?.RecordCreatedBy} disabled />
          <br />
          <label style={paperview}>Created&nbsp;Date:</label>
          <input
            style={viewinput}
            value={formatdatetime(patient?.RecordCreatedDate)}
            disabled
          />
          <br />
          <label style={paperview}>Modified&nbsp;By:</label>
          <input style={viewinput} value={patient?.RecordModifiedBy} disabled />
          <br />
          <label style={paperview}>Modified&nbsp;Date:</label>
          <input
            style={viewinput}
            value={formatdatetime(patient?.RecordModifiedDate)}
            disabled
          />
          <br />

          <label style={paperview}>DML&nbsp;Type:</label>
          <input style={viewinput} value={patient?.DMLType} disabled />
          <br />
          <label style={paperview}>Source:</label>
          <input style={viewinput} value={patient?.Source} disabled />
          <br />
          <label style={paperview}>Packed:</label>
          <input style={viewinput} value={patient?.IsPacked} disabled />
          <br />
          <label style={paperview}>Reviewed:</label>
          <input style={viewinput} value={patient?.Reviewed} disabled />
          <br />
          <label style={paperview}>Reviewed&nbsp;By:</label>
          <input style={viewinput} value={patient?.ReviewedBy} disabled />
          <br />
          <label style={paperview}>Reviewed&nbsp;Date:</label>
          <input
            style={viewinput}
            value={formatdatetime(patient?.ReviewedDate)}
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
          <div className="medi-view-heading">
            <h3>Medicine Details</h3>
            <button className="mediview-btn" onClick={handlehomebtn}>Back</button>
          </div>
          <div className="mediview-label-input">
           <span className="mediview-span">
           <label className="mediview-label">Global Id:</label>
              <input className="mediview-input" value= {patient?.Globalid} disabled/><br/>
           </span>
           <span className="mediview-span">
           <label className="mediview-label">SSN:</label>
              <input className="mediview-input" value= {patient?.SSN} disabled/><br/>
           </span>
           <span className="mediview-span">
           <label className="mediview-label">Patient Name:</label>
              <input className="mediview-input" value= {patientname} disabled/><br/>
           </span>

           <span className="mediview-span">
           <label className="mediview-label">Date Of Birth:</label>
              <input className="mediview-input" value= {formatdate(patient?.DateOfBirth)} disabled/><br/>
           </span>

           <span className="mediview-span">
           <label className="mediview-label">Drug Name:</label>
              <input className="mediview-input" value= {patient?.Drug_name} disabled/><br/>
           </span>

           <span className="mediview-span">
           <label className="mediview-label">Sig:</label>
              <input className="mediview-input" value= {patient?.sigs} disabled/><br/>
           </span>

           <span className="mediview-span">
           <label className="mediview-label">Quantity Dispensed:</label>
              <input className="mediview-input" value= {patient?.QuantityDispensed} disabled/><br/>
           </span>

           <span className="mediview-span">
           <label className="mediview-label">Pharmacy:</label>
              <input className="mediview-input" value= {patient?.Pharmacy} disabled/><br/>
           </span>

           <span className="mediview-span">
           <label className="mediview-label">Date Dispensed:</label>
              <input className="mediview-input" value= {formatdate(patient?.DateDispensedSQL)} disabled/><br/>
           </span>

           <span className="mediview-span">
           <label className="mediview-label">Date Written:</label>
              <input className="mediview-input" value= {formatdate(patient?.DateWritten)} disabled/><br/>
           </span>

           <span className="mediview-span">
           <label className="mediview-label">OnHold:</label>
              <input className="mediview-input" value= {patient?.OnHold} disabled/><br/>
           </span>

           <span className="mediview-span">
           <label className="mediview-label">Prescriber:</label>
              <input className="mediview-input" value= {patient?.Prescriber} disabled/><br/>
           </span>

           
           <span className="mediview-span">
           <label className="mediview-label">Created By:</label>
              <input className="mediview-input" value= {patient?.RecordCreatedBy} disabled/><br/>
           </span>

           <span className="mediview-span">
           <label className="mediview-label">Created Date:</label>
              <input className="mediview-input" value= {formatdatetime(patient?.RecordCreatedDate)} disabled/><br/>
           </span>

            <span className="mediview-span">
           <label className="mediview-label">Modified By:</label>
              <input className="mediview-input" value= {patient?.RecordModifiedBy} disabled/><br/>
           </span>

           <span className="mediview-span">
           <label className="mediview-label">Modified Date:</label>
              <input className="mediview-input" value= {formatdatetime(patient?.RecordModifiedDate)} disabled/><br/>
           </span>

           <span className="mediview-span">
           <label className="mediview-label">DMLType:</label>
              <input className="mediview-input" value= {patient?.DMLType} disabled/><br/>
           </span>

           <span className="mediview-span">
           <label className="mediview-label">Source:</label>
              <input className="mediview-input" value= {patient?.Source} disabled/><br/>
           </span>

           <span className="mediview-span">
           <label className="mediview-label">Packed:</label>
              <input className="mediview-input" value= {patient?.IsPacked} disabled/><br/>
           </span>

            <span className="mediview-span">
           <label className="mediview-label">Reviewed:</label>
              <input className="mediview-input" value= {patient?.Reviewed} disabled/><br/>
           </span>

            <span className="mediview-span">
           <label className="mediview-label">Reviewed By:</label>
              <input className="mediview-input" value= {patient?.ReviewedBy} disabled/><br/>
           </span>

            <span className="mediview-span">
           <label className="mediview-label">Reviewed Date:</label>
              <input className="mediview-input" value= {formatdatetime(patient?.ReviewedDate)} disabled/><br/>
           </span>

            
          </div>
         </Paper>
      </div>
    </div>
  );
}

export default Viewmedlist;
