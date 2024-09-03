/* eslint-disable react/prop-types */
import { useEffect } from "react";
import axios from "axios";
import video1 from "../assets/Video1.mp4";
import video2 from "../assets/Video2.mp4";
import video3 from "../assets/Video3.mp4";

const videoList = [video1, video2, video3]

export default function Controls (props) {

    useEffect(() => {
        const timelineContainer = document.querySelector(".timeline-container");
        const playPauseBtn = document.querySelector(".play-pause-btn");
        const video = document.querySelector("video");
        const muteBtn = document.querySelector(".mute-btn");
        const volumeSlider = document.querySelector(".volume-slider");
        const currentTimeElement = document.querySelector(".current-time")
        const totalTimeElement = document.querySelector(".total-time");
        const arrowLeftBtn = document.querySelector(".backward-player-btn");
        const arrowRightBtn = document.querySelector(".forward-player-btn");
        const videoContainer = document.querySelector(".video-container");
        const fullScreenContainer = document.querySelector(".grid-container");
        const fullScreenBtn = document.querySelector(".full-screen-btn");

        // Updating the previous watched time.
        async function updateTime(time) {
            time = parseFloat(time)
            console.log("Time => ", time)
            props.setLastPlayed(time)
            const response = await axios.patch(`http://localhost:3000/update-time?id=${props.id}&currentTime=${time}`)
            console.log(response.data);
        }
        // Timeline
        timelineContainer.addEventListener("mousemove", handleTimelineUpdate)
        function handleTimelineUpdate(e) {
            const rect = timelineContainer.getBoundingClientRect()
            const percent = Math.min(Math.max(0, e.x - rect.x), rect.width) / rect.width;
            timelineContainer.style.setProperty("--preview-position", percent)

        }
        // skip buttons
        function skip() {
            video.currentTime += 0; // no skipping
        }
        function rewind() {
            video.currentTime -= 2;
        }
        arrowLeftBtn.addEventListener("click", rewind);
        arrowRightBtn.addEventListener("click", skip);
        // duration
        video.addEventListener("loadeddata", () => {
            totalTimeElement.textContent = formatDuration(video.duration);
        })
        video.addEventListener("timeupdate", () => {
            currentTimeElement.textContent = formatDuration(video.currentTime)
            const percent = video.currentTime / video.duration;
            timelineContainer.style.setProperty("--progress-position", percent)

            // play from previous stopped time  
            console.log("Current video time => ", video.currentTime)
            updateTime(video.currentTime)
        })
        const leadingZeroFormatter = new Intl.NumberFormat(undefined, {
            minimumIntegerDigits: 2,
        })
        function formatDuration(time) {
            const seconds = Math.floor(time % 60)
            const minutes = Math.floor(time / 60) % 60
            const hours = Math.floor(time / 3600)

            if (hours === 0) {
                return `${minutes}:${leadingZeroFormatter.format(seconds)}`
            } else {
                return `${hours}${leadingZeroFormatter.format(minutes)}:${leadingZeroFormatter.format(seconds)}`
            }
        }
        // Volume
        muteBtn.addEventListener("click", toggleMute)
        volumeSlider.addEventListener("input", e => {
            video.volume = e.target.value
            video.muted = e.target.value == 0
        })
        function toggleMute() {
            video.muted = !video.muted;
        }
        video.addEventListener("volumechange", () => {
            volumeSlider.value = video.volume;
            let volumeLevel;
            if (video.muted || video.volume == 0 ) {
                volumeSlider.value = 0;
                volumeLevel = "muted";
            } else if (video.volume >= .5) {
                volumeLevel = "high";
            } else {
                volumeLevel = "low"
            }

            videoContainer.dataset.volumeLevel = volumeLevel;
        })
        // view modes
        function toggleFullSceenMode() {
            if (document.fullscreenElement == null) {
                fullScreenContainer.requestFullscreen()
            } else {
                document.exitFullscreen()
            }
        }
        document.addEventListener("fullscreenchange", () => {
            fullScreenContainer.classList.toggle("full-screen", document.fullscreenElement)
        })
        fullScreenBtn.addEventListener("click", toggleFullSceenMode);
        // play
        video.addEventListener("click", togglePlay)
        // Function for toggling between play and pause
        function togglePlay() {
            video.paused ? video.play(props.lastPlayed) : video.pause();
        }
        // Handle the play-pause button click
        playPauseBtn.addEventListener("click", togglePlay);
        // Update the video container class on play and pause
        const handlePlay = () => {
            videoContainer.classList.remove("paused");
        };
        const handlePause = () => {
            videoContainer.classList.add("paused");
        };

        video.addEventListener("play", handlePlay);
        video.addEventListener("pause", handlePause);

        // Cleanup event listeners on component unmount
        return () => {
            // document.removeEventListener("keydown", (e) => keyDown(e))
            arrowLeftBtn.removeEventListener("click", rewind);
            arrowRightBtn.removeEventListener("click", skip);
            video.removeEventListener("click", togglePlay)
            playPauseBtn.removeEventListener("click", togglePlay);
            video.removeEventListener("play", handlePlay);
            video.removeEventListener("pause", handlePause);
            document.removeEventListener("fullscreenchange", () => {
                fullScreenContainer.classList.toggle("full-screen", document.fullscreenElement)
            })
            fullScreenBtn.removeEventListener("click", toggleFullSceenMode);
        };
    }, [props, props.setPlayedUpTo]); // Empty dependency array to run only once

    return (

        <div className='video-container paused full-screen' data-volume-level="high">
            <div className="video-controls-container">
                <div className="timeline-container">
                    <div className="timeline">
                        <div className="thumb-indicator"></div>
                    </div>
                </div>
                <div className="controls">
                    <button className="play-pause-btn">
                        <svg className="play-icon" viewBox="0 0 24 24">
                            <path fill="currentColor" d="M8,5.14V19.14L19,12.14L8,5.14Z" />
                        </svg>
                        <svg className="pause-icon" viewBox="0 0 24 24">
                            <path fill="currentColor" d="M14,19H18V5H14M6,19H10V5H6V19Z" />
                        </svg>
                    </button>
                    <button className="backward-player-btn">
                    <span className="material-symbols-outlined">arrow_back</span>
                    </button>
                    <button className="forward-player-btn">
                        <span className="material-symbols-outlined">arrow_forward</span>
                    </button>
                    <div className="volume-container">
                        <button className="mute-btn">
                            <svg className="volume-high-icon" viewBox="0 0 24 24">
                                <path fill="currentColor" d="M14,3.23V5.29C16.89,6.15 19,8.83 19,12C19,15.17 16.89,17.84 14,18.7V20.77C18,19.86 21,16.28 21,12C21,7.72 18,4.14 14,3.23M16.5,12C16.5,10.23 15.5,8.71 14,7.97V16C15.5,15.29 16.5,13.76 16.5,12M3,9V15H7L12,20V4L7,9H3Z" />
                            </svg>
                            <svg className="volume-low-icon" viewBox="0 0 24 24">
                                <path fill="currentColor" d="M5,9V15H9L14,20V4L9,9M18.5,12C18.5,10.23 17.5,8.71 16,7.97V16C17.5,15.29 18.5,13.76 18.5,12Z" />
                            </svg>
                            <svg className="volume-muted-icon" viewBox="0 0 24 24">
                                <path fill="currentColor" d="M12,4L9.91,6.09L12,8.18M4.27,3L3,4.27L7.73,9H3V15H7L12,20V13.27L16.25,17.53C15.58,18.04 14.83,18.46 14,18.7V20.77C15.38,20.45 16.63,19.82 17.68,18.96L19.73,21L21,19.73L12,10.73M19,12C19,12.94 18.8,13.82 18.46,14.64L19.97,16.15C20.62,14.91 21,13.5 21,12C21,7.72 18,4.14 14,3.23V5.29C16.89,6.15 19,8.83 19,12M16.5,12C16.5,10.23 15.5,8.71 14,7.97V10.18L16.45,12.63C16.5,12.43 16.5,12.21 16.5,12Z" />
                            </svg>
                        </button>
                        <input className="volume-slider" type="range" min="0" max="1" step="any" />
                    </div>
                    <div className="duration-container">
                        <div className="current-time">0:00</div>
                        /
                        <div className="total-time"></div>
                    </div>
                    <button className="full-screen-btn">
                        <svg className="open" viewBox="0 0 24 24">
                            <path fill="currentColor" d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/>
                        </svg>
                        <svg className="close" viewBox="0 0 24 24">
                            <path fill="currentColor" d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z"/>
                        </svg>
                    </button>
                </div>
            </div>
            <video src={videoList[parseInt(props.id)-1]}></video>
        </div>
    );
}