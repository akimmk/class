import React, { useState, useRef, useEffect } from "react";
import { goConsume } from "../utils/mediasoup";
import { useAuth } from "../context/AuthContext.jsx";
import { useParams } from "react-router-dom";
import LabSessionManager from "../components/LabSessionManager.jsx";

const EnhancedConsumer = () => {
  const { classId } = useParams();
  const { user } = useAuth();
  const [roomName, setRoomName] = useState("");
  const [isStreamActive, setIsStreamActive] = useState(false);
  const [showLabSession, setShowLabSession] = useState(false);
  const [className, setClassName] = useState("");
  const [streamStats, setStreamStats] = useState({
    fps: 0,
    resolution: "0x0",
    bitrate: "0 kbps",
  });
  const videoRef = useRef(null);

  useEffect(() => {
    if (classId) {
      setRoomName(classId);
      loadClassDetails();
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

  const loadClassDetails = async () => {
    try {
      // This would fetch class details from your API
      setClassName(`Lab Session ${classId}`);
    } catch (error) {
      console.error('Error loading class details:', error);
    }
  };

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

  const handleOpenLabSession = () => {
    setShowLabSession(true);
  };

  if (showLabSession) {
    return (
      <LabSessionManager
        classId={classId}
        className={className}
        onClose={() => setShowLabSession(false)}
      />
    );
  }

  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Student Lab Viewer</h1>
            <p className="text-gray-600">Class: {className}</p>
          </div>
          <div className="flex space-x-4">
            <button
              onClick={handleOpenLabSession}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 flex items-center space-x-2"
            >
              <span className="material-icons">science</span>
              <span>Join Lab Session</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Video Panel */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">Teacher's Screen</h2>
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
                    <div className="text-center text-white">
                      <span className="material-icons text-6xl mb-4">tv_off</span>
                      <p className="text-lg">Waiting for teacher's stream...</p>
                    </div>
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

          {/* Side Panel */}
          <div className="space-y-6">
            {/* Connection Status */}
            <div className="bg-white rounded-lg shadow-lg p-4">
              <h3 className="text-lg font-semibold mb-4">Connection Status</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Stream:</span>
                  <span className={`font-medium ${isStreamActive ? 'text-green-600' : 'text-gray-600'}`}>
                    {isStreamActive ? 'Connected' : 'Disconnected'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Quality:</span>
                  <span className="font-medium">Auto</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Latency:</span>
                  <span className="font-medium">~200ms</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-lg p-4">
              <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <button
                  onClick={handleOpenLabSession}
                  className="w-full bg-purple-100 text-purple-700 py-2 px-4 rounded-lg hover:bg-purple-200 flex items-center space-x-2"
                >
                  <span className="material-icons">science</span>
                  <span>Lab Session</span>
                </button>
                <button className="w-full bg-blue-100 text-blue-700 py-2 px-4 rounded-lg hover:bg-blue-200 flex items-center space-x-2">
                  <span className="material-icons">chat</span>
                  <span>Class Chat</span>
                </button>
                <button className="w-full bg-green-100 text-green-700 py-2 px-4 rounded-lg hover:bg-green-200 flex items-center space-x-2">
                  <span className="material-icons">screen_share</span>
                  <span>Request Help</span>
                </button>
              </div>
            </div>

            {/* Class Info */}
            <div className="bg-white rounded-lg shadow-lg p-4">
              <h3 className="text-lg font-semibold mb-4">Class Information</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Class:</span>
                  <span className="font-medium">{className}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Room:</span>
                  <span className="font-medium">{roomName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Students:</span>
                  <span className="font-medium">24 online</span>
                </div>
              </div>
            </div>

            {/* Help & Support */}
            <div className="bg-white rounded-lg shadow-lg p-4">
              <h3 className="text-lg font-semibold mb-4">Need Help?</h3>
              <div className="space-y-2">
                <button className="w-full bg-yellow-100 text-yellow-700 py-2 px-4 rounded-lg hover:bg-yellow-200 flex items-center space-x-2">
                  <span className="material-icons">help</span>
                  <span>Ask Teacher</span>
                </button>
                <button className="w-full bg-red-100 text-red-700 py-2 px-4 rounded-lg hover:bg-red-200 flex items-center space-x-2">
                  <span className="material-icons">report_problem</span>
                  <span>Report Issue</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedConsumer;