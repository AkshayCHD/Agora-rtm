import React, { useEffect, useState } from 'react'
import {Box} from "@material-ui/core"
import {styled} from "@material-ui/core/styles"
import AgoraRTC from 'agora-rtc-sdk'
// Declarative Stream Player for React
// Wrapped around native HTML video and audio tag with added Agora features
import StreamPlayer from "agora-stream-player";

export default function StreamArea({ streamData }) {
	const [localStream, setLocalStream] = useState(null);
	const [remoteStream, setRemoteStream] = useState(null);

	useEffect(() => {
		if(streamData.appId.length > 0) {
			loadStreams();
		}
	}, [streamData])

	const loadStreams = async () => {
		try {
			const client = AgoraRTC.createClient({mode: "rtc", codec: "h264"});
			const { channelName, uid, token, appId} = streamData;
			// Initialize the client
			await client.init(appId);
			await client.join(token, channelName, uid)
			const tempLocalStream = AgoraRTC.createStream({
				streamID: uid,
				audio: true,
				video: true,
				screen: false,
			});
			await tempLocalStream.init();			
			client.publish(tempLocalStream, function (err) {
				console.log("publish failed");
				console.error(err);
			});
			setLocalStream(localStream)
			client.on("stream-added", function (evt) {  
				var remoteStream = evt.stream;
				var id = remoteStream.getId();
				if (id !== uid) {
					client.subscribe(remoteStream, function (err) {
						console.log("stream subscribe failed", err);
					});
				}
				setRemoteStream(remoteStream)
				console.log("stream-added remote-uid: ", id);
			});
		} catch(error) {
			console.log("Error: ", error);
		}
	}

	return (
		<MainArea>
			{localStream && (
				<StreamPlayer stream={localStream} fit="contain" label="local" />
			)}
			{remoteStream && (
				<StreamPlayer stream={remoteStream} fit="contain" label="local" />
			)}
		</MainArea>
	)
}

const MainArea=styled(Box)(({theme})=>({
    background:"#aaadab",
    padding:"10px",
    display:"flex",
    justifyContent:"space-evenly",
    width:"80vw",
    height:"80vh",
    margin:"1px",
    marginLeft:"auto",
    marginRight:"auto",
    overflow:"scroll"
}))