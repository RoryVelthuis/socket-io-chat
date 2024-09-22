<script>
    import { onMount } from 'svelte';
    import { io } from 'socket.io-client';

    let socket;
    let connected = false;

    onMount(() => {
        socket = io('http://localhost:3000');
        socket.on('connect', () => {
            connected = true;
            console.log('Connected to server');
        });
    });
</script>

<div>
    {#if connected}
        <h1>Connected to server</h1>
    {:else}
        <h1>Connecting to server...</h1>
    {/if}
</div>