import { useNavigate } from "react-router-dom";
import NavBar from "../NavBar/NavBar";
import Hero from "../Hero/Hero";
import Info from "../Info/Info";
import About from "../About/About";
// import Reviews from "../Reviews/Reviews";
import Footer from "../Footer/Footer";

const Homepage = () => {

    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('profile'))

    if(!user) {
        navigate('/login')
    }

    return (
        <div className="homepage">
            <NavBar />
            <Hero />
            <Info />
            <About />
            {/* <Reviews /> */}
            <Footer />
        </div>
    )
}

export default Homepage