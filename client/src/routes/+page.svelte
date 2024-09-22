<script>
    import { onMount } from 'svelte';
    import { io } from 'socket.io-client';
    import { messages } from '$lib/store';

    let socket;
    let message = '';

    function sendMessage(event) {
        // Send the message to the server
        socket.emit('chatMessage', { message: message});
        message = '';
    }

    onMount(() => {
        // Connect to the server
        socket = io('http://localhost:3000');

        // Listen for the 'welcome' event from the server
        socket.on('welcome', (data) => {
            console.log(data.message);  // Outputs: "Welcome to the game!"
        });

        // Listen for the 'chat message' event from the server
        socket.on('chatMessage', (data) => {
            console.log(`New message from: [ ${data.playerId} ]: ${data.message}`);
            messages.update(messages => [...messages, { playerId: data.playerId, message: data.message } ]);
        });
    });
</script>

<div>
    <!-- Chat box -->
    <h2>Chat</h2>
    <!-- Display chat messages -->
    <div class="chat-box">
        {#each $messages as msg}
            <div>[ {msg.playerId} ]: {msg.message}</div>
        {/each}
    </div>
    <!-- Chat Input -->
    <input type="text" bind:value={message} placeholder="Enter your message" />
    <button on:click={sendMessage}>Send</button>

</div>

<style>
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