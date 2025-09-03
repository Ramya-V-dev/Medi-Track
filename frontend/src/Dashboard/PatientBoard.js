import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import "./PatientBoard.css";
import axios from "axios";
import Pagination from "@mui/material/Pagination";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import { format, parseISO } from "date-fns";
import { toZonedTime, fromZonedTime } from "date-fns-tz";
import Loader from "./Loader";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  setPatientIdentifier,
  setlibertyRow,
  logout,
  settoken,
} from "../Redux/slice.js";
import file from "../Dashboard/img/file.png";
import VisibilityIcon from "@mui/icons-material/Visibility";
import poweroff from "./img/poweroff.png";
import HomeIcon from "@mui/icons-material/Home";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";

const BaseUrl = process.env.REACT_APP_API_BASE_URL;

function PatientBoard() {
  const [tableData, setTableData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [currentPage, setCurrentPage] = useState(() => {
    const storedPage = localStorage.getItem("currentPage");
    return storedPage ? parseInt(storedPage, 10) : 1;
  });
  const itemsPerPage = 15;
  const [searchInput, setSearchInput] = useState(
    localStorage.getItem("searchInput") || ""
  );
  const [dateFilter, setDateFilter] = useState(
    localStorage.getItem("dateFilter") || ""
  );
  const [isEditing, setIsEditing] = useState(false);
  const [editedValues, setEditedValues] = useState({});
  const [editedRowIndex, setEditedRowIndex] = useState(null);
  const [activeStatusFilter, setActiveStatusFilter] = useState(
    localStorage.getItem("activeStatusFilter") || "Active"
  );

  const [mediAssistFilter, setMediAssistFilter] = useState(
    localStorage.getItem("mediAssistFilter") || "ALL"
  );
  const [pharmacyfilter, setPharmacyfilter] = useState(
    localStorage.getItem("pharmacyfilter") || "ALL"
  );
  const [packpharmacyfilter, setPackPharmacyfilter] = useState(
    localStorage.getItem("packpharmacyfilter") || "ALL"
  );

  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const name = location.state?.name || "";

  const [sortColumn, setSortColumn] = useState(
    localStorage.getItem("sortColumn") || "DisplayName"
  );
  const [sortOrder, setSortOrder] = useState(
    localStorage.getItem("sortOrder") || "asc"
  );
  const [selectedPatient, setSelectedPatient] = useState(null);
 const { storingdata, calenderview } = location.state || {};
  const handlehomebtn = () => {
    navigate("/homepage", { state: { name,calenderview: true } });
  };

  const RoleDesc = useSelector((state) => state.PatientIdentifier.RoleDesc);
  const signout = () => {
    dispatch(logout());
    navigate("/");
  };

   

  const calendarpage = (PatientIdentifier) => {
    dispatch(setPatientIdentifier(PatientIdentifier));
    console.log(PatientIdentifier);
  if (location.state?.calenderview) {
      const storedStatecal = localStorage.getItem("calendarFilters");
      if (storedStatecal) {
        const parsedState = JSON.parse(storedStatecal);
        localStorage.setItem("currentView", parsedState.currentView);
        localStorage.setItem("currentDate", parsedState.currentDate);
        localStorage.setItem("statusOption", parsedState.statusOption);
        localStorage.setItem("selectedOption", parsedState.selectedOption);
        localStorage.setItem(
          "packPharmacyselectedOption",
          parsedState.packPharmacyselectedOption
        );
      }}
    navigate("/caldrvw", { state: { name,calenderview: true  } });
  };

  const { token = null, tokenname = null } = useSelector(
    (state) => state.PatientIdentifier ?? {}
  );

  useEffect(() => {
    fetchdata(); // Call the fetchdata function when the component mounts
  }, []);

  const fetchdata = async () => {
    try {
      if (!token || !tokenname) {
        navigate("/");
        return;
      }
      const resp = await axios.get(`${BaseUrl}/dbget`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const fetcheddata = resp.data.data;

      setTableData(fetcheddata);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const { patientName } = location.state || {};

  useEffect(() => {
    // Set the search input to the patientIdentifier when the component mounts
    if (patientName) {
      setSearchInput(patientName);
    }
  }, [patientName]);

  useEffect(() => {
    localStorage.removeItem("searchInput", searchInput);
    localStorage.removeItem("activeStatusFilter", activeStatusFilter);
    localStorage.removeItem("mediAssistFilter", mediAssistFilter);
    localStorage.removeItem("dateFilter", dateFilter);
    localStorage.removeItem("pharmacyfilter", pharmacyfilter);
    localStorage.removeItem("packpharmacyfilter", packpharmacyfilter);
    localStorage.removeItem("sortColumn", sortColumn);
    localStorage.removeItem("sortOrder", sortOrder);
    localStorage.removeItem("currentPage", currentPage);
  }, [currentPage]);

  const formatdate = (date) => {
    // return (date?.split(' ')[0])
    if (!date) return "-";

    const [year, month, day] = date.split(" ")[0].split("-");
    return `${month}/${day}/${year}`;
  };

  useEffect(() => {
    const filtered = tableData.filter((item) => {
      // Filter by fields other than date
      const otherFieldsMatch = [
        // item.PatientName,
        item.GlobalId,
        item.SSN,
        item.DisplayName,
        item.ActiveStatus,
        formatdate(item.DateOfBirth),
      ].some(
        (term) =>
          term &&
          term.toString().toLowerCase().includes(searchInput.toLowerCase())
      );

      // Filter by date
      const dateColumnMatch = [formatdate(item.NextPackDate)].some((term) => {
        if (!dateFilter) return true; // If no date filter is set, consider it a match
        if (!term) return false; // If term is null, it's not a match unless dateFilter is empty

        const formattedDate =
          term &&
          term.toString().toLowerCase().includes(dateFilter.toLowerCase());
        return formattedDate;
      });

      // Filter by active status
      const optionActiveStatus =
        activeStatusFilter === "ALL" ||
        item.ActiveStatus === activeStatusFilter;

      // Filter by MediAssist status
      const isMediAssistMatch =
        mediAssistFilter === "ALL" || item.MediAssist === mediAssistFilter;

      // Filter by pharmacy
      const isPharmacyMatch =
        pharmacyfilter === "ALL" || item.HomePharmarcy === pharmacyfilter;

      const ispackPharmacyMatch =
        packpharmacyfilter === "ALL" ||
        item.PackPharmarcy === packpharmacyfilter;

      return (
        otherFieldsMatch &&
        optionActiveStatus &&
        isMediAssistMatch &&
        dateColumnMatch &&
        isPharmacyMatch &&
        ispackPharmacyMatch
      );
    });

    setFilteredData(filtered);

    if (searchInput) {
      setCurrentPage(1);
    }
    localStorage.setItem("currentPage", "1");
  }, [
    searchInput,
    activeStatusFilter,
    mediAssistFilter,
    tableData,
    dateFilter,
    pharmacyfilter,
    packpharmacyfilter,
  ]);

  const handleChange = (event, page) => {
    setCurrentPage(page);
  };

  const columns = ["GlobalId", "SSN", "PatientName", "DateOfBirth"]; // Example column names
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((index) => (index + 1) % columns.length);
    }, 1000); // Change column every second

    return () => clearInterval(interval);
  }, [columns.length]);

  const handleEdit = (index) => {
    setIsEditing(true);
    const tableDataIndex = (currentPage - 1) * itemsPerPage + index;
    setEditedValues({ ...filteredData[tableDataIndex] });
    setEditedRowIndex(index);
  };

  const handleSave = async () => {
    try {
      const tableDataIndex = (currentPage - 1) * itemsPerPage + editedRowIndex;
      const updatedTableData = [...filteredData];
      updatedTableData[tableDataIndex] = {
        ...editedValues,
        RecordModifiedBy: name,
      };

      setFilteredData(updatedTableData);
      setIsEditing(false);

      // Update the data on the server
      await axios.put(`${BaseUrl}/manual`, updatedTableData[tableDataIndex]);

      await axios.put(
        `${BaseUrl}/datemanual`,
        updatedTableData[tableDataIndex]
      );
      const response = await axios.get(`${BaseUrl}/dbget`);

      setFilteredData(response.data.data);
    } catch (error) {
      console.error("Error updating data:", error);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedValues({});
  };

  const handleInputChange = (field, value) => {
    setEditedValues((prevValues) => ({
      ...prevValues,
      [field]: value,
    }));
  };

  const handleActiveChange = (value) => {
    setActiveStatusFilter(value === "ALL" ? "ALL" : value);
    setCurrentPage(1); // Reset pagination to first page when filter changes
  };

  const handlepharmacyfilterChange = (value) => {
    setPharmacyfilter(value === "ALL" ? "ALL" : value);
    setCurrentPage(1); // Reset pagination to first page when filter changes
  };

  const handlepackpharmacyfilterChange = (value) => {
    setPackPharmacyfilter(value === "ALL" ? "ALL" : value);
    setCurrentPage(1); // Reset pagination to first page when filter changes
  };

  const timeZone = "America/New_York";

  const handleLastPackDateChange = (date, index) => {
    console.log("needate", date);
    const formattedDate = date
      ? format(fromZonedTime(date, timeZone), "yyyy-MM-dd")
      : null; // Check if date is null
    const newDates = [...filteredData];
    newDates[index] = formattedDate;
    setFilteredData(newDates);
    setEditedValues((prevState) => ({
      ...prevState,
      LastPackDate: formattedDate,
    }));
  };

  const handleNextPackDateChange = (date, index) => {
    const formattedDate = date
      ? format(fromZonedTime(date, timeZone), "yyyy-MM-dd")
      : null; // Check if date is null
    const newDates = [...filteredData];
    newDates[index] = formattedDate;
    setFilteredData(newDates);
    setEditedValues((prevState) => ({
      ...prevState,
      NextPackDate: formattedDate,
    }));
  };

  const handlelibertychange = (PatientIdentifier, row) => {
    const stateToStore = {
      searchInput,
      activeStatusFilter,
      mediAssistFilter,
      dateFilter,
      pharmacyfilter,
      packpharmacyfilter,
      sortColumn,
      sortOrder,
      currentPage,
    };

    localStorage.setItem("patientListState", JSON.stringify(stateToStore));

    dispatch(setPatientIdentifier(PatientIdentifier));
    console.log(row, "rows");
    //   localStorage.setItem("data",JSON.stringify(row) )
    //  const patdata =  localStorage.getItem('data')
    //   dispatch(setlibertyRow(patdata))
    navigate(`/medsnap`, { state: { row, name, PatientIdentifier } });
  };

  const handlenoteclick = (PatientIdentifier) => {
    navigate(`/notes/${PatientIdentifier}`, { state: { name } });
  };

  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortOrder("asc");
    }
  };

  const sortData = () => {
    if (!sortColumn) return filteredData;

    return [...filteredData].sort((a, b) => {
      let comparison;

      if (sortColumn === "NextPackDate" || sortColumn === "LastPackDate") {
        // Always put null values at the end, regardless of sort order
        if (a[sortColumn] === null && b[sortColumn] === null) return 0;
        if (a[sortColumn] === null) return 1;
        if (b[sortColumn] === null) return -1;

        // Both values are non-null, proceed with date comparison
        const dateA = new Date(a[sortColumn]);
        const dateB = new Date(b[sortColumn]);
        comparison = dateA - dateB;
      } else {
        const valA = a[sortColumn] ?? "";
        const valB = b[sortColumn] ?? "";
        comparison = valA < valB ? -1 : valA > valB ? 1 : 0;
      }

      return sortOrder === "asc" ? comparison : -comparison;
    });
  };

  const arrowIcon = (column) => {
    const isSelected = sortColumn === column;
    let icon = "↓";

    if (isSelected) {
      icon = sortOrder === "asc" ? "↑" : "↓";
    }

    return (
      <span
        className={`icon-arrow ${isSelected ? "selected-icon" : ""}`}
        style={{
          backgroundColor: isSelected ? "#fff" : "transparent",
          padding: "2px 4px",
          borderRadius: "3px",
          color: isSelected ? "#000" : "#fff",
          marginLeft: "2px",
          borderRadius: "50%",
          fontSize: "15px",
          // padding: "3px 6px",
        }}
      >
        {icon}
      </span>
    );
  };

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const rangeStart = indexOfFirstItem + 1;
  const rangeEnd = Math.min(indexOfLastItem, filteredData.length);
  const currentItems = sortData(filteredData).slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const handleViewClick = (patient) => {
    const stateToStore = {
      searchInput,
      activeStatusFilter,
      mediAssistFilter,
      dateFilter,
      pharmacyfilter,
      packpharmacyfilter,
      sortColumn,
      sortOrder,
      currentPage,
    };

    localStorage.setItem("patientListState", JSON.stringify(stateToStore));
    console.log("selectedpatient", patient);
    setSelectedPatient(patient);
    navigate("/view", { state: { patient, name, currentPage } });
    // setIsModalOpen(true);
  };

  const [menuOpen, setMenuOpen] = useState(false);


  return (
    <div>

<div className='nav-maincom' >
      <nav className='nav-maincom'>
          <div className='comnavbar-full'>
            <div className='nav-leftcom'>
            <h4 className='h5-leftcom' 
            style={{display:'flex', marginLeft:'0.5rem', textAlign:'center', padding:'0.3rem', fontFamily:'Volkhov, serif'}}>
                Hello, {name}{" "}
                {RoleDesc &&
                RoleDesc.toLowerCase() !== "null" &&
                RoleDesc.trim() !== ""
                  ? `(${RoleDesc})`
                  : ""}
              </h4>
            </div>
            
            <div className='nav-middlecom'>
              <h4 className='h4-midcom' style={{display:'flex', fontWeight:600}}>Compliance Pack Patient List</h4>
            </div>
          
           <div className='nav-containercom'>
              <ul className={`nav-ulcom ${menuOpen ? "show":""}`}>
                <li className='nav-calcom'>
                <CalendarMonthIcon  sx={{color: 'white', cursor:'Pointer',width:'1.8rem',height:'1.8rem',
      '@media screen and (min-width: 1900px) and (max-width:4000px)': { width: '2.3rem', height: '2.3rem' },
      '@media screen and (min-width: 1600px) and (max-width:1890px)' : {width: '2rem', height: '2rem'},
     }}  onClick={calendarpage}></CalendarMonthIcon>
                </li>
                <li className='nav-homecom'>
                  <HomeIcon  sx={{color: 'white', cursor:'Pointer',width:'1.8rem',height:'1.8rem',
      '@media screen and (min-width: 1900px) and (max-width:4000px)': { width: '2.3rem', height: '2.3rem' },
      '@media screen and (min-width: 1600px) and (max-width:1890px)' : {width: '2rem', height: '2rem'},
     }}  onClick={handlehomebtn}></HomeIcon>
                </li>
                <li>
                  <picture className='img-outcom' onClick={signout}>
                        <source srcset={poweroff} type="image/svg+xml"/>
                        <img src={poweroff} class="img-fluid" alt="..."/>
                    </picture>
                </li>
              </ul>

            </div>

          </div>
         </nav>
      </div>

      <div className="com-navbottom">
        {isLoading ? (
          <Loader />
        ) : (
          <>
     
            <div className='com-main'>
          <div className='com-searchbox-main'>
            <div className='com-searchbox'>
                <input className='comsearch-input'  type="text"
                    placeholder={`Search for "${columns[index]}"`}
                    onFocus={() => setIndex(0)}
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                />
                
            </div>
            <div className='com-searchbox1'>
                <input className='comsearch-input1' type="text"
                    placeholder={"Search for NextPackDate...."}
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                />
            </div>
          </div>


        

<div className='tablescroll-com'>
  <table className='com-table'>
    <thead >
      <tr className='comtable-head'>
      <th onClick={() => handleSort("DisplayName")}>
                          Patient&nbsp;Name{arrowIcon("DisplayName")}
                        </th>
                        <th onClick={() => handleSort("DateOfBirth")}>
                          Date&nbsp;Of&nbsp;Birth{arrowIcon("DateOfBirth")}
                        </th>
        <th >
          <div className="dropdown">
          <span >Home&nbsp;Pharmarcy:</span>
                <button className="btn1 btn1-secondary " type="button" id="mediAssistDropdown" data-bs-toggle="dropdown" aria-expanded="false">
                   {pharmacyfilter}
                </button>
                <ul className="dropdown-menu" 
                 aria-labelledby="mediAssistDropdown"
              >
                  <li><button className="dropdown-item" type="button" onClick={() => handlepharmacyfilterChange('ALL')}>ALL</button></li>
                  <li><button className="dropdown-item" type="button" onClick={() => handlepharmacyfilterChange('ASH')}>ASH</button></li>
                  <li><button className="dropdown-item" type="button" onClick={() => handlepharmacyfilterChange('BC')}>BC</button></li>
                  <li><button className="dropdown-item" type="button" onClick={() => handlepharmacyfilterChange('CEN')}>CEN</button></li>
                  <li><button className="dropdown-item" type="button" onClick={() => handlepharmacyfilterChange('FB')}>FB</button></li>
                  <li><button className="dropdown-item" type="button" onClick={() => handlepharmacyfilterChange('GR')}>GR</button></li>
                  <li><button className="dropdown-item" type="button" onClick={() => handlepharmacyfilterChange('MH')}>MH</button></li>
                  <li><button className="dropdown-item" type="button" onClick={() => handlepharmacyfilterChange('MV')}>MV</button></li>
                  <li><button className="dropdown-item" type="button" onClick={() => handlepharmacyfilterChange('SS')}>SS</button></li>
                  <li><button className="dropdown-item" type="button" onClick={() => handlepharmacyfilterChange('TB')}>TB</button></li>
                  <li><button className="dropdown-item" type="button" onClick={() => handlepharmacyfilterChange('VB')}>VB</button></li>

                </ul>
                </div>
          </th>
        <th>
          <div className="dropdown">
                   <span>Pack&nbsp;Pharmarcy:</span> 
                <button className="btn1 btn1-secondary" type="button" id="mediAssistDropdown" data-bs-toggle="dropdown" aria-expanded="false">
                   {packpharmacyfilter}
                </button>
                <ul className="dropdown-menu" 
                 aria-labelledby="mediAssistDropdown"
              >
                  <li><button className="dropdown-item" type="button" onClick={() => handlepackpharmacyfilterChange('ALL')}>ALL</button></li>
                  
                  <li><button className="dropdown-item" type="button" onClick={() => handlepackpharmacyfilterChange('MH')}>MH</button></li>
                  <li><button className="dropdown-item" type="button" onClick={() => handlepackpharmacyfilterChange('MV')}>MV</button></li>
                  
                  <li><button className="dropdown-item" type="button" onClick={() => handlepackpharmacyfilterChange('VB')}>VB</button></li>
                  <li><button className="dropdown-item" type="button" onClick={() => handlepackpharmacyfilterChange('SS')}>SS</button></li>


                </ul>
                </div>

        </th>
        <th >Notes</th>
        <th onClick={() => handleSort("LastPackDate")}>
                          Last&nbsp;Pack&nbsp;Date
                          {arrowIcon("LastPackDate")}
                        </th>
                        <th onClick={() => handleSort("NextPackDate")}>
                          Next&nbsp;Pack&nbsp;Date
                          {arrowIcon("NextPackDate")}
                        </th>
                        {/* <th>LastPackDate</th> */}
        {/* <th>NextPackDate</th> */}
        <th>
          <div className="dropdown">
              <span>Active&nbsp;Status:</span>
                <button className="btn1 btn1-secondary " type="button" id="mediAssistDropdown" data-bs-toggle="dropdown" aria-expanded="false">
                   {activeStatusFilter}
                </button>
                <ul className="dropdown-menu" 
                 aria-labelledby="mediAssistDropdown"
              >
                  <li><button className="dropdown-item" type="button" onClick={() => handleActiveChange('ALL')}>ALL</button></li>
                  <li><button className="dropdown-item" type="button" onClick={() => handleActiveChange('Active')}>Active</button></li>
                  <li><button className="dropdown-item" type="button" onClick={() => handleActiveChange('Inactive')}>Inactive</button></li>
                </ul>
                </div>

        </th>
        <th className='com-action'>View</th>
      </tr>
    </thead>
    <tbody>
      {currentItems.map((row, index) => (
        <tr 
          key={index} 
          id={index % 2 === 0 ? 'even-row' : 'odd-row'} 
          className='comtable-row'
        >
          <td onClick={() => handlelibertychange(row.PatientIdentifier, row)} 
            style={{ cursor: "pointer" }}>{row.DisplayName}</td>
          <td onClick={() => handlelibertychange(row.PatientIdentifier, row)} 
                  style={{ cursor: "pointer" }}>{row.DateOfBirth}</td>
          <td className="center-col" onClick={() => handlelibertychange(row.PatientIdentifier, row)} 
                    style={{ cursor: "pointer" }}>{row.HomePharmarcy}</td>
          <td onClick={() => handlelibertychange(row.PatientIdentifier, row)} 
                style={{ cursor: "pointer" }}>{row.PackPharmarcy}</td>
          <td className='overflow-text-com' onClick={() => handlelibertychange(row.PatientIdentifier, row)} 
               style={{ cursor: "pointer" }} title={row.Notes}>{row.Notes}</td>
          <td onClick={() => handlelibertychange(row.PatientIdentifier, row)} 
                style={{ cursor: "pointer" }}>{row.LastPackDate}</td>
          <td onClick={() => handlelibertychange(row.PatientIdentifier, row)} 
               style={{ cursor: "pointer" }}>{row.NextPackDate}</td>
          <td onClick={() => handlelibertychange(row.PatientIdentifier, row)} 
                style={{ cursor: "pointer" }}>{row.ActiveStatus}</td>
          <td className='com-view' 
          onClick={() => handleViewClick(row)}
             title="View">
           <VisibilityIcon sx={{width:'100%',cursor:'pointer'}}></VisibilityIcon></td>
        </tr>
      ))}
    </tbody>
  </table>
</div>


         


          <div className='comtable-pagin'>
            <div >
                <Pagination
                  page={currentPage}
                  count={totalPages}
                  onChange={handleChange} 
                  showFirstButton 
                  showLastButton
                   sx={{
  '& .MuiPaginationItem-root': {
    cursor: 'pointer',
    width: '0rem',
    height: '1.5rem',
    '@media screen and (min-width: 1900px) and (max-width:4000px)': {
      width: '2.3rem',
      height: '2.3rem',
      fontSize: '1.1rem',
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
        width: '1.7rem',
        height: '2rem',
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
        width: '1.7rem',
        height: '1.7rem',
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
              <span className='pagin-rightcom'>
                {rangeStart}-{rangeEnd} of {tableData.length} items
              </span>
            </div>
          </div>
   

         </div>
          </>
        )}
      </div>
    </div>
  );
}

export default PatientBoard;
