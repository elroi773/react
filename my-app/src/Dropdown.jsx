import { useRef, useState } from "react";
import "./Dropdown.css";

const items = [{ name: "build", subItems: ["description"] }];

const Icon = ({ icon, className }) => (
  <span className={`${className} material-symbols-outlined`}> {icon}</span>
);

const MenuButton = ({
  name,
  icon,
  index,
  hasSubItems,
  subMenuHeight,
  onClick,
}) => {
  return (
    <button onClick={() => (onClick ? onClick(index, subMenuHeight) : null)}>
      <Icon icon={icon || name} />
      {name}
      {hasSubItems && <Icon icon="chevron_right" className="chevron" />}
    </button>
  );
};

const MenuItem = ({ name, index, activeSubMenu, subItems, onClick }) => {
  const menuRef = useRef(null);
  const isActive = activeSubMenu === index;
  return (
    <>
      <MenuButton
        onclick={subItems ? onClick : () => null}
        name={name}
        index={index}
        hasSubItems={!!subItems}
        subMenuHeight={menuRef.current?.clientHeight}
      />
      {subItems?.length && (
        <div ref={menuRef} className={`sub-menu ${isActive ? "open" : ""} `}>
          <>
            <MenuButton onClick={onclick} icon="arrow_back" name={name} />
            {subItems.map((subItem) => (
              <MenuButton key={subItem} name={subItem} />
            ))}
          </>
        </div>
      )}
    </>
  );
};

export const Dropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubMenuOpen, setIsSubMenuHeight] = useState(false);
  const [subMenuHeight, setSubMenuHeight] = useState();
  const [activeSubMenu, setActiveSubMenu] = useState();
  const handleClick = (index, subMenuHeight) => {
    setSubMenuHeight(subMenuHeight);
    setIsSubMenuOpen(index > -1);
  };
  return (
    <div className={`dropdown ${isOpen ? "open" : " "}`}>
      <button onClick={() => setIsOpen(!isOpen)}>
        <Icon icon="account_cicle" />
        Kim Wilson
        <Icon className="chevron" icon="expand_more" />
      </button>
      <div
        style={{
          height: `${subMenuHeight || 168}px`,
        }}
        className="menu"
      >
        <div className={`menu-inner ${isSubMenuOpen ? "open" : ""}`}>
          <div className="main-menu">
            {items.map((item, index) => (
              <MenuItem
                key={item.name}
                name={item.name}
                index={index}
                activeSubMenu={activeSubMenu}
                onClick={handleClick}
                subItems={item.subIems}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
