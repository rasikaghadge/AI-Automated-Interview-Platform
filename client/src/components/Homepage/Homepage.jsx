import { useNavigate } from "react-router-dom";
import NavBar from "../NavBar/NavBar";
import Hero from "../Hero/Hero";
import Info from "../Info/Info";
import About from "../About/About";
import Footer from "../Footer/Footer";
import { jwtDecode } from "jwt-decode";


import { useState, useEffect } from "react";
import { refreshToken } from "../../actions/auth";

const Homepage = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("profile"));
  const [userRole, setUserRole] = useState("");

  useEffect(() => {
      refreshToken(user).then((res) => {
        if(!res) {
          navigate('/login')
        }
      }).catch((err) => {
        console.log(err)
        navigate('/login')
      });
  }, [navigate, user])

  useEffect(() => {
    const checkUserRole = async () => {
      try {
        const decodedToken = jwtDecode(user.token);
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

  return (
    <div className="homepage">
      <NavBar userRole={userRole}/>
      <Hero userRole={userRole} />
      <Info />
      <About />
      {/* <Reviews /> */}
      <Footer />
    </div>
  );
};

export default Homepage;
