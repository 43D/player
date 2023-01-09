
export function indexedDatabaseEvents() {
    function init() {

    }

    function getMusicStore() {
        return musicStore;
    }

    return {
        init,
        getMusicStore
    }
}

function musicStore() {
    function create() { }
    function read() { }
    function readComplete(){}

    return {
        create,
        read,
        readComplete
    }
}