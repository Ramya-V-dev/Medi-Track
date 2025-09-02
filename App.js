// import logo from './logo.svg';
import "./App.css";
import Navbar from "./Dashboard/Navbar";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Finallogin from "./Finallogin/Finallogin";
import PatientBoard from "./Dashboard/PatientBoard";
import ViewDetails from "./Dashboard/ViewDetails";
import Medilist from "./Dashboard/Medilist";
import LibertyList from "./Dashboard/LibertyList";
import LibertyAll from "./Dashboard/LibertyAll";
import NotesHistory from "./Dashboard/NotesHistory";
import ManualPull from "./Dashboard/ManualPull";
import Delete_History from "./Dashboard/Delete_History";
import Home from "./Dashboard/Home";
import MedSnap from "./Dashboard/MedSnap";
import Viewmedlist from "./Dashboard/Viewmedlist";
import Gridboot from "./TestBootstrap/Gridboot";
import CalendarView from "./Finallogin/CalendarView";
import PasswordChange from "./Finallogin/Passwordchange";
import UserManagement from "./Finallogin/UserManagement";
import Rxqpatientsearch from "./Dashboard/RXQPatientsearch";
import { useDispatch } from 'react-redux';
import { setlibertyRow } from './Redux/slice';
import { useEffect } from "react";
function App() {

  // const dispatch = useDispatch();

  // useEffect(() => {
  //   const data = localStorage.getItem('data');
  //   console.log(data,'data')
  //   if (data) {
  //     dispatch(setlibertyRow(JSON.parse(data)));
  //   }
  // }, [dispatch]);

  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Finallogin />} />
          <Route path="/homepage" element={<Home />}></Route>
          <Route path="/patientdet" element={<PatientBoard />} />
          <Route path="/liberty/" element={<LibertyList />}></Route>
          <Route path="/libertyall/" element={<LibertyAll />}></Route>
          <Route path="/medilist/" element={<Medilist />}></Route>
          <Route
            path="/medilistimprt/:PatientIdentifier"
            element={<Medilist />}
          ></Route>
          <Route path="/notes/" element={<NotesHistory />}></Route>
          <Route path="/view" element={<ViewDetails />}></Route>
          <Route path="manual" element={<ManualPull />}></Route>
          <Route path="del_history/" element={<Delete_History />}></Route>
          <Route path="/medsnap" element={<MedSnap />}></Route>
          <Route path="/viewmedlist" element={<Viewmedlist />}></Route>
          <Route path="/caldrvw" element={<CalendarView />}></Route>
          <Route path="/changingpwd" element={<PasswordChange />}></Route>
          <Route
            path="/rxqpatientsearch"
            element={<Rxqpatientsearch />}
          ></Route>
          <Route path="/adduser" element={<UserManagement />}></Route>
        </Routes>
      </Router>

      {/* <Navbar/> */}

      {/* <Gridboot/> */}
    </div>
  );
}

export default App;
