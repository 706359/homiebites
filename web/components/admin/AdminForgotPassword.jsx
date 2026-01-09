import { useState } from "react";
import api from "../../lib/api-admin.js";
import "./styles/index.css";
import "./AdminForgotPassword.css";

const AdminForgotPassword = () => {
  const goBack = () => {
    window.location.href = "/login";
  };
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Step 1: Email
  const [email, setEmail] = useState("");

  // Step 2: OTP
  const [otp, setOtp] = useState("");

  // Step 3: Identity verification
  const [adminId, setAdminId] = useState("");
  const [panCard, setPanCard] = useState("");
  const [verificationToken, setVerificationToken] = useState("");

  // Step 4: New password
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [resetToken, setResetToken] = useState("");

  const handleStep1 = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const data = await api.forgotPassword(email);
      if (data && data.success) {
        setSuccess(data.message || "OTP sent to your registered mobile number");
        // In development, show OTP in console/alert
        if (data.otp) {
          alert(`Development Mode: Your OTP is ${data.otp}`);
        }
        setStep(2);
      } else {
        setError(data?.error || "Failed to send OTP");
      }
    } catch (err) {
      console.error("Forgot password error:", err);
      setError(err?.message || "Failed to send OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleStep2 = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const data = await api.verifyOTP(email, otp);
      if (data.success) {
        setVerificationToken(data.verificationToken);
        setSuccess("OTP verified successfully");
        setStep(3);
      } else {
        setError(data.error || "Invalid OTP");
      }
    } catch (err) {
      setError(err.message || "Failed to verify OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleStep3 = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!adminId.trim() || !panCard.trim()) {
      setError("Please enter both Admin ID and PAN card");
      return;
    }

    // Validate PAN card format (10 characters, alphanumeric)
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    if (!panRegex.test(panCard.toUpperCase())) {
      setError("Invalid PAN card format. Format: ABCDE1234F");
      return;
    }

    setLoading(true);

    try {
      const data = await api.verifyIdentity(
        email,
        verificationToken,
        panCard,
        adminId,
      );
      if (data && data.success) {
        setResetToken(data.resetToken);
        setSuccess("Identity verified successfully");
        setStep(4);
      } else {
        setError(data?.error || "Verification failed");
      }
    } catch (err) {
      console.error("Verify identity error:", err);
      setError(err?.message || "Failed to verify identity. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleStep4 = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const data = await api.resetPassword(email, resetToken, newPassword);
      if (data && data.success) {
        setSuccess("Password reset successfully! Redirecting to login...");
        setTimeout(() => {
          goBack();
        }, 2000);
      } else {
        setError(data?.error || "Failed to reset password");
      }
    } catch (err) {
      console.error("Reset password error:", err);
      setError(err?.message || "Failed to reset password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const renderStep1 = () => (
    <form onSubmit={handleStep1} className="login-form">
      <div className="form-field">
        <label>Admin Email Address</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="admin@homiebites.com"
          required
          autoFocus
        />
      </div>
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}
      <button
        type="submit"
        className="btn btn-primary btn-full"
        disabled={loading}
      >
        {loading ? "SENDING..." : "SEND OTP"}
      </button>
      <button
        type="button"
        onClick={goBack}
        className="btn btn-secondary btn-full"
      >
        Back to Login
      </button>
    </form>
  );

  const renderStep2 = () => (
    <form onSubmit={handleStep2} className="login-form">
      <div className="form-field">
        <label>Enter OTP</label>
        <input
          type="text"
          value={otp}
          onChange={(e) =>
            setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
          }
          placeholder="000000"
          maxLength={6}
          required
          autoFocus
        />
        <p className="admin-forgot-help-text">
          Enter the 6-digit OTP sent to your registered mobile number
        </p>
      </div>
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}
      <button
        type="submit"
        className="btn btn-primary btn-full"
        disabled={loading}
      >
        {loading ? "VERIFYING..." : "VERIFY OTP"}
      </button>
      <button
        type="button"
        onClick={() => {
          setStep(1);
          setOtp("");
          setError("");
          setSuccess("");
        }}
        className="btn btn-secondary btn-full"
      >
        Back
      </button>
    </form>
  );

  const renderStep3 = () => (
    <form onSubmit={handleStep3} className="login-form">
      <div className="form-field">
        <label>Admin ID</label>
        <input
          type="text"
          value={adminId}
          onChange={(e) => setAdminId(e.target.value)}
          placeholder="Enter your Admin ID"
          required
          autoFocus
        />
        <p className="admin-forgot-help-text">
          Enter the Admin ID associated with your account
        </p>
      </div>
      <div className="form-field">
        <label>PAN Card Number</label>
        <input
          type="text"
          value={panCard}
          onChange={(e) =>
            setPanCard(
              e.target.value
                .toUpperCase()
                .replace(/[^A-Z0-9]/g, "")
                .slice(0, 10),
            )
          }
          placeholder="ABCDE1234F"
          maxLength={10}
          required
        />
        <p className="admin-forgot-help-text">
          Format: ABCDE1234F (10 characters, alphanumeric)
        </p>
      </div>
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}
      <button
        type="submit"
        className="btn btn-primary btn-full"
        disabled={loading}
      >
        {loading ? "VERIFYING..." : "VERIFY IDENTITY"}
      </button>
      <button
        type="button"
        onClick={() => {
          setStep(2);
          setAdminId("");
          setPanCard("");
          setError("");
          setSuccess("");
        }}
        className="btn btn-secondary btn-full"
      >
        Back
      </button>
    </form>
  );

  const renderStep4 = () => (
    <form onSubmit={handleStep4} className="login-form">
      <div className="form-field">
        <label>New Password</label>
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="Enter new password"
          minLength={6}
          required
          autoFocus
        />
        <p className="admin-forgot-help-text">Minimum 6 characters</p>
      </div>
      <div className="form-field">
        <label>Confirm New Password</label>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirm new password"
          minLength={6}
          required
        />
      </div>
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}
      <button
        type="submit"
        className="btn btn-primary btn-full"
        disabled={loading}
      >
        {loading ? "RESETTING..." : "RESET PASSWORD"}
      </button>
      <button
        type="button"
        onClick={() => {
          setStep(3);
          setNewPassword("");
          setConfirmPassword("");
          setError("");
          setSuccess("");
        }}
        className="btn btn-secondary btn-full"
      >
        Back
      </button>
    </form>
  );

  const getStepTitle = () => {
    switch (step) {
      case 1:
        return "Step 1: Enter Email";
      case 2:
        return "Step 2: Verify OTP";
      case 3:
        return "Step 3: Verify Identity";
      case 4:
        return "Step 4: Reset Password";
      default:
        return "Password Recovery";
    }
  };

  return (
    <div className="admin-page-wrapper login-page-wrapper admin-forgot-password">
      <div className="login-page-container">
        <div className="login-left-section">
          <img
            src="https://images.pexels.com/photos/2474661/pexels-photo-2474661.jpeg"
            alt="Admin password recovery"
            className="login-image"
          />
        </div>

        <div className="login-right-section">
          <div className="login-content">
            <h1 className="login-title">Admin Password Recovery</h1>
            <p className="admin-forgot-step-title">{getStepTitle()}</p>

            {step === 1 && renderStep1()}
            {step === 2 && renderStep2()}
            {step === 3 && renderStep3()}
            {step === 4 && renderStep4()}

            <div className="login-info">
              <p className="admin-forgot-security-note">
                <strong>Security Note:</strong> This process requires multi-step
                verification to ensure account security.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminForgotPassword;
