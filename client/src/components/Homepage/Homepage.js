import { useNavigate } from "react-router-dom";
import NavBar from "../NavBar/NavBar";
import Hero from "../Hero/Hero";
import Info from "../Info/Info";
import About from "../About/About";
import Footer from "../Footer/Footer";
import { decode } from "jsonwebtoken";
import { useState, useEffect } from "react";

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
      // console.log(user.token)
      try {
        const decodedToken = decode(user.token);
        if (decodedToken) {
          const userRole = decodedToken.role;
          setUserRole(userRole);
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
      <NavBar />
      <Hero userRole={userRole} />
      <Info />
      <About />
      {/* <Reviews /> */}
      <Footer />
    </div>
  );
};

export default Homepage;
