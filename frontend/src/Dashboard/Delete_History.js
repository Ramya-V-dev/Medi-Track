import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import "./Delete_History.css";
import axios from "axios";
import Pagination from "@mui/material/Pagination";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import Loader from "./Loader";
import HomeIcon from "@mui/icons-material/Home";
import poweroff from "./img/poweroff.png";
import { logout } from "../Redux/slice.js";

const BaseUrl = process.env.REACT_APP_API_BASE_URL;

function Delete_History() {
  const [tableDatalib, setTableDatalib] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const delrow = useSelector(
    (state) => state.PatientIdentifier.selectedLibertyRow
  );
  const [delform, setDelform] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const itemsPerPage = 15;
  const [searchInput, setSearchInput] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const location = useLocation();
  const name = location.state?.name;
  // const {PatientIdentifier} = useParams();
  // const PMID = useSelector((state) => state.PatientIdentifier.PMID)
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [sortColumn, setSortColumn] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const PatientIdentifier = location.state?.PatientIdentifier || "";
  const { token = null, tokenname = null } = useSelector(
    (state) => state.PatientIdentifier ?? {}
  );

  const signout = () => {
    dispatch(logout());
    navigate("/");
  };

  const RoleDesc = useSelector((state) => state.PatientIdentifier.RoleDesc);

  useEffect(() => {
    const fetchdatalib = async () => {
      try {
        if (!token || !tokenname) {
          navigate("/");
          return;
        }
        const resp = await axios.get(
          `${BaseUrl}/medidelete/${location.state?.PatientIdentifier}`,
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

    //  }
  }, [location.state?.PatientIdentifier]);

  useEffect(() => {
    const data = delrow || JSON.parse(localStorage.getItem("data"));
    setDelform((prevFormData) => ({
      ...prevFormData,
      DisplayName: data.DisplayName,
      Globalid: data.GlobalId,
      SSN: data.SSN,
      DateOfBirth: data.DateOfBirth,
      PatientIdentifier: data.PatientIdentifier,
    }));
    // }
  }, [delrow]);

  const formatdate = (date) => {
    // return (date?.split(' ')[0])
    if (!date) return "-";

    const [year, month, day] = date.split("-");
    return `${month}/${day}/${year}`;
  };

  useEffect(() => {
    const filtered = tableDatalib.filter((item) => {
      const otherFieldsMatch = [
        item.Drug_name,
        formatdate(item.DateDispensedSQL),
        item.Pharmacy,
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

  const columns = ["Drug Name", "Date Dispensed", "Pharmacy"]; // Example column names
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((index) => (index + 1) % columns.length);
    }, 1000); // Change column every second

    return () => clearInterval(interval);
  }, [columns.length]);

  const handlehomebtn = () => {
    navigate("/patientdet", { state: { name } });
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
      const valA = a[sortColumn]?.toString().toLowerCase() || "";
      const valB = b[sortColumn]?.toString().toLowerCase() || "";

      if (valA < valB) return sortOrder === "asc" ? -1 : 1;
      if (valA > valB) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

    return sortedData;
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
          marginLeft: "5px",
          borderRadius: "50%",
          fontSize: "15px",
          padding: "3px 6px",
        }}
      >
        {icon}
      </span>
    );
  };

  const formatdatetime = (date) => {
    if (!date) return "-";

    const [datePart, timePart] = date.split(" ");

    if (!datePart) return "-";

    const [year, month, day] = datePart.split("-");

    let formattedDate = `${month}/${day}/${year}`;

    if (timePart) {
      const [hour, minute, second] = timePart.split(":");
      // If you want to include seconds, use this line instead:
      formattedDate += ` ${hour}:${minute}:${second}`;
    }

    return formattedDate;
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
                  Deleted History
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
        <div className='nav-maindel' >
            <nav className='nav-maindel'>
                <div className='navbar-fulldel'>
                  <div className='nav-leftdel'>
                  <h4 className='h5-leftdel' 
                  style={{display:'flex', marginLeft:'0.5rem', textAlign:'center', padding:'0.3rem', fontFamily:'Volkhov, serif'}}>
                      Hello, {name}{" "}
                      {RoleDesc &&
                      RoleDesc.toLowerCase() !== "null" &&
                      RoleDesc.trim() !== ""
                        ? `(${RoleDesc})`
                        : ""}
                    </h4>
                  </div>
                  
                  <div className='nav-middledel'>
                    <h4 className='h4-middel' style={{display:'flex', fontWeight:600}}>Deleted History</h4>
                  </div>
                
                 <div className='nav-containerdel'>
                    <ul className={`nav-uldel ${menuOpen ? "show":""}`}>
                      
                      <li className='nav-homedel'>
                        <HomeIcon  sx={{color: 'white', cursor:'Pointer',width:'1.8rem',height:'1.8rem',
            '@media screen and (min-width: 1900px) and (max-width:4000px)': { width: '2.3rem', height: '2.3rem' },
            '@media screen and (min-width: 1600px) and (max-width:1890px)' : {width: '2rem', height: '2rem'},
           }} onClick={handlehomebtn}></HomeIcon>
                      </li>
                      <li>
                        <picture className='img-outdel' onClick={signout}>
                              <source srcset={poweroff} type="image/svg+xml"/>
                              <img src={poweroff} class="img-fluid" alt="..."/>
                          </picture>
                      </li>
                    </ul>
      
                  </div>
      
                </div>
               </nav>
            </div>


            <div className="navbtm-deltory" >
        <div className="deltory-pathead">
          <div style={{width:'30%'}}>
            <button onClick={() => handlebackbtn()} class="backbutton-deltory">
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
          

          <div className="deltory-patinfo" >
            <div className="deltory-patalign" >
              <label >Patient Name&nbsp;:&nbsp;</label>
              <span style={{fontWeight:600}}>{delform.DisplayName}</span>
            </div>
            <div className="deltory-patalign" >
              <label >Date Of Birth&nbsp;:&nbsp;</label>
              <span style={{fontWeight:600}}>{delform.DateOfBirth}</span>
            </div>
          </div>

          <div style={{width:'30%'}}></div>
        </div>

        {isLoading ? (
          <Loader />
        ) : (
          <>
           <div className='deltory-main'>
          <div className='deltory-searchbox-main'>
            <div className='deltory-searchbox'>
                <input className='deltorysearch-input'  type="text"
                    placeholder={`Search for "${columns[index]}"`}
                    onFocus={() => setIndex(0)}
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                />
                
            </div>
          </div>


        

<div className='tablescroll-deltory'>
  <table className='deltory-table'>
    <thead >
      <tr className='deltorytable-head'>
      <th onClick={() => handleSort("Drug_name")}>
                          Drug&nbsp;Name{arrowIcon("Drug_name")}
                        </th>
                        <th>Sig</th>
                        <th>Quantity&nbsp;Dispensed</th>
                        <th onClick={() => handleSort("DateDispensedSQL")}>
                          Date&nbsp;Dispensed{arrowIcon("DateDispensedSQL")}
                        </th>
                        <th>Pharmacy</th>
                        <th>Packed</th>
                        <th>Reviewed</th>
                        <th>Modified&nbsp;Date</th>
                        <th>Modified&nbsp;By</th>
      </tr>
    </thead>
    <tbody>
      {currentItems.map((row, index) => (
        <tr
                          className="deltorytable-row"
                          key={index}
                          id={index % 2 === 0 ? "even-rowdeltory" : "odd-rowdeltory"}
                        >
                          <td>{row.Drug_name}</td>
                          <td>
                            <div
                              className={
                                row.sigs && row.sigs.length > 300
                                  ? "deltorywrap"
                                  : "deltorywrap1"
                              }
                            >
                              {row.sigs}
                            </div>
                          </td>
                          <td>{row.QuantityDispensed}</td>
                          <td>{formatdate(row.DateDispensedSQL)}</td>
                          <td>{row.Pharmacy}</td>
                          <td>{row.IsPacked}</td>
                          <td>{row.Reviewed}</td>
                          <td>{formatdatetime(row.RecordModifiedDate)}</td>
                          <td>{row.RecordModifiedBy}</td>
                        </tr>
      ))}
    </tbody>
  </table>
</div>



          <div className='deltorytable-pagin'>
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
              <span className='pagin-rightdeltory'>
                {rangeStart}-{rangeEnd} of {tableDatalib.length} items
              </span>
            </div>
          </div>
   

         </div>
          </>
        )}
      </div>

      {/* <div style={{ marginTop: "70px" }}>
        {isLoading ? (
          <Loader />
        ) : (
          <>
            <div className="backhead">
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

              <div className="four-coldel">
                <div className="label-div">
                  <label className="col-label">Patient Name&nbsp;:</label>
                  <span className="col-value">{delform.DisplayName}</span>
                </div>
                <div className="label-div">
                  <label className="col-label">Date Of Birth&nbsp;:</label>
                  <span className="col-value">
                    {formatdate(delform.DateOfBirth)}
                  </span>
                </div>
              </div>
            </div>

            <main className="main-del">
              <section className="Header-del" style={{ margin: "5px " }}>
                <div className="searchbox-del">
                  <input
                    className="searchtext-del"
                    type="text"
                    placeholder={`Search for "${columns[index]}"`}
                    onFocus={() => setIndex(0)}
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                  ></input>
                </div>
              </section>
              <section>
                <div className="table-scroll-del">
                  <table className="tablepat-del" style={{ width: "100%" }}>
                    <thead className="theadpat-del">
                      <tr className="tablerow-del">
                        <th onClick={() => handleSort("Drug_name")}>
                          Drug&nbsp;Name{arrowIcon("Drug_name")}
                        </th>
                        <th>Sig</th>
                        <th>Quantity&nbsp;Dispensed</th>
                        <th onClick={() => handleSort("DateDispensedSQL")}>
                          Date&nbsp;Dispensed{arrowIcon("DateDispensedSQL")}
                        </th>
                        <th>Pharmacy</th>
                        <th>Packed</th>
                        <th>Reviewed</th>
                        <th>Modified&nbsp;Date</th>
                        <th>Modified&nbsp;By</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentItems.map((row, index) => (
                        <tr
                          className="tablerow-del"
                          key={index}
                          id={index % 2 === 0 ? "even-rowdel" : "odd-rowdel"}
                        >
                          <td>{row.Drug_name}</td>
                          <td>
                            <div
                              className={
                                row.sigs && row.sigs.length > 300
                                  ? "medwrap"
                                  : "medwrap1"
                              }
                            >
                              {row.sigs}
                            </div>
                          </td>
                          <td>{row.QuantityDispensed}</td>
                          <td>{formatdate(row.DateDispensedSQL)}</td>
                          <td>{row.Pharmacy}</td>
                          <td>{row.IsPacked}</td>
                          <td>{row.Reviewed}</td>
                          <td>{formatdatetime(row.RecordModifiedDate)}</td>
                          <td>{row.RecordModifiedBy}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              <div className="foot-del">
                <div className="pagin-del">
                  <Pagination
                    page={currentPage}
                    count={totalPages}
                    onChange={handleChange}
                    showFirstButton
                    showLastButton
                  />
                </div>
                <div className="Range-del">
                  <span>
                    {rangeStart}-{rangeEnd} of {filteredData.length} items
                  </span>
                </div>
              </div>
            </main>
          </>
        )}
      </div> */}



    </div>
  );
}

export default Delete_History;
