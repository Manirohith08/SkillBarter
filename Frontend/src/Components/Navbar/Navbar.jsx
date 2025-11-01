import React, { useEffect } from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { Link } from "react-router-dom";
import Offcanvas from "react-bootstrap/Offcanvas";
import { useUser } from "../../util/UserContext";
import { Dropdown } from "react-bootstrap";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { 
  FaHome, 
  FaCompass, 
  FaComments, 
  FaUser, 
  FaSignOutAlt, 
  FaInfoCircle,
  FaQuestionCircle
} from "react-icons/fa";
import { MdDashboard } from "react-icons/md";

const UserProfileDropdown = () => {
  const { user, setUser } = useUser();
  const navigate = useNavigate();

  // Skill Energy Color Palette
  const colors = {
    primary: "#FF6B6B",
    secondary: "#FFA41B",
    accent: "#1DD3B0",
    background: "#FFF8E8",
    text: "#1E293B"
  };

  const handleLogout = async () => {
    localStorage.removeItem("userInfo");
    setUser(null);
    try {
      const response = await axios.get("/auth/logout");
      window.location.href = "http://localhost:5173/login";
    } catch (error) {
      console.log(error);
      if (error?.response?.data?.message) {
        console.error(error.response.data.message);
      }
    }
  };

  const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
    <div
      ref={ref}
      onClick={(e) => {
        onClick(e);
      }}
      style={{ 
        display: "flex", 
        alignItems: "center", 
        cursor: "pointer",
        padding: "8px 15px",
        borderRadius: "12px",
        background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`,
        transition: "all 0.3s ease",
        boxShadow: `0 4px 15px rgba(255, 107, 107, 0.3)`,
      }}
      className="profile-dropdown-toggle"
    >
      <div
        style={{
          width: "36px",
          height: "36px",
          borderRadius: "50%",
          overflow: "hidden",
          marginRight: "10px",
          border: "2px solid white",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
        }}
      >
        <img
          src={user?.picture}
          alt="User Avatar"
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </div>
      <span style={{ 
        fontFamily: "'Inter', sans-serif", 
        fontWeight: 700,
        color: "#FFFFFF",
        fontSize: "0.95rem"
      }}>
        {user?.name?.split(" ")[0]}
      </span>
    </div>
  ));

  const dropdownMenuStyle = {
    background: "#FFFFFF",
    borderRadius: "15px",
    border: `2px solid ${colors.primary}`,
    boxShadow: `0 15px 40px rgba(255, 107, 107, 0.2)`,
    padding: "10px",
    minWidth: "200px",
    marginTop: "10px",
  };

  const dropdownItemStyle = {
    fontFamily: "'Inter', sans-serif",
    fontSize: "0.95rem",
    fontWeight: 600,
    color: colors.text,
    padding: "12px 20px",
    borderRadius: "10px",
    transition: "all 0.3s ease",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "12px",
  };

  const CustomMenu = React.forwardRef(({ children, style, className, "aria-labelledby": labeledBy }, ref) => {
    return (
      <div ref={ref} style={{...style, ...dropdownMenuStyle}} className={className} aria-labelledby={labeledBy}>
        <ul className="list-unstyled" style={{ margin: 0 }}>
          {React.Children.toArray(children)}
        </ul>
      </div>
    );
  });

  return (
    <Dropdown>
      <Dropdown.Toggle as={CustomToggle} id="dropdown-custom-components" />

      <Dropdown.Menu as={CustomMenu}>
        <Dropdown.Item
          style={dropdownItemStyle}
          className="dropdown-item-custom"
          onClick={() => {
            console.log(user.username);
            navigate(`/profile/${user.username}`);
          }}
        >
          <FaUser style={{ color: colors.accent }} /> Profile
        </Dropdown.Item>
        <Dropdown.Item 
          style={dropdownItemStyle}
          className="dropdown-item-custom"
          onClick={handleLogout}
        >
          <FaSignOutAlt style={{ color: colors.primary }} /> Logout
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
};

const Header = () => {
  const [navUser, setNavUser] = useState(null);
  const { user } = useUser();
  const [discover, setDiscover] = useState(false);

  // Skill Energy Color Palette
  const colors = {
    primary: "#FF6B6B",
    secondary: "#FFA41B",
    accent: "#1DD3B0",
    background: "#FFF8E8",
    text: "#1E293B"
  };

  useEffect(() => {
    setNavUser(JSON.parse(localStorage.getItem("userInfo")));
  }, [user]);

  useEffect(() => {
    const handleUrlChange = () => {
      console.log("URL has changed:", window.location.href);
    };
    window.addEventListener("popstate", handleUrlChange);

    const temp = window.location.href.split("/");
    const url = temp.pop();
    if (url.startsWith("discover")) {
      setDiscover(true);
    } else {
      setDiscover(false);
    }
    return () => {
      window.removeEventListener("popstate", handleUrlChange);
    };
  }, [window.location.href]);

  const navbarStyle = {
    background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 50%, ${colors.accent} 100%)`,
    boxShadow: "0 8px 30px rgba(255, 107, 107, 0.2)",
    padding: "12px 0",
    borderBottom: `3px solid ${colors.accent}`,
  };

  const brandStyle = {
    fontFamily: "'Poppins', sans-serif",
    fontSize: "1.8rem",
    fontWeight: 900,
    color: "#FFFFFF",
    letterSpacing: "1px",
    textTransform: "uppercase",
    textShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
    display: "flex",
    alignItems: "center",
    gap: "10px",
  };

  const navLinkStyle = {
    fontFamily: "'Inter', sans-serif",
    fontSize: "1rem",
    fontWeight: 700,
    color: "#FFFFFF",
    padding: "10px 20px",
    borderRadius: "10px",
    transition: "all 0.3s ease",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    textDecoration: "none",
  };

  const subNavLinkStyle = {
    fontFamily: "'Inter', sans-serif",
    fontSize: "0.9rem",
    fontWeight: 600,
    color: "rgba(255, 255, 255, 0.9)",
    padding: "8px 20px",
    marginLeft: "20px",
    borderLeft: "3px solid rgba(255, 255, 255, 0.3)",
    transition: "all 0.3s ease",
  };

  const offcanvasTitleStyle = {
    fontFamily: "'Poppins', sans-serif",
    fontSize: "1.5rem",
    fontWeight: 900,
    background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.accent} 100%)`,
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
  };

  const globalStyles = `
    @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700;800;900&family=Inter:wght@400;500;600;700;800&display=swap');

    .nav-link-custom:hover {
      background: rgba(255, 255, 255, 0.2) !important;
      transform: translateY(-2px);
    }

    .sub-nav-link-custom:hover {
      border-left-color: white !important;
      padding-left: 25px !important;
    }

    .profile-dropdown-toggle:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(255, 107, 107, 0.4) !important;
    }

    .dropdown-item-custom:hover {
      background: linear-gradient(135deg, rgba(255, 107, 107, 0.1) 0%, rgba(29, 211, 176, 0.1) 100%) !important;
      transform: translateX(5px);
    }

    .navbar-toggler {
      border: 2px solid white !important;
      padding: 8px 12px !important;
    }

    .navbar-toggler-icon {
      background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 30 30'%3e%3cpath stroke='rgba(255, 255, 255, 1)' stroke-linecap='round' stroke-miterlimit='10' stroke-width='2' d='M4 7h22M4 15h22M4 23h22'/%3e%3c/svg%3e") !important;
    }

    .offcanvas-header {
      border-bottom: 2px solid ${colors.background};
      padding: 20px 25px;
    }

    .offcanvas-body {
      padding: 25px;
    }

    * {
      box-sizing: border-box;
    }
  `;

  return (
    <>
      <style>{globalStyles}</style>
      <Navbar key="md" expand="md" style={navbarStyle}>
        <Container fluid>
          <Navbar.Brand as={Link} to="/" style={brandStyle}>
            <MdDashboard style={{ fontSize: "2rem" }} />
            SKILL BARTER
          </Navbar.Brand>
          <Navbar.Toggle aria-controls={`offcanvasNavbar-expand-md`} />
          <Navbar.Offcanvas
            id={`offcanvasNavbar-expand-md`}
            aria-labelledby={`offcanvasNavbarLabel-expand-md`}
            placement="end"
          >
            <Offcanvas.Header closeButton>
              <Offcanvas.Title id={`offcanvasNavbarLabel-expand-md`} style={offcanvasTitleStyle}>
                SKILL BARTER
              </Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
              <Nav className="justify-content-end flex-grow-1 pe-3">
                <Nav.Link 
                  as={Link} 
                  to="/" 
                  style={navLinkStyle}
                  className="nav-link-custom"
                >
                  <FaHome /> Home
                </Nav.Link>
                {navUser !== null ? (
                  <>
                    <Nav.Link
                      as={Link}
                      to="/discover"
                      style={navLinkStyle}
                      className="nav-link-custom"
                    >
                      <FaCompass /> Discover
                    </Nav.Link>
                    <Nav.Link 
                      as={Link} 
                      to="/chats" 
                      style={navLinkStyle}
                      className="nav-link-custom"
                    >
                      <FaComments /> Your Chats
                    </Nav.Link>
                    {discover && (
                      <>
                        <Nav.Link
                          href="#for-you"
                          style={{
                            ...subNavLinkStyle,
                            marginTop: "15px",
                            fontSize: "1rem",
                            fontWeight: 700,
                          }}
                          className="sub-nav-link-custom d-md-none"
                        >
                          For You
                        </Nav.Link>
                        <Nav.Link
                          href="#popular"
                          style={{
                            ...subNavLinkStyle,
                            fontSize: "1rem",
                            fontWeight: 700,
                          }}
                          className="sub-nav-link-custom d-md-none"
                        >
                          Popular
                        </Nav.Link>
                        <Nav.Link
                          href="#web-development"
                          style={subNavLinkStyle}
                          className="sub-nav-link-custom d-md-none"
                        >
                          Web Development
                        </Nav.Link>
                        <Nav.Link
                          href="#machine-learning"
                          style={subNavLinkStyle}
                          className="sub-nav-link-custom d-md-none"
                        >
                          Machine Learning
                        </Nav.Link>
                        <Nav.Link
                          href="#others"
                          style={subNavLinkStyle}
                          className="sub-nav-link-custom d-md-none"
                        >
                          Others
                        </Nav.Link>
                      </>
                    )}
                    <Nav.Link as={Dropdown} style={{ padding: 0 }}>
                      <UserProfileDropdown />
                    </Nav.Link>
                  </>
                ) : (
                  <>
                    <Nav.Link
                      as={Link}
                      to="/about_us"
                      style={navLinkStyle}
                      className="nav-link-custom"
                    >
                      <FaInfoCircle /> About Us
                    </Nav.Link>
                    <Nav.Link
                      as={Link}
                      to="/#why-skill-swap"
                      style={navLinkStyle}
                      className="nav-link-custom"
                    >
                      <FaQuestionCircle /> Why Skill Barter
                    </Nav.Link>
                    <Nav.Link 
                      as={Link} 
                      to="/login" 
                      style={{
                        ...navLinkStyle,
                        background: "rgba(255, 255, 255, 0.25)",
                        border: "2px solid white",
                      }}
                      className="nav-link-custom"
                    >
                      <FaUser /> Login/Register
                    </Nav.Link>
                  </>
                )}
              </Nav>
            </Offcanvas.Body>
          </Navbar.Offcanvas>
        </Container>
      </Navbar>
    </>
  );
};

export default Header;
