import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { sendOtp, verifyOtp, registerUser } from "../services/authService";
import { FiEye, FiEyeOff } from "react-icons/fi";

// Step 1: Registration form
// Step 2: OTP entry
// Step 3: Success (redirects)

function Register() {
    const navigate = useNavigate();

    const [step, setStep] = useState(1);

    // Form fields
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [role, setRole] = useState("CANDIDATE");

    // OTP
    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const otpRefs = useRef([]);

    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    // ── Step 1: Send OTP ──────────────────────────────────────
    const handleSendOtp = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            await sendOtp(email);
            setStep(2);
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Failed to send OTP. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    // ── OTP input handling ────────────────────────────────────
    const handleOtpChange = (index, value) => {
        if (!/^\d*$/.test(value)) return; // digits only

        const updated = [...otp];
        updated[index] = value.slice(-1); // one digit per box
        setOtp(updated);

        if (value && index < 5) {
            otpRefs.current[index + 1]?.focus();
        }
    };

    const handleOtpKeyDown = (index, e) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            otpRefs.current[index - 1]?.focus();
        }
    };

    const handleOtpPaste = (e) => {
        e.preventDefault();
        const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
        if (!pasted) return;

        const updated = [...otp];
        pasted.split("").forEach((char, i) => {
            updated[i] = char;
        });
        setOtp(updated);
        otpRefs.current[Math.min(pasted.length, 5)]?.focus();
    };

    // ── Step 2: Verify OTP then register ─────────────────────
    const handleVerifyAndRegister = async (e) => {
        e.preventDefault();
        setError("");

        const otpValue = otp.join("");
        if (otpValue.length < 6) {
            setError("Please enter the complete 6-digit OTP.");
            return;
        }

        setLoading(true);

        try {
            // Verify OTP first
            await verifyOtp(email, otpValue);

            // Then register with OTP included
            await registerUser({ name, email, password, role, otp: otpValue });

            setMessage("Account created! Redirecting to login...");
            setStep(3);

            setTimeout(() => navigate("/login"), 1500);

        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Verification failed. Please check your OTP."
            );
        } finally {
            setLoading(false);
        }
    };

    const handleResendOtp = async () => {
        setError("");
        setOtp(["", "", "", "", "", ""]);
        setLoading(true);

        try {
            await sendOtp(email);
            setMessage("A new OTP has been sent to your email.");
            setTimeout(() => setMessage(""), 3000);
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Failed to resend OTP."
            );
        } finally {
            setLoading(false);
        }
    };

    // ── Render ────────────────────────────────────────────────
    return (
        <div className="auth-page">
            <div className="auth-card">

                {/* ── Step 1: Registration Form ── */}
                {step === 1 && (
                    <>
                        <div className="auth-header">
                            <h1>Create Account</h1>
                            <p>Join HireRight and find your next opportunity</p>
                        </div>

                        <form onSubmit={handleSendOtp}>

                            <div className="auth-form-group">
                                <label>Name</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Enter your name"
                                    required
                                />
                            </div>

                            <div className="auth-form-group">
                                <label>Email</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter your email"
                                    required
                                />
                            </div>

                            <div className="auth-form-group">
                                <label>Password</label>
                                <div className="password-input-wrapper">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Create a password"
                                        required
                                    />
                                    <button
                                        type="button"
                                        className="password-toggle"
                                        onClick={() => setShowPassword((c) => !c)}
                                        aria-label={showPassword ? "Hide password" : "Show password"}
                                    >
                                        {showPassword ? <FiEyeOff /> : <FiEye />}
                                    </button>
                                </div>
                            </div>

                            <div className="auth-form-group">
                                <label>Account Type</label>
                                <select
                                    value={role}
                                    onChange={(e) => setRole(e.target.value)}
                                >
                                    <option value="CANDIDATE">Candidate</option>
                                    <option value="RECRUITER">Recruiter</option>
                                </select>
                            </div>

                            <button
                                type="submit"
                                className="auth-submit-btn"
                                disabled={loading}
                            >
                                {loading ? "Sending OTP..." : "Send Verification Code"}
                            </button>

                        </form>

                        {error && <p className="auth-error">{error}</p>}

                        <p className="auth-switch">
                            Already have an account?{" "}
                            <button type="button" onClick={() => navigate("/login")}>
                                Login
                            </button>
                        </p>
                    </>
                )}

                {/* ── Step 2: OTP Verification ── */}
                {step === 2 && (
                    <>
                        <div className="auth-header">
                            <h1>Verify Email</h1>
                            <p>
                                We sent a 6-digit code to{" "}
                                <strong>{email}</strong>
                            </p>
                        </div>

                        <form onSubmit={handleVerifyAndRegister}>

                            <div className="otp-group">
                                {otp.map((digit, index) => (
                                    <input
                                        key={index}
                                        ref={(el) => (otpRefs.current[index] = el)}
                                        className="otp-input"
                                        type="text"
                                        inputMode="numeric"
                                        maxLength={1}
                                        value={digit}
                                        onChange={(e) => handleOtpChange(index, e.target.value)}
                                        onKeyDown={(e) => handleOtpKeyDown(index, e)}
                                        onPaste={index === 0 ? handleOtpPaste : undefined}
                                        autoFocus={index === 0}
                                    />
                                ))}
                            </div>

                            <button
                                type="submit"
                                className="auth-submit-btn"
                                disabled={loading}
                            >
                                {loading ? "Verifying..." : "Verify & Create Account"}
                            </button>

                        </form>

                        {error && <p className="auth-error">{error}</p>}
                        {message && <p className="success-message">{message}</p>}

                        <div className="otp-footer">
                            <p>
                                Didn't receive the code?{" "}
                                <button
                                    type="button"
                                    className="otp-resend-btn"
                                    onClick={handleResendOtp}
                                    disabled={loading}
                                >
                                    Resend OTP
                                </button>
                            </p>
                            <p>
                                <button
                                    type="button"
                                    className="otp-resend-btn"
                                    onClick={() => { setStep(1); setError(""); setOtp(["","","","","",""]); }}
                                >
                                    ← Change email
                                </button>
                            </p>
                        </div>
                    </>
                )}

                {/* ── Step 3: Success ── */}
                {step === 3 && (
                    <div className="auth-header" style={{ textAlign: "center", padding: "1rem 0" }}>
                        <h1>All set!</h1>
                        <p className="success-message" style={{ marginTop: "1rem" }}>
                            {message}
                        </p>
                    </div>
                )}

            </div>
        </div>
    );
}

export default Register;
