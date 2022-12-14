// import React, { useRef } from 'react'
// import {Link} from 'react-router-dom';
// import io from 'socket.io-client';
// import { useEffect, useState } from 'react';
// import { v4 as uuidv4 } from 'uuid';
// import Chat from './Chat';
// import CreateRoom from './CreateRoom';
// import video from '../vid.mp4'

// const socket = io.connect("http://localhost:5000");



// function Join() {
//     const [sendUsername, setSendUsername] = useState('');
//     const [isJoined, setIsJoined] = useState(false);
//     const [roomId, setRoomId] = useState('');
//     const [text, setText] = useState('');
//     const [file, setFile] = useState();
//     const [roomDetails, setRoomDetails] = useState('');
//     const [messages, setMessages] = useState([]);
//     const [joinRoomState, setJoinRoomState] = useState(false);
//     const [createRoomState, setCreateRoomState] = useState(false);
//     const [divState, setDivState] = useState(true);
//     const [media, setMedia] = useState();

//     const ref = useRef(); 

//     const handleVideoInput = (e) =>{ 
//         setMedia(e.target.files[0]);
//         console.log("now only", media)
//     }
//     const myfun = () =>{
//         alert("Downloading video");
//     }

//     const handleMedia = async() =>{
//         const reader = new FileReader();
//         reader.onload = (e) =>{
//             var contents = e.target.result;
//             var uint8Array  = new Uint8Array(contents);
//             var arrayBuffer = uint8Array.buffer;
//             shareFile(arrayBuffer);
//         }
//         reader.readAsArrayBuffer(media);
//     }

//     const shareFile = (arrayBuffer) =>{
//         const videoObject = {
//             roomId: roomId,
//             userId: socket.id,
//             sendUsername: sendUsername
//         }
//         //console.log(arrayBuffer)
//         socket.emit("uploadMedia", arrayBuffer, videoObject);
//         ref.current.value = "";
//     }

//     const handleJoin = () =>{
//         const rId = uuidv4();
//         socket.emit("join", {
//             roomId: rId,
//             userId: socket.id
//         });
//         setIsJoined(true);
//         setDivState(false);
//     }

//     const handleJoinFromRoomId = () =>{
//         socket.emit("join", {
//             roomId: roomDetails,
//             userId: socket.id,
//         });
//         setIsJoined(true);
//         setDivState(false);
//     }

//     const handleMessages = () =>{
//         socket.emit("send", {
//             text: text,
//             roomId: roomId,
//             userId: socket.id,
//             sendUsername: sendUsername
//         })
//         setText("")
//     }

//     const handleImage = async() =>{
//         const imageObject = {
//             roomId: roomId,
//             userId: socket.id,
//             body: file,
//             mimeType: file.type,
//             fileName: file.name,
//             sendUsername: sendUsername
//         }
//         const base64 = await convertBase64(file);
//         socket.emit("upload", base64, imageObject, (status) => {
//             console.log(status);
//         });
//     }

//     const convertBase64 = (file) =>{
//         return new Promise((resolve, reject) =>{
//             const fileReader = new FileReader();
//             fileReader.readAsDataURL(file);
//             fileReader.onload = () =>{
//                 resolve(fileReader.result);
//             };
//             fileReader.onerror = (err) => {
//                 reject(err);
//             }
//         })
//     }

//     const handleJoinRoomState = () =>{
//         setJoinRoomState(true);
//         setCreateRoomState(false);
//     }
//     const handleCreateRoomState = () =>{
//         setCreateRoomState(true);
//         setJoinRoomState(false);
//     }

//     useEffect(() => {
//         socket.on("getRoomId", (data) =>{
//             setRoomId(data);
//         });
//         socket.on("getMessage", (data) =>{
//             console.log(messages)
//             setMessages([...messages, {text: data.text, userId: data.userId, sendUsername: data.sendUsername}]);
//         });
//         socket.on("getImage", (data) =>{
//             console.log(data.base64);
//             setMessages([...messages, {base64: data.base64, userId: data.userId, sendUsername: data.sendUsername}]);
//         });
//         socket.on("getMedia", (data) =>{

//             var blob = new Blob([data.buffer]);
//             console.log("video data:", URL.createObjectURL(blob));
//             setMessages([...messages, {buffer: URL.createObjectURL(blob), userId: data.userId, sendUsername: data.sendUsername}]);
//             setMedia(URL.createObjectURL(blob))
//         })
//     })

    
//     return (
//         <div>
//             <h1>CHATTY</h1>
//             <h3>Click on Join button to create a RoomID and Join that room</h3>
//             {(divState) ?
//                 <>
//                 {(createRoomState) ?
//                 <>
//                     <input type="text" value={sendUsername} onChange={(e) => {setSendUsername(e.target.value)}} placeholder="username"/>
//                     <button onClick={handleJoin}>Create</button>
//                     <hr />
//                 </> : <><button onClick={handleCreateRoomState}>Create a room</button> </>
//             }
            
//             {(joinRoomState) ?
//                 <>
//                 <h3>Enter room details</h3>
//                 <input type="text" value={sendUsername} onChange={(e) => {setSendUsername(e.target.value)}} placeholder="username" />
//                 <input type="text" value={roomDetails} onChange={(e) => {setRoomDetails(e.target.value)}} placeholder="enter room ID"/>
//                 <button onClick={handleJoinFromRoomId}>Join</button>
//                 </> : <> <button onClick={handleJoinRoomState}>Join a room</button> </>
//             }
//                 </> : <></>
//             }

//             {(roomId) ? <h3>{socket.id} {sendUsername} joined {roomId}</h3> : <></>}
//             <hr />

//             {(isJoined) ? 
//                 <>
//                     <input type="text" value={text} onChange={(e) => {setText(e.target.value)}} placeholder="write here"/>
//                     <button onClick={handleMessages}>Send</button>
//                     <input type="file" onChange={(e) => {setFile(e.target.files[0])}} />
//                     <button onClick={handleImage}>Send Image</button>
//                     <hr />
//                     <h3>Video section</h3>
//                     <input type="file" onChange={handleVideoInput} onProgress={myfun} ref={ref}/>
//                     <button onClick={handleMedia}>Send Video</button>
//                 </> : <></>
//             }
            
//             {messages.map((payload, index) =>{
//                 return(
//                     <>
//                         {payload.userId == socket.id ? 
//                             <p key={index} style={{color: "red"}}>
//                                 <span>{payload.sendUsername}: </span>
//                                 <span>{payload.text}</span>
//                                 <img src={payload.base64}></img>
//                                 {(payload.buffer != null) ? <video src={payload.buffer} width="250" height="200" controls></video> : <></>}
//                             </p> :
//                             <p key={index}>
//                                 <span>{payload.sendUsername}: </span>
//                                 <span>{payload.text}</span>
//                                 <img src={payload.base64}></img>
//                                 {(payload.buffer != null) ? <video src={payload.buffer} width="250" height="200" controls></video> : <></>}
//                             </p>
//                         }
//                     </>
//                 )
//             })}
            
 
            
//         </div>
        
//     )
// }

// export default Join