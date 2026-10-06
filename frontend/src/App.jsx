import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import AppLayout from "./components/AppLayout";
import JobsPageWrapper from "./components/JobsPageWrapper";
import JobDetailsPageWrapper from "./components/JobDetailsPageWrapper";
import MyApplications from "./pages/MyApplications";
import Login from "./pages/Login";
import RecruiterDashboard from "./pages/RecruiterDashboard";
import RecruiterOverview from "./pages/RecruiterOverview";
import MyJobs from "./pages/MyJobs";
import EditJob from "./pages/EditJob";
import RecruiterApplications from "./pages/RecruiterApplications";
import ProtectedRoute from "./components/ProtectedRoute";
import Register from "./pages/Register";
import CandidateDashboard from "./pages/CandidateDashboard";
import SavedJobs from "./pages/SavedJobs";
import Profile from "./pages/Profile";
import Landing from "./pages/Landing";
import Candidates from "./pages/Candidates";
import CandidateDetail from "./pages/CandidateDetail";

function App() {
    return (
        <BrowserRouter>
            <Routes>

                <Route
                    path="/"
                    element={
                        <>
                            <Navbar />
                            <Landing />
                        </>
                    }
                />

                <Route
                    path="/jobs"
                    element={
                        <JobsPageWrapper />
                    }
                />

                <Route
                    path="/jobs/:id"
                    element={
                        <JobDetailsPageWrapper />
                    }
                />

                <Route
                    path="/login"
                    element={
                        <>
                            <Navbar />
                            <Login />
                        </>
                    }
                />

                <Route
                    path="/register"
                    element={
                        <>
                            <Navbar />
                            <Register />
                        </>
                    }
                />

                <Route
                    path="/profile"
                    element={
                        <ProtectedRoute>
                            <AppLayout>
                                <Profile />
                            </AppLayout>
                        </ProtectedRoute>
                    }
                />

                {/* ---- Sidebar-shell pages (candidate) ---- */}
                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute role="CANDIDATE">
                            <AppLayout>
                                <CandidateDashboard />
                            </AppLayout>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/saved-jobs"
                    element={
                        <ProtectedRoute role="CANDIDATE">
                            <AppLayout>
                                <SavedJobs />
                            </AppLayout>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/applications"
                    element={
                        <ProtectedRoute role="CANDIDATE">
                            <AppLayout>
                                <MyApplications />
                            </AppLayout>
                        </ProtectedRoute>
                    }
                />

                {/* ---- Sidebar-shell pages (recruiter) ---- */}
                <Route
                    path="/recruiter/overview"
                    element={
                        <ProtectedRoute role="RECRUITER">
                            <AppLayout>
                                <RecruiterOverview />
                            </AppLayout>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/recruiter"
                    element={
                        <ProtectedRoute role="RECRUITER">
                            <AppLayout>
                                <RecruiterDashboard />
                            </AppLayout>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/my-jobs"
                    element={
                        <ProtectedRoute role="RECRUITER">
                            <AppLayout>
                                <MyJobs />
                            </AppLayout>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/edit-job/:id"
                    element={
                        <ProtectedRoute role="RECRUITER">
                            <AppLayout>
                                <EditJob />
                            </AppLayout>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/recruiter/applications"
                    element={
                        <ProtectedRoute role="RECRUITER">
                            <AppLayout>
                                <RecruiterApplications />
                            </AppLayout>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/recruiter/candidates"
                    element={
                        <ProtectedRoute role="RECRUITER">
                            <AppLayout>
                                <Candidates />
                            </AppLayout>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/recruiter/candidates/:candidateId"
                    element={
                        <ProtectedRoute role="RECRUITER">
                            <AppLayout>
                                <CandidateDetail />
                            </AppLayout>
                        </ProtectedRoute>
                    }
                />

            </Routes>
        </BrowserRouter>
    );
}

export default App;