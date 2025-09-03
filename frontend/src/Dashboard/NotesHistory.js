import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import "./NotesHistory.css";
import axios from "axios";
import Pagination from "@mui/material/Pagination";
import "react-datepicker/dist/react-datepicker.css";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import poweroff from "./img/poweroff.png";
import HomeIcon from "@mui/icons-material/Home";
import { useSelector, useDispatch } from "react-redux";
import PushPinIcon from "@mui/icons-material/PushPin";
import PushPinOutlinedIcon from "@mui/icons-material/PushPinOutlined";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { logout } from "../Redux/slice.js";
import Pinned from "./img/Pinned.png";
import Unpinned from "./img/Unpinned.png";
import pdf from "./img/pdf.png";
import image from "../Finallogin/img/image.png";
import { getPermissionsByRole } from "../Finallogin/GetPermission.js";
import Loader from "./Loader";
import { styled } from '@mui/material/styles';
import Switch, { SwitchProps } from '@mui/material/Switch';
import { Box, Typography } from '@mui/material';


const BaseUrl = process.env.REACT_APP_API_BASE_URL;

  
function NotesHistory() {
  const [tableDatalib, setTableDatalib] = useState([]);
  const [noteadd, setNoteadd] = useState([]);
  const [filterNote, setFilterNote] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;
  const [searchInput, setSearchInput] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const name = location.state?.name;
  // const {PatientIdentifier} = useParams();
  const PatientIdentifier = location.state?.PatientIdentifier || "";
  const Role  = useSelector((state)=> state.PatientIdentifier.Role)
  const permissions = getPermissionsByRole(Role)
  const [isLoading, setIsLoading] = useState(true);
  

  const [dateFilter, setDateFilter] = useState("");
  const { token = null, tokenname = null } = useSelector(
    (state) => state.PatientIdentifier ?? {}
  );
  const dispatch = useDispatch();

  const signout = () => {
    dispatch(logout());
    navigate("/");
  };

  const notelrow = useSelector(
    (state) => state.PatientIdentifier.selectedLibertyRow
  );
  console.log(notelrow,'note')
  const [noteform, setNoteform] = useState([]);

  useEffect(() => {
    const data = notelrow || JSON.parse(localStorage.getItem("data"));
    setNoteform((prevFormData) => ({
      ...prevFormData,

      PatientName: data.DisplayName,
      Globalid: data.GlobalId,
      SSN: data.SSN,
      DateOfBirth: data.DateOfBirth,
      PatientIdentifier: data.PatientIdentifier,
      street: data.street,
      city: data.city,
      state: data.state,
      Phone: data.Phone,
      zip: data.zip,
    }));
    // }
  }, [notelrow]);

  useEffect(() => {
    fetchdatalib(); // Call the fetchdata function when the component mounts
  }, [location.state?.PatientIdentifier]);

  const fetchdatalib = async () => {
    try {
      if (!token || !tokenname) {
        navigate("/");
        return;
      }
      const resp = await axios.get(
        `${BaseUrl}/Notes/${location.state?.PatientIdentifier}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setTableDatalib(resp.data.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleInputChange = (field, value) => {
    setEditedValues((prevValues) => ({
      ...prevValues,
      [field]: value,
    }));
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
    }

    return formattedDate;
  };

  useEffect(() => {
    const fetchnotesget = async () => {
      try {
        if (!token || !tokenname) {
          navigate("/");
          return;
        }
        const resp = await axios.get(
          `${BaseUrl}/notesget/${location.state?.PatientIdentifier}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setNoteadd(resp.data.data);
        // console.log(resp.data.data)
        console.log("data get", resp.data.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchnotesget(); // Call the fetchdata function when the component mounts
  }, [location.state?.PatientIdentifier]);

  const formatdate = (date) => {
    // return (date?.split(' ')[0])
    if (!date) return "-";

    const [year, month, day] = date.split(" ")[0].split("-");
    return `${month}/${day}/${year}`;
  };

  const [hiddenRows, setHiddenRows] = useState([]);
const [showAll, setShowAll] = useState(false);


  useEffect(() => {
     const filtered = tableDatalib.filter((item) => {
    // Filter by fields other than date
    const otherFieldsMatch = [
      item.Notes,
      item.RecordModifiedBy,
      formatdate(item.RecordCreatedDate),
    ].some(
      (term) =>
        term &&
        term.toString().toLowerCase().includes(searchInput.toLowerCase())
    );

    return (otherFieldsMatch);
  })
   const visible = showAll
    ? filtered
    : filtered.filter((item) => !hiddenRows.includes(item.PVNHID));

  setFilterNote(visible);
   setCurrentPage(1);
  },[searchInput,tableDatalib,showAll,hiddenRows])
 

  const totalPages = Math.ceil(filterNote.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const rangeStart = indexOfFirstItem + 1;
  const rangeEnd = Math.min(indexOfLastItem, filterNote.length);
  const currentItems = filterNote.slice(indexOfFirstItem, indexOfLastItem);
  const handleChange = (event, page) => {
    setCurrentPage(page);
  };

  const handleHideRow = (id) => {
  setHiddenRows((prev) => [...prev, id]);
};

const handleUnhideRow = (id) => {
  setHiddenRows((prev) => prev.filter((rowId) => rowId !== id));
};

    const handleToggle = () => setShowAll((prev) => !prev);


const handleShowAll = () => {
  setShowAll(true);
};

const handleShowUnhidden = () => {
  setShowAll(false);
};


  const columns = ["Notes", "ModifiedBy", "CreatedDate"]; // Example column names
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((index) => (index + 1) % columns.length);
    }, 1000); // Change column every second

    return () => clearInterval(interval);
  }, [columns.length]);

  const handlebackbtn = () => {
    // navigate(`/medsnap`,{state:{name, PatientIdentifier ,latestnotes: tableDatalib[0]? tableDatalib[0].Notes: null}})

    const source = location.state?.source || "patient";
    const latestnotes = tableDatalib[0] ? tableDatalib[0].Notes : null;

    if (source === "calendar") {
      navigate(`/medsnap`, {
        state: {
          name,
          PatientIdentifier,
          latestnotes,
          calenderview: true,
          source: "calendar",
        },
      });
    } else {
      navigate(`/medsnap`, {
        state: {
          name,
          PatientIdentifier,
          latestnotes,
          source: "patient",
        },
      });
    }
  };

  const handlehomebtn = () => {
    navigate('/homepage', {state: {name}})
  }

  const handlePinToggle = async (PVNHID, currentPinnedStatus) => {
    try {
      await axios.put(`${BaseUrl}/notepindata`, {
        name,
        PatientIdentifier,
        PVNHID,
        IsPinned: currentPinnedStatus ? 0 : 1,
      });
      if (!token || !tokenname) {
        navigate("/");
        return;
      }
      const response = await axios.get(
        `${BaseUrl}/Notes/${location.state?.PatientIdentifier}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setTableDatalib(response.data.data);
    } catch (error) {
      console.error("Error toggling pin:", error);
    }
  };

  const [showForm, setShowForm] = useState(false);
  const [editedValues, setEditedValues] = useState({});

  const handleAddClick = () => {
    setShowForm(true);
    // setEditedValues({ Notes: noteadd ? noteadd.Notes : "" });
  };

  const handleSaveClick = async () => {
  //     const trimmedNote = (editedValues.Notes || '').trim();

  // if (!trimmedNote) {
  //   alert('Notes cannot be empty or just spaces!');
  //   return;
  // }
    
    try {
      console.log("test", noteadd);
      //   const updatedTableData = [...tableData];
      const updatedTableData = {
        ...editedValues,
        // Notes: trimmedNote,
        PatientIdentifier,
        RecordModifiedBy: name,
      };

      setShowForm(false);
      // Update the data on the server
      await axios.put(`${BaseUrl}/notesupdate`, updatedTableData);

      setNoteadd(updatedTableData);
      fetchdatalib();
      // setEditedValues({ Notes: "" });
      console.log("Data updated successfully", updatedTableData);
    } catch (error) {
      console.error("Error updating data:", error);
    }
  };

  const handleCancelClick = () => {
    setShowForm(false);
    setEditedValues({});
  };

  const RoleDesc = useSelector((state) => state.PatientIdentifier.RoleDesc);

  const handleClearClick = () => {
    setEditedValues({ Notes: "" });
  };

  const [patinfonote, setPatinfonote] = useState([]);

  const fetchpatlist = async () => {
    try {
      if (!token || !tokenname) {
        navigate("/");
        return;
      }
      // console.log("fetchmedlist",location.state?.PatientIdentifier)
      const resp = await axios.get(
        `${BaseUrl}/medsnap/${location.state?.PatientIdentifier}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = resp.data.data;

      setPatinfonote({
        DisplayName: data[0].DisplayName,
        PatientId: data[0].PatientId,
        DateOfBirth: data[0].DateOfBirth,
        SSN: data[0].SSN,
        ProviderName: data[0].ProviderName,
        RecordModifiedBy: data[0].RecordModifiedBy,
        MediAssist: data[0].MediAssist,
        NextAppointmentDate: data[0].NextAppointmentDate,
        street: data[0].street,
        city: data[0].city,
        state: data[0].state,
        zip: data[0].zip,
        Phone: data[0].Phone,
        HomePharmarcy: data[0].HomePharmarcy,
        Phone2: data[0].Phone2
      });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchpatlist();
  }, []);

  const NotesPDF = () => {
    const doc = new jsPDF({
      orientation: "portrait", // 'portrait' or 'landscape'
      unit: "mm", // Measurement unit: 'pt', 'mm', 'cm', 'in'
      format: [210, 297], // Custom page size in mm (e.g., A4 size: 210x297)
    });

    const imgX = 12; // X-coordinate for the image
    const imgY = 7; // Y-coordinate for the image
    const imgWidth = 45; // Width of the image
    const imgHeight = 15; // Height of the image

    const currentDate = new Date();
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    const formattedDate = `${monthNames[currentDate.getMonth()]} ${String(
      currentDate.getDate()
    ).padStart(2, "0")}, ${currentDate.getFullYear()} ${String(
      currentDate.getHours() % 12 || 12
    ).padStart(2, "0")}:${String(currentDate.getMinutes()).padStart(2, "0")} ${
      currentDate.getHours() >= 12 ? "PM" : "AM"
    }`;
    doc.setFontSize(10);

    doc.addImage(image, "PNG", imgX, imgY, imgWidth, imgHeight);

    doc.setFontSize(10);
    doc.text(`${formattedDate}`, 190, 12, { align: "right" });
    const lineSpacing = 8;
    let startYhead = 30;

    const formatDOB = formatdate(noteform.DateOfBirth);

    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("NOTES REPOSITORY", 105, startYhead - 5, { align: "center" });
    startYhead += 6;

    const boxX = 12;
    const boxY = startYhead - 4;
    const boxWidth = 120; // Adjust as needed
    const boxHeight = 20; // Adjust as needed

    // Box 1: Patient Name and Address
    doc.rect(boxX, boxY, boxWidth, boxHeight);

    // Patient Name
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text("PATIENT NAME:", boxX + 2, boxY + 6);
    doc.setFont("helvetica", "normal");
    doc.text(`${noteform.PatientName}`, boxX + 34, boxY + 6);

    // Address
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text(`Address:`, boxX + 2, boxY + 12);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    const addressText = `${patinfonote.street}, ${patinfonote.city}, ${patinfonote.state}, ${patinfonote.zip}`;
    const addressLines = doc.splitTextToSize(addressText, boxWidth - 24);
    doc.text(addressLines, boxX + 20, boxY + 12);

    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text("Home Pharmacy:", boxX + 2, boxY + 18);
    doc.setFont("helvetica", "normal");
    doc.text(`${patinfonote.HomePharmarcy || 'N/A'}`, boxX + 35, boxY + 18);

    // Box 2: DOB and Phone
    const box2X = boxX + boxWidth + 5; // 5 units gap between boxes
    const boxWidth2 = 54; // Adjust as needed
    const boxHeight2 = 20;
    doc.rect(box2X, boxY, boxWidth2, boxHeight2);

    // Date of Birth
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text(`Date of Birth:`, box2X + 2, boxY + 6);
    doc.setFont("helvetica", "normal");
    doc.text(`${formatDOB}`, box2X + 28, boxY + 6);

    // Phone
    doc.setFont("helvetica", "bold");
    doc.text(`Mobile # :`, box2X + 2, boxY + 12);
    doc.setFont("helvetica", "normal");
    doc.text(`${patinfonote.Phone}`, box2X + 21, boxY + 12);

    doc.setFont("helvetica", "bold");
    doc.text(`Home # :`, box2X + 2, boxY + 18);
    doc.setFont("helvetica", "normal");
    doc.text(`${patinfonote.Phone2}`, box2X + 21, boxY + 18);

    // Update startYhead for subsequent content
    startYhead += boxHeight + 5; // Add some spacing after the box

    // Add Medication Table
    const tableColumnHeaders = ["Notes", "Modified By", "Created Date", "Pin"];

    const filteredSortedData = filterNote;

    const OutlinedPushPin = () => (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M6 3L18 3M12 3V21M8 7L16 7M7 8L17 8M5 6L19 6"
          stroke="black"
          strokeWidth="2"
        />
      </svg>
    );

    const tableRows = filteredSortedData.map((row) => [
      row.Notes,
      row.RecordModifiedBy,
      row.RecordCreatedDate,
      row.IsPinned ? "" : "",
    ]);

    // const tableStartY = phoneBoxY + phoneBoxHeight + 3;
    const tableStartY = boxY + boxHeight + 3;

    doc.autoTable({
      head: [tableColumnHeaders],
      body: tableRows,
      startY: tableStartY,
      margin: { left: 12 },
      theme: "grid",
      styles: {
        fontSize: 8,
        halign: "Left",
        valign: "middle",
        cellWidth: "wrap",
        overflow: "linebreak",
        textColor: "#3f3838",
      },
      headStyles: {
        fillColor: "#005078", // Set the header background color
        textColor: "#FFFFFF", // Optional: Set text color to white for better visibility
        fontSize: 10, // Optional: Customize header font size
        halign: "left", // Align text in the center of each header cell
        valign: "middle", // Vertically align text in the middle of each header cell
        fontWeight: 600,
      },
      columnStyles: {
        0: { cellWidth: 80, halign: "left", fontSize: 8.5, fontWeight: 700 }, //num
        1: { cellWidth: 30, fontSize: 8.5, fontWeight: 700 }, //num
        2: { cellWidth: 45, fontSize: 8.5, fontWeight: 700 },
        3: { cellWidth: 20 }, //num
        4: { cellWidth: 16, fontSize: 8.5, fontWeight: 700 },
        5: { cellWidth: 16 },
        6: { cellWidth: 43 },
        7: { cellWidth: 27 },
        // 8: { cellWidth: 18 }
      },

      rowPageBreak: "avoid", // ✅ Prevents row splitting across pages

      didDrawPage: function (data) {
        const pageHeight = doc.internal.pageSize.height;
        const bottomMargin = 10; // Ensure space at bottom
        const currentY = data.cursor.y;

        // ✅ Only add a page if there isn't enough space for the next row
        if (currentY + bottomMargin >= pageHeight) {
          doc.addPage();
          data.cursor.y = 10; // Reset for next table
        }
      },

      didDrawCell(data) {
        // Check if the cell is in the last column (Pin column)
        if (data.section === "body" && data.column.index === 3) {
          if (filteredSortedData[data.row.index].IsPinned) {
            doc.addImage(Pinned, "PNG", data.cell.x + 2, data.cell.y + 2, 5, 5);
          } else {
            doc.addImage(
              Unpinned,
              "PNG",
              data.cell.x + 2,
              data.cell.y + 2,
              5,
              5
            );
          }
        }
      },
    });

    let startY = doc.lastAutoTable.finalY ; // Position below the table

    const pageHeight = doc.internal.pageSize.height;
    const footerHeight = 10; // Approximate height for all footer lines and fields
    if (startY + footerHeight > pageHeight) {
      doc.addPage();
      startY = 10; // Reset startY for the new page
    }

    const pageCount = doc.getNumberOfPages(); // Get total number of pages
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i); // Go to the current page
      doc.setFontSize(10);
      const pageWidth = doc.internal.pageSize.width; // Get the page width
      const pageHeight = doc.internal.pageSize.height; // Get the page height

      // Add page number to the bottom center of the page
      doc.text(
        `Page ${i} of ${pageCount}`,
        pageWidth / 2, // Center horizontally
        pageHeight - 10, // Position 10 units from the bottom
        { align: "center" }
      );
    }

    // Save the PDF
    doc.save(`${noteform.PatientName}_NotesHistory.pdf`);
  };


    const [menuOpen, setMenuOpen] = useState(false);


    const [checked, setChecked] = useState(false); // false = Unhide (grey), true = ALL (blue)

    const handlecheckChange = (event) => {
    const isChecked = event.target.checked;
    setChecked(isChecked);
    if (isChecked) {
      handleShowAll();
    } else {
      handleShowUnhidden();
    }
  };


  return (
    <div>
         <div className='nav-mainnote' >
      <nav className='nav-mainnote'>
          <div className='navbar-fullnote'>
            <div className='nav-leftnote'>
            <h4 className='h5-leftnote' 
            style={{display:'flex', marginLeft:'0.5rem', textAlign:'center', padding:'0.3rem', fontFamily:'Volkhov, serif'}}>
                Hello, {name}{" "}
                {RoleDesc &&
                RoleDesc.toLowerCase() !== "null" &&
                RoleDesc.trim() !== ""
                  ? `(${RoleDesc})`
                  : ""}
              </h4>
            </div>
            
            <div className='nav-middlenote'>
              <h4 className='h4-midnote' style={{display:'flex', fontWeight:600}}>Patient Notes Repository</h4>
            </div>
          
           <div className='nav-containernote'>
              <ul className={`nav-ulnote ${menuOpen ? "show":""}`}>
                
                <li className='nav-homenote'>
     <HomeIcon  sx={{color: 'white', cursor:'Pointer',width:'1.8rem',height:'1.8rem',
      '@media screen and (min-width: 1900px) and (max-width:4000px)': { width: '2.3rem', height: '2.3rem' },
      '@media screen and (min-width: 1600px) and (max-width:1890px)' : {width: '2rem', height: '2rem'},
     }} 
     onClick={handlehomebtn}></HomeIcon>
                </li>
                <li>
                  <picture className='img-outnote' onClick={signout}>
                        <source srcset={poweroff} type="image/svg+xml"/>
                        <img src={poweroff} class="img-fluid" alt="..."/>
                    </picture>
                </li>
              </ul>

            </div>

          </div>
         </nav>
      </div>
       

       <div className="navbtm-note" >
        <div className="note-pathead">
          <div style={{width:'30%'}}>
            <button onClick={() => handlebackbtn()} class="backbutton-note">
            <svg
              height="16"
              width="16"
              xmlns="http://www.w3.org/2000/svg"
              version="1.1"
              viewBox="0 0 1024 1024"
            >
              <path d="M874.690416 495.52477c0 11.2973-9.168824 20.466124-20.466124 20.466124l-604.773963 0 188.083679 188.083679c7.992021 7.992021 7.992021 20.947078 0 28.939099-4.001127 3.990894-9.240455 5.996574-14.46955 5.996574-5.239328 0-10.478655-1.995447-14.479783-5.996574l-223.00912-223.00912c-3.837398-3.837398-5.996574-9.046027-5.996574-14.46955 0-5.433756 2.159176-10.632151 5.996574-14.46955l223.019353-223.029586c7.992021-7.992021 20.957311-7.992021 28.949332 0 7.992021 8.002254 7.992021 20.957311 0 28.949332l-188.073446 188.073446 604.753497 0C865.521592 475.058646 874.690416 484.217237 874.690416 495.52477z"></path>
            </svg>
            <span>Back</span>
          </button>
          </div>
          

          <div className="note-patinfo" >
            <div className="note-patalign" >
              <label >Patient Name&nbsp;:&nbsp;</label>
              <span style={{fontWeight:600}}>{noteform.PatientName}</span>
            </div>
            <div className="note-patalign" >
              <label >Date Of Birth&nbsp;:&nbsp;</label>
              <span style={{fontWeight:600}}>{noteform.DateOfBirth}</span>
            </div>
          </div>

          <div style={{width:'30%'}}></div>
        </div>

         <div className="add-shownote">
          <button className="note-addbtn" 
            disabled = {!permissions?.SnapPage?.addNotes} onClick={handleAddClick}>ADD Notes</button>
          {showForm && (
            <div style={{marginTop:'5px'}}>
              <div >
                     <textarea  
                     className="enter-notes"
               value={editedValues.Notes}
              onChange={(e) => handleInputChange("Notes", e.target.value)}
              placeholder="Enter your notes here..."
              />
              </div>
             
              <div className="notes-saveXclr"
              // style={{marginLeft:'27rem',display:'flex',justifyContent:'center'}}
              >
                <button onClick={handleSaveClick} className="save-btn-note"
              // disabled={!editedValues.Notes} 
              // disabled={!(editedValues.Notes && editedValues.Notes.trim())}
               >Save</button>
                <button onClick={handleCancelClick} className="save-btn-note">Cancel</button>
                <button onClick={handleClearClick} className="save-btn-note">Clear</button>
              </div>
            </div>
            
          )}
          
         </div>
       
           <div className='note-main'>
            <div className='note-searchbox-main'>
            <div className='note-searchbox'>
                <input className='notesearch-input'  type="text"
                    placeholder={`Search for "${columns[index]}"`}
                    onFocus={() => setIndex(0)}
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                />
                
            </div>
             
             <div className="table-rightnote">
              <div className="table-rightnote-show">
                  <label  style={{marginTop:'7px',fontWeight:600}}>Show All</label>
              <Switch
      checked={checked}
      onChange={handlecheckChange}
      color="primary"
      sx={{
        // Optional: grey thumb when off
          marginTop: '-5px',
        '& .MuiSwitch-thumb': {
          backgroundColor: checked ? '#1976d2' : '',
        },
        '@media screen and (min-width: 1900px) and (max-width:4000px)': {
          transform: "scale(1.3)",marginTop:'1px'},
      }}
    />

              </div>
                
           <div>
              <img src={pdf} className="notespdfs" onClick={NotesPDF} />

                </div>
             </div>
            
          </div>

<div className='tablescroll-note'>
  <table className='note-table'>
    <thead >
      <tr className='notetable-head'>
                           <th>Notes</th>
                    <th>Modified&nbsp;By</th>
                    <th>Created&nbsp;Date</th>
                    <th>pin</th>
                    <th>Visibility</th>
      </tr>
    </thead>
    <tbody>
      {currentItems.map((row, index) => {
                    const isHidden = hiddenRows.includes(row.PVNHID);
                    return (
                    <tr
                        className="notetable-row"
                          key={index}
                          id={index % 2 === 0 ? "even-rownote" : "odd-rownote"}
                    >
                      <td className="overflow-text1" title={row.Notes}>
                        <div
                          className={
                            row.Notes && row.Notes.length > 200
                              ? "notes-content"
                              : "notes-content1"
                          }
                        >
                          {row.Notes}
                        </div>
                      </td>
                      <td>{row.RecordModifiedBy}</td>
                      <td>{formatdatetime(row.RecordCreatedDate)}</td>
                      <td>
                        <button disabled = {!permissions?.SnapPage?.Notepin}
                          onClick={() =>
                            handlePinToggle(row.PVNHID, row.IsPinned)
                          }
                          className="pin-btn"
                        >
                          {row.IsPinned ? (
                            <PushPinIcon sx={{
                              '@media screen and (min-width: 1900px) and (max-width:4000px)': {
                                  width:'1.8rem',height:'1.8rem'},}}/>
                          ) : (
                            <PushPinOutlinedIcon sx={{
                              '@media screen and (min-width: 1900px) and (max-width:4000px)': {
                                  width:'1.8rem',height:'1.8rem'},}}/>
                          )}
                        </button>
                      </td>
                      <td>{!row.IsPinned && !isHidden && (
                        <div  onClick={() => handleHideRow(row.PVNHID)}>
                                <i class="bi bi-eye"></i>
                        </div>
          )}
          {showAll && isHidden && (
            <div onClick={() => handleUnhideRow(row.PVNHID)}>
                 <i class="bi bi-eye-slash-fill"></i>
            </div>
          )}</td>
                    </tr>
                  )}
                 )}
    </tbody>
  </table>
</div>



          <div className='notetable-pagin'>
            <div >
                <Pagination
                  page={currentPage}
                  count={totalPages}
                  onChange={handleChange} 
                  showFirstButton 
                  showLastButton
    //              
     sx={{
  '& .MuiPaginationItem-root': {
    cursor: 'pointer',
    width: '1.5rem',
    height: '1.8rem',
    '@media screen and (min-width: 1900px) and (max-width:4000px)': {
      width: '2rem',
      height: '2rem',
      fontSize: '1rem',
    },
    '@media screen and (min-width: 1600px) and (max-width:1890px)': {
      width: '2rem',
      height: '2rem',
    },
  },

  '& .MuiPaginationItem-firstLast': {
    cursor: 'pointer',
    width: '1.5rem',
    height: '1.8rem',
    fontSize: '1.4rem', // container font size if needed
    '& svg': {
      fontSize: '1.3rem',
      width: '1.3rem',
      height: '1.3rem',
      '@media screen and (min-width: 1900px) and (max-width:4000px)': {
        fontSize: '1.7rem',
        width: '1.5rem',
        height: '1.9rem',
      },
      '@media screen and (min-width: 1600px) and (max-width:1890px)': {
        fontSize: '1.7rem',
        width: '1.7rem',
        height: '1.7rem',
      },
    },
    '@media screen and (min-width: 1900px) and (max-width:4000px)': {
      width: '1.7rem',
      height: '1.7rem',
      fontSize: '2rem',
    },
    '@media screen and (min-width: 1600px) and (max-width:1890px)': {
      width: '1.7rem',
      height: '1.7rem',
    },
  },

  '& .MuiPaginationItem-previousNext': {
    cursor: 'pointer',
    width: '1.5rem',
    height: '1.8rem',
    fontSize: '1.4rem',
    '& svg': {
      fontSize: '1.3rem',
      width: '1.3rem',
      height: '1.3rem',
      '@media screen and (min-width: 1900px) and (max-width:4000px)': {
        fontSize: '1.7rem',
        width: '1.5rem',
        height: '1.5rem',
      },
      '@media screen and (min-width: 1600px) and (max-width:1890px)': {
        fontSize: '1.7rem',
        width: '1.7rem',
        height: '1.7rem',
      },
    },
    '@media screen and (min-width: 1900px) and (max-width:4000px)': {
      width: '1.7rem',
      height: '1.7rem',
      fontSize: '2rem',
    },
    '@media screen and (min-width: 1600px) and (max-width:1890px)': {
      width: '1.7rem',
      height: '1.7rem',
    },
  },
}}

                  
                  >

                </Pagination>
            </div>
            <div style={{marginRight:'15px'}}>
              <span className='pagin-rightnote'>
                {rangeStart}-{rangeEnd} of {tableDatalib.length} items
              </span>
            </div>
          </div>
   

         </div>
         
       
      </div>

      {/* <div className="patient-info">
        <div style={{ display: "flex", width:'100%' }}>
          <div style={{ width:'35%' }}>
            <button onClick={() => handlebackbtn()} class="backbutton">
              <svg
                height="16"
                width="16"
                xmlns="http://www.w3.org/2000/svg"
                version="1.1"
                viewBox="0 0 1024 1024"
              >
                <path d="M874.690416 495.52477c0 11.2973-9.168824 20.466124-20.466124 20.466124l-604.773963 0 188.083679 188.083679c7.992021 7.992021 7.992021 20.947078 0 28.939099-4.001127 3.990894-9.240455 5.996574-14.46955 5.996574-5.239328 0-10.478655-1.995447-14.479783-5.996574l-223.00912-223.00912c-3.837398-3.837398-5.996574-9.046027-5.996574-14.46955 0-5.433756 2.159176-10.632151 5.996574-14.46955l223.019353-223.029586c7.992021-7.992021 20.957311-7.992021 28.949332 0 7.992021 8.002254 7.992021 20.957311 0 28.949332l-188.073446 188.073446 604.753497 0C865.521592 475.058646 874.690416 484.217237 874.690416 495.52477z"></path>
              </svg>
              <span>Back</span>
            </button>
          </div>

          <div className="four-collistall">
            <div className="label-div">
              <label className="col-label">Patient Name&nbsp;:</label>
              <span style={{fontWeight:600}}>{noteform.PatientName}</span>
            </div>
            <div className="label-div">
              <label className="col-label">Date Of Birth&nbsp;:</label>
              <span style={{fontWeight:600}}>
                {formatdate(noteform.DateOfBirth)}
              </span>
            </div>
          </div>
        </div>
      </div> */}

      {/* <div>
        <button className="notesadd1" disabled = {!permissions?.SnapPage?.addNotes} onClick={handleAddClick}>
          Add Notes
        </button>

        {showForm && (
          <div className="notes1-form">
            <textarea
              value={editedValues.Notes}
              onChange={(e) => handleInputChange("Notes", e.target.value)}
              placeholder="Enter your notes here..."
            />
            <div
              className="form1-buttons"
              style={{ marginBottom: "10px", marginLeft: "55%" }}
            >
              <button className="notesadd1" onClick={handleSaveClick} 
              // disabled={!editedValues.Notes} 
              // disabled={!(editedValues.Notes && editedValues.Notes.trim())}
              
              >
                Save
              </button>
              <button className="notesadd1" onClick={handleCancelClick}>
                Cancel
              </button>
              <button className="notesadd1" onClick={handleClearClick}>
                Clear
              </button>
            </div>
          </div>
        )}
      </div> */}
      {/* <div>
        <div className="backhome"></div>

        <main className="main1-notehistory">
          <section className="Header-notehistory">
            <div
              className="searchbox-notehistory"
              style={{ marginBottom: "5px" }}
            >
              <input
                className="searchtext-notehistory"
                type="text"
                placeholder={`Search for "${columns[index]}"`}
                onFocus={() => setIndex(0)}
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              ></input>
            </div>

            <div style={{width:'50%',display:'flex',justifyContent:'flex-end',gap:'10px'}}>
             
         <label style={{marginTop:'7px',fontWeight:600}}>Show All</label>
              <Switch
      checked={checked}
      onChange={handlecheckChange}
      color="primary"
      sx={{
        // Optional: grey thumb when off
        '& .MuiSwitch-thumb': {
          backgroundColor: checked ? '#1976d2' : '',
        },
      }}
    />

                <div>
              <img src={pdf} className="notespdfs" onClick={NotesPDF} />

                </div>
            </div>
          </section>
          <section>
            <div className="table-scroll-notehistory">
              <table className="tablepat-notehistory" style={{ width: "100%" }}>
                <thead className="theadpat-notehistory">
                  <tr className="tablerow-notehistory">
                    <th>Notes</th>
                    <th>Modified&nbsp;By</th>
                    <th>Created&nbsp;Date</th>
                    <th>pin</th>
                    <th>Visibility</th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.map((row, index) => {
                    const isHidden = hiddenRows.includes(row.PVNHID);
                    return (
                    <tr
                      className="tablerow-notehistory"
                      key={index}
                      id={
                        index % 2 === 0
                          ? "even-row-notehistory"
                          : "odd-row-notehistory"
                      }
                    >
                      <td className="overflow-text1" title={row.Notes}>
                        <div
                          className={
                            row.Notes && row.Notes.length > 200
                              ? "notes-content"
                              : "notes-content1"
                          }
                        >
                          {row.Notes}
                        </div>
                      </td>
                      <td>{row.RecordModifiedBy}</td>
                      <td>{formatdatetime(row.RecordCreatedDate)}</td>
                      <td>
                        <button disabled = {!permissions?.SnapPage?.Notepin}
                          onClick={() =>
                            handlePinToggle(row.PVNHID, row.IsPinned)
                          }
                          className="pin-btn"
                        >
                          {row.IsPinned ? (
                            <PushPinIcon />
                          ) : (
                            <PushPinOutlinedIcon />
                          )}
                        </button>
                      </td>
                      <td>{!row.IsPinned && !isHidden && (
                        <div  onClick={() => handleHideRow(row.PVNHID)}>
                                <i class="bi bi-eye"></i>
                        </div>
          )}
          {showAll && isHidden && (
            <div onClick={() => handleUnhideRow(row.PVNHID)}>
                 <i class="bi bi-eye-slash-fill"></i>
            </div>
          )}</td>
                    </tr>
                  )}
                 )}
                </tbody>
              </table>
            </div>
          </section>

          <div className="foot-notehistory">
            <div className="pagin-notehistory">
              <Pagination
                page={currentPage}
                count={totalPages}
                onChange={handleChange}
                showFirstButton
                showLastButton
              />
            </div>
            <div className="Range-notehistory">
              <span>
                {rangeStart}-{rangeEnd} of {filterNote.length} items
              </span>
            </div>
          </div>
        </main>
      </div> */}
    </div>
  );
}

export default NotesHistory;
