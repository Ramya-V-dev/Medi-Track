import React, { useEffect, useState, useRef } from "react";
import "./UserManagement.css";
import poweroff from "../Dashboard/img/poweroff.png";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import Loader from "../Dashboard/Loader.js";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import { settoken } from "../Redux/slice";
import { Pagination, Tooltip } from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const BaseUrl = process.env.REACT_APP_API_BASE_URL;

const style1 = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  height: "300px",
  width: "450px",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  paddingTop: 2,
  paddingLeft: 4,
  paddingRight: 4,
  paddingBottom: 4,
  '@media screen and (min-width: 1900px) and (max-width:4000px)' : {
    width:'500px', height:'350px'
  }
};

const styleadd = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  height: "250px",
  width: "450px",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  paddingTop: 2,
  paddingLeft: 4,
  paddingRight: 4,
  paddingBottom: 4,
};

const stylereseted = {
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
    width:'600px', height:'260px'
  }
};

function UserManagemant() {
  const navigate = useNavigate();

  const location = useLocation();
  const dispatch = useDispatch();

  const name = location.state?.name || "";

  const handlebackbtn = () => {
    navigate("/homepage", { state: { name } });
  };

  const RoleDesc = useSelector((state) => state.PatientIdentifier.RoleDesc);
  const signout = () => {
    navigate("/");
  };

  const [isLoading, setIsLoading] = useState(true);
  const [userinfo, setUserinfo] = useState([]);
  const [filteraddeduser, setFilteraddeduser] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [showadduser, setShowadduser] = useState(false);
  const [formuser, setFormuser] = useState({
    Name: "",
    EmailID: "",
    RoleDesc: "",
  });

  const [domainPart, setDomainPart] = useState("@primaryplus.net");
  const [usernamePart, setUsernamePart] = useState("");
  const emailInputRef = useRef(null);

  const [isEditinguser, setIsEditinguser] = useState(false);
  const [editedValuesuser, setEditedValuesuser] = useState({
    pName: "",
    pLogin: "",
    Role: "",
    ActiveStatus: "",
    ModifiedUser: "",
  });
  const [editedRowIndexuser, setEditedRowIndexuser] = useState(null);
  const [currentPageUser, setCurrentPageUser] = useState(1);
  let itemsPerPageUser = 15;
  const [openModal, setOpenModal] = useState(false);
  const [modalData, setModalData] = useState({ pLogin: "", pPassword: "" });
  const [openModaldel, setOpenModaldel] = useState(false);
  const [openModaldelok, setOpenModaldelok] = useState(false);
  const [modalDatadel, setModalDatadel] = useState({ pLogin: "" });
  const [delcount, setDelcount] = useState(0);
  const [openresetModal, setOpenresetModal] = useState(false);
  const [openresetedModal, setOpenresetedModal] = useState(false);
  const [modalDatareset, setModalDatareset] = useState({
    pName: "",
    pLogin: "",
    Role: "",
    ModifiedUser: "",
    ActiveStatus: "",
  });
  const [resetcount, setresetcount] = useState(0);
  const [rolefilter, setRoleFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("Active");
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedPassword, setCopiedPassword] = useState(false);
  const [copiedreset, setCopiedreset] = useState(false);

  const { token = null, tokenname = null } = useSelector(
    (state) => state.PatientIdentifier ?? {}
  );

  const handleCopy = async (text, setter) => {
    if (
      typeof navigator !== "undefined" &&
      navigator.clipboard &&
      navigator.clipboard.writeText
    ) {
      navigator.clipboard
        .writeText("DefaultPwd@123")
        .then(() => toast.success("User details copied to clipboard!"))
        .catch(() => toast.error("Failed to copy details. Please try again."));
    } else {
      const tempElement = document.createElement("div");
      tempElement.innerText = "DefaultPwd@123";
      tempElement.style.position = "absolute";
      tempElement.style.left = "-9999px"; // Hide the element
      document.body.appendChild(tempElement);

      const range = document.createRange();
      range.selectNodeContents(tempElement);

      const selection = window.getSelection();
      selection.removeAllRanges(); // Clear previous selections
      selection.addRange(range);

      document.execCommand("copy"); // Deprecated but still widely supported
      document.body.removeChild(tempElement);

      toast.success("User details copied to clipboard!");
    }
  };

  const fetchadduser = async () => {
    try {
      if (!token || !tokenname) {
        navigate("/");
        return;
      }
      const resp = await axios.get(`${BaseUrl}/adduser`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUserinfo(resp.data.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchadduser();
  }, []);

  useEffect(() => {
    const filteredaddeduser = userinfo.filter((item) => {
      const otherFieldsMatch = [item.Name, item.EmailID].some(
        (term) =>
          term &&
          term
            .toString()
            .toLowerCase()
            .includes(searchInput.toLocaleLowerCase())
      );

      const rolefilteroption =
        rolefilter === "ALL" || item.RoleDesc === rolefilter;
      const statusfilteroption =
        statusFilter === "ALL" || item.Status === statusFilter;

      return otherFieldsMatch && rolefilteroption && statusfilteroption;
    });

    setFilteraddeduser(filteredaddeduser);
  }, [userinfo, searchInput, rolefilter, statusFilter]);

  const handlerolefilter = (value) => {
    setRoleFilter(value === "ALL" ? "ALL" : value);
    setCurrentPageUser(1);
  };

  const handlestatusfilter = (value) => {
    setStatusFilter(value === "ALL" ? "ALL" : value);
    setCurrentPageUser(1);
  };

  const columns = ["Name", "Email ID"]; // Example column names
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((index) => (index + 1) % columns.length);
    }, 1000); // Change column every second

    return () => clearInterval(interval);
  }, [columns.length]);

  const handleSearchchange = (column, value) => {
    setSearchInput((prev) => ({
      ...prev,
      [column]: value,
    }));
  };

  const handleaddchange = (e) => {
    const { name, value } = e.target;
    if (name !== "EmailID") {
      setFormuser({
        ...formuser,
        [name]: value,
      });
    }
    if (errors[name]) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: "",
      }));
    }
  };

  const handleEmailChange = (e) => {
    const input = e.target.value;

    // If user tries to delete the domain part, prevent it
    if (!input.includes("@")) {
      setUsernamePart(input);
      setFormuser({
        ...formuser,
        EmailID: input + domainPart,
      });
    } else {
      // If they're trying to input their own domain, extract just the username part
      const usernameOnly = input.split("@")[0];
      setUsernamePart(usernameOnly);
      setFormuser({
        ...formuser,
        EmailID: usernameOnly + domainPart,
      });
    }
    if (errors[name]) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: "",
      }));
    }
  };

  const isValidEmail = (email) => {
    // Email validation regex pattern
    // const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const emailPattern = /^[^\s@]+@primaryplus\.net$/;

    return emailPattern.test(email);
  };

  const [errors, setErrors] = useState({});

  const handleSubmit = async (event) => {
    event.preventDefault();
    const errors = {};
    // Perform validation

    if (!isValidEmail(formuser.EmailID)) {
      errors.EmailID = "Please enter a valid email address.";
    }

    if (Object.keys(errors).length > 0) {
      setErrors(errors);
      return;
    }

    // if (Object.keys(errors).length===0) {
    try {
      const response = await axios.post(`${BaseUrl}/adduserinfo`, {
        pName: formuser.Name,
        pLogin: formuser.EmailID,
        Role: formuser.RoleDesc,
        ModifiedUser: name,
      });

      const responseData = response.data.data;

      console.log("UserAdded", response.data.data);
      // const token = response.data.token
      // dispatch(settoken({token, tokenname : response.data.name, Role: response.data.Role}));
      setModalData({
        pLogin: formuser.EmailID,
        pPassword: responseData.defaultPassword || "DefaultPwd@123", // Fallback to known default
      });

      // Open the success modal
      setOpenModal(true);

      setFormuser({ Name: "", EmailID: "", RoleDesc: "" });
      setUsernamePart("");
      fetchadduser();
      setShowadduser(false);
    } catch (error) {
      // console.error('Login failed:', error.response.data.message);

      if (error.response && error.response.status === 400) {
        // If the email already exists, show an error message
        setErrors({
          EmailID: error.response.data.message || "Email already exists.",
        });
      } else {
        console.error("Error adding user:", error);
      }
    }
  };

  const focusEmailInput = () => {
    if (emailInputRef.current) {
      const input = emailInputRef.current;
      const valueLength = usernamePart.length;

      // Set selection range at the end of the username part
      setTimeout(() => {
        input.setSelectionRange(valueLength, valueLength);
      }, 0);
    }
  };

  const handleaddCancel = () => {
    setShowadduser(false);
    setFormuser({});
    setUsernamePart("");
  };

  const totalPagesuser = Math.ceil(filteraddeduser.length / itemsPerPageUser);
  const indexOfLastItemuser = currentPageUser * itemsPerPageUser;
  const indexOfFirstItemuser = indexOfLastItemuser - itemsPerPageUser;
  const rangeStartuser = indexOfFirstItemuser + 1;
  const rangeEnduser = Math.min(indexOfLastItemuser, filteraddeduser.length);
  const currentItemsuser = filteraddeduser.slice(
    indexOfFirstItemuser,
    indexOfLastItemuser
  );

  const handleChangepage = (event, page) => {
    setCurrentPageUser(page);
  };

  const handleuserEdit = (index) => {
    setIsEditinguser(true);
    // setEditedValuesuser({...filteraddeduser[index]})
    setEditedRowIndexuser(index);

    const user = currentItemsuser[index];
    setEditedValuesuser({
      pName: user.Name, // Assuming EmailID is the login ID
      pLogin: user.EmailID,
      Role: user.RoleDesc,
      ActiveStatus: user.Status,
      ModifiedUser: name, // Replace with logged-in user's name
    });
  };

  const handleInputChange = (e, field) => {
    setEditedValuesuser({ ...editedValuesuser, [field]: e.target.value });
  };

  const handleCancel = () => {
    setIsEditinguser(false);
    setEditedRowIndexuser(null);
    setEditedValuesuser({
      pName: "",
      pLogin: "",
      Role: "",
      ActiveStatus: "",
      ModifiedUser: "",
    });
  };

  const handleUserDetailsCopy = () => {
    const email = document.getElementById("user-email")?.innerText;
    const password = document.getElementById("user-password")?.innerText;
    const copyText = `Email ID: ${email}\nDefault Password: ${password}`;

    // Clipboard API Check
    if (
      typeof navigator !== "undefined" &&
      navigator.clipboard &&
      navigator.clipboard.writeText
    ) {
      navigator.clipboard
        .writeText(copyText)
        .then(() => {
          setCopiedEmail(true);
          toast.success("User details copied to clipboard!");
        })
        .catch(() => toast.error("Failed to copy details. Please try again."));
    } else {
      const tempElement = document.createElement("div");
      tempElement.innerText = copyText;
      tempElement.style.position = "absolute";
      tempElement.style.left = "-9999px"; // Hide the element
      document.body.appendChild(tempElement);

      const range = document.createRange();
      range.selectNodeContents(tempElement);

      const selection = window.getSelection();
      selection.removeAllRanges(); // Clear previous selections
      selection.addRange(range);

      document.execCommand("copy"); // Deprecated but still widely supported
      document.body.removeChild(tempElement);

      toast.success("User details copied to clipboard!");
    }
  };

  const handleSave = async () => {
    try {
      const response = await axios.put(
        `${BaseUrl}/modifyuser`,
        editedValuesuser
      );
      // alert(response.data.ResponseMessage); // Show response message
      console.log(response.data.data);
      setIsEditinguser(false);
      setEditedRowIndexuser(null);
      fetchadduser(); // Refresh user list
    } catch (error) {
      console.error("Error updating user:", error);
      alert("Failed to update user");
    }
  };

  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  const handleCheckboxChange = (index, ID) => {
    const newSelectedUsers = [...selectedUsers];

    if (newSelectedUsers.some((user) => user.ID === ID)) {
      // Remove if already selected
      setSelectedUsers(newSelectedUsers.filter((user) => user.ID !== ID));
    } else {
      // Add if not selected
      const userToAdd = currentItemsuser[index];
      setSelectedUsers([
        ...newSelectedUsers,
        {
          ID: userToAdd.ID,
          Name: userToAdd.Name,
          EmailID: userToAdd.EmailID,
          Role: userToAdd.RoleDesc,
          User: name,
          ActiveStatus: userToAdd.Status,
        },
      ]);
    }
  };

  // Handle select all checkbox
  const handleSelectAll = () => {
    if (selectAll) {
      // Unselect all
      setSelectedUsers([]);
    } else {
      // Select all currently visible users
      const allVisibleUsers = currentItemsuser.map((user) => ({
        ID: user.ID,
        Name: user.Name,
        EmailID: user.EmailID,
        Role: user.RoleDesc,
        User: name,
        ActiveStatus: user.Status,
      }));
      setSelectedUsers(allVisibleUsers);
    }
    setSelectAll(!selectAll);
  };

  const openDeleteConfirmation = () => {
    if (selectedUsers.length === 0) {
      alert("Please select at least one user to delete");
      return;
    }
    setOpenModaldel(true);
  };

  // console.log(selectedUsers[0].ID,'select')

  const handledelete = async () => {
    if (selectedUsers.length === 0) {
      alert("Please select at least one user to delete");
      return;
    }
    try {
      // const resp = await axios.delete(`${BaseUrl}/adduserdel`)
      let totaldelcount = 0;
      const validUsers = selectedUsers.filter((user) => user && user.ID);
      const emailsToDelete = validUsers.map((user) => user.ID);
      for (const user of validUsers) {
        const response = await axios.delete(`${BaseUrl}/adduserdel`, {
          data: { ID: user.ID, User: name },
        });
        totaldelcount += response.data.delcount || 0;
      }
      setDelcount(totaldelcount);

      setModalDatadel(emailsToDelete);
      setOpenModaldel(false);
      setOpenModaldelok(true);

      fetchadduser();
      setSelectedUsers([]);
      setSelectAll(false);
    } catch (error) {
      console.log("updating error occuring");
    }
  };

  const isUserSelected = (ID) => {
    return selectedUsers.some((user) => user.ID === ID);
  };

  const openresetConfirmation = () => {
    if (selectedUsers.length === 0) {
      alert("Please select at least one user to ResetPWD");
      return;
    }
    setOpenresetModal(true);
  };

  const handleresetpwd = async () => {
    if (selectedUsers.length === 0) {
      alert("Please select at least one user to ResetPWD");
      return;
    }
    try {
      // const resp = await axios.delete(`${BaseUrl}/adduserdel`)
      let totalResetCount = 0;
      let defaultPasswordget = "";
      for (const user of selectedUsers) {
        const UserData = {
          pName: user.Name,
          pLogin: user.EmailID,
          Role: user.Role,
          ModifiedUser: user.User,
          ActiveStatus: user.ActiveStatus,
        };
        const response = await axios.put(`${BaseUrl}/resetpwd`, UserData);
        totalResetCount += response.data.resetcount || 0;
        defaultPasswordget = response.data.defaultPassword;
        console.log(response.data.data, "reset");
      }
      setresetcount(totalResetCount);
      setModalDatareset(defaultPasswordget);

      // setModalDatareset(emailsToDelete)
      setOpenresetModal(false);
      setOpenresetedModal(true);

      fetchadduser();
      setSelectedUsers([]);
      setSelectAll(false);
    } catch (error) {
      console.log("updating error occuring");
    }
  };

  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div>
      {/* <div>
        <ToastContainer />
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
              <h3 className="head-addnav">User Management</h3>

            </div>
          </div>
          <div class="collapse navbar-collapse" id="navbarSupportedContent">
            <div>
              <picture className="img-out" onClick={signout}>
                <source srcset={poweroff} type="image/svg+xml" />
                <img src={poweroff} class="img-fluid" alt="..." />
              </picture>
            </div>
          </div>
        </nav>
      </div> */}

       <div className='nav-mainuser' >
            <nav className='nav-mainuser'>
                <div className='navbar-fulluser'>
                  <div className='nav-leftuser'>
                  <h4 className='h5-leftuser' 
                  style={{display:'flex', marginLeft:'0.5rem', textAlign:'center', padding:'0.3rem', fontFamily:'Volkhov, serif'}}>
                      Hello, {name}{" "}
                      {RoleDesc &&
                      RoleDesc.toLowerCase() !== "null" &&
                      RoleDesc.trim() !== ""
                        ? `(${RoleDesc})`
                        : ""}
                    </h4>
                  </div>
                  
                  <div className='nav-middleuser'>
                    <h4 className='h4-miduser' style={{display:'flex', fontWeight:600}}>User Management</h4>
                  </div>
                
                 <div className='nav-containeruser'>
                    <ul className={`nav-uluser ${menuOpen ? "show":""}`}>
                     
                      <li>
                        <picture className='img-outuser' onClick={signout}>
                              <source srcset={poweroff} type="image/svg+xml"/>
                              <img src={poweroff} class="img-fluid" alt="..."/>
                          </picture>
                      </li>
                    </ul>
      
                  </div>
      
                </div>
               </nav>
            </div>
   
           <div className="navbtm-user" >
        <div className="user-pathead">
          <div style={{width:'30%'}}>
            <button onClick={() => handlebackbtn()} class="backbutton-user">
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

          
          

        </div>

        
       
           <div className='user-main'>
            <div className='user-searchbox-main'>
            <div className='user-searchbox'>
                <input className='usersearch-input'  type="text"
                    placeholder={`Search for "${columns[index]}"`}
                    onFocus={() => setIndex(0)}
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                />
                
            </div>
            
          <div style={{marginTop:'8px',marginRight:'1rem',display:'flex',gap:'10px'}}>
            <button className="usertable-addbtn" onClick={() => setShowadduser(true)} >
                    <i class="fa fa-plus"></i>Add user</button>
                     <button className="usertable-addbtn" onClick={openresetConfirmation} >Reset Password</button>
                
              <button className={`usertable-delbtn `} 
                 onClick={openDeleteConfirmation}
                disabled={selectedUsers.length === 0} >
                    <i class="bi bi-trash"></i></button>
          </div>
            
          </div>

<div className='tablescroll-user'>
  <table className='user-table'>
    <thead >
      <tr className='usertable-head'>
                           <th>
                      <input className="checkbox-thuser"
                        type="checkbox"
                        checked={selectAll}
                        onChange={handleSelectAll}
                      ></input>
                    </th>
                    <th>Name</th>
                    <th>Email ID</th>
                    <th>
                      <div className="dropdown-adduser">
                        Role:
                        <button
                          className="btn1user btn1user-secondary"
                          type="button"
                          id="mediAssistDropdown"
                          data-bs-toggle="dropdown"
                          aria-expanded="false"
                        >
                          {rolefilter}
                        </button>
                        <ul
                          className="dropdown-menu"
                          aria-labelledby="mediAssistDropdown"
                        >
                          <li>
                            <button
                              className="dropdown-item"
                              type="button"
                              onClick={() => handlerolefilter("ALL")}
                            >
                              ALL
                            </button>
                          </li>

                          <li>
                            <button
                              className="dropdown-item"
                              type="button"
                              onClick={() => handlerolefilter("ADMIN")}
                            >
                              ADMIN
                            </button>
                          </li>
                          <li>
                            <button
                              className="dropdown-item"
                              type="button"
                              onClick={() => handlerolefilter("Pharmacist")}
                            >
                              Pharmacist
                            </button>
                          </li>
                          <li>
                            <button
                              className="dropdown-item"
                              type="button"
                              onClick={() =>
                                handlerolefilter("Pack Pharmacist")
                              }
                            >
                              Pack Pharmacist
                            </button>
                          </li>
                          <li>
                            <button
                              className="dropdown-item"
                              type="button"
                              onClick={() => handlerolefilter("Provider")}
                            >
                              Provider
                            </button>
                          </li>
                          <li>
                            <button
                              className="dropdown-item"
                              type="button"
                              onClick={() => handlerolefilter("Technician")}
                            >
                              Technician
                            </button>
                          </li>
                         
                        </ul>
                      </div>
                    </th>
                    <th>
                      <div className="dropdown-adduser">
                        Status:
                        <button
                          className="btn1user btn1user-secondary"
                          type="button"
                          id="mediAssistDropdown"
                          data-bs-toggle="dropdown"
                          aria-expanded="false"
                        >
                          {statusFilter}
                        </button>
                        <ul
                          className="dropdown-menu"
                          aria-labelledby="mediAssistDropdown"
                        >
                          <li>
                            <button
                              className="dropdown-item"
                              type="button"
                              onClick={() => handlestatusfilter("ALL")}
                            >
                              ALL
                            </button>
                          </li>

                          <li>
                            <button
                              className="dropdown-item"
                              type="button"
                              onClick={() => handlestatusfilter("Active")}
                            >
                              Active
                            </button>
                          </li>
                          <li>
                            <button
                              className="dropdown-item"
                              type="button"
                              onClick={() => handlestatusfilter("Inactive")}
                            >
                              Inactive
                            </button>
                          </li>
                        </ul>
                      </div>
                    </th>
                    <th>ModifiedBy</th>
                    <th>ModifiedDate</th>
                    <th>Action</th>
      </tr>
    </thead>
    <tbody>
      {currentItemsuser.map((row, index) => (
        <tr 
          key={index} 
          id={index % 2 === 0 ? 'even-rowuser' : 'odd-rowuser'} 
          className='usertable-row'
        >
           <td>
                        <input className="checkbox-thuser"
                          type="checkbox"
                          checked={isUserSelected(row.ID)}
                          onChange={() => handleCheckboxChange(index, row.ID)}
                        ></input>
                      </td>
                      <td>
                        {" "}
                        {isEditinguser && editedRowIndexuser === index ? (
                          <input
                            value={editedValuesuser.pName}
                            onChange={(e) => handleInputChange(e, "pName")}
                          />
                        ) : (
                          <>{row.Name}</>
                        )}
                      </td>
                      <td>{row.EmailID}</td>

                      <td>
                        {isEditinguser && editedRowIndexuser === index ? (
                          <select
                            value={editedValuesuser.Role}
                            onChange={(e) => handleInputChange(e, "Role")}
                          >
                            <option value="ADMIN">ADMIN</option>
                            <option value="Pharmacist">Pharmacist</option>
                            <option value="Technician">Technician</option>
                            <option value="Pack Pharmacist">
                              Pack Pharmacist
                            </option>

                            <option value="Provider">Provider</option>
                          </select>
                        ) : (
                          row.RoleDesc
                        )}
                      </td>

                      <td>
                        {isEditinguser && editedRowIndexuser === index ? (
                          <select
                            value={editedValuesuser.ActiveStatus}
                            onChange={(e) =>
                              handleInputChange(e, "ActiveStatus")
                            }
                          >
                            <option value="active">Active</option>
                            <option value="Inactive">Inactive</option>
                          </select>
                        ) : (
                          row.Status
                        )}
                      </td>
                      <td>{row.RecordModifiedBy}</td>

                      <td>{row.RecordModifiedDate}</td>

                      <td>
                        {isEditinguser && editedRowIndexuser === index ? (
                          <>
                            <button onClick={() => handleSave(index)}>
                              Save
                            </button>
                            <button onClick={handleCancel}>X</button>
                          </>
                        ) : (
                          <div style={{ marginLeft: "40%" }}>
                            <button
                              class="editBtn-adduser"
                              onClick={() => handleuserEdit(index)}
                              title="Edit"
                            >
                              <svg height="1em" viewBox="0 0 512 512">
                                <path d="M410.3 231l11.3-11.3-33.9-33.9-62.1-62.1L291.7 89.8l-11.3 11.3-22.6 22.6L58.6 322.9c-10.4 10.4-18 23.3-22.2 37.4L1 480.7c-2.5 8.4-.2 17.5 6.1 23.7s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L387.7 253.7 410.3 231zM160 399.4l-9.1 22.7c-4 3.1-8.5 5.4-13.3 6.9L59.4 452l23-78.1c1.4-4.9 3.8-9.4 6.9-13.3l22.7-9.1v32c0 8.8 7.2 16 16 16h32zM362.7 18.7L348.3 33.2 325.7 55.8 314.3 67.1l33.9 33.9 62.1 62.1 33.9 33.9 11.3-11.3 22.6-22.6 14.5-14.5c25-25 25-65.5 0-90.5L453.3 18.7c-25-25-65.5-25-90.5 0zm-47.4 168l-144 144c-6.2 6.2-16.4 6.2-22.6 0s-6.2-16.4 0-22.6l144-144c6.2-6.2 16.4-6.2 22.6 0s6.2 16.4 0 22.6z"></path>
                              </svg>
                            </button>
                          </div>
                        )}
                      </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>

         <Modal
            open={showadduser}
            onClose={() => setShowadduser(false)}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={style1}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <h3 style={{ marginLeft: "30%" }}>Create User</h3>
                <button onClick={handleaddCancel} className="x-adduser">
                  X
                </button>
              </div>

              <form onSubmit={handleSubmit}>
                <div style={{ marginLeft: "1%", marginTop: "12px" }}>
                  <span className="span-addusername">
                    <label className="label-adduser">Name:</label>
                    <input
                      type="text"
                      name="Name"
                      value={formuser.Name}
                      onChange={handleaddchange}
                      className="inputbox"
                      required
                    ></input>
                  </span>
                  {errors.EmailID && (
                    <div className="error-adduser">{errors.EmailID}</div>
                  )}
                  <span className="span-adduser">
                    <label className="label-adduser1" htmlFor="EmailID">
                      Email ID:
                    </label>
                    <div className="email-input-container">
                      <input
                        type="text"
                        name="EmailID"
                        id="EmailID"
                        ref={emailInputRef}
                        value={usernamePart}
                        onChange={handleEmailChange}
                        onFocus={focusEmailInput}
                        className={errors.EmailID ? "error" : ""}
                        required
                      ></input>
                      <span className="email-domain">{domainPart}</span>
                    </div>
                  </span>

                  <span className="span-adduser">
                    <label className="label-adduser">Role:</label>
                    <select
                      name="RoleDesc"
                      value={formuser.RoleDesc}
                      onChange={handleaddchange}
                      required
                    >
                      <option value="">Select</option>
                      <option value="ADMIN">ADMIN</option>
                      <option value="Pharmacist">Pharmacist</option>
                      <option value="Technician">Technician</option>
                      <option value="Pack Pharmacist">Pack Pharmacist</option>
                      <option value="Provider">Provider</option>
                    </select>
                  </span>
                </div>

                <div>
                  <button type="submit" className="sbmt-adduser">
                    Submit
                  </button>
                </div>
              </form>
            </Box>
          </Modal>

          <Modal
            open={openModal}
            onClose={() => setOpenModal(false)}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={styleadd}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <h3 style={{ marginLeft: "8%" }}>User Successfully added</h3>
              </div>

              <div style={{ marginTop: "6%" }}>
                <div className="userEmail-confirmed">
                  <strong>Email ID:</strong>
                  <span id="user-email">{modalData.pLogin}</span>
                </div>
              </div>
              <div style={{ marginTop: "6%" }}>
                <div  className="userpwd-confirmed">
                  <span>
                    <strong>Default Password:</strong>
                    <span id="user-password">{modalData.pPassword}</span>
                  </span>
                </div>
              </div>
              <div
                style={{
                  marginTop: "6%",
                  marginLeft: "40%",
                  height: "100%",
                  display: "flex",
                  gap: "15px",
                }}
              >
                <button
                  onClick={() => setOpenModal(false)}
                  className="addpopup"
                >
                  OK
                </button>

                <div className="copy-btn-container">
                  <Tooltip title="copy" arrow>
                    <ContentCopyIcon
                      className="copy-btnadd"
                      onClick={handleUserDetailsCopy}
                    ></ContentCopyIcon>
                  </Tooltip>
                </div>
              </div>
            </Box>
          </Modal>

          <Modal
            open={openModaldel}
            onClose={() => setOpenModaldel(false)}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={styleadd}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <h3 style={{ marginLeft: "20%" }}>Confirm Delete</h3>
              </div>

              <div  style={{ marginTop: "6%" }}>
                <div className="userdel-confirm">
                  Are you Sure want to delete {selectedUsers.length} items?
                </div>
              </div>

              <div
                style={{
                  marginTop: "10%",
                  marginLeft: "55%",
                  height: "100%",
                  display: "flex",
                  gap: "10px",
                }}
              >
                <button onClick={handledelete} className="delpopup">
                  Yes
                </button>
                <div>
                  <button
                    onClick={() => setOpenModaldel(false)}
                    className="xpopup"
                  >
                    NO
                  </button>
                </div>
              </div>
            </Box>
          </Modal>

          <Modal
            open={openModaldelok}
            onClose={() => setOpenModaldelok(false)}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={styleadd}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <h3 style={{ marginLeft: "8%" }}>User Successfully Deleted</h3>
              </div>

              <div  className="userdel-confirmed" style={{ marginTop: "6%" }}>
                <div>{delcount} item(s) is deleted</div>
              </div>

              <div
                style={{ marginTop: "6%", marginLeft: "40%", height: "100%" }}
              >
                <button
                  onClick={() => setOpenModaldelok(false)}
                  className="addpopup"
                >
                  OK
                </button>
              </div>
            </Box>
          </Modal>


          <Modal
            open={openresetModal}
            onClose={() => setOpenresetModal(false)}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={styleadd}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <h3 style={{ marginLeft: "9%" }}>Confirm Password Reset</h3>
              </div>

              <div style={{ marginTop: "6%" }}>
                <div className="user-resetpwd-content">
                  Are you sure you want to reset the password for{" "}
                  {selectedUsers.length} user(s) ?
                </div>
              </div>

              <div
                style={{
                  marginTop: "10%",
                  marginLeft: "60%",
                  height: "100%",
                  display: "flex",
                  gap: "10px",
                }}
              >
                <button onClick={handleresetpwd} className="resetpopup">
                  Yes
                </button>
                <div>
                  <button
                    onClick={() => setOpenresetModal(false)}
                    className="resetx"
                  >
                    NO
                  </button>
                </div>

              </div>
            </Box>
          </Modal>

          <Modal
            open={openresetedModal}
            onClose={() => setOpenresetedModal(false)}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={stylereseted}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <h3 style={{ marginLeft: "3%" }}>
                  Password Successfully Reset
                </h3>
              </div>

              <div className="user-confirmed-reset" style={{ marginTop: "4%" }}>
                User’s password has been reset to{" "}
                <strong>{modalDatareset}</strong>
                <Tooltip title={copiedreset ? "Copied" : "Copy"} arrow>
                  <ContentCopyIcon
                    className="copy-btn"
                    onClick={() => handleCopy(modalDatareset, setCopiedreset)}
                  ></ContentCopyIcon>
                </Tooltip>
              </div>

              <div
                style={{ marginTop: "6%", marginLeft: "40%", height: "100%" }}
              >
                <button
                  onClick={() => setOpenresetedModal(false)}
                  className="addpopup"
                >
                  OK
                </button>
              </div>
            </Box>
          </Modal>

          <div className='usertable-pagin'>
            <div >
                <Pagination
                  page={currentPageUser}
                  count={totalPagesuser}
                  onChange={handleChangepage} 
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
              <span className='pagin-rightuser'>
                {rangeStartuser}-{rangeEnduser} of {filteraddeduser.length}{" "} items
              </span>
            </div>
          </div>
   

         </div>
         
       
      </div>


      {/* <div style={{ marginTop: "70px" }}>
        <div style={{ display: "flex", marginTop: "3px" }}>
          <button onClick={handlebackbtn} class="backbutton">
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

        <main className="main1-adduser">
          <section className="Header-adduser">
            <div className="searchbox-adduser" style={{ marginBottom: "10px" }}>
              <input
                className="searchtext-adduser"
                type="text"
                placeholder={`Search for "${columns[index]}"`}
                onFocus={() => setIndex(0)}
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              ></input>
            </div>
            <div style={{ display: "flex", gap: "10px" }}>
              <button
                className="cssbuttons-io-button-adduser"
                onClick={() => setShowadduser(true)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width="22"
                  height="22"
                  fontWeight="600"
                >
                  <path fill="none" d="M0 0h24v24H0z"></path>
                  <path
                    fill="currentColor"
                    d="M11 11V5h2v6h6v2h-6v6h-2v-6H5v-2z"
                  ></path>
                </svg>

                <span style={{ fontWeight: 600 }}>Add User</span>
              </button>

              <button
                className="cssbuttons-io-button-adduser"
                onClick={openresetConfirmation}
              >

                <span style={{ fontWeight: 600 }}>Reset Password</span>
              </button>

              <button
                class={`bin-button-adduser`}
                onClick={openDeleteConfirmation}
                disabled={selectedUsers.length === 0}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 39 7"
                  class="bin-top-adduser"
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
                  class="bin-bottom-adduser"
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
                  class="garbage-adduser"
                >
                  <path
                    fill="white"
                    d="M20.5 10.5L37.5 15.5L42.5 11.5L51.5 12.5L68.75 0L72 11.5L79.5 12.5H88.5L87 22L68.75 31.5L75.5066 25L86 26L87 35.5L77.5 48L70.5 49.5L80 50L77.5 71.5L63.5 58.5L53.5 68.5L65.5 70.5L45.5 73L35.5 79.5L28 67L16 63L12 51.5L0 48L16 25L22.5 17L20.5 10.5Z"
                  ></path>
                </svg>
              </button>
            </div>
          </section>

          <section>
            <div className="table-scroll-adduser">
              <table className="tablepat-adduser" style={{ width: "100%" }}>
                <thead className="theadpat-adduser">
                  <tr className="tablerow-adduser">
                    <th>
                      <input
                        type="checkbox"
                        checked={selectAll}
                        onChange={handleSelectAll}
                      ></input>
                    </th>
                    <th>Name</th>
                    <th>Email ID</th>
                    <th>
                      <div className="dropdown-adduser">
                        Role:
                        <button
                          className="btn1 btn1-secondary"
                          type="button"
                          id="mediAssistDropdown"
                          data-bs-toggle="dropdown"
                          aria-expanded="false"
                        >
                          {rolefilter}
                        </button>
                        <ul
                          className="dropdown-menu"
                          aria-labelledby="mediAssistDropdown"
                        >
                          <li>
                            <button
                              className="dropdown-item"
                              type="button"
                              onClick={() => handlerolefilter("ALL")}
                            >
                              ALL
                            </button>
                          </li>

                          <li>
                            <button
                              className="dropdown-item"
                              type="button"
                              onClick={() => handlerolefilter("ADMIN")}
                            >
                              ADMIN
                            </button>
                          </li>
                          <li>
                            <button
                              className="dropdown-item"
                              type="button"
                              onClick={() => handlerolefilter("Pharmacist")}
                            >
                              Pharmacist
                            </button>
                          </li>
                          <li>
                            <button
                              className="dropdown-item"
                              type="button"
                              onClick={() =>
                                handlerolefilter("Pack Pharmacist")
                              }
                            >
                              Pack Pharmacist
                            </button>
                          </li>
                          <li>
                            <button
                              className="dropdown-item"
                              type="button"
                              onClick={() => handlerolefilter("Provider")}
                            >
                              Provider
                            </button>
                          </li>
                          <li>
                            <button
                              className="dropdown-item"
                              type="button"
                              onClick={() => handlerolefilter("Technician")}
                            >
                              Technician
                            </button>
                          </li>
                         
                        </ul>
                      </div>
                    </th>
                    <th>
                      <div className="dropdown-adduser">
                        Status:
                        <button
                          className="btn1 btn1-secondary"
                          type="button"
                          id="mediAssistDropdown"
                          data-bs-toggle="dropdown"
                          aria-expanded="false"
                        >
                          {statusFilter}
                        </button>
                        <ul
                          className="dropdown-menu"
                          aria-labelledby="mediAssistDropdown"
                        >
                          <li>
                            <button
                              className="dropdown-item"
                              type="button"
                              onClick={() => handlestatusfilter("ALL")}
                            >
                              ALL
                            </button>
                          </li>

                          <li>
                            <button
                              className="dropdown-item"
                              type="button"
                              onClick={() => handlestatusfilter("Active")}
                            >
                              Active
                            </button>
                          </li>
                          <li>
                            <button
                              className="dropdown-item"
                              type="button"
                              onClick={() => handlestatusfilter("Inactive")}
                            >
                              Inactive
                            </button>
                          </li>
                        </ul>
                      </div>
                    </th>
                    <th>ModifiedBy</th>
                    <th>ModifiedDate</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {currentItemsuser.map((row, index) => (
                    <tr
                      className="tablerow-adduser"
                      key={index}
                      id={
                        index % 2 === 0 ? "even-row-adduser" : "odd-row-adduser"
                      }
                    >
                      <td>
                        <input
                          type="checkbox"
                          checked={isUserSelected(row.ID)}
                          onChange={() => handleCheckboxChange(index, row.ID)}
                        ></input>
                      </td>
                      <td>
                        {" "}
                        {isEditinguser && editedRowIndexuser === index ? (
                          <input
                            value={editedValuesuser.pName}
                            onChange={(e) => handleInputChange(e, "pName")}
                          />
                        ) : (
                          <>{row.Name}</>
                        )}
                      </td>
                      <td>{row.EmailID}</td>

                      <td>
                        {isEditinguser && editedRowIndexuser === index ? (
                          <select
                            value={editedValuesuser.Role}
                            onChange={(e) => handleInputChange(e, "Role")}
                          >
                            <option value="ADMIN">ADMIN</option>
                            <option value="Pharmacist">Pharmacist</option>
                            <option value="Technician">Technician</option>
                            <option value="Pack Pharmacist">
                              Pack Pharmacist
                            </option>

                            <option value="Provider">Provider</option>
                          </select>
                        ) : (
                          row.RoleDesc
                        )}
                      </td>

                      <td>
                        {isEditinguser && editedRowIndexuser === index ? (
                          <select
                            value={editedValuesuser.ActiveStatus}
                            onChange={(e) =>
                              handleInputChange(e, "ActiveStatus")
                            }
                          >
                            <option value="active">Active</option>
                            <option value="Inactive">Inactive</option>
                          </select>
                        ) : (
                          row.Status
                        )}
                      </td>
                      <td>{row.RecordModifiedBy}</td>

                      <td>{row.RecordModifiedDate}</td>

                      <td>
                        {isEditinguser && editedRowIndexuser === index ? (
                          <>
                            <button onClick={() => handleSave(index)}>
                              Save
                            </button>
                            <button onClick={handleCancel}>X</button>
                          </>
                        ) : (
                          <div style={{ marginLeft: "40%" }}>
                            <button
                              class="editBtn-adduser"
                              onClick={() => handleuserEdit(index)}
                              title="Edit"
                            >
                              <svg height="1em" viewBox="0 0 512 512">
                                <path d="M410.3 231l11.3-11.3-33.9-33.9-62.1-62.1L291.7 89.8l-11.3 11.3-22.6 22.6L58.6 322.9c-10.4 10.4-18 23.3-22.2 37.4L1 480.7c-2.5 8.4-.2 17.5 6.1 23.7s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L387.7 253.7 410.3 231zM160 399.4l-9.1 22.7c-4 3.1-8.5 5.4-13.3 6.9L59.4 452l23-78.1c1.4-4.9 3.8-9.4 6.9-13.3l22.7-9.1v32c0 8.8 7.2 16 16 16h32zM362.7 18.7L348.3 33.2 325.7 55.8 314.3 67.1l33.9 33.9 62.1 62.1 33.9 33.9 11.3-11.3 22.6-22.6 14.5-14.5c25-25 25-65.5 0-90.5L453.3 18.7c-25-25-65.5-25-90.5 0zm-47.4 168l-144 144c-6.2 6.2-16.4 6.2-22.6 0s-6.2-16.4 0-22.6l144-144c6.2-6.2 16.4-6.2 22.6 0s6.2 16.4 0 22.6z"></path>
                              </svg>
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <Modal
            open={showadduser}
            onClose={() => setShowadduser(false)}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={style1}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <h3 style={{ marginLeft: "30%" }}>Create User</h3>
                <button onClick={handleaddCancel} className="x-adduser">
                  X
                </button>
              </div>

              <form onSubmit={handleSubmit}>
                <div style={{ marginLeft: "1%", marginTop: "12px" }}>
                  <span className="span-addusername">
                    <label className="label-adduser">Name:</label>
                    <input
                      type="text"
                      name="Name"
                      value={formuser.Name}
                      onChange={handleaddchange}
                      className="inputbox"
                      required
                    ></input>
                  </span>
                  {errors.EmailID && (
                    <div className="error-adduser">{errors.EmailID}</div>
                  )}
                  <span className="span-adduser">
                    <label className="label-adduser1" htmlFor="EmailID">
                      Email ID:
                    </label>
                    <div className="email-input-container">
                      <input
                        type="text"
                        name="EmailID"
                        id="EmailID"
                        ref={emailInputRef}
                        value={usernamePart}
                        onChange={handleEmailChange}
                        onFocus={focusEmailInput}
                        className={errors.EmailID ? "error" : ""}
                        required
                      ></input>
                      <span className="email-domain">{domainPart}</span>
                    </div>
                  </span>

                  <span className="span-adduser">
                    <label className="label-adduser">Role:</label>
                    <select
                      name="RoleDesc"
                      value={formuser.RoleDesc}
                      onChange={handleaddchange}
                      required
                    >
                      <option value="">Select</option>
                      <option value="ADMIN">ADMIN</option>
                      <option value="Pharmacist">Pharmacist</option>
                      <option value="Technician">Technician</option>
                      <option value="Pack Pharmacist">Pack Pharmacist</option>
                      <option value="Provider">Provider</option>
                    </select>
                  </span>
                </div>

                <div>
                  <button type="submit" className="sbmt-adduser">
                    Submit
                  </button>
                </div>
              </form>
            </Box>
          </Modal>

          <Modal
            open={openModal}
            onClose={() => setOpenModal(false)}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={styleadd}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <h3 style={{ marginLeft: "8%" }}>User Successfully added</h3>
              </div>

              <div style={{ marginTop: "6%" }}>
                <div>
                  <strong>Email ID:</strong>
                  <span id="user-email">{modalData.pLogin}</span>
                </div>
              </div>
              <div style={{ marginTop: "6%" }}>
                <div>
                  <span>
                    <strong>Default Password:</strong>
                    <span id="user-password">{modalData.pPassword}</span>
                  </span>
                </div>
              </div>
              <div
                style={{
                  marginTop: "6%",
                  marginLeft: "40%",
                  height: "100%",
                  display: "flex",
                  gap: "15px",
                }}
              >
                <button
                  onClick={() => setOpenModal(false)}
                  className="addpopup"
                >
                  OK
                </button>

                <div className="copy-btn-container">
                  <Tooltip title="copy" arrow>
                    <ContentCopyIcon
                      className="copy-btnadd"
                      onClick={handleUserDetailsCopy}
                    ></ContentCopyIcon>
                  </Tooltip>
                </div>
              </div>
            </Box>
          </Modal>

          <Modal
            open={openModaldel}
            onClose={() => setOpenModaldel(false)}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={styleadd}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <h3 style={{ marginLeft: "20%" }}>Confirm Delete</h3>
              </div>

              <div style={{ marginTop: "6%" }}>
                <div>
                  Are you Sure want to delete {selectedUsers.length} items?
                </div>
              </div>

              <div
                style={{
                  marginTop: "10%",
                  marginLeft: "55%",
                  height: "100%",
                  display: "flex",
                  gap: "10px",
                }}
              >
                <button onClick={handledelete} className="delpopup">
                  Yes
                </button>
                <div>
                  <button
                    onClick={() => setOpenModaldel(false)}
                    className="xpopup"
                  >
                    NO
                  </button>
                </div>
              </div>
            </Box>
          </Modal>

          <Modal
            open={openModaldelok}
            onClose={() => setOpenModaldelok(false)}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={styleadd}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <h3 style={{ marginLeft: "8%" }}>User Successfully Deleted</h3>
              </div>

              <div style={{ marginTop: "6%" }}>
                <div>{delcount} item(s) is deleted</div>
              </div>

              <div
                style={{ marginTop: "6%", marginLeft: "40%", height: "100%" }}
              >
                <button
                  onClick={() => setOpenModaldelok(false)}
                  className="addpopup"
                >
                  OK
                </button>
              </div>
            </Box>
          </Modal>


          <Modal
            open={openresetModal}
            onClose={() => setOpenresetModal(false)}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={styleadd}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <h3 style={{ marginLeft: "9%" }}>Confirm Password Reset</h3>
              </div>

              <div style={{ marginTop: "6%" }}>
                <div>
                  Are you sure you want to reset the password for{" "}
                  {selectedUsers.length} user(s) ?
                </div>
              </div>

              <div
                style={{
                  marginTop: "10%",
                  marginLeft: "60%",
                  height: "100%",
                  display: "flex",
                  gap: "10px",
                }}
              >
                <button onClick={handleresetpwd} className="resetpopup">
                  Yes
                </button>
                <div>
                  <button
                    onClick={() => setOpenresetModal(false)}
                    className="resetx"
                  >
                    NO
                  </button>
                </div>

              </div>
            </Box>
          </Modal>

          <Modal
            open={openresetedModal}
            onClose={() => setOpenresetedModal(false)}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={stylereseted}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <h3 style={{ marginLeft: "3%" }}>
                  Password Successfully Reset
                </h3>
              </div>

              <div style={{ marginTop: "4%" }}>
                User’s password has been reset to{" "}
                <strong>{modalDatareset}</strong>
                <Tooltip title={copiedreset ? "Copied" : "Copy"} arrow>
                  <ContentCopyIcon
                    className="copy-btn"
                    onClick={() => handleCopy(modalDatareset, setCopiedreset)}
                  ></ContentCopyIcon>
                </Tooltip>
              </div>

              <div
                style={{ marginTop: "6%", marginLeft: "40%", height: "100%" }}
              >
                <button
                  onClick={() => setOpenresetedModal(false)}
                  className="addpopup"
                >
                  OK
                </button>
              </div>
            </Box>
          </Modal>

          <div className="foot-adduser">
            <div className="pagin-adduser">
              <Pagination
                page={currentPageUser}
                count={totalPagesuser}
                onChange={handleChangepage}
                showFirstButton
                showLastButton
              />
            </div>
            <div className="Range-adduser">
              <span>
                {rangeStartuser}-{rangeEnduser} of {filteraddeduser.length}{" "}
                items
              </span>
            </div>
          </div>
        </main>

      </div> */}


    </div>
  );
}

export default UserManagemant;
