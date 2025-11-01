import React, { useState, useEffect, useRef } from "react";
import { FaCode, FaGuitar, FaPalette, FaCamera, FaLaptopCode, FaMicrophone, FaPencilRuler, FaCookieBite } from "react-icons/fa";
import { GiCook, GiMuscleUp, GiBookshelf } from "react-icons/gi";
import { MdDesignServices, MdLanguage } from "react-icons/md";

const LandingPage = () => {
  const [scrollPosition, setScrollPosition] = useState(0);
  const [isVisible, setIsVisible] = useState({});
  const sectionRefs = useRef({});

  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
      
      Object.keys(sectionRefs.current).forEach(key => {
        const element = sectionRefs.current[key];
        if (element) {
          const rect = element.getBoundingClientRect();
          const isInView = rect.top < window.innerHeight * 0.75 && rect.bottom > 0;
          setIsVisible(prev => ({ ...prev, [key]: isInView }));
        }
      });
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

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
    background: colors.background,
    minHeight: "100vh",
    overflow: "hidden",
    position: "relative",
  };

  const heroSectionStyle = {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    padding: "20px",
  };

  // Animated floating skill icons
  const floatingIcons = [
    { Icon: FaCode, delay: 0, duration: 15, startX: "5%", startY: "10%", color: colors.accent },
    { Icon: FaGuitar, delay: 2, duration: 18, startX: "85%", startY: "15%", color: colors.primary },
    { Icon: FaPalette, delay: 4, duration: 20, startX: "10%", startY: "70%", color: colors.secondary },
    { Icon: FaCamera, delay: 1, duration: 16, startX: "80%", startY: "75%", color: colors.accent },
    { Icon: FaLaptopCode, delay: 3, duration: 19, startX: "15%", startY: "40%", color: colors.primary },
    { Icon: GiCook, delay: 5, duration: 17, startX: "75%", startY: "45%", color: colors.secondary },
    { Icon: FaMicrophone, delay: 6, duration: 21, startX: "90%", startY: "30%", color: colors.accent },
    { Icon: MdDesignServices, delay: 7, duration: 14, startX: "20%", startY: "85%", color: colors.primary },
  ];

  const getFloatingIconStyle = (icon, scrollPos) => ({
    position: "absolute",
    fontSize: "3.5rem",
    color: icon.color,
    left: icon.startX,
    top: icon.startY,
    opacity: 0.25,
    filter: `drop-shadow(0 0 15px ${icon.color})`,
    animation: `float ${icon.duration}s ease-in-out infinite, glow 3s ease-in-out infinite`,
    animationDelay: `${icon.delay}s`,
    transform: `translateY(${scrollPos * 0.1}px) rotate(${scrollPos * 0.05}deg)`,
    transition: "transform 0.3s ease-out",
    zIndex: 1,
  });

  const titleContainerStyle = {
    position: "relative",
    zIndex: 10,
    textAlign: "center",
    padding: "80px 40px",
    background: `linear-gradient(135deg, rgba(255, 107, 107, 0.1) 0%, rgba(255, 164, 27, 0.1) 50%, rgba(29, 211, 176, 0.1) 100%)`,
    borderRadius: "30px",
    boxShadow: `0 20px 60px rgba(255, 107, 107, 0.2), 0 10px 30px rgba(255, 164, 27, 0.15)`,
    backdropFilter: "blur(20px)",
    border: `4px solid ${colors.primary}`,
    maxWidth: "900px",
    margin: "0 20px",
    transform: `translateY(${Math.max(0, 50 - scrollPosition * 0.5)}px)`,
    transition: "all 0.3s ease-out",
  };

  const titleStyle = {
    fontFamily: "'Poppins', sans-serif",
    fontSize: "clamp(3rem, 8vw, 6.5rem)",
    fontWeight: 900,
    margin: "0",
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
    fontSize: "clamp(1.3rem, 2.5vw, 2rem)",
    color: colors.text,
    marginTop: "25px",
    fontWeight: 700,
    letterSpacing: "1px",
  };

  const ctaButtonStyle = {
    marginTop: "50px",
    padding: "20px 60px",
    fontSize: "1.3rem",
    fontWeight: 800,
    fontFamily: "'Poppins', sans-serif",
    color: "#FFFFFF",
    background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`,
    border: "none",
    borderRadius: "50px",
    cursor: "pointer",
    transition: "all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
    boxShadow: `0 15px 35px rgba(255, 107, 107, 0.4)`,
    textTransform: "uppercase",
    letterSpacing: "2px",
    position: "relative",
    overflow: "hidden",
  };

  const sectionStyle = {
    padding: "120px 20px",
    background: "#FFFFFF",
    position: "relative",
  };

  const sectionTitleStyle = {
    fontFamily: "'Poppins', sans-serif",
    fontSize: "clamp(2.5rem, 5vw, 4.5rem)",
    fontWeight: 900,
    textAlign: "center",
    color: colors.text,
    marginBottom: "80px",
    letterSpacing: "2px",
    textTransform: "uppercase",
    position: "relative",
  };

  const cardContainerStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
    gap: "50px",
    maxWidth: "1400px",
    margin: "0 auto",
    padding: "0 20px",
  };

  const getCardStyle = (index, isVisible) => ({
    background: `linear-gradient(135deg, rgba(255, 107, 107, 0.08) 0%, rgba(29, 211, 176, 0.08) 100%)`,
    borderRadius: "25px",
    padding: "45px 35px",
    boxShadow: `0 10px 40px rgba(255, 107, 107, 0.15)`,
    transition: "all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)",
    transform: isVisible ? "translateY(0) scale(1)" : "translateY(50px) scale(0.9)",
    opacity: isVisible ? 1 : 0,
    transitionDelay: `${index * 0.1}s`,
    border: `3px solid ${colors.primary}`,
    position: "relative",
    overflow: "hidden",
    backdropFilter: "blur(10px)",
  });

  const cardIconContainerStyle = {
    fontSize: "4rem",
    marginBottom: "25px",
    display: "flex",
    justifyContent: "center",
    filter: `drop-shadow(0 5px 15px rgba(255, 107, 107, 0.3))`,
  };

  const cardTitleStyle = {
    fontFamily: "'Poppins', sans-serif",
    fontSize: "1.8rem",
    fontWeight: 800,
    color: colors.text,
    marginBottom: "20px",
    letterSpacing: "0.5px",
  };

  const cardDescriptionStyle = {
    fontFamily: "'Inter', sans-serif",
    fontSize: "1.1rem",
    lineHeight: "1.8",
    color: colors.text,
    fontWeight: 500,
  };

  const features = [
  {
    icon: <FaLaptopCode color={colors.accent} />,
    title: "Learn from Real-World Mentors",
    description:
      "Go beyond textbooks. Interact with professionals who’ve mastered their craft, gain hands-on experience, and learn the way it’s applied in the real world.",
  },
  {
    icon: <GiBookshelf color={colors.primary} />,
    title: "Teach What You Love",
    description:
      "Transform your skills into impact. Become a mentor, host workshops, and inspire learners across the world while earning recognition for your expertise.",
  },
  {
    icon: <MdLanguage color={colors.secondary} />,
    title: "Connect. Collaborate. Create.",
    description:
      "Join vibrant communities, collaborate on live projects, and exchange ideas that push your creativity beyond limits.",
  },
  {
    icon: <FaPalette color={colors.accent} />,
    title: "Endless Skill Universe",
    description:
      "Whether it’s coding, music, art, or AI — explore hundreds of domains and discover opportunities that align with your passion and curiosity.",
  },
  {
    icon: <GiMuscleUp color={colors.primary} />,
    title: "Grow Every Day",
    description:
      "Track your progress, collect achievements, and level up your personal and professional journey — one skill at a time.",
  },
];


  const globalStyles = `
    @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700;800;900&family=Inter:wght@400;500;600;700&display=swap');

    @keyframes float {
      0%, 100% { 
        transform: translateY(0) translateX(0) rotate(0deg); 
      }
      25% { 
        transform: translateY(-40px) translateX(30px) rotate(90deg); 
      }
      50% { 
        transform: translateY(-80px) translateX(-30px) rotate(180deg); 
      }
      75% { 
        transform: translateY(-40px) translateX(30px) rotate(270deg); 
      }
    }

    @keyframes glow {
      0%, 100% { 
        opacity: 0.25;
        filter: drop-shadow(0 0 15px currentColor);
      }
      50% { 
        opacity: 0.4;
        filter: drop-shadow(0 0 25px currentColor);
      }
    }

    @keyframes gradientFlow {
      0% { background-position: 0% 50%; }
      100% { background-position: 200% 50%; }
    }

    button:hover {
      transform: translateY(-5px) scale(1.05);
      box-shadow: 0 20px 50px rgba(255, 107, 107, 0.5) !important;
    }

    .card:hover {
      transform: translateY(-15px) scale(1.03) !important;
      box-shadow: 0 20px 60px rgba(255, 107, 107, 0.3) !important;
      border-color: ${colors.accent} !important;
    }

    * {
      box-sizing: border-box;
    }

    body {
      background: ${colors.background};
    }
  `;

  return (
    <>
      <style>{globalStyles}</style>
      <div style={containerStyle}>
        {/* Hero Section */}
        <div style={heroSectionStyle}>
          {/* Floating Skill Icons */}
          {floatingIcons.map((iconData, idx) => (
            <iconData.Icon
              key={idx}
              style={getFloatingIconStyle(iconData, scrollPosition)}
            />
          ))}
          
          <div style={titleContainerStyle}>
            <h1 style={titleStyle}>SKILL BARTER</h1>
            <p style={subtitleStyle}>Exchange Skills • Build Community • Grow Together</p>
            <button 
              style={ctaButtonStyle}
              onClick={() => console.log("Get Started clicked")}
              onMouseEnter={(e) => {
                e.target.style.transform = "translateY(-5px) scale(1.05)";
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = "translateY(0) scale(1)";
              }}
            >
              Launch Your Journey
            </button>
          </div>
        </div>

        {/* Why Section */}
        <div style={sectionStyle}>
          <h2 style={sectionTitleStyle}>WHY SKILL BARTER?</h2>
          
          <div style={cardContainerStyle}>
            {features.map((feature, index) => (
              <div
                key={index}
                ref={el => sectionRefs.current[`card-${index}`] = el}
                className="card"
                style={getCardStyle(index, isVisible[`card-${index}`])}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-15px) scale(1.03)";
                  e.currentTarget.style.boxShadow = `0 20px 60px rgba(255, 107, 107, 0.3)`;
                  e.currentTarget.style.borderColor = colors.accent;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = isVisible[`card-${index}`] ? "translateY(0) scale(1)" : "translateY(50px) scale(0.9)";
                  e.currentTarget.style.boxShadow = `0 10px 40px rgba(255, 107, 107, 0.15)`;
                  e.currentTarget.style.borderColor = colors.primary;
                }}
              >
                <div style={cardIconContainerStyle}>{feature.icon}</div>
                <h3 style={cardTitleStyle}>{feature.title}</h3>
                <p style={cardDescriptionStyle}>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div style={{
          textAlign: "center",
          padding: "120px 20px",
          background: colors.background,
        }}>
          <h2 style={{
            ...sectionTitleStyle,
            fontSize: "clamp(2rem, 4vw, 3.5rem)",
            marginBottom: "40px",
          }}>
            READY TO START?
          </h2>
          <button 
            style={ctaButtonStyle}
            onClick={() => console.log("Join Now clicked")}
          >
            Join Skill Barter
          </button>
        </div>
      </div>
    </>
  );
};

export default LandingPage;
