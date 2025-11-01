import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import { FaGoogle, FaCode, FaGuitar, FaPalette, FaCamera, FaLaptopCode, FaMicrophone } from "react-icons/fa";
import { GiCook, GiMuscleUp } from "react-icons/gi";
import { MdDesignServices } from "react-icons/md";

const Login = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  const handleGoogleLogin = () => {
    setIsClicked(true);
    setTimeout(() => {
      window.location.href = "http://localhost:8000/auth/google";
    }, 300);
  };

  // Skill Energy Color Palette
  const colors = {
    primary: "#FF6B6B",      // Bright Coral
    secondary: "#FFA41B",    // Vibrant Orange
    accent: "#1DD3B0",       // Turquoise Blue
    background: "#FFF8E8",   // Soft Ivory
    text: "#1E293B"          // Dark Slate
  };

  const containerStyle = {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: colors.background,
    position: "relative",
    overflow: "hidden",
    padding: "20px",
  };

  // Floating skill icons with different positions
  const floatingIcons = [
    { Icon: FaCode, left: "8%", top: "15%", delay: 0, duration: 15, color: colors.accent },
    { Icon: FaGuitar, right: "10%", top: "20%", delay: 2, duration: 18, color: colors.primary },
    { Icon: FaPalette, left: "5%", bottom: "25%", delay: 4, duration: 20, color: colors.secondary },
    { Icon: FaCamera, right: "8%", bottom: "30%", delay: 1, duration: 16, color: colors.accent },
    { Icon: FaLaptopCode, left: "15%", top: "50%", delay: 3, duration: 19, color: colors.primary },
    { Icon: GiCook, right: "12%", top: "55%", delay: 5, duration: 17, color: colors.secondary },
    { Icon: FaMicrophone, left: "10%", top: "75%", delay: 6, duration: 21, color: colors.accent },
    { Icon: MdDesignServices, right: "15%", bottom: "15%", delay: 7, duration: 14, color: colors.primary },
    { Icon: GiMuscleUp, left: "20%", top: "30%", delay: 8, duration: 22, color: colors.secondary },
  ];

  const getFloatingIconStyle = (icon) => ({
    position: "absolute",
    fontSize: "3.5rem",
    color: icon.color,
    left: icon.left,
    right: icon.right,
    top: icon.top,
    bottom: icon.bottom,
    opacity: 0.2,
    filter: `drop-shadow(0 0 20px ${icon.color})`,
    animation: `floatIcon ${icon.duration}s ease-in-out infinite, glowPulse 3s ease-in-out infinite`,
    animationDelay: `${icon.delay}s`,
    zIndex: 1,
  });

  const loginBoxStyle = {
    position: "relative",
    zIndex: 10,
    minWidth: "500px",
    maxWidth: "550px",
    padding: "70px 60px",
    background: "rgba(255, 255, 255, 0.95)",
    backdropFilter: "blur(20px)",
    borderRadius: "30px",
    border: `4px solid ${colors.primary}`,
    boxShadow: `0 25px 70px rgba(255, 107, 107, 0.25), 0 10px 30px rgba(255, 164, 27, 0.15)`,
    transform: isClicked ? "scale(0.95)" : "scale(1)",
    transition: "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
    animation: "loginSlideIn 0.8s ease-out",
  };

  const titleStyle = {
    fontSize: "clamp(3rem, 6vw, 5rem)",
    fontFamily: "'Poppins', sans-serif",
    fontWeight: 900,
    textAlign: "center",
    marginBottom: "20px",
    letterSpacing: "3px",
    textTransform: "uppercase",
    background: `linear-gradient(90deg, ${colors.primary} 0%, ${colors.secondary} 50%, ${colors.accent} 100%)`,
    backgroundSize: "200% auto",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
    animation: "gradientFlow 4s linear infinite",
    filter: `drop-shadow(0 2px 8px ${colors.primary})`,
  };

  const subtitleStyle = {
    fontFamily: "'Inter', sans-serif",
    fontSize: "1.4rem",
    color: colors.text,
    textAlign: "center",
    marginBottom: "50px",
    fontWeight: 700,
    letterSpacing: "1px",
  };

  const buttonContainerStyle = {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
    alignItems: "center",
  };

  const googleButtonStyle = {
    width: "100%",
    padding: "20px 40px",
    fontSize: "1.2rem",
    fontWeight: 800,
    fontFamily: "'Poppins', sans-serif",
    color: "#FFFFFF",
    background: isHovered
      ? `linear-gradient(135deg, ${colors.accent} 0%, ${colors.primary} 100%)`
      : `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`,
    border: "none",
    borderRadius: "15px",
    cursor: "pointer",
    transition: "all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
    boxShadow: isHovered
      ? `0 20px 50px rgba(29, 211, 176, 0.4)`
      : `0 15px 35px rgba(255, 107, 107, 0.4)`,
    transform: isHovered ? "translateY(-8px) scale(1.05)" : "translateY(0) scale(1)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "15px",
    textTransform: "uppercase",
    letterSpacing: "2px",
  };

  const iconStyle = {
    fontSize: "1.6rem",
    transition: "transform 0.4s ease",
    transform: isHovered ? "rotate(360deg) scale(1.3)" : "rotate(0deg) scale(1)",
  };

  const decorativeLineStyle = {
    width: "80px",
    height: "4px",
    background: `linear-gradient(90deg, ${colors.primary}, ${colors.secondary}, ${colors.accent})`,
    margin: "40px auto 0",
    borderRadius: "2px",
    animation: "pulse 2s ease-in-out infinite",
  };

  const featureBoxStyle = {
    marginTop: "40px",
    padding: "25px",
    background: `linear-gradient(135deg, rgba(255, 107, 107, 0.08) 0%, rgba(29, 211, 176, 0.08) 100%)`,
    borderRadius: "20px",
    border: `2px solid ${colors.accent}`,
  };

  const featureTextStyle = {
    fontFamily: "'Inter', sans-serif",
    fontSize: "1.1rem",
    color: colors.text,
    textAlign: "center",
    lineHeight: "1.8",
    margin: "0",
    fontWeight: 600,
  };

  const globalStyles = `
    @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700;800;900&family=Inter:wght@400;500;600;700;800&display=swap');

    @keyframes floatIcon {
      0%, 100% { 
        transform: translateY(0) translateX(0) rotate(0deg); 
      }
      25% { 
        transform: translateY(-50px) translateX(40px) rotate(90deg); 
      }
      50% { 
        transform: translateY(-100px) translateX(-40px) rotate(180deg); 
      }
      75% { 
        transform: translateY(-50px) translateX(40px) rotate(270deg); 
      }
    }

    @keyframes glowPulse {
      0%, 100% { 
        opacity: 0.2;
        filter: drop-shadow(0 0 20px currentColor);
      }
      50% { 
        opacity: 0.35;
        filter: drop-shadow(0 0 35px currentColor);
      }
    }

    @keyframes loginSlideIn {
      0% {
        opacity: 0;
        transform: translateY(60px) scale(0.9);
      }
      100% {
        opacity: 1;
        transform: translateY(0) scale(1);
      }
    }

    @keyframes gradientFlow {
      0% { background-position: 0% 50%; }
      100% { background-position: 200% 50%; }
    }

    @keyframes pulse {
      0%, 100% { 
        opacity: 0.7; 
        transform: scaleX(1); 
      }
      50% { 
        opacity: 1; 
        transform: scaleX(1.2); 
      }
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      font-family: 'Inter', sans-serif;
      background: ${colors.background};
    }
  `;

  return (
    <>
      <style>{globalStyles}</style>
      <div style={containerStyle}>
        {/* Animated Floating Skill Icons */}
        {floatingIcons.map((iconData, idx) => (
          <iconData.Icon key={idx} style={getFloatingIconStyle(iconData)} />
        ))}

        {/* Login Box */}
        <div style={loginBoxStyle}>
          <h1 style={titleStyle}>SKILL<br/>BARTER</h1>
          <p style={subtitleStyle}>Welcome Back!</p>

          <div style={buttonContainerStyle}>
            <Button
              style={googleButtonStyle}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              onClick={handleGoogleLogin}
            >
              <FaGoogle style={iconStyle} />
              <span>Continue with Google</span>
            </Button>
          </div>

          <div style={decorativeLineStyle} />

          <div style={featureBoxStyle}>
            <p style={featureTextStyle}>
              🚀 <strong>Join The Future of Learning</strong>
              <br />
              Code • Music • Art • Design • And More
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
