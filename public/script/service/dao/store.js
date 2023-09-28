class Store {
    constructor() {
    }

    getTheme() {
        return this.#getItem("theme");
    }

    setTheme(json = { "choose": "system" }) {
        this.#setItem("theme", json);
    }

    #setItem(key = "default", value = {}) {
        localStorage.setItem(key, JSON.stringify(value));
    }

    #getItem(key = "default") {
        const string = localStorage.getItem(key);
        if (string)
            return JSON.parse(string);

        return string;
    }
}

export default Store;