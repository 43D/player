export function fileReader() {

    let json = {};

    async function getFileJson(file) {
        if (file.type == 'application/json') {
            if (file) {
                let b = await new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.readAsText(file);
                    reader.onload = res => {
                        let resultado = res.target.result;
                        resolve(resultado);
                    };
                }).then(resultado =>  {
                    json = JSON.parse(resultado);
                    return json;
                });
                return b;
            }
        }
    }

    function getJson(){ return json;}

    return {
        getFileJson,
        getJson
    }

}