import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import { useReactMediaRecorder } from "react-media-recorder";
import { useMediaRecorder } from "use-media-recorder";
let socket;

const Home = () => {
  const ENDPOINT = "http://localhost:8000/";
  socket = io(ENDPOINT, {
    transports: ["websocket", "polling", "flashsocket"],
  });

  const [blobUrl, setBlobUrl] = useState("");
  const [mouse, setMouse] = useState(false);
  const [isStop, setIsStop] = useState(false);

  const { status, startRecording, stopRecording } = useReactMediaRecorder({
    audio: true,
    onStop: async (url) => {
      setBlobUrl(url);
      await fetch(url).then((r) => {
        r.blob().then((b, e) => {
          let bc = new Blob([b]);
          console.log(bc);
        });
      });
      
    },
  });

  useEffect(() => {
    socket.on("connected", (data) => {
      console.log(data);
    });
    socket.emit(
      "greet",
      {
        msg: "Namaste from client1",
      },
      (res) => {
        console.log(res.status);
      }
    );

    socket.on("audioMessage", (audioUrl) => {
      const audio = new Audio(audioUrl);

      var playPromise = audio.play();
      console.log(playPromise);
      if (playPromise !== undefined) {
        playPromise
          .then(function () {
            console.log("played");
          })
          .catch(function (error) {
            console.log(error);
          });
      }
    });
  }, []);

  const startAudioEvent = (e) => {
    e.preventDefault();
    setMouse(true);
    startRecording();
  };
  const stopAudioEvent = () => {
    setMouse(false);
    setIsStop(true);
    stopRecording();
  };

  return (
    <React.Fragment>
      <button onClick={startAudioEvent}>start record</button>
      <br />
      <br />
      <br />
      <br />
      <button onClick={stopAudioEvent}>stop record</button>
      <a href="#!" onMouseDown={startAudioEvent} onMouseUp={stopAudioEvent}>
        <div className="box">
          <div className="object">
            <div className={mouse ? "outline" : ""}></div>
            <div className={mouse ? "outline" : ""} id="delayed"></div>
            <div className="button"></div>
            <div className="button" id="circlein">
              <svg
                className="mic-icon"
                version="1.1"
                x="0px"
                y="0px"
                viewBox="0 0 1000 1000"
                // enable-background="new 0 0 1000 1000"
                style={{ fill: "#1E2D70" }}
              >
                <g>
                  <path d="M500,683.8c84.6,0,153.1-68.6,153.1-153.1V163.1C653.1,78.6,584.6,10,500,10c-84.6,0-153.1,68.6-153.1,153.1v367.5C346.9,615.2,415.4,683.8,500,683.8z M714.4,438.8v91.9C714.4,649,618.4,745,500,745c-118.4,0-214.4-96-214.4-214.4v-91.9h-61.3v91.9c0,141.9,107.2,258.7,245,273.9v124.2H346.9V990h306.3v-61.3H530.6V804.5c137.8-15.2,245-132.1,245-273.9v-91.9H714.4z" />
                </g>
              </svg>
            </div>
          </div>
        </div>
      </a>
    </React.Fragment>
  );
};

export default Home;
