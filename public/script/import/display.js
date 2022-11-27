export function display() {
    function init() { }


    function exibirImport() {
        $("#divOptions").addClass("d-none");
        $("#divImport").removeClass("d-none");
    }

    function exibirList() {
        $("#divImport").addClass("d-none");
        $("#divList").removeClass("d-none");
    }

    function exibirFinal(){
        $("#divFinal").removeClass("d-none");
        $("#divList").addClass("d-none");
    }

    return {
        init,
        exibirImport,
        exibirList,
        exibirFinal
    }
}