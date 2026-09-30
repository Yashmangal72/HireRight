import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getMyProfile, updateMyProfile } from "../services/profileService";

function Profile() {
    const { role } = useAuth();

    const [profile, setProfile] = useState(null);
    const [form, setForm] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const data = await getMyProfile();
                setProfile(data);
                setForm(data);
            } catch (error) {
                console.error(error);
                setError("Failed to load profile");
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setForm((current) => ({
            ...current,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setMessage("");
        setError("");
        setSaving(true);

        try {
            const updated = await updateMyProfile({
                name: form.name,
                phone: form.phone,
                bio: form.bio,
                location: form.location,
                skills: form.skills,
                companyName: form.companyName,
                companyWebsite: form.companyWebsite,
            });

            setProfile(updated);
            setForm(updated);
            setMessage("Profile updated successfully!");

            setTimeout(() => setMessage(""), 3000);
        } catch (error) {
            console.error(error);
            setError(
                error.response?.data?.message || "Failed to update profile"
            );
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="page-center">
                <h2>Loading profile...</h2>
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="page-center">
                <h2>{error || "Profile not found"}</h2>
            </div>
        );
    }

    return (
        <div className="profile-page">

            <div className="page-heading">
                <h1>Profile</h1>
                <p>Manage your account details</p>
            </div>

            <div className="profile-card">

                <div className="profile-identity">
                    <div className="profile-avatar">
                        {profile.name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <h2>{profile.name}</h2>
                        <p>{profile.email}</p>
                        <span className="profile-role-tag">
                            {profile.role}
                        </span>
                    </div>
                </div>

                <form onSubmit={handleSubmit}>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Name</label>
                            <input
                                name="name"
                                value={form.name || ""}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Phone</label>
                            <input
                                name="phone"
                                value={form.phone || ""}
                                onChange={handleChange}
                                placeholder="e.g. 9876543210"
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Location</label>
                        <input
                            name="location"
                            value={form.location || ""}
                            onChange={handleChange}
                            placeholder="e.g. Mumbai"
                        />
                    </div>

                    <div className="form-group">
                        <label>Bio</label>
                        <textarea
                            name="bio"
                            value={form.bio || ""}
                            onChange={handleChange}
                            rows="4"
                            placeholder="A short introduction..."
                        />
                    </div>

                    {role === "CANDIDATE" && (
                        <div className="form-group">
                            <label>Skills</label>
                            <input
                                name="skills"
                                value={form.skills || ""}
                                onChange={handleChange}
                                placeholder="e.g. Java, Spring Boot, React"
                            />
                        </div>
                    )}

                    {role === "RECRUITER" && (
                        <div className="form-row">
                            <div className="form-group">
                                <label>Company Name</label>
                                <input
                                    name="companyName"
                                    value={form.companyName || ""}
                                    onChange={handleChange}
                                    placeholder="e.g. Acme Corp"
                                />
                            </div>

                            <div className="form-group">
                                <label>Company Website</label>
                                <input
                                    name="companyWebsite"
                                    value={form.companyWebsite || ""}
                                    onChange={handleChange}
                                    placeholder="https://..."
                                />
                            </div>
                        </div>
                    )}

                    <button
                        type="submit"
                        className="create-job-btn"
                        disabled={saving}
                    >
                        {saving ? "Saving..." : "Save Changes"}
                    </button>

                </form>

                {message && <p className="success-message">{message}</p>}
                {error && <p className="error-message">{error}</p>}

            </div>

        </div>
    );
}

export default Profile;