import React from "react";
import "./MedSnap.css";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import Pagination from "@mui/material/Pagination";
import DatePicker from "react-datepicker";
import { format, parseISO } from "date-fns";
import { fromZonedTime, toZonedTime } from "date-fns-tz";
import { useSelector, useDispatch } from "react-redux";
import { Modal, Paper } from "@mui/material";
import PushPinIcon from "@mui/icons-material/PushPin";
import { logout, setlibertyRow } from "../Redux/slice.js";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import image from "../Finallogin/img/image.png";
import pdf from "./img/pdf.png";
import mobile from './img/mobile.png';
import teleP from './img/call.png';
import { getPermissionsByRole } from "../Finallogin/GetPermission.js";


const BaseUrl = process.env.REACT_APP_API_BASE_URL;

const MedSnap = () => {
  const [tableData, setTableData] = useState([]);
  const [packedMedications, setPackedMedications] = useState([]);
  const [nonPackedMedications, setNonPackedMedications] = useState([]);
  const [spreview, setSpreview] = useState([]);
  const [headerTimeslot, setHeaderTimeslot] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [searchInputyes, setSearchInputyes] = useState("");
  const [searchInputno, setSearchInputno] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [filteredDatano, setFilteredDatano] = useState([]);
  const [patientDetails, setPatientDetails] = useState({
    DisplayName: "",
    PatientId: "",
    DateOfBirth: "",
    SSN: "",
  });
  const [currentPageYes, setCurrentPageYes] = useState(1);
  const [currentPageNo, setCurrentPageNo] = useState(1);
  const [sortColumnYes, setSortColumnYes] = useState("Drug_name");
  const [sortOrderYes, setSortOrderYes] = useState("asc");
  const [sortColumnNo, setSortColumnNo] = useState("Drug_name");
  const [sortOrderNo, setSortOrderNo] = useState("asc");
  const itemsPerPage = 5;
  const libertyrow = useSelector(
    (state) => state.PatientIdentifier.selectedLibertyRow
  );
  const [disableBtn, setdisableBtn] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const { token = null, tokenname = null } = useSelector(
    (state) => state.PatientIdentifier ?? {}
  );
  const Role = useSelector((state) => state.PatientIdentifier.Role);
  const permissions = getPermissionsByRole(Role)
  const isAllowtoPDF = permissions?.PDFPrint?.canPrint

  const RoleDesc = useSelector((state) => state.PatientIdentifier.RoleDesc);

  const location = useLocation();
  const PatientIdentifier = location.state?.PatientIdentifier || "";
  const navigate = useNavigate();
  const medrow = location.state?.row;
  const [isEditing, setIsEditing] = useState(false);
  const [editedValues, setEditedValues] = useState({});

  const [editedRowIndex, setEditedRowIndex] = useState(null);
  const dispatch = useDispatch();
  const style1 = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    height: "300px",
    width: "550px",
    bgcolor: "background.paper",
    boxShadow: 24,
    paddingTop: 2,
    paddingLeft: 4,
    paddingRight: 4,
    paddingBottom: 4,
  };
  const handleEdit = () => {
    setIsEditing(true);
    setEditedValues({ ...tableData });
  };

  const handleSave = async () => {
    try {
      console.log("test", tableData, editedValues);
      const updatedTableData = {
        ...tableData,
        ...editedValues,
        PatientIdentifier: tableData.PatientIdentifier,
        RecordModifiedBy: name,
      };
      setIsEditing(false);
      // Update the data on the server
      await axios.put(`${BaseUrl}/manual`, updatedTableData);

      await axios.put(`${BaseUrl}/datemanual`, updatedTableData);

      //   setTableData(response.data.data);
      setTableData(updatedTableData);
      setdisableBtn(editedValues.ActiveStatus === "Active" ? false : true);
      fetchmedlist();

      console.log("Data updated successfully", updatedTableData);
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

  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;;

  const handleLastPackDateChange = (date, index) => {
    console.log("needate", date);
    const formattedDate = date
      ? format(fromZonedTime(date, timeZone), "yyyy-MM-dd")
      : null; // Check if date is null
    const newDates = { ...tableData };
    setTableData(newDates);
    setEditedValues((prevState) => ({
      ...prevState,
      LastPackDate: formattedDate,
    }));
  };

  const handleNextPackDateChange = (date, index) => {
    const formattedDate = date
      ? format(fromZonedTime(date, timeZone), "yyyy-MM-dd")
      : null; // Check if date is null
    const newDates = { ...tableData };
    setTableData(newDates);
    setEditedValues((prevState) => ({
      ...prevState,
      NextPackDate: formattedDate,
    }));
  };

  const name = location.state?.name || "";
  const handlebackbtn = () => {
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
      }
      const view = location.state.currentView;

      navigate("/caldrvw", { state: { name, view } });
    } else {
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
      }
      navigate("/patientdet", { state: { name } });
    }
  };

  const [patientinfo, setPatientinfo] = useState([]);
  const handlegotokbtn = () => {
    console.log(PatientIdentifier, "medlist");
    // navigate(`/medilist/`, {state:{name,PatientIdentifier}})
    localStorage.setItem("data", JSON.stringify(patientinfo));
    navigate(`/medilist/`, {
      state: {
        name,
        PatientIdentifier,
        source: location.state?.source || "patient",
      },
    });
  };

  useEffect(() => {
    fetchmedlist();
  }, [PatientIdentifier]);

  useEffect(() => {
    fetchtimeslot();
    fetchmedispack();
  }, [PatientIdentifier]);

  const fetchreview = async () => {
    try {
      if (!token || !tokenname) {
        navigate("/");
        return;
      }

      const resp = await axios.get(
        `${BaseUrl}/review_sp/${PatientIdentifier}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSpreview(resp.data.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchreview();
  }, []);

  const fetchmedlist = async () => {
    try {
      if (!token || !tokenname) {
        navigate("/");
        return;
      }
      console.log("fetchmedlist", location.state?.PatientIdentifier);
      const resp = await axios.get(
        `${BaseUrl}/medsnap/${location.state?.PatientIdentifier}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = resp.data.data;

      setPatientDetails({
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

      setTableData({
        HomePharmarcy: data[0].HomePharmarcy,
        PackPharmarcy: data[0].PackPharmarcy,
        LastPackDate: data[0].LastPackDate,
        NextPackDate: data[0].NextPackDate,
        Notes: data[0].Notes,
        ActiveStatus: data[0].ActiveStatus,
        PatientIdentifier: data[0].PatientIdentifier,
        DaysUntilNextPack: data[0].DaysUntilNextPack
      });
      setPatientinfo(data[0]);
      dispatch(setlibertyRow(data[0]));
      setdisableBtn(data[0].ActiveStatus === "Active" ? false : true);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchtimeslot = async () => {
    try {
      if (!token || !tokenname) {
        navigate("/");
        return;
      }

      const headres = await axios.get(
        `${BaseUrl}/timeheadslot/${PatientIdentifier}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setHeaderTimeslot(headres.data.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchmedispack = async () => {
    try {
      if (!token || !tokenname) {
        navigate("/");
        return;
      }
      const resp = await axios.get(
        `${BaseUrl}/medispack/${PatientIdentifier}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const medications = resp.data.data;

      const packedmedyes = medications.filter((med) => med.IsPacked === "Yes");
      const packedmedno = medications.filter((med) => med.IsPacked === "No");

      setPackedMedications(packedmedyes);
      setNonPackedMedications(packedmedno);
    } catch (error) {
      console.error("Failed to fetch medications:", error);
    }
  };


  const handlenoteclick = (PatientIdentifier) => {
    localStorage.setItem("data", JSON.stringify(patientinfo));

    navigate(`/notes/`, {
      state: {
        name,
        PatientIdentifier,
        source: location.state?.source || "patient",
      },
    });
  };

  useEffect(() => {
    const filtered = packedMedications.filter((item) => {
      // Filter by fields other than date
      const otherFieldsMatch = [item.Drug_name].some(
        (term) =>
          term &&
          term.toString().toLowerCase().includes(searchInputyes.toLowerCase())
      );

      return otherFieldsMatch;
    });

    setFilteredData(filtered);
  }, [searchInputyes, packedMedications]);

  useEffect(() => {
    const filtered = nonPackedMedications.filter((item) => {
      // Filter by fields other than date
      const otherFieldsMatch = [item.Drug_name].some(
        (term) =>
          term &&
          term.toString().toLowerCase().includes(searchInputno.toLowerCase())
      );

      return otherFieldsMatch;
    });

    setFilteredDatano(filtered);
  }, [searchInputno, nonPackedMedications]);

  const totalPagesYes = Math.ceil(filteredData.length / itemsPerPage);
  const indexOfLastItemYes = currentPageYes * itemsPerPage;
  const indexOfFirstItemYes = indexOfLastItemYes - itemsPerPage;
  const currentItemsYes = filteredData.slice(
    indexOfFirstItemYes,
    indexOfLastItemYes
  );

  const totalPagesNo = Math.ceil(filteredDatano.length / itemsPerPage);
  const indexOfLastItemNo = currentPageNo * itemsPerPage;
  const indexOfFirstItemNo = indexOfLastItemNo - itemsPerPage;
  const currentItemsNo = filteredDatano.slice(
    indexOfFirstItemNo,
    indexOfLastItemNo
  );

  const sortData = () => {
    if (!sortColumnYes) return filteredData;
    const sortedData = [...filteredData].sort((a, b) => {
      const valueA = a[sortColumnYes]?.toString().toLowerCase() || "";
      const valueB = b[sortColumnYes]?.toString().toLowerCase() || "";

      if (valueA < valueB) return sortOrderYes === "asc" ? -1 : 1;

      if (valueA > valueB) return sortOrderYes === "asc" ? 1 : -1;

      return 0;
    });
    return sortedData;
  };

  const sortDataNo = () => {
    if (!sortColumnNo) return filteredDatano;
    const sortedData = [...filteredDatano].sort((a, b) => {
      const valueA = a[sortColumnNo]?.toString().toLowerCase() || "";
      const valueB = b[sortColumnNo]?.toString().toLowerCase() || "";

      if (valueA < valueB) return sortOrderNo === "asc" ? -1 : 1;

      if (valueA > valueB) return sortOrderNo === "asc" ? 1 : -1;

      return 0;
    });
    return sortedData;
  };

  const handleSortYes = (column) => {
    if (sortColumnYes === column) {
      setSortOrderYes(sortOrderYes === "asc" ? "desc" : "asc");
    } else {
      setSortColumnYes(column);
      setSortOrderYes("asc");
    }
  };

  const handleSortNo = (column) => {
    if (sortColumnNo === column) {
      setSortOrderNo(sortOrderNo === "asc" ? "desc" : "asc");
    } else {
      setSortColumnNo(column);
      setSortOrderNo("asc");
    }
  };

  const sortedPackedYes = sortColumnYes
    ? sortData(filteredData, sortColumnYes, sortOrderYes)
    : filteredData;
  const sortedPackedNo = sortColumnNo
    ? sortDataNo(filteredDatano, sortColumnNo, sortOrderNo)
    : filteredDatano;




  const formatdate = (date) => {
    // return (date?.split(' ')[0])
    if (!date) return "-";

    const [year, month, day] = date.split(" ")[0].split("-");
    return `${month}/${day}/${year}`;
  };

  const handleclrtext = () => {
    setEditedValues({ Notes: "" });
  };

  const { latestnotes } = location.state || {};

  const [pinvalue, setPinvalue] = useState([]);

  useEffect(() => {
    const fetchlatestpin = async () => {
      try {
        if (!token || !tokenname) {
          navigate("/");
          return;
        }
        const resp = await axios.get(
          `${BaseUrl}/latestpin/${PatientIdentifier}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setPinvalue(resp.data.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchlatestpin();
  }, [PatientIdentifier]);

  const [isEditingslot, setIsEditingslot] = useState(false);
  const [editedData, setEditedData] = useState({
    slots: {},
    quantities: {},
  });

  const [originalData, setOriginalData] = useState({
    slots: {},
    quantities: [],
  });

  const toggleEdit = () => {
    if (!isEditingslot) {
      // Start editing - initialize with current values
      const initialData = {
        slots: {
          TimeSlot1: headerTimeslot[0]?.TimeSlot1 || "",
          TimeSlot2: headerTimeslot[0]?.TimeSlot2 || "",
          TimeSlot3: headerTimeslot[0]?.TimeSlot3 || "",
          TimeSlot4: headerTimeslot[0]?.TimeSlot4 || "",
          PatientIdentifier: headerTimeslot[0]?.PatientIdentifier,
        },
        quantities: sortedPackedYes.map((item) => ({
          PMID: item.PMID,
          PatientIdentifier: item.PatientIdentifier,
          Drug_name: item.Drug_name,
          Quantity1: item.Quantity1 || "",
          Quantity2: item.Quantity2 || "",
          Quantity3: item.Quantity3 || "",
          Quantity4: item.Quantity4 || "",
        })),
      };
      

      // Save both as edited and original data
      setEditedData(initialData);
      setOriginalData(JSON.parse(JSON.stringify(initialData))); // Create deep copy
    }
    setIsEditingslot(!isEditingslot);
    setErrors({ slots: {}, quantities: {} });
  };



  const [errors, setErrors] = useState({ slots: {}, quantities: {} });

  // Your existing handlers remain the same
  const handleSlotChange = (field, value) => {
    const timeRegex = /^(0?[1-9]|1[0-2]):[0-5][0-9](AM|PM)$/i;
    const formattedValue = value.replace(/(am|pm)/gi, (match) =>
      match.toUpperCase()
    );

    setEditedData((prev) => ({
      ...prev,
      slots: { ...prev.slots, [field]: formattedValue },
    }));

    setErrors((prev) => ({
      ...prev,
      slots: {
        ...prev.slots,
        [field]: timeRegex.test(value)
          ? ""
          : "Invalid time format (HH:MM AM/PM)",
      },
    }));
  };

  // const handleQuantityChange = (rowIndex, field, value) => {
  //   if (value !== "" && !/^-?\d*\.?\d*$/.test(value)) {
  //     setErrors((prev) => ({
  //       ...prev,
  //       quantities: {
  //         ...prev.quantities,
  //         [`${rowIndex}-${field}`]: "Only numeric values allowed",
  //       },
  //     }));
  //     return;
  //   }

  //   setEditedData((prev) => ({
  //     ...prev,
  //     quantities: prev.quantities.map((row, idx) =>
  //       idx === rowIndex ? { ...row, [field]: value } : row
  //     ),
  //   }));

  //   setErrors((prev) => {
  //     const newErrors = { ...prev.quantities };
  //     delete newErrors[`${rowIndex}-${field}`];
  //     return { ...prev, quantities: newErrors };
  //   });
  // };

  const handleQuantityChange = (rowIndex, field, value) => {
  // Always update value so user can see/correct it
  setEditedData((prev) => ({
    ...prev,
    quantities: prev.quantities.map((row, idx) =>
      idx === rowIndex ? { ...row, [field]: value } : row
    ),
  }));

  // Validate input
  if (value !== "" && !/^-?\d*\.?\d*$/.test(value)) {
    setErrors((prev) => ({
      ...prev,
      quantities: {
        ...prev.quantities,
        [`${rowIndex}-${field}`]: "Only numeric values allowed",
      },
    }));
  } else {
    setErrors((prev) => {
      const newErrors = { ...prev.quantities };
      delete newErrors[`${rowIndex}-${field}`];
      return { ...prev, quantities: newErrors };
    });
  }
};


  const formatNumberOrNull = (value) => {
    if (value === "" || value === null || value === undefined) {
      return null;
    }
    const number = parseFloat(value);
    return isNaN(number) ? null : number;
  };


  const handleslotqtySave = async () => {
    try {
      // Check if slots have changed

      const timeRegex = /^(0?[1-9]|1[0-2]):[0-5][0-9](AM|PM)$/i;

      const validateTimeSlot = (time) => timeRegex.test(time);

      const defaultValues = {
        TimeSlot1: "8:00AM",
        TimeSlot2: "12:00PM",
        TimeSlot3: "4:00PM",
        TimeSlot4: "8:00PM",
      };

      const changedQuantities = editedData.quantities.filter((row, index) => {
        const originalRow = originalData.quantities[index];
        return ["Quantity1", "Quantity2", "Quantity3", "Quantity4"].some(
          (field) => row[field] !== originalRow[field]
        );
      });


      // Compare current slots with original slots
      const slotsChanged = Object.keys(defaultValues).some(
        (key) => editedData.slots[key] !== originalData.slots[key]
      );

      const invalidSlots = Object.keys(editedData.slots).filter(
        (key) => errors.slots[key]
      );

      const invalidQuantities = Object.keys(errors.quantities);

      if (invalidSlots.length > 0 || invalidQuantities.length > 0) {
        return;
      }

      if (slotsChanged) {
        const slotData = {
          PatientIdentifier: editedData.slots.PatientIdentifier,
          TimeSlot1: editedData.slots.TimeSlot1 || defaultValues.TimeSlot1,
          TimeSlot2: editedData.slots.TimeSlot2 || defaultValues.TimeSlot2,
          TimeSlot3: editedData.slots.TimeSlot3 || defaultValues.TimeSlot3,
          TimeSlot4: editedData.slots.TimeSlot4 || defaultValues.TimeSlot4,
          user: name,
        };

        try {
          await axios.post(`${BaseUrl}/spheaderslot`, slotData);
          // setTimeerr('');
        } catch (error) {
          console.error("Error updating time slots:", error);
        }
      }

      // Find quantities that actually changed

      // Save quantities only for rows that changed
      for (const row of changedQuantities) {
        const quantityData = {
          PMID: row.PMID,
          PatientIdentifier: row.PatientIdentifier,
          Drug_name: row.Drug_name,
          Quantity1: formatNumberOrNull(row.Quantity1),
          Quantity2: formatNumberOrNull(row.Quantity2),
          Quantity3: formatNumberOrNull(row.Quantity3),
          Quantity4: formatNumberOrNull(row.Quantity4),
          user: name,
        };
        console.log(quantityData,'search')

        await axios.post(`${BaseUrl}/spquantityslot`, quantityData);
      }

      // Reset editing state
      setIsEditingslot(false);
      setEditedData({ slots: {}, quantities: [] });
      setOriginalData({ slots: {}, quantities: [] });

      // Refresh data
      fetchreview();
      fetchtimeslot();
      fetchmedispack();
    } catch (error) {
      console.error("Error saving data:", error);
    }
  };

  const generatePDF = () => {
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

    const formatDOB = formatdate(patientDetails.DateOfBirth);

    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Compliance Packed Medications", 105, startYhead - 5, {
      align: "center",
    });

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
    doc.text(`${patientDetails.DisplayName}`, boxX + 34, boxY + 6);

    // Address
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text(`Address:`, boxX + 2, boxY + 12);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    const addressText = `${patientDetails.street}, ${patientDetails.city}, ${patientDetails.state}, ${patientDetails.zip}`;
    const addressLines = doc.splitTextToSize(addressText, boxWidth - 24);
    doc.text(addressLines, boxX + 20, boxY + 12);

    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text("Home Pharmacy:", boxX + 2, boxY + 18);
    doc.setFont("helvetica", "normal");
    doc.text(`${patientDetails.HomePharmarcy || 'N/A'}`, boxX + 35, boxY + 18);

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
    // doc.addImage(mobile,'PNG', box2X  , boxY + 8, 5, 5)
    doc.text(`Mobile # :`, box2X + 2, boxY + 12);
    doc.setFont("helvetica", "normal");
    doc.text(`${patientDetails.Phone}`, box2X + 22, boxY + 12);

    // Phone
    doc.setFont("helvetica", "bold");
    // doc.addImage(teleP,'PNG', box2X + 1 , boxY + 14, 4, 4)
    doc.text(`Home # :`, box2X + 2, boxY + 18);
    doc.setFont("helvetica", "normal");
    doc.text(`${patientDetails.Phone2}`, box2X + 22, boxY + 18);

    //  // Phone
    //  doc.setFont("helvetica", "bold");
    //  doc.addImage(mobile,'PNG', box2X + 1 , boxY + 8, 5, 5)
    //  doc.text(` # :`, box2X + 8, boxY + 12);
    //  doc.setFont("helvetica", "normal");
    //  doc.text(`${patientDetails.Phone}`, box2X + 16, boxY + 12);
 
    //  // Phone
    //  doc.setFont("helvetica", "bold");
    //  doc.addImage(teleP,'PNG', box2X + 1 , boxY + 14, 5, 5)
    //  doc.text(` # :`, box2X + 8 , boxY + 18);
    //  doc.setFont("helvetica", "normal");
    //  doc.text(`${patientDetails.Phone2}`, box2X + 16, boxY + 18);

    //  // Phone
    //  doc.setFont("helvetica", "bold");
    //  // doc.addImage(mobile,'PNG', box2X  , boxY + 8, 5, 5)
    //  doc.text(`Phone1 # :`, box2X + 2, boxY + 12);
    //  doc.setFont("helvetica", "normal");
    //  doc.text(`${patientDetails.Phone}`, box2X + 22, boxY + 12);
 
    //  // Phone
    //  doc.setFont("helvetica", "bold");
    //  doc.addImage(teleP,'PNG', box2X + 1 , boxY + 14, 4, 4)
    //  doc.text(`Phone2 # :`, box2X + 2, boxY + 18);
    //  doc.setFont("helvetica", "normal");
    //  doc.text(`${patientDetails.Phone2}`, box2X + 22, boxY + 18);

    // Update startYhead for subsequent content
    startYhead += boxHeight + 5; // Add some spacing after the box

    // Add Medication Table
    const tableColumnHeaders = [
      "Drug Name",
      "NDC",
      `${headerTimeslot[0]?.TimeSlot1 || "8:00AM"}`,
      `${headerTimeslot[0]?.TimeSlot1 || "8:00AM"}`,
      `${headerTimeslot[0]?.TimeSlot2 || "12:00PM"}`,
      `${headerTimeslot[0]?.TimeSlot3 || "4:00PM"}`,
      `${headerTimeslot[0]?.TimeSlot4 || "8:00PM"}`,
      "Directions",
      "Prescriber",
      // "Dosage Quantity"
    ];

    const filteredSortedData = sortData();

    const trimExtraSpaces = (str) => {
      return str.replace(/\s+/g, " ").trim();
    };

    const formatPrescriberName = (
      names,
      cellWidth = 27,
      fontSize = 12,
      charWidth = 2.5
    ) => {
      if (!names) return "";
      if (!names.includes(",")) return names; // No comma, return as is

      let parts = names.split(",").map((part) => part.trim()); // Split by comma and trim spaces

      if (parts.length < 2) return names; // Not a valid format

      let firstPart = parts[0]; // Last name
      let secondPart = parts.slice(1).join(" "); // Join remaining words

      // Estimate character limit based on cell width
      let maxChars = Math.floor(cellWidth / charWidth);

      if (firstPart.includes("-")) {
        let [beforeHyphen, afterHyphen] = firstPart.split("-");

        // If first name exceeds width, move the part after "-" to the next line
        if (firstPart.length > maxChars) {
          firstPart = `${beforeHyphen}-\n${afterHyphen}`;
        }
      }

      // Case 1: If second name has multiple words, move to next line
      if (secondPart.includes(" ")) {
        return `${firstPart},\n${secondPart}`;
      }

      // Case 2: If second name is too long for the cell, move to next line
      if (secondPart.length > maxChars) {
        return `${firstPart},\n${secondPart}`;
      }

      // Case 3: Name fits within the cell width, keep in one line
      return `${firstPart}, ${secondPart}`;
    };

    const tableRows = filteredSortedData.map((row) => [
      trimExtraSpaces(row.Drug_name),
      row.NdcNumber,
      row.Quantity1 === 0 ? "" : row.Quantity1,
      row.Quantity1 === 0 ? "" : row.Quantity1,
      row.Quantity2 === 0 ? "" : row.Quantity2,
      row.Quantity3 === 0 ? "" : row.Quantity3,
      row.Quantity4 === 0 ? "" : row.Quantity4,
      row.sigs,
      formatPrescriberName(row.Prescriber),
      // row.QuantityDispensed
    ]);

    // const tableStartY = phoneBoxY + phoneBoxHeight + 3;
    const tableStartY = boxY + boxHeight + 3;

    doc.autoTable({
      head: [tableColumnHeaders],
      body: tableRows,
      startY: tableStartY,
      margin: { left: 6.5 },
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
        fontSize: 8.7, // Optional: Customize header font size
        halign: "left", // Align text in the center of each header cell
        // valign: "middle", // Vertically align text in the middle of each header cell
        fontWeight: 600,
        overflow: "visible",
      },
      columnStyles: {
        0: { cellWidth: 34, halign: "left", fontSize: 8.5, fontWeight: 700 }, //num
        1: { cellWidth: 22 }, //num
        2: { cellWidth: 14, halign: "left" },
        3: { cellWidth: 14, halign: "left" },
        4: { cellWidth: 14, halign: "left" }, //num
        5: { cellWidth: 14, halign: "left" },
        6: { cellWidth: 14, halign: "left" },
        //  2: { cellWidth: 13, halign: "left" },
        // 3: { cellWidth: 13, halign: "left" },
        // 4: { cellWidth: 13, halign: "left" }, //num
        // 5: { cellWidth: 13, halign: "left" },
        // 6: { cellWidth: 13, halign: "left" },
        7: { cellWidth: 43 },
        8: { cellWidth: 27 },
        // 8: { cellWidth: 18 }
      },

      rowPageBreak: "avoid", // ✅ Prevents row splitting across pages

      didDrawPage: function (data) {
        const pageHeight = doc.internal.pageSize.height;
        const bottomMargin = 10; 
        const currentY = data.cursor.y;

        // ✅ Only add a page if there isn't enough space for the next row
        if (currentY + bottomMargin >= pageHeight) {
          doc.addPage();
          data.cursor.y = 10; // Reset for next table
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
    doc.save(`${patientDetails.DisplayName}_Compliance Packed Medications.pdf`);
  };

  const [isDataAvailable, setIsDataAvailable] = useState(false);

  useEffect(() => {
    setIsDataAvailable(sortData().length > 0);
  }, [sortData()]);

  const [isDataAvailableNP, setIsDataAvailableNP] = useState(false);

  useEffect(() => {
    setIsDataAvailableNP(sortDataNo().length > 0);
  }, [sortDataNo()]);

  const nonPackPDF = () => {
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

    const formatDOB = formatdate(patientDetails.DateOfBirth);

    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("NON-PACKED MEDICATION", 105, startYhead - 5, { align: "center" });
    startYhead += 6;

    const boxX = 15;
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
    doc.text(`${patientDetails.DisplayName}`, boxX + 34, boxY + 6);

    // Address
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text(`Address:`, boxX + 2, boxY + 12);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    const addressText = `${patientDetails.street}, ${patientDetails.city}, ${patientDetails.state}, ${patientDetails.zip}`;
    const addressLines = doc.splitTextToSize(addressText, boxWidth - 24);
    doc.text(addressLines, boxX + 20, boxY + 12);

    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text("Home Pharmacy:", boxX + 2, boxY + 18);
    doc.setFont("helvetica", "normal");
    doc.text(`${patientDetails.HomePharmarcy || 'N/A'}`, boxX + 35, boxY + 18);

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
    doc.text(`${patientDetails.Phone}`, box2X + 21, boxY + 12);

    doc.setFont("helvetica", "bold");
    doc.text(`Home # :`, box2X + 2, boxY + 18);
    doc.setFont("helvetica", "normal");
    doc.text(`${patientDetails.Phone2}`, box2X + 21, boxY + 18);

    // Update startYhead for subsequent content
    startYhead += boxHeight + 5; // Add some spacing after the box

    // Add Medication Table
    const tableColumnHeaders = [
      "Drug Name",
      "Directions",
      "Quantity",
      "Prescriber",
    ];

    const filteredSortedDatano = sortDataNo();

    const trimExtraSpaces = (str) => {
      return str.replace(/\s+/g, " ").trim();
    };

    const formatPrescriberName = (
      names,
      cellWidth = 27,
      fontSize = 12,
      charWidth = 2.5
    ) => {
      if (!names) return "";
      if (!names.includes(",")) return names; // No comma, return as is

      let parts = names.split(",").map((part) => part.trim()); // Split by comma and trim spaces

      if (parts.length < 2) return names; // Not a valid format

      let firstPart = parts[0]; // Last name
      let secondPart = parts.slice(1).join(" "); // Join remaining words

      // Estimate character limit based on cell width
      let maxChars = Math.floor(cellWidth / charWidth);

      if (firstPart.includes("-")) {
        let [beforeHyphen, afterHyphen] = firstPart.split("-");

        // If first name exceeds width, move the part after "-" to the next line
        if (firstPart.length > maxChars) {
          firstPart = `${beforeHyphen}-\n${afterHyphen}`;
        }
      }

      // Case 1: If second name has multiple words, move to next line
      if (secondPart.includes(" ")) {
        return `${firstPart},\n${secondPart}`;
      }

      // Case 2: If second name is too long for the cell, move to next line
      if (secondPart.length > maxChars) {
        return `${firstPart},\n${secondPart}`;
      }

      // Case 3: Name fits within the cell width, keep in one line
      return `${firstPart}, ${secondPart}`;
    };

    const tableRows = filteredSortedDatano.map((row) => [
      trimExtraSpaces(row.Drug_name),
      row.sigs,
      row.QuantityDispensed,
      formatPrescriberName(row.Prescriber),
    ]);

    // const tableStartY = phoneBoxY + phoneBoxHeight + 3;
    const tableStartY = boxY + boxHeight + 3;

    doc.autoTable({
      head: [tableColumnHeaders],
      body: tableRows,
      startY: tableStartY,
      margin: { left: 15 },
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
        0: { cellWidth: 55, halign: "left", fontSize: 8.5, fontWeight: 700 }, //num
        1: { cellWidth: 75, fontSize: 8.5, fontWeight: 700 }, //num
        2: { cellWidth: 18, fontSize: 8.5, fontWeight: 700 },
        3: { cellWidth: 27 }, //num
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
    doc.save(`${patientDetails.DisplayName}_Non-PackedMedicines.pdf`);
  };


  const daysToFill = tableData.DaysUntilNextPack ?? 0; // Replace this with your actual variable

  let displayDaysToFill = daysToFill < 10 ? '0' + daysToFill : String(daysToFill);


// Decide color based on the value
// let colorClass = '';
// if (daysToFill <= 7) {
//   colorClass = 'red';
// } else {
//   colorClass = 'green';
// }

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
                  Patient Dashboard View
                </h3>
              </ul>
            </div>
          </div>
          <div class="collapse navbar-collapse" id="navbarSupportedContent">
            <div style={{ marginRight: "10px" }}>
              <button
                onClick={handlegotokbtn}
                className="backsnap"
                disabled={disableBtn}
              >
                GoTo&nbsp;MedList
              </button>
            </div>
          </div>
        </nav>
      </div> */}

       <div className='nav-mainsnap' >
             <nav className='nav-mainsnap'>
                 <div className='snapnavbar-full'>
                   <div className='nav-leftsnap'>
                   <h4 className='h5-leftsnap' 
                   style={{display:'flex', marginLeft:'0.5rem', textAlign:'center', padding:'0.3rem', fontFamily:'Volkhov, serif'}}>
                       Hello, {name}{" "}
                       {RoleDesc &&
                       RoleDesc.toLowerCase() !== "null" &&
                       RoleDesc.trim() !== ""
                         ? `(${RoleDesc})`
                         : ""}
                     </h4>
                   </div>
                   
                   <div className='nav-middlesnap'>
                     <h4 className='h4-midsnap' style={{display:'flex', fontWeight:600}}>Patient Dashboard View</h4>
                   </div>
                 
                  <div className='nav-containersnap'>
                     <button className="snap-gobtn" onClick={handlegotokbtn} disabled={disableBtn}>GoTo&nbsp;MedList</button>
                   </div>
       
                 </div>
                </nav>
             </div>

             <div className="navbottom-snap">
               <div style={{ display: "flex"}}>
              <button onClick={handlebackbtn} class="backbutton-snap">
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


            <div className="snap-cards-main" >
              <div style={{width:'83%',marginLeft:'2.5rem'}}>
                 <div className="snap-card-rows1">
                <div className="snap-cards">
                  <div className="snapcard-pathead">
                       <i className="fas fa-user"></i>
                  <h6>Patient Name</h6>
                  </div>
                  <div className="snapcard-patname">{patientDetails.DisplayName}</div>
                </div>

                <div className="snap-cards">
                  <div className="snapcard-pathead">
                       <i className="fas fa-id-badge"></i>
                  <h6>Patient ID</h6>
                  </div>
                  <div className="snapcard-patname">{patientDetails.PatientId}</div>
                </div>

                <div className="snap-cards">
                  <div className="snapcard-pathead">
                       <i className="fas fa-calendar-alt"></i>
                  <h6>Date Of Birth</h6>
                  </div>
                  <div className="snapcard-patname">{patientDetails.DateOfBirth}</div>
                </div>

                <div className="snap-cards">
                  <div className="snapcard-pathead">
                       <i className="fas fa-id-card"></i>
                  <h6>SSN</h6>
                  </div>
                  <div className="snapcard-patname">{patientDetails.SSN}</div>
                </div>
              </div>


              <div className="snap-card-rows2">
                <div className="snap-cards">
                  <div className="snapcard-pathead">
                       <i className="fas fa-user-md"></i>
                  <h6>Provider Name</h6>
                  </div>
                  <div className="snapcard-patname">{patientDetails.ProviderName}</div>
                </div>

                <div className="snap-cards">
                  <div className="snapcard-pathead">
                       <i className="fas fa-calendar-alt"></i>
                  <h6>Next Appointment Date</h6>
                  </div>
                  <div className="snapcard-patname">{patientDetails.NextAppointmentDate}</div>
                </div>

                <div className="snap-cards">
                  <div className="snapcard-pathead">
                       <i className="fas fa-prescription-bottle-alt"></i>
                  <h6>Medi Assist</h6>
                  </div>
                  <div className="snapcard-patname">{patientDetails.MediAssist}</div>
                </div>

                <div className="snap-cards">
                  <div className="snapcard-pathead">
                       <i className="fas fa-prescription-bottle-alt"></i>
                  <h6>Modified By</h6>
                  </div>
                  <div className="snapcard-patname">{patientDetails.RecordModifiedBy}</div>
                </div>
              </div>
              </div>
                

                <div style={{width:'17%',display:'flex'}}>

                     <div className="snap-card-right">
                          <div className="snapcards-rightp">Days&nbsp;to&nbsp;fill until&nbsp;next&nbsp;pack</div>
                          <span className="snapcards-rights">{displayDaysToFill}</span>
                       </div>
                </div>


            </div>

            

            <div>
              <div className="patdet-card">
                <h6>Manage Patient Details</h6>
                <table className='snap-table'>
    <thead >
      <tr className='snaptable-head'>
      <th >Home Pharmacy</th>
                <th>Pack Pharmacy</th>
                <th>Last Pack Date</th>
                <th>Next Pack Date</th>
                <th className="notes-col-snap">Notes</th>
                <th>Active Status</th>
                <th className="snaptable-actionth">Action</th>
      </tr>
    </thead>
    <tbody>
       <tr className="snaptable-row">
                <td>
                  {isEditing ? (
                    <select
                      value={editedValues.HomePharmarcy}
                      onChange={(e) =>
                        handleInputChange("HomePharmarcy", e.target.value)
                      }
                    >
                      <option value="">All</option>
                      <option value="ASH">ASH</option>
                      <option value="BC">BC</option>
                      <option value="CEN">CEN</option>
                      <option value="FB">FB</option>
                      <option value="GR">GR</option>
                      <option value="MH">MH</option>
                      <option value="MV">MV</option>
                      <option value="SS">SS</option>
                      <option value="TB">TB</option>
                      <option value="VB">VB</option>
                    </select>
                  ) : tableData.HomePharmarcy === null ? (
                    "-"
                  ) : (
                    tableData.HomePharmarcy
                  )}
                </td>

                <td>
                  {isEditing ? (
                    <select
                      value={editedValues.PackPharmarcy}
                      onChange={(e) =>
                        handleInputChange("PackPharmarcy", e.target.value)
                      }
                    >
                      <option value="">All</option>
                      <option value="MH">MH</option>
                      <option value="MV">MV</option>
                      <option value="VB">VB</option>
                      <option value="SS">SS</option>
                    </select>
                  ) : tableData.PackPharmarcy === null ? (
                    "-"
                  ) : (
                    tableData.PackPharmarcy
                  )}
                </td>

                <td>
                  {isEditing ? (
                    <DatePicker
                     className="snap-calendar"
                      selected={
                        editedValues.LastPackDate
                          ? toZonedTime(
                              parseISO(editedValues.LastPackDate),
                              timeZone
                            )
                          : null
                      }
                      onChange={(date) =>
                        handleLastPackDateChange(date, "LastPackDate")
                      }
                      dateFormat="MM-dd-yyyy"
                    />
                  ) : (
                    formatdate(tableData.LastPackDate) || "-"
                  )}
                </td>
                <td>
                  {isEditing ? (
                    <DatePicker className="snap-calendar"
                      selected={
                        editedValues.NextPackDate
                          ? toZonedTime(
                              parseISO(editedValues.NextPackDate),
                              timeZone
                            )
                          : null
                      }
                      onChange={(date) =>
                        handleNextPackDateChange(date, "NextPackDate")
                      }
                      dateFormat="MM-dd-yyyy"
                    />
                  ) : (
                    formatdate(tableData.NextPackDate) || "-"
                  )}
                </td>

                <td className="notes-col-snap">
                  {tableData.Notes ? (
                    <div
                      onClick={() => {
                        if (!isEditing) {
                          handlenoteclick(tableData.PatientIdentifier);
                        }
                      }}
                      style={{
                        textDecoration: isEditing ? "none" : "underline",
                        color: "blue",
                        cursor: isEditing ? "not-allowed" : "pointer",
                        color: isEditing ? "gray" : "blue",
                      }}
                      className="overflow-text-snap"
                      title={tableData.Notes}
                    >
                      {tableData.Notes}
                    </div>
                  ) : (
                    <div
                      onClick={() => {
                        if (!isEditing) {
                          handlenoteclick(tableData.PatientIdentifier);
                        }
                      }}
                      style={{
                        textDecoration: isEditing ? "none" : "underline",
                        color: "blue",
                        cursor: isEditing ? "not-allowed" : "pointer",
                        color: isEditing ? "gray" : "blue",
                      }}
                      className="overflow-text-snap"
                      title={tableData.Notes}
                    >
                      Enter Notes
                    </div>
                  )}
                </td>
                <td>
                  {isEditing ? (
                    <select
                      name="ActiveStatus"
                      value={editedValues.ActiveStatus}
                      onChange={(e) =>
                        handleInputChange("ActiveStatus", e.target.value)
                      }
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  ) : (
                    tableData.ActiveStatus
                  )}
                </td>
                <td className="snaptable-actionth">
                  {isEditing ? (
                    <>
                      <button
                        style={{ marginRight: "10px" }}
                        onClick={handleSave}
                      >
                        Save
                      </button>
                      <button onClick={handleCancel}>X</button>
                    </>
                  ) : (
                    <>
                      <button class="editBtn-snap" disabled = {!permissions?.SnapPage?.patientEdit} onClick={() => handleEdit(null)}>
                        <svg height="1em" viewBox="0 0 512 512">
                          <path d="M410.3 231l11.3-11.3-33.9-33.9-62.1-62.1L291.7 89.8l-11.3 11.3-22.6 22.6L58.6 322.9c-10.4 10.4-18 23.3-22.2 37.4L1 480.7c-2.5 8.4-.2 17.5 6.1 23.7s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L387.7 253.7 410.3 231zM160 399.4l-9.1 22.7c-4 3.1-8.5 5.4-13.3 6.9L59.4 452l23-78.1c1.4-4.9 3.8-9.4 6.9-13.3l22.7-9.1v32c0 8.8 7.2 16 16 16h32zM362.7 18.7L348.3 33.2 325.7 55.8 314.3 67.1l33.9 33.9 62.1 62.1 33.9 33.9 11.3-11.3 22.6-22.6 14.5-14.5c25-25 25-65.5 0-90.5L453.3 18.7c-25-25-65.5-25-90.5 0zm-47.4 168l-144 144c-6.2 6.2-16.4 6.2-22.6 0s-6.2-16.4 0-22.6l144-144c6.2-6.2 16.4-6.2 22.6 0s6.2 16.4 0 22.6z"></path>
                        </svg>
                      </button>
                    </>
                  )}
                </td>
              </tr>
    </tbody>
  </table>
              </div>
            </div>

            <div className="snap-notepin">
              <div className="snap-pushi-h7" style={{width:'15%',gap:'10px',display:'flex'}}>
                 <PushPinIcon className="snap-pinicon" />
                 <h7 style={{ fontWeight: 700, }}>Latest Pinned Note: </h7>
              </div>
              <div style={{width:'82%'}}>
                 <div className="notes-pinsnap">{pinvalue[0]?.Notes}</div>
              </div>
            </div>

            <div className="snap-pack-nonpack">
              <div className="snap-reconcile">
                <div style={{display:'flex',width:'100%',paddingBottom:'3px'}}>
                  <div style={{width:'26%'}}></div>
                    <div className="snapreconcile-head">
                      Reconciled Medication List (Total: {packedMedications.length})
                      </div>
                 {Object.values(errors.slots).some((msg) => msg) ||
                Object.values(errors.quantities).some((msg) => msg) ? (
                  <div className="error-reconcile">
                    {Object.values(errors.slots).map(
                      (msg, idx) =>
                        msg && (
                          <p key={`slot-${idx}`} className="error-text">
                            {msg}
                          </p>
                        )
                    )}
                    {Object.values(errors.quantities).map(
                      (msg, idx) =>
                        msg && (
                          <p key={`qty-${idx}`} className="error-text">
                            {msg}
                          </p>
                        )
                    )}
                  </div>
                ) : null}
                </div>
               
                <div style={{width:'100%',display:'flex'}}>

                  <div style={{width:'20%'}}></div>
                  <div className="snap-reviewed">
                    <div className="snap-review-details">
                      <label>ReviewedBy:&nbsp;</label>
                      <span>{spreview[0]?.ReviewedBy || "-"}</span>
                    </div>
                    <div className="snap-review-details">
                      <label>ReviewedDate:&nbsp;</label>
                      <span>{formatdate(spreview[0]?.ReviewedDate) || "-"}</span>
                    </div>
                  </div>

                  <div className="snap-edit-pdfbtn">
                    <div style={{display:'flex',gap:'8px'}}>
                      {isEditingslot ? (
                      <>
                        {" "}
                        <button className="savex-reconcile"
                          onClick={handleslotqtySave}
                        >
                          Save
                        </button>
                        <button className="xsave-reconcile" onClick={toggleEdit}>X</button>
                      </>
                    ) : (
                      <button
                        onClick={toggleEdit}
                        className="editBtn-reconcile"
                        disabled={!permissions?.SnapPage?.timeslotsEdit}
                      >
                        <svg height="1em" viewBox="0 0 512 512">
                          <path d="M410.3 231l11.3-11.3-33.9-33.9-62.1-62.1L291.7 89.8l-11.3 11.3-22.6 22.6L58.6 322.9c-10.4 10.4-18 23.3-22.2 37.4L1 480.7c-2.5 8.4-.2 17.5 6.1 23.7s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L387.7 253.7 410.3 231zM160 399.4l-9.1 22.7c-4 3.1-8.5 5.4-13.3 6.9L59.4 452l23-78.1c1.4-4.9 3.8-9.4 6.9-13.3l22.7-9.1v32c0 8.8 7.2 16 16 16h32zM362.7 18.7L348.3 33.2 325.7 55.8 314.3 67.1l33.9 33.9 62.1 62.1 33.9 33.9 11.3-11.3 22.6-22.6 14.5-14.5c25-25 25-65.5 0-90.5L453.3 18.7c-25-25-65.5-25-90.5 0zm-47.4 168l-144 144c-6.2 6.2-16.4 6.2-22.6 0s-6.2-16.4 0-22.6l144-144c6.2-6.2 16.4-6.2 22.6 0s6.2 16.4 0 22.6z"></path>
                        </svg>
                      </button>
                    )}
                    </div>

                    <div>
                      <img
                      src={pdf}
                      className={`pdfdown ${
                        !isDataAvailable || !isAllowtoPDF ? "disabled" : ""
                      }`}
                      onClick={() => {
                        if (isDataAvailable && isAllowtoPDF) {
                          generatePDF();
                        }
                      }}
                    ></img>
                    </div>
                  </div>
                </div>

                <div className='tablescroll-snapreconcile'>
          <table className='snapreconcile-table'>
                <thead >
                  <tr className='snapreconciletable-head'>
                    <th
                    onClick={
                      !isEditingslot
                        ? () => handleSortYes("Drug_name")
                        : undefined
                    }
                  >
                    Drug Name
                    <span
                      style={{
                        cursor: isEditingslot ? "not-allowed" : "pointer",
                        opacity: isEditingslot ? 0.5 : 1,
                      }}
                    >
                      {sortColumnYes === "Drug_name" &&
                        (sortOrderYes === "asc" ? "▲" : "▼")}
                    </span>
                  </th>
                  <th>Sig</th>

                  {["TimeSlot0","TimeSlot1", "TimeSlot2", "TimeSlot3", "TimeSlot4"].map(
                    (slot, index) => {
                      const defaultValues = {
                        TimeSlot0: "7:00AM",
                        TimeSlot1: "8:00AM",
                        TimeSlot2: "12:00PM",
                        TimeSlot3: "4:00PM",
                        TimeSlot4: "8:00PM",
                      };

                      return (
                        <th key={index} className="slot-input">
                          {isEditingslot ? (
                            <input
                              type="text"
                              size="4"
                              value={
                                editedData.slots[slot] || defaultValues[slot]
                              }
                              onChange={(e) =>
                                handleSlotChange(slot, e.target.value)
                              }
                              className="slot-input"
                            />
                          ) : (
                            headerTimeslot[0]?.[slot] || defaultValues[slot]
                          )}
                        </th>
                      );
                    }
                  )}
      </tr>
    </thead>
    <tbody>
       {sortedPackedYes.map((item, rowIndex) => (
                  <tr key={rowIndex} className="snapreconciletable-row">
                    <td>
                      <div
                        className={
                          item.Drug_name && item.Drug_name.length > 300
                            ? "snapwrap_drug"
                            : "snapwrap1_drug"
                        }
                      >
                        {item.Drug_name}
                      </div>
                    </td>
                    <td title={item.sigs}  >
                      <div className={
                          item.sigs && item.sigs.length > 280
                            ? "snapwrap"
                            : "snapwrap1"
                        }
                       
                      >
                        {item.sigs}
                      </div>
                    </td>

                    {["Quantity0","Quantity1", "Quantity2", "Quantity3", "Quantity4"].map(
                      (field, colIndex) => (
                        <td key={colIndex}>
                          {isEditingslot ? (
                            <input
                              type="text"
                              size="3"
                              value={
                                editedData.quantities[rowIndex]?.[field] || ""
                              }
                              onChange={(e) =>
                                handleQuantityChange(
                                  rowIndex,
                                  field,
                                  e.target.value
                                )
                              }
                              className="quantity-input"
                            />
                          ) : (
                            item[field] || ""
                          )}
                        </td>
                      )
                    )}
                  </tr>
                ))}
    </tbody>
  </table>
               </div>

              </div>

              <div className="snap-nonpack">
                <div>
                      <div className="snaphead-nonpack">
                        Non Packed Medication List (Total: {nonPackedMedications.length})
                      </div>
                      <div style={{display:'flex',justifyContent:'end',marginRight:'3rem'}}>
                        <img
                src={pdf}
                className={`pdfdown1 ${!isDataAvailableNP ? "disabled" : ""}`}
                onClick={() => {
                  if (isDataAvailableNP) {
                    nonPackPDF();
                  }
                }}
              ></img>
                      </div>
                </div>
                  
                  <div className='tablescroll-snapnonpack'>
                  <table className='snapnonpack-table'>
                    <thead >
                  <tr className='snapnonpacktable-head'>
                          <th
                    style={{ marginLeft: "20px" }}
                    onClick={() => handleSortNo("Drug_name")}
                  >
                    Drug Name
                    {sortColumnNo === "Drug_name" &&
                      (sortOrderNo === "asc" ? "▲" : "▼")}
                  </th>
                        </tr>
                      </thead>
                      <tbody>
                        {sortedPackedNo.map((item, index) => (
                  <tr key={index} className="snapnonpacktable-row">
                    <td>{item.Drug_name}</td>
                  </tr>
                ))}
                      </tbody>
                    </table>
                  </div>

              </div>
            </div>

             </div>

      {/* <div className="container1">
        <div style={{display:'flex'}}>
          <div style={{width:'100%'}}>
          <div className="row">
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
            <div className="card">
              <h3>
                <i className="fas fa-user"></i> Patient Name
              </h3>
              <p>{patientDetails.DisplayName}</p>
            </div>
            <div className="card">
              <h3>
                <i className="fas fa-id-badge"></i>Patient ID
              </h3>
              <p>{patientDetails.PatientId}</p>
            </div>
            <div className="card">
              <h3>
                <i className="fas fa-calendar-alt"></i>Date Of Birth
              </h3>
              <p>{formatdate(patientDetails.DateOfBirth)}</p>
            </div>
            <div className="card">
              <h3>
                <i className="fas fa-id-card"></i>SSN
              </h3>
              <p>{patientDetails.SSN}</p>
            </div>
          </div>

          <div className="row">
            <div className="card">
              <h3>
                <i className="fas fa-user-md"></i>Provider Name
              </h3>
              <p>{patientDetails.ProviderName}</p>
            </div>

            <div className="card">
              <h3>
                <i className="fas fa-calendar-alt"></i>Next Appointment Date
              </h3>
              <p>{formatdate(patientDetails?.NextAppointmentDate)}</p>
            </div>

            <div className="card">
              <h3>
                <i className="fas fa-prescription-bottle-alt"></i>Medi Assist
              </h3>
              <p>{patientDetails.MediAssist}</p>
            </div>

            <div className="card">
              <h3>
                <i className="fas fa-prescription-bottle-alt"></i>Modified By
              </h3>
              <p>{patientDetails.RecordModifiedBy}</p>
            </div>
          </div>
          </div>


          <div className="card1_mq" 
          >
    <div className={`card1`}>
      <p style={{fontWeight:'bold'}}
      >
  Days&nbsp;to&nbsp;fill until&nbsp;next&nbsp;pack
  <br />
  <span  
  style={{ fontWeight: 'bold', fontSize: '26px' }}>
    {displayDaysToFill}
    </span>
</p>
    </div>
  </div>
        </div>

        <div className="table-container patient-edit">
          <h3 className="table-heading">Manage Patient Details</h3>
          <table className="dashboard-table" id="patient-edit-table">
            <thead>
              <tr>
                <th className="col-snap">Home Pharmacy</th>
                <th className="col-snap">Pack Pharmacy</th>
                <th className="col-snap">Last Pack Date</th>
                <th className="col-snap">Next Pack Date</th>
                <th className="col-snapnote">Notes</th>
                <th className="col-snap">Active Status</th>
                <th className="col-snapaction">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  {isEditing ? (
                    <select
                      value={editedValues.HomePharmarcy}
                      onChange={(e) =>
                        handleInputChange("HomePharmarcy", e.target.value)
                      }
                    >
                      <option value="">All</option>
                      <option value="ASH">ASH</option>
                      <option value="BC">BC</option>
                      <option value="CEN">CEN</option>
                      <option value="FB">FB</option>
                      <option value="GR">GR</option>
                      <option value="MH">MH</option>
                      <option value="MV">MV</option>
                      <option value="SS">SS</option>
                      <option value="TB">TB</option>
                      <option value="VB">VB</option>
                    </select>
                  ) : tableData.HomePharmarcy === null ? (
                    "-"
                  ) : (
                    tableData.HomePharmarcy
                  )}
                </td>

                <td>
                  {isEditing ? (
                    <select
                      value={editedValues.PackPharmarcy}
                      onChange={(e) =>
                        handleInputChange("PackPharmarcy", e.target.value)
                      }
                    >
                      <option value="">All</option>
                      <option value="MH">MH</option>
                      <option value="MV">MV</option>
                      <option value="VB">VB</option>
                      <option value="SS">SS</option>
                    </select>
                  ) : tableData.PackPharmarcy === null ? (
                    "-"
                  ) : (
                    tableData.PackPharmarcy
                  )}
                </td>

                <td>
                  {isEditing ? (
                    <DatePicker
                     className="snap-calendar"
                      selected={
                        editedValues.LastPackDate
                          ? toZonedTime(
                              parseISO(editedValues.LastPackDate),
                              timeZone
                            )
                          : null
                      }
                      onChange={(date) =>
                        handleLastPackDateChange(date, "LastPackDate")
                      }
                      dateFormat="MM-dd-yyyy"
                    />
                  ) : (
                    formatdate(tableData.LastPackDate) || "-"
                  )}
                </td>
                <td>
                  {isEditing ? (
                    <DatePicker
                      selected={
                        editedValues.NextPackDate
                          ? toZonedTime(
                              parseISO(editedValues.NextPackDate),
                              timeZone
                            )
                          : null
                      }
                      onChange={(date) =>
                        handleNextPackDateChange(date, "NextPackDate")
                      }
                      dateFormat="MM-dd-yyyy"
                    />
                  ) : (
                    formatdate(tableData.NextPackDate) || "-"
                  )}
                </td>

                <td>
                  {tableData.Notes ? (
                    <div
                      onClick={() => {
                        if (!isEditing) {
                          handlenoteclick(tableData.PatientIdentifier);
                        }
                      }}
                      style={{
                        textDecoration: isEditing ? "none" : "underline",
                        color: "blue",
                        cursor: isEditing ? "not-allowed" : "pointer",
                        color: isEditing ? "gray" : "blue",
                      }}
                      className="overflow-text"
                      title={tableData.Notes}
                    >
                      {tableData.Notes}
                    </div>
                  ) : (
                    <div
                      onClick={() => {
                        if (!isEditing) {
                          handlenoteclick(tableData.PatientIdentifier);
                        }
                      }}
                      style={{
                        textDecoration: isEditing ? "none" : "underline",
                        color: "blue",
                        cursor: isEditing ? "not-allowed" : "pointer",
                        color: isEditing ? "gray" : "blue",
                      }}
                      className="overflow-text"
                      title={tableData.Notes}
                    >
                      Enter Notes
                    </div>
                  )}
                </td>
                <td>
                  {isEditing ? (
                    <select
                      name="ActiveStatus"
                      value={editedValues.ActiveStatus}
                      onChange={(e) =>
                        handleInputChange("ActiveStatus", e.target.value)
                      }
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  ) : (
                    tableData.ActiveStatus
                  )}
                </td>
                <td>
                  {isEditing ? (
                    <>
                      <button
                        style={{ marginRight: "10px" }}
                        onClick={handleSave}
                      >
                        Save
                      </button>
                      <button onClick={handleCancel}>X</button>
                    </>
                  ) : (
                    <>
                      <button class="editBtn" disabled = {!permissions?.SnapPage?.patientEdit} onClick={() => handleEdit(null)}>
                        <svg height="1em" viewBox="0 0 512 512">
                          <path d="M410.3 231l11.3-11.3-33.9-33.9-62.1-62.1L291.7 89.8l-11.3 11.3-22.6 22.6L58.6 322.9c-10.4 10.4-18 23.3-22.2 37.4L1 480.7c-2.5 8.4-.2 17.5 6.1 23.7s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L387.7 253.7 410.3 231zM160 399.4l-9.1 22.7c-4 3.1-8.5 5.4-13.3 6.9L59.4 452l23-78.1c1.4-4.9 3.8-9.4 6.9-13.3l22.7-9.1v32c0 8.8 7.2 16 16 16h32zM362.7 18.7L348.3 33.2 325.7 55.8 314.3 67.1l33.9 33.9 62.1 62.1 33.9 33.9 11.3-11.3 22.6-22.6 14.5-14.5c25-25 25-65.5 0-90.5L453.3 18.7c-25-25-65.5-25-90.5 0zm-47.4 168l-144 144c-6.2 6.2-16.4 6.2-22.6 0s-6.2-16.4 0-22.6l144-144c6.2-6.2 16.4-6.2 22.6 0s6.2 16.4 0 22.6z"></path>
                        </svg>
                      </button>
                    </>
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div style={{ marginTop: "10px" }}>
          <Paper elevation={3} className="paper-pin">
            <div className="pin-head">
              <PushPinIcon className="snap-pinicon" />
              <h7 style={{ fontWeight: 600 }}>Latest Pinned Note: </h7>
            </div>
            <div className="notes-pinsnap">{pinvalue[0]?.Notes}</div>
          </Paper>
        </div>
        <div className="tables">
          <div className="dashboardtable">
            <div>
              <span
                style={{ display: "flex", gap: "40px", marginLeft: "15rem" }}
              >
                <h5>
                  Reconciled Medication List (Total: {packedMedications.length})
                </h5>
                {Object.values(errors.slots).some((msg) => msg) ||
                Object.values(errors.quantities).some((msg) => msg) ? (
                  <div className="error-container">
                    {errors.slots?.row && (
  <p className="error-text">{errors.slots.row}</p>
)}

 

{Object.values(errors.quantities).some((msg) => msg) && (
  <p className="error-text">Only numeric values allowed</p>
)}
                  </div>
                ) : null}
              </span>
              <div className="review1">
                <div className="reviewby">
                  <label>ReviewedBy:</label>
                  <span className="reviewed">
                    {spreview[0]?.ReviewedBy || "-"}
                  </span>
                  <label>ReviewedDate:</label>
                  <span className="reviewed">
                    {formatdate(spreview[0]?.ReviewedDate) || "-"}
                  </span>
                </div>

                <div style={{ display: "flex", gap: "40px" }}>
                  <button
                    style={{
                      marginLeft: "30px",
                      background: "none",
                      border: "none",
                    }}
                  >
                    {isEditingslot ? (
                      <>
                        {" "}
                        <button
                          style={{ marginRight: "10px" }}
                          onClick={handleslotqtySave}
                        >
                          Save
                        </button>
                        <button onClick={toggleEdit}>X</button>
                      </>
                    ) : (
                      <button
                        onClick={toggleEdit}
                        className="editBtn1"
                        disabled={!permissions?.SnapPage?.timeslotsEdit}
                      >
                        <svg height="1em" viewBox="0 0 512 512">
                          <path d="M410.3 231l11.3-11.3-33.9-33.9-62.1-62.1L291.7 89.8l-11.3 11.3-22.6 22.6L58.6 322.9c-10.4 10.4-18 23.3-22.2 37.4L1 480.7c-2.5 8.4-.2 17.5 6.1 23.7s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L387.7 253.7 410.3 231zM160 399.4l-9.1 22.7c-4 3.1-8.5 5.4-13.3 6.9L59.4 452l23-78.1c1.4-4.9 3.8-9.4 6.9-13.3l22.7-9.1v32c0 8.8 7.2 16 16 16h32zM362.7 18.7L348.3 33.2 325.7 55.8 314.3 67.1l33.9 33.9 62.1 62.1 33.9 33.9 11.3-11.3 22.6-22.6 14.5-14.5c25-25 25-65.5 0-90.5L453.3 18.7c-25-25-65.5-25-90.5 0zm-47.4 168l-144 144c-6.2 6.2-16.4 6.2-22.6 0s-6.2-16.4 0-22.6l144-144c6.2-6.2 16.4-6.2 22.6 0s6.2 16.4 0 22.6z"></path>
                        </svg>
                      </button>
                    )}
                  </button>
                  <div>
                    <img
                      src={pdf}
                      className={`pdfdown ${
                        !isDataAvailable || !isAllowtoPDF ? "disabled" : ""
                      }`}
                      onClick={() => {
                        if (isDataAvailable && isAllowtoPDF) {
                          generatePDF();
                        }
                      }}
                    ></img>
                  </div>
                </div>
              </div>
            </div>

            <table className="tablesnap">
              <thead className="nonpack-thead">
                <tr className="rowsnap">
                  <th
                    onClick={
                      !isEditingslot
                        ? () => handleSortYes("Drug_name")
                        : undefined
                    }
                  >
                    Drug Name
                    <span
                      style={{
                        cursor: isEditingslot ? "not-allowed" : "pointer",
                        opacity: isEditingslot ? 0.5 : 1,
                      }}
                    >
                      {sortColumnYes === "Drug_name" &&
                        (sortOrderYes === "asc" ? "▲" : "▼")}
                    </span>
                  </th>
                  <th>Sig</th>

                  {["TimeSlot0","TimeSlot1", "TimeSlot2", "TimeSlot3", "TimeSlot4"].map(
                    (slot, index) => {
                      const defaultValues = {
                        TimeSlot0: "7:00AM",
                        TimeSlot1: "8:00AM",
                        TimeSlot2: "12:00PM",
                        TimeSlot3: "4:00PM",
                        TimeSlot4: "8:00PM",
                      };

                      return (
                        <th key={index} className="slot-input">
                          {isEditingslot ? (
                            <input
                              type="text"
                              size="4"
                              value={
                                editedData.slots[slot] || defaultValues[slot]
                              }
                              onChange={(e) =>
                                handleSlotChange(slot, e.target.value)
                              }
                              className="slot-input"
                            />
                          ) : (
                            headerTimeslot[0]?.[slot] || defaultValues[slot]
                          )}
                        </th>
                      );
                    }
                  )}
                </tr>
              </thead>
              <tbody>
                {sortedPackedYes.map((item, rowIndex) => (
                  <tr key={rowIndex} className="rowsnap">
                    <td>
                      <div
                        className={
                          item.Drug_name && item.Drug_name.length > 300
                            ? "snapwrap"
                            : "snapwrap1"
                        }
                      >
                        {item.Drug_name}
                      </div>
                    </td>
                    <td title={item.sigs}>
                      <div
                        className={
                          item.sigs && item.sigs.length > 300
                            ? "snapwrap"
                            : "snapwrap1"
                        }
                      >
                        {item.sigs}
                      </div>
                    </td>

                    {["Quantity0","Quantity1", "Quantity2", "Quantity3", "Quantity4"].map(
                      (field, colIndex) => (
                        <td key={colIndex}>
                          {isEditingslot ? (
                            <input
                              type="text"
                              size="3"
                              value={
                                editedData.quantities[rowIndex]?.[field] || ""
                              }
                              onChange={(e) =>
                                handleQuantityChange(
                                  rowIndex,
                                  field,
                                  e.target.value
                                )
                              }
                              className="quantity-input"
                            />
                          ) : (
                            item[field] || ""
                          )}
                        </td>
                      )
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="dashboardtable1">
            <span>
              {" "}
              <h5 style={{ marginBottom: "10px" }}>
                Non Packed Medication List (Total: {nonPackedMedications.length}
                )
              </h5>
              <img
                src={pdf}
                className={`pdfdown1 ${!isDataAvailableNP ? "disabled" : ""}`}
                onClick={() => {
                  if (isDataAvailableNP) {
                    nonPackPDF();
                  }
                }}
              ></img>
            </span>

            <table className="tablesnap-nonpack">
              <thead className="nonpack-heading">
                <tr className="rowsnap-nonpack">
                  <th
                    style={{ marginLeft: "20px" }}
                    onClick={() => handleSortNo("Drug_name")}
                  >
                    Drug Name
                    {sortColumnNo === "Drug_name" &&
                      (sortOrderNo === "asc" ? "▲" : "▼")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {sortedPackedNo.map((item, index) => (
                  <tr key={index} className="rowsnap-nonpack">
                    <td>{item.Drug_name}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div> */}
    </div>
  );
};

export default MedSnap;
