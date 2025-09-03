import { setPatientIdentifier, setlibertyRow } from "../Redux/slice.js";
import React, { useEffect, useState } from "react";
import "./CalendarView.css";
import Navbar from "../Dashboard/Navbar";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useSelector } from "react-redux";
import poweroff from "../Dashboard/img/poweroff.png";
import "moment-timezone";
import { useDispatch } from "react-redux";
import { logout } from "../Redux/slice.js";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import refresh from './img/refresh.png'
import { Tooltip } from "@mui/material";

const BaseUrl = process.env.REACT_APP_API_BASE_URL;

// moment.tz.setDefault("America/New_York");
const userTimezone = moment.tz.guess();
moment.tz.setDefault(userTimezone);
const localizer = momentLocalizer(moment);

function CalendarView() {
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [patientevents, setPatientevents] = useState([]);
  const [rowise, setRowise] = useState([]);
  const [searchInputcal, setSearchInputcal] = useState('');
  const [statusOption, setStatusOption] = useState(
    localStorage.getItem("statusOption") || "Active"
  );
  const [selectedOption, setSelectedOption] = useState(
    localStorage.getItem("selectedOption") || "ALL"
  );
  const [packPharmacyselectedOption, setpackPharmacyselectedOption] = useState(
    localStorage.getItem("packPharmacyselectedOption") || "ALL"
  );
  const [viewCount, setViewCount] = useState(0);
  // const [currentView, setCurrentView] = useState(
  //   localStorage.getItem("currentView") || "month"
  // ); // Track current view
  // const [currentDate, setCurrentDate] = useState(
  //   localStorage.getItem("currentDate") || moment().toDate()
  // );

  const [currentView, setCurrentView] = useState(() => {
  return localStorage.getItem("currentView") || "month";
});

const [currentDate, setCurrentDate] = useState(() => {
  const savedDate = localStorage.getItem("currentDate");
  return savedDate ? new Date(savedDate) : moment().toDate();
});


  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const name = location.state?.name || "";
  const signout = () => {
    dispatch(logout());
    navigate("/");
  };

  useEffect(() => {
    fetchdata();
  }, []);

  const { token = null, tokenname = null } = useSelector(
    (state) => state.PatientIdentifier ?? {}
  );

  const fetchdata = async () => {
    try {
      if (!token || !tokenname) {
        navigate("/");
        return;
      }
      const resp = await axios.get(`${BaseUrl}/cldrget`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const fetcheddata = resp.data.data;

      setPatientevents(fetcheddata);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const formatdate = (date) => {
    // return (date?.split(' ')[0])
    if (!date) return "-";

    const [year, month, day] = date.split(" ")[0].split("-");
    return `${month}/${day}/${year}`;
  };


  // console.log(patientevents,'det')

  useEffect(() => {
    const filtered = patientevents.filter((item) => {

      const otherFieldsMatch = [
        
        item.DisplayName,
      ].some(
        (term) =>
          term &&
          term.toString().toLowerCase().includes(searchInputcal.toLowerCase())
      );
      // Filter by active status
      const optionActiveStatus =
        statusOption === "ALL" || item.ActiveStatus === statusOption;

      const isPharmacyMatch =
        selectedOption === "ALL" || item.HomePharmarcy === selectedOption;

      const ispackPharmacyMatch =
        packPharmacyselectedOption === "ALL" ||
        item.PackPharmarcy === packPharmacyselectedOption;

      return optionActiveStatus && isPharmacyMatch && ispackPharmacyMatch && otherFieldsMatch;
    });
    if (searchInputcal.trim() !== "" && filtered.length > 0) {
    const firstDate = moment(filtered[0].NextPackDate).toDate();
    setCurrentDate(firstDate); // this will automatically update calendar view
  }

    setFilteredEvents(filtered);
    setViewCount(calculateViewCount(filtered, currentView, currentDate));
  }, [
    statusOption,
    selectedOption,
    packPharmacyselectedOption,
    patientevents,
    currentDate,
    currentView,
    searchInputcal,
  ]);

  const columns = ["GlobalId", "SSN", "PatientName", "DateOfBirth"]; // Example column names
    const [index, setIndex] = useState(0);
  
    useEffect(() => {
      const interval = setInterval(() => {
        setIndex((index) => (index + 1) % columns.length);
      }, 1000); // Change column every second
  
      return () => clearInterval(interval);
    }, [columns.length]);

  const options = [
    "ALL",
    "ASH",
    "BC",
    "CEN",
    "FB",
    "GR",
    "MH",
    "MV",
    "SS",
    "TB",
    "VB",
  ];
  const PackPharmarcy = ["ALL", "MH", "MV", "VB", "SS"];
  const status = ["ALL", "Active", "Inactive"];

  // useEffect(() => {
  //   localStorage.removeItem("statusOption");
  //   localStorage.removeItem("selectedOption");
  //   localStorage.removeItem("packPharmacyselectedOption");
  //   localStorage.removeItem("currentView");
  //   localStorage.removeItem("currentDate");
  // }, []);

  const resetFilters = () => {
    setStatusOption("Active");
    setSelectedOption("ALL");
    setpackPharmacyselectedOption("ALL");
    setCurrentView("month");
    setCurrentDate(moment().toDate());
  };

  const handleStatusFilterChange = (value) => {
    console.log("value", value);
    setStatusOption(value === "ALL" ? "ALL" : value);
    localStorage.setItem("statusOption", value);
  };

  const handlePharmacyFilterChange = (selectedValue) => {
    // console.log("selectedValue",selectedValue,patientevents,fetchdata)
    setSelectedOption(selectedValue === "ALL" ? "ALL" : selectedValue);
    localStorage.setItem("selectedOption", selectedValue);
  };

  const handlePackPharmacyFilterChange = (selectedValue) => {
    setpackPharmacyselectedOption(
      selectedValue === "ALL" ? "ALL" : selectedValue
    );
    localStorage.setItem("packPharmacyselectedOption", selectedValue);
  };

  const events = filteredEvents.map((patient) => ({
    title: patient.DisplayName,
    start: moment.tz(patient.NextPackDate, userTimezone).toDate(),
    end: moment.tz(patient.NextPackDate, userTimezone).toDate(),
    PatientIdentifier: patient.PatientIdentifier,
    NextPackDate: patient.NextPackDate,
    ReviewedDate: patient.ReviewedDate,
    ColourIndicator: patient.ColourIndicator,
  }));

  const calculateViewCount = (events, view, date) => {
    const filteredEvents = events.filter((event) => {
      const eventStart = moment(event.start);
      switch (view) {
        case "month":
          return eventStart.isSame(moment(date), "month");
        case "week":
          return eventStart.isSame(moment(date), "week");
        case "day":
          return eventStart.isSame(moment(date), "day");
        default:
          return true;
      }
    });
    return filteredEvents.length;
  };

  useEffect(() => {
    const initialCount = calculateViewCount(events, currentView, currentDate);
    setViewCount(initialCount);
  }, [calculateViewCount, currentView, currentDate, events]);

  const handleEventSelect = (events) => {
    const { PatientIdentifier } = events;
    let calenderview = true;
    console.log(calenderview, "got it");

    dispatch(setPatientIdentifier(PatientIdentifier));

    // const selectedPatientData = filteredEvents.find(patient => patient.PatientIdentifier === PatientIdentifier);

    const storingdata = {
      statusOption,
      selectedOption,
      packPharmacyselectedOption,
      currentDate,
      currentView,
    };
    localStorage.setItem("calendarFilters", JSON.stringify(storingdata));
    // localStorage.setItem("data", JSON.stringify(selectedPatientData));

    // Retrieve the stored data and dispatch it
    // const patdata = localStorage.getItem('data');
    // dispatch(setlibertyRow(patdata));

    navigate(`/medsnap`, {
      state: {
        name,
        currentView,
        PatientIdentifier,
        calenderview,
        storingdata,
        source: "calendar",
      },
    });
  };

  // useEffect(() => {
  //   const storingdata = {
  //     statusOption,
  //     selectedOption,
  //     packPharmacyselectedOption,
  //     currentDate: currentDate.toISOString(),
  //     currentView,
  //   };
  //   localStorage.setItem("calendarFilters", JSON.stringify(storingdata));
  // }, [statusOption, selectedOption, packPharmacyselectedOption, currentDate, currentView]);

 
  const RoleDesc = useSelector((state) => state.PatientIdentifier.RoleDesc);

  const Backbtn = () => {
    let calenderview = true;
     const storingdata = {
      statusOption,
      selectedOption,
      packPharmacyselectedOption,
      currentDate,
      currentView,
    };
    
    localStorage.setItem("calendarFilters", JSON.stringify(storingdata));
    navigate(`/patientdet`, { state: { name,calenderview,storingdata,currentView } });
  };

  const getEventIndicator = (event) => {
    if (event.ReviewedDate) {
      const currentDate = new Date();
      const reviewedDate = new Date(event.ReviewedDate);
      const diffTime = Math.abs(currentDate - reviewedDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays < 15) {
        return "green";
      } else {
        return "red";
      }
    } else {
      return "red";
    }
  };

    const [menuOpen, setMenuOpen] = useState(false);
  

  return (
    <div>
      {/* <nav className="navbar navbar-expand-lg fixed-top">
        <div className="container-fluid">
        
          <h4 className="navbar-brand" style={{ color: "#fff" }}>
                Hello, {name}{" "}
                {RoleDesc &&
                RoleDesc.toLowerCase() !== "null" &&
                RoleDesc.trim() !== ""
                  ? `(${RoleDesc})`
                  : ""}
              </h4>

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <h3
                className="head"
                style={{
                  justifyContent: "center",
                  fontWeight: "600",
                  marginLeft: "30px",
                }}
              >
                Calendar View
              </h3>
            </ul>
          </div>
        </div>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <div>
            <picture className="img-out" onClick={signout}>
              <source srcSet={poweroff} type="image/svg+xml" />
              <img src={poweroff} className="img-fluid" alt="..." />
            </picture>
          </div>
        </div>
      </nav> */}

      <div className='nav-maincal' >
      <nav className='nav-cal'>
          <div className='navbar-fullcal'>
            <div className='nav-leftcal'>
            <h4 className='h5-leftcal' 
            style={{fontFamily:'Volkhov, serif'}}>
                Hello, {name}{" "}
                {RoleDesc &&
                RoleDesc.toLowerCase() !== "null" &&
                RoleDesc.trim() !== ""
                  ? `(${RoleDesc})`
                  : ""}
              </h4>
            </div>
            
            <div className='nav-middlecal'>
              <h4 className='h4-midcal' style={{display:'flex', fontWeight:600}}>Calendar View</h4>
            </div>
          
           <div className='nav-containercal'>
              <ul className={`nav-ulcal ${menuOpen ? "show":""}`}>
               
                <li>
                  <picture className='img-outcal' onClick={signout}>
                        <source srcset={poweroff} type="image/svg+xml"/>
                        <img src={poweroff} class="img-fluid" alt="..."/>
                    </picture>
                </li>
              </ul>

            </div>

          </div>
         </nav>
      </div>

      <div className="calendar-start" >
       <div style={{width:'99%',display:'flex', justifyContent:'space-between'}}>
        <div style={{display:'flex',justifyContent:'space-between',width:'40%'}}>
            <div style={{width :'20%'}}>
           <button onClick={Backbtn} className="backbutton-cal">
            <svg
              height="14"
              width="14"
              xmlns="http://www.w3.org/2000/svg"
              version="1.1"
              viewBox="0 0 1024 1024"
            >
              <path d="M874.690416 495.52477c0 11.2973-9.168824 20.466124-20.466124 20.466124l-604.773963 0 188.083679 188.083679c7.992021 7.992021 7.992021 20.947078 0 28.939099-4.001127 3.990894-9.240455 5.996574-14.46955 5.996574-5.239328 0-10.478655-1.995447-14.479783-5.996574l-223.00912-223.00912c-3.837398-3.837398-5.996574-9.046027-5.996574-14.46955 0-5.433756 2.159176-10.632151 5.996574-14.46955l223.019353-223.029586c7.992021-7.992021 20.957311-7.992021 28.949332 0 7.992021 8.002254 7.992021 20.957311 0 28.949332l-188.073446 188.073446 604.753497 0C865.521592 475.058646 874.690416 484.217237 874.690416 495.52477z"></path>
            </svg>
            <span>Back</span>
          </button>
        </div>

          <div className="four-cal">
            <div className="label-divcal">
              <label className="col-labelcal">Filtered Count&nbsp;:</label>
              <span className="col-valuecal">{viewCount}</span>
            </div>
            <div className="label-divcal">
              <label className="col-labelcal">Total Count&nbsp;:</label>
              <span className="col-valuecal">{filteredEvents.length}</span>
            </div>
          </div>

        </div>

       
          <div style={{display:'flex',width:'55%',justifyContent:'flex-end'}}>
            <div>
              <Tooltip  title = 'refresh'>
                <img className="cal-refresh" src={refresh} alt="logo" onClick={resetFilters}></img>
              </Tooltip>
              </div>
              <div style={{marginTop:'5px',display:'flex',gap:'5px'}}>

                <div className="dropdowncal">
                     <span >STATUS:</span>
                <button className="btncal btncal-secondary " type="button" id="mediAssistDropdown" data-bs-toggle="dropdown" aria-expanded="false">
                   {statusOption}
                </button>
                <ul className="dropdown-menu" 
                 aria-labelledby="mediAssistDropdown"
              >
                 {status.map((optionact) => (
                  <li key={optionact}>
                 <button className="dropdown-item" type="button" 
                 onClick={() => handleStatusFilterChange(optionact)}>{optionact}</button>
                 </li>
                 ))}
                </ul>
                </div>

                 <div className="dropdowncal">
                     <span >PACK&nbsp;PHARMARCY:</span>
                <button className="btncal btncal-secondary " type="button" id="mediAssistDropdown1" data-bs-toggle="dropdown" aria-expanded="false">
                   {packPharmacyselectedOption}
                </button>
                <ul className="dropdown-menu" 
                 aria-labelledby="mediAssistDropdown1"
              >
                 {PackPharmarcy.map((optionpack) => (
                  <li key={optionpack}>
                 <button className="dropdown-item" type="button" 
                 onClick={() => handlePackPharmacyFilterChange(optionpack)}>{optionpack}</button>
                 </li>
                 ))}
                </ul>
                </div>

                 <div className="dropdowncal">
                     <span >HOME&nbsp;PHARMARCY:</span>
                <button className="btncal btncal-secondary " type="button" id="mediAssistDropdown2" data-bs-toggle="dropdown" aria-expanded="false">
                   {selectedOption}
                </button>
                <ul className="dropdown-menu" 
                 aria-labelledby="mediAssistDropdown2"
              >
                 {options.map((optionhome) => (
                  <li key={optionhome}>
                 <button className="dropdown-item" type="button" 
                 onClick={() => handlePharmacyFilterChange(optionhome)}>{optionhome}</button>
                 </li>
                 ))}
                </ul>
                </div>

               <div className='com-searchbox-maincal'>
             <div className='com-searchboxcal'>
                <input className='comsearch-inputcal'  type="text"
                    placeholder={`Search for "${columns[index]}"`}
                    onFocus={() => setIndex(0)}
                    value={searchInputcal}
                    onChange={(e) => setSearchInputcal(e.target.value)}
                />
                
            </div>
               </div>
           



              </div>              
          </div>
                       

       </div>

        <div className="calendar-viewmain"  
        // style={{marginTop:'5px', height:'83vh'}}
        >
           <Calendar
          localizer={localizer}
          events={events}
          view={currentView}
          date={currentDate}
          startAccessor="start"
          endAccessor="end"
          // className="calendar-viewmain"
          // style={{ height: '100vh', fontSize:'11px',padding: '2px 2px'}}
          // style={{height:500}}
          onSelectEvent={handleEventSelect}
          views={["month", "week", "day"]} // Removed 'agenda' view
          formats={{
            eventTimeRangeFormat: () => "", // Hides the event time display
            timeGutterFormat: () => "", // Hides the time gutter on the left
            agendaTimeFormat: () => "", // Hides time in agenda view
          }}
          onView={(newView) => {
            setCurrentView(newView); // Update view
            const newCount = calculateViewCount(events, newView, currentDate);
            setViewCount(newCount);
          }}
          onNavigate={(date, view) => {
            setCurrentDate(date); // Update date
            const newCount = calculateViewCount(events, view, date);
            setViewCount(newCount);
          }}
          eventPropGetter={(event) => {
            // const indicatorColor = getEventIndicator(event);
            let color = event.ColourIndicator;

            // Change "dark green" to "highlight green"
            if (color === "green") {
              color = "#1dbf1f";
            } else if (color === "red") {
              color = "#f23535";
            }
            return {
              style: {
                borderLeft: `14px solid ${color}`,
              },
            };
          }}
        />
        </div>

      </div>

      {/* <div style={{ marginTop: "60px", height: "550px" }}>
        <div
          className="header-block"
          style={{ justifyContent: "space-between", display: "flex" }}
        >
          <button onClick={Backbtn} className="backbutton">
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

          <div className="four-cal">
            <div className="label-divcal">
              <label className="col-labelcal">Filtered Count&nbsp;:</label>
              <span className="col-valuecal">{viewCount}</span>
            </div>
            <div className="label-div">
              <label className="col-labelcal">Total Count&nbsp;:</label>
              <span className="col-valuecal">{filteredEvents.length}</span>
            </div>
          </div>
          <div
            className="dropdown"
            style={{ justifyContent: "end", gap: "10px", marginRight: "10px" }}
          >
            <Tooltip title="Reset Filters">
              <RestartAltIcon
                style={{ marginTop: "25px", cursor: "Pointer" }}
                onClick={resetFilters}
              ></RestartAltIcon>
            </Tooltip>
            <button
              className="btn btn-secondary dropdown-toggle"
              type="button"
              id="statusDropdown"
              data-bs-toggle="dropdown"
              aria-expanded="false"
              style={{ width: "200px" }}
            >
              Status : {statusOption}
            </button>
            <ul className="dropdown-menu" aria-labelledby="statusDropdown">
              {status.map((option) => (
                <li key={option}>
                  <button
                    className="dropdown-item"
                    type="button"
                    onClick={() => handleStatusFilterChange(option)}
                  >
                    {option}
                  </button>
                </li>
              ))}
            </ul>
            <button
              className="btn btn-secondary dropdown-toggle"
              type="button"
              id="packPharmacyDropdown"
              data-bs-toggle="dropdown"
              aria-expanded="false"
              style={{ width: "200px" }}
            >
              Pack Pharmacy: {packPharmacyselectedOption}
            </button>
            <ul
              className="dropdown-menu"
              aria-labelledby="packPharmacyDropdown"
            >
              {PackPharmarcy.map((option) => (
                <li key={option}>
                  <button
                    className="dropdown-item"
                    type="button"
                    onClick={() => handlePackPharmacyFilterChange(option)}
                  >
                    {option}
                  </button>
                </li>
              ))}
            </ul>
            <button
              className="btn btn-secondary dropdown-toggle"
              type="button"
              id="pharmacyDropdown"
              data-bs-toggle="dropdown"
              aria-expanded="false"
              style={{ width: "200px" }}
            >
              Home Pharmacy: {selectedOption}
            </button>
            <ul className="dropdown-menu" aria-labelledby="pharmacyDropdown">
              {options.map((option) => (
                <li key={option}>
                  <button
                    className="dropdown-item"
                    type="button"
                    onClick={() => handlePharmacyFilterChange(option)}
                  >
                    {option}
                  </button>
                 
                </li>
              ))}
            </ul>

            <div className='com-searchbox-maincal'>
            <div className='com-searchboxcal'>
                <input className='comsearch-inputcal'  type="text"
                    placeholder={`Search for "${columns[index]}"`}
                    onFocus={() => setIndex(0)}
                    value={searchInputcal}
                    onChange={(e) => setSearchInputcal(e.target.value)}
                />
                </div>
            </div>


          </div>
        </div>
        <Calendar
          localizer={localizer}
          events={events}
          view={currentView}
          date={currentDate}
          startAccessor="start"
          endAccessor="end"
          style={{ height: '80vh', fontSize:'13px',padding: '2px 4px'}}
          onSelectEvent={handleEventSelect}
          views={["month", "week", "day"]} // Removed 'agenda' view
          formats={{
            eventTimeRangeFormat: () => "", // Hides the event time display
            timeGutterFormat: () => "", // Hides the time gutter on the left
            agendaTimeFormat: () => "", // Hides time in agenda view
          }}
          onView={(newView) => {
            setCurrentView(newView); // Update view
            const newCount = calculateViewCount(events, newView, currentDate);
            setViewCount(newCount);
          }}
          onNavigate={(date, view) => {
            setCurrentDate(date); // Update date
            const newCount = calculateViewCount(events, view, date);
            setViewCount(newCount);
          }}
          eventPropGetter={(event) => {
            // const indicatorColor = getEventIndicator(event);
            let color = event.ColourIndicator;

            // Change "dark green" to "highlight green"
            if (color === "green") {
              color = "#1dbf1f";
            } else if (color === "red") {
              color = "#f23535";
            }
            return {
              style: {
                borderLeft: `14px solid ${color}`,
              },
            };
          }}
        />
      </div> */}
    </div>
  );
}

export default CalendarView;
