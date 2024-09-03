// window.addEventListener("DOMContentLoaded", () => {
//     const playPauseBtn = document.querySelector(".play-pause-btn")
//     console.log(playPauseBtn)
//     const video = document.querySelector("video");
//     const videoContainer = document.querySelector(".video-container")

//     // handle the play-pause btn
//     playPauseBtn.addEventListener("click", togglePlay)

//     // function for toggle between play and pause.
//     function togglePlay() {
//         video.paused ? video.play() : video.pause();
//     }

//     video.addEventListener("play", () => {
//         videoContainer.classList.remove("paused")
//     })

//     video.addEventListener("play", () => {
//         videoContainer.classList.add("paused")
//     })
// })