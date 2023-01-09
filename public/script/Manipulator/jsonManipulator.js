export function jsonManipulator(){
    async function getJs(url) {
        return await getJsonPromise(url).then(resultado => {
            return resultado;
        });
    }
    function getJsonPromise(url) {
        return new Promise((resolve, reject) => {
            let resultado = $.getJSON(url);
            resolve(resultado);
        });
    }
    return {
        getJs
    }
}