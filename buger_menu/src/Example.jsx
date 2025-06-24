import { useState } from "react";
import { BrowserRouter, Routes, Route, Outlet, useNavigate, } from "react-router-dom";
import "./styles.css";

const links = [
    "about",
    "portfolio",
    "services",
    "contact",
];

const Layout = () =>{
    const navigate = useNavigate();

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    const isOpen = isMenuOpen ? "open" : "";

    const onClick = (href) => {
        toggleMenu();
        navigate(href);
    };

    return (
        <>
            <button className={`buger${isOpen}`} onClick={toggleMenu}></button>
            <div className ={`background ${isOpen}`}></div>
            <div className = {`menu${isOpen}`}>
                <nav>
                    {links.map((link,index)=>(
                        <a key={link} className = {isMenuOpen ? "appear" : ""} style = {{animationDelay: `0.${index+1}s`}} onClick={() => onClick(link)}>
                            {link}
                        </a>
                    ))}
                </nav>
            </div>
            <main className = {`page${isOpen}`}>
                <Outlet />
            </main>
        </>
    );
};

const Page = ({ title, content }) => {
    return (
        <>
            <h2>{title}</h2>
            <p>{content}</p>
        </>
    );
};

const About = () => (
    <Page 
        title = "About"
        content = {`Vivamus. . .`}
    />
);

export const Example = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route path = "about" element = {<About />} />
                    <Route path = "portfolio" element = {<Portfolio />} />
                    <Route path = "services" element = {<Services />} />
                    <Route path = "contact" element = {<Contact />} />
                </Route>
            </Routes>
        </BrowserRouter>
    )
}