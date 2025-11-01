import React from "react";
import { Container, Navbar } from "react-bootstrap";
import { 
  FaGithub, 
  FaLinkedin, 
  FaTwitter, 
  FaInstagram,
  FaHeart
} from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { Link } from "react-router-dom";

const Footer = () => {
  // Skill Energy Color Palette
  const colors = {
    primary: "#FF6B6B",
    secondary: "#FFA41B",
    accent: "#1DD3B0",
    background: "#FFF8E8",
    text: "#1E293B"
  };

  const footerStyle = {
    background: `linear-gradient(135deg, ${colors.text} 0%, #0F172A 100%)`,
    padding: "50px 0 20px",
    borderTop: `4px solid ${colors.primary}`,
    marginTop: "auto",
  };

  const footerContentStyle = {
    maxWidth: "1400px",
    margin: "0 auto",
    padding: "0 20px",
  };

  const footerGridStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "40px",
    marginBottom: "40px",
  };

  const footerSectionStyle = {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  };

  const footerTitleStyle = {
    fontFamily: "'Poppins', sans-serif",
    fontSize: "1.3rem",
    fontWeight: 800,
    background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.accent} 100%)`,
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
    marginBottom: "10px",
    letterSpacing: "0.5px",
  };

  const footerLinkStyle = {
    fontFamily: "'Inter', sans-serif",
    fontSize: "0.95rem",
    fontWeight: 500,
    color: "#94A3B8",
    textDecoration: "none",
    transition: "all 0.3s ease",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  };

  const footerTextStyle = {
    fontFamily: "'Inter', sans-serif",
    fontSize: "0.95rem",
    fontWeight: 500,
    color: "#94A3B8",
    lineHeight: "1.7",
  };

  const socialLinksStyle = {
    display: "flex",
    gap: "15px",
    marginTop: "10px",
  };

  const socialIconStyle = {
    width: "45px",
    height: "45px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.accent} 100%)`,
    color: "#FFFFFF",
    fontSize: "1.2rem",
    transition: "all 0.3s ease",
    cursor: "pointer",
    textDecoration: "none",
    boxShadow: "0 4px 15px rgba(255, 107, 107, 0.3)",
  };

  const dividerStyle = {
    height: "2px",
    background: `linear-gradient(90deg, transparent, ${colors.primary}, ${colors.accent}, transparent)`,
    margin: "30px 0 20px",
    opacity: 0.3,
  };

  const copyrightStyle = {
    textAlign: "center",
    fontFamily: "'Inter', sans-serif",
    fontSize: "0.9rem",
    fontWeight: 600,
    color: "#64748B",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    flexWrap: "wrap",
  };

  const brandStyle = {
    fontFamily: "'Poppins', sans-serif",
    fontWeight: 800,
    background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.accent} 100%)`,
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
  };

  const globalStyles = `
    @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700;800;900&family=Inter:wght@400;500;600;700;800&display=swap');

    .footer-link:hover {
      color: ${colors.accent} !important;
      transform: translateX(5px);
    }

    .social-icon:hover {
      transform: translateY(-5px) scale(1.1);
      box-shadow: 0 8px 25px rgba(29, 211, 176, 0.4) !important;
    }

    * {
      box-sizing: border-box;
    }
  `;

  return (
    <>
      <style>{globalStyles}</style>
      <div style={footerStyle}>
        <div style={footerContentStyle}>
          <div style={footerGridStyle}>
            {/* About Section */}
            <div style={footerSectionStyle}>
              <h3 style={footerTitleStyle}>Skill Barter</h3>
              <p style={footerTextStyle}>
                Empowering learners worldwide to exchange skills, build community, and grow together. 
                Join thousands of passionate individuals sharing knowledge freely.
              </p>
              <div style={socialLinksStyle}>
                <a href="#" className="social-icon" style={socialIconStyle}>
                  <FaGithub />
                </a>
                <a href="#" className="social-icon" style={socialIconStyle}>
                  <FaLinkedin />
                </a>
                <a href="#" className="social-icon" style={socialIconStyle}>
                  <FaTwitter />
                </a>
                <a href="#" className="social-icon" style={socialIconStyle}>
                  <FaInstagram />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div style={footerSectionStyle}>
              <h3 style={footerTitleStyle}>Quick Links</h3>
              <Link to="/" className="footer-link" style={footerLinkStyle}>
                Home
              </Link>
              <Link to="/about_us" className="footer-link" style={footerLinkStyle}>
                About Us
              </Link>
              <Link to="/discover" className="footer-link" style={footerLinkStyle}>
                Discover
              </Link>
              <Link to="/chats" className="footer-link" style={footerLinkStyle}>
                Your Chats
              </Link>
            </div>

            {/* Resources */}
            <div style={footerSectionStyle}>
              <h3 style={footerTitleStyle}>Resources</h3>
              <a href="#" className="footer-link" style={footerLinkStyle}>
                How It Works
              </a>
              <a href="#" className="footer-link" style={footerLinkStyle}>
                Community Guidelines
              </a>
              <a href="#" className="footer-link" style={footerLinkStyle}>
                FAQ
              </a>
              <a href="#" className="footer-link" style={footerLinkStyle}>
                Support
              </a>
            </div>

            {/* Contact */}
            <div style={footerSectionStyle}>
              <h3 style={footerTitleStyle}>Get In Touch</h3>
              <a href="mailto:hello@skillbarter.com" className="footer-link" style={footerLinkStyle}>
                <MdEmail style={{ color: colors.accent }} />
                hello@skillbarter.com
              </a>
              <p style={footerTextStyle}>
                Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
              </p>
            </div>
          </div>

          {/* Divider */}
          <div style={dividerStyle}></div>

          {/* Copyright */}
          <div style={copyrightStyle}>
            <span>Copyright © 2025</span>
            <span style={brandStyle}>Skill Barter</span>
            <span>• All rights reserved</span>
            <span>• Made with</span>
            <FaHeart style={{ color: colors.primary }} />
            <span>for learners worldwide</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default Footer;
