import { useState, useEffect } from "react";
import "./style.css";

const items = [
  {
    name: "Home",
    content: "Vivamus magna justo, lacinia eget consectetur sed, convallis at tellus.",
    icon: "home"
  },
  {
    name: "About",
    content: "Cras ultricies ligula sed magna dictum porta.",
    icon: "info"
  },
  {
    name: "Contact",
    content: "Praesent sapien massa, convallis a pellentesque nec, egestas non nisi.",
    icon: "mail"
  },
];

export const Widget = () => {
  const [activeBlock, setActiveBlock] = useState(0);
  const [menuHeight, setMenuHeight] = useState(200); // 기본 높이 설정

  useEffect(() => {
    const computed = getComputedStyle(document.documentElement);
    const height = computed.getPropertyValue("--menu-height").trim();
    setMenuHeight(parseInt(height));
  }, []);

  const toggleMenuBlock = (index) => setActiveBlock(index);

  return (
    <section className="page widget-2-page">
      <div className="widget-2-card">
        <div className="buttons">
          {items.map((item, index) => (
            <button
              key={item.name}
              className={index === activeBlock ? "active" : ""}
              onClick={() => toggleMenuBlock(index)}
            >
              <span className="material-symbols-outlined">{item.icon}</span>
              {item.name}
            </button>
          ))}
        </div>
        <div className="wrapper">
          <div
            className="content"
            style={{
              transform: `translateY(-${menuHeight * activeBlock}px)`,
            }}
          >
            {items.map((item) => (
              <div key={item.name} className="block">
                <h2>{item.name}</h2>
                <p>{item.content}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
