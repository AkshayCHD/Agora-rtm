import React, { useEffect, useState, useCallback } from 'react'
import AgoraRTC from "../utils/AgoraEnhancer";
import useMediaStream from '../hooks/useMediaStream'
import StreamArea from './StreamArea'
// Declarative Stream Player for React
// Wrapped around native HTML video and audio tag with added Agora features
import "./style.css"

const defaultState = {
  appId: "",
  channel: "",
  uid: "",
  token: undefined,
  cameraId: "",
  microphoneId: "",
  mode: "rtc",
  codec: "h264"
};

export default function StreamManager({ streamData }) {
	// const [localStream, setLocalStream] = useState(null);
	// const [remoteStream, setRemoteStream] = useState(null);
  const [agoraClient, setClient] = useState(undefined)

  let [localStream, remoteStreamList, streamList] = useMediaStream(agoraClient);

	const loadStreams = async () => {
		const { channelName, uid, token, appId} = streamData;

		console.log(localStorage.getItem('user'))
		// Initialize the client
		const client = AgoraRTC.createClient({ mode: defaultState.mode, codec: defaultState.codec })
		setClient(client)
		try {

				// initializes the client with appId
				await client.init(appId);

				// joins a channel with a token, channel, user id
				const newUid = await client.join(token, channelName, uid);
				console.log("New Uid", newUid);
				// create a ne stream
				const stream = AgoraRTC.createStream({
					streamID: newUid,
					video: true,
					audio: true,
					screen: false
				});

				// stream.setVideoProfile('480p_4')

				// Initalize the stream
				await stream.init();

				// Publish the stream to the channel.
				await client.publish(stream);
		} catch(error) {
			console.log("Error: ", error);
		}
	}

	useEffect(() => {
		if(streamData.appId.length > 0) {
			loadStreams();
		}
	}, [streamData])


	const leave = async () => {
    try {
      if (localStream) {
        // Closes the local stream. This de-allocates the resources and turns off the camera light
        localStream.close();
        // unpublish the stream from the client
        agoraClient.unpublish(localStream);
      }
      // leave the channel
			await agoraClient.leave();

    } catch (err) {
      console.log(err)
    } finally {
    }
  };
	return (
		<div>
			<StreamArea remoteStreamList={remoteStreamList} localStream={localStream}/>
			<button onClick={leave}>leave</button>
		</div>
	)
}

