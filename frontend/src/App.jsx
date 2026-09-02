import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Jobs from "./pages/Jobs";
import JobDetails from "./pages/JobDetails";
import MyApplications from "./pages/MyApplications";
import Login from "./pages/Login";
import RecruiterDashboard from "./pages/RecruiterDashboard";
import MyJobs from "./pages/MyJobs";
import EditJob from "./pages/EditJob";
import RecruiterApplications from "./pages/RecruiterApplications";
import ProtectedRoute from "./components/ProtectedRoute";
import Register from "./pages/Register";

function App() {
    return (
        <BrowserRouter>

            <Navbar />

            <Routes>
                <Route path="/" element={<Jobs />} />

                <Route
                    path="/jobs/:id"
                    element={<JobDetails />}
                />

                <Route
                    path="/applications"
                    element={
                        <ProtectedRoute role="CANDIDATE">
                            <MyApplications />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/login"
                    element={<Login />}
                />

                <Route
                    path="/register"
                    element={<Register />}
                />

                <Route
                    path="/recruiter"
                    element={
                        <ProtectedRoute role="RECRUITER">
                            <RecruiterDashboard />
                        </ProtectedRoute>
                    }
                />

              <Route
                  path="/my-jobs"
                  element={
                      <ProtectedRoute role="RECRUITER">
                          <MyJobs />
                      </ProtectedRoute>
                  }
              />

              <Route
                  path="/edit-job/:id"
                  element={
                      <ProtectedRoute role="RECRUITER">
                          <EditJob />
                      </ProtectedRoute>
                  }
              />

              <Route
                    path="/recruiter/applications"
                    element={
                        <ProtectedRoute role="RECRUITER">
                            <RecruiterApplications />
                        </ProtectedRoute>
                    }
                />

            </Routes>

        </BrowserRouter>
    );
}

export default App;