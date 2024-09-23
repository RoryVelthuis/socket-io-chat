<script>
    import { onMount } from 'svelte';
    import { io } from 'socket.io-client';
    import { messages, currentUsers } from '$lib/store';
    import UserList from '../components/UserList.svelte';

    let socket;
    let message = '';
    let recipient = '';

    let nameInput = ''
    let name =''

    function sendMessage(event) {
        // Send the message to the server
        socket.emit('chatMessage', message);
        message = '';
    }

    function sendDirectMessage(event) {
        // Send the message to the server
        socket.emit('privateMessage', { to: recipient, message: message });
        message = '';
    }

    function handleSend(event) {
        if(recipient === '') {
            sendMessage(event);
        } else {
            sendDirectMessage(event);
        }
    }

    function changeName(event) {
        socket.emit('changeName', nameInput);
    }

    onMount(() => {
        // Connect to the server
        socket = io('http://localhost:3000');

        // Retrieve user info from localStorage
        const storedName = localStorage.getItem('name');
        if (storedName) {
            name = storedName;
            socket.emit('changeName', name);
        }

        // Listen for the 'welcome' event from the server
        socket.on('welcome', (data) => {
            console.log(data.message);  // Outputs: "Welcome to the game!"
        });

        // Listen for the 'userList' event from the server
        socket.on('userList', (data) => {
            console.log('User list:', data);
            currentUsers.set(data);
        });

        // Listen for the 'nameChanged' event from the server
        socket.on('nameChanged', (data) => {
            name = data.name;
            localStorage.setItem('name', data.name);
            console.log(`Name changed to: ${data.name}`);
        });

        // Listen for the 'chat message' event from the server
        socket.on('chatMessage', (message) => {
            console.log(`New message from: [ ${message.playerId} ]: ${message.message}`);
            messages.update(messages => [...messages, { type: 'chat', playerId: message.playerId, message: message.message, timestamp: message.time } ]);
        });

        // Listen for the 'private message' event from the server
        socket.on('privateMessage', (message) => {
            console.log(`New private message from: [ ${message.playerId} ]: ${message.message}`);
            messages.update(messages => [...messages, { type: 'private', playerId: message.playerId, message: message.message, timestamp: message.time } ]);
        });
    });
</script>

<input type="text" class="set-name-input" bind:value={nameInput} placeholder="Set name">
<button class="set-name-button" on:click={changeName}>Set Name</button>


<div class="page">
    <div class="chat-interface">
        <!-- Chat box -->
        <div class="title-bar">
            <h2>Chat</h2>
            <div class="minimize-icon">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="white">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </div>
        </div>
        <!-- Display chat messages -->
        <div class="chat-box">
            {#each $messages as msg}
                <div>
                    {#if msg.type === 'chat'}
                        [ {msg.timestamp} ] [ {msg.playerId} ]: {msg.message}
                    {:else}
                        [ {msg.timestamp} ] [ {msg.playerId} ]: (private): {msg.message}
                    {/if}
                </div>
            {/each}
        </div>
        <!-- Chat Input -->
        <!-- <input class="id-input" type="text" bind:value={recipient} placeholder="Enter ID of recipient (direct message)" /> -->
        <div class="input-wrapper">
            <input class="chat-input" type="text" bind:value={message} placeholder="Enter your message" />
            <button on:click={handleSend}>Send</button>
        </div>
        <!-- <UserList /> -->
    </div>
</div>


<style>

    .page {
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    }

    .title-bar{
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        padding: 0px;
        background-color: rgba(0, 0, 0, 0.7);
        margin: 0;
        border-top: 1px solid #a8a8a8d5;
        height: 35px;;
    }

    h2 {
        font-size: 1.15rem;
        margin: 0;
        padding: 2px 5px;
        color: white;
        user-select: none; /* Disable text selection highlighting */

    }
    
    .minimize-icon {
        padding: 5px;
        height: 30px;
        width: 30px;
    }
    .minimize-icon:hover {
        background-color: rgba(179, 179, 179, 0.2)
    }

    /* Chat */
    .chat-interface {

        font-size: 0.9rem;
        position: fixed;
        bottom: 0;
        border: 1px solid black;
        background-color: rgba(0, 0, 0, 0.7);
        display: flex;
        flex-direction: column;
        width: 40%;
        height: 250px;

    }


    .chat-box {
        max-height: 200px;
        height: 100%;
        overflow-y: scroll;
        border: 1px solid #a8a8a8d5;
        padding: 10px;
        background-color: rgba(0, 0, 0, 0.7);
        color: white;

    }

    .input-wrapper {

        display: flex;
        flex-direction: row;
        padding: 0px;
        background-color: rgba(0, 0, 0, 0.4);
        margin: 0;
    }

    .chat-input {
        font-size: 0.9rem;
        width: 100%;
        padding: 2px 5px;
        font-size: 18px;
        background-color: rgba(0, 0, 0, 0.7);
        color: white;
        border: 1px solid #a8a8a8d5;

    }

    .chat-input::placeholder, .set-name-input::placeholder {
        color: rgba(255, 255, 255, 0.411);
    }


    button {
        padding: 10px 20px;
        font-size: 16px;
        background-color: rgba(31, 31, 31, 0.7);
        color: white;
    }
    button:hover {
        background-color: rgba(31, 31, 31, 0.9);
    }
</style>