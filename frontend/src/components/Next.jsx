/* eslint-disable react/prop-types */
import { useState } from "react";
import axios from "axios"

export default function Next(props) {

    const [progress, setProgress] = useState(1);
    console.log("Progress => ", progress)

    const newId = props.id + 1;
    async function fetchNextContent(e) {
        e.preventDefault()
        if (progress == 3) {
            updateProgress();
        } else {
            const response = await axios.get(`http://localhost:3000/next?id=${newId}`)
            const data = response.data;
            props.setId(data.id);
            props.setVideoTitle(data.video_title);
            props.setVideoContent(data.video_content);
            updateProgress();            
        }
    }

    async function updateProgress() {
        setProgress((prevValue) => prevValue + 1);
        props.setVideoProgress(progress);
        await axios.patch(`http://localhost:3000/update-progress?id=${props.id}&progress=${progress}`)
    }

    return (
        <div className="next-container">
            {progress <= 3 ?
                <>
                    <p className="next-module-text">
                        module details
                    </p>
                    <button className="next-btn" onClick={(e) => fetchNextContent(e)}>
                        <span className="material-symbols-outlined">
                            arrow_forward_ios
                        </span>
                    </button>
                </>
            :
            <>
                <p className="next-module-text">
                    Module Completed!
                </p>
            </>
            }
        </div>
    )
}