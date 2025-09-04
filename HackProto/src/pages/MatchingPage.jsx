import React, { useEffect, useState, useCallback } from "react";
import "./MatchingPage.css";
import UserCard from "./UserCard";
import { getUsers, Student} from "../services/BackStuff";

const MatchingPage = ({ onNavigate, currentUser }) => {
  // Use the passed currentUser or create a default one if none exists
  const [user] = useState(
    currentUser || new Student(0, "Alex Johnson", ["Mathematics"], ["Saturday", "Sunday"], "English", "Riverside High School", "Looking for a study partner to help with calculus and algebra!")
  );

  const [otherUsers, setOtherUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [matchResults, setMatchResults] = useState(null);
  const [showMatches, setShowMatches] = useState(false);
  

  useEffect(() => { 
    console.log("Reload");
    if (user && user.id) {
      fetchUsers();
    }
  }, [user, fetchUsers]);

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      const users = await getUsers();
      const fetchedUsers = users
        .filter(userData => userData.id !== user.id) // Filter out current user
        .map(userData => new Student(userData.id, userData.full_name, userData.subjects, userData.availability, userData.preferred_lang, userData.school, userData.special, userData.created_by));
      console.log("Fetched users (excluding current user):", fetchedUsers);
      setOtherUsers(fetchedUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user.id]);

  // Connect to gemini api to find best match later
  const findBestMatch = async () => {
    console.log("Finding best match for:", user);
    setIsLoading(true);
    
    try {
      const matches = await user.getMatch(otherUsers);
      console.log(matches);
      
      // Store the match results
      setMatchResults(matches);
      setShowMatches(true);
    } catch (error) {
      console.error('Error finding matches:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Navigate to matched users page with the results
  const viewDetailedMatches = () => {
    onNavigate("matched-users", {
      currentUser: user,
      matchResults: matchResults
    });
  };




  return (
    <div className="matching-page">
      <nav className="navbar">
        <h2>Study Buddy</h2>
        <button onClick={() => onNavigate("home")} className="nav-button">
          Back to Home
        </button>
      </nav>

      <div className="matching-layout">
        {/* Current User Section */}
        <div className="current-user-section">
          <h3>Your Profile</h3>
          <UserCard user={user} />

          <button className="auto-match-btn" onClick={findBestMatch} disabled={isLoading}>
            {isLoading ? 'Finding Matches...' : 'Find Buddy'}
          </button>

          <button className="auto-match-btn" onClick={fetchUsers} disabled={isLoading}>
            {isLoading ? 'Loading...' : 'Refresh Study Partners'}
          </button>

          {/* Show matches summary when available */}
          {showMatches && matchResults && matchResults.length > 0 && (
            <div className="matches-preview">
              <h4>🎉 Found {matchResults.length} Great Matches!</h4>
              <div className="matches-summary">
                {matchResults.map((match, index) => (
                  <div key={match.id} className="match-summary-item">
                    <span className="match-rank">#{index + 1}</span>
                    <span className="match-name">{match.name}</span>
                    <span className="match-score">{match.score}%</span>
                  </div>
                ))}
              </div>
              <button className="view-matches-btn" onClick={viewDetailedMatches}>
                View Detailed Matches
              </button>
            </div>
          )}

          {showMatches && (!matchResults || matchResults.length === 0) && (
            <div className="no-matches-preview">
              <h4>No matches found</h4>
              <p>Try refreshing the study partners or adjusting your preferences.</p>
            </div>
          )}
        </div>

        {/* Other Users Section */}
        <div className="other-users-section">
          <h3>Available Study Partners</h3>
          <div className="users-list">
            {otherUsers.length === 0 ? (
              <div className="no-users-message">
                No study partners loaded yet. Click "Refresh Study Partners" to see available users.
              </div>
            ) : (
              otherUsers.map((user) => (
                <UserCard key={user.id} user={user} />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MatchingPage;
