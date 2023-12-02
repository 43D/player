import { ChangeEvent, useEffect, useState } from "react";
import ConfigType from "../../type/ConfigType";

type storeType = {
    store: {
        getConfig: () => ConfigType;
        setConfig: (data: ConfigType) => void;
    }
}

function ConfigMenu({ store }: storeType) {

    const [config, setConfig] = useState<ConfigType>(store.getConfig());
    const [deferredPrompt, setDeferredPrompt] = useState<any | null>(null);

    useEffect(() => {
        const handleBeforeInstallPrompt = (event: any) => {
            event.preventDefault();
            setDeferredPrompt(event);
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        };
    }, []);

    const pwa = () => {
        if (deferredPrompt) {
            deferredPrompt.prompt();

            deferredPrompt.userChoice.then((choiceResult: any) => {
                if (choiceResult.outcome === 'accepted') {
                    console.log('Usuário aceitou a instalação');
                } else {
                    console.log('Usuário recusou a instalação');
                }

                setDeferredPrompt(null);
            });
        }
    };


    const theme = (event: ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        config.theme = value;
        store.setConfig(config);
        setConfig(store.getConfig());
    }

    const qualityStreaming = (event: ChangeEvent<HTMLSelectElement>) => {
        const value = event.target.value;
        config.audio = value;
        store.setConfig(config);
        setConfig(store.getConfig());
    }

    const btnClear = () => {
        const dbName = 'SuperPlayer';
        const request = indexedDB.deleteDatabase(dbName);
        localStorage.clear();

        request.onsuccess = () => {
            console.log(`Banco de dados ${dbName} foi excluído com sucesso.`);
        };

        request.onerror = (event) => {
            console.error(`Erro ao excluir o banco de dados ${dbName}: ${event}`);
        };

        location.reload();
    }


    return (
        <div className="modal fade" id="configsModal" tabIndex={-1} aria-labelledby="configurações" aria-hidden="true">
            <div className="modal-dialog modal-lg">
                <div className="modal-content ">
                    <div className="modal-header">
                        <h1 className="modal-title fs-5" id="configurações">Configurações</h1>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        {deferredPrompt && (
                            <div>
                                <p>Instalar AMQ Player Music nesse dispositivo</p>
                                <button type="button" onClick={pwa} className="btn btn-outline-success pwa-install">Instalar</button>
                                <hr />
                            </div>
                        )}
                        <div>
                            <p>Escolha seu tema!!!</p>
                            <div>
                                <div className="form-check">
                                    <input className="form-check-input radioTheme" onChange={theme} type="radio" name="flexRadioOptionTheme"
                                        id="flexRadioOptionTheme1" value="system" checked={config.theme === 'system'} />
                                    <label className="form-check-label" htmlFor="flexRadioOptionTheme1">
                                        Padrão do Sistema Operacional
                                    </label>
                                </div>
                                <div className="form-check">
                                    <input className="form-check-input radioTheme" onChange={theme} type="radio" name="flexRadioOptionTheme"
                                        id="flexRadioOptionTheme2" value="light" checked={config.theme === 'light'} />
                                    <label className="form-check-label" htmlFor="flexRadioOptionTheme2">
                                        Light Mode
                                    </label>
                                </div>
                                <div className="form-check">
                                    <input className="form-check-input radioTheme" onChange={theme} type="radio" name="flexRadioOptionTheme"
                                        id="flexRadioOptionTheme3" value="dark" checked={config.theme === 'dark'} />
                                    <label className="form-check-label" htmlFor="flexRadioOptionTheme3">
                                        Dark Mode
                                    </label>
                                </div>
                            </div>
                        </div>
                        <hr />
                        <div>
                            <div>
                                <label htmlFor="select-quality" className="form-label">Streaming quality</label>
                                <select id="select-quality" value={config.audio} onChange={qualityStreaming} className="form-select" aria-label="Qualidade da media">
                                    <option value="0">Only audio</option>
                                    <option value="480">Video 480p</option>
                                    <option value="720">Video 720p</option>
                                </select>
                            </div>
                        </div>
                        <hr />
                        <div>
                            <div>
                                <p>Clean all Data</p>
                                <button onClick={btnClear} className="btn btn-outline-danger">Clean Data</button>
                            </div>
                            <hr />
                            <div>
                                <p>This application uses the <strong>AniSong Database</strong> as a base to function. Read more on their
                                    website if you
                                    want to support them by <a href="https://anisongdb.com/" target="_blank"
                                        rel="noopener noreferrer">accessing here.</a></p>
                            </div>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-outline-secondary" data-bs-dismiss="modal">Fechar</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ConfigMenu