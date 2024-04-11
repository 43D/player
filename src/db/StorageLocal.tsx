import ConfigType from "../type/ConfigType";

function StorageLocal() {
    function getLocalStorage(key: string) {
        const value = localStorage.getItem(key);
        if (value)
            return getJson(value);
        return value;
    }

    function setLocalStorage(key: string, value: any) {
        localStorage.setItem(key, getString(value));
    }

    function getString(value: any) {
        return JSON.stringify(value);
    }

    function getJson(value: string) {
        return JSON.parse(value);
    }

    function createConfig() {
        const config = {
            theme: "dark",
            audio: "0",
            loop: true,
            playIndex: 0,
            playNowId: "0",
            played: false,
            streaming: "0",
            volume: 1,
            server: "NA1",
            current_link: ""
        }
        setConfig(config);
    }

    function createQueue() {
        const queue: string[] = [];
        setQueue(queue);
    }

    function getConfig() {
        const json = getLocalStorage("config") as ConfigType | null;
        if (!json) {
            createConfig();
            return getConfig();
        }
        if(!json.server){
            json.server = "NA1"
            setConfig(json);
        }
        if(!json.current_link){
            json.current_link = ""
            setConfig(json);
        }
        return json;
    }

    function setConfig(data: ConfigType) {
        setLocalStorage("config", data);
    }

    function setQueue(data: string[]) {
        setLocalStorage("queue", data);
        let json = getConfig();
        json.playIndex = 0;
        json.playNowId = data[0];
        setConfig(json);
    }

    function addQueue(data: string) {
        let json = getLocalStorage("queue") as string[] | null;
        if (!json) {
            createQueue();
        } else {
            if (!json?.includes(data)) {
                json?.push(data);
                setQueue(json);
            }
        }
    }

    function getQueue() {
        const json = getLocalStorage("queue") as string[] | null;
        if (!json) {
            createQueue();
            return getQueue();
        }
        return json;
    }

    return {
        getConfig,
        setConfig,
        setQueue,
        addQueue,
        getQueue
    }
}

export default StorageLocal