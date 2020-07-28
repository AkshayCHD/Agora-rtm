import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AgoraRTM from 'agora-rtm-sdk';
import StreamManager from './StreamManager';
import { authService } from '../helpers/services/auth';
import { history } from '../helpers/services/history';
import { randomService } from '../helpers/services/random';

function DetailsArea() {
  const [roomId, setRoomId] = useState('');
  const [client, setClient] = useState(null);
  const [channel, setChannel] = useState(null);
  const [streamData, setStreamData] = useState({ channelName: "", uid: "", token: "", appId: ""})

	useEffect(() => {
		setRoomId(randomService.generateRoomId(10))
		console.log(JSON.parse(localStorage.getItem('user')))
	}, [])

  const logout = async () => {
		// authService.login()
		authService.logout()
		history.push('/login')
  }

  const initClient = async () => {
    try {
      const client = AgoraRTM.createInstance('3e4d000b0a5e4bb59cc852ff4684d734');
      await client.on('ConnectionStateChange', async (newState, reason) => {
        console.log('on connection state changed to ' + newState + ' reason: ' + reason);
      });
			setClient(client);

			console.log(JSON.parse(localStorage.getItem('user')).user._id)
    } catch(error) {
      console.log("Error: ", error);
    }
  }

  const leaveChannel = async () => {
    if(channel) {
      await channel.leave();
    }
  }

	const getSendableData = (data) => {
		return {
			type: "join_room",
			token: data.userTwoToken,
			uid: data.userTwoUniqueId.toString(),
			tokenRtm: data.tokenRtm,
			channel: data.channel,
			callerid: "5ed915be9ad2f062dd359af6",
			callerName: "AKsharma",
			callerCountry: "",
			callerLove: 0,
			callerProfilePic: "",
			callerUsername: "aksharma"
		}

	}

  const match = () => {
		console.log(authService.getAuthHeader())
    axios.post('https://pally.build1.apyhi.com/api/matches?type=Global', {
      roomId: roomId
    }, {
      headers: authService.getAuthHeader()
    }).then(async (res) => {
      console.log(res)
      console.log(res.data.messageCode)
      if(res.data.messageCode === 200) {
        console.log("200")
        const userTwoRoomId = res.data.user.roomId;
        await leaveChannel();
				// await client.logout()

				const userOneUniqueId = parseInt(String(res.data.user._id).match(/\d/g).join("").slice(10));
				await client.login({ token: null, uid: roomId })
        const channel = await client.createChannel(userTwoRoomId);
        setClient(client);
        setChannel(channel);
        await channel.join();
        channel.on('ChannelMessage', (data, senderId) => {
          console.log("Message Recieved")
          console.log(data)
        });
				setChannel(channel)
				const sendableData = getSendableData(res.data);
				console.log(sendableData)
				console.log(JSON.stringify(sendableData))
        channel.sendMessage({ text: JSON.stringify(sendableData) }).then(() => {
          console.log("Message sent successfully")
        }).catch(error => {
        /* Your code for handling events, such as a channel message-send failure. */
          console.log(error)
        });
        setStreamData({
          channelName: res.data.channel,
          uid: res.data.userOneUniqueId,
          token: res.data.userOneToken,
          appId: '3e4d000b0a5e4bb59cc852ff4684d734'
        })
      } else if(res.data.messageCode === 201) {
				console.log("Waiting for 15 seconds")
				console.log(res.data.tokenRtm)
				await leaveChannel();
				const userOneUniqueId = parseInt(String(JSON.parse(localStorage.getItem('user')).user._id).match(/\d/g).join("").slice(10));
				await client.login({ token: "", uid: roomId })
				const channel = await client.createChannel(roomId);

				setChannel(channel);
				// await joinChannel(roomId, client, channel);
				await channel.join();
				channel.on('ChannelMessage', (data, senderId) => {
					console.log("Message Recieved")
					console.log(data)
					console.log(JSON.parse(data.text))
					const jsonData = JSON.parse(data.text);
					setStreamData({
						channelName: jsonData.channel,
						uid: jsonData.userTwoUniqueId,
						token: jsonData.userTwoToken,
						appId: '3e4d000b0a5e4bb59cc852ff4684d734'
					})
				});
				setChannel(channel)
      }
    })
  }

  return (
    <div>
      <h1>Pally Web</h1>
      <button onClick={logout}>Logout</button>
      <button onClick={initClient}>Init Client</button>
      <button onClick={match}>match</button>
      <StreamManager streamData={streamData} />
    </div>
  );
}

export default DetailsArea;
