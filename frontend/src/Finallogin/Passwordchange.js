import React, { useEffect, useState } from "react";
import "./Passwordchange.css"; // Import your CSS file
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
import { IconButton, InputAdornment } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import {BaseUrl} from '../FrontConfig.js'
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';

const BaseUrl = process.env.REACT_APP_API_BASE_URL;

const PasswordChange = () => {
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

  const [showOldPassword, setShowOldPassword] = useState(false);

  // ... other functions

  const handleToggleOldPasswordVisibility = () => {
    setShowOldPassword(!showOldPassword);
  };

  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // ... other functions

  const handleToggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const [changePasswordData, setChangePasswordData] = useState({
    Username: "",
    OldPassword: "",
    NewPassword: "",
    confirmNewPassword: "",
  });

  const handleChangePasswordInput = (e) => {
    const { name, value } = e.target;

    setChangePasswordData({
      ...changePasswordData,
      [name]: value,
    });
    if (errors[name]) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: "",
      }));
    }
  };

  const [errors, setErrors] = useState({});
  const [errmsg, setErrmsg] = useState("");
  const navigate = useNavigate();

  const handleroutelogin = () => {
    navigate("/");
  };

  const isValidEmail = (email) => {
    // Email validation regex pattern
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  };

  // console.log(errors,'error')

  const handleChangepwd = async (e) => {
    e.preventDefault();

    const errors = {};
    // Perform validation
    if (!changePasswordData.Username) {
      errors.Username = "Please Enter Email";
    } else if (!isValidEmail(changePasswordData.Username)) {
      errors.Username = "Please Enter Valid Email Address";
    }
    if (!changePasswordData.OldPassword) {
      errors.OldPassword = "Please Enter Current Password";
    } else if (changePasswordData.OldPassword.length < 8) {
      errors.OldPassword = "Password must be at least 8 characters";
    }
    if (!changePasswordData.NewPassword) {
      errors.NewPassword = "Please Enter New Password";
    } else if (changePasswordData.NewPassword.length < 8) {
      errors.NewPassword = "Password must be at least 8 characters";
    }
    if (!changePasswordData.confirmNewPassword) {
      errors.confirmNewPassword = "Please Enter New Password";
    } else if (changePasswordData.confirmNewPassword.length < 8) {
      errors.confirmNewPassword = "Password must be at least 8 characters";
    } else if (
      changePasswordData.NewPassword !== changePasswordData.confirmNewPassword
    ) {
      errors.confirmNewPassword = "New Passwords Do Not Match";
    }

    if (Object.keys(errors).length === 0) {
      setIsButtonDisabled(true);
      try {
        const resp = await axios.put(`${BaseUrl}/changepwd`, {
          Username: changePasswordData.Username,
          OldPassword: changePasswordData.OldPassword,
          NewPassword: changePasswordData.NewPassword,
        });
        console.log(resp.data.data, "status check");
        // navigate('/')
        toast.success("Password updated successfully!", {
          position: "top-right",
          autoClose: 3000,
        });

        // Navigate after toast is shown
        setTimeout(() => {
          navigate("/");
        }, 2000);
      } catch (error) {
        console.log("Backend error", error.response);
        // alert('Backend error',error.respo.data.message)
        if (error.response.status === 400) {
          errors.OldPassword = error.response.data.message;
        } else if (error.response.status === 401) {
          errors.Username = error.response.data.message;
        }
        setIsButtonDisabled(false);
      }
    }
    setErrors(errors);
  };

  return (
    <div>
      <img className="wave" src={image} alt="wave" />

      <div style={{width:'100%',display:'flex'}}>
              <div 
              className="login-container"
              // style={{width:'50%'}}
              >
              <div className="img1">
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
      
            <div className="login-right-side1" 
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
      
              <div className="login-content1">
                <form onSubmit={handleChangepwd}>
                  <img className="user-logo" src={avatar} alt="avatar" />
                  <h2 className="logincontent-h2" >Change Password</h2>
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
                  name="Username"
                  value={changePasswordData.Username}
                  onChange={handleChangePasswordInput}
                  onFocus={addFocusClass}
                  onBlur={removeFocusClass}
                />
                <span>
                  {errors.Username && (
                    <p style={{ color: "red" }}>{errors.Username}</p>
                  )}
                </span>
              </div>
            </div>
            <div className="input-div pass">
              <div className="i">
                <i className="fas fa-lock"></i>
              </div>
              <div className="div">
                <h5>Old Password</h5>
                <input
                  type="password"
                  className="input"
                  name="OldPassword"
                  value={changePasswordData.OldPassword}
                  onChange={handleChangePasswordInput}
                  onFocus={addFocusClass}
                  onBlur={removeFocusClass}
                />
                <span>
                  {errors.OldPassword && (
                    <p style={{ color: "red" }}>{errors.OldPassword}</p>
                  )}
                </span>
              </div>
            </div>

            <div className="input-div pass">
              <div className="i">
                <i className="fas fa-lock"></i>
              </div>
              <div className="div">
                <h5>New Password</h5>
                <input
                  type={showOldPassword ? "text" : "password"}
                  className="input"
                  name="NewPassword"
                  value={changePasswordData.NewPassword}
                  onChange={handleChangePasswordInput}
                  onFocus={addFocusClass}
                  onBlur={removeFocusClass}
                />

                <InputAdornment
                  position="end"
                  style={{
                    position: "absolute",
                    right: "10px",
                    top: "50%",
                    transform: "translateY(-50%)",
                  }}
                >
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleToggleOldPasswordVisibility}
                    edge="end"
                  >
                    {showOldPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
                <span>
                  {errors.NewPassword && (
                    <p style={{ color: "red" }}>{errors.NewPassword}</p>
                  )}
                </span>
              </div>
            </div>

            <div className="input-div pass">
              <div className="i">
                <i className="fas fa-lock"></i>
              </div>
              <div className="div">
                <h5>Confirm Password</h5>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  className="input"
                  name="confirmNewPassword"
                  value={changePasswordData.confirmNewPassword}
                  onChange={handleChangePasswordInput}
                  onFocus={addFocusClass}
                  onBlur={removeFocusClass}
                />

                <InputAdornment
                  position="end"
                  style={{
                    position: "absolute",
                    right: "10px",
                    top: "50%",
                    transform: "translateY(-50%)",
                  }}
                >
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleToggleConfirmPasswordVisibility}
                    edge="end"
                  >
                    {showConfirmPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
                <span>
                  {errors.confirmNewPassword && (
                    <p style={{ color: "red" }}>{errors.confirmNewPassword}</p>
                  )}
                </span>
              </div>
            </div>
            <button
              type="submit"
              className="btn1"
              style={{ color: "white" }}
              disabled={isButtonDisabled}
            >
              Update
            </button>
            <button
              onClick={handleroutelogin}
              style={{
                border: "none",
                marginLeft: "55%",
                color: "blue",
                backgroundColor: "white",
              }}
            >
             <KeyboardArrowLeftIcon></KeyboardArrowLeftIcon> Back to login
            </button>
                </form>
              </div>
      
            </div>
           </div>

      {/* <div className="container">
        <div className="img">
          <ToastContainer />

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
          <form onSubmit={handleChangepwd}>
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
                  name="Username"
                  value={changePasswordData.Username}
                  onChange={handleChangePasswordInput}
                  onFocus={addFocusClass}
                  onBlur={removeFocusClass}
                />
                <span>
                  {errors.Username && (
                    <p style={{ color: "red" }}>{errors.Username}</p>
                  )}
                </span>
              </div>
            </div>
            <div className="input-div pass">
              <div className="i">
                <i className="fas fa-lock"></i>
              </div>
              <div className="div">
                <h5>Old Password</h5>
                <input
                  type="password"
                  className="input"
                  name="OldPassword"
                  value={changePasswordData.OldPassword}
                  onChange={handleChangePasswordInput}
                  onFocus={addFocusClass}
                  onBlur={removeFocusClass}
                />
                <span>
                  {errors.OldPassword && (
                    <p style={{ color: "red" }}>{errors.OldPassword}</p>
                  )}
                </span>
              </div>
            </div>

            <div className="input-div pass">
              <div className="i">
                <i className="fas fa-lock"></i>
              </div>
              <div className="div">
                <h5>New Password</h5>
                <input
                  type={showOldPassword ? "text" : "password"}
                  className="input"
                  name="NewPassword"
                  value={changePasswordData.NewPassword}
                  onChange={handleChangePasswordInput}
                  onFocus={addFocusClass}
                  onBlur={removeFocusClass}
                />

                <InputAdornment
                  position="end"
                  style={{
                    position: "absolute",
                    right: "10px",
                    top: "50%",
                    transform: "translateY(-50%)",
                  }}
                >
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleToggleOldPasswordVisibility}
                    edge="end"
                  >
                    {showOldPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
                <span>
                  {errors.NewPassword && (
                    <p style={{ color: "red" }}>{errors.NewPassword}</p>
                  )}
                </span>
              </div>
            </div>

            <div className="input-div pass">
              <div className="i">
                <i className="fas fa-lock"></i>
              </div>
              <div className="div">
                <h5>Confirm Password</h5>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  className="input"
                  name="confirmNewPassword"
                  value={changePasswordData.confirmNewPassword}
                  onChange={handleChangePasswordInput}
                  onFocus={addFocusClass}
                  onBlur={removeFocusClass}
                />

                <InputAdornment
                  position="end"
                  style={{
                    position: "absolute",
                    right: "10px",
                    top: "50%",
                    transform: "translateY(-50%)",
                  }}
                >
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleToggleConfirmPasswordVisibility}
                    edge="end"
                  >
                    {showConfirmPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
                <span>
                  {errors.confirmNewPassword && (
                    <p style={{ color: "red" }}>{errors.confirmNewPassword}</p>
                  )}
                </span>
              </div>
            </div>
            <button
              type="submit"
              className="btn"
              style={{ color: "white" }}
              disabled={isButtonDisabled}
            >
              Update
            </button>
            <button
              onClick={handleroutelogin}
              style={{
                border: "none",
                marginLeft: "40%",
                color: "blue",
                backgroundColor: "white",
              }}
            >
              Back to login
            </button>
          </form>
        </div>
      </div> */}

      
    </div>
  );
};

export default PasswordChange;
