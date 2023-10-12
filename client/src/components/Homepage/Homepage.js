import { useNavigate } from "react-router-dom";
import Navbar from "../Navbar/NavBar";
import Hero from "../Hero/Hero";
import Info from "../Info/Info";
import About from "../About/About";
import Footer from "../Footer/Footer";
import { decode } from "jsonwebtoken";
import * as api from "../..//api/index.js";
import { useState, useEffect } from "react";
import axios from "axios";
axios.defaults.baseURL = api.baseURL;

let prevUserToken = null;

const Homepage = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("profile"));
  const [userRole, setUserRole] = useState("");

  if (!user) {
    navigate("/login");
  }

  useEffect(() => {
    const checkUserRole = async () => {
      try {
        const decodedToken = decode(user.token);
        if (decodedToken) {
          const userId = decodedToken.id;
          console.log(decodedToken.email);
          console.log(userId);
          console.log(axios.defaults.baseURL);
          let tokenStr = "Bearer " + user.token;
          const response = await axios.get(`/profiles/${userId}`, {
            headers: { Authorization: tokenStr },
          });
          const data = response.data;
          setUserRole(data.role);
          console.log("User role is " + data.role);
          console.log(data);
        } else {
          setUserRole("");
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
        setUserRole("");
      }
    };

    // Check if the user data has changed before making the request
    if (user && user.token !== prevUserToken) {
      checkUserRole();
    }

    // Update the previous user token for the next comparison
    prevUserToken = user.token;
  }, [user]);

  return (
    <div className="homepage">
      <Navbar />
      <Hero userRole={userRole} />
      <Info />
      <About />
      {/* <Reviews /> */}
      <Footer />
    </div>
  );
};

export default Homepage;
