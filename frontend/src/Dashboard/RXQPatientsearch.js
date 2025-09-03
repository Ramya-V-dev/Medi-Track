// import React, { useState, useEffect } from "react";
// import "./RxqPatientsearch.css";
// import "react-datepicker/dist/react-datepicker.css";
// import { useLocation, useParams, useNavigate } from "react-router-dom";
// import Box from "@mui/material/Box";
// import HomeIcon from "@mui/icons-material/Home";
// import axios from "axios";

// const BaseUrl = process.env.REACT_APP_API_BASE_URL;

// const Rxqpatientsearch = (value) => {
//   const location = useLocation();
//   const name = location?.state?.name;

//   const [index, setIndex] = useState(0);
//   const itemsPerPage = 15;
//   const [searchInput, setSearchInput] = useState(
//     localStorage.getItem("searchInput") || ""
//   );
//   const [searchInput1, setSearchInput1] = useState(
//     localStorage.getItem("searchInput1") || ""
//   );
//   const [searchInput2, setSearchInput2] = useState(
//     localStorage.getItem("searchInput2") || ""
//   );
//   const [searchInput3, setSearchInput3] = useState(
//     localStorage.getItem("searchInput3") || ""
//   );
//   const [searchInput4, setSearchInput4] = useState(
//     localStorage.getItem("searchInput4") || ""
//   );
//   const [pageNo, setPageNo] = useState("");
//   const [isAllSelected, setIsAllSelected] = useState(false);
//   const nav = useNavigate();

//   const [sortColumn, setSortColumn] = useState();
//   const [sortOrder, setSortOrder] = useState();

//   const fetchinfodata = async () => {
//     try {
//       const resp = await axios.get(`${BaseUrl}/patientinfo`);
//       console.log(resp.data.data);
//     } catch (error) {
//       console.log("error occuring", error);
//     }
//   };

  

//   useEffect(() => {
//     fetchinfodata();
//   }, []);

//   const handlehomebtn = () => {
//     nav(`/homepage`, { state: { name } });
//   };

//   const arrowIcon = (column) => {
//     const isSelected = sortColumn === column;
//     let icon = "↓";

//     if (isSelected) {
//       icon = sortOrder === "asc" ? "↑" : "↓";
//     }

//     return (
//       <span
//         className={`icon-arrow ${isSelected ? "selected-icon" : ""}`}
//         style={{
//           backgroundColor: isSelected ? "#fff" : "transparent",
//           padding: "2px 4px",
//           borderRadius: "3px",
//           color: isSelected ? "#000" : "#fff",
//           marginLeft: "5px",
//           borderRadius: "50%",
//           fontSize: "15px",
//           padding: "3px 6px",
//         }}
//       >
//         {icon}
//       </span>
//     );
//   };

//   const handleSort = (column) => {
//     if (sortColumn === column) {
//       setSortOrder(sortOrder === "asc" ? "desc" : "asc");
//     } else {
//       setSortColumn(column);
//       setSortOrder("desc");
//     }
//   };

//   const handleInputChange = (value, name) => {};

//   const handleSelectChange = (value) => {
//     if (value !== "Others") {
//     } else {
//     }
//   };

//   const columns = ["Name", "ID", "Date", "Role"]; // Example column names

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setIndex((index) => (index + 1) % columns?.length);
//     }, 1000); // Change column every second

//     return () => clearInterval(interval);
//   }, [columns?.length]);

//   return (
//     <Box>
//       <nav class=" navbar navbar-expand-lg  fixed-top">
//         <div class="container-fluid">
//           <h4 class="navbar-brand" style={{ color: "#fff" }}>
//             Hello, {location?.state?.name}
//           </h4>
//           <div class="collapse navbar-collapse" id="navbarSupportedContent">
//             <ul class="navbar-nav me-auto mb-2 mb-lg-0">
//               <h3
//                 className="head"
//                 style={{
//                   justifyContent: "center",
//                   fontWeight: "600",
//                   marginLeft: "80px",
//                 }}
//               >
//                 Select Target Patient to Add Medicines
//               </h3>
//             </ul>
//           </div>
//         </div>

//         <div class="collapse navbar-collapse" id="navbarSupportedContent">
//           <HomeIcon
//             sx={{
//               color: "white",
//               width: "35px",
//               height: "35px",
//               cursor: "Pointer",
//               marginRight: "15px",
//             }}
//             className="home"
//             onClick={handlehomebtn}
//           ></HomeIcon>
//         </div>
//       </nav>
      
//         {/* <div style={{gap:'1.5rem', display:'flex', marginLeft:'33%', marginTop:'5rem'}}>
//           <span>Patient Name : <span style={{fontWeight:600}}>Jameson</span></span>
//           <span>Date Of Birth : <span style={{fontWeight:600}}>6/6/1993</span></span>
//           <span>Pharmacy : <span style={{fontWeight:600}}>MH</span></span>
//         </div> */}

       
       
//       <main className="main1-rxq" 
//       style={{ marginTop: "70px" }}
//       >
        
//         <section className="Header-med">
//           <div className="searchbox-med" style={{ marginBottom: "10px" }}>
//             <input
//               className="searchtext-med"
//               type="text"
//               placeholder={"Search Patient details"}
//               onFocus={() => setIndex(0)}
//               value={searchInput1}
//               onChange={(e) => setSearchInput1(e.target.value)}
//             ></input>
//           </div>
//           {/* <div className="searchbox-med" style={{ marginBottom: "10px" }}>
//             <input
//               className="searchtext-med"
//               type="text"
//               placeholder={"Search for SSN"}
//               onFocus={() => setIndex(0)}
//               value={searchInput2}
//               onChange={(e) => setSearchInput2(e.target.value)}
//             ></input>
//           </div>
//           <div className="searchbox-med" style={{ marginBottom: "10px" }}>
//             <input
//               className="searchtext-med"
//               type="text"
//               placeholder={"Search for DOB"}
//               onFocus={() => setIndex(0)}
//               value={searchInput3}
//               onChange={(e) => setSearchInput3(e.target.value)}
//             ></input>
//           </div>
//           <div className="searchbox-med" style={{ marginBottom: "10px" }}>
//             <input
//               className="searchtext-med"
//               type="text"
//               placeholder={"Search for Patient Name"}
//               onFocus={() => setIndex(0)}
//               value={searchInput}
//               onChange={(e) => setSearchInput(e.target.value)}
//             ></input>
//           </div> */}
//           {/* <div className="searchbox-med" style={{ marginBottom: "10px" }}>
//             <input
//               className="searchtext-med"
//               type="text"
//               placeholder={"Search for Date Dispensed"}
//               onFocus={() => setIndex(0)}
//               value={searchInput4}
//               onChange={(e) => setSearchInput4(e.target.value)}
//             ></input>
//           </div> */}
          
//                  <button
//                     className="exportrxq-button"
                    
//                   >
//                     Add&nbsp;to&nbsp;MediList
//                   </button>
         
//         </section>
//         <section>
//           <div className="table-scrollmed" id="divToPrint">
//             <table className="tablepat-med" style={{ width: "100%" }}>
//               <thead className="theadpat-med">
//                 <tr className="tablerow-med">
//                   {/* <th>
//                     <input
//                       type="checkbox"
//                       disabled={false}
//                       checked={isAllSelected}
//                     ></input>
//                   </th> */}
//                   <th>Select</th>

//                 {/* <th onClick={() => handleSort("ID")}>
//                     Drug Name{arrowIcon("Drug_name")}
//                   </th>
//                   <th>SIG</th>
//                   <th>Quantity Dispensed</th>
//                   <th onClick={() => handleSort("role")}>
//                     Date Dispensed {arrowIcon("role")}
//                   </th>
//                   <th>Prescriber</th> */}
//                   {/* <th> Pharmacy</th> */}

//                   <th onClick={() => handleSort("ID")}>
//                     Patient Name{arrowIcon("Drug_name")}
//                   </th>
                  
//                   <th onClick={() => handleSort("role")}>Date Of Birth {arrowIcon("role")}</th>
//                   <th>SSN</th>
//                   <th onClick={() => handleSort("role")}>
//                     Global ID {arrowIcon("role")}
//                   </th>
//                   {/* <th>Last Name</th>
//                   <th> Pharmacy</th> */}
//                   {/* <th>Modified Date</th> */}
//                   {/* <th className='action-med'>Action</th> */}
//                 </tr>
//               </thead>
//               <tbody>
//                 <tr style={{backgroundColor:'#a2c2cc', fontSize:'14px'}}>
//                   <td>
//                     <input type="radio"></input>
//                   </td>
//                   <td>James,John</td>
//                   <td>6/6/1993 </td>
//                   <td>12345</td>
//                   <td>123</td>
//                 </tr>
//                 <tr style={{backgroundColor:'white', fontSize:'14px'}}>
//                   <td>
//                     <input type="radio"></input>
//                   </td>
//                   <td>James,Adam</td>
//                   <td>5/5/2001</td>
//                   <td>14444</td>
//                   <td>145</td>
//                 </tr>
//                 <tr style={{backgroundColor:'#a2c2cc', fontSize:'14px'}}>
//                   <td>
//                     <input type="radio"></input>
//                   </td>
//                   <td>Jameson,Danny</td>
//                   <td>4/3/1976</td>
//                   <td>15555</td>
//                   <td></td>
//                   {/* <td>Shelly </td> */}
//                 </tr>
//               </tbody>
//             </table>
//           </div>
//         </section>

//         <div className="foot-med">
//           <div className="pagin-med">
//             {/* <Pagination 
//                page={currentPage}
//                count={totalPages}
//                onChange={handleChange} 
//                showFirstButton 
//                showLastButton /> */}
//           </div>
//           <div className="Range-med">
//             <span>items</span>
//           </div>
//         </div>
//       </main>
      
//     </Box>
//   );
// };

// export default Rxqpatientsearch;




import React, { useState, useEffect } from "react";
import "./RxqPatientsearch.css";
// import "react-datepicker/dist/react-datepicker.css";
// import { useLocation, useParams, useNavigate } from "react-router-dom";
// import Box from "@mui/material/Box";
// import HomeIcon from "@mui/icons-material/Home";
import axios from "axios";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import { format, parseISO } from "date-fns";
import { toZonedTime, fromZonedTime } from "date-fns-tz";
import moment from "moment";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import poweroff from "./img/poweroff.png";
import HomeIcon from "@mui/icons-material/Home";
import VisibilityIcon from "@mui/icons-material/Visibility";
import loading from "./img/loading.gif";
import { logout } from "../Redux/slice.js";
import { getPermissionsByRole } from "../Finallogin/GetPermission.js";

const BaseUrl = process.env.REACT_APP_API_BASE_URL;

const Rxqpatientsearch = (value) => {
  const location = useLocation();
  const name = location?.state?.name;

  const [index, setIndex] = useState(0);
  const itemsPerPage = 15;
  const [searchInput, setSearchInput] = useState(
    localStorage.getItem("searchInput") || ""
  );
  const [searchInput1, setSearchInput1] = useState(
    localStorage.getItem("searchInput1") || ""
  );
  const [searchInput2, setSearchInput2] = useState(
    localStorage.getItem("searchInput2") || ""
  );
  const [searchInput3, setSearchInput3] = useState(
    localStorage.getItem("searchInput3") || ""
  );
  const [searchInput4, setSearchInput4] = useState(
    localStorage.getItem("searchInput4") || ""
  );
  const [pageNo, setPageNo] = useState("");
  const [isAllSelected, setIsAllSelected] = useState(false);
  const nav = useNavigate();

  const [sortColumn, setSortColumn] = useState();
  const [sortOrder, setSortOrder] = useState();

  const fetchinfodata = async () => {
    try {
      const resp = await axios.get(`${BaseUrl}/patientinfo`);
      console.log(resp.data.data);
    } catch (error) {
      console.log("error occuring", error);
    }
  };

  

  useEffect(() => {
    fetchinfodata();
  }, []);

  const handlehomebtn = () => {
    nav(`/homepage`, { state: { name } });
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

  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortOrder("desc");
    }
  };

  const handleInputChange = (value, name) => {};

  const handleSelectChange = (value) => {
    if (value !== "Others") {
    } else {
    }
  };

  const columns = ["Name", "ID", "Date", "Role"]; // Example column names

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((index) => (index + 1) % columns?.length);
    }, 1000); // Change column every second

    return () => clearInterval(interval);
  }, [columns?.length]);

  return (
    <div>
      <div>
        {/* <Navbar name={name}/> */}
        <nav class=" navbar navbar-expand-lg  fixed-top">
          <div class="container-fluid">
            {/* <h4 class="navbar-brand" style={{ color: "#fff" }}>
              Hello, {name}
            </h4> */}
             <h4 className="navbar-brand" style={{ color: "#fff" }}>
                Hello, Ramya
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
                  Medication List
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
              
            ></HomeIcon>
            <div>
              <picture className="img-out" >
                <source srcset={poweroff} type="image/svg+xml" />
                <img src={poweroff} class="img-fluid" alt="..." />
              </picture>
            </div>
          </div>
        </nav>
      </div>
      <div style={{ marginTop: "65px" }}>
        <div className="head-med">
          <button  class="backbutton">
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

          <div className="four-col">
            <div className="label-div">
              <label className="col-label">Patient Name&nbsp;:</label>
              <span className="col-value"></span>
            </div>
            <div className="label-div">
              <label className="col-label">Date Of Birth&nbsp;:</label>
              <span className="col-value">
              
              </span>
            </div>
          </div>

          <div style={{ display: "flex", gap: "5px ", alignItems: "center" }}>
            <button  className="del-history">
              Deleted History
            </button>

            <div>
              <button
                className="del-history"
              >
                Import New
              </button>
            </div>

            <div>
              <button
                className="del-history"
              >
                Import ALL
              </button>
            </div>
          </div>
        </div>
        <main className="main1-med">
          <section className="Header-med">
            <div className="searchbox-med">
              <input
                className="searchtext-med"
                type="text"
                placeholder={`Search for "${columns[index]}"`}
                onFocus={() => setIndex(0)}
              
              ></input>
            </div>

            <div className="searchbox-date-med">
              <input
                className="searchtext-med"
                type="text"
                placeholder={"Search for ModifiedDate...."}
               
              ></input>
            </div>

            <div className="add-del">
              <button
                className={`review `}
               
              >
                Pack
              </button>

              <button
                className={`review `}
              
              >
                Review
              </button>

              <div style={{ marginRight: "10px" }}>
                <button
                  className="cssbuttons-io-button"
                 
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    width="24"
                    height="24"
                    fontWeight="600"
                  >
                    <path fill="none" d="M0 0h24v24H0z"></path>
                    <path
                      fill="currentColor"
                      d="M11 11V5h2v6h6v2h-6v6h-2v-6H5v-2z"
                    ></path>
                  </svg>
                  <span style={{ fontWeight: 600 }}>Add</span>
                </button>
              </div>

              <div>
                <button
                  class={`bin-button `}
                 
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 39 7"
                    class="bin-top"
                  >
                    <line
                      strokeWidth="4"
                      stroke="white"
                      y2="5"
                      x2="39"
                      y1="5"
                    ></line>
                    <line
                      strokeWidth="3"
                      stroke="white"
                      y2="1.5"
                      x2="26.0357"
                      y1="1.5"
                      x1="12"
                    ></line>
                  </svg>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 33 39"
                    class="bin-bottom"
                  >
                    <mask fill="white" id="path-1-inside-1_8_19">
                      <path d="M0 0H33V35C33 37.2091 31.2091 39 29 39H4C1.79086 39 0 37.2091 0 35V0Z"></path>
                    </mask>
                    <path
                      mask="url(#path-1-inside-1_8_19)"
                      fill="white"
                      d="M0 0H33H0ZM37 35C37 39.4183 33.4183 43 29 43H4C-0.418278 43 -4 39.4183 -4 35H4H29H37ZM4 43C-0.418278 43 -4 39.4183 -4 35V0H4V35V43ZM37 0V35C37 39.4183 33.4183 43 29 43V35V0H37Z"
                    ></path>
                    <path strokeWidth="4" stroke="white" d="M12 6L12 29"></path>
                    <path strokeWidth="4" stroke="white" d="M21 6V29"></path>
                  </svg>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 89 80"
                    class="garbage"
                  >
                    <path
                      fill="white"
                      d="M20.5 10.5L37.5 15.5L42.5 11.5L51.5 12.5L68.75 0L72 11.5L79.5 12.5H88.5L87 22L68.75 31.5L75.5066 25L86 26L87 35.5L77.5 48L70.5 49.5L80 50L77.5 71.5L63.5 58.5L53.5 68.5L65.5 70.5L45.5 73L35.5 79.5L28 67L16 63L12 51.5L0 48L16 25L22.5 17L20.5 10.5Z"
                    ></path>
                  </svg>
                </button>
              </div>
            </div>
          </section>
          <section>
            <div className="table-scrollmed" id="divToPrint">
              <table className="tablepat-med" style={{ width: "100%" }}>
                <thead className="theadpat-med">
                  <tr className="tablerow-med">
                    <th></th>
                    <th>
                      <input
                        type="checkbox"
                      
                      ></input>
                    </th>
                    <th onClick={() => handleSort("Drug_name")}>
                      Drug&nbsp;Name{arrowIcon("Drug_name")}
                    </th>
                    <th>Sig</th>
                    <th>Quantity&nbsp;Dispensed</th>
                    <th onClick={() => handleSort("DateDispensedSQL")}>
                      Date&nbsp;Dispensed {arrowIcon("DateDispensedSQL")}
                    </th>
                    <th>Prescriber</th>
                    <th>Date&nbsp;Written</th>
                    <th>RX#</th>
                    <th></th>
                    <th></th>
                    <th>Modified&nbsp;By</th>
                    <th>Modified&nbsp;Date</th>
                    <th className="action-med">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {/* {sortData().map((row, index) => ( */}
                    <tr
                      className="tablerow-med"
                     
                    >
                      <td></td>
                      <td></td>
                      <td> </td>

                      <td> </td>
                      <td> </td>
                      <td></td>

                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td className="esc-med">
                        
                          
                          <div style={{ display: "flex" }}>
                            <button
                              class="editBtn"
                            
                            >
                              <svg height="1em" viewBox="0 0 512 512">
                                <path d="M410.3 231l11.3-11.3-33.9-33.9-62.1-62.1L291.7 89.8l-11.3 11.3-22.6 22.6L58.6 322.9c-10.4 10.4-18 23.3-22.2 37.4L1 480.7c-2.5 8.4-.2 17.5 6.1 23.7s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L387.7 253.7 410.3 231zM160 399.4l-9.1 22.7c-4 3.1-8.5 5.4-13.3 6.9L59.4 452l23-78.1c1.4-4.9 3.8-9.4 6.9-13.3l22.7-9.1v32c0 8.8 7.2 16 16 16h32zM362.7 18.7L348.3 33.2 325.7 55.8 314.3 67.1l33.9 33.9 62.1 62.1 33.9 33.9 11.3-11.3 22.6-22.6 14.5-14.5c25-25 25-65.5 0-90.5L453.3 18.7c-25-25-65.5-25-90.5 0zm-47.4 168l-144 144c-6.2 6.2-16.4 6.2-22.6 0s-6.2-16.4 0-22.6l144-144c6.2-6.2 16.4-6.2 22.6 0s6.2 16.4 0 22.6z"></path>
                              </svg>
                            </button>

                            <span
                              className="viewpatient-med"
                              title="View"
                            >
                              <VisibilityIcon
                                width="30px"
                                height="30px"
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  cursor: "Pointer",
                                  marginLeft: "13px",
                                  
                                }}
                              />
                            </span>
                          </div>
                       
                      </td>
                    </tr>
                  {/* ))} */}
                </tbody>
              </table>
            </div>
          </section>

          <div className="foot-med">
            <div className="pagin-med"></div>
            <div className="Range-med">
              <span> items</span>
            </div>
          </div>
        </main>

       
      </div>
    </div>
  );
};

export default Rxqpatientsearch;
