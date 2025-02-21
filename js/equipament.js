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
let itemDefault = "";
switch (buttonType) {
    case "ne":
        itemDefault = "AC5_0_6000;마신 젤나리스의 목걸이;0.000000;60.000000;0.000000;135.000000;GD_WR_TF_AC_WZ_PR_DO_MG;*;*;7.000000;ne;30.000000;130547.000000;13055.000000;0.000000;0.000000;1808.000000;(PK공격력%,100);(쿨타임%,-13);(모든공격력%,5);*;1.000000;4.000000;4.000000;2500,2500,2500,2500;*;0.000000;0.000000;5.000000;r1;0.000000;0.000000;0.000000;0.000000;req;equip;ch;3.000000;*;0.000000;Auction_301;*;0.000000;0.000000;GU_Test_3_0435;AC0_EV_4_0_0433;Legend_0060_ne;ac_7_60;1.000000;0.000000;0.000000;0.000000;0.000000;0.000000;7.000000;CO_OR_A60_0001;CO_OR_A60_0002;*;60.000000;0.000000;0.000000;30.000000;5880.000000;MA_13_1054;MA_13_1055;*"
        break;
    case "ri":
        itemDefault = "AC5_1_6000;마신 젤나리스의 반지 I;0.000000;60.000000;0.000000;135.000000;GD_WR_TF_AC_WZ_PR_DO_MG;*;*;7.000000;ri;30.000000;92151.000000;9468.000000;0.000000;0.000000;904.000000;(PK방어력%,15);(이동속도%,15);(allstat%,2);*;1.000000;4.000000;4.000000;2500,2500,2500,2500;*;0.000000;0.000000;5.000000;r1;0.000000;0.000000;0.000000;0.000000;req;equip;ch;3.000000;*;0.000000;Auction_302;itskillgod01.1;0.000000;0.000000;GU_Test_3_0433;AC0_EV_4_0_0431;Legend_0060_ri;ac_7_60;1.000000;0.000000;0.000000;0.000000;0.000000;0.000000;7.000000;CO_OR_A60_0001;CO_OR_A60_0002;*;60.000000;0.000000;0.000000;30.000000;5880.000000;MA_13_1054;MA_13_1055;*"
        break;
    case "ha":
        itemDefault = "AR4_007_1_00001;냉혈의 원소 모자 ;0.000000;65.000000;0.000000;135.000000;WZ_MG;WZ;*;7.000000;ha;cl;no;0.000000;568.000000;568.000000;90.000000;175086.000000;17509.199219;(PK방어력%,35);(최대HP%,10);(출혈방어율,9);(데미지감소%,1);1.000000;4.000000;4.000000;3000,4000,2750,250;4.000000;4.000000;*;0.000000;0.000000;1.000000;W;N;N;10.000000;r1;0.000000;0.000000;0.000000;0.000000;req;equip;ch;3.000000;*;1.000000;Auction_241;*;0.000000;0.000000;GU_Test_3_4445;AR4_400_1_10943;*;*;0.000000;0.000000;7.000000;CO_OR_A60_0001;CO_OR_A60_0002;*;60.000000;0.000000;5.000000;30.000000;3150.000000;1.000000;MA_13_1054;MA_13_1055"
        break;
    case "sh":
        itemDefault = "AR4_007_2_00001;냉혈의 원소 어깨 ;0.000000;65.000000;0.000000;135.000000;WZ_MG;WZ;*;7.000000;sh;cl;no;0.000000;600.000000;600.000000;90.000000;147441.593750;14744.400391;(PK방어력%,35);(쿨타임%,-12.5);(출혈방어율,9);(데미지감소%,1);1.000000;4.000000;4.000000;3000,4000,2750,250;4.000000;4.000000;*;0.000000;0.000000;1.000000;B;N;N;10.000000;r1;0.000000;0.000000;0.000000;0.000000;req;equip;ch;3.000000;*;1.000000;Auction_243;*;0.000000;0.000000;GU_Test_3_4446;AR4_400_1_10944;*;*;0.000000;0.000000;7.000000;CO_OR_A60_0001;CO_OR_A60_0002;*;60.000000;0.000000;5.000000;30.000000;3150.000000;1.000000;MA_13_1054;MA_13_1055"
        break;
    case "ja":
        itemDefault = "AR4_007_3_00001;냉혈의 원소 로브 ;0.000000;65.000000;0.000000;135.000000;WZ_MG;WZ;*;7.000000;ja;cl;no;0.000000;1335.000000;1335.000000;90.000000;184300.796875;18430.800781;(PK방어력%,35);(마법극대력+,2498);(출혈방어율,9);(데미지감소%,1);1.000000;4.000000;4.000000;3000,4000,2750,250;4.000000;4.000000;*;0.000000;0.000000;1.000000;B;N;N;10.000000;r1;0.000000;0.000000;0.000000;0.000000;req;equip;ch;3.000000;*;1.000000;Auction_244;*;0.000000;0.000000;GU_Test_3_4447;AR4_400_1_10945;*;*;0.000000;0.000000;7.000000;CO_OR_A60_0001;CO_OR_A60_0002;*;60.000000;0.000000;5.000000;30.000000;3150.000000;1.000000;MA_13_1054;MA_13_1055"
        break;
    case "gl":
        itemDefault = "AR4_007_4_00001;냉혈의 원소 장갑 ;0.000000;65.000000;0.000000;135.000000;WZ_MG;WZ;*;7.000000;gl;cl;no;0.000000;334.000000;334.000000;90.000000;138225.593750;13822.799805;(PK방어력%,35);(마법극대화확률+,20);(출혈방어율,9);(데미지감소%,1);1.000000;4.000000;4.000000;3000,4000,2750,250;4.000000;4.000000;*;0.000000;0.000000;1.000000;R;N;N;10.000000;r1;0.000000;0.000000;0.000000;0.000000;req;equip;ch;3.000000;*;1.000000;Auction_245;*;0.000000;0.000000;GU_Test_3_4448;AR4_400_1_10946;*;*;0.000000;0.000000;7.000000;CO_OR_A60_0001;CO_OR_A60_0002;*;60.000000;0.000000;5.000000;30.000000;3150.000000;1.000000;MA_13_1054;MA_13_1055"
        break;
    case "bo":
        itemDefault = "AR4_007_5_00001;냉혈의 원소 신발 ;0.000000;65.000000;0.000000;135.000000;WZ_MG;WZ;*;7.000000;bo;cl;no;0.000000;501.000000;501.000000;90.000000;129010.796875;12901.200195;(PK방어력%,35);(INT+,1116);(출혈방어율,9);(데미지감소%,1);1.000000;4.000000;4.000000;3000,4000,2750,250;4.000000;4.000000;*;0.000000;0.000000;1.000000;G;N;N;10.000000;r1;0.000000;0.000000;0.000000;0.000000;req;equip;ch;3.000000;*;1.000000;Auction_246;*;0.000000;0.000000;GU_Test_3_4449;AR4_400_1_10947;*;*;0.000000;0.000000;7.000000;CO_OR_A60_0001;CO_OR_A60_0002;*;60.000000;0.000000;5.000000;30.000000;3150.000000;1.000000;MA_13_1054;MA_13_1055"
        break;
    case "d1":
        itemDefault = "WE4_002_5_6001;마신 젤나리스의 단검;0.000000;60.000000;0.000000;135.000000;TF;TF;*;7.000000;we;d1;me;no;0.000000;1.000000;0.000000;2007.000000;3224.000000;0.000000;0.800000;40.000000;530102.000000;26505.000000;1.000000;1.000000;5.000000;0.000000;0.800000;0.800000;1.000000;(무기물리공격력%,5);(allstat%,1);(무기극대화데미지+,0.5);*;1.000000;4.000000;4.000000;2500,2500,2500,2500;1.000000;4.000000;4.000000;4.000000;4.000000;4;0.000000;0.000000;2.000000;R;N;N;16.000000;r1;0.000000;0.000000;0.000000;0.000000;req;equip;ch;3.000000;*;0.000000;Auction_107;darkgodwepon.1;0.000000;0.000000;GU_Test_3_0001;WE0_400_6500;Legend_0060_d1;we_7_60;0.000000;0.000000;7.000000;CO_OR_A60_0001;CO_OR_A60_0002;*;60.000000;0.000000;5.000000;0.000000;*;*;30.000000;5880.000000;1.000000;1.000000;7000.000000;MA_13_1054;MA_13_1055"
        break;
    case "s1":
        itemDefault = "WE0_001_5_6001;마신 젤나리스의 한손검;0.000000;60.000000;0.000000;135.000000;GD;GD;*;7.000000;we;s1;me;no;0.000000;1.000000;0.000000;3534.000000;5302.000000;0.000000;1.000000;45.000000;558012.000000;55801.000000;1.000000;1.000000;1.000000;0.000000;0.500000;0.300000;1.000000;(무기물리공격력%,10);(allstat%,2);(무기극대화데미지+,1);*;1.000000;4.000000;4.000000;2500,2500,2500,2500;1.000000;4.000000;4.000000;4.000000;4.000000;4;0.000000;0.000000;2.000000;R;N;N;16.000000;r1;0.000000;0.000000;0.000000;0.000000;req;equip;ch;3.000000;*;0.000000;Auction_101;darkgodwepon.1;0.000000;0.000000;GU_Test_3_0001;WE0_400_6500;AMythic_All;we_7_60;0.000000;0.000000;7.000000;CO_OR_A60_0001;CO_OR_A60_0002;*;60.000000;0.000000;5.000000;0.000000;*;*;30.000000;5880.000000;1.000000;1.000000;15000.000000;MA_13_1054;MA_13_1055"
        break;
    case "s2":
        itemDefault = "WE1_004_5_6001;마신 젤나리스의 양손검;0.000000;60.000000;0.000000;135.000000;WR;WR;*;7.000000;we;s2;me;no;0.000000;1.000000;0.000000;3931.000000;5897.000000;0.000000;1.000000;35.000000;836976.000000;41848.000000;1.000000;1.000000;3.000000;0.000000;0.500000;0.500000;1.000000;(무기물리공격력%,10);(allstat%,2);(무기극대화데미지+,1);*;1.000000;4.000000;4.000000;2500,2500,2500,2500;1.000000;4.000000;4.000000;4.000000;4.000000;4;0.000000;0.000000;2.000000;R;N;N;16.000000;r1;0.000000;0.000000;0.000000;0.000000;req;equip;ch;3.000000;*;0.000000;Auction_102;darkgodwepon.1;0.000000;0.000000;GU_Test_3_0001;WE0_400_6500;AMythic_All;we_7_60;0.000000;0.000000;7.000000;CO_OR_A60_0001;CO_OR_A60_0002;*;60.000000;0.000000;5.000000;0.000000;*;*;30.000000;5880.000000;1.000000;1.000000;5000.000000;MA_13_1054;MA_13_1055"
        break;
    case "m1":
        itemDefault = "WE5_005_5_6001;마신 젤나리스의 한손지팡이;0.000000;60.000000;0.000000;135.000000;PR;PR;*;7.000000;we;m1;ra;no;0.000000;20.000000;0.000000;3359.000000;6239.000000;12.000000;1.500000;55.000000;502194.000000;25109.000000;1.000000;1.000000;0.000000;1.000000;0.300000;0.300000;1.000000;(마법물리공격력%,10);(allstat%,2);(마법극대화데미지+,1);*;1.000000;4.000000;4.000000;2500,2500,2500,2500;1.000000;4.000000;4.000000;4.000000;4.000000;4;0.000000;0.000000;2.000000;R;N;N;16.000000;r1;0.000000;0.000000;0.000000;0.000000;req;equip;ch;3.000000;*;0.000000;Auction_108;darkgodwepon2.1;0.000000;0.000000;GU_Test_3_0001;WE0_400_6500;AMythic_All;we_7_60;0.000000;0.000000;7.000000;CO_OR_A60_0001;CO_OR_A60_0002;*;60.000000;0.000000;5.000000;0.000000;*;*;30.000000;5880.000000;1.000000;1.000000;10000.000000;MA_13_1054;MA_13_1055"
        break;
    case "m2":
        itemDefault = "WE6_003_5_6001;마신 젤나리스의 양손지팡이;0.000000;60.000000;0.000000;135.000000;WZ_MG;WZ;*;7.000000;we;m2;ra;no;0.000000;20.000000;0.000000;4811.000000;8934.000000;12.000000;2.000000;55.000000;753290.000000;37664.000000;1.000000;1.000000;0.000000;3.000000;0.500000;0.500000;1.000000;(마법물리공격력%,10);(allstat%,2);(마법극대화데미지+,1);*;1.000000;4.000000;4.000000;2500,2500,2500,2500;1.000000;4.000000;4.000000;4.000000;4.000000;4;0.000000;0.000000;2.000000;R;N;N;16.000000;r1;0.000000;0.000000;0.000000;0.000000;req;equip;ch;3.000000;*;0.000000;Auction_109;darkgodwepon2.1;0.000000;0.000000;GU_Test_3_0001;WE0_400_6500;AMythic_All;we_7_60;0.000000;0.000000;7.000000;CO_OR_A60_0001;CO_OR_A60_0002;*;60.000000;0.000000;5.000000;0.000000;*;*;30.000000;5880.000000;1.000000;1.000000;24000.000000;MA_13_1054;MA_13_1055"
        break;
    case "W1":
        itemDefault = "WE11_S001_0_0060;마신 젤나리스의 한손 마법봉;0.000000;60.000000;0.000000;135.000000;DO;DO;*;7.000000;we;W1;ra;no;0.000000;20.000000;0.000000;3694.000000;6862.000000;12.000000;1.500000;55.000000;502194.000000;25109.000000;1.000000;1.000000;0.000000;1.000000;0.300000;0.300000;1.000000;(마법물리공격력%,10);(allstat%,2);(마법극대화데미지+,1);*;1.000000;4.000000;4.000000;2500,2500,2500,2500;1.000000;4.000000;4.000000;4.000000;4.000000;4;0.000000;0.000000;2.000000;R;N;N;15.000000;r1;0.000000;0.000000;0.000000;0.000000;req;equip;ch;3.000000;*;0.000000;Auction_108;darkgodwepon2.1;0.000000;0.000000;GU_Test_3_0001;WE0_400_6500;AMythic_All;we_7_60;0.000000;0.000000;7.000000;CO_OR_A60_0001;CO_OR_A60_0002;*;60.000000;0.000000;5.000000;0.000000;*;*;30.000000;5880.000000;1.000000;1.000000;24000.000000;MA_13_1054;MA_13_1055"
        break;
    case "c2":
        itemDefault = "WE9_006_5_6000;마신 젤나리스의 석궁;0.000000;60.000000;0.000000;135.000000;WR_GD_AC_TF_PR_WZ_DO_MG;*;*;7.000000;bwe;c2;ra;no;0.000000;30.000000;70.000000;2768.000000;6461.000000;70.000000;2.000000;30.000000;350132.000000;17506.000000;1.000000;1.000000;0.100000;0.100000;0.800000;0.800000;1.000000;(최대HP%,10);(모든공격력%,3);(이동속도%,25);*;1.000000;4.000000;4.000000;2500,2500,2500,2500;1.000000;4.000000;4.000000;4.000000;4.000000;4;0.000000;0.000000;2.000000;R;N;N;16.000000;r1;0.000000;0.000000;0.000000;0.000000;req;equip;ch;3.000000;*;0.000000;Auction_112;*;0.000000;0.000000;GU_Test_3_0001;WE0_400_6500;AMythic_All;we_7_60;0.000000;0.000000;7.000000;CO_OR_A60_0001;CO_OR_A60_0002;*;60.000000;0.000000;5.000000;0.000000;*;*;30.000000;5880.000000;1.000000;0.000000;0.000000;MA_13_1054;MA_13_1055"
        break;
    case "l2":
        itemDefault = "WE8_007_5_6000;마신 젤나리스의 장창;0.000000;60.000000;0.000000;135.000000;WR_GD_AC_TF_PR_WZ_DO_MG;*;*;7.000000;bwe;l2;me;no;0.000000;1.000000;0.000000;2539.000000;5923.000000;0.000000;1.500000;100.000000;350132.000000;17506.000000;1.000000;1.000000;0.050000;0.050000;0.500000;0.500000;1.000000;(최대HP%,10);(모든공격력%,3);(이동속도%,25);*;1.000000;4.000000;4.000000;2500,2500,2500,2500;1.000000;4.000000;4.000000;4.000000;4.000000;4;0.000000;0.000000;2.000000;R;N;N;16.000000;r1;0.000000;0.000000;0.000000;0.000000;req;equip;ch;3.000000;*;0.000000;Auction_111;*;0.000000;0.000000;GU_Test_3_0001;WE0_400_6500;AMythic_All;we_7_60;0.000000;0.000000;7.000000;CO_OR_A60_0001;CO_OR_A60_0002;*;60.000000;0.000000;5.000000;0.000000;*;*;30.000000;5880.000000;1.000000;0.000000;0.000000;MA_13_1054;MA_13_1055"
        break;
    default:
        itemDefault = "AC5_0_6000;마신 젤나리스의 목걸이;0.000000;60.000000;0.000000;135.000000;GD_WR_TF_AC_WZ_PR_DO_MG;*;*;7.000000;ne;30.000000;130547.000000;13055.000000;0.000000;0.000000;1808.000000;(PK공격력%,100);(쿨타임%,-13);(모든공격력%,5);*;1.000000;4.000000;4.000000;2500,2500,2500,2500;*;0.000000;0.000000;5.000000;r1;0.000000;0.000000;0.000000;0.000000;req;equip;ch;3.000000;*;0.000000;Auction_301;*;0.000000;0.000000;GU_Test_3_0435;AC0_EV_4_0_0433;Legend_0060_ne;ac_7_60;1.000000;0.000000;0.000000;0.000000;0.000000;0.000000;7.000000;CO_OR_A60_0001;CO_OR_A60_0002;*;60.000000;0.000000;0.000000;30.000000;5880.000000;MA_13_1054;MA_13_1055;*"
        break;
    }

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
const skillTranslations = [
    "../database/translate/localstringdata_skill.csv",
    "../database/translate/localstringdata_skill_archer.csv"
]
const effectsTranslation = "../database/translate/minhatraducao.csv"
let mapaDeTraducoes = {}
let itemArray = []
let itemSetData = []
let setNameMap = {}
let effectMap = {}

let codigoOriginal = itemDefault

// ------------------ //
// Carrega a Arquivos //
// ------------------ //
async function loadButton() {
    const container = document.getElementById("botaoContainer");
    container.innerHTML = "";

    let mapaDeIcones = {};
    let lines = [];

    const responseI = await fetch(buttonIcons + "?nocache=" + new Date().getTime());
    const textI = await responseI.text();
    const linesI = textI.trim().split(/\r?\n/);
    
    linesI.forEach(lineI => {
        const [idI, iconI] = lineI.split(';');
        mapaDeIcones[idI.trim()] = iconI.trim();
    });

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
        
        let iconFileName = mapaDeIcones[id] || "favicon";
        img.src = `../imgs/${iconFileName}.png`;

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

    await carregarTraducoes(); 
    
    if (!mapaDeTraducoes || Object.keys(mapaDeTraducoes).length === 0) {
        console.warn("mapaDeTraducoes ainda n찾o carregado.");
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
            .catch(error => console.error(`Error in ${arquivo}:`, error))
    );

    await Promise.all(promessas);
}

function formatSkillText(text) {
    return text.replace(/<UI_P>(.*?)<\/ui_p>/g, ' <p class="fellow"> $1 </p> ');
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
                    if (cleanKey === `${skillId}_description_1`) {
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


async function carregarCSV() {
    let allItems = [];

    const promises = itemInformations.map(async (file) => {
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

    await Promise.all(promises);

    itemArray = allItems;
}


async function carregarIconeDoItem(itemID) {
    const response = await fetch(buttonIcons + "?nocache=" + new Date().getTime());
    const text = await response.text();
    const lines = text.trim().split(/\r?\n/);

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
    const buffer = await response.arrayBuffer();
    const text = new TextDecoder("euc-kr").decode(buffer);
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
    let parsed = Papa.parse(text, { header: true, skipEmptyLines: true, delimiter: "," });
    
    parsed.data.forEach(row => {
      if (row.t_key && row.t_korean) {
        let key = row.t_key.replace(/\^/g, "").replace("_Name", "").trim().toLowerCase();

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
            effectElem.style.display = "flex";

            let effectField = setRow[`${effectPrefix}${j}`];
            if (effectField && effectField.trim() !== "*" && effectField.trim() !== 0) {
                let effectStr = effectField.replace(/[(\')]/g, "").split(",");
                let chaveOriginal = effectStr[0].trim();
                let valorStr = effectStr[1] ? effectStr[1].trim() : "";

                let pkintercept = chaveOriginal.trim();
                let simbolo = "";
                if (pkintercept === "pk육체계저항율+" || pkintercept === "출혈방어율") {
                    simbolo = "%";
                    chaveOriginal = chaveOriginal.slice(0, -1).trim();
                    console.log("1")
                } else if (chaveOriginal.endsWith("%") || chaveOriginal.endsWith("+")) {
                    simbolo = chaveOriginal.slice(-1);
                    chaveOriginal = chaveOriginal.slice(0, -1).trim();
                    console.log("2")
                }

                if (chaveOriginal === "출혈방어") {
                    chaveOriginal = "출혈방어율"
                }

                let traducao = effectMap[chaveOriginal] || chaveOriginal;

                let valorNumerico = parseFloat(valorStr);
                let sinal = "";
                if (valorNumerico > 0) {
                    sinal = "+";
                }

                let efeitoFinal = traducao;
                if (!isNaN(valorNumerico)) {
                    efeitoFinal += simbolo === "%" ? ` ${sinal}${valorNumerico}%` : ` ${sinal}${valorNumerico}`;
                }

                effectElem.innerHTML = efeitoFinal;
                container.style.display = "block";
            } else {
                effectElem.style.display = "none";
            }
        }

        let skillElem = document.getElementById(skillId);
        if (skillElem && skillElem != 0.000000) {
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
    await carregarDadosSets();
  
    const setDiv = document.getElementById("setdivcompleto");
    if (!setDiv) return;
    const container = document.getElementById("t_item");
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
      setDiv.style.display = "none";
      return;
    }
  
    setDiv.style.display = "block";
  
    let setID = setRow.t_setid.trim().toLowerCase();
    let setNameTraduzido = setNameMap[setID] || setID;
  
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
        } else {
            if (elem) {
                elem.innerText = "";
                elem.style.display = "none";
            }
        }
    }
    document.getElementById("setname").innerText = setNameTraduzido + " (0/" + countItems + ")";

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
    let efeitos = [partes[17], partes[18], partes[19], partes[20]];

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
        if (termoTraduzido === "Bleed Defense" || termoTraduzido === "Magic Critical Damage") {
            simbolo = "%"
        }
        
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
    let efeitos = [partes[19], partes[20], partes[21], partes[22]];

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
        if (termoTraduzido === "Bleed Defense" || termoTraduzido === "Magic Critical Damage") {
            simbolo = "%"
        }

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
    let efeitos = [partes[31], partes[32], partes[33], partes[34]];

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
        if (termoTraduzido === "Bleed Defense" || termoTraduzido === "Magic Critical Damage") {
            simbolo = "%"
        }

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

async function atualizarItemacc() {
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

        let itemTraduzido = mapaDeTraducoes[id] || {}
        let nomeItem = itemTraduzido.nome || id
        let descricaoItem = itemTraduzido.descricao || "Description not found"

        document.getElementById("nomedoItemtraduzido").innerText = exibirLinhaOriginal(partes[0]);
        document.getElementById("itemNome").innerText = nomeItem;
        if (descricaoItem === "Description not found") {
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
            4: "#ff00ff", // Roxo (Lendario)
            6: "#ffaa55",  // laranja (Unique)
            7: "#ff1155"  // Vermelho (Mitico)
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
        function cannotBe() {
            let listCannot = [];

            if (cannotBeTrade > 0) listCannot.push("Untradable");
            if (cannotBeDisposed > 0) listCannot.push("Unsellable");

            return listCannot.length > 0 ? listCannot.join(", ") : "Error";
        }
        
        if (cannotBeTrade > 0 || cannotBeDisposed > 0 || cannotBeDropped > 0 || cannotBeDestroyed > 0) {
            document.getElementById("cannottradesell").style.display = "block";
            document.getElementById("cannottradesell").innerText = cannotBe();
        } else {
            document.getElementById("cannottradesell").style.display = "none";
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

        if (disassemblyID == "*") {
            document.getElementById("naopodedismantling").style.display = "block";
        } else {
            document.getElementById("naopodedismantling").style.display = "none";
        }
        
        if (parseInt(unbindCount) == 0) {
            document.getElementById("naopodeunbind").style.display = "block";
            document.getElementById("unbinds").style.display = "none";
        } else {
            document.getElementById("naopodeunbind").style.display = "none";
            document.getElementById("unbinds").style.display = "block";
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

        let skillElem = document.getElementById("equipedskill")
        let skillSemFim2 = skillEffect.slice(0, -2)
        let skillId = await carregarSkillTraducoes(skillSemFim2);
        if (skillEffect != "*") {
            document.getElementById("temequipedskill").style.display = "block";
            document.getElementById("equipedskiltxt").style.display = "flex";
            document.getElementById("equipedskill").style.display = "flex";
            skillElem.innerText = skillId.slice(0, -2).trim();
        } else {
            document.getElementById("temequipedskill").style.display = "none";
            document.getElementById("equipedskiltxt").style.display = "none";
            document.getElementById("equipedskill").style.display = "none";
        }

        if (sealedFellowEquipmentMaximumEquipmentSlotNumber == 0) {
            document.getElementById("divSlot").style.display = "none";
            document.getElementById("barraslots").style.display = "none";
        } else {
            document.getElementById("divSlot").style.display = "flex";
            document.getElementById("barraslots").style.display = "block";
            document.getElementById("sealSlotIcon").src = "../imgs/EmptySealSlot.png";
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

        carregarIconeDoItem(id)
        document.getElementById("itemNivel").innerText = parseInt(requiredLevel);
        document.getElementById("itemRaridade").innerText = rarityT;
        document.getElementById("itemMagicDefense").innerText = "Magic Defense " + parseInt(magicDefense);
        document.getElementById("tipoEquipamento").innerText = accessoryTypeT;
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

        if (preco > 0 && cannotBeDisposed == 0.000000) {
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

async function atualizarItemarmor() {
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

        let itemTraduzido = mapaDeTraducoes[id] || {};
        let nomeItem = itemTraduzido.nome || id;
        let descricaoItem = itemTraduzido.descricao || "Description not found";

        document.getElementById("nomedoItemtraduzido").innerText = exibirLinhaOriginal(partes[0]);
        document.getElementById("itemNome").innerText = nomeItem;
        if (descricaoItem === "Description not found") {
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
            4: "#ff00ff", // Roxo (Lendario)
            6: "#ffaa55",  // laranja (Unique)
            7: "#ff1155"  // Vermelho (Mitico)
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
            case 5:
                rarityT = "Mythical(Normal)";
                break;
            case 6:
                rarityT = "Unique(Normal)";
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
                armorTypeT = "Armor";
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
        
        function cannotBe() {
            let listCannot = [];

            if (cannotBeTrade > 0) listCannot.push("Untradable");
            if (cannotBeDisposed > 0) listCannot.push("Unsellable");

            if (listCannot.length === 2) {
                return "Untradable, Unsellable";
            }

            return listCannot.length > 0 ? listCannot.join(", ") : "Error";
        }
        
        if (cannotBeTrade > 0 || cannotBeDisposed > 0 || cannotBeDropped > 0 || cannotBeDestroyed > 0) {
            document.getElementById("cannottradesell").style.display = "block";
            document.getElementById("cannottradesell").innerText = cannotBe();
        } else {
            document.getElementById("cannottradesell").style.display = "none";
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

        if (disassemblyID == "*") {
            document.getElementById("naopodedismantling").style.display = "block";
        } else {
            document.getElementById("naopodedismantling").style.display = "none";
        }
        
        if (parseInt(unbindCount) == 0) {
            document.getElementById("naopodeunbind").style.display = "block";
            document.getElementById("unbinds").style.display = "none";
        } else {
            document.getElementById("naopodeunbind").style.display = "none";
            document.getElementById("unbinds").style.display = "block";
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

        let skillElem = document.getElementById("equipedskill")
        let skillSemFim2 = skillEffect.slice(0, -2)
        let skillId = await carregarSkillTraducoes(skillSemFim2);
        if (skillEffect != "*") {
            document.getElementById("temequipedskill").style.display = "block";
            document.getElementById("equipedskiltxt").style.display = "flex";
            document.getElementById("equipedskill").style.display = "flex";
            skillElem.innerText = skillId.slice(0, -2).trim();
        } else {
            document.getElementById("temequipedskill").style.display = "none";
            document.getElementById("equipedskiltxt").style.display = "none";
            document.getElementById("equipedskill").style.display = "none";
        }

        if (sealedFellowEquipmentMaximumEquipmentSlotNumber == 0) {
            document.getElementById("divSlot").style.display = "none";
            document.getElementById("barraslots").style.display = "none";
        } else {
            document.getElementById("divSlot").style.display = "flex";
            document.getElementById("barraslots").style.display = "block";
            document.getElementById("sealSlotIcon").src = "../imgs/EmptySealSlot.png";
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

        if (preco > 0 && cannotBeDisposed == 0.000000) {
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

async function atualizarItemWeapon() {
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

        let itemTraduzido = mapaDeTraducoes[id] || {};
        let nomeItem = itemTraduzido.nome || id;
        let descricaoItem = itemTraduzido.descricao || "Description not found";

        document.getElementById("nomedoItemtraduzido").innerText = exibirLinhaOriginal(partes[0]);
        document.getElementById("itemNome").innerText = nomeItem;
        if (descricaoItem === "Description not found") {
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
            4: "#ff00ff", // Roxo (Lendario)
            6: "#ffaa55",  // laranja (Unique)
            7: "#ff1155"  // Vermelho (Mitico)
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
        
        function cannotBe() {
            let listCannot = [];

            if (cannotBeTrade > 0) listCannot.push("Untradable");
            if (cannotBeDisposed > 0) listCannot.push("Unsellable");

            if (listCannot.length === 2) {
                return "Untradable, Unsellable";
            }

            return listCannot.length > 0 ? listCannot.join(" ") : "Error";
        }
        
        if (cannotBeTrade > 0 || cannotBeDisposed > 0 || cannotBeDropped > 0 || cannotBeDestroyed > 0) {
            document.getElementById("cannottradesell").style.display = "block";
            document.getElementById("cannottradesell").innerText = cannotBe();
        } else {
            document.getElementById("cannottradesell").style.display = "none";
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
        
        if (disassemblyID == "*") {
            document.getElementById("naopodedismantling").style.display = "block";
        } else {
            document.getElementById("naopodedismantling").style.display = "none";
        }
        
        if (parseInt(unbindCount) == 0) {
            document.getElementById("naopodeunbind").style.display = "block";
            document.getElementById("unbinds").style.display = "none";
        } else {
            document.getElementById("naopodeunbind").style.display = "none";
            document.getElementById("unbinds").style.display = "block";
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

        let skillElem = document.getElementById("equipedskill")
        let skillSemFim2 = skillEffect.slice(0, -2)
        let skillId = await carregarSkillTraducoes(skillSemFim2);
        if (skillEffect != "*") {
            document.getElementById("temequipedskill").style.display = "block";
            document.getElementById("equipedskiltxt").style.display = "flex";
            document.getElementById("equipedskill").style.display = "flex";
            skillElem.innerText = skillId.slice(0, -2).trim();
        } else {
            document.getElementById("temequipedskill").style.display = "none";
            document.getElementById("equipedskiltxt").style.display = "none";
            document.getElementById("equipedskill").style.display = "none";
        }

        if (sealedFellowEquipmentMaximumEquipmentSlotNumber == 0) {
            document.getElementById("divSlot").style.display = "none";
            document.getElementById("barraslots").style.display = "none";
        } else {
            document.getElementById("divSlot").style.display = "flex";
            document.getElementById("barraslots").style.display = "block";
            document.getElementById("sealSlotIcon").src = "../imgs/EmptySealSlot.png";
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

        if (preco > 0 && cannotBeDisposed == 0.000000) {
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
    let item = itemArray.find(item => item.t_id === id);

    if (!item) {
        console.error("Item not found:", id);
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
        console.warn("Files not ready yet. Try again in 100ms...")
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
        alert("Invalid code!, This code could not be recognized, please check it again.");
    }
    
    document.getElementById("itemInfo").style.display = "block";
}

window.onload = inicializarPagina
