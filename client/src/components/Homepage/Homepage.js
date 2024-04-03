import { useNavigate } from "react-router-dom";
import NavBar from "../NavBar/NavBar";
import Hero from "../Hero/Hero";
import Info from "../Info/Info";
import About from "../About/About";
import Footer from "../Footer/Footer";
import { decode } from "jsonwebtoken";
import { useState, useEffect } from "react";
import { refresh } from '../../api/index';

const Homepage = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("profile"));
  const [userRole, setUserRole] = useState("");

  useEffect(() => {
    const checkUserRole = async () => {
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
    if (user) {
      checkUserRole();
    }
  }, [user]);

  useEffect(() => {
    let timeoutId;

    const refreshToken = async () => {
      try {
        const response = await refresh({ token: user?.refreshToken });
        if (!response.status === 200) {
          localStorage.removeItem("profile");
          navigate("/login");
        }
        const newToken = response.data.token;
        localStorage.setItem("profile", JSON.stringify({ ...user, token: newToken }));
      } catch (error) {
        localStorage.removeItem("profile");
        navigate("/login");
      } finally {
        // Set the next refresh after 20 seconds
        timeoutId = setTimeout(refreshToken, 20000);
      }
    };

    // Start the initial refresh timer
    timeoutId = setTimeout(refreshToken, 20000);

    // Clean up the timer on component unmount or when user changes
    return () => clearTimeout(timeoutId);
  }, [user, navigate]);

  return (
    <div className="homepage">
      <NavBar userRole={userRole} />
      <Hero userRole={userRole} />
      <Info />
      <About />
      {/* <Reviews /> */}
      <Footer />
    </div>
  );
};

export default Homepage;
