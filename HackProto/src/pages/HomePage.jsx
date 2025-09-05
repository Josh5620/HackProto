import { useState } from 'react';
import studyBuddyLogo from '../assets/studybuddy.png';
import './HomePage.css';
import { getUsers, signUp, Student } from '../services/BackStuff';

const HomePage = ({ onNavigate }) => {
  const [formData, setFormData] = useState({
    full_name: '',
    subjects: [],
    availability: [],
    preferred_lang: [],
    school: '',
    special: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        [name]: checked 
          ? [...prev[name], value]
          : prev[name].filter(item => item !== value)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  // Configurable corner button function
  const handleCornerButtonClick = () => {
    getUsers();
    console.log('Corner button action triggered');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Create new student object for signup
      const newStudent = {
        full_name: formData.full_name,
        subjects: formData.subjects,
        availability: formData.availability,
        preferred_lang: formData.preferred_lang,
        school: formData.school,
        special: formData.special
      };

      // Sign up the user in Supabase
      const result = await signUp(newStudent);
      
      if (result.ok) {
        alert('Account created successfully! Let\'s find your study partner.');
        onNavigate('matching');
      } else {
        alert('Failed to create account: ' + result.error.message);
      }
    } catch (error) {
      console.error('Error creating account:', error);
      alert('An error occurred while creating your account. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
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
              <label htmlFor="full_name">Full Name</label>
              <input
                type="text"
                id="full_name"
                name="full_name"
                value={formData.full_name}
                onChange={handleInputChange}
                placeholder="Enter your full name"
                required
              />
            </div>

            <div className="form-group">
              <label>Subjects (Select all that apply)</label>
              <div className="checkbox-group">
                {['Mathematics', 'Science', 'English', 'History'].map(subject => (
                  <label key={subject} className="checkbox-label">
                    <input
                      type="checkbox"
                      name="subjects"
                      value={subject}
                      checked={formData.subjects.includes(subject)}
                      onChange={handleInputChange}
                    />
                    {subject}
                  </label>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label>Availability (Select all that apply)</label>
              <div className="checkbox-group">
                {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => (
                  <label key={day} className="checkbox-label">
                    <input
                      type="checkbox"
                      name="availability"
                      value={day}
                      checked={formData.availability.includes(day)}
                      onChange={handleInputChange}
                    />
                    {day}
                  </label>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label>Preferred Languages (Select all that apply)</label>
              <div className="checkbox-group">
                {['English', 'Chinese', 'Malay'].map(language => (
                  <label key={language} className="checkbox-label">
                    <input
                      type="checkbox"
                      name="preferred_lang"
                      value={language}
                      checked={formData.preferred_lang.includes(language)}
                      onChange={handleInputChange}
                    />
                    {language}
                  </label>
                ))}
              </div>
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
                <option value="Greenwood High">Greenwood High</option>
                <option value="Riverside-Academy">Riverside-Academy</option>
                <option value="Summit-Prep">Summit-Prep</option>
                <option value="Maple-Valley">Maple-Valley</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="special">Special Requirements</label>
              <textarea
                id="special"
                name="special"
                value={formData.special}
                onChange={handleInputChange}
                placeholder="Any special learning needs, preferred study times, or specific topics you'd like help with..."
                rows="4"
              />
            </div>

            <button type="submit" className="submit-btn" disabled={isSubmitting}>
              {isSubmitting ? 'Creating Account...' : 'Join Study Buddy'}
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
