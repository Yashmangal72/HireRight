import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiCheckCircle, FiZap, FiTrendingUp, FiSearch } from "react-icons/fi";

function Landing() {
    const navigate = useNavigate();
    const [keyword, setKeyword] = useState("");

    const handleSearch = (e) => {
        e.preventDefault();
        navigate(
            keyword.trim()
                ? `/jobs?keyword=${encodeURIComponent(keyword.trim())}`
                : "/jobs"
        );
    };

    return (
        <div className="landing-page">

            <section className="landing-hero">
                <div className="landing-hero-text">
                    <h1>
                        Find Your Next{" "}
                        <span className="landing-accent">Opportunity</span>
                    </h1>

                    <p>
                        Connect with top companies and build your career with
                        opportunities that match your skills.
                    </p>

                    <form className="landing-search" onSubmit={handleSearch}>
                        <FiSearch size={18} className="landing-search-icon" />
                        <input
                            type="text"
                            placeholder="Search jobs, skills or companies..."
                            value={keyword}
                            onChange={(e) => setKeyword(e.target.value)}
                        />
                        <button type="submit">Search</button>
                    </form>

                    <p className="landing-popular">
                        Popular:{" "}
                        <a onClick={() => navigate("/jobs?keyword=Java")}>Java</a>,{" "}
                        <a onClick={() => navigate("/jobs?keyword=React")}>React</a>,{" "}
                        <a onClick={() => navigate("/jobs?keyword=Remote")}>Remote</a>
                    </p>
                </div>
            </section>

            <section className="landing-features">
                <div className="landing-feature">
                    <div className="landing-feature-icon">
                        <FiCheckCircle size={22} />
                    </div>
                    <div>
                        <h3>Verified Companies</h3>
                        <p>Trusted employers</p>
                    </div>
                </div>

                <div className="landing-feature">
                    <div className="landing-feature-icon">
                        <FiZap size={22} />
                    </div>
                    <div>
                        <h3>Easy Applications</h3>
                        <p>Apply in one click</p>
                    </div>
                </div>

                <div className="landing-feature">
                    <div className="landing-feature-icon">
                        <FiTrendingUp size={22} />
                    </div>
                    <div>
                        <h3>Track Progress</h3>
                        <p>Stay updated always</p>
                    </div>
                </div>
            </section>

        </div>
    );
}

export default Landing;