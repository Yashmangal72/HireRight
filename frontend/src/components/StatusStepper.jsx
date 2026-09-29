import { FiCheck, FiX } from "react-icons/fi";

const STEPS = ["APPLIED", "SHORTLISTED", "INTERVIEW", "HIRED"];

function StatusStepper({ status }) {
    if (status === "REJECTED") {
        return (
            <div className="status-stepper status-stepper-rejected">
                <div className="stepper-node rejected">
                    <FiX size={14} />
                </div>
                <span className="stepper-rejected-label">
                    Application Rejected
                </span>
            </div>
        );
    }

    const currentIndex = STEPS.indexOf(status);

    return (
        <div className="status-stepper">
            {STEPS.map((step, index) => {
                const isComplete = index < currentIndex;
                const isCurrent = index === currentIndex;

                return (
                    <div className="stepper-step" key={step}>
                        <div className="stepper-node-wrapper">
                            <div
                                className={
                                    "stepper-node" +
                                    (isComplete ? " complete" : "") +
                                    (isCurrent ? " current" : "")
                                }
                            >
                                {isComplete ? <FiCheck size={12} /> : null}
                            </div>
                            <span className="stepper-label">
                                {step.charAt(0) + step.slice(1).toLowerCase()}
                            </span>
                        </div>

                        {index < STEPS.length - 1 && (
                            <div
                                className={
                                    "stepper-line" +
                                    (index < currentIndex ? " complete" : "")
                                }
                            />
                        )}
                    </div>
                );
            })}
        </div>
    );
}

export default StatusStepper;