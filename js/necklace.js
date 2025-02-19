// --------- //
// Variables //
// --------- //
const buttonItems = "../database/button/itemdata_accessory.csv"
const buttonIcons = "../database/itemdata/itemres_accessory.csv"
const buttonType = "ne"
// arquivoPrincipal
const itemInformations = "../database/itemdata/itemdata_accessory.csv"
const itemTranslations = [
    "../database/translate/localstringdata_item_accessory.csv",
    "../database/translate/localstringdata_item_accessory_02.csv",
    "../database/translate/localstringdata_item_armor.csv",
    "../database/translate/localstringdata_item_armor_02.csv",
    "../database/translate/localstringdata_item_weapon.csv",
    "../database/translate/localstringdata_item_weapon_02.csv"
];
const itemDefault = "AC0_1_1000;쿨타임 감소 목걸이(99%);0.000000;1.000000;0.000000;1.000000;GD_WR_TF_AC_WZ_PR_DO_MG;*;*;1.000000;ne;30.000000;6102.000000;611.000000;0.000000;0.000000;9.000000;(쿨타임%,-99);*;*;*;0.000000;0.000000;0.000000;5000,3000,1000,1000;*;0.000000;0.000000;0.000000;r1;1.000000;0.000000;0.000000;0.000000;req;get;ch;0.000000;*;0.000000;Auction_302;*;0.000000;0.000000;GU_Test_3_0004;AC0_EV_4_0_0002;*;*;1.000000;0.000000;0.000000;0.000000;0.000000;0.000000;0.000000;*;*;*;1.000000;0.000000;0.000000;30.000000;100.000000;*;*;*"
const effectsTranslation = "../database/translate/minhatraducao.csv"
let mapaDeTraducoes = {}
let itemArray = []
let itemSetData = [];      // Dados do arquivo itemset_setcharacter.csv
let setNameMap = {};       // Mapeamento do arquivo localstringdata_item_setitem.csv
let effectMap = {};        // Mapeamento do arquivo minhatraducao.csv

let codigoOriginal // não mexer aqui <<

// ------------------ //
// Carrega a Arquivos //
// ------------------ //
async function loadButton() {
    const response = await fetch(buttonItems + "?nocache=" + new Date().getTime());
    const text = await response.text();
    const lines = text.trim().split(/\r?\n/);

    const responseI = await fetch(buttonIcons + "?nocache=" + new Date().getTime());
    const textI = await responseI.text();
    const linesI = textI.trim().split(/\r?\n/);

    // Remove cabeçalhos
    lines.shift();

    const container = document.getElementById("botaoContainer");

    // 🔹 Criar um mapa de ícones para associar ID → Ícone
    let mapaDeIcones = {};
    linesI.forEach(lineI => {
        const [idI, iconI] = lineI.split(';');
        mapaDeIcones[idI.trim()] = iconI.trim();
    });

    // Criar botões para cada item
    lines.forEach((line, index) => {
        const [id, level, rarity, type] = line.split(';');
        let leveli = parseInt(level);

        if (type !== buttonType) return;

        const button = document.createElement("button");
        button.className = "item-button";
        button.setAttribute("data-index", id);
        button.setAttribute("onclick", `mudarItem(${index})`);

        const img = document.createElement("img");
        img.className = "item-img";
        
        // 🔹 Definir o ícone correspondente ao item pelo ID
        let iconFileName = mapaDeIcones[id] || "favicon"; // Se não existir, usa "favicon"

        img.src = `../imgs/${iconFileName}.png`;

        // 🔹 Verifica se a imagem existe
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

    // 🔹 Aguarda a tradução dos nomes
    await carregarTraducoes(); 

    if (!mapaDeTraducoes || Object.keys(mapaDeTraducoes).length === 0) {
        console.warn("mapaDeTraducoes ainda não carregado.");
        return;
    }

    // 🔹 Atualiza os nomes dos itens
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
            .catch(error => console.error(`❌ Error in ${arquivo}:`, error))
    );

    await Promise.all(promessas); // Aguarda todos os arquivos carregarem
}

async function carregarCSV() {
    const response = await fetch(itemInformations);
    const blob = await response.blob(); // Obtém os dados como um Blob
    const reader = new FileReader();

    reader.onload = function () {
        const text = new TextDecoder("euc-kr").decode(reader.result); // Decodifica como EUC-KR
        Papa.parse(text, {
            delimiter: ";",
            header: true,
            skipEmptyLines: true,
            complete: function (parsed) {
                itemArray = parsed.data;
            }
        });
    };

    reader.readAsArrayBuffer(blob);
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

    // Pular o cabeçalho
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
    const buffer = await response.arrayBuffer(); // Lê como array buffer
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
    // Faz o parse do CSV usando vírgula como delimitador
    let parsed = Papa.parse(text, { header: true, skipEmptyLines: true, delimiter: "," });
    
    parsed.data.forEach(row => {
      if (row.t_key && row.t_korean) {
        // Remove os '^' e o sufixo _Name, converte a chave para minúsculo para padronização
        let key = row.t_key.replace(/\^/g, "").replace("_Name", "").trim().toLowerCase();

        // Armazena a tradução exatamente como está (mantendo a case original)
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

    if (countEffect > 0) {
        container.style.display = "block";

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
async function carregarCodigoItem(itemID) {
    try {
        const response = await fetch(itemInformations + "?nocache=" + new Date().getTime());
        const csvText = await response.text();

        let linhas = csvText.split("\n");
        let header = linhas[0].split(",");
        let dados = linhas.slice(1).map(linha => linha.split(","));

        let indexID = header.indexOf("t_key"); // Encontra a coluna do ID

        let itemEncontrado = dados.find(row => row[indexID] === `^${itemID}^`);

        if (itemEncontrado) {
            document.getElementById("codigoItem").value = itemEncontrado.join(",");
        } else {
            document.getElementById("codigoItem").value = "Item não encontrado.";
        }
    } catch (error) {
        console.error("Erro ao carregar o CSV:", error);
        document.getElementById("codigoItem").value = "Erro ao carregar os dados.";
    }
}
function carregarItens() {
    let container = document.getElementById("t_item");
    container.innerHTML = ""; // Limpa os botões antes de gerar novos

    let setRow = itemSetData.find(row => {
        for (let i = 1; i <= 14; i++) {
            let campo = row[`t_item${i}`];
            if (campo && campo.trim() === itemID) {
                return true;
            }
        }
        return false;
    });

    for (let i = 1; i <= 14; i++) {
        let campo = setRow[`t_item${i}`]; // Pegando do seu objeto setRow
        if (campo && campo.trim() !== "*") {
            let btn = document.createElement("button");
            btn.id = `t_item${i}`;
            btn.className = "espaco3 cinza";
            btn.innerText = mapaDeTraducoes[campo]?.nome || campo;
            btn.dataset.itemId = campo; // Guarda o ID do item no botão

            btn.addEventListener("click", () => carregarCodigoItem(campo));

            container.appendChild(btn);
        }
    }
}

async function atualizarSetDiv(itemID) {
    // Carrega os dados, se ainda não estiverem carregados
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
      // Item não faz parte de nenhum set: oculta a div
      setDiv.style.display = "none";
      return;
    }
  
    // Caso o item faça parte do set, mostra a div
    setDiv.style.display = "block";
  
    // Atualiza o nome do set
    let setID = setRow.t_setid.trim().toLowerCase(); // Por exemplo, "Setall31"
    let setNameTraduzido = setNameMap[setID] || setID;
  
    // Conta quantos itens fazem parte do set (t_item1 a t_item14 que não são "*")
    let countItems = 0;
    for (let i = 1; i <= 14; i++) {
        let campo = setRow[`t_item${i}`];
        let elem = document.getElementById(`t_item${i}`);
        if (campo && campo.trim() !== "*") {
            countItems++;

            if (elem) {
                elem.innerText = mapaDeTraducoes[campo]?.nome || itemID;
                elem.style.display = "block";  // Certifica que está visível
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
    // Verifica se seteffect1_count é maior que 0
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

async function processarEfeitosDoItem() {
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

function exibirLinhaOriginal(id) {
    let nomeTraduzido = mapaDeTraducoes[id]?.nome || "";

    if (!nomeTraduzido) {
        nomeTraduzido = "";
    }

    let linhaOriginal = `^${id}_Name^,^${nomeTraduzido}^`;

    document.getElementById("nomedoItemtraduzido").value = linhaOriginal;
}

function atualizarItem() {
    let codigoBruto = document.getElementById("codigoItem").value.trim();
    if (!codigoBruto) {
        document.getElementById("codigoItem").value = itemDefault;

        // Atualiza codigoBruto para evitar erro no split()
        codigoBruto = document.getElementById("codigoItem").value;
    }
    let partes = codigoBruto.split(";");

    if (partes.length == 66) {
        let id = partes[0]; // id do item
        let nome = partes[1]; // Nome do item
        let desenvolvimento = partes[2]; // desenvolvimento
        let nivelmin = partes[3]; // Nível necessario
        let nivelmax = partes[4]; // Nível maximo
        let nivelitem = partes[5]; // Nivel do item , Poder do item
        let classes = partes[6]; // Classes que podem equipar
        let classesstat = partes[7]; // Classe dos status aleatorios
        let usabilidade = partes[8]; // Usabilidade
        let grau = partes[9]; // Grau
        let tipoacc = partes[10]; // Tipo de acc
        let durabilidade = partes[11]; // Durabilidade
        let precobuy = partes[12]; // Preco de compra
        let precosell = partes[13]; // Preco de venda
        let poderatqfisicomin = partes[14]; // Poder minimo de ataque fisico
        let poderatqfisicomax = partes[15]; // Poder maximo de ataque fisico
        let defesamagica = partes[16]; // Defesa magica
        let efeito1 = partes[17]; // Efeito 1
        let efeito2 = partes[18]; // Efeito 2
        let efeito3 = partes[19]; // Efeito 3
        let efeito4 = partes[20]; // Efeito 4
        let aplicacaoaleaatoria = partes[21]; // Aplicação de opção aleatoria
        let aplicacaoaleaatoriamin = partes[22]; // Aplicação minima de opção aleatoria
        let aplicacaoaleaatoriamax = partes[23]; // Aplicação maxima de opção aleatoria
        let aplicacaoaleaatoriaprop = partes[24]; // Aplicação proporção de opção aleatoria
        let variavel = partes[25]; // variavel
        let variavelmin = partes[26]; // variavel minima
        let variavelmax = partes[27]; // variavel maxima
        let reforco = partes[28]; // Limite de reforço
        let reforcoprob = partes[29]; // Probabilidade de reforço
        let descartavel = partes[30]; // Não pode ser descartado
        let negociavel = partes[31]; // Não pode ser negociado
        let disposed = partes[32]; // Não pode ser desvinculado
        let destruivel = partes[33]; // Não pode ser destruido
        let verdescartavel = partes[34]; // Vericação de nivel quando descartado
        let vinculacao = partes[35]; // Vinculação
        let alvovinculacao = partes[36]; // Alvo de Vinculação
        let desvinculacao = partes[37]; // Contagem de desvinculação
        let limitedeuso = partes[38]; // limite de uso
        let tingivel = partes[39]; // Pode ser tingido
        let classvendas = partes[40]; // Classificação da agência de vendas
        let efeitohabilidade = partes[41]; // Efeito de habilidade
        let ignoraverificacao = partes[42]; // Ignora a verificação de nivel quando descartavel
        let tempodeuso = partes[43]; // Período de uso
        let gradeupcodekey = partes[44]; // Grade up code key
        let gradeupresult = partes[45]; // Grade up result
        let iddesmontagem = partes[46]; // Id de desmontagem
        let idextracao = partes[47]; // Id de extração
        let sealtwotimes = partes[48]; // Se a pedra de selamento está equipada duas vezes
        let sealstones = partes[49]; // Numeros de seal stones
        let sealstonesmin = partes[50]; // Numeros de seal stones minima
        let sealstonesmax = partes[51]; // Numeros de seal stones maxima
        let opcaoniveldeuso = partes[52]; // opção de nivel de uso
        let pesodenivel = partes[53]; // Peso de Nivel
        let overrisemax = partes[54]; // Overrise Maximo
        let overriseid1 = partes[55]; // Overrise ID1
        let overriseid2 = partes[56]; // Overrise ID2
        let overriseid3 = partes[57]; // Overrise ID3
        let niveldeconteudo = partes[58]; // Nivel de Conteudo
        let canalintegrado = partes[59]; // Canal integrado indisponivel
        let reversolimite = partes[60]; // Limite de aprimoramento reverso
        let levelup = partes[61]; // Lvup
        let itemexp = partes[62]; // Item exp
        let overrisematid1 = partes[63]; // Overrise mat id1
        let overrisematid2 = partes[64]; // Overrise mat id2
        let currencysettingid = partes[65]; // Currency setting id

        let itemTraduzido = mapaDeTraducoes[id] || {}; // Evita erro se não existir
        let nomeItem = itemTraduzido.nome || id;
        let descricaoItem = itemTraduzido.descricao || "Descrição não encontrada";

        if (descricaoItem == "Descrição não encontrada") {
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
            4: "#ff00ff", // Roxo (Lendário)
            5: "#ff1155",  // Vermelho (Mítico)
            6: "#ffaa55"  // laranja (Unique)
        };
        let cor = coresRaridade[parseInt(grau)] || "#ffffff";

        let respostagrau;
        switch (parseInt(grau)) {
            case 1:
                respostagrau = "Common(Normal)";
                break;
            case 2:
                respostagrau = "Elite(Normal)";
                break;
            case 3:
                respostagrau = "Heroic(Normal)";
                break;
            case 4:
                respostagrau = "Legendary(Normal)";
                break;
            case 5:
                respostagrau = "Mythical(Normal)";
                break;
            case 6:
                respostagrau = "Unique(Normal)";
                break;
            default:
                respostagrau = grau; // Se não for um dos casos, mantém o valor original
        }

        let respostavinculacao;
        switch (vinculacao) {
            case "equip":
                respostavinculacao = "Bind on Equip";
                break;
            case "get":
                respostavinculacao = "Bind on Pickup";
                break;
            default:
                respostavinculacao = vinculacao;
        }
        function verificarClasses(classes) {
            let listaClasses = [];

            if (classes.includes("GD")) listaClasses.push("Guardião");
            if (classes.includes("WR")) listaClasses.push("Berserk");
            if (classes.includes("TF")) listaClasses.push("Trickster");
            if (classes.includes("AC")) listaClasses.push("Arqueiro");
            if (classes.includes("WZ")) listaClasses.push("Wizard");
            if (classes.includes("PR")) listaClasses.push("Priest");
            if (classes.includes("DO")) listaClasses.push("Assassin");
            if (classes.includes("MG")) listaClasses.push("Magician");

            // Se todas as classes estiverem na string, retorna "All Classes"
            if (listaClasses.length === 8) {
                return "All Classes";
            }

            return listaClasses.length > 0 ? listaClasses.join(" ") : "Error";
        }

        let respostatipoacc;
        switch (tipoacc) {
            case "ri":
                respostatipoacc = "Ring";
                break;
            case "ne":
                respostatipoacc = "Necklace";
                break;
            default:
                respostatipoacc = tipoacc;
        }
        

        if (iddesmontagem == "*") {
            document.getElementById("naopodedismantling").style.display = "block";
        } else {
            document.getElementById("naopodedismantling").style.display = "none";
        }
        
        if (parseInt(desvinculacao) == 0) {
            document.getElementById("naopodeunbind").style.display = "block";
            document.getElementById("unbinds").style.display = "none";
        } else if (parseInt(disposed) > 0) {
            document.getElementById("naopodeunbind").style.display = "block";
            document.getElementById("unbinds").style.display = "none";
        } else {
            document.getElementById("naopodeunbind").style.display = "none";
            document.getElementById("unbinds").style.display = "block";
        }

        if (parseInt(reforco) == 0) {
            document.getElementById("naopodemelhorar").style.display = "block";
            document.getElementById("temperinglevel").style.display = "none";
            document.getElementById("temperingname").style.display = "none";
        } else {
            document.getElementById("naopodemelhorar").style.display = "none";
            document.getElementById("temperinglevel").style.display = "inline";
            document.getElementById("temperingname").style.display = "block";
        }

        if (aplicacaoaleaatoria < 1) {
            document.getElementById("randomeffects").style.display = "none";
        } else {
            document.getElementById("randomeffects").style.display = "block";
            document.getElementById("efeitosaleatoriosmin").innerText = parseInt(aplicacaoaleaatoriamin);
            document.getElementById("efeitosaleatoriosmax").innerText = parseInt(aplicacaoaleaatoriamax);
        }

        switch (parseInt(efeitohabilidade)) {
            case 1:
                document.getElementById("temefeitos").style.display = "block";
                document.getElementById("oefeito").style.display = "block";
                document.getElementById("oefeito").innerText = efeitohabilidade;
                break;
            default:
                document.getElementById("temefeitos").style.display = "none";
                document.getElementById("oefeito").style.display = "none";
        }

        if (sealstonesmax == 0) {
            document.getElementById("barraslots").style.display = "none";
            document.getElementById("selosslots").style.display = "none";
        } else {
            document.getElementById("barraslots").style.display = "block";
            document.getElementById("selosslots").style.display = "block";
        }
        
        if (parseInt(tempodeuso) == 0) {
            document.getElementById("barraduration").style.display = "none";
            document.getElementById("textduration").style.display = "none";
            document.getElementById("durationtime").style.display = "none";
        } else {
            document.getElementById("barraduration").style.display = "block";
            document.getElementById("textduration").style.display = "block";
            document.getElementById("durationtime").style.display = "block";
            document.getElementById("durationtime").innerText = formatarTempo(parseInt(tempodeuso))
        }

        // Exibir informações básicas
        document.getElementById("nomedoItemtraduzido").innerText = exibirLinhaOriginal(partes[0]);
        document.getElementById("itemNome").innerText = nomeItem;
        carregarIconeDoItem(id)
        document.getElementById("itemNivel").innerText = parseInt(nivelmin);
        document.getElementById("itemBindtype").innerText = respostavinculacao;
        document.getElementById("itemRaridade").innerText = respostagrau;
        document.getElementById("itemMagicDefense").innerText = parseInt(defesamagica);
        document.getElementById("itemclasses").innerText = verificarClasses(classes);
        document.getElementById("tipoEquipamento").innerText = respostatipoacc;
        document.getElementById("temperinglevel").innerText = parseInt(reforco);
        document.getElementById("unbinds").innerText = `Unbindings Available ${parseInt(desvinculacao)}/${parseInt(desvinculacao)}`;

        document.getElementById("itemRaridade").style.color = cor;
        document.getElementById("itemNome").style.color = cor;

        
        // Array para armazenar as partes do preço
        let precoFormatado = [];
        // Converte para inteiro PRECO DO ITEM
        let preco = parseInt(precosell);
        let precoElemento = document.getElementById("itemPreco");
        let salePriceElemento = document.getElementById("saleprice");
        let barrasaleElemento = document.getElementById("barrasale");
        let divsaleElemento = document.getElementById("divsale");

        // Obtém as moedas
        let gold = Math.floor(preco / 10000);
        let silver = Math.floor((preco % 10000) / 100);
        let copper = preco % 100;
        // Define os ícones como imagens
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

// ----------------- //
// Botões Principais //
// ----------------- //
function filtrarItems() {
    let input = document.getElementById("searchBar").value.toLowerCase();
    let buttons = document.querySelectorAll("#botaoContainer button");

    buttons.forEach(button => {
        let nome = button.querySelector("p").innerText.toLowerCase(); // Pega o nome do item
        button.style.display = nome.includes(input) ? "flex" : "none"; // Oculta ou exibe
    });
}

function mudarItem(index) {
    let item = itemArray[index]; // Acessa o item pelo índice

    if (!item) return; // Se não existir, sai da função

    document.getElementById("codigoItem").value = Object.values(item).join(";");
    codigoOriginal = Object.values(item).join(";");

    atualizarItem();
    processarEfeitosDoItem();
}

function carregarCodigo() {
    atualizarItem()
    processarEfeitosDoItem()
}

function voltarCodigo() {
    document.getElementById("codigoItem").value = codigoOriginal;
    atualizarItem()
    processarEfeitosDoItem()
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
        console.warn("⚠️ Dados ainda não carregados. Tentando novamente em 100ms...")
        setTimeout(inicializarPagina, 100)
        return
    }
    codigoOriginal = document.getElementById("codigoItem").value;
    atualizarItem()
    processarEfeitosDoItem()
    
    document.getElementById("itemInfo").style.display = "block";
}

window.onload = inicializarPagina
