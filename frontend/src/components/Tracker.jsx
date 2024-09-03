/* eslint-disable react/prop-types */
import { useEffect  } from "react"

export default function Tacker(props) {

    useEffect(() => {
                // progress tracker
                function calculateProgress(completedTasks, totalTasks) {
                    if (totalTasks === 0) return 0; // Avoid division by zero
                    return (completedTasks / totalTasks) * 100;
                }
        
                function updateProgress() {
                    const completedTasks = props.progress;
                    const totalTasks = 3
                    const progressPercentage = calculateProgress(completedTasks, totalTasks);
                    const circumference = 2 * Math.PI * 90;
                    const offset = circumference - (progressPercentage / 150 * circumference);
                    
                    // Update the circular progress
                    const progressCircle = document.getElementById('progress-circle');
                    progressCircle.style.strokeDashoffset = offset;
        
                    // Update the text
                    document.getElementById('progress-text').innerText = `${Math.floor(progressPercentage)}%`;
                }
        
                updateProgress()
    }, [props.progress]);
    return (
        <div className="progres-tracker-container">
            <div className="tracker-container">
                <svg width="200" height="200">
                    <circle cx="100" cy="50" r="40" stroke="#808080b4" strokeWidth="13" fill="none" />
                    <circle id="progress-circle" cx="150" cy="100" r="40" stroke="#098ab5" strokeWidth="13" fill="none" 
                            strokeDasharray="500" strokeDashoffset="500" 
                            transform="rotate(-90 100 100)" />
                </svg>
                <div className="tracker-text" id="progress-text">0%</div>
                <div className="module-text">{props.progress}/3 Module completed</div>
            </div>
        </div>
    )
}