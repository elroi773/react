import {
    BrowserRouter,
    Routes,
    Route,
    Outlet,
    useNavigate,
    useLocation,
} from "react-router-dom";

import "./styles.css";
import { Children } from "react"; // 이건 actually 필요 없음. 제거 가능.

const About = () => (
    <section style={{ background: "#fff", color: "#000" }}>
        <Nav title="About" />
    </section>
);

const Portfolio = () => (
    <section style={{ background: "#000", color: "#fff" }}>
        <Nav title="Portfolio" />
    </section>
);

const Contact = () => (
    <section style={{ background: "#000", color: "#fff" }}>
        <Nav title="Contact" />
    </section>
);

const Vision = () => (
    <section style={{ background: "#000", color: "#fff" }}>
        <Nav title="Vision" />
    </section>
);

const Linkk = ({ to, children, colorEnd }) => {
    const navigate = useNavigate();
    const location = useLocation();

    const handleClicked = () => {
        const bubbles = document.querySelector("#bubbles");
        bubbles.classList.add("show");

        const bubbleSeconde = bubbles.querySelector("div:nth-child(2)");
        bubbleSeconde.style.background = colorEnd;

        setTimeout(() => navigate(to), 1000); // 1000ms = 1초. 너무 길면 UX 안 좋아요.

        setTimeout(() => {
            bubbles.classList.remove("show");
            bubbles.classList.add("hide");
        }, 1200);

        setTimeout(() => bubbles.classList.remove("hide"), 2400);
    };

    return <a onClick={handleClicked}>{children}</a>;
};

const Nav = ({ title }) => (
    <nav>
        <h1>{title}</h1>
        <ul>
            <li><Linkk to="/about" colorEnd="#fff">About</Linkk></li>
            <li><Linkk to="/portfolio" colorEnd="#fff">Portfolio</Linkk></li>
            <li><Linkk to="/contact" colorEnd="#fff">Contact</Linkk></li>
            <li><Linkk to="/vision" colorEnd="#fff">Vision</Linkk></li>
        </ul>
    </nav>
);

const Bubbles = () => (
    <div id="bubbles">
        <div
            style={{ animationDuration: "1200ms" }}
            className="bubbles__first"
        />
        <div
            style={{ animationDuration: "1200ms" }}
            className="bubbles__second"
        />
    </div>
);

const Layout = () => (
    <>
        <Bubbles />
        <Outlet />
    </>
);

export const Example = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route path="about" element={<About />} />
                    <Route path="portfolio" element={<Portfolio />} />
                    <Route path="contact" element={<Contact />} />
                    <Route path="vision" element={<Vision />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
};
