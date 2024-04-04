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
    let timeoutId;

    const refreshToken = async () => {
      try {
        const response = await refresh({ token: user?.refreshToken });
        if (response.statusText !== 'OK') {
          localStorage.removeItem("profile");
          navigate("/login");
        }
        const newToken = response.data.token;
        setUserRole(decode(newToken)?.role)
        localStorage.setItem("profile", JSON.stringify({ ...user, token: newToken }));
      } catch (error) {
        console.log(error)
        localStorage.removeItem("profile");
        setUserRole("")
        navigate("/login");
      } finally {
        timeoutId = setTimeout(refreshToken, 8000);
      }
    };

    // Start the initial refresh timer
    timeoutId = setTimeout(refreshToken, 8000);

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
