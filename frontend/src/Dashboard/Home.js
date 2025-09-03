import {React, useState, useEffect} from 'react';
import './Home.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from './Navbar';
import { useLocation, useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import poweroff from './img/poweroff.png';
import capture from './img/Capture.PNG';
import Manualpull from './img/Manualpull.png';
import MedForm from './img/MedForm.png';
import pagecal from './img/Calendar.png';
import history from './img/History.png';
import axios from 'axios';
import Noterepost from './img/Noterepost.png';
import { PowerBIEmbed } from 'powerbi-client-react';
import { models } from 'powerbi-client';
import { useSelector, useDispatch } from 'react-redux';
import { setPatientIdentifier, setlibertyRow, logout, settoken } from '../Redux/slice.js';
import User from '../Finallogin/img/User.PNG';
import { getPermissionsByRole } from '../Finallogin/GetPermission.js';
import HomeIcon from '@mui/icons-material/Home';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
// import homearrow from './img/home-arrow.png'
// import homearrow from './img/arrows.png'
import homearrow from './img/arrow.png'




const BaseUrl = process.env.REACT_APP_API_BASE_URL

const MediprintReport = process.env.REACT_APP_MEDI_LIST_PRINTREPORT

// console.log(process.env.REACT_APP_MEDI_LIST_PRINTREPORT,'print')

const NotesReport = process.env.REACT_APP_NOTES_REPOSITORY_REPORT

const PatientCalendarReport = process.env.REACT_APP_PATIENT_CALENDAR_REPORT

const MediHistoryReport = process.env.REACT_APP_MEDI_HISTORY_REPORT




const Home = () => {

    const  location = useLocation();
    const name = location.state?.name
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const Role  = useSelector((state)=> state.PatientIdentifier.Role)
    const RoleDesc  = useSelector((state)=> state.PatientIdentifier.RoleDesc)
    const permissions = getPermissionsByRole(Role)
    const [menuOpen, setMenuOpen] = useState(false);
    const calenderview = location.state?.calenderview

    const {token = null, tokenname = null} = useSelector((state) => state.PatientIdentifier ?? {});
    useEffect(() => {
      // const token = sessionStorage.getItem('token');
      if (!token || !tokenname) {
        // No token found, redirect to login page
        navigate('/');
      }
    }, [navigate]);

    const handlecomppage = () =>{
       navigate('/patientdet',{state: {name, calenderview: true}})
    }

    const handlepullpage = () =>{
      navigate('/manual',{state: {name, calenderview: true}})
   }

   const signout=()=>{
    dispatch(logout());
    navigate('/')
  }

  const [showOptions, setShowOptions] = useState(false);
  const [showChangePasswordPopup, setShowChangePasswordPopup] = useState(false);
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const toggleOptions = () => {
    setShowOptions(!showOptions);
  };

  const handleChangePassword = () => {
    setShowChangePasswordPopup(true);
    setShowOptions(false);
  };

  const handleChangePasswordSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (formData.newPassword !== formData.confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    try {
      const response = await axios.post(`${BaseUrl}/changepwd`, {
        username: name, // Replace with actual username or get it from context/state
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      });

      setSuccess('Password changed successfully',response);
      setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' }); // Reset form
      setTimeout(() => {
        setShowChangePasswordPopup(false); // Close popup after success
      }, 2000);
    } catch (error) {
      setError(error.response?.data?.message || 'An error occurred');
    }
  };

  

  
  

  return (
//     <div className="homepage">
//     <div>
//         <div>
//       <nav class=" navbar navbar-expand-lg  fixed-top" >
//   <div class="container-fluid">
//     <h4 className="navbar-brand" style={{ color: '#fff' }}>
//   Hello, {name} {(RoleDesc && RoleDesc.toLowerCase() !== 'null' && RoleDesc.trim() !== '') ? `(${RoleDesc})` : ''}
// </h4>


//     <button class="navbar-toggler" type="button" data-bs-toggle="collapse" 
//     data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" 
//     aria-expanded="false" aria-label="Toggle navigation">
//       <span class="navbar-toggler-icon"></span>
//     </button>
//     <div class="collapse navbar-collapse" id="navbarSupportedContent">
//       <ul class="navbar-nav me-auto mb-2 mb-lg-0">
       
        
//       </ul>
      
//     </div>
//   </div>
//     <div class="collapse navbar-collapse" id="navbarSupportedContent">
     
//       <div>
//       <picture className='img-out' onClick={signout}>
//       <source srcset={poweroff} type="image/svg+xml"/>
//       <img src={poweroff} class="img-fluid" alt="..."/>
//     </picture>
   
//       </div>
    
//    </div> 
//    {showChangePasswordPopup && (
//         <div className="popup">
//           <div className="popup-inner">
//             <h2>Change Password</h2>
//             <form onSubmit={handleChangePasswordSubmit}>
//               <input
//                 type="password"
//                 name="currentPassword"
//                 placeholder="Current Password"
//                 value={formData.currentPassword}
//                 onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
//                 required
//               />
//               <input
//                 type="password"
//                 name="newPassword"
//                 placeholder="New Password"
//                 value={formData.newPassword}
//                 onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
//                 required
//               />
//               <input
//                 type="password"
//                 name="confirmPassword"
//                 placeholder="Confirm New Password"
//                 value={formData.confirmPassword}
//                 onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
//                 required
//               />
//               <div className="button-group">
//                 <button type="submit">Submit</button>
//                 <button type="button" onClick={() => setShowChangePasswordPopup(false)}>Cancel</button>
//               </div>
//             </form>
//             {error && <p className="error">{error}</p>}
//             {success && <p className="success">{success}</p>}
//           </div>
//         </div>
//       )}

// </nav>


//       </div>
//     </div>


//     <div style={{marginTop:'60px'}}>
//       <div style={{display:'flex', flexDirection:'column'}}>
//         <div style={{display:'flex', marginLeft :'10px'}}>
//           <h4>Explore Application </h4>
//         </div>
//         <div className='paper-app'>
//         {permissions?.homePage?.CompPack && (
//         <div style={{width:'50%',marginLeft:'10%'}}>
//              <Paper elevation={3} style={{width:'80%', padding:'15px',borderRadius:'20px'}}>
//              <div>
//                 <img src={capture} 
//                 className='comp-board' alt="Provider Dashboard" />

//               </div>
//               <div>
//                 <h5>Compliance Pack Patients View</h5>
//                 <p style={{paddingLeft:'1rem'}}>
//                 This section contains information about patients and their medications who use Primary Plus compliance packaging.
//                 </p>
//                 <button onClick={handlecomppage} className='linkboard'>
//               View Portal
//               <svg width="16px" height="16px" viewBox="0 0 16 16" className="bi bi-arrow-right" fill="#d0b200" xmlns="http://www.w3.org/2000/svg">
//                 <path fillRule="evenodd" d="M4 8a.5.5 0 0 1 .5-.5h5.793L8.146 5.354a.5.5 0 1 1 .708-.708l3 3a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708-.708L10.293 8.5H4.5A.5.5 0 0 1 4 8z" />
//               </svg>
//             </button>
//               </div>
//              </Paper>
//           </div>
//         )}
          
//           <div style={{width:'50%'}}>
//              <Paper elevation={3} style={{width:'80%',borderRadius:'20px', padding:'15px'}} className='paper-print'>
//              <div >
//                 <img src={Manualpull} 
//                 className='report-board' alt="Provider Dashboard" />

//               </div>
//               <div>
//                 <h5>Manual Pull</h5>
//                 <p>
//                 This feature allows for the manual addition of a patient to the Compliance Pack Patients list.
//                 </p>
//                 <button onClick={handlepullpage} className='linkboard'>
//               View Portal
//               <svg width="16px" height="16px" viewBox="0 0 16 16" style={{marginTop:'3px'}} fill="#d0b200" xmlns="http://www.w3.org/2000/svg">
//                 <path fillRule="evenodd" d="M4 8a.5.5 0 0 1 .5-.5h5.793L8.146 5.354a.5.5 0 1 1 .708-.708l3 3a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708-.708L10.293 8.5H4.5A.5.5 0 0 1 4 8z" />
//               </svg>
//             </button>
//               </div>
//              </Paper>
//           </div>
         
          

//         </div>

       

//         <div className='paper-app' >
//         {permissions?.homePage?.RXQ && (
//         <div style={{width:'50%',marginLeft:"10%",marginTop:"10px"}}>
//              <Paper elevation={3} style={{width:'80%',borderRadius:'20px', padding:'15px'}} className='paper-print'>
//              <div >
//                 <img src={Manualpull} 
//                 className='report-board' alt="Provider Dashboard" />

//               </div>
//               <div>
//                 <h5>RXQ Patient Search </h5>
//                 <p>
//                 This feature allows users to efficiently search for RXQ patients across all locations, regardless of pharmacy affiliation, using a comprehensive search functionality.
//                 </p>
//                 <button onClick={()=>{ navigate('/rxqpatientsearch',{state: {name}})}} className='linkboard'>
//                 Explore Patients
//               <svg width="16px" height="16px" viewBox="0 0 16 16" style={{marginTop:'3px'}} fill="#d0b200" xmlns="http://www.w3.org/2000/svg">
//                 <path fillRule="evenodd" d="M4 8a.5.5 0 0 1 .5-.5h5.793L8.146 5.354a.5.5 0 1 1 .708-.708l3 3a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708-.708L10.293 8.5H4.5A.5.5 0 0 1 4 8z" />
//               </svg>
//             </button>
//               </div>

              
              
//              </Paper>
             
//           </div>
//           )}
           
//            {permissions?.homePage?.UserManage && (
//           <div style={{width:'50%',marginTop:"10px"}}>
//              <Paper elevation={3} style={{width:'80%',borderRadius:'20px', padding:'15px'}} className='paper-print'>
//              <div >
//                 <img src={User} 
//                 className='report-board' alt="Provider Dashboard" />

//               </div>
//               <div>
//                 <h5>User Management </h5>
//                 <p>
//                 This feature allows administrators to add, edit, and manage users efficiently within the system.
//                 </p>
//                 <button onClick={()=>{ navigate('/adduser',{state: {name}})}} className='linkboard'>
//                 Manage Users
//               <svg width="16px" height="16px" viewBox="0 0 16 16" style={{marginTop:'3px'}} fill="#d0b200" xmlns="http://www.w3.org/2000/svg">
//                 <path fillRule="evenodd" d="M4 8a.5.5 0 0 1 .5-.5h5.793L8.146 5.354a.5.5 0 1 1 .708-.708l3 3a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708-.708L10.293 8.5H4.5A.5.5 0 0 1 4 8z" />
//               </svg>
//             </button>
//               </div>

              
              
//              </Paper>
             
//           </div>
//           )}
//         </div>


//       </div>


    

//     {permissions?.homePage?.PBI && (

// <div style={{padding:'10px'}}>
// <div style={{display:'flex'}}>
//   <h4>Explore PowerBi Dashboards</h4>
// </div>
// <div style={{display:'flex',marginLeft:'10px',height:'100%',gap:'20px'}}>
//   <div style={{display:'flex'}}>
//      <Paper elevation={3} style={{flex: 1,width:'90%',borderRadius:'20px', padding:'15px'}} className='paper-print'>
//      <div >
//         <img src={MedForm} 
//         className='report-board' alt="Provider Dashboard" />

//       </div>
//       <div style={{ flex: 1, minWidth: '250px' }}>
//         <h5 style={{marginTop:"10px",fontWeight:'600'}}>Med List Print Dashboard</h5>
//         <p>
//         This report enables the selection of a patient and the printing of their medication list form.
//         </p>
//         <a href= {`${MediprintReport}`}
//         className='linkboard1' target="_blank" 
//         rel="noopener noreferrer">
//       View Dashboard
//       <svg width="16px" height="16px" viewBox="0 0 16 16" style={{marginTop:'3px'}} fill="#d0b200" xmlns="http://www.w3.org/2000/svg">
//         <path fillRule="evenodd" d="M4 8a.5.5 0 0 1 .5-.5h5.793L8.146 5.354a.5.5 0 1 1 .708-.708l3 3a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708-.708L10.293 8.5H4.5A.5.5 0 0 1 4 8z" />
//       </svg>
//     </a>
//       </div>
//      </Paper>
//   </div>



//   <div style={{display:'flex'}}>
//      <Paper elevation={3} style={{flex: 1,width:'90%',borderRadius:'20px', padding:'15px'}} className='paper-print'>
//      <div >
//          <img src={Noterepost} 
//          className='report-board' alt="Provider Dashboard" />

//       </div>
//       <div style={{ flex: 1, minWidth: '250px' }}>
//         <h5 style={{marginTop:"10px",fontWeight:'600'}}>Notes Repository Dashboard</h5>
//         <p>
//         This report allows for the tracking of changes made to the Patient Notes.
//         </p>
//         <a href={`${NotesReport}`} 
//         className='linkboard1' target="_blank" 
//         rel="noopener noreferrer">
//       View Dashboard
//       <svg width="16px" height="16px" viewBox="0 0 16 16" style={{marginTop:'3px'}} fill="#d0b200" xmlns="http://www.w3.org/2000/svg">
//         <path fillRule="evenodd" d="M4 8a.5.5 0 0 1 .5-.5h5.793L8.146 5.354a.5.5 0 1 1 .708-.708l3 3a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708-.708L10.293 8.5H4.5A.5.5 0 0 1 4 8z" />
//       </svg>
//     </a>
//       </div>
//      </Paper>
//   </div>

//   <div style={{display:'flex'}}>
//      <Paper elevation={3} style={{flex: 1,width:'90%',borderRadius:'20px', padding:'15px'}} className='paper-print'>
//      <div >
//         <img src={pagecal} 
//         className='report-board' alt="Provider Dashboard" />

//        </div>
//        <div style={{ flex: 1, minWidth: '250px' }}>
//         <h5 style={{marginTop:"10px",fontWeight:'600'}}>Patient Calendar Dashboard</h5>
//         <p>
//         This report provides the ability to view patients based on their next package date and last packaged date.     
//         </p>
//         <a href={`${PatientCalendarReport}`} 
//         className='linkboard1' target="_blank" 
//         rel="noopener noreferrer">
//       View Dashboard
//       <svg width="16px" height="16px" viewBox="0 0 16 16" style={{marginTop:'3px'}} fill="#d0b200" xmlns="http://www.w3.org/2000/svg">
//         <path fillRule="evenodd" d="M4 8a.5.5 0 0 1 .5-.5h5.793L8.146 5.354a.5.5 0 1 1 .708-.708l3 3a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708-.708L10.293 8.5H4.5A.5.5 0 0 1 4 8z" />
//       </svg>
//     </a>
//       </div>
//      </Paper>
//   </div>
//   <div style={{display:'flex'}}>
//      <Paper elevation={3} style={{flex: 1,width:'90%',borderRadius:'20px', padding:'15px'}} className='paper-print'>
//      <div >
//          <img src={history} 
//          className='report-board' alt="Provider Dashboard" />

//       </div>
//       <div style={{ flex: 1, minWidth: '250px' }}>
//         <h5 style={{marginTop:"10px",fontWeight:'600'}}>Medication Tracker History Dashboard</h5>
//         <p>
//         This report allows for the tracking of changes made to the medication list.
//         </p>
//         <a href={`${MediHistoryReport}`} 
//         className='linkboard1' target="_blank" 
//         rel="noopener noreferrer">
//       View Dashboard
//       <svg width="16px" height="16px" viewBox="0 0 16 16" style={{marginTop:'3px'}} fill="#d0b200" xmlns="http://www.w3.org/2000/svg">
//         <path fillRule="evenodd" d="M4 8a.5.5 0 0 1 .5-.5h5.793L8.146 5.354a.5.5 0 1 1 .708-.708l3 3a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708-.708L10.293 8.5H4.5A.5.5 0 0 1 4 8z" />
//       </svg>
//     </a>
//       </div>
//      </Paper>
//   </div>

  

  
// </div>
// </div>

//     )}

      

//     </div>
      

      
//     </div>
<div style={{width:'100%'}}>
      <div className='nav-main' >
      <nav className='nav-main'>
          <div className='navbar-full'>
            <div className='nav-left'>
            {/* <h5 className='h5-left' style={{display:'flex', marginLeft:'0.5rem', textAlign:'center', padding:'0.3rem'}}>Hello, Ramya Veeraraj</h5> */}
            <h4 className='h5-left' 
            style={{display:'flex', marginLeft:'0.5rem', textAlign:'center', padding:'0.3rem', fontSize:'1.2rem', fontFamily:'Volkhov, serif'}}>
                Hello, {name}{" "}
                {RoleDesc &&
                RoleDesc.toLowerCase() !== "null" &&
                RoleDesc.trim() !== ""
                  ? `(${RoleDesc})`
                  : ""}
              </h4>
            </div>
            
            <div className='nav-middle'>
            </div>

          
           <div className='nav-container'>
              <ul className={`nav-ul ${menuOpen ? "show":""}`}>
               
                <li>
                  <picture className='img-out' onClick={signout}>
                        <source srcset={poweroff} type="image/svg+xml"/>
                        <img src={poweroff} class="img-fluid" alt="..."/>
                    </picture>
                </li>
              </ul>

            </div>

          </div>
         </nav>
      </div>
         


  <div className='home-page'>

           <div className='Home-head'>Explore Application</div>
           <div style={{width:'100%', display:'flex',marginTop:'15px',gap:'1rem'}}>
            <div className='home-expapp'>
              <Paper elevation={3} className='home-perdiv' 
              sx={{border:0, borderRadius:'2rem', width:'73%',height:'100%'}}>
                <div className='com-imgDiv'>
                    <img className='home-img' src={capture} alt='logo'></img>
                  </div>
                  <div>
                    <h5  className='home-paperhead'>Compliance Pack Patients View</h5>
                  </div>
                  <div className='para'>
                    <p  className='home-papercontent'>This section contains information about patients and their medications who use Primary Plus compliance packaging.
                    </p>
                  </div>
                  <div className='view-linkhome' >
                     <a  className='home-paperview' href="#" 
                        onClick={(e) => {e.preventDefault(); handlecomppage()} } >View&nbsp;Portal</a>
                     <img className='home-arrow' src={homearrow}></img>
                  </div>
              </Paper>
            </div>


            <div className='home-expapp1'>
              <Paper elevation={3} className='home-perdiv1' sx={{border:0, borderRadius:'2rem', width:'73%',height:'100%'}}>
                <div className='com-imgDiv'>
                    <img className='home-img' src={Manualpull} alt='logo'></img>
                  </div>
                  <div>
                    <h5  className='home-paperhead'>Manual Pull</h5>
                  </div>
                  <div className='para'>
                    <p  className='home-papercontent'>
                      This feature allows for the manual addition of a patient to the Compliance Pack Patients list.                    </p>
                  </div>
                  <div className='view-linkhome'>
                    <a  className='home-paperview' href="#" 
                    onClick={(e) => { e.preventDefault();handlepullpage()}} >View&nbsp;Portal</a>
                     <img className='home-arrow' src={homearrow}></img>

                  </div>
              </Paper>
            </div>

           </div>

<div style={{width:'100%', display:'flex',marginTop:'15px',gap:'1rem'}}>
            <div className='home-expapp'>
              <Paper elevation={3} className='home-perdiv' sx={{border:0, borderRadius:'2rem', width:'73%',height:'100%'}}>
                <div className='com-imgDiv'>
                    <img className='home-img' src={Manualpull} alt='logo'></img>
                  </div>
                  <div>
                    <h5  className='home-paperhead'>RXQ Patient Search</h5>
                  </div>
                  <div className='para'>
                    <p  className='home-papercontent'>
                      This feature allows users to efficiently search for RXQ patients across all locations, regardless of pharmacy affiliation, using a comprehensive search functionality.
                    </p>
                  </div>
                  <div className='view-linkhome'>
                    <a  className='home-paperview' href="#" 
                    onClick={(e)=>{ e.preventDefault(); navigate('/rxqpatientsearch',{state: {name}})}}>Explore&nbsp;Patients</a>
                    <img className='home-arrow' src={homearrow}></img>

                  </div>
              </Paper>
            </div>


            <div className='home-expapp1'>
              <Paper elevation={3} className='home-perdiv1' sx={{border:0, borderRadius:'2rem', width:'73%',height:'100%'}}>
                <div className='com-imgDiv'>
                    <img className='home-img' src={User} alt='logo'></img>
                  </div>
                  <div>
                    <h5  className='home-paperhead'>User Management </h5>
                  </div>
                  <div className='para'>
                    <p  className='home-papercontent'>
                           This feature allows administrators to add, edit, and manage users efficiently within the system.
                   </p>
                  </div>
                  <div className='view-linkhome'>
                    <a  className='home-paperview'  href="#"
                    onClick={(e)=>{ e.preventDefault(); navigate('/adduser',{state: {name, calenderview: true}})}} >Manage&nbsp;Users</a>
                    <img className='home-arrow' src={homearrow}></img>
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
                    <img className='home-imgBI' src={MedForm} alt='logo'></img>
                  </div>
                  <div>
                    <h5  className='home-paperheadBI'>Med List Print Dashboard</h5>
                  </div>
                  <div  className='paraBI'>
                    <p  className='home-papercontentBI'>
                     This report enables the selection of a patient and the printing of their medication list form.
                    </p>
                  </div>
                  <div className='view-linkhome'>
                    <a className='home-paperviewBI' href= {`${MediprintReport}`} target="_blank" 
                    rel="noopener noreferrer">
                      View&nbsp;Dashboard</a>
                    <img className='home-arrow1' src={homearrow}></img>
                  </div>
              </Paper>
            </div>

            <div className='home-expappBI'>
              <Paper elevation={3} className='home-perdivBI' 
              sx={{border:0, borderRadius:'1.5rem', width:'95%',height:'98%'}}>
                <div className='com-imgDiv'>
                    <img className='home-imgBI' src={Noterepost} alt='logo'></img>
                  </div>
                  <div>
                    <h5  className='home-paperheadBI'>Notes Repository Dashboard</h5>
                  </div>
                  <div className='paraBI'>
                    <p  className='home-papercontentBI'>
                      This report allows for the tracking of changes made to the Patient Notes.
                    </p>
                  </div>
                  <div className='view-linkhome'>
                    <a className='home-paperviewBI' href= {`${NotesReport}`} target="_blank" 
                        rel="noopener noreferrer">View&nbsp;Dashboard</a>
                    <img className='home-arrow1' src={homearrow}></img>
                  </div>
              </Paper>
            </div>

            <div className='home-expappBI'>
              <Paper elevation={3} className='home-perdivBI' 
              sx={{border:0, borderRadius:'1.5rem', width:'95%',height:'98%'}}>
                <div className='com-imgDiv'>
                    <img className='home-imgBI' src={pagecal} alt='logo'></img>
                  </div>
                  <div>
                    <h5  className='home-paperheadBI'>Patient Calendar Dashboard</h5>
                  </div>
                  <div className='paraBI'>
                    <p  className='home-papercontentBI'>
                      This report provides the ability to view patients based on their next package date and last packaged date.     
                    </p>
                  </div>
                  <div className='view-linkhome'>
                    <a className='home-paperviewBI' href= {`${PatientCalendarReport}`} target="_blank" 
                       rel="noopener noreferrer">View&nbsp;Dashboard</a>
                    <img className='home-arrow1' src={homearrow}></img>
                  </div>
              </Paper>
            </div>

            <div className='home-expappBI'>
              <Paper elevation={3} className='home-perdivBI' 
              sx={{border:0, borderRadius:'1.5rem', width:'95%',height:'98%'}}>
                <div className='com-imgDiv'>
                    <img className='home-hisimgBI' src={history} alt='logo'></img>
                  </div>
                  <div>
                    <h5  className='home-paperheadBI'>Medication Tracker History Dashboard</h5>
                  </div>
                  <div className='paraBI'>
                    <p  className='home-papercontentBI'>
                       This report allows for the tracking of changes made to the medication list.
                    </p>
                  </div>
                  <div className='view-linkhome'>
                    <a className='home-paperviewBI' href= {`${MediHistoryReport}`} target="_blank" 
                       rel="noopener noreferrer">View&nbsp;Dashboard</a>
                    <img className='home-arrow1' src={homearrow}></img>
                  </div>
              </Paper>
            </div>
           

            </div>
         </div>


    </div>
  );
};

export default Home;
