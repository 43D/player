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
            audio: "0"
        }
        setConfig(config);
    }


    function getConfig() {
        const json = getLocalStorage("config") as ConfigType | null;
        if (!json) {
            createConfig();
            return getConfig();
        }
        return json;
    }

    function setConfig(data: ConfigType) {
        setLocalStorage("config", data);
    }

    return {
        getConfig,
        setConfig
    }
}

export default StorageLocal