function MockStore() {
    return {
        getTheme: () => { return "mock!getTheme"; },
        setTheme: (json = {}) => { return "mock!setTheme"; }
    };
}

export default MockStore;