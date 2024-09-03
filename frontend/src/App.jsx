import { useEffect, useState } from "react";
import axios from "axios";

import Controls from "./components/Controls.jsx"
import Tacker from './components/Tracker.jsx';
import Content from "./components/Content.jsx";
import Next from './components/Next.jsx';

export default function App() {

  const [id, setId] = useState(1);
  const [videoTitle, setVideoTitle] = useState('');
  const [videoProgress, setVideoProgress] = useState(0);
  const [videoContent, setVideoContent] = useState('');
  const [lastPlayed, setLastPlayed] = useState(0);
  
  const getVideoData = async () => {
    try {
        const response = await axios.get("http://localhost:3000/");
        const data = response.data;
        setId(data.id);
        setVideoTitle(data.video_title);
        setVideoProgress(data.user_progress);
        setVideoContent(data.video_content);
        setLastPlayed(data.user_played_time)
    } catch (err) {
        console.error(err.message)
    }
  }

  useEffect(() => {
      getVideoData();
  }, []);

  return(
        <>
          <div className="grid-container">
            <Tacker progress={videoProgress}/>
            <Content title={videoTitle} content={videoContent}/>
            <Controls id={id} lastPlayed={lastPlayed} setLastPlayed={setLastPlayed}/>
            <Next id={id} 
              setId={setId}
              setVideoTitle={setVideoTitle}
              setVideoProgress={setVideoProgress}
              setVideoContent={setVideoContent}
             />
          </div>
        </>
  )
}