import React, { useState, useEffect, useRef } from "react";
import Navbar from "./Navbar";
import "./LibertyAll.css";
import axios from "axios";
import Pagination from "@mui/material/Pagination";
import "react-datepicker/dist/react-datepicker.css";
// import DatePicker from 'react-datepicker';
import { format } from "date-fns";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import Loader from "./Loader";
import HomeIcon from "@mui/icons-material/Home";
import poweroff from "./img/poweroff.png";
import { logout } from "../Redux/slice.js";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import image from "../Finallogin/img/image.png";
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import pdf from "./img/pdf.png";
import { getPermissionsByRole } from "../Finallogin/GetPermission.js";

const BaseUrl = process.env.REACT_APP_API_BASE_URL;

function LibertyAll() {
  const [tableDatalib, setTableDatalib] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const itemsPerPage = 15;
  const [searchInput, setSearchInput] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const location = useLocation();
  const name = location.state?.name;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [sortColumn, setSortColumn] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const PatientIdentifier = location.state?.PatientIdentifier || "";
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

  const liballrow = useSelector(
    (state) => state.PatientIdentifier.selectedLibertyRow
  );
  const [liballform, setliballform] = useState([]);
  console.log(liballform,'pat')

  useEffect(() => {
    const data = liballrow || JSON.parse(localStorage.getItem("data"));
    setliballform((prevFormData) => ({
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
      HomePharmarcy: data.HomePharmarcy,
      Phone2: data.Phone2
    }));
    // }
  }, [liballrow]);

  const [patinfo, setPatinfo] = useState([]);

  const fetchpatlist = async () => {
    try {
      if (!token || !tokenname) {
        navigate("/");
        return;
      }
      const resp = await axios.get(
        `${BaseUrl}/medsnap/${location.state?.PatientIdentifier}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = resp.data.data;

      setPatinfo({
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

  useEffect(() => {
    const fetchdatalib = async () => {
      try {
        if (!token || !tokenname) {
          navigate("/");
          return;
        }
        const resp = await axios.get(
          `${BaseUrl}/libgetall/${location.state?.PatientIdentifier}`,
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

    const [year, month, day] = date.split("-");
    return `${month}/${day}/${year}`;
  };

  const [showDatePicker, setShowDatePicker] = useState(false);
  const initidaldaterange = [
    {
      startDate: null,
      endDate: null,
      key: "selection",
    },
  ];

  const [dateRange, setDateRange] = useState(initidaldaterange);

  const [startPlaceholder, setStartPlaceholder] = useState("StartDate");
  const [endPlaceholder, setEndPlaceholder] = useState("EndDate");
  const [isFilterApplied, setIsFilterApplied] = useState(false);
  const previousDateRange = useRef(initidaldaterange);
  const previousStartPlaceholder = useRef("StartDate");
  const previousEndPlaceholder = useRef("EndDate");
  const [tempDateRange, setTempDateRange] = useState(initidaldaterange);

  const getUTCStartOfDay = (date) => {
    if (!date) return null;
    const utcDate = new Date(
      Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0)
    );
    return utcDate;
  };

  // Helper function to get UTC end of day
  const getUTCEndOfDay = (date) => {
    if (!date) return null;
    const utcDate = new Date(
      Date.UTC(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        23,
        59,
        59,
        999
      )
    );
    return utcDate;
  };

  const handleDateSelect = (ranges) => {
    const selection = ranges.selection;
    console.log("selection", selection);
    // Update temp date range
    setDateRange([
      {
        startDate: selection.startDate,
        endDate: selection.endDate ?? selection.startDate, // Use startDate as endDate for single date selection
        key: "selection",
      },
    ]);

    // Update placeholders with local dates
    if (selection.startDate) {
      setStartPlaceholder(selection.startDate.toLocaleDateString());
      const today = new Date();
      const formattedDate = today.toLocaleDateString();
      console.log("gg", today, formattedDate);
      setEndPlaceholder(formattedDate);
    } else {
      setStartPlaceholder("StartDate");
    }
    //  Ensure End Date Placeholder Stays Empty Until Selected
    if (selection.endDate && !isNaN(new Date(selection.endDate))) {
      setEndPlaceholder(selection.endDate.toLocaleDateString());
    } else {
      const today = new Date();
      const formattedDate = today.toLocaleDateString();
      setEndPlaceholder(formattedDate);
      setEndPlaceholder("EndDate"); // Keep it empty instead of showing "EndDate"
    }
  };

  const formatdaterange = (date) => {
    if (!date) return "-";

    if (date instanceof Date && !isNaN(date)) {
      const month = (date.getUTCMonth() + 1).toString().padStart(2, "0"); // Month is 0-based
      const day = date.getUTCDate().toString().padStart(2, "0");
      const year = date.getUTCFullYear();
      return `${month}/${day}/${year}`; // MM/DD/YYYY format
    }

    // If date is a string in YYYY-MM-DD format, convert to MM/DD/YYYY
    if (typeof date === "string" && date.includes("-")) {
      const [year, month, day] = date.split("-");
      return `${month}/${day}/${year}`;
    }

    return "-"; // Default return in case of an invalid date
  };

  const applyDateFilter = () => {
    console.log("previousDateRange", previousDateRange);
    previousDateRange.current = dateRange;
    previousStartPlaceholder.current = startPlaceholder;
    previousEndPlaceholder.current = endPlaceholder;
    let combinedFilteredData = tableDatalib;

    // Apply Date Filter if Applied
    if (isFilterApplied) {
      const selection = dateRange[0];
      combinedFilteredData = combinedFilteredData.filter((item) => {
        // Convert server date to UTC
        const itemDate = new Date(item.DerivedDate);
        const itemUTCDate = new Date(
          Date.UTC(
            itemDate.getUTCFullYear(),
            itemDate.getUTCMonth(),
            itemDate.getUTCDate()
          )
        );

        // Get UTC start and end dates for comparison
        const startDate = selection.startDate
          ? getUTCStartOfDay(selection.startDate)
          : null;
        const endDate = selection.endDate
          ? getUTCEndOfDay(selection.endDate)
          : null;

        // For single date selection
        if (
          startDate &&
          (!selection.endDate ||
            selection.endDate.getTime() === selection.startDate.getTime())
        ) {
          return (
            itemUTCDate >= startDate &&
            itemUTCDate <= getUTCEndOfDay(selection.startDate)
          );
        }

        // For date range selection
        const isWithinDateRange =
          (!startDate || itemUTCDate >= startDate) &&
          (!endDate || itemUTCDate <= endDate);

        return isWithinDateRange;
      });
    }

    // Apply Search Filter
    if (searchInput) {
      combinedFilteredData = combinedFilteredData.filter((item) => {
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
    }

    setFilteredData(combinedFilteredData);
    setShowDatePicker(false);
    setIsFilterApplied(true);
  };

  const handlexrange = () => {
    setDateRange(previousDateRange.current);
    setStartPlaceholder(previousStartPlaceholder.current);
    setEndPlaceholder(previousEndPlaceholder.current);
    setShowDatePicker(false);
  };

  const handlererange = () => {
    setDateRange(initidaldaterange);
    setShowDatePicker(false);
    setFilteredData(tableDatalib);
    setStartPlaceholder("StartDate");
    setEndPlaceholder("EndDate");
    setIsFilterApplied(false);
  };

  useEffect(() => {
    let combinedFilteredData = tableDatalib;

    // Apply Date Filter if Applied
    if (isFilterApplied) {
      const selection = dateRange[0];
      combinedFilteredData = combinedFilteredData.filter((item) => {
        // Convert server date to UTC
        const itemDate = new Date(item.DerivedDate);
        const itemUTCDate = new Date(
          Date.UTC(
            itemDate.getUTCFullYear(),
            itemDate.getUTCMonth(),
            itemDate.getUTCDate()
          )
        );

        // Get UTC start and end dates for comparison
        const startDate = selection.startDate
          ? getUTCStartOfDay(selection.startDate)
          : null;
        const endDate = selection.endDate
          ? getUTCEndOfDay(selection.endDate)
          : null;

        // For single date selection
        if (
          startDate &&
          (!selection.endDate ||
            selection.endDate.getTime() === selection.startDate.getTime())
        ) {
          return (
            itemUTCDate >= startDate &&
            itemUTCDate <= getUTCEndOfDay(selection.startDate)
          );
        }

        // For date range selection
        const isWithinDateRange =
          (!startDate || itemUTCDate >= startDate) &&
          (!endDate || itemUTCDate <= endDate);

        return isWithinDateRange;
      });
    }

    // Apply Search Filter
    if (searchInput) {
      combinedFilteredData = combinedFilteredData.filter((item) => {
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
    }

    setFilteredData(combinedFilteredData);
    setCurrentPage(1);
  }, [searchInput, tableDatalib, dateRange, isFilterApplied]);

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
    return <span className="icon-arrow">&#8593;</span>;
  };

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const rangeStart = indexOfFirstItem + 1;
  const rangeEnd = Math.min(indexOfLastItem, filteredData.length);
  const currentItems = sortData().slice(indexOfFirstItem, indexOfLastItem);

  const toggleRowSelection = (index) => {
    const updatedSelection = new Set(selectedRows);
    if (updatedSelection.has(index)) {
      updatedSelection.delete(index); // Deselect if already selected
    } else {
      updatedSelection.add(index); // Select if not selected
    }
    setSelectedRows(updatedSelection);
  };

  const toggleSelectAll = () => {
    // Get indices of all selectable (not disabled) rows
    const selectableIndices = currentItems
      .filter((row) => row.IsExported !== "Y")
      .map((row, index) => row);
    console.log("selectableIndices", selectedRows);
    if (selectedRows.size === selectableIndices.length) {
      // If all selectable rows are selected, deselect all
      setSelectedRows(new Set());
    } else {
      // Otherwise, select all selectable rows
      setSelectedRows(new Set(selectableIndices));
    }
  };

  // Use selectedRows to determine if a row is selected
  const isRowSelected = (row) => selectedRows.has(row);

  const selectableRowsCount = currentItems.filter(
    (row) => row.IsExported !== "Y"
  ).length;
  // Determine if all selectable rows are currently selected
  const areAllSelectableRowsSelected =
    selectedRows.size === selectableRowsCount;

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
      // const patientname = selectedData[0].PatientName;
      const source = location.state?.source || "patient";
      if (source === "calendar") {
        navigate(`/medilist/`, {
          state: {
            selectedData,
            name,
            PatientIdentifier,
            // patientname : selectedData.PatientName,
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
            // patientname,
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
      disabled={row.IsExported === "Y"}
    />
  );

  const getDefaultDateRange = () => {
    const today = new Date();
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    return {
      startDate: sixMonthsAgo,
      endDate: today,
    };
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

    const formatDOB = formatdate(liballform.DateOfBirth);

    const { startDate, endDate } = dateRange[0].startDate
      ? dateRange[0]
      : getDefaultDateRange(); // Use selected range if available

    const formattedStartDate = formatdaterange(startDate);
    const formattedEndDate = formatdaterange(endDate);

    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("MEDICATION SUMMARY", 105, startYhead - 5, { align: "center" });
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`${formattedStartDate} - ${formattedEndDate}`, 85, startYhead);
    startYhead += 10;

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
    doc.text(`${liballform.DisplayName}`, boxX + 34, boxY + 6);

    // Address
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text(`Address:`, boxX + 2, boxY + 12);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    const addressText = `${patinfo.street}, ${patinfo.city}, ${patinfo.state},${patinfo.zip}`;
    const addressLines = doc.splitTextToSize(addressText, boxWidth - 24);
    doc.text(addressLines, boxX + 20, boxY + 12);

    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text("Home Pharmacy:", boxX + 2, boxY + 18);
    doc.setFont("helvetica", "normal");
    doc.text(`${patinfo.HomePharmarcy || 'N/A'}`, boxX + 35, boxY + 18);


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
    doc.text(`${patinfo.Phone}`, box2X + 21, boxY + 12);

    doc.setFont("helvetica", "bold");
    // doc.addImage(teleP,'PNG', box2X + 1 , boxY + 14, 4, 4)
    doc.text(`Home # :`, box2X + 2, boxY + 18);
    doc.setFont("helvetica", "normal");
    doc.text(`${patinfo.Phone2 || ''}`, box2X + 21, boxY + 18);


    // Update startYhead for subsequent content
    startYhead += boxHeight + 5; // Add some spacing after the box

    // Add Medication Table
    const tableColumnHeaders = [
      "Rx #",
      "Dispensed",
      "Written",
      "Qty",
      "Drug Name",
      // "Ndc Number",
      "Direction",
      "Prescriber",
    ];

    const filteredSortedData = sortData();

    //Filter the data to include only selected rows
    const selectedData = filteredSortedData.filter((row) => isRowSelected(row));

    // Use selectedData if there are selections, otherwise use all filteredSortedData
    const dataToUse =
      selectedData.length > 0 ? selectedData : filteredSortedData;

    const trimExtraSpaces = (str) => {
      return str.replace(/\s+/g, " ").trim();
    };

    const formatdatepdf = (date) => {
      // return (date?.split(' ')[0])
      if (!date) return "-";
      if (date === "9999-09-09") return "ON HOLD";

      const [year, month, day] = date.split("-");
      return `${month}/${day}/${year}`;
    };

    const formatPrescriberName = (
      name,
      cellWidth = 27,
      fontSize = 12,
      charWidth = 2.5
    ) => {
      if (!name.includes(",")) return name; // No comma, return as is

      let parts = name.split(",").map((part) => part.trim()); // Split by comma and trim spaces

      if (parts.length < 2) return name; // Not a valid format

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

    const tableRows = dataToUse.map((row) => [
      row.ScriptNumber,
      formatdatepdf(row.DateDispensedSQL),
      formatdatepdf(row.DateWritten),
      row.QuantityDispensed,
      trimExtraSpaces(row.Drug_name),
      // row.NdcNumber,
      row.Sigs,
      formatPrescriberName(row.Prescriber),
      // row.Prescriber,
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
        0: { cellWidth: 19, halign: "left", fontSize: 8.5, fontWeight: 700 }, //num
        1: { cellWidth: 22, fontSize: 8.5, fontWeight: 700 }, //num
        2: { cellWidth: 21, fontSize: 8.5, fontWeight: 700 },
        3: { cellWidth: 15 }, //num
        4: { cellWidth: 34, fontSize: 8.5, fontWeight: 700 },
        5: { cellWidth: 43 },
        6: { cellWidth: 27 },
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
      startY = 10; // Reset startY for the new pagetgfggg
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
    doc.save(`${liballform.DisplayName}_Medication.pdf`);
  };

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
                  Liberty Medication History List
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

       <div className='nav-mainliball' >
      <nav className='nav-mainliball'>
          <div className='navbar-fullliball'>
            <div className='nav-leftliball'>
            <h4 className='h5-leftliball' 
            style={{display:'flex', marginLeft:'0.5rem', textAlign:'center', padding:'0.3rem', fontFamily:'Volkhov, serif'}}>
                Hello, {name}{" "}
                {RoleDesc &&
                RoleDesc.toLowerCase() !== "null" &&
                RoleDesc.trim() !== ""
                  ? `(${RoleDesc})`
                  : ""}
              </h4>
            </div>
            
            <div className='nav-middleliball'>
              <h4 className='h4-midliball' style={{display:'flex', fontWeight:600}}>Liberty Medication History List</h4>
            </div>
          
           <div className='nav-containerliball'>
              <ul className={`nav-ulliball ${menuOpen ? "show":""}`}>
                
                <li className='nav-homeliball'>
                  <HomeIcon  sx={{color: 'white', cursor:'Pointer',width:'1.8rem',height:'1.8rem',
      '@media screen and (min-width: 1900px) and (max-width:4000px)': { width: '2.3rem', height: '2.3rem' },
      '@media screen and (min-width: 1600px) and (max-width:1890px)' : {width: '2rem', height: '2rem'},
     }}  onClick={handlehomebtn}></HomeIcon>
                </li>
                <li>
                  <picture className='img-outliball' onClick={signout}>
                        <source srcset={poweroff} type="image/svg+xml"/>
                        <img src={poweroff} class="img-fluid" alt="..."/>
                    </picture>
                </li>
              </ul>

            </div>

          </div>
         </nav>
      </div>


      <div className="navbtm-liball">
        <div className="liball-pathead">
          <div style={{width:'30%'}}>
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
          

          <div className="liball-patinfo" >
            <div className="liball-patalign" >
              <label >Patient Name&nbsp;:&nbsp;</label>
              <span style={{fontWeight:600}}>{liballform.DisplayName}</span>
            </div>
            <div className="liball-patalign" >
              <label >Date Of Birth&nbsp;:&nbsp;</label>
              <span style={{fontWeight:600}}>{liballform.DateOfBirth}</span>
            </div>
          </div>

          <div style={{width:'30%'}}></div>
        </div>

        {isLoading ? (
          <Loader />
        ) : (
          <>
           <div className='liball-main'>
          <div className='liball-searchbox-main'>
            <div className='liball-searchbox'>
                <input className='liballsearch-input'  type="text"
                    placeholder={`Search for "${columns[index]}"`}
                    onFocus={() => setIndex(0)}
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                />
                
            </div>
            <div style={{marginTop:'5px', marginRight:'1.2rem'}}>
              <RestartAltIcon 
              sx={{'@media screen and (min-width: 1900px) and (max-width:4000px)': { width: '2.1rem', height: '2.1rem' },
                }} 
             onClick={()=>handlererange()}></RestartAltIcon>
                  {!isFilterApplied ? (
                    <button
                      className="datefilter-buttonliball"
                      onClick={() => setShowDatePicker(!showDatePicker)}
                    >
                      Select Date Range
                    </button>
                  ) : (
                    <button
                      className="datefilter-buttonliball"
                      onClick={() => setShowDatePicker(!showDatePicker)}
                    >
                      <span>
                        {dateRange[0].startDate
                          ? dateRange[0].startDate.toLocaleDateString()
                          : "Not Selected"}{" "}
                        -
                      </span>
                      <span>
                        {dateRange[0].endDate
                          ? dateRange[0].endDate.toLocaleDateString()
                          : "Not Selected"}
                      </span>
                    </button>
                  )}
                  {showDatePicker && (
                    <div style={{ position:'absolute', zIndex: 1000 }}>
                      <DateRange
                        editableDateInputs={true}
                        onChange={handleDateSelect}
                        retainEndDateOnFirstSelection={true}
                        ranges={dateRange}
                        startDatePlaceholder={startPlaceholder}
                        endDatePlaceholder={endPlaceholder}

                      />
                      <div>
                        <button onClick={applyDateFilter}>Apply</button>
                        <button onClick={handlexrange}>Cancel</button>
                      </div>
                    </div>
                  )}
                  <button
                    className="export-buttonliball"
                    disabled={!permissions?.importPage?.canExport}
                    onClick={exportSelectedRows}
                  >
                    Export
                  </button>  <img src={pdf} className="pdfdown-liball" disabled = {!permissions?.PDFPrint?.canPrint} onClick={generatePDF} />

            </div>
            
          </div>


        

<div className='tablescroll-liball'>
  <table className='liball-table'>
    <thead >
      <tr className='liballtable-head'>
      <th className="checkbox-mainall">
                          <input className="checkbox-th"
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
                        <th>IsExported</th>
      </tr>
    </thead>
    <tbody>
      {currentItems.map((row, index) => (
        <tr
                          className="liballtable-row"
                          key={index}
                          id={index % 2 === 0 ? "even-rowliball" : "odd-rowliball"}
                        >
                          <td className="checkbox-th">{renderCheckbox(row)}</td>
                          <td>{row.Drug_name}</td>
                          <td>
                            <div
                              className={
                                row.Sigs && row.Sigs.length > 300
                                  ? "liballwrap"
                                  : "liballwrap1"
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
                          <td>{row.IsExported}</td>
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
                  sx={{
  '& .MuiPaginationItem-root': {
    cursor: 'pointer',
    width: '1.5rem',
    height: '1.8rem',
    '@media screen and (min-width: 1900px) and (max-width:4000px)': {
      width: '2.3rem',
      height: '2.3rem',
      fontSize: '1.1rem',
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
              <span className='pagin-rightliball'>
                {rangeStart}-{rangeEnd} of {tableDatalib.length} items
              </span>
            </div>
          </div>
   

         </div>
            
          </>
        )}
      </div>

      {/* <div style={{ marginTop: "70px" }}>
        <div className="backhome">
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

          <div className="four-collistall">
            <div className="label-div">
              <label className="col-label">Patient Name&nbsp;:</label>
              <span className="col-value">{liballform.DisplayName}</span>
            </div>
            <div className="label-div">
              <label className="col-label">Date Of Birth&nbsp;:</label>
              <span className="col-value">
                {formatdate(liballform.DateOfBirth)}
              </span>
            </div>
          </div>
        </div>

        {isLoading ? (
          <Loader />
        ) : (
          <>
            <main className="main-liball">
              <section className="Header-liball" style={{ margin: "5px " }}>
                <div className="searchbox-liball">
                  <input
                    className="searchtext-liball"
                    type="text"
                    placeholder={`Search for "${columns[index]}"`}
                    onFocus={() => setIndex(0)}
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                  ></input>
                </div>
                <div>
                  
                  <RestartAltIcon onClick={handlererange}></RestartAltIcon>
                  {!isFilterApplied ? (
                    <button
                      className="export-button"
                      onClick={() => setShowDatePicker(!showDatePicker)}
                    >
                      Select Date Range
                    </button>
                  ) : (
                    <button
                      className="export-button"
                      onClick={() => setShowDatePicker(!showDatePicker)}
                    >
                      <span>
                        {dateRange[0].startDate
                          ? dateRange[0].startDate.toLocaleDateString()
                          : "Not Selected"}{" "}
                        -
                      </span>
                      <span>
                        {dateRange[0].endDate
                          ? dateRange[0].endDate.toLocaleDateString()
                          : "Not Selected"}
                      </span>
                    </button>
                  )}
                  {showDatePicker && (
                    <div style={{ position: "absolute", zIndex: 1000 }}>
                      <DateRange
                        editableDateInputs={true}
                        onChange={handleDateSelect}
                        retainEndDateOnFirstSelection={true}
                        ranges={dateRange}
                        startDatePlaceholder={startPlaceholder}
                        endDatePlaceholder={endPlaceholder}

                      />
                      <div>
                        <button onClick={applyDateFilter}>Apply</button>
                        <button onClick={handlexrange}>Cancel</button>
                      </div>
                    </div>
                  )}

                  <button
                    className="export-button"
                    disabled={!permissions?.importAllPage?.canExport}
                    onClick={exportSelectedRows}
                  >
                    Export
                  </button>
                  <img src={pdf} className="pdfdown" disabled = {!permissions?.PDFPrint?.canPrint} onClick={generatePDF} />
                </div>
              </section>
              <section>
                <div className="table-scroll-liball">
                  <table className="tablepat-liball" style={{ width: "100%" }}>
                    <thead className="theadpat-liball">
                      <tr className="tablerow-liball">
                        <th>
                          <input
                            type="checkbox"
                            checked={areAllSelectableRowsSelected}
                            onChange={toggleSelectAll}
                          />
                        </th>

                        <th onClick={() => handleSort("Drug_name")}>
                          Drug&nbsp;Name{arrowIcon("Drug_name")}
                        </th>
                        <th className="liballsig">Sig</th>
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
                        <th>NDC Number</th>
                        <th>IsExported</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentItems.map((row, index) => (
                        <tr
                          className="tablerow-liball"
                          key={index}
                          id={
                            index % 2 === 0 ? "even-rowliball" : "odd-rowliball"
                          }
                        >
                          <td>{renderCheckbox(row)}</td>
                          <td>{row.Drug_name}</td>
                          <td className="liballsig">
                            <div
                              className={
                                row.Sigs && row.Sigs.length > 300
                                  ? "liballwrap"
                                  : "liballwrap1"
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
                          <td>{row.IsExported}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              <div className="foot-liball">
                <div className="pagin-liball">
                  <Pagination
                    page={currentPage}
                    count={totalPages}
                    onChange={handleChange}
                    showFirstButton
                    showLastButton
                  />
                </div>
                <div className="Range-liball">
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

export default LibertyAll;
