import { useState } from 'react';
import studyBuddyLogo from '../assets/studybuddy.png';
import './HomePage.css';
import { getUsers } from '../services/HomePage';

const HomePage = ({ onNavigate }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    age: '',
    subject: '',
    school: '',
    specialRequests: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Configurable corner button function
  const handleCornerButtonClick = () => {
    getUsers();
    console.log('Corner button action triggered');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Send to Supabase later
    console.log('Form submitted:', formData);
    alert('Account created! (Will integrate with Supabase later)');
  };

  return (
    <div className="home-page">
      {/* Configurable Corner Button */}
      <button 
        className="corner-button" 
        onClick={handleCornerButtonClick}
        title="Click to configure action"
      >
        ⚙️
      </button>
      
      <div className="home-container">
        {/* Header Section */}
        <header className="home-header">
          <h1 className="home-title">
            <img src={studyBuddyLogo} alt="StudyBuddy" className="logo-inline" />
            StudyBuddy
          </h1>
          <p className="home-subtitle">Find your perfect study partner and excel together</p>
        </header>

        {/* Main Content */}
        <main className="main-content">
          <div className="signup-section">
          <form className="signup-form" onSubmit={handleSubmit}>
            <h2 className="form-title">Join the Community</h2>
            
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter your full name"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="age">Age</label>
              <input
                type="number"
                id="age"
                name="age"
                value={formData.age}
                onChange={handleInputChange}
                placeholder="Your age"
                min="18"
                max="100"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="subject">Subject</label>
              <select
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                required
              >
                <option value="">Select a subject</option>
                <option value="mathematics">Mathematics</option>
                <option value="science">Science</option>
                <option value="english">English</option>
                <option value="history">History</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="school">School</label>
              <select
                id="school"
                name="school"
                value={formData.school}
                onChange={handleInputChange}
                required
              >
                <option value="">Select your school</option>
                <option value="greenwood-high">Greenwood High School</option>
                <option value="riverside-academy">Riverside Academy</option>
                <option value="summit-prep">Summit Preparatory School</option>
                <option value="maple-valley">Maple Valley Institute</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="specialRequests">Special Requests</label>
              <textarea
                id="specialRequests"
                name="specialRequests"
                value={formData.specialRequests}
                onChange={handleInputChange}
                placeholder="Any special learning needs, preferred study times, or specific topics you'd like help with..."
                rows="4"
              />
            </div>

            <button type="submit" className="submit-btn">
              Join Study Buddy
            </button>
          </form>

          <div className="navigation-section">
            <p>Ready to find your study partner?</p>
            <button 
              className="nav-btn"
              onClick={() => onNavigate('matching')}
            >
              Find Study Partners →
            </button>
          </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default HomePage;
