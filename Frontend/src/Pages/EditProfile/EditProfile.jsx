import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Spinner from "react-bootstrap/Spinner";
import Form from "react-bootstrap/Form";
import { skills } from "./Skills";
import axios from "axios";
import Badge from "react-bootstrap/Badge";
import { v4 as uuidv4 } from "uuid";
import { useUser } from "../../util/UserContext";
import { 
  FaUser, 
  FaEnvelope, 
  FaLink, 
  FaGithub, 
  FaLinkedin, 
  FaGraduationCap,
  FaLaptopCode,
  FaPlus,
  FaTimes,
  FaSave,
  FaArrowRight
} from "react-icons/fa";

const EditProfile = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const { user, setUser } = useUser();

  // Skill Energy Color Palette
  const colors = {
    primary: "#FF6B6B",
    secondary: "#FFA41B",
    accent: "#1DD3B0",
    background: "#FFF8E8",
    text: "#1E293B"
  };

  const [form, setForm] = useState({
    profilePhoto: null,
    name: "",
    email: "",
    username: "",
    portfolioLink: "",
    githubLink: "",
    linkedinLink: "",
    skillsProficientAt: [],
    skillsToLearn: [],
    education: [
      {
        id: uuidv4(),
        institution: "",
        degree: "",
        startDate: "",
        endDate: "",
        score: "",
        description: "",
      },
    ],
    bio: "",
    projects: [],
  });
  const [skillsProficientAt, setSkillsProficientAt] = useState("Select some skill");
  const [skillsToLearn, setSkillsToLearn] = useState("Select some skill");
  const [techStack, setTechStack] = useState([]);
  const [activeKey, setActiveKey] = useState("registration");

  useEffect(() => {
    if (user) {
      setForm((prevState) => ({
        ...prevState,
        name: user?.name,
        email: user?.email,
        username: user?.username,
        skillsProficientAt: user?.skillsProficientAt,
        skillsToLearn: user?.skillsToLearn,
        portfolioLink: user?.portfolioLink,
        githubLink: user?.githubLink,
        linkedinLink: user?.linkedinLink,
        education: user?.education,
        bio: user?.bio,
        projects: user?.projects,
      }));
      setTechStack(user?.projects.map((project) => "Select some Tech Stack"));
    }
  }, []);

  const handleNext = () => {
    const tabs = ["registration", "education", "longer-tab"];
    const currentIndex = tabs.indexOf(activeKey);
    if (currentIndex < tabs.length - 1) {
      setActiveKey(tabs[currentIndex + 1]);
    }
  };

  const handleFileChange = async (e) => {
    const data = new FormData();
    data.append("picture", e.target.files[0]);
    try {
      toast.info("Uploading your picture, please wait...");
      const response = await axios.post("/user/uploadPicture", data);
      toast.success("Picture uploaded successfully!");
      setForm(() => ({
        ...form,
        picture: response.data.data.url,
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
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setForm((prevState) => ({
        ...prevState,
        [name]: checked ? [...prevState[name], value] : prevState[name].filter((item) => item !== value),
      }));
    } else {
      if (name === "bio" && value.length > 500) {
        toast.error("Bio should be less than 500 characters");
        return;
      }
      setForm((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  const handleAddSkill = (e) => {
    const { name } = e.target;
    if (name === "skill_to_learn") {
      if (skillsToLearn === "Select some skill") {
        toast.error("Select a skill to add");
        return;
      }
      if (form.skillsToLearn.includes(skillsToLearn)) {
        toast.error("Skill already added");
        return;
      }
      if (form.skillsProficientAt.includes(skillsToLearn)) {
        toast.error("Skill already added in skills proficient at");
        return;
      }
      setForm((prevState) => ({
        ...prevState,
        skillsToLearn: [...prevState.skillsToLearn, skillsToLearn],
      }));
    } else {
      if (skillsProficientAt === "Select some skill") {
        toast.error("Select a skill to add");
        return;
      }
      if (form.skillsProficientAt.includes(skillsProficientAt)) {
        toast.error("Skill already added");
        return;
      }
      if (form.skillsToLearn.includes(skillsProficientAt)) {
        toast.error("Skill already added in skills to learn");
        return;
      }
      setForm((prevState) => ({
        ...prevState,
        skillsProficientAt: [...prevState.skillsProficientAt, skillsProficientAt],
      }));
    }
  };

  const handleRemoveSkill = (e, temp) => {
    const skill = e.target.innerText.split(" ")[0];
    if (temp === "skills_proficient_at") {
      setForm((prevState) => ({
        ...prevState,
        skillsProficientAt: prevState.skillsProficientAt.filter((item) => item !== skill),
      }));
    } else {
      setForm((prevState) => ({
        ...prevState,
        skillsToLearn: prevState.skillsToLearn.filter((item) => item !== skill),
      }));
    }
  };

  const handleRemoveEducation = (e, tid) => {
    const updatedEducation = form.education.filter((item, i) => item._id !== tid);
    setForm((prevState) => ({
      ...prevState,
      education: updatedEducation,
    }));
  };

  const handleEducationChange = (e, index) => {
    const { name, value } = e.target;
    setForm((prevState) => ({
      ...prevState,
      education: prevState.education.map((item, i) => (i === index ? { ...item, [name]: value } : item)),
    }));
  };

  const handleAdditionalChange = (e, index) => {
    const { name, value } = e.target;
    setForm((prevState) => ({
      ...prevState,
      projects: prevState.projects.map((item, i) => (i === index ? { ...item, [name]: value } : item)),
    }));
  };

  const validateRegForm = () => {
    if (!form.username) {
      toast.error("Username is required");
      return false;
    }
    if (!form.skillsProficientAt.length) {
      toast.error("Add at least one skill you're proficient at");
      return false;
    }
    if (!form.skillsToLearn.length) {
      toast.error("Add at least one skill you want to learn");
      return false;
    }
    if (!form.portfolioLink && !form.githubLink && !form.linkedinLink) {
      toast.error("Add at least one profile link (Portfolio, GitHub, or LinkedIn)");
      return false;
    }
    const githubRegex = /^(?:http(?:s)?:\/\/)?(?:www\.)?github\.com\/[a-zA-Z0-9_-]+(?:\/)?$/;
    if (form.githubLink && githubRegex.test(form.githubLink) === false) {
      toast.error("Enter a valid GitHub link");
      return false;
    }
    const linkedinRegex = /^(?:http(?:s)?:\/\/)?(?:www\.)?linkedin\.com\/in\/[a-zA-Z0-9_-]+(?:\/)?$/;
    if (form.linkedinLink && linkedinRegex.test(form.linkedinLink) === false) {
      toast.error("Enter a valid LinkedIn link");
      return false;
    }
    if (form.portfolioLink && form.portfolioLink.includes("http") === false) {
      toast.error("Enter a valid portfolio link");
      return false;
    }
    return true;
  };

  const validateEduForm = () => {
    for (let i = 0; i < form.education.length; i++) {
      const edu = form.education[i];
      if (!edu.institution) {
        toast.error(`Institution name is required in education ${i + 1}`);
        return false;
      }
      if (!edu.degree) {
        toast.error(`Degree is required in education ${i + 1}`);
        return false;
      }
      if (!edu.startDate) {
        toast.error(`Start date is required in education ${i + 1}`);
        return false;
      }
      if (!edu.endDate) {
        toast.error(`End date is required in education ${i + 1}`);
        return false;
      }
      if (!edu.score) {
        toast.error(`Score is required in education ${i + 1}`);
        return false;
      }
    }
    return true;
  };

  const validateAddForm = () => {
    if (!form.bio) {
      toast.error("Bio is required");
      return false;
    }
    if (form.bio.length > 500) {
      toast.error("Bio should be less than 500 characters");
      return false;
    }
    for (let i = 0; i < form.projects.length; i++) {
      const project = form.projects[i];
      if (!project.title) {
        toast.error(`Title is required in project ${i + 1}`);
        return false;
      }
      if (!project.techStack.length) {
        toast.error(`Tech stack is required in project ${i + 1}`);
        return false;
      }
      if (!project.startDate) {
        toast.error(`Start date is required in project ${i + 1}`);
        return false;
      }
      if (!project.endDate) {
        toast.error(`End date is required in project ${i + 1}`);
        return false;
      }
      if (!project.projectLink) {
        toast.error(`Project link is required in project ${i + 1}`);
        return false;
      }
      if (!project.description) {
        toast.error(`Description is required in project ${i + 1}`);
        return false;
      }
      if (project.startDate > project.endDate) {
        toast.error(`Start date must be before end date in project ${i + 1}`);
        return false;
      }
      if (!project.projectLink.match(/^(http|https):\/\/[^ "]+$/)) {
        toast.error(`Please provide a valid project link in project ${i + 1}`);
        return false;
      }
    }
    return true;
  };

  const handleSaveRegistration = async () => {
    const check = validateRegForm();
    if (check) {
      setSaveLoading(true);
      try {
        const { data } = await axios.post("/user/registered/saveRegDetails", form);
        toast.success("Details saved successfully!");
      } catch (error) {
        console.log(error);
        if (error?.response?.data?.message) {
          toast.error(error.response.data.message);
        } else {
          toast.error("Something went wrong");
        }
      } finally {
        setSaveLoading(false);
      }
    }
  };

  const handleSaveEducation = async () => {
    const check1 = validateRegForm();
    const check2 = validateEduForm();
    if (check1 && check2) {
      setSaveLoading(true);
      try {
        const { data } = await axios.post("/user/registered/saveEduDetail", form);
        toast.success("Education details saved successfully!");
      } catch (error) {
        console.log(error);
        if (error?.response?.data?.message) {
          toast.error(error.response.data.message);
        } else {
          toast.error("Something went wrong");
        }
      } finally {
        setSaveLoading(false);
      }
    }
  };

  const handleSaveAdditional = async () => {
    const check1 = validateRegForm();
    const check2 = validateEduForm();
    const check3 = validateAddForm();
    if (check1 && check2 && check3) {
      setSaveLoading(true);
      try {
        const { data } = await axios.post("/user/registered/saveAddDetail", form);
        toast.success("Additional details saved successfully!");
      } catch (error) {
        console.log(error);
        if (error?.response?.data?.message) {
          toast.error(error.response.data.message);
        } else {
          toast.error("Something went wrong");
        }
      } finally {
        setSaveLoading(false);
      }
    }
  };

  const globalStyles = `
    @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700;800;900&family=Inter:wght@400;500;600;700;800&display=swap');

    .edit-profile-page {
      min-height: 100vh;
      background: linear-gradient(135deg, ${colors.background} 0%, #FFFFFF 100%);
      padding: 40px 20px;
    }

    .edit-profile-container {
      max-width: 900px;
      margin: 0 auto;
    }

    .page-title {
      font-family: 'Poppins', sans-serif;
      font-size: clamp(2rem, 5vw, 3rem);
      font-weight: 900;
      text-align: center;
      color: ${colors.text};
      margin-bottom: 40px;
      letter-spacing: 0.5px;
    }

    .form-section {
      background: rgba(255, 255, 255, 0.95);
      border-radius: 25px;
      padding: 40px;
      box-shadow: 0 15px 50px rgba(255, 107, 107, 0.15);
      border: 3px solid ${colors.primary};
    }

    .nav-tabs {
      border-bottom: 3px solid ${colors.primary};
      margin-bottom: 30px;
    }

    .nav-tabs .nav-link {
      font-family: 'Inter', sans-serif;
      font-size: 1.1rem;
      font-weight: 700;
      color: ${colors.text};
      border: none;
      padding: 15px 30px;
      margin-right: 10px;
      border-radius: 12px 12px 0 0;
      transition: all 0.3s ease;
    }

    .nav-tabs .nav-link:hover {
      background: linear-gradient(135deg, rgba(255, 107, 107, 0.1) 0%, rgba(29, 211, 176, 0.1) 100%);
      color: ${colors.primary};
    }

    .nav-tabs .nav-link.active {
      background: linear-gradient(135deg, ${colors.primary} 0%, ${colors.accent} 100%);
      color: white;
      border: none;
    }

    .form-label {
      font-family: 'Inter', sans-serif;
      font-size: 1rem;
      font-weight: 700;
      color: ${colors.text};
      margin-bottom: 10px;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .form-input {
      width: 100%;
      padding: 12px 15px;
      font-family: 'Inter', sans-serif;
      font-size: 1rem;
      border: 2px solid ${colors.background};
      border-radius: 12px;
      transition: all 0.3s ease;
      margin-bottom: 20px;
    }

    .form-input:focus {
      outline: none;
      border-color: ${colors.primary};
      box-shadow: 0 0 0 3px rgba(255, 107, 107, 0.1);
    }

    .form-input:disabled {
      background: ${colors.background};
      cursor: not-allowed;
      opacity: 0.7;
    }

    .skill-badge {
      background: linear-gradient(135deg, ${colors.primary} 0%, ${colors.accent} 100%);
      color: white;
      padding: 8px 15px;
      border-radius: 20px;
      font-family: 'Inter', sans-serif;
      font-size: 0.9rem;
      font-weight: 600;
      margin: 5px;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .skill-badge:hover {
      transform: translateY(-2px);
      box-shadow: 0 5px 15px rgba(255, 107, 107, 0.3);
    }

    .btn-primary-custom {
      background: linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%);
      color: white;
      border: none;
      padding: 12px 30px;
      border-radius: 12px;
      font-family: 'Inter', sans-serif;
      font-size: 1rem;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.3s ease;
      display: inline-flex;
      align-items: center;
      gap: 10px;
      margin: 5px;
    }

    .btn-primary-custom:hover {
      transform: translateY(-2px);
      box-shadow: 0 10px 30px rgba(255, 107, 107, 0.4);
    }

    .btn-success-custom {
      background: ${colors.accent};
      color: white;
      border: none;
      padding: 14px 40px;
      border-radius: 12px;
      font-family: 'Inter', sans-serif;
      font-size: 1.1rem;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.3s ease;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      width: 100%;
      margin-top: 10px;
    }

    .btn-success-custom:hover {
      transform: translateY(-2px);
      box-shadow: 0 10px 30px rgba(29, 211, 176, 0.4);
    }

    .btn-next-custom {
      background: linear-gradient(135deg, ${colors.accent} 0%, ${colors.primary} 100%);
      color: white;
      border: none;
      padding: 14px 40px;
      border-radius: 12px;
      font-family: 'Inter', sans-serif;
      font-size: 1.1rem;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.3s ease;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      width: 100%;
      margin-top: 10px;
    }

    .btn-next-custom:hover {
      transform: translateY(-2px);
      box-shadow: 0 10px 30px rgba(29, 211, 176, 0.4);
    }

    .education-card {
      background: linear-gradient(135deg, rgba(255, 107, 107, 0.05) 0%, rgba(29, 211, 176, 0.05) 100%);
      border: 2px solid ${colors.primary};
      border-radius: 20px;
      padding: 25px;
      margin-bottom: 20px;
      position: relative;
    }

    .remove-btn {
      position: absolute;
      top: 15px;
      right: 15px;
      background: ${colors.secondary};
      color: white;
      border: none;
      width: 35px;
      height: 35px;
      border-radius: 50%;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s ease;
    }

    .remove-btn:hover {
      background: ${colors.primary};
      transform: rotate(90deg);
    }

    .form-select-custom {
      width: 100%;
      padding: 12px 15px;
      font-family: 'Inter', sans-serif;
      font-size: 1rem;
      border: 2px solid ${colors.background};
      border-radius: 12px;
      transition: all 0.3s ease;
      margin-bottom: 15px;
    }

    .form-select-custom:focus {
      outline: none;
      border-color: ${colors.primary};
      box-shadow: 0 0 0 3px rgba(255, 107, 107, 0.1);
    }

    .loading-spinner {
      color: ${colors.primary};
    }

    * {
      box-sizing: border-box;
    }
  `;

  return (
    <>
      <style>{globalStyles}</style>
      <div className="edit-profile-page">
        <div className="edit-profile-container">
          <h1 className="page-title">Update Your Profile</h1>
          {loading ? (
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
              <Spinner animation="border" className="loading-spinner" style={{ width: "4rem", height: "4rem" }} />
            </div>
          ) : (
            <div className="form-section">
              <Tabs activeKey={activeKey} onSelect={(k) => setActiveKey(k)}>
                {/* Registration Tab */}
                <Tab eventKey="registration" title="Basic Info">
                  <div>
                    <label className="form-label">
                      <FaUser style={{ color: colors.primary }} />
                      Name
                    </label>
                    <input
                      type="text"
                      className="form-input"
                      value={form.name}
                      disabled
                    />
                  </div>

                  <div>
                    <label className="form-label">
                      <FaEnvelope style={{ color: colors.primary }} />
                      Profile Photo
                    </label>
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleFileChange}
                      style={{ marginBottom: "20px" }}
                    />
                  </div>

                  <div>
                    <label className="form-label">
                      <FaEnvelope style={{ color: colors.primary }} />
                      Email
                    </label>
                    <input
                      type="text"
                      className="form-input"
                      value={form.email}
                      disabled
                    />
                  </div>

                  <div>
                    <label className="form-label">
                      <FaUser style={{ color: colors.primary }} />
                      Username
                    </label>
                    <input
                      type="text"
                      name="username"
                      className="form-input"
                      value={form.username}
                      onChange={handleInputChange}
                      placeholder="Choose your unique username"
                    />
                  </div>

                  <div>
                    <label className="form-label">
                      <FaLinkedin style={{ color: colors.primary }} />
                      LinkedIn Profile
                    </label>
                    <input
                      type="text"
                      name="linkedinLink"
                      className="form-input"
                      value={form.linkedinLink}
                      onChange={handleInputChange}
                      placeholder="https://linkedin.com/in/yourprofile"
                    />
                  </div>

                  <div>
                    <label className="form-label">
                      <FaGithub style={{ color: colors.primary }} />
                      GitHub Profile
                    </label>
                    <input
                      type="text"
                      name="githubLink"
                      className="form-input"
                      value={form.githubLink}
                      onChange={handleInputChange}
                      placeholder="https://github.com/yourusername"
                    />
                  </div>

                  <div>
                    <label className="form-label">
                      <FaLink style={{ color: colors.primary }} />
                      Portfolio Link
                    </label>
                    <input
                      type="text"
                      name="portfolioLink"
                      className="form-input"
                      value={form.portfolioLink}
                      onChange={handleInputChange}
                      placeholder="https://yourportfolio.com"
                    />
                  </div>

                  <div>
                    <label className="form-label">
                      Skills You're Proficient At
                    </label>
                    <Form.Select
                      className="form-select-custom"
                      value={skillsProficientAt}
                      onChange={(e) => setSkillsProficientAt(e.target.value)}
                    >
                      <option>Select a skill</option>
                      {skills.map((skill, index) => (
                        <option key={index} value={skill}>
                          {skill}
                        </option>
                      ))}
                    </Form.Select>
                    {form?.skillsProficientAt?.length > 0 && (
                      <div>
                        {form.skillsProficientAt.map((skill, index) => (
                          <span
                            key={index}
                            className="skill-badge"
                            onClick={(event) => handleRemoveSkill(event, "skills_proficient_at")}
                          >
                            {skill} <FaTimes />
                          </span>
                        ))}
                      </div>
                    )}
                    <button className="btn-primary-custom" name="skill_proficient_at" onClick={handleAddSkill}>
                      <FaPlus /> Add Skill
                    </button>
                  </div>

                  <div>
                    <label className="form-label">
                      Skills You Want to Learn
                    </label>
                    <Form.Select
                      className="form-select-custom"
                      value={skillsToLearn}
                      onChange={(e) => setSkillsToLearn(e.target.value)}
                    >
                      <option>Select a skill</option>
                      {skills.map((skill, index) => (
                        <option key={index} value={skill}>
                          {skill}
                        </option>
                      ))}
                    </Form.Select>
                    {form?.skillsToLearn?.length > 0 && (
                      <div>
                        {form.skillsToLearn.map((skill, index) => (
                          <span
                            key={index}
                            className="skill-badge"
                            onClick={(event) => handleRemoveSkill(event, "skills_to_learn")}
                          >
                            {skill} <FaTimes />
                          </span>
                        ))}
                      </div>
                    )}
                    <button className="btn-primary-custom" name="skill_to_learn" onClick={handleAddSkill}>
                      <FaPlus /> Add Skill
                    </button>
                  </div>

                  <button className="btn-success-custom" onClick={handleSaveRegistration} disabled={saveLoading}>
                    {saveLoading ? <Spinner animation="border" size="sm" /> : <><FaSave /> Save Changes</>}
                  </button>
                  <button onClick={handleNext} className="btn-next-custom">
                    Next <FaArrowRight />
                  </button>
                </Tab>

                {/* Education Tab */}
                <Tab eventKey="education" title="Education">
                  {form?.education?.map((edu, index) => (
                    <div className="education-card" key={edu?._id || index}>
                      {index !== 0 && (
                        <button className="remove-btn" onClick={(e) => handleRemoveEducation(e, edu?._id)}>
                          <FaTimes />
                        </button>
                      )}
                      <label className="form-label">
                        <FaGraduationCap style={{ color: colors.primary }} />
                        Institution Name
                      </label>
                      <input
                        type="text"
                        name="institution"
                        className="form-input"
                        value={edu.institution}
                        onChange={(e) => handleEducationChange(e, index)}
                        placeholder="Enter institution name"
                      />
                      <label className="form-label">Degree</label>
                      <input
                        type="text"
                        name="degree"
                        className="form-input"
                        value={edu.degree}
                        onChange={(e) => handleEducationChange(e, index)}
                        placeholder="E.g., B.Tech in Computer Science"
                      />
                      <label className="form-label">Grade/Percentage</label>
                      <input
                        type="number"
                        name="score"
                        className="form-input"
                        value={edu.score}
                        onChange={(e) => handleEducationChange(e, index)}
                        placeholder="Your CGPA or percentage"
                      />
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
                        <div>
                          <label className="form-label">Start Date</label>
                          <input
                            type="date"
                            name="startDate"
                            className="form-input"
                            value={edu.startDate ? new Date(edu.startDate).toISOString().split("T")[0] : ""}
                            onChange={(e) => handleEducationChange(e, index)}
                          />
                        </div>
                        <div>
                          <label className="form-label">End Date</label>
                          <input
                            type="date"
                            name="endDate"
                            className="form-input"
                            value={edu.endDate ? new Date(edu.endDate).toISOString().split("T")[0] : ""}
                            onChange={(e) => handleEducationChange(e, index)}
                          />
                        </div>
                      </div>
                      <label className="form-label">Description</label>
                      <input
                        type="text"
                        name="description"
                        className="form-input"
                        value={edu.description}
                        onChange={(e) => handleEducationChange(e, index)}
                        placeholder="Notable achievements or experiences"
                      />
                    </div>
                  ))}
                  <button
                    className="btn-primary-custom"
                    style={{ width: "100%", justifyContent: "center", marginBottom: "20px" }}
                    onClick={() => {
                      setForm((prevState) => ({
                        ...prevState,
                        education: [
                          ...prevState.education,
                          {
                            id: uuidv4(),
                            institution: "",
                            degree: "",
                            startDate: "",
                            endDate: "",
                            score: "",
                            description: "",
                          },
                        ],
                      }));
                    }}
                  >
                    <FaPlus /> Add Another Education
                  </button>
                  <button className="btn-success-custom" onClick={handleSaveEducation} disabled={saveLoading}>
                    {saveLoading ? <Spinner animation="border" size="sm" /> : <><FaSave /> Save Education</>}
                  </button>
                  <button onClick={handleNext} className="btn-next-custom">
                    Next <FaArrowRight />
                  </button>
                </Tab>

                {/* Additional Tab */}
                <Tab eventKey="longer-tab" title="Projects & Bio">
                  <div>
                    <label className="form-label">
                      Bio (Maximum 500 characters)
                    </label>
                    <textarea
                      name="bio"
                      className="form-input"
                      value={form.bio}
                      onChange={handleInputChange}
                      placeholder="Tell us about yourself, your interests, and what you're passionate about..."
                      rows="5"
                    ></textarea>
                    <div style={{ textAlign: "right", color: colors.text, fontSize: "0.9rem", marginTop: "-15px", marginBottom: "20px" }}>
                      {form.bio.length}/500 characters
                    </div>
                  </div>

                  <label className="form-label">
                    <FaLaptopCode style={{ color: colors.primary }} />
                    Projects
                  </label>
                  {form?.projects?.map((project, index) => (
                    <div className="education-card" key={project?._id || index}>
                      <button
                        className="remove-btn"
                        onClick={() => {
                          setForm((prevState) => ({
                            ...prevState,
                            projects: prevState.projects.filter((item) => item?._id !== project?._id),
                          }));
                        }}
                      >
                        <FaTimes />
                      </button>
                      <label className="form-label">Project Title</label>
                      <input
                        type="text"
                        name="title"
                        className="form-input"
                        value={project.title}
                        onChange={(e) => handleAdditionalChange(e, index)}
                        placeholder="Your project name"
                      />
                      <label className="form-label">Tech Stack</label>
                      <Form.Select
                        className="form-select-custom"
                        value={techStack[index]}
                        onChange={(e) => {
                          setTechStack((prevState) => prevState.map((item, i) => (i === index ? e.target.value : item)));
                        }}
                      >
                        <option>Select technologies used</option>
                        {skills.map((skill, i) => (
                          <option key={i} value={skill}>
                            {skill}
                          </option>
                        ))}
                      </Form.Select>
                      {project?.techStack?.length > 0 && (
                        <div>
                          {project.techStack.map((skill, i) => (
                            <span
                              key={i}
                              className="skill-badge"
                              onClick={() => {
                                setForm((prevState) => ({
                                  ...prevState,
                                  projects: prevState.projects.map((item, idx) =>
                                    idx === index
                                      ? { ...item, techStack: item.techStack.filter((s) => s !== skill) }
                                      : item
                                  ),
                                }));
                              }}
                            >
                              {skill} <FaTimes />
                            </span>
                          ))}
                        </div>
                      )}
                      <button
                        className="btn-primary-custom"
                        onClick={() => {
                          if (techStack[index] === "Select technologies used") {
                            toast.error("Select a technology first");
                            return;
                          }
                          if (form.projects[index].techStack.includes(techStack[index])) {
                            toast.error("Technology already added");
                            return;
                          }
                          setForm((prevState) => ({
                            ...prevState,
                            projects: prevState.projects.map((item, i) =>
                              i === index ? { ...item, techStack: [...item.techStack, techStack[index]] } : item
                            ),
                          }));
                        }}
                      >
                        <FaPlus /> Add Tech
                      </button>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px", marginTop: "15px" }}>
                        <div>
                          <label className="form-label">Start Date</label>
                          <input
                            type="date"
                            name="startDate"
                            className="form-input"
                            value={project.startDate ? new Date(project.startDate).toISOString().split("T")[0] : ""}
                            onChange={(e) => handleAdditionalChange(e, index)}
                          />
                        </div>
                        <div>
                          <label className="form-label">End Date</label>
                          <input
                            type="date"
                            name="endDate"
                            className="form-input"
                            value={project.endDate ? new Date(project.endDate).toISOString().split("T")[0] : ""}
                            onChange={(e) => handleAdditionalChange(e, index)}
                          />
                        </div>
                      </div>
                      <label className="form-label">Project Link</label>
                      <input
                        type="text"
                        name="projectLink"
                        className="form-input"
                        value={project.projectLink}
                        onChange={(e) => handleAdditionalChange(e, index)}
                        placeholder="https://github.com/yourproject"
                      />
                      <label className="form-label">Description</label>
                      <textarea
                        name="description"
                        className="form-input"
                        value={project.description}
                        onChange={(e) => handleAdditionalChange(e, index)}
                        placeholder="Describe what the project does and your role..."
                        rows="3"
                      ></textarea>
                    </div>
                  ))}
                  <button
                    className="btn-primary-custom"
                    style={{ width: "100%", justifyContent: "center", marginBottom: "20px" }}
                    onClick={() => {
                      setTechStack((prevState) => [...prevState, "Select technologies used"]);
                      setForm((prevState) => ({
                        ...prevState,
                        projects: [
                          ...prevState.projects,
                          {
                            id: uuidv4(),
                            title: "",
                            techStack: [],
                            startDate: "",
                            endDate: "",
                            projectLink: "",
                            description: "",
                          },
                        ],
                      }));
                    }}
                  >
                    <FaPlus /> Add Another Project
                  </button>
                  <button className="btn-success-custom" onClick={handleSaveAdditional} disabled={saveLoading}>
                    {saveLoading ? <Spinner animation="border" size="sm" /> : <><FaSave /> Save All Changes</>}
                  </button>
                </Tab>
              </Tabs>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default EditProfile;
