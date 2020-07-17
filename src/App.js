import React, { useState } from 'react';
import './App.css';
import axios from 'axios';
import AgoraRTM from 'agora-rtm-sdk';
import StreamArea from './components/streamArea';

function App() {
  const [authToken, setAuthToken] = useState('');
  const [name, setName] = useState('');
  const [roomId, setRoomId] = useState('');
  const [client, setClient] = useState(null);
  const [channel, setChannel] = useState(null);
  const [streamData, setStreamData] = useState({ channelName: "", uid: "", token: "", appId: ""})

  const getAuthToken = () => {
    axios.post('https://pally.build1.apyhi.com/api/auth/social-login', {
      email: name + "@gmail.com",
      name: name,
      dob: "09-02-1998"
    }).then((res) => {
      console.log(res.data.token)
      setAuthToken(res.data.token);
    });
  }

  const initClient = async () => {
    try {
      const client = AgoraRTM.createInstance('0853533292ef4cc585bb6bad9201e5db'); 
      await client.on('ConnectionStateChange', async (newState, reason) => {
        console.log('on connection state changed to ' + newState + ' reason: ' + reason);
      });

      await client.login({ token: '', uid: name })
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
          appId: '0853533292ef4cc585bb6bad9201e5db'
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
    axios.post('https://pally.build1.apyhi.com/api/matches?type=Global', {
      roomId: roomId
    },{
      headers: { Authorization: `Bearer ${authToken}` }
    }).then(async (res) => {
      console.log(res)
      console.log(res.data.messageCode)
      if(res.data.messageCode === 200) {
        console.log("200")
        const roomId = res.data.user.roomId;
        await leaveChannel();
        await client.logout()
        await client.login({ token: '', uid: name })
        const channel = await client.createChannel(roomId);
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
          uid: res.data.usertwoUniqueId,
          token: res.data.userTwoToken,
          appId: '0853533292ef4cc585bb6bad9201e5db'
        })
      } else if(res.data.messageCode === 201) {
        console.log("Waiting for 15 seconds")
      }
    })
  }

  return (
    <div>
      <h1>Pally Web</h1>
      Name: <input onChange={(e) => setName(e.target.value)} />
      RoomId: <input onChange={(e) => setRoomId(e.target.value)} />
      <div style={{color: "red", backgroundColor: authToken ? "green" : "red", height: "20px", width: "20px", marginBottom: "20px"}}></div>
      <button onClick={getAuthToken}>Login</button>
      <button onClick={initClient}>Init Client</button>
      <button onClick={match}>match</button>
      <StreamArea streamData={streamData} />
    </div>
  );
}

export default App;
