import { useAuth } from "../context/AuthContext";
import Navbar from "./Navbar";
import AppLayout from "./AppLayout";
import Jobs from "../pages/Jobs";

function JobsPageWrapper() {
    const { isAuthenticated } = useAuth();

    if (isAuthenticated) {
        return (
            <AppLayout>
                <Jobs />
            </AppLayout>
        );
    }

    return (
        <>
            <Navbar />
            <Jobs />
        </>
    );
}

export default JobsPageWrapper;