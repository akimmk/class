import React from "react";
import { getLocalStream, goConsume } from "../utils/mediasoup";

const Mediaclass = () => {
  const handleChooseSource = () => {
    getLocalStream();
  };

  const handlConsumeBtn = () => {
    goConsume();
  };
  return (
    <div id="video">
      <table>
        <thead>
          <tr>
            <th>Local Video</th>
            <th>Remote Video</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <div className="sharedBtns">
                <video
                  autoPlay
                  playsInline
                  id="localVideo"
                  className="video"
                ></video>
              </div>
            </td>
            <td>
              <div className="sharedBtns">
                <video
                  autoPlay
                  playsInline
                  id="remoteVideo"
                  className="video"
                ></video>
              </div>
            </td>
          </tr>
          <tr>
            <td>
              <button id="chooseSource" onClick={handleChooseSource}>
                Choose Source
              </button>

              <div id="sourceContainer"></div>

              <video autoPlay playsInline></video>
            </td>
            <td>
              <div className="sharedBtns">
                <button id="btnRecvSendTransport" onClick={handlConsumeBtn}>
                  consume
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default Mediaclass;
