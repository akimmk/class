import React, { useState, useRef, useEffect } from "react";
import { goConsume } from "../utils/mediasoup";
import { useAuth } from "../context/AuthContext.jsx";
import { useParams } from "react-router-dom";

const Consumer = () => {
  const { classId } = useParams();
  const { user } = useAuth();
  const [roomName, setRoomName] = useState("");
  const [isStreamActive, setIsStreamActive] = useState(false);
  const [streamStats, setStreamStats] = useState({
    fps: 0,
    resolution: "0x0",
    bitrate: "0 kbps",
  });
  const videoRef = useRef(null);

  useEffect(() => {
    if (classId) {
      setRoomName(classId);
    }
  }, [classId]);

  useEffect(() => {
    // Set up stats monitoring
    const statsInterval = setInterval(() => {
      if (videoRef.current && videoRef.current.srcObject) {
        const videoTrack = videoRef.current.srcObject.getVideoTracks()[0];
        if (videoTrack) {
          const settings = videoTrack.getSettings();
          setStreamStats({
            fps: settings.frameRate || 0,
            resolution: `${settings.width || 0}x${settings.height || 0}`,
            bitrate: "Calculating...", // You would calculate this from actual stream data
          });
        }
      }
    }, 1000);

    return () => {
      clearInterval(statsInterval);
      if (videoRef.current && videoRef.current.srcObject) {
        videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const handleConnect = async () => {
    if (!roomName) {
      alert("Please enter a room name.");
      return;
    }
    try {
      await goConsume(user, roomName, (track) => {
        if (videoRef.current) {
          videoRef.current.srcObject = new MediaStream([track]);
          setIsStreamActive(true);
        }
      });
    } catch (error) {
      console.error("Error connecting to stream:", error);
    }
  };

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Stream Viewer</h2>
            {isStreamActive && (
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                <span className="text-red-500 font-medium">LIVE</span>
              </div>
            )}
          </div>

          {/* Room Name Input */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Room Name
            </label>
            <input
              type="text"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              placeholder="Enter room name"
              className="w-full p-2 border rounded-lg"
            />
          </div>

          {/* Video Display */}
          <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden mb-4 relative">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full h-full object-contain"
            />
            {!isStreamActive && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
                <p className="text-white text-lg">Waiting for stream...</p>
              </div>
            )}
          </div>

          {/* Stream Stats */}
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-sm text-gray-500">FPS</p>
              <p className="text-lg font-semibold">{streamStats.fps}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-sm text-gray-500">Resolution</p>
              <p className="text-lg font-semibold">{streamStats.resolution}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-sm text-gray-500">Bitrate</p>
              <p className="text-lg font-semibold">{streamStats.bitrate}</p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex gap-4">
            <button
              onClick={handleConnect}
              disabled={isStreamActive || !roomName}
              className={`flex-1 py-2 px-4 rounded-lg transition-colors ${
                isStreamActive
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-500 hover:bg-blue-600 text-white disabled:bg-gray-400 disabled:cursor-not-allowed"
              }`}
            >
              {isStreamActive ? "Connected" : "Connect to Stream"}
            </button>
            <button
              className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors"
              onClick={() => {
                if (videoRef.current) {
                  videoRef.current.requestFullscreen();
                }
              }}
            >
              Fullscreen
            </button>
            <button
              className="flex-1 bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors"
              onClick={() => {
                if (videoRef.current) {
                  const isMuted = videoRef.current.muted;
                  videoRef.current.muted = !isMuted;
                }
              }}
            >
              Toggle Audio
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Consumer;
