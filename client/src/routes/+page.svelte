<script>
    import { onMount } from 'svelte';
    import { io } from 'socket.io-client';
    import { messages, currentUsers } from '$lib/store';

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

<div>
    <input type="text" class="set-name-input" bind:value={nameInput} placeholder="Set name">
    <button class="set-name-button" on:click={changeName}>Set Name</button>
    <!-- Chat box -->
    <h2>Chat</h2>
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
    <input class="id-input" type="text" bind:value={recipient} placeholder="Enter ID of recipient (direct message)" />
    <input class="chat-input" type="text" bind:value={message} placeholder="Enter your message" />
    <button on:click={handleSend}>Send</button>

    <h2>Current Users</h2>
    <ul class="current-user-list">
        <li class="current-user-header">
            <div class="user-id-header">ID</div>
            <div class="user-name-header">Name</div>
        </li>
        {#each $currentUsers as user}
            <li class="current-user">
                <div class="user-id">[ {user.id} ]</div>
                <div class="user-name">{user.name}</div>
            </li>
        {/each}
    </ul>

</div>

<style>
    /* User List */
    .current-user-list {
        list-style-type: none;
        border: 1px solid #ccc;
        height: 200px;
        overflow-y: scroll;
        width: fit-content;
    }

    .current-user-header {
        font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        display: flex;
        flex-direction: row;
        padding: 5px 0px;
        background-color: #f0f0f0;
        font-weight: bold;
        border-bottom: 1px solid #ccc;
        cursor: default;
    }

    .current-user{
        width: 100%;
        display: flex;
        flex-direction: row;
    }
    .current-user:hover {
        background-color: #ebebeb;
    }

    .user-id-header {
        font-family: 'Courier New', Courier, monospace; /* Use a monospaced font */
        min-width: 26ch; /* Fixed width to fit up to 16 characters */
        padding: 0px 10px 0px 5px;
        font-weight: bold;
        color: #000000;
        border-right: 1px solid #ccc;
    }
    .user-id {
        font-family: 'Courier New', Courier, monospace; /* Use a monospaced font */
        min-width: 26ch; /* Fixed width to fit up to 16 characters */
        padding: 0px 10px 0px 5px;
        font-weight: bold;
        color: #000000;
        border-right: 1px solid #ccc;
    }
    .user-id:hover {
        background-color: #dfdfdf;
    }


    .user-name-header {
        padding: 0px 10px;
        min-width: 22.5ch;
        border-right: 1px solid #ccc;
    }
    .user-name {
        min-width: 24ch; /* Fixed width to fit up to 16 characters */
        padding: 0px 10px;
        border-right: 1px solid #ccc;
    }
    .user-name:hover {
        background-color: #dfdfdf;
        cursor: default;
    }

    /* Chat */
    .chat-box {
        height: 200px;
        overflow-y: scroll;
        border: 1px solid #ccc;
        padding: 10px;
        margin-bottom: 10px;
    }

    input[type="text"] {
        width: 60%;
        padding: 10px;
        font-size: 18px;
        margin-right: 10px;
    }

    button {
        padding: 10px 20px;
        font-size: 16px;
    }
</style>