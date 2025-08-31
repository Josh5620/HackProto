import React, { useState } from "react";
import "./MatchingPage.css";
import UserCard from "./UserCard";

const MatchingPage = ({ onNavigate }) => {
  // Current user data
  const [currentUser] = useState({
    id: 0,
    name: "Alex Johnson",
    age: 18,
    school: "Riverside High School",
    subject: "Mathematics",
    bio: "Looking for a study partner to help with calculus and algebra!",
  });

  // Pull from supabase to get other users
  const [otherUsers] = useState([
    {
      id: 1,
      name: "Sarah Chen",
      age: 17,
      school: "Oakwood Academy",
      subject: "Mathematics",
      bio: "Love solving complex problems! Great with geometry and statistics.",
    },
    {
      id: 2,
      name: "Marcus Williams",
      age: 18,
      school: "Riverside High School",
      subject: "Science",
      bio: "Physics enthusiast who also enjoys math. Happy to help with both!",
    },
    {
      id: 3,
      name: "Emma Davis",
      age: 17,
      school: "Central High",
      subject: "English",
      bio: "Strong in writing and literature. Looking for cross-subject collaboration.",
    },
    {
      id: 4,
      name: "James Rodriguez",
      age: 19,
      school: "Riverside High School",
      subject: "Mathematics",
      bio: "Calculus tutor with 2 years experience. Patient and friendly!",
    },
  ]);

  const [matchedUser, setMatchedUser] = useState(null);

  // Connect to gemini api to find best match later
  const findBestMatch = () => {
    let bestMatch = null;
    let highestScore = 0;

    otherUsers.forEach((user) => {
      let score = 0;

      // Same subject gets highest priority
      if (user.subject === currentUser.subject) {
        score += 40;
      }

      // Same school gets bonus points
      if (user.school === currentUser.school) {
        score += 30;
      }

      // Similar age gets bonus points
      const ageDiff = Math.abs(user.age - currentUser.age);
      if (ageDiff <= 1) {
        score += 20;
      } else if (ageDiff <= 2) {
        score += 10;
      }

      // Random factor for variety
      score += Math.random() * 10;

      if (score > highestScore) {
        highestScore = score;
        bestMatch = { user, score: Math.round(score) };
      }
    });

    setMatchedUser(bestMatch);
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
          <UserCard user={currentUser} />

          <button className="auto-match-btn" onClick={findBestMatch}>
            Find My Best Match
          </button>

          {matchedUser && (
            <div className="match-result">
              <h4>🎉 Your Best Match!</h4>
              <p>
                <strong>Match Score:</strong> {matchedUser.score}%
              </p>
              <UserCard 
                user={matchedUser.user} 
                isMatched={true} 
                showConnectButton={true} 
              />
            </div>
          )}
        </div>

        {/* Other Users Section */}
        <div className="other-users-section">
          <h3>Available Study Partners</h3>
          <div className="users-list">
            {otherUsers.map((user) => (
              <UserCard key={user.id} user={user} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MatchingPage;
