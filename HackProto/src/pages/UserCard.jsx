import React from 'react';
import { Student } from '../services/BackStuff';
const UserCard = ({ user, isMatched = false, showConnectButton = false }) => {
  // Handle both old format (currentUser) and Student class format
  const name = user.full_name || user.name;
  const age = user.age;
  const school = user.school;
  const subject = user.subjects || user.subject;
  const bio = user.special || user.bio;
  const availability = user.availability;
  const preferredLang = user.preferred_lang;

  // Universal formatting function for comma-separated values
  const formatCommaSeparated = (inputString) => {
    if (!inputString) return '';
    
    const str = String(inputString);
    
    // Already properly formatted with commas and spaces
    if (str.includes(', ')) return str;

    return str.replace(/,(?!\s)/g, ', ')
  };

  const formattedSubject = formatCommaSeparated(subject);
  const formattedLanguage = formatCommaSeparated(preferredLang);
  const formattedAvailability = formatCommaSeparated(availability);

  return (
    <div className={`user-card ${isMatched ? 'matched-user-card' : ''}`}>
      <div className="user-avatar">
        👤
      </div>
      
      <div className="user-info">
        <h4 className="user-name">{name}</h4>
        
        <div className="user-details-grid">
          {age && (
            <div className="detail-item">
              <span className="detail-icon">🎂</span>
              <span className="detail-label">Age:</span>
              <span className="detail-value">{age}</span>
            </div>
          )}
          
          <div className="detail-item">
            <span className="detail-icon">🏫</span>
            <span className="detail-label">School:</span>
            <span className="detail-value">{school}</span>
          </div>
          
          <div className="detail-item">
            <span className="detail-icon">📚</span>
            <span className="detail-label">Subject:</span>
            <span className="detail-value">{formattedSubject}</span>
          </div>
          
          {availability && (
            <div className="detail-item">
              <span className="detail-icon">⏰</span>
              <span className="detail-label">Available:</span>
              <span className="detail-value">{formattedAvailability}</span>
            </div>
          )}
          
          {preferredLang && (
            <div className="detail-item">
              <span className="detail-icon">🗣️</span>
              <span className="detail-label">Language:</span>
              <span className="detail-value">{formattedLanguage}</span>
            </div>
          )}
        </div>
        
        {bio && (
          <div className="user-bio">
            <span className="bio-icon">💭</span>
            <p className="bio-text">{bio}</p>
          </div>
        )}
      </div>
      
      {showConnectButton && (
        <div className="connect-section">
          <button className="connect-btn">Connect Now</button>
        </div>
      )}
    </div>
  );
};

export default UserCard;
