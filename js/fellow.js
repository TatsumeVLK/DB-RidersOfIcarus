// --------- //
// Variables //
// --------- //
const buttonItems = [
    "../database/button/ItemData_Consume.csv",
    "../database/button/ItemData_SealedFellow.csv"
]
const buttonIcons = [
    "../database/itemres/itemres_consume.csv",
    "../database/itemres/itemres_sealedfellow.csv"
]

const itemInformations = [
    "../database/itemdata/ItemData_Consume.csv",
    "../database/itemdata/ItemData_SealedFellow.csv"
]

const itemTranslations = [
    "../database/translate/localstringdata_item_consume.csv",
    "../database/translate/localstringdata_item_consume_02.csv",
    "../database/translate/localstringdata_item_consume_03.csv",
    "../database/translate/localstringdata_item_sealedfellow.csv",
    "../database/translate/LocalStringData_Item_SealedFellow_01.csv"
]

const effectsTranslation = "../database/custom/minhatraducao.csv"

let buttonType = "so"
let itemDefault = "SF2_101_IC_0114";

let buttonIiconsObj = {}
let buttonItemsObj = {}
let itemInformationsObj = {}
let itemIconsObj = {}
let mapaDeIcones = {};
let itemTranslationsObj = {}
let mapaDeTraducoes = {}
let effectObj = {}
let itemSetObj = {};
let setNameObj = {}

let codigoOriginal;

function defaultItem(id) {
    let item = itemInformationsObj[id];

    document.getElementById("codigoItem").value = Object.values(item).join(";");
    codigoOriginal = Object.values(item).join(";");
}
// ------------------- //
// Carrega os Arquivos //
// ------------------- //
async function carregarItems() {
    const promises = itemInformations.map(async (file) => {
        try {
            const response = await fetch(file + "?nocache=" + new Date().getTime());
            const blob = await response.blob();
            const reader = new FileReader();

            return new Promise((resolve, reject) => {
                reader.onload = function () {
                    try {
                        const text = new TextDecoder("euc-kr").decode(reader.result);

                        Papa.parse(text, {
                            delimiter: ";",
                            header: true,
                            skipEmptyLines: true,
                            complete: function (parsed) {
                                parsed.data.forEach(item => {
                                    if (item.t_id) {
                                        let id = item.t_id.trim();
                                        itemInformationsObj[id] = item;
                                    } else {
                                        console.warn(`Arquivo ${file}: Linha sem t_id`, item);
                                    }
                                });
                                resolve();
                            },
                            error: function (error) {
                                console.error(`Erro ao processar ${file}:`, error);
                                reject(error);
                            }
                        });
                    } catch (error) {
                        console.error(`Erro na leitura do arquivo ${file}:`, error);
                        reject(error);
                    }
                };

                reader.readAsArrayBuffer(blob);
            });
        } catch (error) {
            console.error(`Erro ao carregar o arquivo ${file}:`, error);
        }
    });

    await Promise.all(promises);
}
async function carregarTraducoes() {
    const promessas = itemTranslations.map(arquivo =>
        fetch(arquivo + "?nocache=" + new Date().getTime())
            .then(response => response.text())
            .then(csvText => {
                let linhasCorrigidas = csvText.replace(/\n(?=[^\^])/g, " ")
                return Papa.parse(linhasCorrigidas, { header: true, skipEmptyLines: true }).data;
            })
            .then(dados => {
                dados.forEach(row => {
                    if (!row.t_key || !row.t_korean || !row.t_key.startsWith("^")) {
                        return;
                    }

                    let id = row.t_key.replace(/^(\^)|(\^$)/g, "");
                    let textoTraduzido = row.t_korean.replace(/\^/g, "").trim();

                    if (id.endsWith("_Name") || id.endsWith("_name")) {
                        id = id.replace(/_Name/gi, "");
                        mapaDeTraducoes[id] = { nome: textoTraduzido };
                    } else if (id.endsWith("_Description")) {
                        id = id.replace("_Description", "");
                        if (!mapaDeTraducoes[id]) mapaDeTraducoes[id] = {};
                        mapaDeTraducoes[id].descricao = textoTraduzido.replace(/\^/g, "").trim()
                    }
                })
            })
            .catch(error => console.error(`Error in ${arquivo}:`, error))
    );

    await Promise.all(promessas);
}
async function carregarEffectTranslations() {
    if (Object.keys(effectObj).length > 0) {
        return;
    }
    const response = await fetch(effectsTranslation + "?nocache=" + new Date().getTime());
    let text = await response.text();
    let parsed = Papa.parse(text, { header: true, skipEmptyLines: true, delimiter: "," });

    parsed.data.forEach(row => {
        if (row.t_key && row.t_eng) {
            let key = row.t_key.trim();
            effectObj[key] = row.t_eng.trim();
        }
    });
}
async function loadButton() {
    const container = document.getElementById("botaoContainer");
    container.innerHTML = "";

    let lines = [];

    for (let file of buttonIcons) {
        try {
            const responseI = await fetch(file + "?nocache=" + new Date().getTime());
            const textI = await responseI.text();
            const linesI = textI.trim().split(/\r?\n/);
    
            linesI.forEach(lineI => {
                const [idI, iconI] = lineI.split(';');
                mapaDeIcones[idI.trim()] = iconI.trim();
            });
        } catch (error) {
            console.error("Erro ao carregar o arquivo:", file, error);
        }
    }

    for (const file of buttonItems) {
        const response = await fetch(file + "?nocache=" + new Date().getTime());
        const text = await response.text();
        const fileLines = text.trim().split(/\r?\n/);
        fileLines.shift();
        lines.push(...fileLines);
    }

    lines.forEach((line) => {
        const [id, level, rarity, type] = line.split(';');
        let leveli = parseInt(level);
        
        if (type !== buttonType) return;

        const button = document.createElement("button");
        button.className = "item-button";
        button.setAttribute("data-index", id);
        button.setAttribute("onclick", `mudarItem('${id}')`);

        const img = document.createElement("img");
        img.className = "item-img";
        let nada = parseInt(rarity)
        
        switch (nada) {
            case "legendary+":
                rarity = "Legendaryp"
                img.className = "img"+rarity;
                break;
            default:
                img.className = "img"+rarity;
                break;
        }
        let iconFileName = mapaDeIcones[id] || "favicon";
        switch (buttonType) {
            case "so":
                img.src = `../imgs/so/${iconFileName}.png`
                img.onerror = function() { img.src = `../imgs/favicon.png`; }
                break;
        }

        let imgTest = new Image();
        imgTest.src = img.src;
        imgTest.onload = function () {
            img.src = imgTest.src; 
        };
        imgTest.onerror = function () {
            img.src = `../imgs/favicon.png`;
        };

        const div = document.createElement("div");
        const itemName = document.createElement("p");
        itemName.className = `espaco itemnomebutton ${rarity}`;

        const itemDesc = document.createElement("p");
        itemDesc.className = "espaco itemdescbutton";
        itemDesc.textContent = `ID: ${id} | Level: ${leveli}`;

        div.appendChild(itemName);
        div.appendChild(itemDesc);
        button.appendChild(img);
        button.appendChild(div);
        container.appendChild(button);
    });
    
    if (!mapaDeTraducoes || Object.keys(mapaDeTraducoes).length === 0) {
        console.warn("mapaDeTraducoes ainda nao carregado.");
        return;
    }

    document.querySelectorAll(".item-button").forEach(button => {
        let itemID = button.getAttribute("data-index"); 
        let itemTraduzido = mapaDeTraducoes[itemID];

        if (itemTraduzido) {
            button.querySelector(".itemnomebutton").textContent = itemTraduzido.nome || itemID;
        } else {
            button.querySelector(".itemnomebutton").textContent = itemID;
        }
    });
}
function exibirLinhaOriginal(id) {
    let nomeTraduzido = mapaDeTraducoes[id]?.nome || "";

    if (!nomeTraduzido) {
        nomeTraduzido = "";
    }

    let linhaOriginal = `^${id}_Name^,^${nomeTraduzido}^`;

    document.getElementById("nomedoItemtraduzido").value = linhaOriginal;
}
function formatDescText(text) {
    const patterns = [
        { regex: /<UI_P>(.*?)<\/UI_P>/g, replacement: '<span class="lime" style="display: inline-block;">$1</span>' },
        { regex: /<R_Y>(.*?)<\/R_Y>/g, replacement: '<span class="red" style="display: inline-block;">$1</span>' },
        { regex: /<O_Y>(.*?)<\/O_Y>/g, replacement: '<span class="orange" style="display: inline-block;">$1</span>' }
    ];

    patterns.forEach(({ regex, replacement }) => {
        text = text.replace(regex, replacement);
    });

    return text;
}
function mudarNomeDesc(id) {    
    let itemTraduzido = mapaDeTraducoes[id] || {}
    let nomeItem = itemTraduzido.nome || id
    let descricaoItem = itemTraduzido.descricao || "Description not found"

    document.getElementById("nomedoItemtraduzido").innerText = exibirLinhaOriginal(id);
    document.getElementById("itemNome").innerText = nomeItem;

    if (descricaoItem === "Description not found") {
        document.getElementById("description").style.display = "none";
        document.getElementById("itemdescription").style.display = "none";
    } else {
        document.getElementById("description").style.display = "block";
        document.getElementById("itemdescription").style.display = "block";
        document.getElementById("itemdescription").innerHTML = formatDescText(descricaoItem)
    }
}
function mudarCor(rarity, rarityPlus) {
    const coresRaridade = {
        1: "#ffffff", // Branco (Comum)
        2: "#00aaFF", // Azul (Elite)
        3: "#ffcc00", // Dourado (Heroico)
        4: "#ff00ff", // Roxo (Lendario)
        5: "#ff00ff", // Roxo (Lendario)
        6: "#ffaa55",  // laranja (Unique)
        7: "#ff1155",  // Vermelho (Mitico)
        8: "#ff00ff" // Roxo (Lendario)
    };

    let cor = coresRaridade[parseInt(rarity)] || "#ffffff";

    let rarityT;
    switch (parseInt(rarity)) {
        case 1:
            rarityT = "Common";
            break;
        case 2:
            rarityT = "Elite";
            break;
        case 3:
            rarityT = "Heroic";
            break;
        case 4:
            rarityT = "Legendary";
            break;
        case 5:
            rarityT = "Legendary+";
            break;
        case 6:
            rarityT = "Unique";
            break;
        case 7:
            rarityT = "Mythical";
            break;
        case 8:
            rarityT = "Legendary++";
            break;
        default:
            rarityT = rarity;
    }
    document.getElementById("itemRaridade").innerText = rarityT;
    if (rarityPlus == 1) {
        document.getElementById("itemRaridade").innerText += "+"
    }
    document.getElementById("itemRaridade").style.color = cor;
    document.getElementById("itemNome").style.color = cor;
}
function mudarLevel(level, maxlevel) {
    if (maxlevel > 0) {
        document.getElementById("maxlevel").style.display = "inline";
        document.getElementById("maxlevel").innerText = " ~ " + parseInt(maxlevel);
    } else {
        document.getElementById("maxlevel").style.display = "none";
    }
    document.getElementById("itemNivel").innerText = parseInt(level);
}
function mudarBinding(binding) {
    

    let bindingT;
    switch (binding) {
        case "equip":
            bindingT = "Bind on Equip";
            break;
        case "get":
            bindingT = "Bind on Pickup";
            break;
        case "none":
            bindingT = "";
            break;
        default:
            bindingT = binding;
    }
    document.getElementById("itemBindtype").innerText = bindingT;
}
function mudarTraitPower(traitPower) {
    document.getElementById("traitPower").innerText = parseInt(traitPower);
}
function mudarClasse(usedClass) {
    
    function checkClasses() {
        let listClass = [];

        if (usedClass.includes("GD")) listClass.push("Guardian");
        if (usedClass.includes("WR")) listClass.push("Berserk");
        if (usedClass.includes("TF")) listClass.push("Assassin");
        if (usedClass.includes("AC")) listClass.push("Ranger");
        if (usedClass.includes("WZ")) listClass.push("Wizard");
        if (usedClass.includes("PR")) listClass.push("Priest");
        if (usedClass.includes("DO")) listClass.push("Idol");
        if (usedClass.includes("MG")) listClass.push("Magician");

        if (listClass.length === 8) {
            return "All Classes";
        } else if (listClass.length === 1) {
            return listClass.join(" ") + " Exclusive";
        } else if (listClass.length > 1 && listClass.length < 8) {
            return listClass.join(" ") + " Can Equip";
        }

        return listClass.length > 0 ? listClass.join(" ") : "Error";
    }
    
    document.getElementById("itemclasses").innerText = checkClasses();
}
let nivelAtual = 1;
async function processarEfeitosDoItemacc(efeito1, efeito2, efeito3, efeito4) {
    document.getElementById("temefeitoserandomeffects").style = "none"
    let efeitos = [efeito1, efeito2, efeito3, efeito4];

    if (efeito1 === "*" && efeito2 === "*" && efeito3 === "*" && efeito4 === "*") {
        document.getElementById("temefeitoserandomeffects").style.display = "none"
    }

    efeitos.forEach((efeito, index) => {
        let elementoEfeito = document.getElementById(`itemEfeito${index + 1}`);

        let efeitoFormatado = efeito.replace(/[()]/g, "").split(",");
        let termoOriginal = efeitoFormatado[0].trim();
        let valorNumerico1 = efeitoFormatado[1] ? efeitoFormatado[1].trim() : null;
        let valorNumerico2 = efeitoFormatado[2] ? efeitoFormatado[2].trim() : null;
        let valorNumerico3 = efeitoFormatado[3] ? efeitoFormatado[3].trim() : null;

        if (!efeito || efeito.trim() === "*" || valorNumerico2 == 0) {
            elementoEfeito.parentElement.style.display = "none";
            return;
        }

        let simbolo = termoOriginal.slice(-1);
        let termoBase = (simbolo === "%" || simbolo === "+" || simbolo === "*") ? termoOriginal.slice(0, -1).trim() : termoOriginal.trim();

        let termoTraduzido = effectObj[termoBase] || termoBase;
        if (termoTraduzido === termoBase) {
            console.log("Effect not Found in item: " + termoBase)
        }
        if (termoTraduzido === "Bleed Defense" ||
            termoTraduzido === "Magic Critical Damage" ||
            termoTraduzido === "PvP Resistance" ||
            termoTraduzido === "Physic Crit Rate"||
            termoTraduzido === "Magic Crit Rate" ||
            termoTraduzido === "Money Drop Increase" ||
            termoTraduzido === "Weapon Critical Damage") {
            simbolo = "%"
        } else if (termoTraduzido === "Dropped Money Total") {
            simbolo = "+"
        }
        
        let efeitoFinal = termoTraduzido;
        switch (nivelAtual) {
            case 1:
                if (valorNumerico1 !== null && valorNumerico1 != 0) {
                    elementoEfeito.parentElement.style.display = "block";
                    document.getElementById("itemEfeito1").style.display = "none"
                    document.getElementById("itemEfeito2").style.display = "inline-block"
                    document.getElementById("itemEfeito3").style.display = "inline-block"
                    document.getElementById("itemEfeito4").style.display = "inline-block"
                    document.getElementById("plus151").style.display = "none"
                    document.getElementById("plus152").style.display = "none"
                    document.getElementById("plus153").style.display = "none"
                    document.getElementById("plus154").style.display = "none"
                    let numero1 = parseInt(valorNumerico1);
                    let numero2 = parseInt(valorNumerico2);
                    if (simbolo === "%" && numero1 > 0) {
                        efeitoFinal += ` ${numero1}% ~ ${numero2}%`;
                    } else if (simbolo === "%" && numero1 < 0) {
                        efeitoFinal += ` ${numero1}% ~ ${numero2}%`;
                    } else if (simbolo === "+") {
                        efeitoFinal += numero1 > 0 ? ` ${numero1} ~ ${numero2}` : `${numero1} ~ ${numero2}`;
                    } else {
                        efeitoFinal += ` ${numero1}`;
                    }
                }
                break;
            case 2:
                if (valorNumerico1 !== null && valorNumerico1 != 0) {
                    elementoEfeito.parentElement.style.display = "block";
                    document.getElementById("itemEfeito1").style.display = "inline-block"
                    document.getElementById("itemEfeito2").style.display = "inline-block"
                    document.getElementById("itemEfeito3").style.display = "inline-block"
                    document.getElementById("itemEfeito4").style.display = "inline-block"
                    document.getElementById("plus151").style.display = "none"
                    document.getElementById("plus152").style.display = "none"
                    document.getElementById("plus153").style.display = "none"
                    document.getElementById("plus154").style.display = "none"
                    let numero1 = parseInt(valorNumerico1);
                    let numero2 = parseInt(valorNumerico2);
                    let numero3 = parseInt(valorNumerico3);
                    if (!valorNumerico3) {
                        if (simbolo === "%" && numero1 > 0) {
                            efeitoFinal += ` ${numero1}% ~ ${numero2}%`;
                        } else if (simbolo === "%" && numero1 < 0) {
                            efeitoFinal += ` ${numero1}% ~ ${numero2}%`;
                        } else if (simbolo === "+") {
                            efeitoFinal += numero1 > 0 ? ` ${numero1} ~ ${numero2}` : `${numero1} ~ ${numero2}`;
                        } else {
                            efeitoFinal += ` ${numero1}`;
                        }
                    } else {
                        let numero13 = numero1 + numero3
                        let numero23 = numero2 + numero3
                        if (simbolo === "%" && numero13 > 0) {
                            efeitoFinal += ` ${numero13}% ~ ${numero23}%`;
                        } else if (simbolo === "%" && numero1 < 0) {
                            efeitoFinal += ` ${numero13}% ~ ${numero23}%`;
                        } else if (simbolo === "+") {
                            efeitoFinal += numero1 > 0 ? ` ${numero13} ~ ${numero23}` : `${numero13} ~ ${numero23}`;
                        } else {
                            efeitoFinal += ` ${numero1}`;
                        }
                    }
                }
                break;
            case 3:
                if (valorNumerico1 !== null && valorNumerico1 != 0) {
                    elementoEfeito.parentElement.style.display = "block";
                    document.getElementById("itemEfeito1").style.display = "inline-block"
                    document.getElementById("itemEfeito2").style.display = "inline-block"
                    document.getElementById("itemEfeito3").style.display = "inline-block"
                    document.getElementById("itemEfeito4").style.display = "inline-block"
                    document.getElementById("plus151").style.display = "inline-block"
                    document.getElementById("plus152").style.display = "inline-block"
                    document.getElementById("plus153").style.display = "inline-block"
                    document.getElementById("plus154").style.display = "inline-block"
                    let numero1 = parseInt(valorNumerico1);
                    let numero2 = parseInt(valorNumerico2);
                    let numero3 = parseInt(valorNumerico3);
                    if (!valorNumerico3) {
                        let numero13 = numero1 + (numero1 * 0.15)
                        let numero23 = numero2 + (numero2 * 0.15)
                        let numero13r = parseInt(numero13)
                        let numero23r = parseInt(numero23)
                        if (simbolo === "%" && numero1 > 0) {
                            efeitoFinal += ` ${numero13r}% - ${numero23r}%`;
                        } else if (simbolo === "%" && numero1 < 0) {
                            efeitoFinal += ` ${numero13r}% - ${numero23r}%`;
                        } else if (simbolo === "+") {
                            efeitoFinal += numero1 > 0 ? ` ${numero13r} - ${numero23r}` : `${numero13r} - ${numero23r}`;
                        } else {
                            efeitoFinal += ` ${numero1}`;
                        }
                    } else {
                        let numero13 = (numero1 + numero3) + ((numero1 + numero3) * 0.15)
                        let numero23 = (numero2 + numero3) + ((numero2 + numero3) * 0.15)
                        let numero13r = parseInt(numero13)
                        let numero23r = parseInt(numero23)
                        if (simbolo === "%" && numero13r > 0) {
                            efeitoFinal += ` ${numero13r}% - ${numero23r}%`;
                        } else if (simbolo === "%" && numero1 < 0) {
                            efeitoFinal += ` ${numero13r}% - ${numero23r}%`;
                        } else if (simbolo === "+") {
                            efeitoFinal += numero1 > 0 ? ` ${numero13r} - ${numero23r}` : `${numero13r} - ${numero23r}`;
                        } else {
                            efeitoFinal += ` ${numero1}`;
                        }
                    }
                }
                break;
        }
        
        elementoEfeito.parentElement.style.display = "block";
        document.getElementById("temefeitoserandomeffects").style.display = "block"
        document.getElementById("equipedeffects").style = "block"
        elementoEfeito.innerHTML = efeitoFinal;
    })
    
    let vazioCheck1 = document.getElementById("itemEfeito1")
    let vazioCheck2 = document.getElementById("itemEfeito2")
    let vazioCheck3 = document.getElementById("itemEfeito3")
    let vazioCheck4 = document.getElementById("itemEfeito4")
    if (vazioCheck1.display === "none" && vazioCheck2.display === "none" && vazioCheck3.display === "none" && vazioCheck4.display === "none" || vazioCheck4.innerText === "allstat+,0,0") {
        ocultaEfeitos()
    }
}
function ocultaEfeitos() {
    document.getElementById("temefeitoserandomeffects").style.display = "none"
    console.log(Ocultado)
}

function mudarBordaNivel(Q1, Q2, Q3) {
    const btn1 = document.getElementById("botaoNivelAtual1");
    const btn2 = document.getElementById("botaoNivelAtual2");
    const btn3 = document.getElementById("botaoNivelAtual3");
    
    if (Q1 == 1) {
        btn1.style.setProperty("border", "5px groove dodgerblue", "important");
    } else {
        btn1.style.setProperty("border", "5px groove white", "important");
    }
    if (Q2 == 1) {
        btn2.style.setProperty("border", "5px groove dodgerblue", "important");
    } else {
        btn2.style.setProperty("border", "5px groove white", "important");
    }
    if (Q3 == 1) {
        btn3.style.setProperty("border", "5px groove dodgerblue", "important");
    } else {
        btn3.style.setProperty("border", "5px groove white", "important");
    }
}
function mudarLevel(itemLevel) {
    document.getElementById("itemNivel").innerText = parseInt(itemLevel);
}
function mudarNivelAtual(nivel) {
    switch (nivel) {
        case 'min':
            nivelAtual = 1
            atualizarItemSealed();
            mudarBordaNivel(1, 0, 0)
            break;
        case 'max':
            nivelAtual = 2
            atualizarItemSealed();
            mudarBordaNivel(0, 1, 0)
            break;
        case 'awk':
            nivelAtual = 3
            atualizarItemSealed();
            mudarBordaNivel(0, 0, 1)
            break;
    }

}
function adicionaNome() {
    if (nivelAtual == 1 || nivelAtual == 2) {
        document.getElementById("itemNome").innerText += " ";
    } else {
        document.getElementById("itemNome").innerText += " (+7)";
    }
}
function definePreco(precosell, disposed, currencyid) {
    let precoFormatado = [];
        
    let preco = parseInt(precosell);
    let precoElemento = document.getElementById("itemPreco");
    let salePriceElemento = document.getElementById("saleprice");
    let barrasaleElemento = document.getElementById("barrasale");
    let divsaleElemento = document.getElementById("divsale");

    let gold = Math.floor(preco / 10000);
    let silver = Math.floor((preco % 10000) / 100);
    let copper = preco % 100;
    
    let goldIcon = '<img src="../imgs/Coingold.png" class="moeda gold" />';
    let silverIcon = '<img src="../imgs/Coinsilver.png" class="moeda silver" />';
    let copperIcon = '<img src="../imgs/Coincopper.png" class="moeda copper" />';
    let nonIcon = '<img src="../imgs/icon_190001718.png" class="moeda silver" />';

    if (currencyid === "*") {
        switch (true) {
            case gold > 0:
                precoFormatado.push(`<span class="moeda gold">${gold}${goldIcon}</span>`);
            case silver > 0:
                precoFormatado.push(`<span class="moeda silver">${silver}${silverIcon}</span>`);
            case copper > 0:
                precoFormatado.push(`<span class="moeda copper">${copper}${copperIcon}</span>`);
        }
    } else {
        precoFormatado.push(`<span class="moeda silver">${parseInt(precosell)}${nonIcon}</span>`);
    }

    if (preco > 0 && disposed == 0.000000) {
        precoElemento.innerHTML = precoFormatado.join(" ");
        salePriceElemento.style.display = "block"; 
        barrasaleElemento.style.display = "block"; 
        divsaleElemento.style.display = "flex";
    } else {
        salePriceElemento.style.display = "none";
        barrasaleElemento.style.display = "none";
        divsaleElemento.style.display = "none";
    }

    document.getElementById("itemPreco").innerHTML = precoFormatado.join(" ");
}



function formatarTempo(segundos) {
    let dias = Math.floor(segundos / 86400);
    segundos %= 86400;
    let horas = Math.floor(segundos / 3600);
    segundos %= 3600;
    let minutos = Math.floor(segundos / 60);
    segundos %= 60;

    let resultado = [];

    if (dias > 0) resultado.push(`${dias}Days`);
    if (horas > 0) resultado.push(`${horas}Hours`);
    if (minutos > 0) resultado.push(`${minutos}Min`);
    if (segundos > 0) resultado.push(`${segundos}Secs`);

    return resultado.join(", ");
}
function mudarUsagePeriod(usagePeriod) {
    if (parseInt(usagePeriod) == 0) {
        document.getElementById("barraduration").style.display = "none";
        document.getElementById("textduration").style.display = "none";
        document.getElementById("durationtime").style.display = "none";
    } else {
        document.getElementById("barraduration").style.display = "block";
        document.getElementById("textduration").style.display = "block";
        document.getElementById("durationtime").style.display = "block";
        document.getElementById("durationtime").innerText = formatarTempo(parseInt(usagePeriod))
    }
}

function checkCodigoBruto(codigoBruto) {
    if (!codigoBruto) { defaultItem(itemDefault) }

    let partes = codigoBruto.split(";");
    if (partes.length <= 31) { atualizarItemSealed()
    } else { alert("Invalid code!, This code could not be recognized, please check Code again." + " " + codigoBruto); }
}
async function atualizarItemSealed() {
    let codigoBruto = document.getElementById("codigoItem").value.trim();
    if (!codigoBruto) {
        defaultItem(itemDefault)
    }
    let partes = codigoBruto.split(";");

    if (partes.length == 30) {
        let id = partes[0]
        let name = partes[1]
        let rarity = partes[2]
        let rarityPlus = partes[3]
        let sealType = partes[4]
        let itemLevel = partes[5]
        let attributeType = partes[6]
        let enhancementType = partes[7]
        let creatureGrade = partes[8]
        let sealedFellowEffect1 = partes[9]
        let sealedFellowEffect2 = partes[10]
        let sealedFellowEffect3 = partes[11]
        let maxEnhancedSealedFellowEffect = partes[12]
        let rfGrade = partes[13]
        let rfEff = partes[14]
        let skillEffect = partes[15]
        let precobuy = partes[16]
        let precosell = partes[17]
        let cannotBeTrade = partes[18]
        let cannotBeDisposed = partes[19]
        let cannotBeDestroy = partes[20]
        let dropLevelCheck = partes[21]
        let binding = partes[22]
        let useRestrictions = partes[23]
        let traitPower = partes[24]
        let usePeriod = partes[25]
        let salesAgentClassification = partes[26]
        let unableToUseIntegratedChannel = partes[27]
        let stackCount = partes[28]
        let expWeight = partes[29]
    
        mudarNomeDesc(id)
        mudarCor(rarity, rarityPlus)
        mudarLevel(itemLevel)
        mudarTraitPower(traitPower)
        adicionaNome()
        processarEfeitosDoItemacc(maxEnhancedSealedFellowEffect, sealedFellowEffect1, sealedFellowEffect2, sealedFellowEffect3)
        definePreco(precosell, cannotBeDisposed, "*")
        
        mudarUsagePeriod(usePeriod)
        document.getElementById("textCodigoItem").innerText = "Itemdata_relic.csv | Code:";
        document.getElementById("textNomeDoItemTraduzido").innerText = "localstringdata_item_event.csv | Code:";
    } else {
        alert("Invalid code!, This code is Relic?");
    }
}

// ----------------- //
// Botoes Principais //
// ----------------- //
function filtrarItems() {
    let input = document.getElementById("searchBar").value.toLowerCase();
    let buttons = document.querySelectorAll("#botaoContainer button");

    buttons.forEach(button => {
        let nome = button.querySelector("p").innerText.toLowerCase()
        button.style.display = nome.includes(input) ? "flex" : "none"
    });
}
function mudarItem(id) {
    let item = itemInformationsObj[id];

    document.getElementById("codigoItem").value = Object.values(item).join(";");
    codigoOriginal = Object.values(item).join(";");
    
    let codigoBruto = document.getElementById("codigoItem").value.trim();
    checkCodigoBruto(codigoBruto)
}
function carregarCodigo() {
    let codigoBruto = document.getElementById("codigoItem").value.trim();
    checkCodigoBruto(codigoBruto)
}
function voltarCodigo() {
    let codigoBruto = document.getElementById("codigoItem").value.trim();
    if (codigoOriginal == null) {
        codigoOriginal = defaultItem(itemDefault)
        checkCodigoBruto(codigoBruto)
    } else {
    document.getElementById("codigoItem").value = codigoOriginal;
    checkCodigoBruto(codigoBruto)
    }
}
function percorrerItens() {
    const ids = Object.keys(itemInformationsObj);
    let index = 0;

    function processarProximoItem() {
        if (index < ids.length) {
            let id = ids[index];
            mudarItem(id); 
            index++;
            switch (index) {
                case 500:
                    console.log(index)
                    break;
                case 1000:
                    console.log(index)
                    break;
                case 1500:
                    console.log(index)
                    break;
                case 2000:
                    console.log(index)
                    break;
                case 2500:
                    console.log(index)
                    break;
                case 3000:
                    console.log(index)
                    break;
                case 3500:
                    console.log(index)
                    break;
                case 4000:
                    console.log(index)
                    break;
                case 4500:
                    console.log(index)
                    break;
                case 5000:
                    console.log(index)
                    break;
                case 5500:
                    console.log(index)
                    break;
                case 6000:
                    console.log(index)
                    break;
                case 6500:
                    console.log(index)
                    break;
                case 7000:
                    console.log(index)
                    break;
                case 7500:
                    console.log(index)
                    break;
                case 8000:
                    console.log(index)
                    break;
                case 8500:
                    console.log(index)
                    break;
                case 9000:
                    console.log(index)
                    break;
            }
            setTimeout(processarProximoItem, 500); // Aguarda 1 segundo antes do pr?ximo
        } else {
            console.log(index)
            console.log("Finalizado: Todos os itens foram processados.");
        }
    }

    if (ids.length > 0) {
        processarProximoItem(); // Inicia o processo
    } else {
        console.log("Nenhum item encontrado em itemInformationsObj.");
    }
}
// ---------------- //
// Carrega a Pagina //
// ---------------- //

async function mudarType(type) {
    buttonType = type
    await loadButton()
    filtrarItems()
}
async function inicializarPagina() {
    mudarBordaNivel(1, 0, 0)
    await carregarTraducoes()
    await carregarEffectTranslations()
    await carregarItems()

    codigoOriginal = defaultItem(itemDefault)
    let codigoBruto = document.getElementById("codigoItem").value.trim();
    checkCodigoBruto(codigoBruto)
}

window.onload = inicializarPagina
