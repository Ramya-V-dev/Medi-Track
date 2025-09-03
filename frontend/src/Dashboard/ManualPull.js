import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import "./ManualPull.css";
import axios from "axios";
import Pagination from "@mui/material/Pagination";
import "react-datepicker/dist/react-datepicker.css";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import Loader from "./Loader";
import HomeIcon from "@mui/icons-material/Home";
import poweroff from "./img/poweroff.png";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import { logout } from "../Redux/slice.js";
import { getPermissionsByRole } from "../Finallogin/GetPermission.js";

const BaseUrl = process.env.REACT_APP_API_BASE_URL;

const style1 = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  height: "200px",
  width: "500px",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  paddingTop: 2,
  paddingLeft: 4,
  paddingRight: 4,
  paddingBottom: 4,
  '@media screen and (min-width: 1900px) and (max-width:4000px)' : {
      position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  height: "240px",
  width: "550px",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  paddingTop: 2,
  paddingLeft: 4,
  paddingRight: 4,
  paddingBottom: 4,
  },
  '@media screen and (min-width: 1750px) and (max-width:1890px)' : {
     
   height: "240px",
  width: "550px",
 
  },
  '@media screen and (min-width: 1600px) and (max-width:1751px)' : {
      
  height: "240px",
  width: "550px",
  
  },

};

function ManualPull() {
  const [tableDatalib, setTableDatalib] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;
  const [searchInput, setSearchInput] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();
  const name = location.state?.name;
  const { PatientIdentifier } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [rowToAdd, setRowToAdd] = useState(null); // Store the row to add
  const { token = null, tokenname = null } = useSelector(
    (state) => state.PatientIdentifier ?? {}
  );
  const Role  = useSelector((state)=> state.PatientIdentifier.Role)
  const permissions = getPermissionsByRole(Role)
  const RoleDesc  = useSelector((state)=> state.PatientIdentifier.RoleDesc)


  const signout = () => {
    dispatch(logout());
    navigate("/");
  };

  useEffect(() => {
    const fetchdatalib = async () => {
      try {
        if (!token || !tokenname) {
          navigate("/");
          return;
        }
        const resp = await axios.get(`${BaseUrl}/manuallpull`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setTableDatalib(resp.data.data);
        setIsLoading(false);
        //  console.log('data get',resp.data.data)
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchdatalib(); // Call the fetchdata function when the component mounts
  }, [PatientIdentifier]);

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
        item.GlobalId,
        item.SSN,
        item.DisplayName,
        formatdate(item.DateOfBirth),
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

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const rangeStart = indexOfFirstItem + 1;
  const rangeEnd = Math.min(indexOfLastItem, filteredData.length);
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

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

  const handlehomebtn = () => {
    navigate(`/homepage`, { state: { name } });
  };

  const handleAddClick = (row) => {
    setRowToAdd(row); // Set the row to add
    setShowModal(true); // Open the modal
  };

  const handleConfirm = async (row) => {
    try {
      const response = await axios.post(`${BaseUrl}/pulldata`, {
        row: rowToAdd,
        name,
      });
      setShowModal(false);
      navigate("/patientdet", {
        state: { name, patientName: rowToAdd.DisplayName },
      });

      // Optionally, you can add some logic to update the UI or give feedback to the user
    } catch (error) {
      console.error("Error adding row:", error);
    }
  };

    const [menuOpen, setMenuOpen] = useState(false);
  

  return (
    <div>
      {/* <div>
        <nav class=" navbar navbar-expand-lg  fixed-top">
          <div class="container-fluid">
            
<h4 className="navbar-brand" style={{ color: '#fff' }}>
  Hello, {name} {(RoleDesc && RoleDesc.toLowerCase() !== 'null' && RoleDesc.trim() !== '') ? `(${RoleDesc})` : ''}
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
                    marginLeft: "90px",
                  }}
                >
                  Manual Pull
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
      <div className='nav-mainpull' >
      <nav className='nav-mainpull'>
          <div className='navbar-fullpull'>
            <div className='nav-leftpull'>
            <h4 className='h5-leftpull' 
            style={{fontFamily:'Volkhov, serif'}}>
                Hello, {name}{" "}
                {RoleDesc &&
                RoleDesc.toLowerCase() !== "null" &&
                RoleDesc.trim() !== ""
                  ? `(${RoleDesc})`
                  : ""}
              </h4>
            </div>
            
            <div className='nav-middlepull'>
              <h4 className='h4-midpull' style={{display:'flex', fontWeight:600}}>Manual Pull</h4>
            </div>
          
           <div className='nav-containerpull'>
              <ul className={`nav-ulpull ${menuOpen ? "show":""}`}>
                
                <li className='nav-homepull'>
                  <HomeIcon  sx={{color: 'white', cursor:'Pointer',width:'1.8rem',height:'1.8rem',
      '@media screen and (min-width: 1900px) and (max-width:4000px)': { width: '2.3rem', height: '2.3rem' },
      '@media screen and (min-width: 1600px) and (max-width:1890px)' : {width: '2rem', height: '2rem'},
     }}  onClick={handlehomebtn}></HomeIcon>
                </li>
                <li>
                  <picture className='img-outpull' onClick={signout}>
                        <source srcset={poweroff} type="image/svg+xml"/>
                        <img src={poweroff} class="img-fluid" alt="..."/>
                    </picture>
                </li>
              </ul>

            </div>

          </div>
         </nav>
      </div>


      <div style={{ marginTop: "63px" }}>
        <div
          // className="backhome"
          // style={{ alignItems: "center", margin: "6px" }}
        ></div>

        {isLoading ? (
          <Loader />
        ) : (
          <>
          <div className='pull-main'>
          <div className='pull-searchbox-main'>
            <div className='pull-searchbox'>
                <input className='pullsearch-input'  type="text"
                    placeholder={`Search for "${columns[index]}"`}
                    onFocus={() => setIndex(0)}
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                />
                
            </div>
            
          </div>


        

<div className='tablescroll-pull'>
  <table className='pull-table'>
    <thead >
      <tr className='pulltable-head'>
      <th>Globalid</th>
                        <th>SSN</th>
                        <th>PatientName</th>
                        <th>DateOfBirth</th>
                        <th>Street</th>
                        <th>City</th>
                        <th>State</th>
                        <th>zip</th>
                        <th>Phone</th>
                        <th>Phone2</th>
                        <th>MediAssist</th>
                        <th>Action</th>
      </tr>
    </thead>
    <tbody>
      {currentItems.map((row, index) => (
        <tr
                          className="pulltable-row"
                          key={index}
                          id={index % 2 === 0 ? "even-rowpull" : "odd-rowpull"}
                        >
                          <td>{row.GlobalId}</td>
                          <td>{row.SSN}</td>
                          <td>{row.DisplayName}</td>
                          <td>{formatdate(row.DateOfBirth)}</td>
                          <td>{row.street}</td>
                          <td>{row.city}</td>
                          <td>{row.state}</td>
                          <td>{row.zip}</td>
                          <td>{row.Phone}</td>
                          <td>{row.Phone2}</td>
                          <td>{row.MediAssist}</td>
                          <td className="addtd-pull">
                            <button className="addbtn-pull" disabled = {!permissions?.homePage?.Manual}
                              onClick={() => handleAddClick(row)}>Add
                              <i class="fa fa-plus"></i>
                              </button>
                           
                          </td>
                        </tr>
      ))}
    </tbody>
  </table>
</div>


         


          <div className='pulltable-pagin'>
            <div >
                <Pagination
                  page={currentPage}
                  count={totalPages}
                  onChange={handleChange} 
                  showFirstButton 
                  showLastButton
                  sx={{"& .MuiPaginationItem-previousNext": {
      fontSize: { xs: '0.6rem', sm: '0.6rem', md: '1.3rem'},
      "& svg": {
        width: { xs: '0.6rem', sm: '1rem', md: '1.3rem'},
        height: { xs: '0.6rem', sm: '1rem', md: '1.3rem'},
      },
    },
    "& .MuiPaginationItem-firstLast": {
      fontSize: { xs: '0.6rem', sm: '0.6rem', md: '1.3rem'},
      "& svg": {
        width: { xs: '0.6rem', sm: '1rem', md: '1.3rem'},
        height: { xs: '0.6rem', sm: '1rem', md: '1.3rem'},
      },
    },
    "& .MuiPaginationItem-root": {
      fontSize: { xs: '0.6rem', sm: '0.6rem', md: '1rem'},
      // padding: "0.5rem",
      minWidth: { xs: '0.6rem', sm: '0.6rem', md: '1rem'},
      minHeight: { xs: '0.6rem', sm: '0.6rem', md: '1rem'},
    },}}
                  
                  >

                </Pagination>
            </div>
            <div style={{marginRight:'15px'}}>
              <span className='pagin-right'>
                {rangeStart}-{rangeEnd} of {tableDatalib.length} items
              </span>
            </div>
          </div>
   

         </div>
            {/* <main className="main-pull">
              <section className="Header-pull" style={{ margin: "5px " }}>
                <div className="searchbox-pull">
                  <input
                    className="searchtext-pull"
                    type="text"
                    placeholder={`Search for "${columns[index]}"`}
                    onFocus={() => setIndex(0)}
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                  ></input>
                </div>
              </section>
              <section>
                <div className="table-scroll-pull">
                  <table className="tablepat-pull" style={{ width: "100%" }}>
                    <thead className="theadpat-pull">
                      <tr className="tablerow-pull">
                        <th>Globalid</th>
                        <th>SSN</th>
                        <th>PatientName</th>
                        <th>DateOfBirth</th>
                        <th>Street</th>
                        <th>City</th>
                        <th>State</th>
                        <th>zip</th>
                        <th>Phone</th>
                        <th>Phone2</th>
                        <th>MediAssist</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentItems.map((row, index) => (
                        <tr
                          className="tablerow-pull"
                          key={index}
                          id={index % 2 === 0 ? "even-rowpull" : "odd-rowpull"}
                        >
                          <td>{row.GlobalId}</td>
                          <td>{row.SSN}</td>
                          <td>{row.DisplayName}</td>
                          <td>{formatdate(row.DateOfBirth)}</td>
                          <td>{row.street}</td>
                          <td>{row.city}</td>
                          <td>{row.state}</td>
                          <td>{row.zip}</td>
                          <td>{row.Phone}</td>
                          <td>{row.Phone2}</td>
                          <td>{row.MediAssist}</td>
                          <td>
                            <button
                              type="button"
                              class="button12"
                              disabled = {!permissions?.homePage?.Manual}
                              onClick={() => handleAddClick(row)}
                            >
                              <span class="button__text">Add</span>
                              <span class="button__icon">
                                <svg
                                  xmlns="
http://www.w3.org/2000/svg"
                                  width="24"
                                  viewBox="0 0 24 24"
                                  stroke-width="2"
                                  stroke-linejoin="round"
                                  stroke-linecap="round"
                                  stroke="currentColor"
                                  height="24"
                                  fill="none"
                                  class="svg"
                                >
                                  <line y2="19" y1="5" x2="12" x1="12"></line>
                                  <line y2="12" y1="12" x2="19" x1="5"></line>
                                </svg>
                              </span>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              <div className="foot-pull">
                <div className="pagin-pull">
                  <Pagination
                    page={currentPage}
                    count={totalPages}
                    onChange={handleChange}
                    showFirstButton
                    showLastButton
                  />
                </div>
                <div className="Range-pull">
                  <span>
                    {rangeStart}-{rangeEnd} of {filteredData.length} items
                  </span>
                </div>
              </div>
            </main> */}
          </>
        )}

        <Modal
          open={showModal}
          onClose={() => setShowModal(false)}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style1}>
            <h2 className="modal-head">Confirm to Add</h2>
            <p className="modal-message">
              Do you want to add {rowToAdd?.DisplayName} to the compliance
              patients list?
            </p>
            <div className="modal-btn" style={{ marginLeft: "70%" }}>
              <button onClick={handleConfirm} className="modal-button">Yes</button>
              <button className="modal-button"
                onClick={() => setShowModal(false)}
                style={{ marginLeft: "8px" }}
              >
                No
              </button>
            </div>
          </Box>
        </Modal>
      </div>
    </div>
  );
}

export default ManualPull;
