import React from 'react';
import { FaCheck } from 'react-icons/fa';
import styles from './ProgressSteps.module.css';

const ProgressSteps = ({ currentStep, steps = [] }) => {
    return (
        <div className={styles.progressContainer}>
            {steps.map((step, index) => {
                const stepNumber = index + 1;
                const isActive = stepNumber === currentStep;
                const isCompleted = stepNumber < currentStep;
                
                return (
                    <React.Fragment key={step}>
                        <div className={`${styles.step} ${isActive ? styles.active : ''} ${isCompleted ? styles.completed : ''}`}>
                            <div className={styles.stepCircle}>
                                {isCompleted ? <FaCheck /> : stepNumber}
                            </div>
                            <div className={styles.stepLabel}>{step}</div>
                        </div>
                        {index < steps.length - 1 && <div className={styles.progressLine} />}
                    </React.Fragment>
                );
            })}
        </div>
    );
};

export default ProgressSteps;