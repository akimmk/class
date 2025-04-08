// const webcamButton = document.getElementById("webcamButton");
// const webcamVideo = document.getElementById("webcamVideo");
// const callButton = document.getElementById("callButton");
// const callInput = document.getElementById("callInput");
// const callOut = document.getElementById("callOut");
// const answerButton = document.getElementById("answerButton");
// const remoteVideo = document.getElementById("remoteVideo");
// const remoteButton = document.getElementById("remoteButton");
// const hangupButton = document.getElementById("hangupButton");
//
// let localStream = null;
// let remoteStream = null;
// const servers = {
//   iceServers: [
//     {
//       urls: ["stun:stun1.l.google.com:19302", "stun:stun2.l.google.com:19302"],
//     },
//   ],
//   iceCandidatePoolSize: 10,
// };
//
// const pc = new RTCPeerConnection();
//
// webcamButton.onclick = async () => {
//   localStream = await navigator.mediaDevices.getUserMedia({
//     video: true,
//     audio: false,
//   });
//   remoteStream = new MediaStream();
//
//   // Push tracks from local stream to peer connection
//   localStream.getTracks().forEach((track) => {
//     pc.addTrack(track, localStream);
//   });
//
//   // Pull tracks from remote stream, add to video stream
//   pc.ontrack = (event) => {
//     event.streams[0].getTracks().forEach((track) => {
//       remoteStream.addTrack(track);
//     });
//   };
//
//   webcamVideo.srcObject = localStream;
//   remoteVideo.srcObject = remoteStream;
//
//   callButton.disabled = false;
//   answerButton.disabled = false;
//   webcamButton.disabled = true;
// };
//
// callButton.onclick = async () => {
//   var offer = await pc.createOffer();
//   let icecandidate = `a=candidate:2800883314 1 udp 2122260224 192.168.141.70 39471 typ host generation 0 network-id 1 network-cost 10\r\n`;
//
//   offer.sdp = offer.sdp + icecandidate;
//
//   await pc.setLocalDescription(offer);
//
//   pc.onicecandidate = (ice) => {
//     if (ice.candidate) {
//       console.log(pc.localDescription.sdp);
//       callInput.value = JSON.stringify(pc.localDescription);
//     }
//   };
//
//   callInput.value = JSON.stringify(pc.localDescription);
//   answerButton.disabled = true;
// };
//
// answerButton.onclick = async () => {
//   let icecandidate = `a=candidate:292513629 1 udp 2122260223 10.139.170.39 48990 typ host generation 0 network-id 1 network-cost 10\r\n`;
//
//   const offer = JSON.parse(callInput.value);
//
//   await pc.setRemoteDescription(new RTCSessionDescription(offer));
//
//   pc.onicecandidate = (ice) => {
//     if (ice.candidate) {
//       console.log(pc.localDescription.sdp);
//     }
//   };
//   var answer = await pc.createAnswer();
//   answer.sdp = answer.sdp + icecandidate;
//   await pc.setLocalDescription(answer);
//   callOut.value = JSON.stringify(pc.localDescription);
// };
//
// remoteButton.onclick = async () => {
//   var remote = JSON.parse(callOut.value);
//   await pc.setRemoteDescription(new RTCSessionDescription(remote));
// };
//
const mediasoupClient = require("mediasoup-client");
const io = require("socket.io-client");

// console.log(await window.electronAPI.getIp());

const socket = io("ws://localhost:3000/mediasoup");
let device;
let rtpCapabilities;
let producerTransport;
let consumerTransport;
let producer;
let consumer;

let params = {
  // mediasoup params
  encodings: [
    {
      rid: "r0",
      maxBitrate: 100000,
      scalabilityMode: "S1T3",
    },
    {
      rid: "r1",
      maxBitrate: 300000,
      scalabilityMode: "S1T3",
    },
    {
      rid: "r2",
      maxBitrate: 900000,
      scalabilityMode: "S1T3",
    },
  ],
  codecOptions: {
    videoGoogleStartBitrate: 1000,
  },
};

socket.on("connection-success", ({ socketId }) => {
  console.log("Socket connected:", socketId);
});

const getRtpCapabilities = () => {
  return new Promise((resolve, reject) => {
    socket.emit("getRtpCapabilities", (data) => {
      if (data && data.rtpCapabilities) {
        console.log("Router RTP Capabilities:", data.rtpCapabilities);
        rtpCapabilities = data.rtpCapabilities; // Store capabilities
        resolve(rtpCapabilities);
      } else {
        console.error("Failed to get RTP capabilities from server");
        reject(new Error("Failed to get RTP capabilities"));
      }
    });
  });
};

const createDevice = async () => {
  if (!rtpCapabilities) {
    console.error("RTP Capabilities not loaded yet!");
    alert("Please get RTP Capabilities first."); // Or handle more gracefully
    return;
  }
  try {
    device = new mediasoupClient.Device();
    await device.load({
      routerRtpCapabilities: rtpCapabilities,
    });
    console.log("Device loaded successfully:", device);
    // Enable the create transport buttons or next steps
  } catch (error) {
    console.error("Error creating device:", error);
    if (error.name === "UnsupportedError") {
      console.warn("Browser not supported for mediasoup-client");
      alert("Browser not supported!");
    }
  }
};
// --- End Mediasoup Setup ---

const streamSuccess = async (stream) => {
  localVideo.srcObject = stream;
  const track = stream.getVideoTracks()[0];
  params = {
    track,
    ...params,
  };
};

async function selectSource(source) {
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

  localVideo.srcObject = stream;
  const track = stream.getVideoTracks()[0];
  params = {
    track,
    ...params,
  };
}

// const getLocalStream = () => {
//   navigator.getUserMedia(
//     {
//       audio: false,
//       video: {
//         width: {
//           min: 640,
//           max: 1920,
//         },
//         height: {
//           min: 400,
//           max: 1080,
//         },
//       },
//     },
//     streamSuccess,
//     (error) => {
//       console.log(error.message);
//     },
//   );
const getLocalStream = async () => {
  const sources = await window.electronAPI.getDesktopSources([
    "screen",
    "window",
  ]);

  const container = document.getElementById("sourceContainer");

  // Clear previous entries
  container.innerHTML = "";
  console.log(sources);

  sources.forEach((source) => {
    const div = document.createElement("div");
    div.classList.add("source-box");

    const img = document.createElement("img");
    img.src = source.thumbnail;
    img.classList.add("thumb");

    const label = document.createElement("p");
    label.innerText = source.name;

    div.appendChild(img);
    div.appendChild(label);
    container.appendChild(div);

    // When user clicks on a source
    div.onclick = () => selectSource(source);
  });

  // navigator.mediaDevices
  //   .getDisplayMedia()
  //   .then((stream) => {
  //     localVideo.srcObject = stream;
  //     const track = stream.getVideoTracks()[0];
  //     params = {
  //       track,
  //       ...params,
  //     };
  //   })
  //   .catch((e) => console.log(e));
};

const btnLocalVideo = document.getElementById("btnLocalVideo");
const btnRtpCapabilities = document.getElementById("btnRtpCapabilities"); // Assuming you have a button with this ID in index.html
const btnDevice = document.getElementById("btnDevice");

btnLocalVideo.addEventListener("click", getLocalStream); // Corrected: Pass function reference, don't call immediately

// Add event listener for getting RTP capabilities
if (btnRtpCapabilities) {
  btnRtpCapabilities.addEventListener("click", async () => {
    try {
      await getRtpCapabilities(); // Call the local function
      console.log("RTP Capabilities fetched and stored.");
      // Optionally enable the create device button here
      if (btnDevice) btnDevice.disabled = false;
    } catch (error) {
      console.error("Error getting RTP capabilities:", error);
      alert("Could not get RTP Capabilities from server.");
    }
  });
} else {
  console.warn("Button with ID 'btnRtpCapabilities' not found.");
  // Automatically fetch RTP capabilities on load
  (async () => {
    try {
      await getRtpCapabilities();
      console.log("RTP Capabilities fetched automatically on load.");
      if (btnDevice) btnDevice.disabled = false; // Enable device creation button
    } catch (error) {
      console.error("Error auto-getting RTP capabilities:", error);
      // Handle error appropriately, maybe disable buttons
      if (btnDevice) btnDevice.disabled = true;
    }
  })();
}

if (btnDevice) {
  btnDevice.addEventListener("click", createDevice); // Call the local function
  btnDevice.disabled = true; // Initially disable until capabilities are loaded
} else {
  console.warn("Button with ID 'btnDevice' not found.");
}

const btnCreateSendTransport = document.getElementById(
  "btnCreateSendTransport",
);
const createSendTransport = async () => {
  socket.emit("createWebRTCTransport", { sender: true }, ({ params }) => {
    if (params.error) {
      console.log(params.error);
      return;
    }

    console.log("Transport created:", params);
    producerTransport = device.createSendTransport(params);

    producerTransport.on(
      "connect",
      async ({ dtlsParameters }, callback, errback) => {
        try {
          await socket.emit("transport-connect", {
            dtlsParameters,
          });

          callback();
        } catch (error) {
          errback(error);
        }
      },
    );

    producerTransport.on("produce", async (parameters, callback, errback) => {
      console.log(parameters);

      try {
        // see server's socket.on('transport-produce', ...)
        await socket.emit(
          "transport-produce",
          {
            kind: parameters.kind,
            rtpParameters: parameters.rtpParameters,
            appData: parameters.appData,
          },
          ({ id }) => {
            // Tell the transport that parameters were transmitted and provide it with the
            // server side producer's id.
            callback({ id });
          },
        );
      } catch (error) {
        errback(error);
      }
    });
  });
};

btnCreateSendTransport.addEventListener("click", createSendTransport);
const btnConnectSendTransport = document.getElementById(
  "btnConnectSendTransport",
);

const connectSendTransport = async () => {
  producer = await producerTransport.produce(params);

  producer.on("trackended", () => {
    console.log("track ended");

    // close video track
  });

  producer.on("transportclose", () => {
    console.log("transport ended");

    // close video track
  });
};

btnConnectSendTransport.addEventListener("click", connectSendTransport);

const btnRecvSendTransport = document.getElementById("btnRecvSendTransport");
const createRecvTransport = async () => {
  await socket.emit(
    "createWebRTCTransport",
    { sender: false },
    ({ params }) => {
      console.log("Transport created:", params);
      if (params.error) {
        console.log(params.error);
        return;
      }

      console.log(params);

      consumerTransport = device.createRecvTransport(params);

      consumerTransport.on(
        "connect",
        async ({ dtlsParameters }, callback, errback) => {
          try {
            await socket.emit("transport-recv-connect", {
              dtlsParameters,
            });

            callback();
          } catch (error) {
            errback(error);
          }
        },
      );
    },
  );
};

btnRecvSendTransport.addEventListener("click", createRecvTransport);

const btnConnectRecvTransport = document.getElementById(
  "btnConnectRecvTransport",
);

const connectRecvTransport = async () => {
  await socket.emit(
    "consume",
    {
      rtpCapabilities: device.rtpCapabilities,
    },
    async ({ params }) => {
      if (params.error) {
        console.log(params.error);
        console.log("Cannot Consume");
        return;
      }

      console.log(params);
      // then consume with the local consumer transport
      // which creates a consumer
      consumer = await consumerTransport.consume({
        id: params.id,
        producerId: params.producerId,
        kind: params.kind,
        rtpParameters: params.rtpParameters,
      });

      console.log("here");
      const { track } = consumer;
      remoteVideo.srcObject = new MediaStream([track]);

      socket.emit("consumer-resume");
    },
  );
};

btnConnectRecvTransport.addEventListener("click", connectRecvTransport);
