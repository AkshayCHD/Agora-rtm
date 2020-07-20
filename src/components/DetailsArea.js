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
	}, [])

  const logout = async () => {
		// authService.login()
		authService.logout()
		history.push('/login')
  }

  const initClient = async () => {
    try {
      const client = AgoraRTM.createInstance('ec567d18c6454a7eabb9de9dfda67bb2');
      await client.on('ConnectionStateChange', async (newState, reason) => {
        console.log('on connection state changed to ' + newState + ' reason: ' + reason);
      });

      await client.login({ token: '', uid: roomId })
      const channel = await client.createChannel(roomId);
      setClient(client);
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
          uid: jsonData.userOneUniqueId,
          token: jsonData.userOneToken,
          appId: 'ec567d18c6454a7eabb9de9dfda67bb2'
        })
      });
      setChannel(channel)
    } catch(error) {
      console.log("Error: ", error);
    }
  }

  const leaveChannel = async () => {
    if(channel) {
      await channel.leave();
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
        await client.logout()
        await client.login({ token: '', uid: roomId })
        const channel = await client.createChannel(userTwoRoomId);
        setClient(client);
        setChannel(channel);
        await channel.join();
        channel.on('ChannelMessage', (data, senderId) => {
          console.log("Message Recieved")
          console.log(data)
        });
        setChannel(channel)
        channel.sendMessage({ text: JSON.stringify(res.data) }).then(() => {
          console.log("Message sent successfully")
        }).catch(error => {
        /* Your code for handling events, such as a channel message-send failure. */
          console.log(error)
        });
        setStreamData({
          channelName: res.data.channel,
          uid: res.data.userTwoUniqueId,
          token: res.data.userTwoToken,
          appId: 'ec567d18c6454a7eabb9de9dfda67bb2'
        })
      } else if(res.data.messageCode === 201) {
        console.log("Waiting for 15 seconds")
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
