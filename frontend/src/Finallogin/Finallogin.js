import React, { useEffect, useState } from "react";
import "./login.css"; // Import your CSS file
import avatar from "./img/avatar.svg"; // Import your avatar image
import wave from "../Finallogin/img/wave.png";
import bg from "./img/bg.svg";
import bg1 from "./img/bg2.svg";
import bg2 from "./img/bg3.svg";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { UseDispatch, useDispatch } from "react-redux";
import { settoken } from "../Redux/slice";
import image from "../Finallogin/img/image.png";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from "react-responsive-carousel";
import { TextField } from "@mui/material";
import InputAdornment from "@mui/material/InputAdornment";
import PersonIcon from '@mui/icons-material/Person';
import arrows from '../Dashboard/img/arrows.png';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const BaseUrl = process.env.REACT_APP_API_BASE_URL;

const Finallogin = () => {
  useEffect(() => {
    const userLogo = document.querySelector(".user-logo");
    userLogo.classList.add("rotate-once");
  }, []);

  const addFocusClass = (e) => {
    let parent = e.target.parentNode.parentNode;
    parent.classList.add("focus");
  };

  const removeFocusClass = (e) => {
    let parent = e.target.parentNode.parentNode;
    if (e.target.value === "") {
      parent.classList.remove("focus");
    }
  };

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const handleroutepwd = () => {
    navigate("/changingpwd");
  };

  const [errors, setErrors] = useState({});
  const [errmsg, setErrmsg] = useState("");
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const dispatch = useDispatch();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const errors = {};
    // Perform validation
    if (!formData.username) {
      errors.username = "please enter email";
    } else if (!isValidEmail(formData.username)) {
      errors.username = "Please Enter Valid Email Address";
    }
    if (!formData.password) {
      errors.password = "Please Enter Current Password";
    } else if (formData.password.length < 8) {
      errors.password = "Password must be at least 8 characters";
    }

    if (Object.keys(errors).length === 0) {
      try {
        const response = await axios.post(`${BaseUrl}/logins`, {
          pLoginName: formData.username,
          pPassword: formData.password,
        });

        console.log("Login successful", response.data.Role);
        const token = response.data.token;
        dispatch(
          settoken({
            token,
            tokenname: response.data.name,
            Role: response.data.Role,
            RoleDesc: response.data.RoleDesc,
          })
        );
        navigate("/homepage", {
          state: {
            name: response.data.name,
            Role: response.data.Role,
            RoleDesc: response.data.RoleDesc,
          },
        });
      } catch (error) {
        if (error.response) {
          // Check for the error code and message from the backend
          const code = error.response.data.code;
          const message = error.response.data.message;
          console.log(error.response.data.message, "error found");
          // Set the appropriate error message based on the backend response
          if (code === 4060 || code) {
            setErrmsg("Error: " + message);
          } else if (code === 53 || code === 10061 || code === 18456) {
            setErrmsg("Error: " + message);
          } else if (error.response.status === 401) {
            // Generic message for any other error
            setErrmsg(
              "Uh oh! Looks like you mistyped your username or password. Try again!"
            );
          } else if (error.response.status === 403) {
            setErrmsg(
              "Uh oh! Looks like you mistyped your username or password. Try again!"
            );
          } else if (error.response.data.message) {
            setErrmsg("Error " + message);
          }
          // }
        } else {
          // Any other error (like a configuration issue)
          setErrmsg(
            "Back-End service is not running .Please restart the application."
          );
        }
      }
    }
    setErrors(errors);
  };

  const isValidEmail = (email) => {
    // Email validation regex pattern
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  };

  return (
    <div >
      {/* <img className="wave" src={image} alt="wave" /> */}

      {/* <div className="container">
        <div className="img">
          <Carousel
            autoPlay={2000}
            infiniteLoop={true}
            showThumbs={false}
            showIndicators={true}
            showStatus={false}
          >
            <div>
              <img src={bg} alt="background" />
            </div>
            <div>
              <img src={bg1} alt="background" />
            </div>
            <div>
              <img src={bg2} alt="background" />
            </div>
          </Carousel>
        </div>
        <div className="login-content">
          <form onSubmit={handleSubmit}>
            <img className="user-logo" src={avatar} alt="avatar" />
            <h2 style={{ fontSize: "35px" }}>PlusPack Med Tracker</h2>
            {errmsg && <p style={{ color: "red" }}>{errmsg}</p>}

            <div className="input-div one">
              <div className="i">
                <i className="fas fa-user"></i>
              </div>
              <div className="div">
                <h5>Username</h5>
                <input
                  type="text"
                  className="input"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  onFocus={addFocusClass}
                  onBlur={removeFocusClass}
                />
                <span>
                  {errors.username && (
                    <p style={{ color: "red" }}>{errors.username}</p>
                  )}
                </span>
              </div>
            </div>

            <div className="input-div pass">
              <div className="i">
                <i className="fas fa-lock"></i>
              </div>
              <div className="div">
                <h5>Password</h5>
                <input
                  type="password"
                  className="input"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  onFocus={addFocusClass}
                  onBlur={removeFocusClass}
                />
                <span>
                  {errors.password && (
                    <p style={{ color: "red" }}>{errors.password}</p>
                  )}
                </span>
              </div>
            </div>
            
            <button type="submit" className="btn" style={{ color: "white" }}>
              Login
            </button>
            <button
              style={{
                border: "none",
                marginLeft: "40%",
                color: "blue",
                backgroundColor: "white",
              }}
              onClick={handleroutepwd}
            >
              ChangePassword
            </button>
          </form>
        </div>
      </div> */}

      <img className="wave" src={image} alt="wave" />

     <div style={{width:'100%',display:'flex'}}>
        <div 
        className="login-container"
        // style={{width:'50%'}}
        >
        <div className="img">
          <Carousel
            autoPlay={2000}
            infiniteLoop={true}
            showThumbs={false}
            showIndicators={true}
            showStatus={false}
          >
            <div>
              <img src={bg} alt="background" />
            </div>
            <div>
              <img src={bg1} alt="background" />
            </div>
            <div>
              <img src={bg2} alt="background" />
            </div>
          </Carousel>
        </div>
      </div>

      <div className="login-right-side" 
      // style={{width:'50%',marginTop:"3%"
      //   ,'@media screen and (min-width: 1900px) and (max-width:4000px)': {
      //     marginTop:'50%'
      //   }}}
        >
        {/* <div>
          <form>
            <div>
              <img className="user-logo" src={avatar} alt="avatar" />
              <h2 className="login-head">PlusPack Med Tracker</h2>
            </div>
            <div style={{display:'flex'}}
            >
               
            </div>
          </form>
        </div> */}

        <div className="login-content">
          <form onSubmit={handleSubmit}>
            <img className="user-logo" src={avatar} alt="avatar" />
            <h2 className="logincontent-h2" >PlusPack Med Tracker</h2>
            {errmsg && <p style={{ color: "red" }}>{errmsg}</p>}

            <div className="input-div one">
              <div className="i">
                <i className="fas fa-user"></i>
              </div>
              <div className="div">
                <h5>Username</h5>
                <input
                  type="text"
                  className="input"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  onFocus={addFocusClass}
                  onBlur={removeFocusClass}
                />
                <span>
                  {errors.username && (
                    <p style={{ color: "red" }}>{errors.username}</p>
                  )}
                </span>
              </div>
            </div>

            <div className="input-div pass">
              <div className="i">
                <i className="fas fa-lock"></i>
              </div>
              <div className="div">
                <h5>Password</h5>
                <input
                  type="password"
                  className="input"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  onFocus={addFocusClass}
                  onBlur={removeFocusClass}
                />
                <span>
                  {errors.password && (
                    <p style={{ color: "red" }}>{errors.password}</p>
                  )}
                </span>
              </div>
            </div>
            
            <button type="submit" className="btn" style={{ color: "white",fontWeight:'bold' }}>
              Login
            </button>
            <button
            className="change-password-btn" 
              onClick={handleroutepwd}
            >
              Change&nbsp;Password
              <ArrowForwardIcon sx={{color:'yellow',marginTop:'3px'}} className="arr-logo"></ArrowForwardIcon> 
              {/* <img className="arr-logo" src={arrows} alt="logo"></img> */}
            </button>
          </form>
        </div>

      </div>
     </div>
     


    </div>
  );
};

export default Finallogin;
