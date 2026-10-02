import { useAuth } from "../context/AuthContext";
import Navbar from "./Navbar";
import AppLayout from "./AppLayout";
import JobDetails from "../pages/JobDetails";

function JobDetailsPageWrapper() {
    const { isAuthenticated } = useAuth();

    if (isAuthenticated) {
        return (
            <AppLayout>
                <JobDetails />
            </AppLayout>
        );
    }

    return (
        <>
            <Navbar />
            <JobDetails />
        </>
    );
}

export default JobDetailsPageWrapper;