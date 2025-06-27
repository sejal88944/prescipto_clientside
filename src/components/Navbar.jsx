import React, { useContext, useState, useMemo } from "react";
import { assets } from "../assets/assets";
import { NavLink, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";

const navLinks = [
  { path: "/", label: "HOME" },
  { path: "/doctors", label: "ALL DOCTORS" },
  { path: "/about", label: "ABOUT" },
  { path: "/contact", label: "CONTACT" }
];

const MobileMenu = ({ showMenu, setShowMenu }) => {
  return (
    <div
      className={`fixed inset-0 z-20 bg-white transition-all duration-300 ${
        showMenu ? "opacity-100 visible" : "opacity-0 invisible"
      } md:hidden`}
      aria-hidden={!showMenu}
    >
      <div className="flex items-center justify-between px-5 py-6">
        <img className="w-36" src={assets.logo} alt="Logo" />
        <button
          onClick={() => setShowMenu(false)}
          aria-label="Close menu"
          className="p-1"
        >
          <img className="w-7" src={assets.cross_icon} alt="Close menu" />
        </button>
      </div>
      <nav>
        <ul className="flex flex-col items-center gap-2 mt-5 px-5 text-lg font-medium">
          {navLinks.map((link) => (
            <li key={link.path}>
              <NavLink
                to={link.path}
                onClick={() => setShowMenu(false)}
                className={({ isActive }) =>
                  `px-4 py-2 rounded inline-block ${
                    isActive ? "text-primary" : ""
                  }`
                }
              >
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

const Navbar = () => {
  const navigate = useNavigate();
  const { token, setToken, userData } = useContext(AppContext);
  const [showMenu, setShowMenu] = useState(false);

  const logout = () => {
    setToken(null);
    localStorage.removeItem("token");
    navigate("/");
  };

  const userMenuItems = useMemo(() => [
    { label: "My Profile", action: () => navigate("/my-profile") },
    { label: "My Appointments", action: () => navigate("/my-appointments") },
    { label: "Logout", action: logout }
  ], [navigate]);

  return (
    <header className="flex items-center justify-between text-sm py-4 mb-5 border-b border-b-gray-400">
      <button onClick={() => navigate("/")} aria-label="Home">
        <img className="w-44" src={assets.logo} alt="Logo" />
      </button>
      
      <nav className="hidden md:block">
        <ul className="flex gap-5 font-medium">
          {navLinks.map((link) => (
            <li key={link.path}>
              <NavLink
                to={link.path}
                className={({ isActive }) =>
                  `py-1 block relative after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:h-0.5 after:bg-primary after:w-0 after:transition-all hover:after:w-3/5 ${
                    isActive ? "after:w-3/5" : ""
                  }`
                }
              >
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      
      <div className="flex items-center gap-4">
        {token && userData ? (
          <div className="relative group">
            <button
              className="flex items-center gap-2"
              aria-label="User menu"
            >
              <img
                className="w-8 rounded-full"
                src={userData.image || assets.default_avatar}
                alt="User profile"
              />
              <img
                className="w-2.5 transition-transform group-hover:rotate-180"
                src={assets.dropdown_icon}
                alt=""
              />
            </button>
            <div className="absolute right-0 pt-2 z-20 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
              <div className="min-w-48 bg-white shadow-lg rounded flex flex-col p-2">
                {userMenuItems.map((item) => (
                  <button
                    key={item.label}
                    onClick={item.action}
                    className="px-4 py-2 text-left hover:bg-gray-100 rounded"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <button
            onClick={() => navigate("/login")}
            className="bg-primary text-white px-8 py-3 rounded-full font-light hidden md:block hover:bg-primary-dark transition-colors"
          >
            Create account
          </button>
        )}
        
        <button
          onClick={() => setShowMenu(true)}
          className="md:hidden p-1"
          aria-label="Open menu"
        >
          <img className="w-6" src={assets.menu_icon} alt="Menu" />
        </button>
        
        <MobileMenu showMenu={showMenu} setShowMenu={setShowMenu} />
      </div>
    </header>
  );
};

export default React.memo(Navbar);