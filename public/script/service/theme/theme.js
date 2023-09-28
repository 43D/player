import MockStore from "../../../mock/service/dao/mockStore.js";

class Theme {
    constructor(store = MockStore()) {
        this.store = store
    }

    init() {
        this.#eventTheme();
        this.#themeChange();
        this.#setRadioCheck();
    }

    #setRadioCheck() {
        const valor = this.store.getTheme();
        $('input[name="flexRadioOptionTheme"][value="' + valor.choose + '"]').prop('checked', true);
    }

    #eventTheme() {
        window.matchMedia('(prefers-color-scheme: dark)')
            .addEventListener('change', (e) => this.#themeChange())

        $('input[name="flexRadioOptionTheme"]').change((e) => this.#newTheme());
    }

    #newTheme() {
        const theme = $('input[name="flexRadioOptionTheme"]:checked').val();
        this.store.setTheme({ "choose": theme });
        this.#themeChange();
    }

    #themeChange() {
        let theme = this.store.getTheme();
        if (theme == null) {
            this.#createThemeStrore()
            theme = this.store.getTheme();
        }

        if (theme.choose == "system")
            this.#themeSystem()
        else
            this.#setTheme(theme.choose)
    }

    #themeSystem() {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches)
            $("html").attr("data-bs-theme", "dark");
        else
            $("html").attr("data-bs-theme", "light");
    }

    #setTheme(theme = "dark") {
        $("html").attr("data-bs-theme", theme);
    }
    #createThemeStrore() {
        this.store.setTheme();
    }
}

export default Theme;