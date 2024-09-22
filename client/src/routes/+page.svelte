<script>
    import { onMount } from 'svelte';
    import { io } from 'socket.io-client';
    import { messages } from '$lib/store';

    let socket;
    let message = '';
    let recipient = '';

    function sendMessage(event) {
        // Send the message to the server
        socket.emit('chatMessage', { message: message});
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

    onMount(() => {
        // Connect to the server
        socket = io('http://localhost:3000');

        // Listen for the 'welcome' event from the server
        socket.on('welcome', (data) => {
            console.log(data.message);  // Outputs: "Welcome to the game!"
        });

        // Listen for the 'chat message' event from the server
        socket.on('chatMessage', (message) => {
            console.log(`New message from: [ ${message.playerId} ]: ${message.message}`);
            messages.update(messages => [...messages, { type: 'chat', playerId: message.playerId, message: message.message, timestamp: message.timestamp } ]);
        });

        // Listen for the 'private message' event from the server
        socket.on('privateMessage', (message) => {
            console.log(`New private message from: [ ${message.playerId} ]: ${message.message}`);
            messages.update(messages => [...messages, { type: 'private', playerId: message.playerId, message: message.message, timestamp: message.message } ]);
        });
    });
</script>

<div>
    <!-- Chat box -->
    <h2>Chat</h2>
    <!-- Display chat messages -->
    <div class="chat-box">
        {#each $messages as msg}
            <div>
                {#if msg.type === 'chat'}
                    [ {msg.playerId} ]: {msg.message}
                {:else}
                    [ {msg.playerId} ] (private): {msg.message}
                {/if}
            </div>
        {/each}
    </div>
    <!-- Chat Input -->
    <input class="id-input" type="text" bind:value={recipient} placeholder="Enter ID of recipient (direct message)" />
    <input class="chat-input" type="text" bind:value={message} placeholder="Enter your message" />
    <button on:click={handleSend}>Send</button>

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