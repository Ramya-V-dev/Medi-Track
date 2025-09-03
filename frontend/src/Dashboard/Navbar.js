import {React, useState, useEffect} from 'react';
import './Navbar.css';
import poweroff from './img/poweroff.png';
import axios from 'axios';
// import PatientBoard from './Dashboard/PatientBoard';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { useDispatch } from 'react-redux';
import { setPatientIdentifier } from '../Redux/slice.js';
import { FaCalendarAlt, FaHome, FaPowerOff, FaBars } from "react-icons/fa";
import { IoMdMenu } from "react-icons/io";
import dayjs from "dayjs";
import { Snackbar, Alert, Badge, Paper } from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import capture from './img/Capture.PNG';
import Manualpull from './img/Manualpull.png';
import MedForm from './img/MedForm.png';
import pagecal from './img/Calendar.png';
import history from './img/History.png';
import Pagination from '@mui/material/Pagination';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useMediaQuery } from "@mui/material";




const BaseUrl = process.env.REACT_APP_API_BASE_URL



function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  // const navigate=useNavigate();

  // const location = useLocation();
  // const dispatch = useDispatch();

  // const name = location.state?.name || '' ;

  // const handlehomebtn = () =>{
  //   navigate('/homepage',{state:{name}})
  // }

  // const signout=()=>{
  //   navigate('/')
  // }

  // const calendarpage=(PatientIdentifier)=>{
  //   dispatch(setPatientIdentifier(PatientIdentifier));
  //   console.log(PatientIdentifier,'PTIENT')
  //   navigate('/caldrvw', {state:{name, PatientIdentifier}})
  // }

  // const manualpull=()=>{
  //   navigate('/manual', {state : {name}})
  // }


  const [parcelCount, setParcelCount] = useState(0);
  const [showNotification, setShowNotification] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchParcels();
  }, []);

  const fetchParcels = async () => {
    try {
      // Simulated API call
      const response = await axios.get(`${BaseUrl}/dbget`); 
      const data = await response.json();
      
      checkForTodayParcels(data);
    } catch (error) {
      console.error("Error fetching parcels:", error);
    }
  };

  const checkForTodayParcels = (parcelList) => {
    const today = dayjs().format("YYYY-MM-DD");
    const dueParcels = parcelList.filter(
      (parcel) => dayjs(parcel.deliveryDate).format("YYYY-MM-DD") === today
    );

    setParcelCount(dueParcels.length);

    if (dueParcels.length > 0) {
      setMessage(`You have ${dueParcels.length} parcel(s) to send today! 📦`);
      setShowNotification(true);
    }
  };

   const [tableData, setTableData] = useState([]);
   const [currentPage, setCurrentPage] = useState(1);
   const [filteredData, setFilteredData] = useState([])
   const [searchInput, setSearchInput] = useState('');
   const [dateFilter, setDateFilter] = useState('');
   
     
   
    const itemsPerPage = 15;
  const fetchdata = async () => {
    try {
      
      const resp = await axios.get(`${BaseUrl}/dbgetex`);
      const fetcheddata = resp.data.data
      
      setTableData(fetcheddata);
      // setCurrentPage(1);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  // console.log(tableData,'data')

  useEffect(() => {
    fetchdata();
  },[])


  const handleChange = (event,page) => {
    setCurrentPage(page);
  };

    const totalPages = Math.ceil(tableData.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const rangeStart = indexOfFirstItem + 1;
    const rangeEnd = Math.min(indexOfLastItem, tableData.length); 
    const currentItems = tableData.slice(indexOfFirstItem, indexOfLastItem);

    const isSmallScreen = useMediaQuery("(max-width: 650px)");
  const isMediumScreen = useMediaQuery("(min-width: 700px) and (max-width: 900px)");
  const isLargeScreen = useMediaQuery("(min-width: 900px) and (max-width: 1700px)");
  const isExtraLargeScreen = useMediaQuery("(min-width: 1700px)");

  // Dynamic styles based on screen size
  const paginationStyles = {
    "& .MuiPaginationItem-previousNext": {
      fontSize: isSmallScreen ? "18px" : isMediumScreen ? "20px" : isLargeScreen ? "15px" : "24px",
      "& svg": {
        width: isSmallScreen ? "20px" : isMediumScreen ? "23px" : isLargeScreen ? "24px" : "44px",
        height: isSmallScreen ? "20px" : isMediumScreen ? "23px" : isLargeScreen ? "24px" : "44px",
      },
    },
    "& .MuiPaginationItem-firstLast": {
      fontSize: isSmallScreen ? "18px" : isMediumScreen ? "20px" : isLargeScreen ? "15px" : "24px",
      "& svg": {
        width: isSmallScreen ? "20px" : isMediumScreen ? "23px" : isLargeScreen ? "24px" : "44px",
        height: isSmallScreen ? "20px" : isMediumScreen ? "23px" : isLargeScreen ? "24px" : "44px",
      },
    },
    "& .MuiPaginationItem-root": {
      fontSize: isSmallScreen ? "14px" : isMediumScreen ? "15px" : isLargeScreen ? "14px" : "30px",
      padding: isSmallScreen ? "4px" : isMediumScreen ? "4px" : isLargeScreen ? "9px" : "12px",
      minWidth: isSmallScreen ? "18px" : isMediumScreen ? "23px" : isLargeScreen ? "26px" : "35px",
      minHeight: isSmallScreen ? "18px" : isMediumScreen ? "23px" : isLargeScreen ? "26px" : "35px",
    },
  };
  

  return (
    <div style={{width:'100%'}}>
      <div className='nav-main' >
      <nav className='nav-main'>
          <div className='navbar-full'>
            <div className='nav-left'>
            <h5 className='h5-left' style={{display:'flex', marginLeft:'0.5rem', textAlign:'center', padding:'0.3rem'}}>Hello, Ramya Veeraraj</h5>
            </div>
            
            <div className='nav-middle'>
              <h4 className='h4-mid' style={{display:'flex'}}>Compliance Pack Patient List</h4>
            </div>

            {/* <div className='nav-container'>
              <IoMdMenu className='nav-menu' onClick={()=> setMenuOpen(!menuOpen)}/>
              <ul className={`nav-ul ${menuOpen ? "show":""}`}>
                <li>
                <CalendarMonthIcon sx={{color:'white', width : '32px', height: '32px',cursor:'Pointer'}} ></CalendarMonthIcon>
                </li>
                <li>
                  <HomeIcon sx={{color: 'white', width : '33px', height: '35px',cursor:'Pointer'}} ></HomeIcon>
                </li>
                <li>
                  <picture className='img-out' >
                        <source srcset={poweroff} type="image/svg+xml"/>
                        <img src={poweroff} class="img-fluid" alt="..."/>
                    </picture>
                </li>
              </ul>

            </div> */}

            

          
           <div className='nav-container'>
              {/* <IoMdMenu className='nav-menu' onClick={()=> setMenuOpen(!menuOpen)}/> */}
              <ul className={`nav-ul ${menuOpen ? "show":""}`}>
                <li className='nav-cal'>
                <CalendarMonthIcon  sx={{color:'white', width: { xs: '1.5rem', sm: '2rem', md: '2rem' }, 
    height: { xs: '1.5rem', sm: '2rem', md: '2rem' }, cursor:'Pointer'}} ></CalendarMonthIcon>
                </li>
                <li className='nav-home'>
                  <HomeIcon  sx={{color: 'white', width: { xs: '1.5rem', sm: '2rem', md: '2rem'}, 
    height: { xs: '1.5rem', sm: '2rem', md: '2rem' },cursor:'Pointer'}} ></HomeIcon>
                </li>
                <li>
                  <picture className='img-out' >
                        <source srcset={poweroff} type="image/svg+xml"/>
                        <img src={poweroff} class="img-fluid" alt="..."/>
                    </picture>
                </li>
              </ul>

            </div>

          </div>
         </nav>
      </div>
         

         {/* <div className='com-main'>
          <div className='com-searchbox-main'>
            <div className='com-searchbox'>
                <input className='comsearch-input' type='text'/>
                
            </div>
            <div className='com-searchbox1'>
                <input className='comsearch-input1' type='text'/>
            </div>
          </div>


        

<div className='tablescroll-com'>
  <table className='com-table'>
    <thead>
      <tr className='comtable-head'>
        <th>PatientName</th>
        <th>DateOfBirth</th>
        <th>HomePharmarcy:ALL</th>
        <th>PackPharmarcy:ALL</th>
        <th>Notes</th>
        <th>LastPackDate</th>
        <th>NextPackDate</th>
        <th>ActiveStatus:active</th>
        <th className='com-action'>View</th>
      </tr>
    </thead>
    <tbody>
      {currentItems.map((item, index) => (
        <tr 
          key={index} 
          id={index % 2 === 0 ? 'even-row' : 'odd-row'} 
          className='comtable-row'
        >
          <td>{item.DisplayName}</td>
          <td>{item.DateOfBirth}</td>
          <td>{item.HomePharmarcy}</td>
          <td>{item.PackPharmarcy}</td>
          <td className='overflow-text-com'>{item.Notes}</td>
          <td>{item.LastPackDate}</td>
          <td>{item.NextPackDate}</td>
          <td>{item.ActiveStatus}</td>
          <td className='com-view'><VisibilityIcon sx={{width:'100%'}}></VisibilityIcon></td>
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
                  sx={{"& .MuiPaginationItem-previousNext": {
      fontSize: "1rem",
      "& svg": {
        width: "1.5rem",
        height: "1.5rem",
      },
    },
    "& .MuiPaginationItem-firstLast": {
      fontSize: "1rem",
      "& svg": {
        width: "1.5rem",
        height: "1.5rem",
      },
    },
    "& .MuiPaginationItem-root": {
      fontSize: "1rem",
      // padding: "0.5rem",
      minWidth: "1.6rem",
      minHeight: "1.6rem",
    },}}
                  // sx={paginationStyles}
                  >

                </Pagination>
            </div>
            <div style={{marginRight:'15px'}}>
              <span className='pagin-right'>
                {rangeStart}-{rangeEnd} of {tableData.length} items
              </span>
            </div>
          </div>
   

         </div> */}

  <div className='home-page'>

           <div className='Home-head'>Explore Application</div>
           <div style={{width:'100%', display:'flex',marginTop:'15px'}}>
            <div className='home-expapp'>
              <Paper elevation={3} className='home-perdiv' 
              sx={{border:0, borderRadius:'2rem', width:'73%',height:'100%'}}>
                <div className='com-imgDiv'>
                    <img className='home-img' src={capture} alt='logo'></img>
                  </div>
                  <div>
                    <h5  className='home-paperhead'>Compliance Pack Patients View</h5>
                  </div>
                  <div>
                    <p  className='home-papercontent'>This section contains information about patients and their medications who use Primary Plus compliance packaging.
                    </p>
                  </div>
                  <div style={{marginRight:'1rem'}}>
                    <a  className='home-paperview' href='#'>View Portal</a>
                  </div>
              </Paper>
            </div>


            <div className='home-expapp1'>
              <Paper elevation={3} className='home-perdiv1' sx={{border:0, borderRadius:'2rem', width:'73%',height:'100%'}}>
                <div className='com-imgDiv'>
                    <img className='home-img' src={capture} alt='logo'></img>
                  </div>
                  <div>
                    <h5  className='home-paperhead'>Compliance Pack Patients View</h5>
                  </div>
                  <div>
                    <p  className='home-papercontent'>This section contains information about patients and their medications who use Primary Plus compliance packaging.
                    </p>
                  </div>
                  <div style={{marginRight:'1rem'}}>
                    <a  className='home-paperview' href='#'>View Portal</a>
                  </div>
              </Paper>
            </div>

           </div>

<div style={{width:'100%', display:'flex',marginTop:'15px'}}>
            <div className='home-expapp'>
              <Paper elevation={3} className='home-perdiv' sx={{border:0, borderRadius:'2rem', width:'73%',height:'100%'}}>
                <div className='com-imgDiv'>
                    <img className='home-img' src={capture} alt='logo'></img>
                  </div>
                  <div>
                    <h5  className='home-paperhead'>Compliance Pack Patients View</h5>
                  </div>
                  <div>
                    <p  className='home-papercontent'>This section contains information about patients and their medications who use Primary Plus compliance packaging.
                    </p>
                  </div>
                  <div style={{marginRight:'1rem'}}>
                    <a  className='home-paperview' href='#'>View Portal</a>
                  </div>
              </Paper>
            </div>


            <div className='home-expapp1'>
              <Paper elevation={3} className='home-perdiv1' sx={{border:0, borderRadius:'2rem', width:'73%',height:'100%'}}>
                <div className='com-imgDiv'>
                    <img className='home-img' src={capture} alt='logo'></img>
                  </div>
                  <div>
                    <h5  className='home-paperhead'>Compliance Pack Patients View</h5>
                  </div>
                  <div>
                    <p  className='home-papercontent'>This section contains information about patients and their medications who use Primary Plus compliance packaging.
                    </p>
                  </div>
                  <div style={{marginRight:'1rem'}}>
                    <a  className='home-paperview' href='#'>View Portal</a>
                  </div>
              </Paper>
            </div>

           </div>


           <div className='Home-headBI'>PowerBI Report</div>
            <div style={{width:'100%', display:'flex',marginTop:'15px', marginLeft:'1rem'}}>
               <div className='home-expappBI'>
              <Paper elevation={3} className='home-perdivBI' 
              sx={{border:0, borderRadius:'1.5rem', width:'95%',height:'98%'}}>
                <div className='com-imgDiv'>
                    <img className='home-imgBI' src={capture} alt='logo'></img>
                  </div>
                  <div>
                    <h5  className='home-paperheadBI'>Compliance Pack Patients View</h5>
                  </div>
                  <div  className='paraBI'>
                    <p  className='home-papercontentBI'>This section contains information about patients and their medications who use Primary Plus compliance packaging.
                    </p>
                  </div>
                  <div style={{marginRight:'1rem'}}>
                    <a  className='home-paperviewBI' href='#'>View Portal</a>
                  </div>
              </Paper>
            </div>

            <div className='home-expappBI'>
              <Paper elevation={3} className='home-perdivBI' 
              sx={{border:0, borderRadius:'1.5rem', width:'95%',height:'98%'}}>
                <div className='com-imgDiv'>
                    <img className='home-imgBI' src={capture} alt='logo'></img>
                  </div>
                  <div>
                    <h5  className='home-paperheadBI'>Compliance Pack Patients View</h5>
                  </div>
                  <div className='paraBI'>
                    <p  className='home-papercontentBI'>This section contains information about patients and their medications who use Primary Plus compliance packaging.
                    </p>
                  </div>
                  <div style={{marginRight:'1rem'}}>
                    <a  className='home-paperviewBI' href='#'>View Portal</a>
                  </div>
              </Paper>
            </div>

            <div className='home-expappBI'>
              <Paper elevation={3} className='home-perdivBI' 
              sx={{border:0, borderRadius:'1.5rem', width:'95%',height:'98%'}}>
                <div className='com-imgDiv'>
                    <img className='home-imgBI' src={capture} alt='logo'></img>
                  </div>
                  <div>
                    <h5  className='home-paperheadBI'>Compliance Pack Patients View</h5>
                  </div>
                  <div className='paraBI'>
                    <p  className='home-papercontentBI'>This section contains information about patients and their medications who use Primary Plus compliance packaging.
                    </p>
                  </div>
                  <div style={{marginRight:'1rem'}}>
                    <a  className='home-paperviewBI' href='#'>View Portal</a>
                  </div>
              </Paper>
            </div>

            <div className='home-expappBI'>
              <Paper elevation={3} className='home-perdivBI' 
              sx={{border:0, borderRadius:'1.5rem', width:'95%',height:'98%'}}>
                <div className='com-imgDiv'>
                    <img className='home-imgBI' src={capture} alt='logo'></img>
                  </div>
                  <div>
                    <h5  className='home-paperheadBI'>Compliance Pack Patients View</h5>
                  </div>
                  <div className='paraBI'>
                    <p  className='home-papercontentBI'>This section contains information about patients and their medications who use Primary Plus compliance packaging.
                    </p>
                  </div>
                  <div style={{marginRight:'1rem'}}>
                    <a  className='home-paperviewBI' href='#'>View Portal</a>
                  </div>
              </Paper>
            </div>
           

            </div>
         </div>


    </div>
  )
}

export default Navbar





