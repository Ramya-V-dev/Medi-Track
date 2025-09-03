import React, { useState, useEffect } from "react";
import "./Medilist.css";
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
import { Autocomplete, TextField } from "@mui/material";

const BaseUrl = process.env.REACT_APP_API_BASE_URL;

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  height: "500px",
  width: "500px",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  paddingTop: 2,
  paddingLeft: 4,
  paddingRight: 4,
  paddingBottom: 4,
};

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
  '@media screen and (min-width: 1900px) and (max-width:4000px)': {
    width:'650px',
    height:'250px',border:'3px solid #000'
  },
  '@media screen and (min-width: 1600px) and (max-width:1890px)': {
    width:'580px',
    height:'230px',border:'3px solid #000'
  },
};

const style2 = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  height: "180px",
  width: "450px",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  paddingTop: 2,
  paddingLeft: 4,
  paddingRight: 4,
  paddingBottom: 4,
  '@media screen and (min-width: 1900px) and (max-width:4000px)': {
    width:'600px',
    height:'250px',border:'3px solid #000'
  },
  '@media screen and (min-width: 1600px) and (max-width:1890px)': {
    width:'450px',
    height:'250px',border:'3px solid #000'
  },
};

function Medilist() {
  const [tableDatalib, setTableDatalib] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isEditing, setIsEditing] = useState(false);
  const [editedValues, setEditedValues] = useState({});
  const [editedRowIndex, setEditedRowIndex] = useState(null);
  const itemsPerPage = 15;
  const [searchInput, setSearchInput] = useState(
    localStorage.getItem("searchInput") || ""
  );
  const [dateFilter, setDateFilter] = useState(
    localStorage.getItem("dateFilter") || ""
  );
  const location = useLocation();
  const name = location.state?.name;
  const [pageNo, setPageNo] = useState("");
  // const {PatientIdentifier} = useParams();
  const PatientIdentifier = location.state?.PatientIdentifier || "";
  const libertyrow = useSelector(
    (state) => state.PatientIdentifier.selectedLibertyRow
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isAllSelected, setIsAllSelected] = useState(false);
  const nav = useNavigate();
  const [selectedPMIDs, setSelectedPMIDs] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showOtherInput, setShowOtherInput] = useState(false);
  const [sortColumn, setSortColumn] = useState(
    localStorage.getItem("sortColumn") || ""
  );
  const [sortOrder, setSortOrder] = useState(
    localStorage.getItem("sortOrder") || "asc"
  );
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showPackModal, setShowPackModal] = useState(false);
  const [reviewedItemsCount, setReviewedItemsCount] = useState(0);
  const [failureItemsCount, setFailureItemsCount] = useState(0);
  const [failurePMIDItemsCount, setFailurePMIDItemsCount] = useState([]);
  const [showReviewResultmodal, setShowReviewResultmodal] = useState(false);
  const [isYesLoadingPack, setIsYesLoadingPack] = useState(false);

  const [packedItemsCount, setPackedItemsCount] = useState(0);
  const [failurePackCount, setFailurePackCount] = useState(0);
  const [failurePMIDPackCount, setFailurePMIDPackCount] = useState([]);
  const [showPackResultmodal, setShowPackResultmodal] = useState(false);
  const [isYesLoading, setIsYesLoading] = useState(false);
  const { token = null, tokenname = null } = useSelector(
    (state) => state.PatientIdentifier ?? {}
  );
  const Role = useSelector((state) => state.PatientIdentifier.Role);
  const permissions = getPermissionsByRole(Role)
  const RoleDesc = useSelector((state) => state.PatientIdentifier.RoleDesc);

  const signout = () => {
    dispatch(logout());
    navigate("/");
  };
  const [ispackfilter, setIspackfilter] = useState(
    localStorage.getItem("ispackfilter") || "ALL"
  );
  const [reviewfilter, setReviewfilter] = useState(
    localStorage.getItem("reviewfilter") || "ALL"
  );

  useEffect(() => {
    // console.log(
    //   "JSON.parse(libertyrow)",
    //   JSON.parse(localStorage.getItem("data"))
    // );
    const data = libertyrow || JSON.parse(localStorage.getItem("data"));
    // console.log("data", data);
    // if(JSON.parse(libertyrow) ){
    setFormData((prevFormData) => ({
      ...prevFormData,
      nameofpatient: data.PatientName,
      PatientName: data.DisplayName,
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
  }, [libertyrow]);

  useEffect(() => {
    fetchmedlist();
  }, []);

  const fetchmedlist = async () => {
    try {
      if (!token || !tokenname) {
        navigate("/");
        return;
      }

      const resp = await axios.get(
        `${BaseUrl}/mediget/${location.state?.PatientIdentifier}`,
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
  const formatdate = (date) => {
    // return (date?.split(' ')[0])
    if (!date) return "";

    const [year, month, day] = date.split(" ")[0].split("-");
    return `${month}/${day}/${year}`;
  };

  useEffect(() => {
    localStorage.removeItem("searchInput", searchInput);
    localStorage.removeItem("dateFilter", dateFilter);
    localStorage.removeItem("sortColumn", sortColumn);
    localStorage.removeItem("sortOrder", sortOrder);
    localStorage.removeItem("ispackfilter", ispackfilter);
    localStorage.removeItem("reviewfilter", reviewfilter);
  }, [currentPage]);

  useEffect(() => {
    const filtered = tableDatalib.filter((item) => {
      // Filter by fields other than date
      const otherFieldsMatch = [
        item.Drug_name,
        formatdate(item.DateDispensedSQL),
        item["RX#"],
      ].some(
        (term) =>
          term &&
          term.toString().toLowerCase().includes(searchInput.toLowerCase())
      );

      const dateColumnMatch = [
        item.RecordCreatedDate,
        formatdate(item.RecordModifiedDate),
      ].some((term) => {
        if (!dateFilter) return true; // If no date filter is set, consider it a match
        if (!term) return false;

        const formattedDate =
          term &&
          term.toString().toLowerCase().includes(dateFilter.toLowerCase());
        return formattedDate;
      });

      const ispackMatch =
        ispackfilter === "ALL" || item.IsPacked === ispackfilter;

      const reviewMatch =
        reviewfilter === "ALL" || item.Reviewed === reviewfilter;

      return otherFieldsMatch && dateColumnMatch && ispackMatch && reviewMatch;
    });
    setFilteredData(filtered); // Ensure data is sorted whenever filteredData updates
    setCurrentPage(1);
  }, [searchInput, dateFilter, tableDatalib, ispackfilter, reviewfilter]);

  const handleispackFilterChange = (value) => {
    setIspackfilter(value === "ALL" ? "ALL" : value);
    setCurrentPage(1); // Reset pagination to first page when filter changes
  };

  const handlereviewFilterChange = (value) => {
    setReviewfilter(value === "ALL" ? "ALL" : value);
    setCurrentPage(1); // Reset pagination to first page when filter changes
  };

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const rangeStart = indexOfFirstItem + 1;
  const rangeEnd = Math.min(indexOfLastItem, filteredData.length);
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  const handleChange = (event, page) => {
    setCurrentPage(page);
  };

  const columns = ["Drug Name", "Date Dispensed", "RX#"]; // Example column names
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((index) => (index + 1) % columns.length);
    }, 1000); // Change column every second

    return () => clearInterval(interval);
  }, [columns.length]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    PatientName: "", // Fixed value from table
    Globalid: "",
    SSN: "", // Fixed value from table
    DateOfBirth: "",
    Drug_name: "",
    DateDispensedSQL: "",
    QuantityDispensed: "",
    sigs: "",
    OnHold: "",
    Sb_LastModified: "",
    Pharmacy: "",
    IsPacked: "",
    PatientIdentifier: "",
    NdcNumber: "",
    // Add more fields here as needed
  });

  const [errors, setErrors] = useState({
    NdcNumber: "",
    QuantityDispensed: "",
  });

  const handleInputChange = (value, name) => {
    if (name === "NdcNumber") {
      const regex = /^[0-9]*$/; // Only allow numeric values
      if (!regex.test(value)) {
        setErrors((prev) => ({
          ...prev,
          NdcNumber: "Ndc Number must be an integer.",
        }));
        return; // Prevent updating state if invalid
      } else {
        setErrors((prev) => ({ ...prev, NdcNumber: "" })); // Clear error message if valid
      }
    }

    if (name === "QuantityDispensed") {
      const regex = /^\d*\.?\d*$/; // Only allow numeric values
      if (!regex.test(value)) {
        setErrors((prev) => ({
          ...prev,
          QuantityDispensed: "Quantity must be an decimal.",
        }));
        return; // Prevent updating state if invalid
      } else {
        setErrors((prev) => ({ ...prev, QuantityDispensed: "" })); // Clear error message if valid
      }
    }
    setFormData({ ...formData, [name]: value });
  };

  const handleSelectChange = (value) => {
    if (value !== "Others") {
      handleInputChange(value, "Pharmacy");
      setShowOtherInput(false);
    } else {
      handleInputChange("Others", "Pharmacy");
      setShowOtherInput(true);
    }
  };

  const handleAddButtonClick = () => {
    // if (formData.length > 0) {
    const initialFormData = {
      nameofpatient: formData.nameofpatient,
      PatientName: formData.PatientName,
      Globalid: formData.Globalid,
      SSN: formData.SSN,
      DateOfBirth: formData.DateOfBirth,
      Drug_name: "",
      DateDispensedSQL: "",
      QuantityDispensed: "",
      sigs: "",
      OnHold: "",
      Sb_LastModified: "",
      Pharmacy: "",
      IsPacked: "No",
      PatientIdentifier: formData.PatientIdentifier,
      NdcNumber: "",
    };
    // initialFormData();
    setFormData(initialFormData);
    // }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData, "call data");
    // const {PatientName} = location.state.
    try {
      const response = await axios.post(`${BaseUrl}/mediadd`, {
        formData,
        name,
        PatientName: formData.nameofpatient,
      });
      console.log("Data submitted successfully:", response.data.data);
      fetchmedlist();
      // fetchdrug();
      // fetchprov();
      console.log("pj");
      setIsModalOpen(false); // Close the popup after successful submission
    } catch (error) {
      console.error("Error submitting data:", error);
      // Handle error
    }
  };

  const handleEdit = (index) => {
    setIsEditing(true);

    const sortedData = sortData();

    // Set the edited values based on the sorted data
    setEditedValues({ ...sortedData[index] });
    setEditedRowIndex(index);
  };

  

  const handleSave = async () => {
    try {
      //  const tableDataIndex = (currentPage - 1) * itemsPerPage + editedRowIndex;
      const sortedDatasave = sortData();

      const updatedTableData = [...sortedDatasave];
      updatedTableData[editedRowIndex] = {
        ...editedValues,
        RecordModifiedBy: name,
      };
      console.log(updatedTableData,'packed')
      setTableDatalib(updatedTableData);
      setIsEditing(false);
      // Update the data on the server
      await axios.put(`${BaseUrl}/mediadd`, updatedTableData[editedRowIndex]);
    } catch (error) {
      console.error("Error updating data:", error);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedValues({});
  };

  const handleeditChange = (field, value) => {
    setEditedValues({ ...editedValues, [field]: value });
  };

  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;;

  const handleDateChange = (date, index) => {
    const formattedDate = date
      ? format(fromZonedTime(date, timeZone), "yyyy-MM-dd")
      : null; // Check if date is null
    const newDates = [...tableDatalib];
    newDates[index].DateDispensedSQL = formattedDate;
    setTableDatalib(newDates);
    setEditedValues((prevState) => ({
      ...prevState,
      DateDispensedSQL: formattedDate,
    }));
  };

  const handleSbDateChange = (date, index) => {
    const formattedDate = date
      ? format(fromZonedTime(date, timeZone), "yyyy-MM-dd")
      : null; // Check if date is null
    const newDates = [...tableDatalib];
    newDates[index].DateWritten = formattedDate;
    setTableDatalib(newDates);
    setEditedValues((prevState) => ({
      ...prevState,
      DateWritten: formattedDate,
    }));
  };

  const handleDispenseChange = (date, field) => {
    const formattedDate = date
      ? format(fromZonedTime(date, timeZone), "yyyy-MM-dd")
      : null;
      const newDates = { ...formData };
      setFormData(newDates);
    setFormData((prevData) => ({
      ...prevData,
      [field]: formattedDate,
    }));
  };

  const handleimportchange = () => {
    navigate(`/liberty/`, {
      state: {
        name,
        PatientIdentifier,
        source: location.state?.source || "patient",
      },
    });
  };

  const handleimportallchange = () => {
    navigate(`/libertyall/`, {
      state: {
        name,
        PatientIdentifier,
        source: location.state?.source || "patient",
      },
    });
  };

  const handlehomebtn = () => {
    console.log("name", name);
    navigate(`/homepage`, { state: { name, pageNo } });
  };

  const handlebackbtn = () => {
    // navigate(`/medsnap`,{state:{name,pageNo,PatientIdentifier}})

    const source = location.state?.source || "patient";
    if (source === "calendar") {
      navigate(`/medsnap`, {
        state: {
          name,
          PatientIdentifier,
          calenderview: true,
          source: "calendar",
        },
      });
    } else {
      navigate(`/medsnap`, {
        state: {
          name,
          pageNo,
          PatientIdentifier,
          source: "patient",
        },
      });
    }
  };

  const handleCheckboxChange = (PMID) => {
    setSelectedPMIDs((prevSelected) => {
      const newSelected = prevSelected.includes(PMID)
        ? prevSelected.filter((id) => id !== PMID) // Remove the PMID
        : [...prevSelected, PMID]; // Add the PMID

      // Update the isAllSelected state
      const pagePMIDs = sortData().map((item) => item.PMID);
      setIsAllSelected(pagePMIDs.every((id) => newSelected.includes(id)));

      return newSelected;
    });
  };

  const handleHeaderCheckboxChange = () => {
    setIsAllSelected(!isAllSelected);

    if (!isAllSelected) {
      // Select all items on the current page
      // const pagePMIDs = sortData().filter(item =>item.IsRxqDeleted !==1).map(item => item.PMID);
      const pagePMIDs = sortData()
        .filter((item) => item.PMID && (permissions?.MediList?.nonPackYes || item.IsPacked !== 'Yes'))
        .map((item) => item.PMID);

      setSelectedPMIDs((prevSelected) => [
        ...new Set([...prevSelected, ...pagePMIDs]),
      ]);
    } else {
      // Deselect all items on the current page
      // const pagePMIDs = sortData().filter(item =>item.IsRxqDeleted !==1).map(item => item.PMID);
      const pagePMIDs = sortData()
        .filter((item) => item.PMID)
        .map((item) => item.PMID);

      setSelectedPMIDs((prevSelected) =>
        prevSelected.filter((id) => !pagePMIDs.includes(id))
      );
    }
  };

  const handleDelete = () => {
    selectedPMIDs.forEach((PMID) => {
      axios
        .delete(`${BaseUrl}/medidel`, { data: { PMID, name, Role } })
        .then((response) => {
          setTableDatalib((prevMeds) =>
            prevMeds.filter((med) => med.PMID !== PMID)
          );
          setSelectedPMIDs([]);
        })
        .catch((error) => console.error("Error deleting medication:", error));
    });
    setShowModal(false);
  };

  const addbackchange = () => {
    setIsModalOpen(false);
  };

  const handleReview = () => {
    setIsYesLoading(true);

    axios
      .put(`${BaseUrl}/reviewdata`, {
        PMIDs: selectedPMIDs,
        name,
        PatientIdentifier,
        Role,
      })
      .then((response) => {
        console.log("Response:", response.data);

        setSelectedPMIDs([]);
        setIsYesLoading(false);
        setShowReviewModal(false);
        setShowReviewResultmodal(true);
        setReviewedItemsCount(response.data.successCount);
        setFailureItemsCount(response.data.failureCount);
        setFailurePMIDItemsCount(response.data.failedPMIDs);
        console.log(`Successfully reviewed: ${response.data.successCount}`);
        console.log(`Failed to review: ${response.data.failureCount}`);
        console.log("Failed PMIDs:", response.data.failedPMIDs);
        fetchmedlist();
      })
      .catch((error) => {
        console.error("Error reviewing medications:", error);
        setIsYesLoading(false);
        // Handle error (e.g., show error message to user)
      });
  };

  const handlePack = () => {
    setIsYesLoadingPack(true);

    axios
      .put(`${BaseUrl}/packdata`, {
        PMIDs: selectedPMIDs,
        name,
      })
      .then((response) => {
        console.log("Response:", response.data);

        setSelectedPMIDs([]);
        setIsYesLoadingPack(false);
        setShowPackModal(false);
        setShowPackResultmodal(true);
        setPackedItemsCount(response.data.successCount);
        setFailurePackCount(response.data.failureCount);
        setFailurePMIDPackCount(response.data.failedPMIDs);
        console.log(`Successfully reviewed: ${response.data.successCount}`);
        console.log(`Failed to review: ${response.data.failureCount}`);
        console.log("Failed PMIDs:", response.data.failedPMIDs);
        fetchmedlist();
      })
      .catch((error) => {
        console.error("Error reviewing medications:", error);
        setIsYesLoadingPack(false);
        // Handle error (e.g., show error message to user)
      });
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


   const [drugnamelist, SetDrugnamelist] = useState([]);
   const [provlist, SetProvlist] = useState([]);

   const fetchdrug = async(input) => {
    try {
     const respo = await axios.get(`${BaseUrl}/druglist`)
     
      SetDrugnamelist(respo.data.data)
    } catch (err) {
       console.log(err);
    }
 
   }

   const fetchprov = async(input) => {
    try {
     const respo = await axios.get(`${BaseUrl}/provlist`)
      SetProvlist(respo.data.data)
    } catch (err) {
       console.log(err);
    }

   }



  

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

  const handledelhistory = () => {
    navigate(`/del_history/`, {
      state: {
        name,
        PatientIdentifier,
        source: location.state?.source || "patient",
      },
    });
  };

  const handleviewmedclick = (listmed) => {
    const stateToStoremed = {
      searchInput,
      dateFilter,
      sortColumn,
      sortOrder,
      ispackfilter,
      reviewfilter,
    };

    localStorage.setItem("medListState", JSON.stringify(stateToStoremed));
    navigate("/viewmedlist", {
      state: {
        name,
        listmed,
        PatientIdentifier,
        patientname: formData.PatientName,
        source: location.state?.source || "patient",
      },
    });
  };

  const validateNdcNumber = (value) => {
    if (!/^\d+$/.test(value)) {
      return "NDC Number must contain only digits";
    }
    return "";
  };

       const [menuOpen, setMenuOpen] = useState(false);
  

  return (
    <div>
        <div className='nav-mainmedi' >
      <nav className='nav-mainmedi'>
          <div className='navbar-fullmedi'>
            <div className='nav-leftmedi'>
            <h4 className='h5-leftmedi' 
            style={{display:'flex', marginLeft:'0.5rem', textAlign:'center', padding:'0.3rem', fontFamily:'Volkhov, serif'}}>
                Hello, {name}{" "}
                {RoleDesc &&
                RoleDesc.toLowerCase() !== "null" &&
                RoleDesc.trim() !== ""
                  ? `(${RoleDesc})`
                  : ""}
              </h4>
            </div>
            
            <div className='nav-middlemedi'>
              <h4 className='h4-midmedi' style={{display:'flex', fontWeight:600}}>Medication List</h4>
            </div>
          
           <div className='nav-containermedi'>
              <ul className={`nav-ulmedi ${menuOpen ? "show":""}`}>
                
                <li className='nav-homemedi'>
                  <HomeIcon  sx={{color: 'white', cursor:'Pointer',width:'1.8rem',height:'1.8rem',
      '@media screen and (min-width: 1900px) and (max-width:4000px)': { width: '2.3rem', height: '2.3rem' },
      '@media screen and (min-width: 1600px) and (max-width:1890px)' : {width: '2rem', height: '2rem'},
     }} onClick={handlehomebtn}></HomeIcon>
                </li>
                <li>
                  <picture className='img-outmedi' onClick={signout}>
                        <source srcset={poweroff} type="image/svg+xml"/>
                        <img src={poweroff} class="img-fluid" alt="..."/>
                    </picture>
                </li>
              </ul>

            </div>

          </div>
         </nav>
      </div>

      <div className="medi-navbottom">
        <div className="medi-pathead">
          <div style={{width:'30%'}}>
            <button onClick={() => handlebackbtn()} class="backbutton-medi">
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
          

          <div className="medi-patinfo" >
            <div className="medi-patalign" >
              <label >Patient Name&nbsp;:&nbsp;</label>
              <span style={{fontWeight:600}}>{formData.PatientName}</span>
            </div>
            <div className="medi-patalign" >
              <label >Date Of Birth&nbsp;:&nbsp;</label>
              <span style={{fontWeight:600}}>{formData.DateOfBirth}</span>
            </div>
          </div>

          <div className="btn-del-imp" >
            <button className="medi-delhis-btn" onClick={() => handledelhistory()}>Deleted History</button>
            <button className="medi-delhis-btn" onClick={() => handleimportchange()}>Import New</button>
            <button className="medi-delhis-btn" onClick={() => handleimportallchange()}>Import ALL</button>

          </div>
        </div>

         <div className='medi-main'>
          <div style={{width:'100%',display:'flex'}}>

            <div className="medi-searchbox-side">
                <div className='medi-searchbox-main'>
                     <div className='medi-searchbox'>
                         <input className='medisearch-input'  type="text"
                             placeholder={`Search for "${columns[index]}"`}
                             onFocus={() => setIndex(0)}
                             value={searchInput}
                             onChange={(e) => setSearchInput(e.target.value)}
                         />
                         
                     </div>
                     
                   </div>

                    <div className='medi-searchbox1-main'>
                     <div className='medi-searchbox1'>
                         <input className='medisearch-input1'  type="text"
                             placeholder={`Search for ModifiedDate....`}
                             onFocus={() => setIndex(0)}
                             value={dateFilter}
                             onChange={(e) => setDateFilter(e.target.value)}
                         />
                         
                     </div>
                     
                   </div>
            </div>

            <div  className="meditable-rightside">
              <button className={`meditable-insidebtn ${!permissions?.MediList?.packEdit ? "disabledbtn" : ""}`} 
                onClick={() => setShowPackModal(true)}
                disabled={selectedPMIDs.length === 0 || !permissions?.MediList?.packEdit}>
                  Pack
              </button>

              <button className={`meditable-insidebtn ${!permissions?.MediList?.reviewEdit ? "disabledbtn" : ""}`} 
                onClick={() => setShowReviewModal(true)}
                disabled={selectedPMIDs.length === 0 || !permissions?.MediList?.reviewEdit}>
                  Review
              </button>

              <button className="meditable-addbtn" disabled={!permissions?.MediList?.canADD}
                  onClick={() => handleAddButtonClick()} >
                    <i class="fa fa-plus"></i>Add</button>

              <button className={`meditable-delbtn ${!permissions?.MediList?.canDelete ? "disabledbtn" : ""}`} 
                 onClick={() => setShowModal(true)}
                  disabled={selectedPMIDs.length === 0 || !permissions?.MediList?.canDelete}
                  >
                    <i class="bi bi-trash"></i></button>
            </div>
             
          </div>
                  
         
         <div className='tablescroll-medi'>
           <table className='medi-table'>
             <thead >
               <tr className='meditable-head'>
                   <th>
                      <input  className="checkbox-thmedi"
                        type="checkbox"
                        checked={isAllSelected}
                        onChange={handleHeaderCheckboxChange}
                      ></input>
                    </th>
                    <th onClick={() => handleSort("Drug_name")}>
                      Drug&nbsp;Name{arrowIcon("Drug_name")}
                    </th>
                    <th>Sig</th>
                    <th>Quantity&nbsp;Dispensed</th>
                    <th onClick={() => handleSort("DateDispensedSQL")}>
                      Date&nbsp;Dispensed{arrowIcon("DateDispensedSQL")}
                    </th>
                    <th>Prescriber</th>
                    <th>Date&nbsp;Written</th>
                    <th>RX#</th>
                    <th>
                      <div className="dropdown-medi">
                        Packed:&nbsp;
                        <button
                          className="btnmedi btnmedi-secondary "
                          type="button"
                          id="mediAssistDropdown"
                          data-bs-toggle="dropdown"
                          aria-expanded="false"
                        >
                          {ispackfilter}
                        </button>
                        <ul
                          className="dropdown-menu"
                          aria-labelledby="mediAssistDropdown"
                        >
                          <li>
                            <button
                              className="dropdown-item"
                              type="button"
                              onClick={() => handleispackFilterChange("ALL")}
                            >
                              ALL
                            </button>
                          </li>

                          <li>
                            <button
                              className="dropdown-item"
                              type="button"
                              onClick={() => handleispackFilterChange("Yes")}
                            >
                              Yes
                            </button>
                          </li>
                          <li>
                            <button
                              className="dropdown-item"
                              type="button"
                              onClick={() => handleispackFilterChange("No")}
                            >
                              No
                            </button>
                          </li>
                        </ul>
                      </div>
                    </th>
                    <th>
                      <div className="dropdown-medi">
                        Reviewed:&nbsp;
                        <button
                          className="btnmedi btnmedi-secondary "
                          type="button"
                          id="mediAssistDropdown"
                          data-bs-toggle="dropdown"
                          aria-expanded="false"
                        >
                          {reviewfilter}
                        </button>
                        <ul
                          className="dropdown-menu"
                          aria-labelledby="mediAssistDropdown"
                        >
                          <li>
                            <button
                              className="dropdown-item"
                              type="button"
                              onClick={() => handlereviewFilterChange("ALL")}
                            >
                              ALL
                            </button>
                          </li>

                          <li>
                            <button
                              className="dropdown-item"
                              type="button"
                              onClick={() => handlereviewFilterChange("Yes")}
                            >
                              Yes
                            </button>
                          </li>
                          <li>
                            <button
                              className="dropdown-item"
                              type="button"
                              onClick={() => handlereviewFilterChange("No")}
                            >
                              No
                            </button>
                          </li>
                        </ul>
                      </div>
                    </th>
                    <th>Modified&nbsp;By</th>
                    <th>Modified&nbsp;Date</th>
                    <th className="medi-action">Action</th>
               </tr>
             </thead>
             <tbody>
               {sortData().map((row, index) => (
                 <tr
                                   className="meditable-row"
                                   key={index}
                                   id={index % 2 === 0 ? "even-rowmedi" : "odd-rowmedi"}
                                 >
                                   <td>
                        <input  className="checkbox-thmedi"
                          type="checkbox"
                          disabled = {!permissions?.MediList?.nonPackYes && row.IsPacked === 'Yes'}
                          checked={selectedPMIDs.includes(row.PMID)}
                          onChange={() => handleCheckboxChange(row.PMID)}
                        />
                      </td>
                      <td>
                        {isEditing && editedRowIndex === index ? (
                          <textarea
                            value={editedValues.Drug_name}
                            onChange={(e) =>
                              handleeditChange("Drug_name", e.target.value)
                            }
                          />
                        ) : (
                          row.Drug_name
                        )}
                      </td>

                      <td>
                        {isEditing && editedRowIndex === index ? (
                          <textarea
                            value={editedValues.sigs}
                            onChange={(e) =>
                              handleeditChange("sigs", e.target.value)
                            }
                          />
                        ) : (
                          <>
                            <div
                              className={
                                row.sigs && row.sigs.length > 200
                                  ? "medwrap"
                                  : "medwrap1"
                              }
                            >
                              {row.sigs}
                            </div>
                            {/* row.sigs */}
                          </>
                        )}
                      </td>
                      <td>
                        {isEditing && editedRowIndex === index ? (
                          <input
                            value={editedValues.QuantityDispensed}
                            onChange={(e) =>
                              handleeditChange(
                                "QuantityDispensed",
                                e.target.value
                              )
                            }
                            className="editinput"
                          />
                        ) : (
                          row.QuantityDispensed
                        )}
                      </td>
                      <td>
                        {isEditing && editedRowIndex === index ? (
                          <DatePicker
                            selected={
                              editedValues.DateDispensedSQL === ""
                                ? new Date()
                                : toZonedTime(
                                    parseISO(editedValues.DateDispensedSQL),
                                    timeZone
                                  )
                            }
                            onChange={(date) => handleDateChange(date, index)}
                            dateFormat="MM-dd-yyyy"
                          ></DatePicker>
                        ) : (
                          formatdate(row.DateDispensedSQL)
                        )}
                      </td>

                      <td>
                        {isEditing && editedRowIndex === index ? (
                          <textarea
                            value={editedValues.Prescriber}
                            onChange={(e) =>
                              handleeditChange("Prescriber", e.target.value)
                            }
                          />
                        ) : (
                          row.Prescriber
                        )}
                      </td>
                      <td>
                        {isEditing && editedRowIndex === index ? (
                          <DatePicker
                            selected={
                              editedValues.DateWritten
                                ? toZonedTime(
                                    parseISO(editedValues.DateWritten),
                                    timeZone
                                  )
                                : null
                            }
                            onChange={(date) => handleSbDateChange(date, index)}
                            dateFormat="MM-dd-yyyy"
                          ></DatePicker>
                        ) : formatdate(row.DateWritten) ? (
                          formatdate(row.DateWritten)
                        ) : (
                          "-"
                        )}
                      </td>
                      <td>{row["RX#"]}</td>
                      <td>
                        {isEditing && editedRowIndex === index ? (
                          <select
                            value={editedValues.IsPacked}
                            onChange={(e) =>
                              handleeditChange("IsPacked", e.target.value)
                            }
                          >
                            {/* <option value="">Select</option> */}
                            <option value="Yes" disabled = {!permissions?.MediList?.nonPackYes}>Yes</option>
                            <option value="No">No</option>
                          </select>
                        ) : (
                          row.IsPacked
                        )}
                      </td>
                      <td>
                        {/* {row.Reviewed} */}
                        {isEditing && editedRowIndex === index ? (
                          <select
                            value={editedValues.Reviewed}
                            onChange={(e) =>
                              handleeditChange("Reviewed", e.target.value)
                            }
                            disabled={row.Reviewed === "No"}
                          >
                            {/* <option value="">Select</option> */}
                            <option value="Yes">Yes</option>
                            <option value="No">No</option>
                          </select>
                        ) : (
                          row.Reviewed
                        )}
                      </td>
                      <td>{row.RecordModifiedBy}</td>
                      <td>{formatdate(row.RecordModifiedDate)}</td>
                      <td className="esc-med">
                        {isEditing && editedRowIndex === index ? (
                          <div>
                            <button
                              className="savex"
                              onClick={() => handleSave(index)}
                            >
                              Save
                            </button>
                            <button className="xsave" onClick={handleCancel}>
                              X
                            </button>
                          </div>
                        ) : (
                          <div style={{ display: "flex" }}>
                            <button
                              class="editBtn-medi"
                              onClick={() => handleEdit(index)}
                              // disabled = {row.IsRxqDeleted === 1 || Role === 'TCN'}
                              disabled={!permissions?.MediList?.canEdit || 
                                (!permissions?.MediList?.nonPackYes && row.IsPacked === 'Yes')}
                            >
                              <svg height="1em" viewBox="0 0 512 512">
                                <path d="M410.3 231l11.3-11.3-33.9-33.9-62.1-62.1L291.7 89.8l-11.3 11.3-22.6 22.6L58.6 322.9c-10.4 10.4-18 23.3-22.2 37.4L1 480.7c-2.5 8.4-.2 17.5 6.1 23.7s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L387.7 253.7 410.3 231zM160 399.4l-9.1 22.7c-4 3.1-8.5 5.4-13.3 6.9L59.4 452l23-78.1c1.4-4.9 3.8-9.4 6.9-13.3l22.7-9.1v32c0 8.8 7.2 16 16 16h32zM362.7 18.7L348.3 33.2 325.7 55.8 314.3 67.1l33.9 33.9 62.1 62.1 33.9 33.9 11.3-11.3 22.6-22.6 14.5-14.5c25-25 25-65.5 0-90.5L453.3 18.7c-25-25-65.5-25-90.5 0zm-47.4 168l-144 144c-6.2 6.2-16.4 6.2-22.6 0s-6.2-16.4 0-22.6l144-144c6.2-6.2 16.4-6.2 22.6 0s6.2 16.4 0 22.6z"></path>
                              </svg>
                            </button>

                            <span
                              onClick={() => handleviewmedclick(row)}
                              title="View"
                            >
                              <VisibilityIcon
                                sx={{
                                  color:'white',
                                  fontSize:'20px',
                                  display: "flex",
                                  alignItems: "center",
                                  cursor: "Pointer",
                                  marginLeft: "10px",
                                   '@media screen and (min-width: 1900px) and (max-width:4000px)':
                                    { width: '1.8rem', height: '1.8rem' },
                                     '@media screen and (min-width: 1600px) and (max-width:1890px)':
                                    { width: '1.5rem', height: '1.5rem' },
                                }}
                              />
                            </span>
                          </div>
                        )}
                      </td>
                   </tr>
               ))}
             </tbody>
           </table>
         </div>  

         <div className="foot-med">
              <span>{filteredData.length} items</span>
          </div>   
         
           </div>

           <Modal
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={{ ...style, maxHeight: "80vh", overflowY: "auto" }}>
            {formData && (
              <form className="medpopup" onSubmit={handleSubmit}>
                <div className="add-headcancel">
                  <h4 className="add-header">Add New Medication</h4>
                  <HighlightOffIcon onClick={addbackchange}>
                    cancel
                  </HighlightOffIcon>
                </div>

                <div>
                  <span className="medadd">
                    <label className="add-head">GlobalId:</label>
                    <input value={formData.Globalid} disabled></input>
                  </span>
                  <span className="medadd">
                    <label className="add-head">SSN:</label>
                    <input value={formData.SSN} disabled></input>
                  </span>
                  <span className="medadd">
                    <label className="add-head">PatientName:</label>
                    <input value={formData.PatientName} disabled></input>
                  </span>
                  <span className="medadd">
                    <label className="add-head">DateOfBirth:</label>
                    <input
                      value={formatdate(formData.DateOfBirth)}
                      disabled
                    ></input>
                  </span>

                  <span className="medadd">
                    <label className="add-head">OnHold:</label>
                    <select
                      style={{ width: "40%" }}
                      value={formData.OnHold}
                      name="OnHold"
                      onChange={(e) =>
                        handleInputChange(e.target.value, "OnHold")
                      }
                      required
                    >
                      <option selected value="">
                        Select
                      </option>
                      <option value="Y">Y</option>
                      <option value="N">N</option>
                    </select>
                  </span>
                  <span className="medadd">
                    <label className="add-head">DateDispensedSQL:</label>
                   
                    <DatePicker
  selected={
    formData.DateDispensedSQL
      ? toZonedTime(parseISO(formData.DateDispensedSQL), timeZone)
      : null
  }
  onChange={(date) => handleDispenseChange(date, "DateDispensedSQL")}
  dateFormat="MM/dd/yyyy"
  placeholderText="Select a date"
  className="datemediadd"
  required
/>
                  </span>
                  <span className="medadd">
                   
                    <label className="add-head">Drug Name:</label>
      <Autocomplete
        options={drugnamelist}
        getOptionLabel={(option) => 
    // Handles both string and object cases for freeSolo
    typeof option === 'string' ? option : option.DrugName || ''
  }
       value={
  drugnamelist.find((option) => option.DrugName === formData.Drug_name) || 
  null // fallback for freeSolo text
}
      onChange={(event, newValue) => {
    handleInputChange(newValue ? newValue.DrugName : '', 'Drug_name');
  }}
  onInputChange={(event, newInputValue, reason) => {
        if (reason === "input") {
          fetchdrug(newInputValue);
          handleInputChange(newInputValue, "Drug_name");
        }
      }}
  
  freeSolo
  disableClearable
  forcePopupIcon={false} // Removes dropdown arrow
  
  filterOptions={(options, { inputValue }) => {
  if (!inputValue || inputValue.trim() === '') return [];

  const input = inputValue.toLowerCase();

  // Split options into "startsWith" and "includes"
  const startsWith = [];
  const includes = [];

  for (const option of options) {
    const name = option.DrugName.toLowerCase();
    if (name.startsWith(input)) {
      startsWith.push(option);
    } else if (name.includes(input)) {
      includes.push(option);
    }
  }

  return [...startsWith, ...includes];
}}

        renderInput={(params) => (
          <TextField
            {...params}
            // label="Drug Name"
            required
            variant="outlined"
           sx={{
            '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: '#949191', // Default outline
        borderRadius:0
      },
      '&:hover fieldset': {
        borderColor: 'black', // Hover outline
      },
      '&.Mui-focused fieldset': {
        borderColor: 'black', // Focused outline
      },
    },
    '& .MuiInputBase-root': {
      height: '32px',
      fontSize: '0.75rem',
      outlineColor:'none'
    },
    '& .MuiInputLabel-root': {
      fontSize: '1rem',
      top: '-8px',
    }
  }}
          />
        )}
        sx={{ width: 204 }}
      />

                  </span>

                  {errors.NdcNumber && (
                    <div style={{ color: "red", marginLeft: "10rem" }}>
                      {errors.NdcNumber}
                    </div>
                  )}
                  <span className="medadd">
                    <label className="add-head">Ndc Number:</label>
                    <input
                      type="text"
                      name="NdcNumber"
                      value={formData.NdcNumber}
                      onChange={(e) =>
                        handleInputChange(e.target.value, "NdcNumber")
                      }
                      required
                    />
                  </span>
                  {errors.QuantityDispensed && (
                    <div style={{ color: "red", marginLeft: "10rem" }}>
                      {errors.QuantityDispensed}
                    </div>
                  )}
                  <span className="medadd">
                    <label className="add-head">QuantityDispensed:</label>
                    <input
                      type="text"
                      name="QuantityDispensed"
                      value={formData.QuantityDispensed}
                      onChange={(e) =>
                        handleInputChange(e.target.value, "QuantityDispensed")
                      }
                      required
                    />
                  </span>
                  <span className="medadd">
                    <label className="add-head">Sig:</label>
                    <input
                      type="text"
                      name="sigs"
                      value={formData.sigs}
                      onChange={(e) =>
                        handleInputChange(e.target.value, "sigs")
                      }
                    />
                  </span>

                  <span className="medadd">
                   
                    <label className="add-head">Prescriber:</label>
      <Autocomplete
        options={provlist}
        getOptionLabel={(option) => 
    // Handles both string and object cases for freeSolo
    typeof option === 'string' ? option : option.Prescriber || ''
  }
        
       value={
  provlist.find((option) => option.Prescriber === formData.Prescriber) || 
  null // fallback for freeSolo text
}
      onChange={(event, newValue) => {
    handleInputChange(newValue ? newValue.Prescriber : '', 'Prescriber');
  }}
  onInputChange={(event, newInputValue, reason) => {
        if (reason === "input") {
          fetchprov(newInputValue);
          handleInputChange(newInputValue, "Prescriber");
        }
      }}
  
  freeSolo
  disableClearable
  forcePopupIcon={false} // Removes dropdown arrow
  
  filterOptions={(options, { inputValue }) => {
  if (!inputValue || inputValue.trim() === '') return [];

  const input = inputValue.toLowerCase();

  // Split options into "startsWith" and "includes"
  const startsWith = [];
  const includes = [];

  for (const option of options) {
    const name = option.Prescriber.toLowerCase();
    if (name.startsWith(input)) {
      startsWith.push(option);
    } else if (name.includes(input)) {
      includes.push(option);
    }
  }

  return [...startsWith, ...includes];
}}

        renderInput={(params) => (
          <TextField
            {...params}
            // label="Drug Name"
            required
            variant="outlined"
           sx={{
            '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: '#949191', // Default outline
        borderRadius:0
      },
      '&:hover fieldset': {
        borderColor: 'black', // Hover outline
      },
      '&.Mui-focused fieldset': {
        borderColor: 'black', // Focused outline
      },
    },
    '& .MuiInputBase-root': {
      height: '32px',
      fontSize: '0.75rem',
      outlineColor:'none'
    },
    '& .MuiInputLabel-root': {
      fontSize: '1rem',
      top: '-8px',
    }
  }}
          />
        )}
        sx={{ width: 204 }}
      />

                  </span>
                  <span className="medadd">
                    <label className="add-head">Pharmacy:</label>
                    <select
                      // value={formData.Pharmacy}
                      onChange={(e) => handleSelectChange(e.target.value)}
                      required
                    >
                      <option selected value="">
                        Select
                      </option>
                      <option value="ASH">Ashland</option>
                      <option value="BC">Augusta</option>
                      <option value="CEN">Maysvillepack</option>
                      <option value="FB">Flemingsburg</option>
                      <option value="GR">Grayson</option>
                      <option value="MH">Morehead</option>
                      <option value="MV">Maysville</option>
                      <option value="SS">Southshore</option>
                      <option value="TB">Tollesboro</option>
                      <option value="VB">Vanceburg</option>
                      <option value="Others">Others...</option>
                    </select>

                    {showOtherInput && (
                      <input
                        type="text"
                        // value={formData.Pharmacy}
                        onChange={(e) =>
                          handleInputChange(e.target.value, "Pharmacy")
                        }
                        placeholder="Enter pharmacy name"
                        required
                      />
                    )}
                  </span>
                </div>
                <div style={{ display: "flex", justifyContent: "end" }}>
                  {/* <button class="bookmarkBtn">
                    <span class="IconContainer">
                      <svg viewBox="0 0 384 512" height="0.9em" class="icon">
                        <path d="M0 48V487.7C0 501.1 10.9 512 24.3 512c5 0 9.9-1.5 14-4.4L192 400 345.7 507.6c4.1 2.9 9 4.4 14 4.4c13.4 0 24.3-10.9 24.3-24.3V48c0-26.5-21.5-48-48-48H48C21.5 0 0 21.5 0 48z"></path>
                      </svg>
                    </span>
                    <p class="text">Submit</p>
                  </button> */}
                  <button type="submit" className="submit-btn">
                    <i class="bi bi-bookmark-fill"></i><span style={{marginTop:'3px'}}>Submit</span></button>
                </div>
              </form>
            )}
          </Box>
        </Modal>

         <Modal
          open={showModal}
          onClose={() => setShowModal(false)}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style1}>
            <div className="pack-modal">
              <div className="pack-modalh">Confirm Delete</div>
              <div className="pack-modalp">Are you sure you want to review {selectedPMIDs.length} items?</div>
              <div className="pack-yesno">
                <button  onClick={handleDelete}>Yes</button>
                <button
                  onClick={() => setShowModal(false)}
                >
                  No
                </button>
              </div>
            </div>
          </Box>
        </Modal>

        <Modal
          open={showReviewModal}
          onClose={() => setShowReviewModal(false)}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style1}>
            <div className="pack-modal">
              <div className="pack-modalh">Confirm Review</div>
              <div className="pack-modalp">Are you sure you want to review {selectedPMIDs.length} items?</div>
              <div>
                {isYesLoadingPack && (
                  <div style={{ display: "flex", width: "70px", height: "70px" }}>
                  <img
                    src={loading}
                    alt="loading...."
                    className="loadinggif"
                  ></img>
                </div>
                )}
              </div>
              <div className="pack-yesno">
                <button  onClick={handleReview} disabled={isYesLoading}>
                  Yes
                </button>
                <button
                  onClick={() => setShowReviewModal(false)}
                  disabled={isYesLoading}
                >
                  No
                </button>
              </div>
            </div>
          </Box>
        </Modal>

        <Modal
          open={showReviewResultmodal}
          onClose={() => setShowReviewResultmodal(false)}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style2}>
             <div className="pack-confirmedh">Confirmed Review Items</div>
            <div className="pack-confirmedp">{packedItemsCount} Item(s) successfully updated </div>
            <div className="pack-confirmedbtn">
              <button  onClick={() => setShowReviewResultmodal(false)}>OK</button>
            </div>
          </Box>
        </Modal>

        <Modal
          open={showPackModal}
          onClose={() => setShowPackModal(false)}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style1}>
            <div className="pack-modal">
              <div className="pack-modalh">Confirm Pack</div>
              <div className="pack-modalp">Are you sure you want to Pack {selectedPMIDs.length} items?</div>
              <div>
                {isYesLoadingPack && (
                  <div style={{ display: "flex", width: "70px", height: "70px" }}>
                  <img
                    src={loading}
                    alt="loading...."
                    className="loadinggif"
                  ></img>
                </div>
                )}
              </div>
              <div className="pack-yesno">
                <button  onClick={handlePack} disabled={isYesLoadingPack}>
                  Yes{" "}
                </button>
                <button
                  onClick={() => setShowPackModal(false)}
                  disabled={isYesLoadingPack}
                >
                  No
                </button>
              </div>
            </div>
          </Box>
        </Modal>

        <Modal
          open={showPackResultmodal}
          onClose={() => setShowPackResultmodal(false)}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style2}>
            <div className="pack-confirmedh">Confirmed Packed Items</div>
            <div className="pack-confirmedp">{packedItemsCount} Item(s) successfully updated </div>
            <div className="pack-confirmedbtn">
              <button  onClick={() => setShowPackResultmodal(false)}>OK</button>
            </div>
          </Box>
        </Modal>

      </div>



    </div>
  );
}

export default Medilist;
