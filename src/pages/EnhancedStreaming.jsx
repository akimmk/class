import React, { useState, useEffect, useRef } from "react";
import {
  getLocalStream,
  selectSource,
  replaceProducerTrack,
} from "../utils/mediasoup";
import { useAuth } from "../context/AuthContext.jsx";
import { useParams } from "react-router-dom";
import LabSessionManager from "../components/LabSessionManager.jsx";

const EnhancedStreaming = () => {
  const { classId } = useParams();
  const { user } = useAuth();
  const [isPreviewActive, setIsPreviewActive] = useState(false);
  const [selectedSource, setSelectedSource] = useState(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [roomName, setRoomName] = useState("");
  const [showLabSession, setShowLabSession] = useState(false);
  const [className, setClassName] = useState("");
  const [streamOptions, setStreamOptions] = useState({
    quality: "high",
    audio: false,
    fps: 30,
  });
  const [participants, setParticipants] = useState([]);
  const previewVideoRef = useRef(null);
  const currentStreamRef = useRef(null);

  useEffect(() => {
    if (classId) {
      setRoomName(classId);
      // Load class details
      loadClassDetails();
    }
  }, [classId]);

  const loadClassDetails = async () => {
    try {
      // This would fetch class details from your API
      setClassName(`Lab Session ${classId}`);
    } catch (error) {
      console.error('Error loading class details:', error);
    }
  };

  const handleStartPreview = async () => {
    try {
      const sources = await window.electronAPI.getDesktopSources([
        "screen",
        "window",
      ]);
      const container = document.getElementById("sourceContainer");
      container.innerHTML = "";
      container.style.display = "grid";

      sources.forEach((source) => {
        const div = document.createElement("div");
        div.classList.add(
          "source-box",
          "cursor-pointer",
          "p-2",
          "border",
          "rounded-lg",
          "hover:bg-gray-100",
        );

        const img = document.createElement("img");
        img.src = source.thumbnail;
        img.classList.add("thumb", "w-full", "h-32", "object-cover", "rounded");

        const label = document.createElement("p");
        label.innerText = source.name;
        label.classList.add("text-sm", "mt-2", "text-center");

        div.appendChild(img);
        div.appendChild(label);
        container.appendChild(div);

        div.onclick = () => handleSelectSource(source);
      });

      setIsPreviewActive(true);
    } catch (error) {
      console.error("Error starting preview:", error);
    }
  };

  const handleSelectSource = async (source) => {
    try {
      // Stop the current stream if it exists
      if (currentStreamRef.current) {
        currentStreamRef.current.getTracks().forEach((track) => track.stop());
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: {
          mandatory: {
            chromeMediaSource: "desktop",
            chromeMediaSourceId: source.id,
            maxWidth: 1920,
            maxHeight: 1080,
          },
        },
      });

      // Store the new stream reference
      currentStreamRef.current = stream;

      if (previewVideoRef.current) {
        previewVideoRef.current.srcObject = stream;
      }
      setSelectedSource(source);

      // If we're currently streaming, replace the track
      if (isStreaming) {
        const videoTrack = stream.getVideoTracks()[0];
        await replaceProducerTrack(videoTrack);
      }

      // Hide the source container after selection
      const container = document.getElementById("sourceContainer");
      if (container) {
        container.style.display = "none";
      }
    } catch (error) {
      console.error("Error selecting source:", error);
    }
  };

  const handleStartStreaming = () => {
    if (selectedSource && roomName) {
      selectSource(selectedSource, user, roomName);
      setIsStreaming(true);
    } else {
      alert("Please select a source and enter a room name.");
    }
  };

  const handleStopStreaming = () => {
    setIsStreaming(false);
    // Stop the current stream
    if (currentStreamRef.current) {
      currentStreamRef.current.getTracks().forEach((track) => track.stop());
      currentStreamRef.current = null;
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
            <h1 className="text-2xl font-bold text-gray-900">Teacher Streaming Console</h1>
            <p className="text-gray-600">Class: {className}</p>
          </div>
          <div className="flex space-x-4">
            <button
              onClick={handleOpenLabSession}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 flex items-center space-x-2"
            >
              <span className="material-icons">science</span>
              <span>Open Lab Session</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Streaming Panel */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">Screen Streaming</h2>
                {isStreaming && (
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                    <span className="text-red-500 font-medium">LIVE</span>
                  </div>
                )}
              </div>
              
              <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden mb-4">
                <video
                  ref={previewVideoRef}
                  autoPlay
                  playsInline
                  className="w-full h-full object-contain"
                />
              </div>
              
              <div className="space-y-4">
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

                <button
                  onClick={handleStartPreview}
                  className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Select Source
                </button>
                
                <div
                  id="sourceContainer"
                  className="grid grid-cols-2 gap-4 mt-4"
                ></div>

                {/* Streaming Options */}
                <div className="mt-6 space-y-4">
                  <h3 className="font-semibold">Streaming Options</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Quality
                      </label>
                      <select
                        value={streamOptions.quality}
                        onChange={(e) =>
                          setStreamOptions({
                            ...streamOptions,
                            quality: e.target.value,
                          })
                        }
                        className="w-full p-2 border rounded-lg"
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        FPS
                      </label>
                      <select
                        value={streamOptions.fps}
                        onChange={(e) =>
                          setStreamOptions({
                            ...streamOptions,
                            fps: parseInt(e.target.value),
                          })
                        }
                        className="w-full p-2 border rounded-lg"
                      >
                        <option value="24">24 FPS</option>
                        <option value="30">30 FPS</option>
                        <option value="60">60 FPS</option>
                      </select>
                    </div>
                    <div className="flex items-center">
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={streamOptions.audio}
                          onChange={(e) =>
                            setStreamOptions({
                              ...streamOptions,
                              audio: e.target.checked,
                            })
                          }
                          className="rounded"
                        />
                        <span className="text-sm font-medium text-gray-700">
                          Include Audio
                        </span>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Stream Control Button */}
                <button
                  onClick={isStreaming ? handleStopStreaming : handleStartStreaming}
                  disabled={!selectedSource || !roomName}
                  className={`w-full py-2 px-4 rounded-lg transition-colors ${isStreaming
                    ? "bg-red-500 hover:bg-red-600 text-white"
                    : "bg-green-500 hover:bg-green-600 text-white disabled:bg-gray-400 disabled:cursor-not-allowed"
                    }`}
                >
                  {isStreaming ? "Stop Streaming" : "Start Streaming"}
                </button>
              </div>
            </div>
          </div>

          {/* Side Panel */}
          <div className="space-y-6">
            {/* Session Stats */}
            <div className="bg-white rounded-lg shadow-lg p-4">
              <h3 className="text-lg font-semibold mb-4">Session Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className={`font-medium ${isStreaming ? 'text-green-600' : 'text-gray-600'}`}>
                    {isStreaming ? 'Live' : 'Offline'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Viewers:</span>
                  <span className="font-medium">{participants.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Duration:</span>
                  <span className="font-medium">00:00:00</span>
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
                  <span>Screen Requests</span>
                </button>
              </div>
            </div>

            {/* Connected Students */}
            <div className="bg-white rounded-lg shadow-lg p-4">
              <h3 className="text-lg font-semibold mb-4">Connected Students</h3>
              <div className="space-y-2">
                {participants.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">No students connected</p>
                ) : (
                  participants.map((participant, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm">{participant.name}</span>
                      </div>
                      <span className="text-xs text-gray-500">{participant.joinTime}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedStreaming;