import { useEffect, useState } from 'react';

/**
 * Session Timeout Warning Modal
 * Shows a warning when the session is about to expire due to inactivity
 */
const SessionTimeoutModal = ({
  show,
  timeRemaining,
  onExtendSession,
  onLogout,
}) => {
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    if (!timeRemaining) {
      setMinutes(0);
      setSeconds(0);
      return;
    }

    const totalSeconds = Math.floor(timeRemaining / 1000);
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;

    setMinutes(mins);
    setSeconds(secs);
  }, [timeRemaining]);

  if (!show) return null;

  return (
    <div className="session-timeout-overlay">
      <div className="session-timeout-modal">
        <div className="session-timeout-header">
          <div className="session-timeout-icon">
            <i className="fa-solid fa-clock"></i>
          </div>
          <h2 className="session-timeout-title">Session Timeout Warning</h2>
        </div>

        <div className="session-timeout-body">
          <p className="session-timeout-message">
            Your session will expire due to inactivity in:
          </p>
          <div className="session-timeout-timer">
            <div className="session-timeout-time">
              <span className="session-timeout-number">{String(minutes).padStart(2, '0')}</span>
              <span className="session-timeout-label">Minutes</span>
            </div>
            <span className="session-timeout-separator">:</span>
            <div className="session-timeout-time">
              <span className="session-timeout-number">{String(seconds).padStart(2, '0')}</span>
              <span className="session-timeout-label">Seconds</span>
            </div>
          </div>
          <p className="session-timeout-submessage">
            Click "Stay Logged In" to continue your session, or "Logout" to end it now.
          </p>
        </div>

        <div className="session-timeout-footer">
          <button
            type="button"
            className="btn btn-secondary session-timeout-btn"
            onClick={onLogout}
          >
            <i className="fa-solid fa-sign-out-alt"></i>
            Logout
          </button>
          <button
            type="button"
            className="btn btn-primary session-timeout-btn"
            onClick={onExtendSession}
          >
            <i className="fa-solid fa-refresh"></i>
            Stay Logged In
          </button>
        </div>
      </div>
    </div>
  );
};

export default SessionTimeoutModal;
