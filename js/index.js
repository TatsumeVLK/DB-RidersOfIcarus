function mudarPagina(pagina) {
    var iframe = document.getElementById("wikiFrame");
    iframe.src = pagina;
}
function chamarMudarType(type) {
    console.log("Clicado")
    var iframe = document.getElementById("wikiFrame");

    iframe.contentWindow.mudarType(type);
    console.log(type)
}

function verPagina(pagina, type) {
    var iframe = document.getElementById("wikiFrame");

    if (!iframe.src.endsWith(pagina)) {
        mudarPagina(pagina)
        iframe.onload = function () {
            if (iframe.contentWindow.mudarType) {
                iframe.contentWindow.mudarType(type);
                console.log("Comando enviado ap?s carregamento:", type);
            } else {
                console.log("Erro: A fun??o mudarType n?o existe no iframe.");
            }
        }
    } else {
        iframe.contentWindow.mudarType(type);
    }
}