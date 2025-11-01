import React from "react";
import Box from "./Box";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useUser } from "../../util/UserContext";
import { toast } from "react-toastify";
import axios from "axios";
import Spinner from "react-bootstrap/Spinner";
import { Link } from "react-router-dom";
import { 
  FaGithub, 
  FaLinkedin, 
  FaLink, 
  FaStar, 
  FaEdit, 
  FaUserGraduate,
  FaLaptopCode,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaEnvelope,
  FaAward,
  FaBriefcase
} from "react-icons/fa";
import { MdReport, MdVerified } from "react-icons/md";
import { GiSkills } from "react-icons/gi";
import { BsFillShieldFill } from "react-icons/bs";

const Profile = () => {
  const { user, setUser } = useUser();
  const [profileUser, setProfileUser] = useState(null);
  const { username } = useParams();
  const [loading, setLoading] = useState(true);
  const [connectLoading, setConnectLoading] = useState(false);
  const navigate = useNavigate();

  // Skill Energy Color Palette
  const colors = {
    primary: "#FF6B6B",
    secondary: "#FFA41B",
    accent: "#1DD3B0",
    background: "#FFF8E8",
    text: "#1E293B"
  };

  useEffect(() => {
    const getUser = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(`/user/registered/getDetails/${username}`);
        console.log(data.data);
        setProfileUser(data.data);
      } catch (error) {
        console.log(error);
        if (error?.response?.data?.message) {
          toast.error(error.response.data.message);
          if (error.response.data.message === "Please Login") {
            localStorage.removeItem("userInfo");
            setUser(null);
            await axios.get("/auth/logout");
            navigate("/login");
          }
        }
      } finally {
        setLoading(false);
      }
    };
    getUser();
  }, []);

  const convertDate = (dateTimeString) => {
    const date = new Date(dateTimeString);
    const formattedDate = date.toLocaleDateString("en-US", { month: "2-digit", year: "numeric" }).replace("/", "-");
    return formattedDate;
  };

  const connectHandler = async () => {
    try {
      setConnectLoading(true);
      const { data } = await axios.post(`/request/create`, {
        receiverID: profileUser._id,
      });
      toast.success(data.message);
      setProfileUser((prevState) => ({
        ...prevState,
        status: "Pending",
      }));
    } catch (error) {
      console.log(error);
      if (error?.response?.data?.message) {
        toast.error(error.response.data.message);
        if (error.response.data.message === "Please Login") {
          localStorage.removeItem("userInfo");
          setUser(null);
          await axios.get("/auth/logout");
          navigate("/login");
        }
      }
    } finally {
      setConnectLoading(false);
    }
  };

  const containerStyle = {
    minHeight: "100vh",
    background: `linear-gradient(135deg, ${colors.background} 0%, #FFFFFF 100%)`,
    padding: "40px 20px",
  };

  const innerContainerStyle = {
    maxWidth: "1400px",
    margin: "0 auto",
  };

  const gridLayoutStyle = {
    display: "grid",
    gridTemplateColumns: "350px 1fr",
    gap: "30px",
    marginBottom: "30px",
  };

  // Left Sidebar Styles
  const sidebarStyle = {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  };

  const profileCardStyle = {
    background: "rgba(255, 255, 255, 0.98)",
    borderRadius: "25px",
    padding: "35px 25px",
    boxShadow: `0 15px 50px rgba(255, 107, 107, 0.15)`,
    border: `3px solid ${colors.primary}`,
    textAlign: "center",
  };

  const profilePhotoContainerStyle = {
    position: "relative",
    width: "180px",
    height: "180px",
    margin: "0 auto 20px",
  };

  const profilePhotoStyle = {
    width: "100%",
    height: "100%",
    borderRadius: "50%",
    border: `5px solid ${colors.accent}`,
    boxShadow: `0 15px 40px rgba(29, 211, 176, 0.3)`,
    objectFit: "cover",
  };

  const verifiedBadgeStyle = {
    position: "absolute",
    bottom: "10px",
    right: "10px",
    background: colors.accent,
    borderRadius: "50%",
    width: "40px",
    height: "40px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "3px solid white",
    boxShadow: "0 5px 15px rgba(29, 211, 176, 0.4)",
  };

  const profileNameStyle = {
    fontFamily: "'Poppins', sans-serif",
    fontSize: "1.8rem",
    fontWeight: 800,
    color: colors.text,
    marginBottom: "10px",
    letterSpacing: "0.5px",
  };

  const usernameStyle = {
    fontFamily: "'Inter', sans-serif",
    fontSize: "1rem",
    color: "#64748B",
    marginBottom: "20px",
    fontWeight: 600,
  };

  const ratingBoxStyle = {
    background: `linear-gradient(135deg, ${colors.secondary} 0%, ${colors.primary} 100%)`,
    padding: "20px",
    borderRadius: "15px",
    marginBottom: "20px",
  };

  const ratingStarsStyle = {
    color: "#FFFFFF",
    fontSize: "1.8rem",
    marginBottom: "10px",
    filter: "drop-shadow(0 2px 5px rgba(0,0,0,0.2))",
  };

  const ratingValueStyle = {
    fontFamily: "'Poppins', sans-serif",
    fontSize: "2rem",
    fontWeight: 800,
    color: "#FFFFFF",
  };

  const ratingLabelStyle = {
    fontFamily: "'Inter', sans-serif",
    fontSize: "0.9rem",
    color: "#FFFFFF",
    opacity: 0.9,
    fontWeight: 600,
  };

  const actionButtonsStyle = {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  };

  const connectButtonStyle = {
    padding: "14px 25px",
    fontSize: "1rem",
    fontWeight: 700,
    fontFamily: "'Inter', sans-serif",
    color: "#FFFFFF",
    background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`,
    border: "none",
    borderRadius: "12px",
    cursor: profileUser?.status === "Connect" ? "pointer" : "default",
    transition: "all 0.3s ease",
    boxShadow: `0 8px 20px rgba(255, 107, 107, 0.3)`,
    width: "100%",
  };

  const secondaryButtonStyle = {
    padding: "14px 25px",
    fontSize: "1rem",
    fontWeight: 700,
    fontFamily: "'Inter', sans-serif",
    color: "#FFFFFF",
    background: colors.accent,
    border: "none",
    borderRadius: "12px",
    cursor: "pointer",
    transition: "all 0.3s ease",
    boxShadow: `0 8px 20px rgba(29, 211, 176, 0.3)`,
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    textDecoration: "none",
  };

  const editButtonStyle = {
    padding: "14px 25px",
    fontSize: "1rem",
    fontWeight: 700,
    fontFamily: "'Inter', sans-serif",
    color: colors.text,
    background: "rgba(255, 255, 255, 0.9)",
    border: `2px solid ${colors.accent}`,
    borderRadius: "12px",
    cursor: "pointer",
    transition: "all 0.3s ease",
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    textDecoration: "none",
  };

  const infoCardStyle = {
    background: "rgba(255, 255, 255, 0.98)",
    borderRadius: "20px",
    padding: "25px",
    boxShadow: `0 10px 35px rgba(255, 107, 107, 0.1)`,
    border: `2px solid ${colors.background}`,
  };

  const infoItemStyle = {
    display: "flex",
    alignItems: "center",
    gap: "15px",
    padding: "12px 0",
    borderBottom: `1px solid ${colors.background}`,
  };

  const infoIconStyle = {
    fontSize: "1.3rem",
    color: colors.primary,
    minWidth: "30px",
  };

  const infoTextStyle = {
    fontFamily: "'Inter', sans-serif",
    fontSize: "0.95rem",
    color: colors.text,
    fontWeight: 600,
  };

  const portfolioCardStyle = {
    background: "rgba(255, 255, 255, 0.98)",
    borderRadius: "20px",
    padding: "25px",
    boxShadow: `0 10px 35px rgba(255, 107, 107, 0.1)`,
    border: `2px solid ${colors.background}`,
  };

  const cardTitleStyle = {
    fontFamily: "'Poppins', sans-serif",
    fontSize: "1.2rem",
    fontWeight: 700,
    color: colors.text,
    marginBottom: "20px",
    display: "flex",
    alignItems: "center",
    gap: "10px",
  };

  const portfolioLinksStyle = {
    display: "flex",
    justifyContent: "space-around",
    gap: "15px",
  };

  const portfolioLinkStyle = {
    width: "60px",
    height: "60px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: colors.background,
    border: `3px solid ${colors.primary}`,
    transition: "all 0.3s ease",
    textDecoration: "none",
  };

  const portfolioIconStyle = {
    fontSize: "1.8rem",
    color: colors.primary,
  };

  // Main Content Styles
  const mainContentStyle = {
    display: "flex",
    flexDirection: "column",
    gap: "25px",
  };

  const sectionCardStyle = {
    background: "rgba(255, 255, 255, 0.98)",
    borderRadius: "20px",
    padding: "35px",
    boxShadow: `0 10px 35px rgba(255, 107, 107, 0.1)`,
    border: `2px solid ${colors.background}`,
  };

  const sectionHeaderStyle = {
    display: "flex",
    alignItems: "center",
    gap: "15px",
    marginBottom: "25px",
    paddingBottom: "15px",
    borderBottom: `3px solid ${colors.primary}`,
  };

  const sectionTitleStyle = {
    fontFamily: "'Poppins', sans-serif",
    fontSize: "1.8rem",
    fontWeight: 800,
    color: colors.text,
    letterSpacing: "0.5px",
    margin: 0,
  };

  const sectionIconStyle = {
    fontSize: "1.8rem",
    color: colors.primary,
  };

  const bioTextStyle = {
    fontFamily: "'Inter', sans-serif",
    fontSize: "1.1rem",
    lineHeight: "1.9",
    color: colors.text,
    fontWeight: 500,
  };

  const skillsGridStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
    gap: "15px",
    marginTop: "10px",
  };

  const skillChipStyle = {
    padding: "14px 20px",
    background: `linear-gradient(135deg, rgba(255, 107, 107, 0.12) 0%, rgba(29, 211, 176, 0.12) 100%)`,
    border: `2px solid ${colors.accent}`,
    borderRadius: "15px",
    fontFamily: "'Inter', sans-serif",
    fontSize: "0.95rem",
    fontWeight: 700,
    color: colors.text,
    transition: "all 0.3s ease",
    textAlign: "center",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
  };

  const statsGridStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "20px",
    marginBottom: "30px",
  };

  const statBoxStyle = {
    background: `linear-gradient(135deg, rgba(255, 107, 107, 0.1) 0%, rgba(29, 211, 176, 0.1) 100%)`,
    padding: "25px",
    borderRadius: "15px",
    textAlign: "center",
    border: `2px solid ${colors.accent}`,
  };

  const statNumberStyle = {
    fontFamily: "'Poppins', sans-serif",
    fontSize: "2.5rem",
    fontWeight: 900,
    color: colors.primary,
    marginBottom: "5px",
  };

  const statLabelStyle = {
    fontFamily: "'Inter', sans-serif",
    fontSize: "0.9rem",
    color: colors.text,
    fontWeight: 600,
  };

  const globalStyles = `
    @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700;800;900&family=Inter:wght@400;500;600;700;800&display=swap');

    .connect-btn:hover {
      transform: translateY(-3px);
      box-shadow: 0 12px 30px rgba(255, 107, 107, 0.4) !important;
    }

    .secondary-btn:hover {
      transform: translateY(-3px);
      box-shadow: 0 12px 30px rgba(29, 211, 176, 0.4) !important;
    }

    .edit-btn:hover {
      background: ${colors.accent} !important;
      color: white !important;
      transform: translateY(-2px);
    }

    .portfolio-link:hover {
      transform: scale(1.15) rotate(5deg);
      border-color: ${colors.accent} !important;
      box-shadow: 0 8px 20px rgba(29, 211, 176, 0.3);
    }

    .skill-chip:hover {
      transform: translateY(-3px) scale(1.05);
      border-color: ${colors.primary} !important;
      box-shadow: 0 8px 20px rgba(255, 107, 107, 0.25);
      background: linear-gradient(135deg, rgba(255, 107, 107, 0.2) 0%, rgba(29, 211, 176, 0.2) 100%) !important;
    }

    @media (max-width: 1024px) {
      .grid-layout {
        grid-template-columns: 1fr !important;
      }
    }

    * {
      box-sizing: border-box;
    }
  `;

  return (
    <>
      <style>{globalStyles}</style>
      <div style={containerStyle}>
        <div style={innerContainerStyle}>
          {loading ? (
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "50vh" }}>
              <Spinner animation="border" style={{ color: colors.primary, width: "3rem", height: "3rem" }} />
            </div>
          ) : (
            <div className="grid-layout" style={gridLayoutStyle}>
              {/* LEFT SIDEBAR */}
              <div style={sidebarStyle}>
                {/* Profile Card */}
                <div style={profileCardStyle}>
                  <div style={profilePhotoContainerStyle}>
                    <img src={profileUser?.picture} alt="Profile" style={profilePhotoStyle} />
                    <div style={verifiedBadgeStyle}>
                      <MdVerified style={{ color: "white", fontSize: "1.5rem" }} />
                    </div>
                  </div>

                  <h1 style={profileNameStyle}>{profileUser?.name}</h1>
                  <p style={usernameStyle}>@{username}</p>

                  {/* Rating Box */}
                  <div style={ratingBoxStyle}>
                    <div style={ratingStarsStyle}>
                      {profileUser?.rating
                        ? Array.from({ length: profileUser.rating }, (_, index) => <FaStar key={index} />)
                        : <>⭐⭐⭐⭐⭐</>}
                    </div>
                    <div style={ratingValueStyle}>
                      {profileUser?.rating ? profileUser?.rating : "5"}.0
                    </div>
                    <div style={ratingLabelStyle}>Overall Rating</div>
                  </div>

                  {/* Action Buttons */}
                  <div style={actionButtonsStyle}>
                    {user?.username === username ? (
                      <Link to="/edit_profile" style={{ textDecoration: "none" }}>
                        <button className="edit-btn" style={editButtonStyle}>
                          <FaEdit /> Edit Profile
                        </button>
                      </Link>
                    ) : (
                      <>
                        <button
                          className="connect-btn"
                          style={connectButtonStyle}
                          onClick={profileUser?.status === "Connect" ? connectHandler : undefined}
                        >
                          {connectLoading ? (
                            <>
                              <Spinner animation="border" size="sm" style={{ marginRight: "8px" }} />
                              Connecting...
                            </>
                          ) : (
                            profileUser?.status
                          )}
                        </button>

                        <Link to={`/rating/${profileUser.username}`} style={{ textDecoration: "none" }}>
                          <button className="secondary-btn" style={secondaryButtonStyle}>
                            <FaStar /> Rate User
                          </button>
                        </Link>

                        <Link to={`/report/${profileUser.username}`} style={{ textDecoration: "none" }}>
                          <button className="secondary-btn" style={{...secondaryButtonStyle, background: colors.secondary, boxShadow: `0 8px 20px rgba(255, 164, 27, 0.3)`}}>
                            <MdReport /> Report
                          </button>
                        </Link>
                      </>
                    )}
                  </div>
                </div>

                {/* Quick Info Card */}
                <div style={infoCardStyle}>
                  <h3 style={cardTitleStyle}>
                    <BsFillShieldFill style={{ color: colors.accent }} />
                    Quick Info
                  </h3>
                  <div style={infoItemStyle}>
                    <FaCalendarAlt style={infoIconStyle} />
                    <div>
                      <div style={{ fontSize: "0.8rem", color: "#64748B", marginBottom: "3px" }}>Joined</div>
                      <div style={infoTextStyle}>
                        {profileUser?.createdAt ? new Date(profileUser.createdAt).toLocaleDateString("en-US", { month: "short", year: "numeric" }) : "Recently"}
                      </div>
                    </div>
                  </div>
                  <div style={infoItemStyle}>
                    <FaUserGraduate style={infoIconStyle} />
                    <div>
                      <div style={{ fontSize: "0.8rem", color: "#64748B", marginBottom: "3px" }}>Education</div>
                      <div style={infoTextStyle}>
                        {profileUser?.education?.[0]?.degree || "Student"}
                      </div>
                    </div>
                  </div>
                  <div style={{...infoItemStyle, borderBottom: "none"}}>
                    <FaAward style={infoIconStyle} />
                    <div>
                      <div style={{ fontSize: "0.8rem", color: "#64748B", marginBottom: "3px" }}>Status</div>
                      <div style={infoTextStyle}>Active Learner</div>
                    </div>
                  </div>
                </div>

                {/* Portfolio Links Card */}
                <div style={portfolioCardStyle}>
                  <h3 style={cardTitleStyle}>
                    <FaLink style={{ color: colors.accent }} />
                    Connect
                  </h3>
                  <div style={portfolioLinksStyle}>
                    <a
                      href={profileUser?.githubLink || "#"}
                      target={profileUser?.githubLink ? "_blank" : "_self"}
                      className="portfolio-link"
                      style={portfolioLinkStyle}
                      rel="noreferrer"
                    >
                      <FaGithub style={portfolioIconStyle} />
                    </a>
                    <a
                      href={profileUser?.linkedinLink || "#"}
                      target={profileUser?.linkedinLink ? "_blank" : "_self"}
                      className="portfolio-link"
                      style={portfolioLinkStyle}
                      rel="noreferrer"
                    >
                      <FaLinkedin style={portfolioIconStyle} />
                    </a>
                    <a
                      href={profileUser?.portfolioLink || "#"}
                      target={profileUser?.portfolioLink ? "_blank" : "_self"}
                      className="portfolio-link"
                      style={portfolioLinkStyle}
                      rel="noreferrer"
                    >
                      <FaLink style={portfolioIconStyle} />
                    </a>
                  </div>
                </div>
              </div>

              {/* MAIN CONTENT */}
              <div style={mainContentStyle}>
                {/* Stats Overview */}
                <div style={statsGridStyle}>
                  <div style={statBoxStyle}>
                    <div style={statNumberStyle}>{profileUser?.skillsProficientAt?.length || 0}</div>
                    <div style={statLabelStyle}>Skills</div>
                  </div>
                  <div style={statBoxStyle}>
                    <div style={statNumberStyle}>{profileUser?.education?.length || 0}</div>
                    <div style={statLabelStyle}>Education</div>
                  </div>
                  <div style={statBoxStyle}>
                    <div style={statNumberStyle}>{profileUser?.projects?.length || 0}</div>
                    <div style={statLabelStyle}>Projects</div>
                  </div>
                </div>

                {/* Bio Section */}
                <div style={sectionCardStyle}>
                  <div style={sectionHeaderStyle}>
                    <FaBriefcase style={sectionIconStyle} />
                    <h2 style={sectionTitleStyle}>About Me</h2>
                  </div>
                  <p style={bioTextStyle}>{profileUser?.bio || "No bio available yet."}</p>
                </div>

                {/* Skills Section */}
                <div style={sectionCardStyle}>
                  <div style={sectionHeaderStyle}>
                    <GiSkills style={sectionIconStyle} />
                    <h2 style={sectionTitleStyle}>Skills & Expertise</h2>
                  </div>
                  <div style={skillsGridStyle}>
                    {profileUser?.skillsProficientAt?.map((skill, index) => (
                      <div className="skill-chip" style={skillChipStyle} key={index}>
                        <FaLaptopCode style={{ color: colors.accent }} />
                        {skill}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Education Section */}
                <div style={sectionCardStyle}>
                  <div style={sectionHeaderStyle}>
                    <FaUserGraduate style={sectionIconStyle} />
                    <h2 style={sectionTitleStyle}>Education</h2>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                    {profileUser?.education?.map((edu, index) => (
                      <Box
                        key={index}
                        head={edu?.institution}
                        date={convertDate(edu?.startDate) + " - " + convertDate(edu?.endDate)}
                        spec={edu?.degree}
                        desc={edu?.description}
                        score={edu?.score}
                      />
                    ))}
                  </div>
                </div>

                {/* Projects Section */}
                {profileUser?.projects && profileUser?.projects.length > 0 && (
                  <div style={sectionCardStyle}>
                    <div style={sectionHeaderStyle}>
                      <FaLaptopCode style={sectionIconStyle} />
                      <h2 style={sectionTitleStyle}>Projects & Work</h2>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                      {profileUser?.projects?.map((project, index) => (
                        <Box
                          key={index}
                          head={project?.title}
                          date={convertDate(project?.startDate) + " - " + convertDate(project?.endDate)}
                          desc={project?.description}
                          skills={project?.techStack}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Profile;
