import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import "./LibertyList.css";
import axios from "axios";
import Pagination from "@mui/material/Pagination";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import { format } from "date-fns";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import Loader from "./Loader";
import HomeIcon from "@mui/icons-material/Home";
import poweroff from "./img/poweroff.png";
import { logout } from "../Redux/slice.js";
import { getPermissionsByRole } from "../Finallogin/GetPermission.js";
// import {BaseUrl} from '../FrontConfig.js'

const BaseUrl = process.env.REACT_APP_API_BASE_URL;

function LibertyList() {
  const [tableDatalib, setTableDatalib] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const itemsPerPage = 15;
  const [searchInput, setSearchInput] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const location = useLocation();
  const name = location.state?.name;
  // const {PatientIdentifier} = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [sortColumn, setSortColumn] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [showModal, setShowModal] = useState(false);
  const { token = null, tokenname = null } = useSelector(
    (state) => state.PatientIdentifier ?? {}
  );
  const Role = useSelector((state) => state.PatientIdentifier.Role);
  const permissions = getPermissionsByRole(Role)

  const RoleDesc = useSelector((state) => state.PatientIdentifier.RoleDesc);

  // console.log(Role,'type')

  const signout = () => {
    dispatch(logout());
    navigate("/");
  };
  const PatientIdentifier = location.state?.PatientIdentifier || "";
  const liblistrow = useSelector(
    (state) => state.PatientIdentifier.selectedLibertyRow
  );
  const [liblistform, setliblistform] = useState([]);

  useEffect(() => {
    const data = liblistrow || JSON.parse(localStorage.getItem("data"));
    setliblistform((prevFormData) => ({
      ...prevFormData,

      DisplayName: data.DisplayName,
      Globalid: data.GlobalId,
      SSN: data.SSN,
      DateOfBirth: data.DateOfBirth,
      PatientIdentifier: data.PatientIdentifier,
      street: data.street,
      city: data.city,
      state: data.state,
      zip: data.zip,
      Phone: data.Phone,
    }));
    // }
  }, [liblistrow]);

  useEffect(() => {
    const fetchdatalib = async () => {
      try {
        if (!token || !tokenname) {
          navigate("/");
          return;
        }
        const resp = await axios.get(
          `${BaseUrl}/libget/${location.state?.PatientIdentifier}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setTableDatalib(resp.data.data);
        setIsLoading(false);
        console.log("data get", resp.data.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchdatalib(); // Call the fetchdata function when the component mounts
  }, [location.state?.PatientIdentifier]);

  const formatdate = (date) => {
    // return (date?.split(' ')[0])
    if (!date) return "-";

    const [year, month, day] = date.split(" ")[0].split("-");
    return `${month}/${day}/${year}`;
  };

  useEffect(() => {
    const filtered = tableDatalib.filter((item) => {
      // Filter by fields other than date
      const otherFieldsMatch = [
        item.Drug_name,
        formatdate(item.DateDispensedSQL),
        item.Pharmacy,
        item["RX#"],
      ].some(
        (term) =>
          term &&
          term.toString().toLowerCase().includes(searchInput.toLowerCase())
      );

      return otherFieldsMatch;
    });

    setFilteredData(filtered);
    setCurrentPage(1);
  }, [searchInput, tableDatalib]);

  const handleChange = (event, page) => {
    setCurrentPage(page);
  };

  const columns = ["Drug Name", "Date Dispensed", "Pharmacy", "RX#"]; // Example column names
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((index) => (index + 1) % columns.length);
    }, 1000); // Change column every second

    return () => clearInterval(interval);
  }, [columns.length]);

  const [selectedRows, setSelectedRows] = useState(new Set()); // Use a Set to store selected row indices

  // Function to toggle selection of a specific row
  const toggleRowSelection = (index) => {
    const updatedSelection = new Set(selectedRows);
    if (updatedSelection.has(index)) {
      updatedSelection.delete(index); // Deselect if already selected
    } else {
      updatedSelection.add(index); // Select if not selected
    }
    setSelectedRows(updatedSelection);
  };

  // Function to handle header checkbox toggle (select/deselect all rows)
  const toggleSelectAll = () => {
    const allIndices = currentItems.map((row, index) => row, index);
    if (selectedRows.size === allIndices.length) {
      // If all rows are selected, deselect all
      setSelectedRows(new Set());
    } else {
      // Otherwise, select all rows
      setSelectedRows(new Set(allIndices));
    }
  };

  // Use selectedRows to determine if a row is selected
  const isRowSelected = (index) => selectedRows.has(index);

  const exportSelectedRows = async () => {
    const selectedData = tableDatalib.filter((row, index) =>
      isRowSelected(row)
    );

    if (selectedData.length === 0) {
      console.log("No rows selected for export");
      return;
    }

    try {
      const sendresp = await axios.post(`${BaseUrl}/libexport`, {
        selectedData,
        name,
      });
      // navigate(`/medilist/`,{state:{selectedData,name, PatientIdentifier,patientname : selectedData.PatientName}})
      const patientname = selectedData[0].PatientName;
      const source = location.state?.source || "patient";
      if (source === "calendar") {
        navigate(`/medilist/`, {
          state: {
            selectedData,
            name,
            PatientIdentifier,
            patientname: selectedData.PatientName,
            calenderview: true,
            source: "calendar",
          },
        });
      } else {
        navigate(`/medilist/`, {
          state: {
            selectedData,
            name,
            PatientIdentifier,
            patientname: selectedData.PatientName,
            source: "patient",
          },
        });
      }
      // Implement logic to export selectedData to medication page
      console.log("Exporting selected data:", selectedData);
    } catch (error) {
      console.error("Error exporting data:", error);
      // Handle error (e.g., show an error message to the user)
    }
  };

  // Render checkbox in table rows to allow selection
  const renderCheckbox = (row) => (
    <input
      type="checkbox"
      checked={isRowSelected(row)}
      onChange={() => toggleRowSelection(row)}
    />
  );

  // console.log(currentItems.length,'selected')

  const handlehomebtn = () => {
    navigate("/homepage", { state: { name } });
  };

  const handlebackbtn = () => {
    // navigate(`/medilist/`,{state:{name,PatientIdentifier}})
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
          PatientIdentifier,
          source: "patient",
        },
      });
    }
  };

  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortOrder("desc");
    }
  };

  const sortData = () => {
    if (!sortColumn) return filteredData;

    const sortedData = [...filteredData].sort((a, b) => {
      const valA = a[sortColumn];
      const valB = b[sortColumn];

      if (valA < valB) return sortOrder === "asc" ? -1 : 1;
      if (valA > valB) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

    return sortedData;
  };

  const arrowIcon = (column) => {
    if (sortColumn === column) {
      return sortOrder === "desc" ? (
        <span className="icon-arrow">&#8595;</span>
      ) : (
        <span className="icon-arrow">&#8593;</span>
      );
    }

    // Default to up arrow when sortColumn is not set
    // if (!sortColumn) {
    return <span className="icon-arrow">&#8593;</span>;
    // }
    // return null;
  };

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const rangeStart = indexOfFirstItem + 1;
  const rangeEnd = Math.min(indexOfLastItem, filteredData.length);
  const currentItems = sortData().slice(indexOfFirstItem, indexOfLastItem);

   const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div>
      {/* <div>
        <nav class=" navbar navbar-expand-lg  fixed-top">
          <div class="container-fluid">
           
             <h4 className="navbar-brand" style={{ color: "#fff" }}>
                Hello, {name}{" "}
                {RoleDesc &&
                RoleDesc.toLowerCase() !== "null" &&
                RoleDesc.trim() !== ""
                  ? `(${RoleDesc})`
                  : ""}
              </h4>


            <button
              class="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarSupportedContent"
              aria-controls="navbarSupportedContent"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarSupportedContent">
              <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                <h3
                  className="head"
                  style={{
                    justifyContent: "center",
                    fontWeight: "600",
                    marginLeft: "30px",
                  }}
                >
                  Liberty Medication List
                </h3>
              </ul>
            </div>
          </div>
          <div class="collapse navbar-collapse" id="navbarSupportedContent">
            <HomeIcon
              sx={{
                color: "white",
                width: "35px",
                height: "35px",
                cursor: "Pointer",
              }}
              className="home"
              onClick={handlehomebtn}
            ></HomeIcon>
            <div>
              <picture className="img-out" onClick={signout}>
                <source srcset={poweroff} type="image/svg+xml" />
                <img src={poweroff} class="img-fluid" alt="..." />
              </picture>
            </div>
          </div>
        </nav>
      </div> */}

      <div className='nav-mainlib' >
      <nav className='nav-mainlib'>
          <div className='navbar-fulllib'>
            <div className='nav-leftlib'>
            <h4 className='h5-leftlib' 
            style={{display:'flex', marginLeft:'0.5rem', textAlign:'center', padding:'0.3rem', fontFamily:'Volkhov, serif'}}>
                Hello, {name}{" "}
                {RoleDesc &&
                RoleDesc.toLowerCase() !== "null" &&
                RoleDesc.trim() !== ""
                  ? `(${RoleDesc})`
                  : ""}
              </h4>
            </div>
            
            <div className='nav-middlelib'>
              <h4 className='h4-midlib' style={{display:'flex', fontWeight:600}}>Liberty Medication List</h4>
            </div>
          
           <div className='nav-containerlib'>
              <ul className={`nav-ullib ${menuOpen ? "show":""}`}>
                
                <li className='nav-homelib'>
                  {/* <HomeIcon  sx={{color: 'white', width: { xs: '2rem', sm: '2rem', md: '2rem'}, 
    height: { xs: '2rem', sm: '2rem', md: '2rem' },cursor:'Pointer'}} onClick={handlehomebtn}></HomeIcon> */}
     <HomeIcon  sx={{color: 'white', cursor:'Pointer',width:'1.8rem',height:'1.8rem',
      '@media screen and (min-width: 1900px) and (max-width:4000px)': { width: '2.3rem', height: '2.3rem' },
      '@media screen and (min-width: 1600px) and (max-width:1890px)' : {width: '2rem', height: '2rem'},
     }} 
     onClick={handlehomebtn}></HomeIcon>
                </li>
                <li>
                  <picture className='img-outlib' onClick={signout}>
                        <source srcset={poweroff} type="image/svg+xml"/>
                        <img src={poweroff} class="img-fluid" alt="..."/>
                    </picture>
                </li>
              </ul>

            </div>

          </div>
         </nav>
      </div>

      <div className="navbtm-lib" >
        <div className="lib-pathead">
          <div style={{width:'30%'}}>
            <button onClick={() => handlebackbtn()} class="backbutton-lib">
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
          

          <div className="lib-patinfo" >
            <div className="lib-patalign" >
              <label >Patient Name&nbsp;:&nbsp;</label>
              <span style={{fontWeight:600}}>{liblistform.DisplayName}</span>
            </div>
            <div className="lib-patalign" >
              <label >Date Of Birth&nbsp;:&nbsp;</label>
              <span style={{fontWeight:600}}>{liblistform.DateOfBirth}</span>
            </div>
          </div>

          <div style={{width:'30%'}}></div>
        </div>

        {isLoading ? (
          <Loader />
        ) : (
          <>
           <div className='lib-main'>
          <div className='lib-searchbox-main'>
            <div className='lib-searchbox'>
                <input className='libsearch-input'  type="text"
                    placeholder={`Search for "${columns[index]}"`}
                    onFocus={() => setIndex(0)}
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                />
                
            </div>
            <div style={{marginTop:'5px'}}>
                  <button
                    className="export-buttonlib"
                    disabled={!permissions?.importPage?.canExport}
                    onClick={exportSelectedRows}
                  >
                    Export
                  </button>
            </div>
            
          </div>


        

<div className='tablescroll-lib'>
  <table className='lib-table'>
    <thead >
      <tr className='libtable-head'>
      <th className="checkbox-main">
                          <input className="checkbox-thlib"
                            type="checkbox"
                            checked={selectedRows.size === currentItems.length}
                            onChange={toggleSelectAll}
                          />
                        </th>
                        <th onClick={() => handleSort("Drug_name")}>
                          Drug&nbsp;Name{arrowIcon("Drug_name")}
                        </th>
                        <th>Sig</th>
                        <th>Quantity&nbsp;Dispensed</th>
                        <th onClick={() => handleSort("DateDispensedSQL")}>
                          Date&nbsp;Dispensed&nbsp;
                          {arrowIcon("DateDispensedSQL")}
                        </th>
                        <th>Prescriber</th>
                        <th onClick={() => handleSort("DateWritten")}>
                          Date&nbsp;Written&nbsp;{arrowIcon("DateWritten")}
                        </th>
                        <th>RX#</th>
                        <th>Pharmacy</th>
                        <th>Ndc&nbsp;Number</th>
      </tr>
    </thead>
    <tbody>
      {currentItems.map((row, index) => (
        <tr
                          className="libtable-row"
                          key={index}
                          id={index % 2 === 0 ? "even-rowlib" : "odd-rowlib"}
                        >
                          <td className="checkbox-thlib">{renderCheckbox(row)}</td>
                          <td>{row.Drug_name}</td>
                          <td>
                            <div
                              className={
                                row.Sigs && row.Sigs.length > 300
                                  ? "libwrap"
                                  : "libwrap1"
                              }
                            >
                              {row.Sigs}
                            </div>
                          </td>
                          <td>{row.QuantityDispensed}</td>
                          <td>{formatdate(row.DateDispensedSQL)}</td>
                          <td>{row.Prescriber}</td>
                          <td>{formatdate(row.DateWritten)}</td>
                          <td>{row["RX#"]}</td>
                          <td>{row.Pharmacy}</td>
                          <td>{row.NdcNumber}</td>
                        </tr>
      ))}
    </tbody>
  </table>
</div>



          <div className='libtable-pagin'>
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
              <span className='pagin-rightlib'>
                {rangeStart}-{rangeEnd} of {tableDatalib.length} items
              </span>
            </div>
          </div>
   

         </div>
            {/* <main className="main-lib">
              <section className="Header-lib" style={{ margin: "5px " }}>
                <div className="searchbox-lib">
                  <input
                    className="searchtext-lib"
                    type="text"
                    placeholder={`Search for "${columns[index]}"`}
                    onFocus={() => setIndex(0)}
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                  ></input>
                </div>
                <div>
                  <button
                    className="export-button"
                    disabled={!permissions?.importPage?.canExport}
                    onClick={exportSelectedRows}
                  >
                    Export
                  </button>
                </div>
              </section>
              <section>
                <div className="table-scroll-lib">
                  <table className="tablepat-lib" style={{ width: "100%" }}>
                    <thead className="theadpat-lib">
                      <tr className="tablerow-lib">
                        <th>
                          <input
                            type="checkbox"
                            checked={selectedRows.size === currentItems.length}
                            onChange={toggleSelectAll}
                          />
                        </th>
                        <th onClick={() => handleSort("Drug_name")}>
                          Drug&nbsp;Name{arrowIcon("Drug_name")}
                        </th>
                        <th>Sig</th>
                        <th>Quantity&nbsp;Dispensed</th>
                        <th onClick={() => handleSort("DateDispensedSQL")}>
                          Date&nbsp;Dispensed&nbsp;
                          {arrowIcon("DateDispensedSQL")}
                        </th>
                        <th>Prescriber</th>
                        <th onClick={() => handleSort("DateWritten")}>
                          Date&nbsp;Written&nbsp;{arrowIcon("DateWritten")}
                        </th>
                        <th>RX#</th>
                        <th>Pharmacy</th>
                        <th>Ndc Number</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentItems.map((row, index) => (
                        <tr
                          className="tablerow-lib"
                          key={index}
                          id={index % 2 === 0 ? "even-rowlib" : "odd-rowlib"}
                        >
                          <td>{renderCheckbox(row)}</td>
                          <td>{row.Drug_name}</td>
                          <td>
                            <div
                              className={
                                row.Sigs && row.Sigs.length > 300
                                  ? "libwrap"
                                  : "libwrap1"
                              }
                            >
                              {row.Sigs}
                            </div>
                          </td>
                          <td>{row.QuantityDispensed}</td>
                          <td>{formatdate(row.DateDispensedSQL)}</td>
                          <td>{row.Prescriber}</td>
                          <td>{formatdate(row.DateWritten)}</td>
                          <td>{row["RX#"]}</td>
                          <td>{row.Pharmacy}</td>
                          <td>{row.NdcNumber}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              <div className="foot-lib">
                <div className="pagin-lib">
                  <Pagination
                    page={currentPage}
                    count={totalPages}
                    onChange={handleChange}
                    showFirstButton
                    showLastButton
                  />
                </div>
                <div className="Range-lib">
                  <span>
                    {rangeStart}-{rangeEnd} of {filteredData.length} items
                  </span>
                </div>
              </div>
            </main> */}
          </>
        )}
      </div>
    </div>
  );
}

export default LibertyList;
