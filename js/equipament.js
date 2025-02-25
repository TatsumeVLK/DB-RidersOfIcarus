// --------- //
// Variables //
// --------- //
const buttonItems = [
    "../database/button/itemdata_accessory.csv",
    "../database/button/itemdata_armor.csv",
    "../database/button/itemdata_weapon.csv",
    "../database/button/itemdata_bracelet.csv",
    "../database/button/itemdata_relic.csv"
]
const buttonIcons = [
    "../database/itemres/itemres_accessory.csv",
    "../database/itemres/itemres_armor.csv",
    "../database/itemres/itemres_weapon.csv",
    "../database/itemres/itemres_bracelet.csv",
    "../database/itemres/itemres_relic.csv"
]

const itemInformations = [
    "../database/itemdata/itemdata_accessory.csv",
    "../database/itemdata/itemdata_armor.csv",
    "../database/itemdata/itemdata_weapon.csv",
    "../database/itemdata/itemdata_bracelet.csv",
    "../database/itemdata/itemdata_relic.csv"
]

const itemTranslations = [
    "../database/translate/localstringdata_item_accessory.csv",
    "../database/translate/localstringdata_item_accessory_02.csv",
    "../database/translate/localstringdata_item_armor.csv",
    "../database/translate/localstringdata_item_armor_02.csv",
    "../database/translate/localstringdata_item_weapon.csv",
    "../database/translate/localstringdata_item_weapon_02.csv",
    "../database/translate/localstringdata_item_bracelet.csv",
    "../database/translate/localstringdata_item_event.csv"
];
const skillTranslations = [
    "../database/translate/localstringdata_skill.csv"
]
const effectsTranslation = "../database/custom/minhatraducao.csv"


let buttonType = "ne"
let itemDefault = "AC5_0_6000";

async function mudarType(type) {
    buttonType = type
    await loadButton()
    filtrarItems()
}

let buttonIiconsObj = {}
let buttonItemsObj = {}
let itemInformationsObj = {}
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
function formatSkillText(text) {
    const patterns = [
        { regex: /<UI_P>(.*?)<\/UI_P>/g, replacement: '<span class="fellow" style="display: inline-block; padding-left: 5px;">$1</span>' },
        { regex: /<UI_P>(.*?)<\/ui_p>/g, replacement: '<span class="fellow" style="display: inline-block; padding-left: 5px;">$1</span>' },
        { regex: /<ui_p>(.*?)<\/UI_P>/g, replacement: '<span class="fellow" style="display: inline-block; padding-left: 5px;">$1</span>' },
        { regex: /<ui_p>(.*?)<\/ui_p>/g, replacement: '<span class="fellow" style="display: inline-block; padding-left: 5px;">$1</span>' },
        { regex: /<Y_Y>(.*?)<\/Y_Y>/g, replacement: '<span class="red" style="display: inline-block; padding-left: 5px;">$1</span>' },
        { regex: /<Y_Y>(.*?)<\/y_y>/g, replacement: '<span class="red" style="display: inline-block; padding-left: 5px;">$1</span>' },
        { regex: /<y_y>(.*?)<\/y_y>/g, replacement: '<span class="red" style="display: inline-block; padding-left: 5px;">$1</span>' },
        { regex: /<y_y>(.*?)<\/Y_Y>/g, replacement: '<span class="red" style="display: inline-block; padding-left: 5px;">$1</span>' },
        { regex: /<O_Y>(.*?)<\/O_Y>/g, replacement: '<span class="orange" style="display: inline-block; padding-left: 5px;">$1</span>' }
    ];

    patterns.forEach(({ regex, replacement }) => {
        text = text.replace(regex, replacement);
    });

    return text;
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
async function carregarSkillTraducoes(skillId) {
    for (const file of skillTranslations) {
        try {
            const response = await fetch(file + "?nocache=" + new Date().getTime())
            const text = await response.text();
            const lines = text.split('\n');
            
            for (const line of lines) {
                const [key, value] = line.split(';');
                
                if (key && value) {
                    const cleanKey = key.replace(/^\^|\^$/g, '');
                    if (cleanKey === `${skillId}_description_1` || cleanKey === `${skillId}_Description_1`) {
                        return formatSkillText(value.replace(/^\^|\^$/g, ''));
                    }
                }
            }
        } catch (error) {
            console.error(`Erro in ${file}:`, error);
        }
    }
    return "";
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
async function carregarSetNameTranslations() {
    const response = await fetch("../database/translate/localstringdata_item_setitem.csv" + "?nocache=" + new Date().getTime());
    const text = await response.text();
    let parsed = Papa.parse(text, { header: true, skipEmptyLines: true, delimiter: "," });

    parsed.data.forEach(row => {
        if (row.t_key && row.t_korean) {
            let key = row.t_key.replace(/\^/g, "").replace("_Name", "").trim().toLowerCase();
            setNameObj[key] = row.t_korean.replace(/\^/g, "").trim();
        }
    });
}
function buscarSetName(key) {
    let normalizedKey = key.trim().toLowerCase();
    return setNameObj[normalizedKey] || key;
}
async function carregarCSV() {
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
async function carregarIconeDoItem(itemID) {
    let iconeEncontrado = null;

    for (let file of buttonIcons) {
        try {
            const response = await fetch(file + "?nocache=" + new Date().getTime());
            const text = await response.text();
            const lines = text.trim().split(/\r?\n/);

            for (let line of lines) {
                const [id, icon] = line.split(';');
                if (id === itemID) {
                    iconeEncontrado = icon;
                    buttonIiconsObj[itemID] = icon;
                    break;
                }
            }

            if (iconeEncontrado) break;
        } catch (error) {
            console.error("Erro ao carregar o arquivo:", file, error);
        }
    }

    atualizarIcone(iconeEncontrado);
}
function atualizarIcone(iconFileName) {
    let img = document.getElementById("itemIcone");
    
    switch (buttonType) {
        case "ne":
            img.src = `../imgs/ne/${iconFileName}.png`
            img.onerror = function() { img.src = `../imgs/favicon.png`; }
            break;
        case "ri":
            img.src = `../imgs/ri/${iconFileName}.png`
            img.onerror = function() { img.src = `../imgs/favicon.png`; }
            break;
        case "brace":
            img.src = `../imgs/brace/${iconFileName}.png`
            img.onerror = function() { img.src = `../imgs/favicon.png`; }
            break;
        case "re":
            img.src = `../imgs/re/${iconFileName}.png`
            img.onerror = function() { img.src = `../imgs/favicon.png`; }
            break;
        case "ha":
            img.src = `../imgs/ha/${iconFileName}.png`
            img.onerror = function() { img.src = `../imgs/favicon.png`; }
            break;
        case "sh":
            img.src = `../imgs/sh/${iconFileName}.png`
            img.onerror = function() { img.src = `../imgs/favicon.png`; }
            break;
        case "ja":
            img.src = `../imgs/ja/${iconFileName}.png`
            img.onerror = function() { img.src = `../imgs/favicon.png`; }
            break;
        case "gl":
            img.src = `../imgs/gl/${iconFileName}.png`
            img.onerror = function() { img.src = `../imgs/favicon.png`; }
            break;
        case "bo":
            img.src = `../imgs/bo/${iconFileName}.png`
            img.onerror = function() { img.src = `../imgs/favicon.png`; }
            break;
        case "d1":
            img.src = `../imgs/d1/${iconFileName}.png`
            img.onerror = function() { img.src = `../imgs/favicon.png`; }
            break;
        case "s1":
            img.src = `../imgs/s1/${iconFileName}.png`
            img.onerror = function() { img.src = `../imgs/favicon.png`; }
            break;
        case "s2":
            img.src = `../imgs/s2/${iconFileName}.png`
            img.onerror = function() { img.src = `../imgs/favicon.png`; }
            break;
        case "m1":
            img.src = `../imgs/m1/${iconFileName}.png`
            img.onerror = function() { img.src = `../imgs/favicon.png`; }
            break;
        case "m2":
            img.src = `../imgs/m2/${iconFileName}.png`
            img.onerror = function() { img.src = `../imgs/favicon.png`; }
            break;
        case "W1":
            img.src = `../imgs/W1/${iconFileName}.png`
            img.onerror = function() { img.src = `../imgs/favicon.png`; }
            break;
        case "c2":
            img.src = `../imgs/c2/${iconFileName}.png`
            img.onerror = function() { img.src = `../imgs/favicon.png`; }
            break;
        case "b1":
            img.src = `../imgs/b1/${iconFileName}.png`
            img.onerror = function() { img.src = `../imgs/favicon.png`; }
            break;
        case "h1":
            img.src = `../imgs/h1/${iconFileName}.png`
            img.onerror = function() { img.src = `../imgs/favicon.png`; }
            break;
        case "h2":
            img.src = `../imgs/h2/${iconFileName}.png`
            img.onerror = function() { img.src = `../imgs/favicon.png`; }
            break;
        case "b2":
            img.src = `../imgs/b2/${iconFileName}.png`
            img.onerror = function() { img.src = `../imgs/favicon.png`; }
            break;
        case "l2":
            img.src = `../imgs/l2/${iconFileName}.png`
            img.onerror = function() { img.src = `../imgs/favicon.png`; }
            break;
    }
}
async function loadButton() {
    const container = document.getElementById("botaoContainer");
    container.innerHTML = "";

    let mapaDeIcones = {};
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
        img.className = "img"+rarity;
        
        let iconFileName = mapaDeIcones[id] || "favicon";
        
        switch (buttonType) {
            case "ne":
                img.src = `../imgs/ne/${iconFileName}.png`
                img.onerror = function() { img.src = `../imgs/favicon.png`; }
                break;
            case "ri":
                img.src = `../imgs/ri/${iconFileName}.png`
                img.onerror = function() { img.src = `../imgs/favicon.png`; }
                break;
            case "brace":
                img.src = `../imgs/brace/${iconFileName}.png`
                img.onerror = function() { img.src = `../imgs/favicon.png`; }
                break;
            case "re":
                img.src = `../imgs/re/${iconFileName}.png`
                img.onerror = function() { img.src = `../imgs/favicon.png`; }
                break;
            case "ha":
                img.src = `../imgs/ha/${iconFileName}.png`
                img.onerror = function() { img.src = `../imgs/favicon.png`; }
                break;
            case "sh":
                img.src = `../imgs/sh/${iconFileName}.png`
                img.onerror = function() { img.src = `../imgs/favicon.png`; }
                break;
            case "ja":
                img.src = `../imgs/ja/${iconFileName}.png`
                img.onerror = function() { img.src = `../imgs/favicon.png`; }
                break;
            case "gl":
                img.src = `../imgs/gl/${iconFileName}.png`
                img.onerror = function() { img.src = `../imgs/favicon.png`; }
                break;
            case "bo":
                img.src = `../imgs/bo/${iconFileName}.png`
                img.onerror = function() { img.src = `../imgs/favicon.png`; }
                break;
            case "d1":
                img.src = `../imgs/d1/${iconFileName}.png`
                img.onerror = function() { img.src = `../imgs/favicon.png`; }
                break;
            case "s1":
                img.src = `../imgs/s1/${iconFileName}.png`
                img.onerror = function() { img.src = `../imgs/favicon.png`; }
                break;
            case "s2":
                img.src = `../imgs/s2/${iconFileName}.png`
                img.onerror = function() { img.src = `../imgs/favicon.png`; }
                break;
            case "m1":
                img.src = `../imgs/m1/${iconFileName}.png`
                img.onerror = function() { img.src = `../imgs/favicon.png`; }
                break;
            case "m2":
                img.src = `../imgs/m2/${iconFileName}.png`
                img.onerror = function() { img.src = `../imgs/favicon.png`; }
                break;
            case "W1":
                img.src = `../imgs/W1/${iconFileName}.png`
                img.onerror = function() { img.src = `../imgs/favicon.png`; }
                break;
            case "c2":
                img.src = `../imgs/c2/${iconFileName}.png`
                img.onerror = function() { img.src = `../imgs/favicon.png`; }
                break;
            case "b1":
                img.src = `../imgs/b1/${iconFileName}.png`
                img.onerror = function() { img.src = `../imgs/favicon.png`; }
                break;
            case "h1":
                img.src = `../imgs/h1/${iconFileName}.png`
                img.onerror = function() { img.src = `../imgs/favicon.png`; }
                break;
            case "h2":
                img.src = `../imgs/h2/${iconFileName}.png`
                img.onerror = function() { img.src = `../imgs/favicon.png`; }
                break;
            case "b2":
                img.src = `../imgs/b2/${iconFileName}.png`
                img.onerror = function() { img.src = `../imgs/favicon.png`; }
                break;
            case "l2":
                img.src = `../imgs/l2/${iconFileName}.png`
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
async function carregarItemSetData() {
    try {
        const response = await fetch("../database/itemdata/itemset_setcharacter.csv" + "?nocache=" + new Date().getTime());
        const buffer = await response.arrayBuffer();
        const text = new TextDecoder("euc-kr").decode(buffer);

        let parsed = Papa.parse(text, { 
            header: true, 
            skipEmptyLines: true, 
            delimiter: ";" 
        });

        parsed.data.forEach(itemSet => {
            if (itemSet.t_setid) {
                let id = itemSet.t_setid.trim();
                itemSetObj[id] = itemSet;
                buscarSetName(id)
            } else {
                console.warn("Linha sem t_setid no itemset_setcharacter.csv:", itemSet);
            }
        });
    } catch (error) {
        console.error("Erro ao carregar itemset_setcharacter.csv:", error);
    }
}
async function atualizarSetEffect(setRow, countEffect, effectPrefix, skillId, containerId) {
    let container = document.getElementById(containerId);
    if (!container) return;

    if (countEffect > 0) {
        container.style.display = "none";

        for (let j = 1; j <= 4; j++) {
            let effectElem = document.getElementById(`${effectPrefix}${j}`);
            effectElem.style.display = "flex";

            let effectField = setRow[`${effectPrefix}${j}`];
            if (effectField && effectField.trim() !== "*" && effectField.trim() !== "0") {
                let effectStr = effectField.replace(/[(\')]/g, "").split(",");
                let chaveOriginal = effectStr[0].trim();
                let valorStr = effectStr[1] ? effectStr[1].trim() : "";

                let simbolo = "";
                if (chaveOriginal.endsWith("%") || chaveOriginal.endsWith("+")) {
                    simbolo = chaveOriginal.slice(-1);
                    chaveOriginal = chaveOriginal.slice(0, -1).trim();
                }

                if (chaveOriginal === "ÃâÇ÷¹æ¾î") {
                    chaveOriginal = "ÃâÇ÷¹æ¾îÀ²"
                }

                let traducao = effectObj[chaveOriginal] || chaveOriginal;
                if (traducao === chaveOriginal) {
                    console.log("Effect not Found in set: " + chaveOriginal)
                }
                if (traducao === "Bleed Defense" ||
                    traducao === "Magic Critical Damage" ||
                    traducao === "PvP Resistance" ||
                    traducao === "Physic Crit Rate"||
                    traducao === "Magic Crit Rate" ||
                    traducao === "Money Drop Increase" ||
                    traducao === "Weapon Critical Damage") {
                    simbolo = "%"
                }
                let valorNumerico = parseFloat(valorStr);
                let sinal = "";
                if (valorNumerico > 0) {
                    sinal = "+";
                }

                let efeitoFinal = traducao;
                if (!isNaN(valorNumerico)) {
                    efeitoFinal += simbolo === "%" ? ` ${sinal}${valorNumerico.toFixed(2)}%` : ` ${sinal}${valorNumerico}`;
                }

                effectElem.innerHTML = efeitoFinal;
                container.style.display = "block";
            } else {
                effectElem.style.display = "none";
            }
        }

        let skillElem = document.getElementById(skillId);
        if (skillElem && skillElem.innerText !== "0") {
            let skillText = setRow[skillId];
            
            if (!skillText || skillText.trim() !== "*") {
                skillText = await carregarSkillTraducoes(skillText);
                skillElem.style.display = "flex";
                container.style.display = "block";
            } else {
                skillElem.style.display = "none";
            }
            
            skillElem.innerHTML = skillText.slice(0, -2).trim();
        }
    } else {
        container.style.display = "none";
    }
}
async function atualizarSetDiv(itemID) {
    await carregarItemSetData();

    const setDiv = document.getElementById("setdivcompleto");
    if (!setDiv) return;

    let setRow = null;

    for (let setID in itemSetObj) {
        let set = itemSetObj[setID];
        for (let i = 1; i <= 14; i++) {
            let campo = set[`t_item${i}`];
            if (campo && campo.trim() === itemID) {
                setRow = set;
                break;
            }
        }
        if (setRow) break;
    }

    if (!setRow) {
        setDiv.style.display = "none";
        return;
    }

    setDiv.style.display = "block";

    let setID = setRow.t_setid.trim().toLowerCase();
    let setNameTraduzido = setNameObj[setID] || setID;

    let countItems = 0;
    for (let i = 1; i <= 14; i++) {
        let campo = setRow[`t_item${i}`];
        let elem = document.getElementById(`t_item${i}`);

        if (campo && campo.trim() !== "*") {
            countItems++;

            if (elem) {
                elem.innerText = mapaDeTraducoes[campo]?.nome || campo;
                elem.style.display = "block";
                elem.setAttribute("onclick", `mudarItem('${campo}')`);
            }
        } else if (elem) {
            elem.innerText = "";
            elem.style.display = "none";
        }
    }

    document.getElementById("setname").innerText = `${setNameTraduzido} (0/${countItems})`;

    for (let i = 1; i <= 8; i++) {
        let countEffect = parseInt(setRow[`seteffect${i}_count`] || 0);
        document.getElementById(`seteffect${i}`).innerText = `Set Effects (${countEffect})`;

        atualizarSetEffect(setRow, countEffect, `t_seteffect${i}_effect`, `t_seteffect${i}_skill`, `hasseteffect${i}`);
    }
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
async function processarEfeitosDoItemacc(efeito1, efeito2, efeito3, efeito4, maxRandomOptionsQuantity) {
    let efeitos = [efeito1, efeito2, efeito3, efeito4];

    efeitos.forEach((efeito, index) => {
        let elementoEfeito = document.getElementById(`itemEfeito${index + 1}`);

        if (!efeito || efeito.trim() === "*") {
            elementoEfeito.parentElement.style.display = "none";
            return;
        }

        let efeitoFormatado = efeito.replace(/[()]/g, "").split(",");
        let termoOriginal = efeitoFormatado[0].trim();
        let valorNumerico = efeitoFormatado[1] ? efeitoFormatado[1].trim() : null;

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

        if (valorNumerico !== null) {
            let numero = parseFloat(valorNumerico);
            if (simbolo === "%" && numero > 0) {
                efeitoFinal += ` +${numero.toFixed(2)}%`;
            } else if (simbolo === "%" && numero < 0) {
                efeitoFinal += ` ${numero.toFixed(2)}%`;
            } else if (simbolo === "+") {
                efeitoFinal += numero > 0 ? ` +${numero}` : ` ${numero}`;
            } else {
                efeitoFinal += ` ${numero}`;
            }
        }

        elementoEfeito.innerText = efeitoFinal;
        elementoEfeito.parentElement.style.display = "block";
    });
    if (efeito1 == "*" && efeito2 == "*" && efeito3 == "*" && efeito4 == "*" && maxRandomOptionsQuantity < 1) {
        document.getElementById("temefeitoserandomeffects").style.display = "none";
    } else {
        document.getElementById("temefeitoserandomeffects").style.display = "block";
    }
}
function exibirLinhaOriginal(id) {
    let nomeTraduzido = mapaDeTraducoes[id]?.nome || "";

    if (!nomeTraduzido) {
        nomeTraduzido = "";
    }

    let linhaOriginal = `^${id}_Name^,^${nomeTraduzido}^`;

    document.getElementById("nomedoItemtraduzido").value = linhaOriginal;
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
function mudarCor(rarity) {
    
    const coresRaridade = {
        1: "#ffffff", // Branco (Comum)
        2: "#00aaFF", // Azul (Elite)
        3: "#ffcc00", // Dourado (Heroico)
        4: "#ff00ff", // Roxo (Lendario)
        6: "#ffaa55",  // laranja (Unique)
        7: "#ff1155"  // Vermelho (Mitico)
    };

    let cor = coresRaridade[parseInt(rarity)] || "#ffffff";

    let rarityT;
    if (buttonType != "brace") {
        switch (parseInt(rarity)) {
            case 1:
                rarityT = "Common(Normal)";
                break;
            case 2:
                rarityT = "Elite(Normal)";
                break;
            case 3:
                rarityT = "Heroic(Normal)";
                break;
            case 4:
                rarityT = "Legendary(Normal)";
                break;
            case 6:
                rarityT = "Unique(Normal)";
                break;
            case 7:
                rarityT = "Mythical(Normal)";
                break;
            default:
                rarityT = rarity;
        }
    } else {
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
            case 6:
                rarityT = "Unique";
                break;
            case 7:
                rarityT = "Mythical";
                break;
            default:
                rarityT = rarity;
        }
    }
    document.getElementById("itemRaridade").innerText = rarityT;
    document.getElementById("itemRaridade").style.color = cor;
    document.getElementById("itemNome").style.color = cor;
}
function mudarLevel(level, maxlevel) {
    if (maxlevel > 0) {
        document.getElementById("growthtype").style.display = "block";
        document.getElementById("maxlevel").style.display = "inline";
        document.getElementById("maxlevel").innerText = " ~ " + parseInt(maxlevel);
    } else {
        document.getElementById("growthtype").style.display = "none";
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
function mudarItemType(type) {
    let TypeT;
    switch (type) {
        case "ri":
            TypeT = "Ring";
            break;
        case "ne":
            TypeT = "Necklace";
            break;
        case "ha":
            TypeT = "Hat";
            break;
        case "sh":
            TypeT = "Shoulders";
            break;
        case "ja":
            TypeT = "Armor";
            break;
        case "gl":
            TypeT = "Gloves";
            break;
        case "bo":
            TypeT = "Boots";
            break;
        case "d1": 
        case "s1": 
        case "s2": 
        case "m1": 
        case "b1": 
        case "h1": 
        case "h2": 
        case "b2":
        case "W1":
            TypeT = "Primary Weapon";
            break;
        case "l2": 
        case "c2":
            TypeT = "Active mounted weapon";
            break;
        case "re":
            TypeT = "Relic"
            break;
        case "":
            TypeT = "Bracelet"
            break;
        case "*":
            TypeT = "Wrong Type"
            break;
        default:
            TypeT = type;
    }
    document.getElementById("tipoEquipamento").innerText = TypeT;
}
function mudarCannot(cannotBeTrade, cannotBeDisposed, cannotBeDropped, cannotBeDestroyed) {
    function cannotBe() {
        let listCannot = [];

        if (cannotBeTrade > 0) listCannot.push("Untradable");
        if (cannotBeDisposed > 0) listCannot.push("Unsellable");

        return listCannot.length > 0 ? listCannot.join(", ") : document.getElementById("cannottradesell").style.display = "none"
    }
    
    if (cannotBeTrade > 0 || cannotBeDisposed > 0 || cannotBeDropped > 0 || cannotBeDestroyed > 0) {
        document.getElementById("cannottradesell").style.display = "block";
        document.getElementById("cannottradesell").innerText = cannotBe();
    } else {
        document.getElementById("cannottradesell").style.display = "none";
    }
}
function mudarReinforcement(reinforcementRestriction) {
    if (parseInt(reinforcementRestriction) == 0) {
        document.getElementById("naopodemelhorar").style.display = "block";
        document.getElementById("temperinglevel").style.display = "none";
        document.getElementById("temperingname").style.display = "none";
    } else {
        document.getElementById("naopodemelhorar").style.display = "none";
        document.getElementById("temperinglevel").style.display = "inline";
        document.getElementById("temperingname").style.display = "block";
        document.getElementById("temperinglevel").innerText = "0 / " + parseInt(reinforcementRestriction);
    }
    if (reinforcementRestriction == "brace") {
        document.getElementById("naopodemelhorar").style.display = "none";
        document.getElementById("temperinglevel").style.display = "none";
        document.getElementById("temperingname").style.display = "none";
    }
}
function mudarReverse(reverseReinforcementRestriction) {
    if (parseInt(reverseReinforcementRestriction) == 0 || reverseReinforcementRestriction === "*") {
        document.getElementById("reverselevel").style.display = "none";
        document.getElementById("reversename").style.display = "none";
    } else {
        document.getElementById("reverselevel").style.display = "inline";
        document.getElementById("reversename").style.display = "block";
        document.getElementById("reverselevel").innerText = "0 / " + parseInt(reverseReinforcementRestriction);
    }
}
function mudarDisassembly(disassemblyID) {
    if (buttonType != "brace" && buttonType != "re") {
        if (disassemblyID == "*") {
            document.getElementById("naopodedismantling").style.display = "block";
        } else {
            document.getElementById("naopodedismantling").style.display = "none";
        }
    } else {
        document.getElementById("naopodedismantling").style.display = "none";
    }
}
function mudarUnbind(unbindCount) {
    if (parseInt(unbindCount) == 0) {
        document.getElementById("naopodeunbind").style.display = "block";
        document.getElementById("unbinds").style.display = "none";
    } else {
        document.getElementById("naopodeunbind").style.display = "none";
        document.getElementById("unbinds").style.display = "block";
        document.getElementById("unbinds").innerText = `Unbindings Available ${parseInt(unbindCount)}/${parseInt(unbindCount)}`;
    }
}
function mudarRandomApp(randomOptionsApplication, minRandomOptionsQuantity, maxRandomOptionsQuantity) {
    if (buttonType != "re") {
        const randomeffects = document.getElementById("randomeffects");
        const ultimoEfeito = document.getElementById("itemEfeito4").parentElement;
    
        if (ultimoEfeito && randomeffects) {
            ultimoEfeito.insertAdjacentElement("afterend", randomeffects);
        }

        if (randomOptionsApplication < 1 || maxRandomOptionsQuantity < 1) {
            document.getElementById("randomeffects").style.display = "none";
        } else {
            document.getElementById("randomeffects").style.display = "block";
            document.getElementById("randomeffects").innerText = parseInt(minRandomOptionsQuantity) + " - " + parseInt(maxRandomOptionsQuantity) + " Random Effects";
        }
    } else {
        document.getElementById("randomeffects").style.display = "block";
        const randomeffects = document.getElementById("randomeffects");
        const primeiroEfeito = document.getElementById("itemEfeito1").parentElement;
    
        if (primeiroEfeito && randomeffects) {
            primeiroEfeito.parentNode.insertBefore(randomeffects, primeiroEfeito);
        }
        switch (parseInt(maxRandomOptionsQuantity)) {
            case 1:
                document.getElementById("randomeffects").innerHTML = "Identification Required";
                break;
            case 2:
                document.getElementById("randomeffects").innerHTML = "Identification Required<br>Identification Required";
                break;
            case 3:
                document.getElementById("randomeffects").innerHTML = "Identification Required<br>Identification Required<br>Identification Required";
                break;
            default:
                document.getElementById("randomeffects").innerHTML = "Identification Required<br>Identification Required<br>Identification Required<br>Identification Required";
        }
    }
}
async function mudarEquippedEffect(skillEffect) {
    
    let skillElem = document.getElementById("equipedskill")
    let skillSemFim2 = skillEffect.slice(0, -2)
    let skillId = await carregarSkillTraducoes(skillSemFim2);
    if (skillEffect != "*") {
        document.getElementById("temequipedskill").style.display = "block";
        document.getElementById("equipedskiltxt").style.display = "flex";
        document.getElementById("equipedskill").style.display = "flex";
        skillElem.innerHTML = skillId.slice(0, -2).trim();
    } else {
        document.getElementById("temequipedskill").style.display = "none";
        document.getElementById("equipedskiltxt").style.display = "none";
        document.getElementById("equipedskill").style.display = "none";
    }
}
function mudarSealSlots(sealedFellowEquipmentMinimumEquipmentSlotNumber, sealedFellowEquipmentMaximumEquipmentSlotNumber) {
    
    if (sealedFellowEquipmentMaximumEquipmentSlotNumber == 0) {
        document.getElementById("divSlot").style.display = "none";
        document.getElementById("barraslots").style.display = "none";
    } else {
        document.getElementById("divSlot").style.display = "flex";
        document.getElementById("barraslots").style.display = "block";
        document.getElementById("sealSlotIcon").src = "../imgs/EmptySealSlot.png";
        document.getElementById("selosslots").innerText = parseInt(sealedFellowEquipmentMinimumEquipmentSlotNumber) + " - " + parseInt(sealedFellowEquipmentMaximumEquipmentSlotNumber) + " Slots";
    }
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
function mudarGemSlots(maxGemSlots) {
    if (maxGemSlots > 0) {
        document.getElementById("barragemslots").style.display = "block";
        document.getElementById("gemslots").style.display = "block";
        document.getElementById("gemslots").innerText = "Gem Slots " + parseInt(maxGemSlots);
    } else {
        document.getElementById("barragemslots").style.display = "none";
        document.getElementById("gemslots").style.display = "none";
    }
}
function mudarSoulWeapon(soul, soullevel) {
    if (soul > 0) {
        document.getElementById("soultext").style.display = "block";
        document.getElementById("soultext").innerHTML = 'grant soul : 0 / ' + parseInt(soul) + ' [<span class="red" style="display: inline-block;">Soul level ' + (soullevel - 1) + '</span>]';
    } else {
        document.getElementById("soultext").style.display = "none";
    }
}
function mudarStatusPrincipal(minPhysicalAttack, maxPhysicalAttack, physicalDefense, magicDefense) {
    if (minPhysicalAttack != "*") {
        document.getElementById("imgInfosId").style.display = "flex";
        document.getElementById("statusPrincipal").style.display = "block";
        document.getElementById("statusSecundario").style.display = "none";
        document.getElementById("statusPrincipal").innerText = "Physical Damage " + parseInt(minPhysicalAttack) + " ~ " + parseInt(maxPhysicalAttack);
        return;
    }
    if (physicalDefense != "*") {
        document.getElementById("imgInfosId").style.display = "flex";
        document.getElementById("statusPrincipal").style.display = "block";
        document.getElementById("statusSecundario").style.display = "block";
        document.getElementById("statusPrincipal").innerText = "Physic Defense " + parseInt(physicalDefense);
        document.getElementById("statusSecundario").innerText = "Magic Defense " + parseInt(magicDefense);
        return;
    }
    if (magicDefense != "*") {
        document.getElementById("imgInfosId").style.display = "flex";
        document.getElementById("statusPrincipal").style.display = "block";
        document.getElementById("statusSecundario").style.display = "none";
        document.getElementById("statusPrincipal").innerText = "Magic Defense " + parseInt(magicDefense);
    } 
    if (parseInt(magicDefense) == 0) {
        document.getElementById("imgInfosId").style.display = "none";
    }
}
/* 

    Atualiza os items:

*/
async function atualizarItemacc() {
    let codigoBruto = document.getElementById("codigoItem").value.trim();
    if (!codigoBruto) {
        defaultItem(itemDefault)
    }
    let partes = codigoBruto.split(";");

    if (partes.length == 66) {
        let id = partes[0]
        let name = partes[1]
        let development = partes[2]
        let requiredLevel = partes[3]
        let limitedLevel = partes[4]
        let itemLevel = partes[5]
        let usedClass = partes[6]
        let randomAppliedClassStatus = partes[7]
        let useBy = partes[8]
        let rarity = partes[9]
        let accessoryType = partes[10]
        let durability = partes[11]
        let precobuy = partes[12]
        let precosell = partes[13]
        let minPhysicalAttack = partes[14]
        let maxPhysicalAttack = partes[15]
        let magicDefense = partes[16]
        let equipedEffect1 = partes[17]
        let equipedEffect2 = partes[18]
        let equipedEffect3 = partes[19]
        let equipedEffect4 = partes[20]
        let randomOptionsApplication = partes[21]
        let minRandomOptionsQuantity = partes[22]
        let maxRandomOptionsQuantity = partes[23]
        let optionsApplicationRatio = partes[24]
        let variableItem = partes[25]
        let minVariableItem = partes[26]
        let maxVariableItem = partes[27]
        let reinforcementRestriction = partes[28]
        let reinforcementProbability = partes[29]
        let cannotBeDropped = partes[30]
        let cannotBeTrade = partes[31]
        let cannotBeDisposed = partes[32]
        let cannotBeDestroyed = partes[33]
        let dropLevelCheck = partes[34]
        let binding = partes[35]
        let bindingTarget = partes[36]
        let unbindCount = partes[37]
        let useRestriction = partes[38]
        let dyeing = partes[39]
        let salesAgencyClassification = partes[40]
        let skillEffect = partes[41]
        let ignoreDropLevelCheck = partes[42]
        let usagePeriod = partes[43]
        let gradeUpcodeKey = partes[44]
        let gradeUpresult = partes[45]
        let disassemblyID = partes[46]
        let extractionID = partes[47]
        let sealStoneDuplicateEquipmentWhether = partes[48]
        let sealedFellowEquipmentSlotsNumber = partes[49]
        let sealedFellowEquipmentMinimumEquipmentSlotNumber = partes[50]
        let sealedFellowEquipmentMaximumEquipmentSlotNumber = partes[51]
        let useLevelOption = partes[52]
        let levelWeight = partes[53]
        let overriseMax = partes[54]
        let overriseId1 = partes[55]
        let overriseId2 = partes[56]
        let overriseId3 = partes[57]
        let contentsLevel = partes[58]
        let unableToUseIntegratedChannel = partes[59]
        let reverseReinforcementRestriction = partes[60]
        let lvup = partes[61]
        let itemexp = partes[62]
        let overrisematid1 = partes[63]
        let overrisematid2 = partes[64]
        let currencySettingId = partes[65]

        document.getElementById("itemIcone").style.display = "block";
        buttonType = accessoryType
        carregarIconeDoItem(id)
        mudarNomeDesc(id)
        mudarStatusPrincipal("*", "*", "*", magicDefense)
        mudarCor(rarity)
        mudarLevel(requiredLevel, limitedLevel)
        mudarBinding(binding)
        mudarClasse(usedClass)
        mudarItemType(accessoryType)
        mudarCannot(cannotBeTrade, cannotBeDisposed, cannotBeDropped, cannotBeDestroyed)
        mudarReinforcement(reinforcementRestriction)
        mudarReverse(reverseReinforcementRestriction)
        mudarDisassembly(disassemblyID)
        mudarUnbind(unbindCount)
        mudarEquippedEffect(skillEffect)
        mudarRandomApp(randomOptionsApplication, minRandomOptionsQuantity, maxRandomOptionsQuantity)
        processarEfeitosDoItemacc(equipedEffect1, equipedEffect2, equipedEffect3, equipedEffect4, maxRandomOptionsQuantity)
        mudarSealSlots(sealedFellowEquipmentMinimumEquipmentSlotNumber, sealedFellowEquipmentMaximumEquipmentSlotNumber)
        atualizarSetDiv(id);
        definePreco(precosell, cannotBeDisposed, currencySettingId)
        mudarUsagePeriod(usagePeriod)
        mudarGemSlots(0)
        mudarSoulWeapon(0, 0)
        
        document.getElementById("textCodigoItem").innerText = "Itemdata_acessory.csv | Code:";
        document.getElementById("textNomeDoItemTraduzido").innerText = "localstringdata_item_accessory.csv or localstringdata_item_accessory_02.csv | Code:";
    } else {
        alert("Invalid code!, This code is from a Ring or Necklace?");
    }
}
async function atualizarItemarmor() {
    let codigoBruto = document.getElementById("codigoItem").value.trim();
    if (!codigoBruto) {
        defaultItem(itemDefault)
    }
    let partes = codigoBruto.split(";");

    if (partes.length == 70) {
        let id = partes[0]
        let name = partes[1]
        let development = partes[2]
        let requiredLevel = partes[3]
        let limitedLevel = partes[4]
        let itemLevel = partes[5]
        let usedClass = partes[6]
        let randomAppliedClassStatus = partes[7]
        let useBy = partes[8]
        let rarity = partes[9]
        let armorType = partes[10]
        let materialType = partes[11]
        let attributeType = partes[12]
        let defenseAttributeGauge = partes[13]
        let physicalDefense = partes[14]
        let magicDefense = partes[15]
        let durability = partes[16]
        let precobuy = partes[17]
        let precosell = partes[18]
        let equipedEffect1 = partes[19]
        let equipedEffect2 = partes[20]
        let equipedEffect3 = partes[21]
        let equipedEffect4 = partes[22]
        let randomOptionsApplication = partes[23]
        let minRandomOptionsQuantity = partes[24]
        let maxRandomOptionsQuantity = partes[25]
        let optionsApplicationRatio = partes[26]
        let sealedFellowEquipmentMinimumEquipmentSlotNumber = partes[27]
        let sealedFellowEquipmentMaximumEquipmentSlotNumber = partes[28]
        let variableItem = partes[29]
        let minVariableItem = partes[30]
        let maxVariableItem = partes[31]
        let sealedFellowEquipmentSlotsNumber = partes[32]
        let soulstoneSlot1 = partes[33]
        let soulstoneSlot2 = partes[34]
        let soulstoneSlot3 = partes[35]
        let reinforcementRestriction = partes[36]
        let reinforcementProbability = partes[37]
        let cannotBeDropped = partes[38]
        let cannotBeTrade = partes[39]
        let cannotBeDisposed = partes[40]
        let cannotBeDestroyed = partes[41]
        let dropLevelCheck = partes[42]
        let binding = partes[43]
        let bindingTarget = partes[44]
        let unbindCount = partes[45]
        let useRestriction = partes[46]
        let dyeing = partes[47]
        let salesAgencyClassification = partes[48]
        let skillEffect = partes[49]
        let ignoreDropLevelCheck = partes[50]
        let usagePeriod = partes[51]
        let gradeUpcodeKey = partes[52]
        let gradeUpresult = partes[53]
        let disassemblyID = partes[54]
        let extractionID = partes[55]
        let useLevelOption = partes[56]
        let levelWeight = partes[57] 
        let overriseMax = partes[58]
        let overriseId1 = partes[59]
        let overriseId2 = partes[60]
        let overriseId3 = partes[61]
        let contentsLevel = partes[62]
        let unableToUseIntegratedChannel = partes[63]
        let reverseReinforcementRestriction = partes[64]
        let lvup = partes[65]
        let itemexp = partes[66]
        let sealStoneDuplicateEquipmentWhether = partes[67]
        let overrisematid1 = partes[68]
        let overrisematid2 = partes[69]

        document.getElementById("itemIcone").style.display = "block";
        buttonType = armorType
        carregarIconeDoItem(id)
        mudarNomeDesc(id)
        mudarStatusPrincipal("*", "*", physicalDefense, magicDefense)
        mudarCor(rarity)
        mudarLevel(requiredLevel, limitedLevel)
        mudarBinding(binding)
        mudarClasse(usedClass)
        mudarItemType(armorType)
        mudarCannot(cannotBeTrade, cannotBeDisposed, cannotBeDropped, cannotBeDestroyed)
        mudarReinforcement(reinforcementRestriction)
        mudarReverse(reverseReinforcementRestriction)
        mudarDisassembly(disassemblyID)
        mudarUnbind(unbindCount)
        mudarEquippedEffect(skillEffect)
        mudarRandomApp(randomOptionsApplication, minRandomOptionsQuantity, maxRandomOptionsQuantity)
        processarEfeitosDoItemacc(equipedEffect1, equipedEffect2, equipedEffect3, equipedEffect4, maxRandomOptionsQuantity)
        mudarSealSlots(sealedFellowEquipmentMinimumEquipmentSlotNumber, sealedFellowEquipmentMaximumEquipmentSlotNumber)
        atualizarSetDiv(id);
        definePreco(precosell, cannotBeDisposed, "*")
        mudarUsagePeriod(usagePeriod)
        mudarGemSlots(0)
        mudarSoulWeapon(0, 0)
        
        document.getElementById("textCodigoItem").innerText = "Itemdata_armor.csv | Code:";
        document.getElementById("textNomeDoItemTraduzido").innerText = "localstringdata_item_armor.csv or localstringdata_item_armor_02.csv | Code:";
    } else {
        alert("Invalid code!, This code is from a Armor?");
    }
}
async function atualizarItemWeapon() {
    let codigoBruto = document.getElementById("codigoItem").value.trim();
    if (!codigoBruto) {
        defaultItem(itemDefault)
    }
    let partes = codigoBruto.split(";");

    if (partes.length == 90) {
        let id = partes[0]
        let name = partes[1]
        let development = partes[2]
        let requiredLevel = partes[3]
        let limitedLevel = partes[4]
        let itemLevel = partes[5]
        let usedClass = partes[6]
        let randomAppliedClassStatus = partes[7]
        let useBy = partes[8]
        let rarity = partes[9]
        let equippedType = partes[10]
        let weaponType = partes[11]
        let attackRangeType = partes[12]
        let attributeType = partes[13]
        let gaugeIncreaseAmount = partes[14]
        let range = partes[15]
        let airRange = partes[16]
        let minPhysicalAttack = partes[17]
        let maxPhysicalAttack = partes[18]
        let projectileSpeed = partes[19]
        let attackSpeed = partes[20]
        let durability = partes[21]
        let precobuy = partes[22]
        let precosell = partes[23]
        let physicalAccurrancy = partes[24]
        let magicalAccurrancy = partes[25]
        let physicalCriticalRate = partes[26]
        let magicalCriticalRate = partes[27]
        let physicalCriticalDmg = partes[28]
        let magicalCriticalDmg = partes[29]
        let weaponBlockProb = partes[30]
        let equipedEffect1 = partes[31]
        let equipedEffect2 = partes[32]
        let equipedEffect3 = partes[33]
        let equipedEffect4 = partes[34]
        let randomOptionsApplication = partes[35]
        let minRandomOptionsQuantity = partes[36]
        let maxRandomOptionsQuantity = partes[37]
        let optionsApplicationRatio = partes[38]
        let sealedFellowSlotsWhenDropped = partes[39]
        let sealedFellowEquipmentMinimumEquipmentSlotNumber = partes[40]
        let sealedFellowEquipmentMaximumEquipmentSlotNumber = partes[41]
        let sealedFellowEquipmentMinimumProductionSlotNumber = partes[42]
        let sealedFellowEquipmentMaximumProductionSlotNumber = partes[43]
        let productionSucessSealedSlot = partes[44]
        let minVariableItem = partes[45]
        let maxVariableItem = partes[46]
        let sealedFellowEquipmentSlotsNumber = partes[47]
        let soulstoneSlot1 = partes[48]
        let soulstoneSlot2 = partes[49]
        let soulstoneSlot3 = partes[50]
        let reinforcementRestriction = partes[51]
        let reinforcementProbability = partes[52]
        let cannotBeDropped = partes[53]
        let cannotBeTrade = partes[54]
        let cannotBeDisposed = partes[55]
        let cannotBeDestroyed = partes[56]
        let dropLevelCheck = partes[57]
        let binding = partes[58]
        let bindingTarget = partes[59]
        let unbindCount = partes[60]
        let useRestriction = partes[61]
        let dyeing = partes[62]
        let salesAgencyClassification = partes[63]
        let skillEffect = partes[64]
        let ignoreDropLevelCheck = partes[65]
        let usagePeriod = partes[66]
        let gradeUpcodeKey = partes[67]
        let gradeUpresult = partes[68]
        let disassemblyID = partes[69]
        let extractionID = partes[70]
        let useLevelOption = partes[71]
        let levelWeight = partes[72]
        let overriseMax = partes[73]
        let overriseId1 = partes[74]
        let overriseId2 = partes[75]
        let overriseId3 = partes[76]
        let contentsLevel = partes[77]
        let unableToUseIntegratedChannel = partes[78]
        let reverseReinforcementRestriction = partes[79]
        let awakenCheck = partes[80]
        let awakenBead1 = partes[81]
        let awakenBead2 = partes[82]
        let lvup = partes[83]
        let itemexp = partes[84]
        let sealStoneDuplicateEquipmentWhether = partes[85]
        let chargeWeapon = partes[86]
        let chargeMax = partes[87]
        let overrisematid1 = partes[88]
        let overrisematid2 = partes[89]

        document.getElementById("itemIcone").style.display = "block";
        buttonType = weaponType
        carregarIconeDoItem(id)
        mudarNomeDesc(id)
        mudarStatusPrincipal(minPhysicalAttack, maxPhysicalAttack, "*", "*")
        mudarCor(rarity)
        mudarLevel(requiredLevel, limitedLevel)
        mudarBinding(binding)
        mudarClasse(usedClass)
        mudarItemType(weaponType)
        mudarCannot(cannotBeTrade, cannotBeDisposed, cannotBeDropped, cannotBeDestroyed)
        mudarReinforcement(reinforcementRestriction)
        mudarReverse(reverseReinforcementRestriction)
        mudarDisassembly(disassemblyID)
        mudarUnbind(unbindCount)
        mudarEquippedEffect(skillEffect)
        mudarRandomApp(randomOptionsApplication, minRandomOptionsQuantity, maxRandomOptionsQuantity)
        processarEfeitosDoItemacc(equipedEffect1, equipedEffect2, equipedEffect3, equipedEffect4, maxRandomOptionsQuantity)
        mudarSealSlots(sealedFellowEquipmentMinimumEquipmentSlotNumber, sealedFellowEquipmentMaximumEquipmentSlotNumber)
        atualizarSetDiv(id);
        definePreco(precosell, cannotBeDisposed, "*")
        mudarUsagePeriod(usagePeriod)
        mudarGemSlots(0)
        mudarSoulWeapon(chargeMax, chargeWeapon)
        
        document.getElementById("textCodigoItem").innerText = "Itemdata_weapon.csv | Code:";
        document.getElementById("textNomeDoItemTraduzido").innerText = "localstringdata_item_weapon.csv or localstringdata_item_weapon_02.csv | Code:";
    } else {
        alert("Invalid code!, This code is from a Weapon?");
    }
}
async function atualizarItemBracelet() {
    let codigoBruto = document.getElementById("codigoItem").value.trim();
    if (!codigoBruto) {
        defaultItem(itemDefault)
    }
    let partes = codigoBruto.split(";");

    if (partes.length == 45) {
        let id = partes[0]
        let name = partes[1]
        let development = partes[2]
        let requiredLevel = partes[3]
        let limitedLevel = partes[4]
        let itemLevel = partes[5]
        let usedClass = partes[6]
        let randomAppliedClassStatus = partes[7]
        let useBy = partes[8]
        let rarity = partes[9]
        let accessoryType = partes[10]
        let durability = partes[11]
        let precobuy = partes[12]
        let precosell = partes[13]
        let magicDefense = partes[14]
        let equipedEffect1 = partes[15]
        let equipedEffect2 = partes[16]
        let equipedEffect3 = partes[17]
        let equipedEffect4 = partes[18]
        let randomOptionsApplication = partes[19]
        let minRandomOptionsQuantity = partes[20]
        let maxRandomOptionsQuantity = partes[21]
        let optionsApplicationRatio = partes[22]
        let variableItem = partes[23]
        let minVariableItem = partes[24]
        let maxVariableItem = partes[25]
        let reinforcementRestriction = partes[26]
        let reinforcementProbability = partes[27]
        let cannotBeDropped = partes[28]
        let cannotBeTrade = partes[29]
        let cannotBeDisposed = partes[30]
        let cannotBeDestroyed = partes[31]
        let dropLevelCheck = partes[32]
        let binding = partes[33]
        let bindingTarget = partes[34]
        let unbindCount = partes[35]
        let useRestriction = partes[36]
        let salesAgencyClassification = partes[37]
        let skillEffect = partes[38]
        let ignoreDropLevelCheck = partes[39]
        let usagePeriod = partes[40]
        let maxGemSlots = partes[41]
        let contentsLevel = partes[42]
        let unableToUseIntegratedChannel = partes[43]
        let purchaseRestriction = partes[44]

        // buttonType = "brace"
        // carregarIconeDoItem(id)
        mudarNomeDesc(id)
        mudarStatusPrincipal("*", "*", "*", magicDefense)
        mudarCor(rarity)
        mudarLevel(requiredLevel, limitedLevel)
        mudarBinding(binding)
        mudarClasse(usedClass)
        mudarItemType(accessoryType)
        mudarCannot(cannotBeTrade, cannotBeDisposed, cannotBeDropped, cannotBeDestroyed)
        mudarReinforcement("brace")
        mudarUnbind(unbindCount)
        mudarEquippedEffect(skillEffect)
        mudarRandomApp(randomOptionsApplication, minRandomOptionsQuantity, maxRandomOptionsQuantity)
        processarEfeitosDoItemacc(equipedEffect1, equipedEffect2, equipedEffect3, equipedEffect4, maxRandomOptionsQuantity)
        atualizarSetDiv(id);
        definePreco(precosell, cannotBeDisposed, "*")
        mudarUsagePeriod(usagePeriod)
        mudarGemSlots(maxGemSlots)
        mudarSoulWeapon(0, 0)
        
        document.getElementById("itemIcone").style.display = "none";
        document.getElementById("unbinds").style.display = "none";
        document.getElementById("naopodeunbind").style.display = "none";
        
        document.getElementById("textCodigoItem").innerText = "Itemdata_bracelet.csv | Code:";
        document.getElementById("textNomeDoItemTraduzido").innerText = "localstringdata_item_bracelet.csv | Code:";
    } else {
        alert("Invalid code!, This code is from a Bracelet?");
    }
}
async function atualizarItemRelic() {
    let codigoBruto = document.getElementById("codigoItem").value.trim();
    if (!codigoBruto) {
        defaultItem(itemDefault)
    }
    let partes = codigoBruto.split(";");

    if (partes.length == 53) {
        let id = partes[0]
        let name = partes[1]
        let requiredLevel = partes[2]
        let limitedLevel = partes[3]
        let itemLevel = partes[4]
        let usedClass = partes[5]
        let randomAppliedClassStatus = partes[6]
        let useBy = partes[7]
        let rarity = partes[8]
        let rarityplus = partes[9]
        let relicType = partes[10]
        let durability = partes[11]
        let precobuy = partes[12]
        let precosell = partes[13]
        let magicDefense = partes[14]
        let equipedEffect1 = partes[15]
        let equipedEffect2 = partes[16]
        let equipedEffect3 = partes[17]
        let equipedEffect4 = partes[18]
        let randomOptionsApplication = partes[19]
        let minRandomOptionsQuantity = partes[20]
        let maxRandomOptionsQuantity = partes[21]
        let optionsApplicationRatio = partes[22]
        let variableItem = partes[23]
        let minVariableItem = partes[24]
        let maxVariableItem = partes[25]
        let reinforcementRestriction = partes[26]
        let reinforcementProbability = partes[27]
        let cannotBeDropped = partes[28]
        let cannotBeTrade = partes[29]
        let cannotBeDisposed = partes[30]
        let cannotBeDestroyed = partes[31]
        let dropLevelCheck = partes[32]
        let binding = partes[33]
        let bindingTarget = partes[34]
        let unbindCount = partes[35]
        let useRestriction = partes[36]
        let dyeing = partes[37]
        let salesAgencyClassification = partes[38]
        let skillEffect = partes[39]
        let ignoreDropLevelCheck = partes[40]
        let usagePeriod = partes[41]
        let disassemblyID = partes[42]
        let extractionID = partes[43]
        let sealedFellowEquipmentMaximumEquipmentSlotNumber = partes[44]
        let useLevelOption = partes[45]
        let levelWeight = partes[46]
        let overriseMax = partes[47]
        let overriseId1 = partes[48]
        let overriseId2 = partes[49]
        let contentsLevel = partes[50]
        let unableToUseIntegratedChannel = partes[51]
        let reverseReinforcementRestriction = partes[52]

        console.log(mapaDeTraducoes[id])
        document.getElementById("itemIcone").style.display = "block";
        buttonType = relicType
        carregarIconeDoItem(id)
        mudarNomeDesc(id)
        mudarStatusPrincipal("*", "*", "*", magicDefense)
        mudarCor(rarity)
        mudarLevel(requiredLevel, limitedLevel)
        mudarBinding(binding)
        mudarClasse(usedClass)
        mudarItemType(relicType)
        mudarCannot(cannotBeTrade, cannotBeDisposed, cannotBeDropped, cannotBeDestroyed)
        mudarReinforcement(reinforcementRestriction)
        mudarReverse(reverseReinforcementRestriction)
        mudarDisassembly(disassemblyID)
        mudarUnbind(unbindCount)
        mudarEquippedEffect(skillEffect)
        mudarRandomApp(randomOptionsApplication, minRandomOptionsQuantity, maxRandomOptionsQuantity)
        processarEfeitosDoItemacc(equipedEffect1, equipedEffect2, equipedEffect3, equipedEffect4, maxRandomOptionsQuantity)
        mudarSealSlots(0, sealedFellowEquipmentMaximumEquipmentSlotNumber)
        atualizarSetDiv(id);
        definePreco(precosell, cannotBeDisposed, "*")
        mudarUsagePeriod(usagePeriod)
        mudarGemSlots(0)
        mudarSoulWeapon(0, 0)
        
        document.getElementById("unbinds").style.display = "none";
        document.getElementById("naopodeunbind").style.display = "none";
        
        document.getElementById("textCodigoItem").innerText = "Itemdata_relic.csv | Code:";
        document.getElementById("textNomeDoItemTraduzido").innerText = "localstringdata_item_event.csv | Code:";
    } else {
        alert("Invalid code!, This code is Relic?");
    }
}

function contarValoresNaLinha(linha) {
    let valores = linha.split(";");
    return valores.length;
}
function checkCodigoBruto(codigoBruto) {
    
    if (!codigoBruto) {
        defaultItem(itemDefault)
    }

    let partes = codigoBruto.split(";");
    if (partes.length <= 45) {
        atualizarItemBracelet()
    } else if (partes.length >= 46 && partes.length <= 53) {
        atualizarItemRelic()
    } else if (partes.length >= 54 && partes.length <= 66) {
        atualizarItemacc()
    } else if (partes.length >= 67 && partes.length <= 70) {
        atualizarItemarmor()
    } else if (partes.length >= 71 && partes.length <= 90) {
        atualizarItemWeapon()
    } else {
        alert("Invalid code!, This code could not be recognized, please check Code again." + " " + codigoBruto);
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
            let id = ids[index]; // Pega o ID atual
            mudarItem(id); // Chama a fun??o com o ID encontrado
            index++; // Avan?a no array
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
async function inicializarPagina() {
    await carregarCSV()
    await carregarTraducoes()
    await carregarEffectTranslations()
    await carregarSetNameTranslations()
    loadButton()

    codigoOriginal = defaultItem(itemDefault)
    let codigoBruto = document.getElementById("codigoItem").value.trim();
    checkCodigoBruto(codigoBruto)
}

window.onload = inicializarPagina
