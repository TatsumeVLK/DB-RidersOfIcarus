// --------- //
// Variables //
// --------- //
const buttonItems = [
    "../database/button/itemdata_accessory.csv",
    "../database/button/itemdata_armor.csv",
    "../database/button/itemdata_weapon.csv"
]
const buttonIcons = "../database/itemdata/itemres_accessory.csv"
const buttonType = document.getElementById("config").getAttribute("data-button-type");
const itemDefault = document.getElementById("config").getAttribute("data-item-default");

const itemInformations = [
    "../database/itemdata/itemdata_accessory.csv",
    "../database/itemdata/itemdata_armor.csv",
    "../database/itemdata/itemdata_weapon.csv"
]
const itemTranslations = [
    "../database/translate/localstringdata_item_accessory.csv",
    "../database/translate/localstringdata_item_accessory_02.csv",
    "../database/translate/localstringdata_item_armor.csv",
    "../database/translate/localstringdata_item_armor_02.csv",
    "../database/translate/localstringdata_item_weapon.csv",
    "../database/translate/localstringdata_item_weapon_02.csv"
];
// AC_A_600_6003
const effectsTranslation = "../database/translate/minhatraducao.csv"
let mapaDeTraducoes = {}
let itemArray = []
let itemSetData = [];      // Dados do arquivo itemset_setcharacter.csv
let setNameMap = {};       // Mapeamento do arquivo localstringdata_item_setitem.csv
let effectMap = {};        // Mapeamento do arquivo minhatraducao.csv

let codigoOriginal = itemDefault// n찾o mexer aqui <<

// ------------------ //
// Carrega a Arquivos //
// ------------------ //
async function loadButton() {
    const container = document.getElementById("botaoContainer");
    container.innerHTML = ""; // Limpa os bot천es existentes

    let mapaDeIcones = {};
    let lines = [];

    // ??Carregar 챠cones primeiro
    const responseI = await fetch(buttonIcons + "?nocache=" + new Date().getTime());
    const textI = await responseI.text();
    const linesI = textI.trim().split(/\r?\n/);
    
    linesI.forEach(lineI => {
        const [idI, iconI] = lineI.split(';');
        mapaDeIcones[idI.trim()] = iconI.trim();
    });

    // ??Carregar os arquivos do array
    for (const file of buttonItems) {
        const response = await fetch(file + "?nocache=" + new Date().getTime());
        const text = await response.text();
        const fileLines = text.trim().split(/\r?\n/);
        fileLines.shift(); // Remove o cabe챌alho
        lines.push(...fileLines);
    }

    // ??Criar bot천es para cada item
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
        
        let iconFileName = mapaDeIcones[id] || "favicon";
        img.src = `../imgs/${iconFileName}.png`;

        // ??Verifica se a imagem existe
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

    // ??Aguarda a tradu챌찾o dos nomes
    await carregarTraducoes(); 
    
    if (!mapaDeTraducoes || Object.keys(mapaDeTraducoes).length === 0) {
        console.warn("mapaDeTraducoes ainda n찾o carregado.");
        return;
    }

    // ??Atualiza os nomes dos itens
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

                    if (id.endsWith("_Name")) {
                        id = id.replace("_Name", "");
                        mapaDeTraducoes[id] = { nome: textoTraduzido };
                    } else if (id.endsWith("_Description")) {
                        id = id.replace("_Description", "");
                        if (!mapaDeTraducoes[id]) mapaDeTraducoes[id] = {};
                        mapaDeTraducoes[id].descricao = textoTraduzido.replace(/<[^>]+>/g, "").trim()
                    }
                })
            })
            .catch(error => console.error(`? Error in ${arquivo}:`, error))
    );

    await Promise.all(promessas); // Aguarda todos os arquivos carregarem
}

async function carregarCSV() {
    let allItems = []; // Array para armazenar todos os itens carregados

    // Usando Promise.all para carregar todos os arquivos ao mesmo tempo
    const promises = itemInformations.map(async (file) => {
        const response = await fetch(file + "?nocache=" + new Date().getTime());
        const blob = await response.blob(); // Obt챕m os dados como um Blob
        const reader = new FileReader();

        return new Promise((resolve, reject) => {
            reader.onload = function () {
                try {
                    const text = new TextDecoder("euc-kr").decode(reader.result); // Decodifica como EUC-KR
                    Papa.parse(text, {
                        delimiter: ";",
                        header: true,
                        skipEmptyLines: true,
                        complete: function (parsed) {
                            // Adiciona os itens carregados ao array allItems
                            allItems = allItems.concat(parsed.data);
                            resolve();
                        },
                        error: function (error) {
                            reject(error);
                        }
                    });
                } catch (error) {
                    reject(error);
                }
            };

            reader.readAsArrayBuffer(blob);
        });
    });

    // Espera que todas as promessas sejam resolvidas
    await Promise.all(promises);

    // Quando todos os arquivos forem carregados, voc챗 pode usar o array allItems
    itemArray = allItems;
}


async function carregarEffectTranslations() {
    const response = await fetch(effectsTranslation + "?nocache=" + new Date().getTime());
    let text = await response.text();
    let parsed = Papa.parse(text, { header: true, skipEmptyLines: true, delimiter: "," });
  
    let effectMap = {};
  
    parsed.data.forEach(row => {
      if (row.t_key && row.t_eng) {
        let key = row.t_key.trim();
        effectMap[key] = row.t_eng.trim();
      }
    });
    return effectMap;
}

async function carregarIconeDoItem(itemID) {
    const response = await fetch(buttonIcons + "?nocache=" + new Date().getTime());
    const text = await response.text();
    const lines = text.trim().split(/\r?\n/);

    // Pular o cabe챌alho
    // lines.shift();

    let iconeEncontrado = null;

    for (let line of lines) {
        const [id, icon] = line.split(';');
        if (id === itemID) {
            iconeEncontrado = icon;
            break;
        }
    }

    let imgElement = document.getElementById("itemIcone");
    let img = new Image();

    if (iconeEncontrado) {
        imgElement.src = `../imgs/${iconeEncontrado}.png`;
    } else {
        imgElement.src = `../imgs/favicon.png`;
    }
}

async function carregarItemSetData() {
    const response = await fetch("../database/itemdata/itemset_setcharacter.csv" + "?nocache=" + new Date().getTime());
    const buffer = await response.arrayBuffer(); // L챗 como array buffer
    const text = new TextDecoder("euc-kr").decode(buffer); // Decodifica como EUC-KR
    let parsed = Papa.parse(text, { 
        header: true, 
        skipEmptyLines: true, 
        delimiter: ";" 
    });
    itemSetData = parsed.data;
}

async function carregarSetNameTranslations() {
    const response = await fetch("../database/translate/localstringdata_item_setitem.csv" + "?nocache=" + new Date().getTime());
    const text = await response.text();
    // Faz o parse do CSV usando v챠rgula como delimitador
    let parsed = Papa.parse(text, { header: true, skipEmptyLines: true, delimiter: "," });
    
    parsed.data.forEach(row => {
      if (row.t_key && row.t_korean) {
        // Remove os '^' e o sufixo _Name, converte a chave para min첬sculo para padroniza챌찾o
        let key = row.t_key.replace(/\^/g, "").replace("_Name", "").trim().toLowerCase();

        // Armazena a tradu챌찾o exatamente como est찼 (mantendo a case original)
        setNameMap[key] = row.t_korean.replace(/\^/g, "").trim();
      }
    });
  }

async function carregarDadosSets() {
  await Promise.all([
    carregarItemSetData(),
    carregarSetNameTranslations(),
    carregarEffectTranslations()
  ]);
}

async function atualizarSetEffect(setRow, countEffect, effectPrefix, skillId, containerId) {
    let effectMap = await carregarEffectTranslations();
    let container = document.getElementById(containerId);
    if (!container) return;
    container.style.display = "none";

    if (countEffect > 0) {

        for (let j = 1; j <= 4; j++) {
            let effectElem = document.getElementById(`${effectPrefix}${j}`);

            let effectField = setRow[`${effectPrefix}${j}`];
            if (effectField && effectField.trim() !== "*") {
                let effectStr = effectField.replace(/[(\')]/g, "").split(",");
                let chaveOriginal = effectStr[0].trim();
                let valorStr = effectStr[1] ? effectStr[1].trim() : "";

                let simbolo = "";
                if (chaveOriginal.endsWith("%") || chaveOriginal.endsWith("+")) {
                    simbolo = chaveOriginal.slice(-1);
                    chaveOriginal = chaveOriginal.slice(0, -1).trim();
                }

                let traducao = effectMap[chaveOriginal] || chaveOriginal;

                let valorNumerico = parseFloat(valorStr);
                let sinal = "";
                if (simbolo === "+" && valorNumerico > 0) {
                    sinal = "+";
                }

                let efeitoFinal = traducao;
                if (!isNaN(valorNumerico)) {
                    efeitoFinal += simbolo === "%" ? ` ${sinal}${valorNumerico}%` : ` ${sinal}${valorNumerico}`;
                }

                effectElem.innerText = efeitoFinal;
                effectElem.style.display = "flex";
                container.style.display = "block";
            } else {
                effectElem.style.display = "none";
            }
        }

        // Atualiza a skill
        let skillElem = document.getElementById(skillId);
        if (skillElem && skillElem != 0.000000) {
            let skillText = setRow[skillId];
            skillElem.innerText = skillText && skillText.trim() !== "*" ? skillText.trim() : "";
        }
    } else {
        // Se countEffect for 0, oculta o container
        container.style.display = "none";
    }
}

async function atualizarSetDiv(itemID) {
    // Carrega os dados, se ainda n찾o estiverem carregados
    await carregarDadosSets();
  
    const setDiv = document.getElementById("setdivcompleto");
    if (!setDiv) return;
    const container = document.getElementById("t_item");
    // Procura uma linha em itemSetData onde algum dos campos t_item1 a t_item14 seja igual ao itemID
    let setRow = itemSetData.find(row => {
        for (let i = 1; i <= 14; i++) {
            let campo = row[`t_item${i}`];
            if (campo && campo.trim() === itemID) {
                return true;
            }
        }
        return false;
    });
  
    if (!setRow) {
      // Item n찾o faz parte de nenhum set: oculta a div
      setDiv.style.display = "none";
      return;
    }
  
    // Caso o item fa챌a parte do set, mostra a div
    setDiv.style.display = "block";
  
    // Atualiza o nome do set
    let setID = setRow.t_setid.trim().toLowerCase(); // Por exemplo, "Setall31"
    let setNameTraduzido = setNameMap[setID] || setID;
  
    // Conta quantos itens fazem parte do set (t_item1 a t_item14 que n찾o s찾o "*")
    let countItems = 0;
    for (let i = 1; i <= 14; i++) {
        let campo = setRow[`t_item${i}`];
        let elem = document.getElementById(`t_item${i}`);
        if (campo && campo.trim() !== "*") {
            countItems++;

            if (elem) {
                elem.innerText = mapaDeTraducoes[campo]?.nome || campo;
                elem.style.display = "block";  // Certifica que est찼 vis챠vel
                elem.setAttribute("onclick", `mudarItem('${campo}')`);
            }
        } else {
            if (elem) {
                elem.innerText = "";
                elem.style.display = "none";   // Oculta se for "*"
            }
        }
    }
    document.getElementById("setname").innerText = setNameTraduzido + " (0/" + countItems + ")";

    // Atualiza os efeitos do set para o grupo 1 como exemplo
    // Verifica se seteffect1_count 챕 maior que 0
    let countEffect1 = parseInt(setRow.seteffect1_count);
    let countEffect2 = parseInt(setRow.seteffect2_count);
    let countEffect3 = parseInt(setRow.seteffect3_count);
    let countEffect4 = parseInt(setRow.seteffect4_count);
    let countEffect5 = parseInt(setRow.seteffect5_count);
    let countEffect6 = parseInt(setRow.seteffect6_count);
    let countEffect7 = parseInt(setRow.seteffect7_count);
    let countEffect8 = parseInt(setRow.seteffect8_count);

    document.getElementById("seteffect1").innerText = `Set Effects (${countEffect1})`;
    document.getElementById("seteffect2").innerText = `Set Effects (${countEffect2})`;
    document.getElementById("seteffect3").innerText = `Set Effects (${countEffect3})`;
    document.getElementById("seteffect4").innerText = `Set Effects (${countEffect4})`;
    document.getElementById("seteffect5").innerText = `Set Effects (${countEffect5})`;
    document.getElementById("seteffect6").innerText = `Set Effects (${countEffect6})`;
    document.getElementById("seteffect7").innerText = `Set Effects (${countEffect7})`;
    document.getElementById("seteffect8").innerText = `Set Effects (${countEffect8})`;

    // Atualiza os efeitos:
    atualizarSetEffect(setRow, countEffect1, "t_seteffect1_effect", "t_seteffect1_skill", "hasseteffect1")
    atualizarSetEffect(setRow, countEffect2, "t_seteffect2_effect", "t_seteffect2_skill", "hasseteffect2")
    atualizarSetEffect(setRow, countEffect3, "t_seteffect3_effect", "t_seteffect3_skill", "hasseteffect3")
    atualizarSetEffect(setRow, countEffect4, "t_seteffect4_effect", "t_seteffect4_skill", "hasseteffect4")
    atualizarSetEffect(setRow, countEffect5, "t_seteffect5_effect", "t_seteffect5_skill", "hasseteffect5")
    atualizarSetEffect(setRow, countEffect6, "t_seteffect6_effect", "t_seteffect6_skill", "hasseteffect6")
    atualizarSetEffect(setRow, countEffect7, "t_seteffect7_effect", "t_seteffect7_skill", "hasseteffect7")
    atualizarSetEffect(setRow, countEffect8, "t_seteffect8_effect", "t_seteffect8_skill", "hasseteffect8")
    
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

async function processarEfeitosDoItemacc() {
    let effectMap = await carregarEffectTranslations();
    let codigoBruto = document.getElementById("codigoItem").value.trim();

    if (!codigoBruto) return;

    let partes = codigoBruto.split(";");
    let efeitos = [partes[17], partes[18], partes[19], partes[20]]; // Efeitos do item

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
        let termoBase = (simbolo === "%" || simbolo === "+") ? termoOriginal.slice(0, -1).trim() : termoOriginal.trim();

        let termoTraduzido = effectMap[termoBase] || termoBase;

        let efeitoFinal = termoTraduzido;

        if (valorNumerico !== null) {
            let numero = parseFloat(valorNumerico);
            if (simbolo === "%" && numero > 0) {
                efeitoFinal += ` +${numero}%`;
            } else if (simbolo === "%" && numero < 0) {
                efeitoFinal += ` ${numero}%`;
            } else if (simbolo === "+") {
                efeitoFinal += numero > 0 ? ` +${numero}` : ` ${numero}`;
            } else {
                efeitoFinal += ` ${numero}`;
            }
        }

        elementoEfeito.innerText = efeitoFinal;
        elementoEfeito.parentElement.style.display = "block";
    });
}

async function processarEfeitosDoItemarmor() {
    let effectMap = await carregarEffectTranslations();
    let codigoBruto = document.getElementById("codigoItem").value.trim();

    if (!codigoBruto) return;

    let partes = codigoBruto.split(";");
    let efeitos = [partes[19], partes[20], partes[21], partes[22]]; // Efeitos do item

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
        let termoBase = (simbolo === "%" || simbolo === "+") ? termoOriginal.slice(0, -1).trim() : termoOriginal.trim();

        let termoTraduzido = effectMap[termoBase] || termoBase;

        let efeitoFinal = termoTraduzido;

        if (valorNumerico !== null) {
            let numero = parseFloat(valorNumerico);
            if (simbolo === "%" && numero > 0) {
                efeitoFinal += ` +${numero}%`;
            } else if (simbolo === "%" && numero < 0) {
                efeitoFinal += ` ${numero}%`;
            } else if (simbolo === "+") {
                efeitoFinal += numero > 0 ? ` +${numero}` : ` ${numero}`;
            } else {
                efeitoFinal += ` ${numero}`;
            }
        }

        elementoEfeito.innerText = efeitoFinal;
        elementoEfeito.parentElement.style.display = "block";
    });
}

async function processarEfeitosDoItemWeapon() {
    let effectMap = await carregarEffectTranslations();
    let codigoBruto = document.getElementById("codigoItem").value.trim();

    if (!codigoBruto) return;

    let partes = codigoBruto.split(";");
    let efeitos = [partes[31], partes[32], partes[33], partes[34]]; // Efeitos do item

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
        let termoBase = (simbolo === "%" || simbolo === "+") ? termoOriginal.slice(0, -1).trim() : termoOriginal.trim();

        let termoTraduzido = effectMap[termoBase] || termoBase;

        let efeitoFinal = termoTraduzido;

        if (valorNumerico !== null) {
            let numero = parseFloat(valorNumerico);
            if (simbolo === "%" && numero > 0) {
                efeitoFinal += ` +${numero}%`;
            } else if (simbolo === "%" && numero < 0) {
                efeitoFinal += ` ${numero}%`;
            } else if (simbolo === "+") {
                efeitoFinal += numero > 0 ? ` +${numero}` : ` ${numero}`;
            } else {
                efeitoFinal += ` ${numero}`;
            }
        }

        elementoEfeito.innerText = efeitoFinal;
        elementoEfeito.parentElement.style.display = "block";
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

function atualizarItemacc() {
    let codigoBruto = document.getElementById("codigoItem").value.trim();
    if (!codigoBruto) {
        document.getElementById("codigoItem").value = itemDefault;

        codigoBruto = document.getElementById("codigoItem").value;
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
        let minimumVariableItem = partes[26]
        let maxVariableItem = partes[27]
        let reinforcementRestriction = partes[28]
        let reinforcementProbability = partes[29]
        let cannotBeDropped = partes[30]
        let cannotByTrade = partes[31]
        let cannotByDisposed = partes[32]
        let cannotByDestroyed = partes[33]
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

        let itemTraduzido = mapaDeTraducoes[id] || {}
        let nomeItem = itemTraduzido.nome || id
        let descricaoItem = itemTraduzido.descricao || "Descri챌찾o n찾o encontrada"

        document.getElementById("nomedoItemtraduzido").innerText = exibirLinhaOriginal(partes[0]);
        document.getElementById("itemNome").innerText = nomeItem;
        if (descricaoItem == "Descri챌찾o n찾o encontrada") {
            document.getElementById("description").style.display = "none";
            document.getElementById("itemdescription").style.display = "none";
        } else {
            document.getElementById("description").style.display = "block";
            document.getElementById("itemdescription").style.display = "block";
            document.getElementById("itemdescription").innerText = descricaoItem
        }

        const coresRaridade = {
            1: "#ffffff", // Branco (Comum)
            2: "#00aaFF", // Azul (Elite)
            3: "#ffcc00", // Dourado (Heroico)
            4: "#ff00ff", // Roxo (Lend찼rio)
            6: "#ffaa55",  // laranja (Unique)
            7: "#ff1155"  // Vermelho (M챠tico)
        };
        let cor = coresRaridade[parseInt(rarity)] || "#ffffff";

        let rarityT;
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
                rarityT = rarity; // Se n찾o for um dos casos, mant챕m o valor original
        }

        let bindingT;
        switch (binding) {
            case "equip":
                bindingT = "Bind on Equip";
                break;
            case "get":
                bindingT = "Bind on Pickup";
                break;
            default:
                bindingT = binding;
        }
        document.getElementById("itemBindtype").innerText = bindingT;
        
        function checkClasses() {
            let listClass = [];

            if (usedClass.includes("GD")) listClass.push("Guardian");
            if (usedClass.includes("WR")) listClass.push("Berserk");
            if (usedClass.includes("TF")) listClass.push("Trickster");
            if (usedClass.includes("AC")) listClass.push("Archer");
            if (usedClass.includes("WZ")) listClass.push("Wizard");
            if (usedClass.includes("PR")) listClass.push("Priest");
            if (usedClass.includes("DO")) listClass.push("Assassin");
            if (usedClass.includes("MG")) listClass.push("Magician");

            // Se todas as classes estiverem na string, retorna "All Classes"
            if (listClass.length === 8) {
                return "All Classes";
            }

            return listClass.length > 0 ? listClass.join(" ") : "Error";
        }
        
        document.getElementById("itemclasses").innerText = checkClasses();

        let accessoryTypeT;
        switch (accessoryType) {
            case "ri":
                accessoryTypeT = "Ring";
                break;
            case "ne":
                accessoryTypeT = "Necklace";
                break;
            default:
                accessoryTypeT = accessoryType;
        }
        

        if (disassemblyID == "*") {
            document.getElementById("naopodedismantling").style.display = "block";
        } else {
            document.getElementById("naopodedismantling").style.display = "none";
        }
        
        if (parseInt(unbindCount) == 0) {
            document.getElementById("naopodeunbind").style.display = "block";
            document.getElementById("unbinds").style.display = "none";
        } else if (parseInt(cannotByDisposed) != 0) {
            document.getElementById("naopodeunbind").style.display = "block";
            document.getElementById("unbinds").style.display = "none";
        } else {
            document.getElementById("naopodeunbind").style.display = "none";
            document.getElementById("unbinds").style.display = "block";
        }

        if (parseInt(reinforcementRestriction) == 0) {
            document.getElementById("naopodemelhorar").style.display = "block";
            document.getElementById("temperinglevel").style.display = "none";
            document.getElementById("temperingname").style.display = "none";
        } else {
            document.getElementById("naopodemelhorar").style.display = "none";
            document.getElementById("temperinglevel").style.display = "inline";
            document.getElementById("temperingname").style.display = "block";
        }

        if (randomOptionsApplication < 1) {
            document.getElementById("randomeffects").style.display = "none";
        } else {
            document.getElementById("randomeffects").style.display = "block";
            document.getElementById("efeitosaleatoriosmin").innerText = parseInt(minRandomOptionsQuantity);
            document.getElementById("efeitosaleatoriosmax").innerText = parseInt(maxRandomOptionsQuantity);
        }
        if (equipedEffect1 == "*" && equipedEffect2 == "*" && equipedEffect3 == "*" && equipedEffect4 == "*" && maxRandomOptionsQuantity < 1) {
            document.getElementById("temefeitoserandomeffects").style.display = "none";
        } else {
            document.getElementById("temefeitoserandomeffects").style.display = "block";
        }

        switch (parseInt(skillEffect)) {
            case 1:
                document.getElementById("temefeitos").style.display = "block";
                document.getElementById("oefeito").style.display = "block";
                document.getElementById("oefeito").innerText = skillEffect;
                break;
            default:
                document.getElementById("temefeitos").style.display = "none";
                document.getElementById("oefeito").style.display = "none";
        }

        if (sealedFellowEquipmentMaximumEquipmentSlotNumber == 0) {
            document.getElementById("divSlot").style.display = "none";
            document.getElementById("barraslots").style.display = "none";
        } else {
            document.getElementById("divSlot").style.display = "flex";
            document.getElementById("barraslots").style.display = "block";
            document.getElementById("selosslots").innerText = parseInt(sealedFellowEquipmentMinimumEquipmentSlotNumber) + " - " + parseInt(sealedFellowEquipmentMaximumEquipmentSlotNumber) + " Slots";
        }
        
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

        // Exibir informa챌천es b찼sicas
        carregarIconeDoItem(id)
        document.getElementById("itemNivel").innerText = parseInt(requiredLevel);
        document.getElementById("itemRaridade").innerText = rarityT;
        document.getElementById("itemMagicDefense").innerText = "Magic Defense " + parseInt(magicDefense);
        document.getElementById("tipoEquipamento").innerText = accessoryTypeT;
        document.getElementById("temperinglevel").innerText = parseInt(reinforcementRestriction);
        document.getElementById("unbinds").innerText = `Unbindings Available ${parseInt(unbindCount)}/${parseInt(unbindCount)}`;

        document.getElementById("itemRaridade").style.color = cor;
        document.getElementById("itemNome").style.color = cor;

        
        // Array para armazenar as partes do pre챌o
        let precoFormatado = [];
        // Converte para inteiro PRECO DO ITEM
        let preco = parseInt(precosell);
        let precoElemento = document.getElementById("itemPreco");
        let salePriceElemento = document.getElementById("saleprice");
        let barrasaleElemento = document.getElementById("barrasale");
        let divsaleElemento = document.getElementById("divsale");

        // Obt챕m as moedas
        let gold = Math.floor(preco / 10000);
        let silver = Math.floor((preco % 10000) / 100);
        let copper = preco % 100;
        // Define os 챠cones como imagens
        let goldIcon = '<img src="../imgs/Coingold.png" class="moeda gold" />';
        let silverIcon = '<img src="../imgs/Coinsilver.png" class="moeda silver" />';
        let copperIcon = '<img src="../imgs/Coincopper.png" class="moeda copper" />';

        switch (true) {
            case gold > 0:
                precoFormatado.push(`<span class="moeda gold">${gold}${goldIcon}</span>`);
            case silver > 0:
                precoFormatado.push(`<span class="moeda silver">${silver}${silverIcon}</span>`);
            case copper > 0:
                precoFormatado.push(`<span class="moeda copper">${copper}${copperIcon}</span>`);
        }

        if (preco > 0) {
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
        atualizarSetDiv(id);
    } else {
        alert("Invalid code!, This code is for Rings or Necklace?");
    }
}

function atualizarItemarmor() {
    let codigoBruto = document.getElementById("codigoItem").value.trim();
    if (!codigoBruto) {
        document.getElementById("codigoItem").value = itemPadrao;

        codigoBruto = document.getElementById("codigoItem").value;
    }
    let partes = codigoBruto.split(";");

    if (partes.length == 70) {let id = partes[0]
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
        let MaxRandomOptionsQuantity = partes[25]
        let optionsApplicationRatio = partes[26]
        let sealedFellowEquipmentMinimumEquipmentSlotNumber = partes[27]
        let sealedFellowEquipmentMaximumEquipmentSlotNumber = partes[28]
        let variableItem = partes[29]
        let minimumVariableItem = partes[30]
        let maxVariableItem = partes[31]
        let sealedFellowEquipmentSlotsNumber = partes[32]
        let soulstoneSlot1 = partes[33]
        let soulstoneSlot2 = partes[34]
        let soulstoneSlot3 = partes[35]
        let reinforcementRestriction = partes[36]
        let reinforcementProbability = partes[37]
        let cannotBeDropped = partes[38]
        let cannotByTrade = partes[39]
        let cannotByDisposed = partes[40]
        let cannotByDestroyed = partes[41]
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

        let itemTraduzido = mapaDeTraducoes[id] || {};
        let nomeItem = itemTraduzido.nome || id;
        let descricaoItem = itemTraduzido.descricao || "Descri챌찾o n찾o encontrada";

        document.getElementById("nomedoItemtraduzido").innerText = exibirLinhaOriginal(partes[0]);
        document.getElementById("itemNome").innerText = nomeItem;
        if (descricaoItem == "Descri챌찾o n찾o encontrada") {
            document.getElementById("description").style.display = "none";
            document.getElementById("itemdescription").style.display = "none";
        } else {
            document.getElementById("description").style.display = "block";
            document.getElementById("itemdescription").style.display = "block";
        }

        const coresRaridade = {
            1: "#ffffff", // Branco (Comum)
            2: "#00aaFF", // Azul (Elite)
            3: "#ffcc00", // Dourado (Heroico)
            4: "#ff00ff", // Roxo (Lend찼rio)
            6: "#ffaa55",  // laranja (Unique)
            7: "#ff1155"  // Vermelho (M챠tico)
        };
        let cor = coresRaridade[parseInt(rarity)] || "#ffffff";

        let rarityT;
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

        let bindingT;
        switch (binding) {
            case "equip":
                bindingT = "Bind on Equip";
                break;
            case "get":
                bindingT = "Bind on Pickup";
                break;
            default:
                bindingT = binding;
        }
        document.getElementById("itemBindtype").innerText = bindingT;

        function checkClasses() {
            let listClass = [];

            if (usedClass.includes("GD")) listClass.push("Guardian");
            if (usedClass.includes("WR")) listClass.push("Berserk");
            if (usedClass.includes("TF")) listClass.push("Trickster");
            if (usedClass.includes("AC")) listClass.push("Archer");
            if (usedClass.includes("WZ")) listClass.push("Wizard");
            if (usedClass.includes("PR")) listClass.push("Priest");
            if (usedClass.includes("DO")) listClass.push("Assassin");
            if (usedClass.includes("MG")) listClass.push("Magician");

            if (listClass.length === 8) {
                return "All Classes";
            }

            return listClass.length > 0 ? listClass.join(" ") : "Error";
        }
        
        document.getElementById("itemclasses").innerText = checkClasses();

        let armorTypeT;
        switch (armorType) {
            case "ha":
                armorTypeT = "Hat";
                break;
            case "sh":
                armorTypeT = "Shoulders";
                break;
            case "ja":
                armorTypeT = "Chest";
                break;
            case "gl":
                armorTypeT = "Gloves";
                break;
            case "bo":
                armorTypeT = "Boots";
                break;
            default:
                armorTypeT = armorType;
        }
        

        if (disassemblyID == "*") {
            document.getElementById("naopodedismantling").style.display = "block";
        } else {
            document.getElementById("naopodedismantling").style.display = "none";
        }
        
        if (parseInt(unbindCount) == 0) {
            document.getElementById("naopodeunbind").style.display = "block";
            document.getElementById("unbinds").style.display = "none";
        } else if (parseInt(cannotByDisposed) != 0) {
            document.getElementById("naopodeunbind").style.display = "block";
            document.getElementById("unbinds").style.display = "none";
        } else {
            document.getElementById("naopodeunbind").style.display = "none";
            document.getElementById("unbinds").style.display = "block";
        }

        if (parseInt(reinforcementRestriction) == 0) {
            document.getElementById("naopodemelhorar").style.display = "block";
            document.getElementById("temperinglevel").style.display = "none";
            document.getElementById("temperingname").style.display = "none";
        } else {
            document.getElementById("naopodemelhorar").style.display = "none";
            document.getElementById("temperinglevel").style.display = "inline";
            document.getElementById("temperingname").style.display = "block";
        }

        if (randomOptionsApplication < 1) {
            document.getElementById("randomeffects").style.display = "none";
        } else {
            document.getElementById("randomeffects").style.display = "block";
            document.getElementById("efeitosaleatoriosmin").innerText = parseInt(minRandomOptionsQuantity);
            document.getElementById("efeitosaleatoriosmax").innerText = parseInt(MaxRandomOptionsQuantity);
        }
        if (equipedEffect1 == "*" && equipedEffect2 == "*" && equipedEffect3 == "*" && equipedEffect4 == "*" && MaxRandomOptionsQuantity < 1) {
            document.getElementById("temefeitoserandomeffects").style.display = "none";
        } else {
            document.getElementById("temefeitoserandomeffects").style.display = "block";
        }

        switch (parseInt(skillEffect)) {
            case 1:
                document.getElementById("temefeitos").style.display = "block";
                document.getElementById("oefeito").style.display = "block";
                document.getElementById("oefeito").innerText = skillEffect;
                break;
            default:
                document.getElementById("temefeitos").style.display = "none";
                document.getElementById("oefeito").style.display = "none";
        }

        if (sealedFellowEquipmentMaximumEquipmentSlotNumber == 0) {
            document.getElementById("divSlot").style.display = "none";
            document.getElementById("barraslots").style.display = "none";
        } else {
            document.getElementById("divSlot").style.display = "flex";
            document.getElementById("barraslots").style.display = "block";
            document.getElementById("selosslots").innerText = parseInt(sealedFellowEquipmentMinimumEquipmentSlotNumber) + " - " + parseInt(sealedFellowEquipmentMaximumEquipmentSlotNumber) + " Slots";
        }
        
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

        // Exibir informa챌천es b찼sicas
        carregarIconeDoItem(id)
        document.getElementById("itemNivel").innerText = parseInt(requiredLevel);
        document.getElementById("itemRaridade").innerText = rarityT;
        document.getElementById("itemMagicDefense").innerText = "Magic Defense " + parseInt(magicDefense);
        document.getElementById("tipoEquipamento").innerText = armorTypeT;
        document.getElementById("temperinglevel").innerText = parseInt(reinforcementRestriction);
        document.getElementById("unbinds").innerText = `Unbindings Available ${parseInt(unbindCount)}/${parseInt(unbindCount)}`;

        document.getElementById("itemRaridade").style.color = cor;
        document.getElementById("itemNome").style.color = cor;

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

        switch (true) {
            case gold > 0:
                precoFormatado.push(`<span class="moeda gold">${gold}${goldIcon}</span>`);
            case silver > 0:
                precoFormatado.push(`<span class="moeda silver">${silver}${silverIcon}</span>`);
            case copper > 0:
                precoFormatado.push(`<span class="moeda copper">${copper}${copperIcon}</span>`);
        }

        if (preco > 0) {
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
        atualizarSetDiv(id);
    } else {
        alert("Invalid code!, This code is for Armor?");
    }
}

function atualizarItemWeapon() {
    let codigoBruto = document.getElementById("codigoItem").value.trim();
    if (!codigoBruto) {
        document.getElementById("codigoItem").value = itemPadrao;

        codigoBruto = document.getElementById("codigoItem").value;
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
        let MaxRandomOptionsQuantity = partes[37]
        let optionsApplicationRatio = partes[38]
        let sealedFellowSlotsWhenDropped = partes[39]
        let sealedFellowEquipmentMinimumEquipmentSlotNumber = partes[40]
        let sealedFellowEquipmentMaximumEquipmentSlotNumber = partes[41]
        let sealedFellowEquipmentMinimumProductionSlotNumber = partes[42]
        let sealedFellowEquipmentMaximumProductionSlotNumber = partes[43]
        let productionSucessSealedSlot = partes[44]
        let minimumVariableItem = partes[45]
        let maxVariableItem = partes[46]
        let sealedFellowEquipmentSlotsNumber = partes[47]
        let soulstoneSlot1 = partes[48]
        let soulstoneSlot2 = partes[49]
        let soulstoneSlot3 = partes[50]
        let reinforcementRestriction = partes[51]
        let reinforcementProbability = partes[52]
        let cannotBeDropped = partes[53]
        let cannotByTrade = partes[54]
        let cannotByDisposed = partes[55]
        let cannotByDestroyed = partes[56]
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

        let itemTraduzido = mapaDeTraducoes[id] || {};
        let nomeItem = itemTraduzido.nome || id;
        let descricaoItem = itemTraduzido.descricao || "Descri챌찾o n찾o encontrada";

        document.getElementById("nomedoItemtraduzido").innerText = exibirLinhaOriginal(partes[0]);
        document.getElementById("itemNome").innerText = nomeItem;
        if (descricaoItem == "Descri챌찾o n찾o encontrada") {
            document.getElementById("description").style.display = "none";
            document.getElementById("itemdescription").style.display = "none";
        } else {
            document.getElementById("description").style.display = "block";
            document.getElementById("itemdescription").style.display = "block";
        }

        const coresRaridade = {
            1: "#ffffff", // Branco (Comum)
            2: "#00aaFF", // Azul (Elite)
            3: "#ffcc00", // Dourado (Heroico)
            4: "#ff00ff", // Roxo (Lend찼rio)
            6: "#ffaa55",  // laranja (Unique)
            7: "#ff1155"  // Vermelho (M챠tico)
        };
        let cor = coresRaridade[parseInt(rarity)] || "#ffffff";

        let rarityT;
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

        let bindingT;
        switch (binding) {
            case "equip":
                bindingT = "Bind on Equip";
                break;
            case "get":
                bindingT = "Bind on Pickup";
                break;
            default:
                bindingT = binding;
        }
        document.getElementById("itemBindtype").innerText = bindingT;

        function checkClasses() {
            let listClass = [];

            if (usedClass.includes("GD")) listClass.push("Guardian");
            if (usedClass.includes("WR")) listClass.push("Berserk");
            if (usedClass.includes("TF")) listClass.push("Trickster");
            if (usedClass.includes("AC")) listClass.push("Archer");
            if (usedClass.includes("WZ")) listClass.push("Wizard");
            if (usedClass.includes("PR")) listClass.push("Priest");
            if (usedClass.includes("DO")) listClass.push("Assassin");
            if (usedClass.includes("MG")) listClass.push("Magician");

            if (listClass.length === 8) {
                return "All Classes";
            }

            return listClass.length > 0 ? listClass.join(" ") : "Error";
        }
        
        document.getElementById("itemclasses").innerText = checkClasses();

        let weaponTypeT;
        switch (weaponType) {
            case "s1":
                weaponTypeT = "Sword";
                break;
            case "s2":
                weaponTypeT = "Greatsword";
                break;
            case "d1":
                weaponTypeT = "Daggers";
                break;
            case "m1":
                weaponTypeT = "Scepter";
                break;
            case "m2":
                weaponTypeT = "Staff";
                break;
            case "b1":
                weaponTypeT = "Shortbow";
                break;
            case "W1":
                weaponTypeT = "Wand";
                break;
            case "h2":
                weaponTypeT = "Axe";
                break;
            case "a2":
                weaponTypeT = "Axe";
                break;
            case "b2":
                weaponTypeT = "Bow";
                break;
            case "l2":
                weaponTypeT = "Lance";
                break;
            case "c2":
                weaponTypeT = "Crossbow";
                break;
            default:
                weaponTypeT = weaponType;
        }
        

        if (disassemblyID == "*") {
            document.getElementById("naopodedismantling").style.display = "block";
        } else {
            document.getElementById("naopodedismantling").style.display = "none";
        }
        
        if (parseInt(unbindCount) == 0) {
            document.getElementById("naopodeunbind").style.display = "block";
            document.getElementById("unbinds").style.display = "none";
        } else if (parseInt(cannotByDisposed) != 0) {
            document.getElementById("naopodeunbind").style.display = "block";
            document.getElementById("unbinds").style.display = "none";
        } else {
            document.getElementById("naopodeunbind").style.display = "none";
            document.getElementById("unbinds").style.display = "block";
        }

        if (parseInt(reinforcementRestriction) == 0) {
            document.getElementById("naopodemelhorar").style.display = "block";
            document.getElementById("temperinglevel").style.display = "none";
            document.getElementById("temperingname").style.display = "none";
        } else {
            document.getElementById("naopodemelhorar").style.display = "none";
            document.getElementById("temperinglevel").style.display = "inline";
            document.getElementById("temperingname").style.display = "block";
        }

        if (randomOptionsApplication < 1) {
            document.getElementById("randomeffects").style.display = "none";
        } else {
            document.getElementById("randomeffects").style.display = "block";
            document.getElementById("efeitosaleatoriosmin").innerText = parseInt(minRandomOptionsQuantity);
            document.getElementById("efeitosaleatoriosmax").innerText = parseInt(MaxRandomOptionsQuantity);
        }
        if (equipedEffect1 == "*" && equipedEffect2 == "*" && equipedEffect3 == "*" && equipedEffect4 == "*" && MaxRandomOptionsQuantity < 1) {
            document.getElementById("temefeitoserandomeffects").style.display = "none";
        } else {
            document.getElementById("temefeitoserandomeffects").style.display = "block";
        }

        switch (parseInt(skillEffect)) {
            case 1:
                document.getElementById("temefeitos").style.display = "block";
                document.getElementById("oefeito").style.display = "block";
                document.getElementById("oefeito").innerText = skillEffect;
                break;
            default:
                document.getElementById("temefeitos").style.display = "none";
                document.getElementById("oefeito").style.display = "none";
        }

        if (sealedFellowEquipmentMaximumEquipmentSlotNumber == 0) {
            document.getElementById("divSlot").style.display = "none";
            document.getElementById("barraslots").style.display = "none";
        } else {
            document.getElementById("divSlot").style.display = "flex";
            document.getElementById("barraslots").style.display = "block";
            document.getElementById("selosslots").innerText = parseInt(sealedFellowEquipmentMinimumEquipmentSlotNumber) + " - " + parseInt(sealedFellowEquipmentMaximumEquipmentSlotNumber) + " Slots";
        }
        
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

        // Exibir informa챌천es b찼sicas
        carregarIconeDoItem(id)
        document.getElementById("itemNivel").innerText = parseInt(requiredLevel);
        document.getElementById("itemRaridade").innerText = rarityT;
        document.getElementById("itemMagicDefense").innerText = "Physic Attack " + parseInt(physicalCriticalDmg);
        document.getElementById("tipoEquipamento").innerText = weaponTypeT;
        document.getElementById("temperinglevel").innerText = parseInt(reinforcementRestriction);
        document.getElementById("unbinds").innerText = `Unbindings Available ${parseInt(unbindCount)}/${parseInt(unbindCount)}`;

        document.getElementById("itemRaridade").style.color = cor;
        document.getElementById("itemNome").style.color = cor;

        let precoFormatado = []
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

        switch (true) {
            case gold > 0:
                precoFormatado.push(`<span class="moeda gold">${gold}${goldIcon}</span>`);
            case silver > 0:
                precoFormatado.push(`<span class="moeda silver">${silver}${silverIcon}</span>`);
            case copper > 0:
                precoFormatado.push(`<span class="moeda copper">${copper}${copperIcon}</span>`);
        }

        if (preco > 0) {
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
        atualizarSetDiv(id);
    } else {
        alert("Invalid code!, This code is for Weapon?");
    }
}
function contarValoresNaLinha(linha) {
    let valores = linha.split(";");
    return valores.length;
}

// ----------------- //
// Bot천es Principais //
// ----------------- //
function filtrarItems() {
    let input = document.getElementById("searchBar").value.toLowerCase();
    let buttons = document.querySelectorAll("#botaoContainer button");

    buttons.forEach(button => {
        let nome = button.querySelector("p").innerText.toLowerCase(); // Pega o nome do item
        button.style.display = nome.includes(input) ? "flex" : "none"; // Oculta ou exibe
    });
}

function mudarItem(id) {
    let item = itemArray.find(item => item.t_id === id);

    if (!item) {
        console.error("Item n찾o encontrado:", id);
        return;
    }

    document.getElementById("codigoItem").value = Object.values(item).join(";");
    codigoOriginal = Object.values(item).join(";");
    
    let codigoBruto = document.getElementById("codigoItem").value.trim();
    if (!codigoBruto) {
        document.getElementById("codigoItem").value = itemDefault;

        codigoBruto = document.getElementById("codigoItem").value;
    }
    let partes = codigoBruto.split(";");
    if (partes.length == 66) {
        atualizarItemacc()
        processarEfeitosDoItemacc()
    } else if (partes.length == 70) {
        atualizarItemarmor()
        processarEfeitosDoItemarmor()
    } else if (partes.length == 90) {
        atualizarItemWeapon()
        processarEfeitosDoItemWeapon()
    } else {
        console.log("N첬mero de valores na linha:", contarValoresNaLinha(codigoBruto));
        alert("Invalid code!, This code could not be recognized, please check it again.");
    }
}

function carregarCodigo() {
    let codigoBruto = document.getElementById("codigoItem").value.trim();
    if (!codigoBruto) {
        document.getElementById("codigoItem").value = itemDefault;

        codigoBruto = document.getElementById("codigoItem").value;
    }
    let partes = codigoBruto.split(";");
    if (partes.length == 66) {
        atualizarItemacc()
        processarEfeitosDoItemacc()
    } else if (partes.length == 70) {
        atualizarItemarmor()
        processarEfeitosDoItemarmor()
    } else if (partes.length == 90) {
        atualizarItemWeapon()
        processarEfeitosDoItemWeapon()
    } else {
        console.log("N첬mero de valores na linha:", contarValoresNaLinha(codigoBruto));
        alert("Invalid code!, This code could not be recognized, please check it again.");
    }
}

function voltarCodigo() {
    document.getElementById("codigoItem").value = codigoOriginal;
    
    let codigoBruto = document.getElementById("codigoItem").value.trim();
    if (!codigoBruto) {
        document.getElementById("codigoItem").value = itemDefault;

        codigoBruto = document.getElementById("codigoItem").value;
    }
    let partes = codigoBruto.split(";");
    if (partes.length == 66) {
        atualizarItemacc()
        processarEfeitosDoItemacc()
    } else if (partes.length == 70) {
        atualizarItemarmor()
        processarEfeitosDoItemarmor()
    } else if (partes.length == 90) {
        atualizarItemWeapon()
        processarEfeitosDoItemWeapon()
    } else {
        console.log("N첬mero de valores na linha:", contarValoresNaLinha(codigoBruto));
        alert("Invalid code!, This code could not be recognized, please check it again.");
    }
}

// ---------------- //
// Carrega a Pagina //
// ---------------- //
async function inicializarPagina() {
    await carregarCSV()
    await carregarTraducoes()
    await carregarEffectTranslations()
    loadButton()

    if (!itemArray || Object.keys(mapaDeTraducoes).length === 0) {
        console.warn("?截 Dados ainda n찾o carregados. Tentando novamente em 100ms...")
        setTimeout(inicializarPagina, 100)
        return
    }
    let codigoBruto = document.getElementById("codigoItem").value.trim();
    if (!codigoBruto) {
        document.getElementById("codigoItem").value = itemDefault;

        codigoBruto = document.getElementById("codigoItem").value;
    }
    let partes = codigoBruto.split(";");
    if (partes.length == 66) {
        atualizarItemacc()
        processarEfeitosDoItemacc()
    } else if (partes.length == 70) {
        atualizarItemarmor()
        processarEfeitosDoItemarmor()
    } else if (partes.length == 90) {
        atualizarItemWeapon()
        processarEfeitosDoItemWeapon()
    } else {
        console.log("N첬mero de valores na linha:", contarValoresNaLinha(codigoBruto));
        alert("Invalid code!, This code could not be recognized, please check it again.");
    }
    
    document.getElementById("itemInfo").style.display = "block";
}

window.onload = inicializarPagina
