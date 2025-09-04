import React, { useState, useEffect, useCallback } from 'react';
import UserCard from './UserCard';
import { getUsers, Student } from '../services/BackStuff';
import './MatchedUsersPage.css';

const MatchedUsersPage = ({ onNavigate, navigationData }) => {
  const [matchedUsers, setMatchedUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Extract data from navigationData prop
  const currentUser = navigationData?.currentUser;
  const matchResults = navigationData?.matchResults;

  const fetchUsersAndMatch = useCallback(async () => {
    if (!matchResults || !Array.isArray(matchResults)) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      // Fetch all users from database
      const users = await getUsers();
      const fetchedUsers = users.map(user => new Student(
        user.id, 
        user.full_name, 
        user.subjects, 
        user.availability, 
        user.preferred_lang, 
        user.school, 
        user.special, 
        user.created_by
      ));

      // Match the IDs from Gemini response with actual user data
      const matched = matchResults.map(match => {
        const user = fetchedUsers.find(u => u.id === match.id);
        return {
          user: user,
          score: match.score,
          reason: match.reason,
          name: match.name
        };
      }).filter(match => match.user !== undefined); // Only keep matches where we found the user

      setMatchedUsers(matched);
    } catch (error) {
      console.error('Error fetching matched users:', error);
    } finally {
      setIsLoading(false);
    }
  }, [matchResults]);

  useEffect(() => {
    fetchUsersAndMatch();
  }, [fetchUsersAndMatch]);

  if (isLoading) {
    return (
      <div className="matched-users-page">
        <nav className="navbar">
          <h2>Study Buddy</h2>
          <button onClick={() => onNavigate("matching")} className="nav-button">
            Back to Matching
          </button>
        </nav>
        <div className="loading-container">
          <div className="loading-spinner">Loading your matches...</div>
        </div>
      </div>
    );
  }

  if (!matchResults || matchedUsers.length === 0) {
    return (
      <div className="matched-users-page">
        <nav className="navbar">
          <h2>Study Buddy</h2>
          <button onClick={() => onNavigate("matching")} className="nav-button">
            Back to Matching
          </button>
        </nav>
        <div className="no-matches-container">
          <h3>No matches found</h3>
          <p>We couldn't find any compatible study partners at the moment.</p>
          <button onClick={() => onNavigate("matching")} className="try-again-btn">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="matched-users-page">
      <nav className="navbar">
        <h2>Study Buddy</h2>
        <button onClick={() => onNavigate("matching")} className="nav-button">
          Back to Matching
        </button>
      </nav>

      <div className="matches-container">
        <div className="current-user-summary">
          <h3>Your Profile</h3>
          {currentUser && <UserCard user={currentUser} />}
        </div>

        <div className="matches-section">
          <h3>Your Top Study Buddy Matches</h3>
          <div className="matches-list">
            {matchedUsers.map((match, index) => (
              <div key={match.user.id} className="match-item">
                <div className="match-header">
                  <div className="match-rank">#{index + 1}</div>
                  <div className="match-score">{match.score}% Match</div>
                </div>
                
                <UserCard 
                  user={match.user} 
                  isMatched={true}
                  showConnectButton={true}
                />
                
                <div className="match-reason">
                  <div className="reason-header">
                    <span className="reason-icon">💡</span>
                    <span className="reason-label">Why this match?</span>
                  </div>
                  <p className="reason-text">{match.reason}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MatchedUsersPage;
