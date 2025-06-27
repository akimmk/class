import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { screenShareService } from '../utils/api.js';

const ScreenShareManager = ({ classId, isTeacher }) => {
  const { user } = useAuth();
  const [screenShareRequests, setScreenShareRequests] = useState([]);
  const [activeScreenShares, setActiveScreenShares] = useState([]);
  const [isSharing, setIsSharing] = useState(false);
  const [hasRequestedShare, setHasRequestedShare] = useState(false);
  const localVideoRef = useRef(null);
  const remoteVideoRefs = useRef({});

  useEffect(() => {
    // Initialize WebSocket for screen share coordination
    const wsUrl = `ws://192.168.1.2:3000/screenshare/${classId}?userId=${user.userId}&role=${user.role}`;
    const ws = new WebSocket(wsUrl);

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      handleScreenShareMessage(data);
    };

    return () => {
      ws.close();
      stopScreenShare();
    };
  }, [classId, user]);

  const handleScreenShareMessage = (data) => {
    switch (data.type) {
      case 'SCREEN_SHARE_REQUEST':
        if (isTeacher) {
          setScreenShareRequests(prev => [...prev, data]);
        }
        break;
      case 'SCREEN_SHARE_APPROVED':
        if (data.studentId === user.userId) {
          startScreenShare();
        }
        break;
      case 'SCREEN_SHARE_DENIED':
        if (data.studentId === user.userId) {
          setHasRequestedShare(false);
        }
        break;
      case 'SCREEN_SHARE_STARTED':
        setActiveScreenShares(prev => [...prev, data]);
        break;
      case 'SCREEN_SHARE_STOPPED':
        setActiveScreenShares(prev => prev.filter(share => share.userId !== data.userId));
        break;
    }
  };

  const requestScreenShare = async () => {
    try {
      await screenShareService.requestScreenShare(classId, user.userId);
      setHasRequestedShare(true);
    } catch (error) {
      console.error('Error requesting screen share:', error);
    }
  };

  const approveScreenShare = async (requestId, studentId) => {
    try {
      await screenShareService.approveScreenShare(requestId, studentId);
      setScreenShareRequests(prev => prev.filter(req => req.id !== requestId));
    } catch (error) {
      console.error('Error approving screen share:', error);
    }
  };

  const denyScreenShare = async (requestId, studentId) => {
    try {
      await screenShareService.denyScreenShare(requestId, studentId);
      setScreenShareRequests(prev => prev.filter(req => req.id !== requestId));
    } catch (error) {
      console.error('Error denying screen share:', error);
    }
  };

  const startScreenShare = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: {
          cursor: 'always',
          displaySurface: 'monitor'
        },
        audio: false
      });

      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      setIsSharing(true);

      // Handle stream end
      stream.getVideoTracks()[0].onended = () => {
        stopScreenShare();
      };

      // Send stream to teacher via WebRTC
      await screenShareService.startScreenShare(classId, user.userId, stream);
    } catch (error) {
      console.error('Error starting screen share:', error);
    }
  };

  const stopScreenShare = async () => {
    try {
      if (localVideoRef.current && localVideoRef.current.srcObject) {
        const tracks = localVideoRef.current.srcObject.getTracks();
        tracks.forEach(track => track.stop());
        localVideoRef.current.srcObject = null;
      }

      setIsSharing(false);
      setHasRequestedShare(false);

      await screenShareService.stopScreenShare(classId, user.userId);
    } catch (error) {
      console.error('Error stopping screen share:', error);
    }
  };

  const takeControlOfScreen = async (studentId) => {
    try {
      await screenShareService.takeControl(classId, studentId);
    } catch (error) {
      console.error('Error taking control:', error);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Screen Sharing</h3>
        {isSharing && (
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
            <span className="text-red-500 font-medium">Sharing Screen</span>
          </div>
        )}
      </div>

      {/* Student Controls */}
      {!isTeacher && (
        <div className="space-y-4">
          {!isSharing && !hasRequestedShare && (
            <button
              onClick={requestScreenShare}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 flex items-center justify-center space-x-2"
            >
              <span className="material-icons">screen_share</span>
              <span>Request Screen Share</span>
            </button>
          )}

          {hasRequestedShare && !isSharing && (
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <span className="material-icons text-yellow-600 text-2xl mb-2">hourglass_empty</span>
              <p className="text-yellow-800">Waiting for teacher approval...</p>
            </div>
          )}

          {isSharing && (
            <div className="space-y-4">
              <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                <video
                  ref={localVideoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-contain"
                />
              </div>
              <button
                onClick={stopScreenShare}
                className="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 flex items-center justify-center space-x-2"
              >
                <span className="material-icons">stop_screen_share</span>
                <span>Stop Sharing</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* Teacher Controls */}
      {isTeacher && (
        <div className="space-y-4">
          {/* Screen Share Requests */}
          {screenShareRequests.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-medium text-gray-900">Screen Share Requests</h4>
              {screenShareRequests.map((request) => (
                <div key={request.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">{request.studentName}</p>
                    <p className="text-sm text-gray-500">Requesting screen share access</p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => approveScreenShare(request.id, request.studentId)}
                      className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => denyScreenShare(request.id, request.studentId)}
                      className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
                    >
                      Deny
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Active Screen Shares */}
          {activeScreenShares.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-medium text-gray-900">Active Screen Shares</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {activeScreenShares.map((share) => (
                  <div key={share.userId} className="border rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">{share.studentName}</span>
                      <button
                        onClick={() => takeControlOfScreen(share.userId)}
                        className="bg-blue-600 text-white px-2 py-1 rounded text-xs hover:bg-blue-700"
                      >
                        Take Control
                      </button>
                    </div>
                    <div className="aspect-video bg-gray-100 rounded overflow-hidden">
                      <video
                        ref={el => remoteVideoRefs.current[share.userId] = el}
                        autoPlay
                        playsInline
                        className="w-full h-full object-contain"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {screenShareRequests.length === 0 && activeScreenShares.length === 0 && (
            <div className="text-center p-8 text-gray-500">
              <span className="material-icons text-4xl mb-2">screen_share</span>
              <p>No screen sharing activity</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ScreenShareManager;