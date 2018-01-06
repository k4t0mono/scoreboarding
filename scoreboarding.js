// scoreboarding.js

function teste() {
    console.log("aa");
}

function getConfig() {
    var conf = {};
    
    conf["nInst"] = $("#nInst").val();
    var ciclos = {}
    
    ciclos["Inteiro"] = $("#ciclosInt").val();
    ciclos["Add"] = $("#ciclosFPAdd").val();
    ciclos["Mult"] = $("#ciclosFPMul").val();
    ciclos["Div"] = $("#ciclosFPDiv").val();
    
    conf["ciclos"] = ciclos
    
    var unidades = {}
    unidades["Inteiro"] = $("#fuInt").val();
    unidades["Add"] = $("#fuFPAdd").val();
    unidades["Mult"] = $("#fuFPMul").val();
    unidades["Div"] = $("#fuFPDiv").val();
    
    conf["unidades"] = unidades;
    
    return conf;
}

function getInst(i) {
    var inst = {};

    inst["d"] = $(`#D${i}`).val();
    inst["r"] = $(`#R${i}`).val();
    inst["s"] = $(`#S${i}`).val();
    inst["t"] = $(`#T${i}`).val();

    return inst;
}

function getAllInst(nInst) {
    var insts = []

    for (var i = 0; i < nInst; i++) {
        insts.push(getInst(i));
    }

    return insts;
}

$(document).ready(function() {
    $("#enviar").click(function() {
        const CONFIG = getConfig();
        var insts = getAllInst(CONFIG["nInst"]);
        var diagrama = inicializaDiagrama(CONFIG, insts);
        $("#code").text(`${JSON.stringify({"config":CONFIG, "insts":insts, "diagrama":diagrama}, null, 2)}\n`);
        
    });
});

function inicializaDiagrama(CONFIG, insts) {
    var diagrama = {};
    
    
    //tabela que a gente realmente se importa
    var tabela = {};
    for(i = 0; i < CONFIG["nInst"]; i++) {
        var linha = {}
        linha["r"] = insts[i]["r"];
        linha["s"] = insts[i]["s"];
        linha["t"] = insts[i]["t"];
        linha["d"] = insts[i]["d"];
        linha["is"] = null;     //issue
        linha["ro"] = null;     //leitura de operadores
        linha["ec"] = null;     //exec. completa
        linha["wr"] = null;     //escrita do resultado
        tabela[i] = linha;
    }
        
    diagrama["tabela"] = tabela;
    
    //Unidades funcionais (a tabela maior e mais chata)
    var ufs = {};
    for(var tipoUnidade in CONFIG["unidades"]) {
        uf = {};
        for(i = 0; i < CONFIG["unidades"][tipoUnidade]; i++) {
            uf["tipo"] = tipoUnidade;
            uf["tempo"] = null;
            uf["nome"] = tipoUnidade + (i + 1);
            uf["ocupado"] = false;
            uf["operacao"] = null;
            uf["fi"] = null;        //nao lembro dessas bagaca, apenas copiei
            uf["fj"] = null;
            uf["fk"] = null;
            uf["qj"] = null;
            uf["qk"] = null;
            uf["rj"] = null;
            uf["rk"] = null;
            ufs[uf["nome"]] = uf;
        }
    }
    
    diagrama["uf"] = ufs;
    
    diagrama["clock"] = 0;
    
    //os registradores de destino que ficam la embaixo
    destinos = {};
    for(i = 0; i < 32; i += 2) {
        destinos["F" + i] = null;
    }
    diagrama["destino"] = destinos;
    
    return diagrama;

}

