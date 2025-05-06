const mediasoupClient = require("mediasoup-client");
const io = require("socket.io-client");

export const goConsume = (onTrack) => {
  goConnect(false, onTrack);
};
const socket = io("ws://localhost:3000/mediasoup");

socket.on("connection-success", ({ socketId, existsProducer }) => {
  console.log("Socket connected:", socketId, existsProducer);
});

let device;
let rtpCapabilities;
let producerTransport;
let consumerTransport;
let producer;
let consumer;
let isProducer = false;

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

export const getLocalStream = async () => {
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
};

export const selectSource = async (source) => {
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

  // localVideo.srcObject = stream;
  const track = stream.getVideoTracks()[0];
  params = {
    track,
    ...params,
  };

  goConnect(true);
}

const goConnect = (producerOrConsumer, onTrack) => {
  isProducer = producerOrConsumer;
  console.log(device);
  device === undefined ? getRtpCapabilities() : goCreateTransport(onTrack);
};

const goCreateTransport = (onTrack) => {
  isProducer ? createSendTransport() : createRecvTransport(onTrack);
};

const createRecvTransport = async (onTrack) => {
  await socket.emit(
    "createWebRtcTransport",
    { sender: false },
    ({ params }) => {
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

      connectRecvTransport(onTrack);
    },
  );
};

const connectRecvTransport = async (onTrack) => {
  await socket.emit(
    "consume",
    {
      rtpCapabilities: device.rtpCapabilities,
    },
    async ({ params }) => {
      if (params.error) {
        console.log("Cannot Consume");
        return;
      }

      console.log(params);
      consumer = await consumerTransport.consume({
        id: params.id,
        producerId: params.producerId,
        kind: params.kind,
        rtpParameters: params.rtpParameters,
      });

      const { track } = consumer;
      
      // Call the callback with the track
      if (onTrack) {
        onTrack(track);
      }

      socket.emit("consumer-resume");
    },
  );
};

const createSendTransport = () => {
  socket.emit("createWebRtcTransport", { sender: true }, ({ params }) => {
    if (params.error) {
      console.log(params.error);
      return;
    }

    console.log("send Transport created:", params);
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
            console.log("Transport produced:", id);
            // Tell the transport that parameters were transmitted and provide it with the
            // server side producer's id.
            callback({ id });
          },
        );
      } catch (error) {
        errback(error);
      }
    });

    connectSendTransport();
  });
};

const connectSendTransport = async () => {
  producer = await producerTransport.produce(params);
  console.log(producer);

  producer.on("trackended", () => {
    console.log("track ended");

    // close video track
  });

  producer.on("transportclose", () => {
    console.log("transport ended");

    // close video track
  });
};

const getRtpCapabilities = () => {
  socket.emit("createRoom", (data) => {
    console.log(
      `Router RTP Capabilities... ${JSON.stringify(data.rtpCapabilities)}`,
    );

    // we assign to local variable and will be used when
    // loading the client Device (see createDevice above)
    rtpCapabilities = data.rtpCapabilities;

    // once we have rtpCapabilities from the Router, create Device
    createDevice();
  });
};

const createDevice = async () => {
  try {
    device = new mediasoupClient.Device();
    await device.load({
      routerRtpCapabilities: rtpCapabilities,
    });

    console.log("Device loaded successfully:", device.rtpCapabilities);

    goCreateTransport();
  } catch (error) {
    console.error("Error creating device:", error);
    if (error.name === "UnsupportedError") {
      console.warn("Browser not supported for mediasoup-client");
      alert("Browser not supported!");
    }
  }
};

export const replaceProducerTrack = async (newTrack) => {
  if (producer) {
    await producer.replaceTrack({ track: newTrack });
  }
};
