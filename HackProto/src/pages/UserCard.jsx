import React from 'react';

const UserCard = ({ user, isMatched = false, showConnectButton = false }) => {
  return (
    <div className={`user-card ${isMatched ? 'matched-user-card' : ''}`}>
      <div className="user-info">
        <h4>{user.name}</h4>
        <p><strong>Age:</strong> {user.age}</p>
        <p><strong>School:</strong> {user.school}</p>
        <p><strong>Subject:</strong> {user.subject}</p>
        <p className="bio">{user.bio}</p>
      </div>
      {showConnectButton && (
        <button className="connect-btn">Connect Now</button>
      )}
    </div>
  );
};

export default UserCard;
