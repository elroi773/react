import { useState } from "react";
import "./styles.css";

const Menu = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const isOpen = isMenuOpen ? "open" : "";

  const links = ["about", "portfolio", "services", "contact"];

  return (
    <>
      <button className={`burger ${isOpen}`} onClick={toggleMenu}>
        ☰
      </button>
      <div className={`background ${isOpen}`}></div>
      <div className={`menu ${isOpen}`}>
        <nav>
          {links.map((link, index) => (
            <a
              key={link}
              className={isMenuOpen ? "appear" : ""}
              style={{ animationDelay: `0.${index + 1}s` }}
              href="#"
              onClick={(e) => {
                e.preventDefault();
                toggleMenu();
              }}
            >
              {link}
            </a>
          ))}
        </nav>
      </div>
      <main className={`page ${isOpen}`}>
        {/* 메뉴 열고 닫히는 UI만 구현, 내용은 없음 */}
        <h2>{isMenuOpen ? "Menu is Open" : "Menu is Closed"}</h2>
      </main>
    </>
  );
};

export default Menu;