function mudarPagina(pagina) {
    var iframe = document.getElementById("wikiFrame");
    iframe.src = pagina;
}
function chamarMudarType(type) {
    var iframe = document.getElementById("wikiFrame");

    iframe.contentWindow.mudarType(type);
}

function verPagina(pagina, type) {
    var iframe = document.getElementById("wikiFrame");

    if (!iframe.src.endsWith(pagina)) {
        mudarPagina(pagina)
        iframe.onload = function () {
            setTimeout(() => {
                if (iframe.contentWindow.mudarType) {
                    iframe.contentWindow.mudarType(type);
                } else {
                    console.log("Erro: Function mudarType not found.");
                }
            }, 1000);
        }
    } else {
        iframe.contentWindow.mudarType(type);
    }
}