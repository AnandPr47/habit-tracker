import { useNavigate } from "react-router-dom";
import "../styles/welcome.css";

function Welcome() {
    const navigate = useNavigate();

    return (
        <div className="welcome-container">
            <div className="welcome-card glass">
                <h1 className="brand">HabiVolt</h1>

                <p className="tagline">
                    Build discipline. Track growth. Become unstoppable.
                </p>

                <div className="btn-group">
                    <button
                        className="primary-btn"
                        onClick={() => navigate("/register")}
                    >
                        Start Building Habits
                    </button>

                    <button
                        className="secondary-btn"
                        onClick={() => navigate("/login")}
                    >
                        Already Tracking? Login
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Welcome;