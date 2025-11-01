import React, { useState, useEffect } from "react";
import { FaUsers, FaHandshake, FaRocket, FaHeart } from "react-icons/fa";
import { GiSkills, GiTeamIdea } from "react-icons/gi";
import { MdGroups } from "react-icons/md";

const AboutUs = () => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
    background: colors.background,
    padding: "80px 20px",
    position: "relative",
    overflow: "hidden",
  };

  const contentWrapperStyle = {
    maxWidth: "1400px",
    margin: "0 auto",
    position: "relative",
    zIndex: 2,
  };

  const heroSectionStyle = {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: "60px",
    marginBottom: "100px",
    flexWrap: "wrap",
  };

  const textSectionStyle = {
    flex: "1",
    minWidth: "300px",
  };

  const titleStyle = {
    fontFamily: "'Poppins', sans-serif",
    fontSize: "clamp(3rem, 6vw, 5rem)",
    fontWeight: 900,
    marginBottom: "30px",
    letterSpacing: "2px",
    textTransform: "uppercase",
    background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 50%, ${colors.accent} 100%)`,
    backgroundSize: "200% auto",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
    animation: "gradientFlow 4s linear infinite",
  };

  const quoteStyle = {
    fontFamily: "'Inter', sans-serif",
    fontSize: "clamp(1.1rem, 2vw, 1.4rem)",
    lineHeight: "1.8",
    color: colors.text,
    fontStyle: "italic",
    marginBottom: "30px",
    padding: "30px",
    background: "rgba(255, 255, 255, 0.8)",
    borderRadius: "20px",
    borderLeft: `6px solid ${colors.primary}`,
    boxShadow: `0 10px 30px rgba(255, 107, 107, 0.15)`,
    fontWeight: 600,
  };

  const descriptionStyle = {
    fontFamily: "'Inter', sans-serif",
    fontSize: "clamp(1rem, 1.5vw, 1.2rem)",
    lineHeight: "1.9",
    color: colors.text,
    marginBottom: "25px",
    fontWeight: 500,
  };

  const imageSectionStyle = {
    flex: "1",
    minWidth: "300px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  };

  const imageContainerStyle = {
    position: "relative",
    width: "100%",
    maxWidth: "600px",
    borderRadius: "30px",
    overflow: "hidden",
    boxShadow: `0 20px 60px rgba(255, 107, 107, 0.2)`,
    border: `4px solid ${colors.primary}`,
    transform: `translateY(${scrollY * 0.05}px)`,
    transition: "transform 0.3s ease-out",
  };

  const imageStyle = {
    width: "100%",
    height: "auto",
    display: "block",
  };

  const statsContainerStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "40px",
    marginTop: "80px",
    marginBottom: "80px",
  };

  const statCardStyle = {
    background: "rgba(255, 255, 255, 0.9)",
    padding: "40px 30px",
    borderRadius: "20px",
    textAlign: "center",
    border: `3px solid ${colors.accent}`,
    boxShadow: `0 10px 35px rgba(29, 211, 176, 0.15)`,
    transition: "all 0.3s ease",
  };

  const statIconStyle = {
    fontSize: "3.5rem",
    marginBottom: "20px",
    filter: `drop-shadow(0 5px 15px rgba(255, 107, 107, 0.3))`,
  };

  const statTitleStyle = {
    fontFamily: "'Poppins', sans-serif",
    fontSize: "1.5rem",
    fontWeight: 800,
    color: colors.text,
    marginBottom: "10px",
    letterSpacing: "0.5px",
  };

  const statDescStyle = {
    fontFamily: "'Inter', sans-serif",
    fontSize: "1rem",
    color: colors.text,
    fontWeight: 500,
    lineHeight: "1.6",
  };

  const missionSectionStyle = {
    background: "rgba(255, 255, 255, 0.95)",
    padding: "60px 50px",
    borderRadius: "30px",
    boxShadow: `0 20px 60px rgba(255, 107, 107, 0.15)`,
    border: `3px solid ${colors.secondary}`,
    marginTop: "60px",
  };

  const missionTitleStyle = {
    fontFamily: "'Poppins', sans-serif",
    fontSize: "clamp(2rem, 4vw, 3rem)",
    fontWeight: 800,
    color: colors.text,
    marginBottom: "25px",
    textAlign: "center",
    letterSpacing: "1px",
  };

  const missionTextStyle = {
    fontFamily: "'Inter', sans-serif",
    fontSize: "clamp(1rem, 1.5vw, 1.2rem)",
    lineHeight: "1.9",
    color: colors.text,
    textAlign: "center",
    fontWeight: 600,
  };

  // Floating background icons
  const floatingIcons = [
    { Icon: FaUsers, top: "10%", left: "5%", delay: 0, color: colors.primary },
    { Icon: GiSkills, top: "25%", right: "8%", delay: 2, color: colors.accent },
    { Icon: FaHandshake, bottom: "20%", left: "10%", delay: 4, color: colors.secondary },
    { Icon: GiTeamIdea, bottom: "35%", right: "12%", delay: 1, color: colors.primary },
  ];

  const getFloatingIconStyle = (icon) => ({
    position: "absolute",
    fontSize: "4rem",
    color: icon.color,
    top: icon.top,
    bottom: icon.bottom,
    left: icon.left,
    right: icon.right,
    opacity: 0.1,
    animation: `floatIcon 15s ease-in-out infinite`,
    animationDelay: `${icon.delay}s`,
    zIndex: 1,
  });

  const stats = [
    {
      icon: <FaUsers color={colors.primary} />,
      title: "Community Driven",
      description: "Built by learners, for learners. Join thousands sharing skills worldwide."
    },
    {
      icon: <FaHandshake color={colors.accent} />,
      title: "Free Exchange",
      description: "No fees, no barriers. Pure skill sharing without any cost."
    },
    {
      icon: <FaRocket color={colors.secondary} />,
      title: "Rapid Growth",
      description: "Learn faster by teaching. Master skills through collaboration."
    },
    {
      icon: <FaHeart color={colors.primary} />,
      title: "Passion Powered",
      description: "Connect with enthusiasts who love what they do and share freely."
    }
  ];

  const globalStyles = `
    @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700;800;900&family=Inter:wght@400;500;600;700;800&display=swap');

    @keyframes floatIcon {
      0%, 100% { 
        transform: translateY(0) rotate(0deg); 
      }
      50% { 
        transform: translateY(-30px) rotate(180deg); 
      }
    }

    @keyframes gradientFlow {
      0% { background-position: 0% 50%; }
      100% { background-position: 200% 50%; }
    }

    .stat-card:hover {
      transform: translateY(-10px) scale(1.03);
      box-shadow: 0 20px 50px rgba(29, 211, 176, 0.25) !important;
      border-color: ${colors.primary} !important;
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
  `;

  return (
    <>
      <style>{globalStyles}</style>
      <div style={containerStyle}>
        {/* Floating Background Icons */}
        {floatingIcons.map((iconData, idx) => (
          <iconData.Icon key={idx} style={getFloatingIconStyle(iconData)} />
        ))}

        <div style={contentWrapperStyle}>
          {/* Hero Section */}
          <div style={heroSectionStyle}>
            <div style={textSectionStyle}>
              <h1 style={titleStyle}>ABOUT US</h1>
              
              <div style={quoteStyle}>
                "As students, we've searched everywhere for affordable upskilling. Too often, we paid hefty fees for certifications and skills. We created Skill Barter to change that - learn new skills, gain knowledge, and network with talented people, all for free!"
              </div>

              <p style={descriptionStyle}>
                At <strong>Skill Barter</strong>, we believe in the transformative power of learning and sharing knowledge. Our platform connects individuals from diverse backgrounds to exchange practical skills and expertise in a collaborative, cost-free environment.
              </p>

              <p style={descriptionStyle}>
                Whether you're a seasoned professional looking to mentor others or a beginner eager to learn, Skill Barter provides a supportive community for growth, collaboration, and meaningful connections.
              </p>
            </div>

            <div style={imageSectionStyle}>
              <div style={imageContainerStyle}>
                <img 
                  src="/assets/images/about us.png" 
                  alt="Skill Barter Community" 
                  style={imageStyle}
                />
              </div>
            </div>
          </div>

          {/* Stats Section */}
          <div style={statsContainerStyle}>
            {stats.map((stat, index) => (
              <div
                key={index}
                className="stat-card"
                style={statCardStyle}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-10px) scale(1.03)";
                  e.currentTarget.style.boxShadow = `0 20px 50px rgba(29, 211, 176, 0.25)`;
                  e.currentTarget.style.borderColor = colors.primary;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0) scale(1)";
                  e.currentTarget.style.boxShadow = `0 10px 35px rgba(29, 211, 176, 0.15)`;
                  e.currentTarget.style.borderColor = colors.accent;
                }}
              >
                <div style={statIconStyle}>{stat.icon}</div>
                <h3 style={statTitleStyle}>{stat.title}</h3>
                <p style={statDescStyle}>{stat.description}</p>
              </div>
            ))}
          </div>

          {/* Mission Section */}
          <div style={missionSectionStyle}>
            <h2 style={missionTitleStyle}>Our Mission</h2>
            <p style={missionTextStyle}>
              Our mission is to <strong>empower individuals</strong> to unlock their full potential through skill sharing. 
              By facilitating meaningful interactions and fostering a culture of lifelong learning, we aim to create 
              a vibrant community where everyone has the opportunity to thrive, grow, and achieve their dreams—without 
              financial barriers.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default AboutUs;
