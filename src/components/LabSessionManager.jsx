import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import ChatRoom from './ChatRoom.jsx';
import ScreenShareManager from './ScreenShareManager.jsx';
import { labSessionService } from '../utils/api.js';

const LabSessionManager = ({ classId, className, onClose }) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [sessionData, setSessionData] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [isSessionActive, setIsSessionActive] = useState(false);
  const isTeacher = user.role === 'TEACHER';

  useEffect(() => {
    loadSessionData();
    
    // Set up WebSocket for session updates
    const wsUrl = `ws://192.168.1.2:3000/session/${classId}?userId=${user.userId}`;
    const ws = new WebSocket(wsUrl);

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      handleSessionUpdate(data);
    };

    return () => {
      ws.close();
    };
  }, [classId]);

  const loadSessionData = async () => {
    try {
      const data = await labSessionService.getSessionData(classId);
      setSessionData(data);
      setParticipants(data.participants || []);
      setIsSessionActive(data.isActive);
    } catch (error) {
      console.error('Error loading session data:', error);
    }
  };

  const handleSessionUpdate = (data) => {
    switch (data.type) {
      case 'PARTICIPANT_JOINED':
        setParticipants(prev => [...prev, data.participant]);
        break;
      case 'PARTICIPANT_LEFT':
        setParticipants(prev => prev.filter(p => p.userId !== data.userId));
        break;
      case 'SESSION_STATUS_CHANGED':
        setIsSessionActive(data.isActive);
        break;
    }
  };

  const startSession = async () => {
    try {
      await labSessionService.startSession(classId);
      setIsSessionActive(true);
    } catch (error) {
      console.error('Error starting session:', error);
    }
  };

  const endSession = async () => {
    try {
      await labSessionService.endSession(classId);
      setIsSessionActive(false);
    } catch (error) {
      console.error('Error ending session:', error);
    }
  };

  const kickParticipant = async (participantId) => {
    try {
      await labSessionService.kickParticipant(classId, participantId);
    } catch (error) {
      console.error('Error kicking participant:', error);
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: 'dashboard' },
    { id: 'chat', label: 'Chat', icon: 'chat' },
    { id: 'screenshare', label: 'Screen Share', icon: 'screen_share' },
    { id: 'participants', label: 'Participants', icon: 'people' },
  ];

  return (
    <div className="fixed inset-0 bg-white z-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 ml-64">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100"
            >
              <span className="material-icons">arrow_back</span>
            </button>
            <div>
              <h2 className="text-2xl font-bold">{className}</h2>
              <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                <span>Lab Session</span>
                <span>•</span>
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${isSessionActive ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                  <span>{isSessionActive ? 'Active' : 'Inactive'}</span>
                </div>
                <span>•</span>
                <span>{participants.length} participants</span>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            {isTeacher && (
              <button
                onClick={isSessionActive ? endSession : startSession}
                className={`px-4 py-2 rounded-lg flex items-center space-x-2 ${
                  isSessionActive 
                    ? 'bg-red-600 hover:bg-red-700 text-white' 
                    : 'bg-green-600 hover:bg-green-700 text-white'
                }`}
              >
                <span className="material-icons">
                  {isSessionActive ? 'stop' : 'play_arrow'}
                </span>
                <span>{isSessionActive ? 'End Session' : 'Start Session'}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200 px-6 ml-64">
        <div className="flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <span className="material-icons text-sm">{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="h-[calc(100vh-160px)] overflow-hidden ml-64">
        {activeTab === 'overview' && (
          <div className="p-6 h-full overflow-y-auto">
            <div className="max-w-4xl mx-auto space-y-6">
              {/* Session Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-lg shadow border">
                  <div className="flex items-center">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <span className="material-icons text-blue-600">people</span>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-500">Participants</p>
                      <p className="text-2xl font-bold text-gray-900">{participants.length}</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow border">
                  <div className="flex items-center">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <span className="material-icons text-green-600">screen_share</span>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-500">Active Shares</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {participants.filter(p => p.isSharing).length}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow border">
                  <div className="flex items-center">
                    <div className="p-2 bg-yellow-100 rounded-lg">
                      <span className="material-icons text-yellow-600">schedule</span>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-500">Duration</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {sessionData?.duration || '0m'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow border">
                  <div className="flex items-center">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <span className="material-icons text-purple-600">chat</span>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-500">Messages</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {sessionData?.messageCount || 0}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-white rounded-lg shadow border">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">Recent Activity</h3>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {sessionData?.recentActivity?.map((activity, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <div className="p-2 bg-gray-100 rounded-full">
                          <span className="material-icons text-gray-600 text-sm">
                            {activity.icon}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm text-gray-900">{activity.message}</p>
                          <p className="text-xs text-gray-500">{activity.timestamp}</p>
                        </div>
                      </div>
                    )) || (
                      <p className="text-gray-500 text-center py-8">No recent activity</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'chat' && (
          <div className="p-6 h-full">
            <div className="max-w-4xl mx-auto h-full">
              <ChatRoom classId={classId} className={className} />
            </div>
          </div>
        )}

        {activeTab === 'screenshare' && (
          <div className="p-6 h-full overflow-y-auto">
            <div className="max-w-4xl mx-auto">
              <ScreenShareManager classId={classId} isTeacher={isTeacher} />
            </div>
          </div>
        )}

        {activeTab === 'participants' && (
          <div className="p-6 h-full overflow-y-auto">
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-lg shadow border">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">Session Participants</h3>
                </div>
                <div className="divide-y divide-gray-200">
                  {participants.map((participant) => (
                    <div key={participant.userId} className="p-6 flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="p-2 bg-gray-100 rounded-full">
                          <span className="material-icons text-gray-600">person</span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {participant.username}
                          </p>
                          <p className="text-sm text-gray-500">
                            {participant.role} • Joined {participant.joinedAt}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          {participant.isSharing && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              Sharing Screen
                            </span>
                          )}
                          <div className={`w-3 h-3 rounded-full ${
                            participant.isOnline ? 'bg-green-500' : 'bg-gray-400'
                          }`}></div>
                        </div>
                        {isTeacher && participant.role === 'STUDENT' && (
                          <button
                            onClick={() => kickParticipant(participant.userId)}
                            className="text-red-600 hover:text-red-800 text-sm"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LabSessionManager;