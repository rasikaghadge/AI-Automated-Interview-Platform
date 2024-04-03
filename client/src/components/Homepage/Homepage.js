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
      }
    };
    setTimeout(() => {
      refreshToken();
    }, 10000)
  });

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
