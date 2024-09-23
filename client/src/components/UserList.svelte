<script>
    import { currentUsers } from '$lib/store';
</script>

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

<style>
    /* Current user List */
    .current-user-list {
        list-style-type: none;
        border: 1px solid #ccc;
        height: 200px;
        overflow-y: scroll;
        width: fit-content;
    }

    /* Heading row */
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

    /* List elements */
    .current-user{
        width: 100%;
        display: flex;
        flex-direction: row;
    }
    .current-user:hover {
        background-color: #ebebeb;
    }

    /* User ID Field (Header, Item) */
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

    /* User Name Field (Header, Item) */
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
</style>