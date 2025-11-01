import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../util/UserContext";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Nav from "react-bootstrap/Nav";
import Spinner from "react-bootstrap/Spinner";
import ProfileCard from "./ProfileCard";
import { 
  FaStar, 
  FaCode, 
  FaBrain, 
  FaPalette, 
  FaCompass,
  FaLaptopCode,
  FaRobot,
  FaEllipsisH,
  FaUsers
} from "react-icons/fa";
import { MdTrendingUp } from "react-icons/md";

const Discover = () => {
  const navigate = useNavigate();
  const { user, setUser } = useUser();
  const [loading, setLoading] = useState(false);
  const [discoverUsers, setDiscoverUsers] = useState([]);
  const [webDevUsers, setWebDevUsers] = useState([]);
  const [mlUsers, setMlUsers] = useState([]);
  const [otherUsers, setOtherUsers] = useState([]);

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
      try {
        setLoading(true);
        const { data } = await axios.get(`/user/registered/getDetails`);
        console.log(data.data);
        setUser(data.data);
        localStorage.setItem("userInfo", JSON.stringify(data.data));
      } catch (error) {
        console.log(error);
        if (error?.response?.data?.message) {
          toast.error(error.response.data.message);
        }
        localStorage.removeItem("userInfo");
        setUser(null);
        await axios.get("/auth/logout");
        navigate("/login");
      }
    };

    const getDiscoverUsers = async () => {
      try {
        const { data } = await axios.get("/user/discover");
        console.log(data);
        setDiscoverUsers(data.data.forYou);
        setWebDevUsers(data.data.webDev);
        setMlUsers(data.data.ml);
        setOtherUsers(data.data.others);
      } catch (error) {
        console.log(error);
        if (error?.response?.data?.message) {
          toast.error(error.response.data.message);
        }
        localStorage.removeItem("userInfo");
        setUser(null);
        await axios.get("/auth/logout");
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    getUser();
    getDiscoverUsers();
  }, []);

  const globalStyles = `
    @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700;800;900&family=Inter:wght@400;500;600;700;800&display=swap');

    .discover-page {
      min-height: 100vh;
      background: linear-gradient(135deg, ${colors.background} 0%, #FFFFFF 100%);
      padding: 30px 20px;
    }

    .discover-container {
      max-width: 1600px;
      margin: 0 auto;
      display: flex;
      gap: 30px;
    }

    .discover-sidebar {
      width: 280px;
      flex-shrink: 0;
    }

    .sidebar-sticky {
      position: sticky;
      top: 100px;
      background: rgba(255, 255, 255, 0.95);
      border-radius: 20px;
      padding: 30px 20px;
      border: 3px solid ${colors.primary};
      box-shadow: 0 15px 40px rgba(255, 107, 107, 0.15);
    }

    .sidebar-title {
      font-family: 'Poppins', sans-serif;
      font-size: 1.5rem;
      font-weight: 800;
      color: ${colors.text};
      margin-bottom: 25px;
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .discover-nav-link {
      font-family: 'Inter', sans-serif;
      font-size: 1rem;
      font-weight: 600;
      color: ${colors.text} !important;
      padding: 12px 18px;
      border-radius: 12px;
      margin-bottom: 10px;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      gap: 12px;
      text-decoration: none;
      border: 2px solid transparent;
    }

    .discover-nav-link:hover {
      background: linear-gradient(135deg, rgba(255, 107, 107, 0.1) 0%, rgba(29, 211, 176, 0.1) 100%) !important;
      border-color: ${colors.accent} !important;
      transform: translateX(5px);
    }

    .discover-main {
      flex: 1;
      min-width: 0;
    }

    .discover-section {
      margin-bottom: 60px;
      scroll-margin-top: 100px;
    }

    .section-header {
      display: flex;
      align-items: flex-start;
      gap: 15px;
      margin-bottom: 30px;
      padding-bottom: 15px;
      border-bottom: 4px solid ${colors.primary};
    }

    .section-icon {
      font-size: 2.5rem;
      color: ${colors.primary};
      flex-shrink: 0;
    }

    .section-title {
      font-family: 'Poppins', sans-serif;
      font-size: 2.5rem;
      font-weight: 900;
      color: ${colors.text};
      margin: 0;
      line-height: 1.2;
    }

    .section-subtitle {
      font-family: 'Inter', sans-serif;
      font-size: 1rem;
      color: #64748B;
      font-weight: 600;
      margin-top: 8px;
    }

    .subsection-title {
      font-family: 'Poppins', sans-serif;
      font-size: 1.8rem;
      font-weight: 800;
      color: ${colors.text};
      margin-bottom: 25px;
      margin-top: 40px;
      display: flex;
      align-items: center;
      gap: 12px;
      scroll-margin-top: 100px;
    }

    .profile-cards {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
      gap: 30px;
      margin-bottom: 40px;
    }

    .empty-state {
      background: rgba(255, 255, 255, 0.8);
      border-radius: 20px;
      padding: 60px 40px;
      text-align: center;
      border: 2px dashed ${colors.primary};
    }

    .empty-icon {
      font-size: 4rem;
      opacity: 0.3;
      margin-bottom: 20px;
    }

    .empty-text {
      font-family: 'Poppins', sans-serif;
      font-size: 1.3rem;
      font-weight: 700;
      color: ${colors.text};
      opacity: 0.6;
      margin: 0;
    }

    .loading-container {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      min-height: 60vh;
      gap: 20px;
    }

    .loading-text {
      font-family: 'Poppins', sans-serif;
      font-size: 1.3rem;
      font-weight: 700;
      color: ${colors.primary};
    }

    @media (max-width: 1024px) {
      .discover-container {
        flex-direction: column;
      }
      
      .discover-sidebar {
        width: 100%;
      }

      .sidebar-sticky {
        position: relative;
        top: 0;
      }

      .profile-cards {
        grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      }
    }

    html {
      scroll-behavior: smooth;
    }
  `;

  return (
    <>
      <style>{globalStyles}</style>
      <div className="discover-page">
        <div className="discover-container">
          {/* Sidebar Navigation */}
          <div className="discover-sidebar">
            <div className="sidebar-sticky">
              <h3 className="sidebar-title">
                <FaCompass style={{ color: colors.accent }} />
                Explore
              </h3>
              <Nav className="flex-column">
                <Nav.Link href="#for-you" className="discover-nav-link">
                  <FaStar style={{ color: colors.primary, fontSize: "1.2rem" }} />
                  For You
                </Nav.Link>
                <Nav.Link href="#popular" className="discover-nav-link">
                  <MdTrendingUp style={{ color: colors.secondary, fontSize: "1.2rem" }} />
                  Trending
                </Nav.Link>
                <Nav.Link href="#web-development" className="discover-nav-link">
                  <FaLaptopCode style={{ color: colors.accent, fontSize: "1.2rem" }} />
                  Web Dev
                </Nav.Link>
                <Nav.Link href="#machine-learning" className="discover-nav-link">
                  <FaRobot style={{ color: colors.primary, fontSize: "1.2rem" }} />
                  AI & ML
                </Nav.Link>
                <Nav.Link href="#others" className="discover-nav-link">
                  <FaEllipsisH style={{ color: colors.secondary, fontSize: "1.2rem" }} />
                  More Skills
                </Nav.Link>
              </Nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="discover-main">
            {loading ? (
              <div className="loading-container">
                <Spinner animation="border" style={{ color: colors.primary, width: "4rem", height: "4rem" }} />
                <p className="loading-text">Discovering amazing learners...</p>
              </div>
            ) : (
              <>
                {/* For You Section */}
                <div id="for-you" className="discover-section">
                  <div className="section-header">
                    <FaStar className="section-icon" />
                    <div>
                      <h2 className="section-title">Handpicked For You</h2>
                      <p className="section-subtitle">
                        Discover learners matched to your interests and skills
                      </p>
                    </div>
                  </div>
                  <div className="profile-cards">
                    {discoverUsers && discoverUsers.length > 0 ? (
                      discoverUsers.map((user, index) => (
                        <ProfileCard
                          key={index}
                          profileImageUrl={user?.picture}
                          name={user?.name}
                          rating={user?.rating ? user?.rating : 5}
                          bio={user?.bio}
                          skills={user?.skillsProficientAt}
                          username={user?.username}
                        />
                      ))
                    ) : (
                      <div className="empty-state">
                        <FaUsers className="empty-icon" style={{ color: colors.primary }} />
                        <p className="empty-text">No learners found yet. Check back soon!</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Popular Section */}
                <div id="popular" className="discover-section">
                  <div className="section-header">
                    <MdTrendingUp className="section-icon" style={{ color: colors.secondary }} />
                    <div>
                      <h2 className="section-title">Trending Skills</h2>
                      <p className="section-subtitle">
                        Explore the most sought-after skills and mentors right now
                      </p>
                    </div>
                  </div>

                  {/* Web Development */}
                  <h3 id="web-development" className="subsection-title">
                    <FaLaptopCode style={{ color: colors.accent }} />
                    Web Development
                  </h3>
                  <div className="profile-cards">
                    {webDevUsers && webDevUsers.length > 0 ? (
                      webDevUsers.map((user, index) => (
                        <ProfileCard
                          key={index}
                          profileImageUrl={user?.picture}
                          name={user?.name}
                          rating={user?.rating ? user?.rating : 4}
                          bio={user?.bio}
                          skills={user?.skillsProficientAt}
                          username={user?.username}
                        />
                      ))
                    ) : (
                      <div className="empty-state">
                        <FaLaptopCode className="empty-icon" style={{ color: colors.accent }} />
                        <p className="empty-text">No web developers available at the moment</p>
                      </div>
                    )}
                  </div>

                  {/* Machine Learning */}
                  <h3 id="machine-learning" className="subsection-title">
                    <FaRobot style={{ color: colors.primary }} />
                    AI & Machine Learning
                  </h3>
                  <div className="profile-cards">
                    {mlUsers && mlUsers.length > 0 ? (
                      mlUsers.map((user, index) => (
                        <ProfileCard
                          key={index}
                          profileImageUrl={user?.picture}
                          name={user?.name}
                          rating={user?.rating ? user?.rating : 4}
                          bio={user?.bio}
                          skills={user?.skillsProficientAt}
                          username={user?.username}
                        />
                      ))
                    ) : (
                      <div className="empty-state">
                        <FaRobot className="empty-icon" style={{ color: colors.primary }} />
                        <p className="empty-text">No AI/ML experts available at the moment</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Others Section */}
                <div id="others" className="discover-section">
                  <div className="section-header">
                    <FaPalette className="section-icon" style={{ color: colors.secondary }} />
                    <div>
                      <h2 className="section-title">Diverse Skills</h2>
                      <p className="section-subtitle">
                        From art to mathematics, discover learners across all disciplines
                      </p>
                    </div>
                  </div>
                  <div className="profile-cards">
                    {otherUsers && otherUsers.length > 0 ? (
                      otherUsers.map((user, index) => (
                        <ProfileCard
                          key={index}
                          profileImageUrl={user?.picture}
                          name={user?.name}
                          rating={user?.rating ? user?.rating : 4}
                          bio={user?.bio}
                          skills={user?.skillsProficientAt}
                          username={user?.username}
                        />
                      ))
                    ) : (
                      <div className="empty-state">
                        <FaPalette className="empty-icon" style={{ color: colors.secondary }} />
                        <p className="empty-text">No learners in other categories yet</p>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Discover;
