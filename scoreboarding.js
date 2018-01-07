// scoreboarding.js

function teste() {
    console.log("aa");
}

function getConfig() {
    var conf = {};

    conf["nInst"] = $("#nInst").val();
    var ciclos = {}

    ciclos["Integer"] = $("#ciclosInt").val();
    ciclos["Add"] = $("#ciclosFPAdd").val();
    ciclos["Mult"] = $("#ciclosFPMul").val();
    ciclos["Div"] = $("#ciclosFPDiv").val();

    conf["ciclos"] = ciclos

    var unidades = {}
    unidades["Integer"] = $("#fuInt").val();
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

function getUnidadeInstrucao(instrucao) {
    switch (instrucao) {
        case "SD":
        case "LD":
            return "Integer"

        case "SUBD":
        case "ADDD":
            return "Add"

        case "MULTD":
            return "Mult"

        case "DIVD":
            return "Div"

        default:
            return "INVALIDO"
    }
}

function destinoEhPontoFlutuante(item) {
    if(item[0] == "F") {
        return true;
    }
    return false;

}

function ehRegistrador(item) {
    if(item[0] == 'R' || item[0] == 'F') {
        return true;
    }
    return false;
}


function inicializaDiagrama(CONFIG, insts) {
    var diagrama = {};
    diagrama["config"] = {
        "nInst": CONFIG["nInst"],
        "ciclos": CONFIG["ciclos"],
        "unidades": CONFIG["unidades"]
    };

    //tabela que a gente realmente se importa
    var tabela = [];
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
        for(i = 0; i < CONFIG["unidades"][tipoUnidade]; i++) {
            uf = {};
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
            uf["rj"] = false;
            uf["rk"] = false;
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

function avancaCiclo(diagrama) {
    ++diagrama["clock"]; // Provavelmente deve ser trocado
    despachaInst(diagrama);
}

function despachaInst(diagrama) {
    // Acha a primeira instrução não despachada
    var pos = 0;
    var achou = false
    for (var i = 0 ; (!achou && i < diagrama["config"]["nInst"]); ++i) {
        if(!diagrama["tabela"][i]["is"]) {
            achou = true;
            pos = i;
        }
    }
    console.log(`Instrução ${pos}`);

    // Verificar se a unidade funcional está livre
    var tipoUF = getUnidadeInstrucao(diagrama["tabela"][pos]["d"]);
    console.log(`O tipo da UF: ${tipoUF}`);

    var nomeUF = null;
    achou = false;
    for (var i = 1; (!achou && i <= diagrama["config"]["unidades"][tipoUF]); i++) {
        var nome = `${tipoUF}${i}`;
        if(!diagrama["uf"][nome]["ocupado"]) {
            achou = true;
            nomeUF = nome;
        }
    }

    // Despacha a instrucao
    if(nomeUF) {
        console.log(`Despachando instrução ${pos}`);
        console.log(`UF livre: ${nomeUF}`);
        var uf = diagrama["uf"][nomeUF];
        var inst = diagrama["tabela"][pos];
        inst["is"] = true;
        uf["tempo"] = diagrama["clock"];
        uf["ocupado"] = true;
        uf["operacao"] = inst["d"];
        if(ehRegistrador(inst["r"])) { uf["fi"] = inst["r"]; }
        if(ehRegistrador(inst["s"])) { uf["fj"] = inst["s"]; }
        if(ehRegistrador(inst["t"])) { uf["fk"] = inst["t"]; }
        diagrama["destino"][inst["r"]] = nomeUF;
    } else {
        console.log(`Unidades ocupadas, não despachando a instrução`);
    }
}

$(document).ready(function() {
    var diagrama = null;

    $("#enviar").click(function() {
        const CONFIG = getConfig();
        var insts = getAllInst(CONFIG["nInst"]);
        diagrama = inicializaDiagrama(CONFIG, insts);
        $("#code").text(`${JSON.stringify({"config":CONFIG, "insts":insts, "diagrama":diagrama}, null, 2)}\n`);

    });

    $("#proximo").click(function() {
        if(!diagrama) {
            alert("Envie primeiro");
        } else {
            avancaCiclo(diagrama);
            $("#code").text(`${JSON.stringify(diagrama, null, 2)}\n`);
        }

    });

    // $("#proximo").click(function() {
    //     if(diagrama != null) {
    //         var instrucao = diagrama["tabela"][0]
    //         if(instrucao["is"] == null) {
    //             instrucao["is"] = 1;
    //             diagrama["clock"] = 1;
    //             var unidade = getUnidadeInstrucao(instrucao["d"]);
    //             if(unidade == "INVALIDO") {
    //                 alert("INVALIDO");
    //             } else {
    //                 var uf = diagrama["uf"][unidade + "1"];
    //                 uf["tempo"] = diagrama["ciclos"][unidade];
    //                 uf["ocupado"] = true;
    //                 uf["operacao"] = instrucao["d"];
    //                 uf["fi"] = instrucao["r"];
    //                 if(instrucao["r"] in diagrama["destino"] && ((instrucao["d"] != "SD") && (instrucao["d"] != "SW"))) {
    //                     diagrama["destino"][instrucao["r"]] = unidade + "1";
    //                 }
    //                 if(ehRegistrador(instrucao["s"])) {
    //                     uf["fj"] = instrucao["s"];
    //                     uf["rj"] = true;
    //                 }
    //                 if(ehRegistrador(instrucao["t"])) {
    //                     uf["fk"] = instrucao["t"];
    //                     uf["rk"] = true;
    //                 }
    //             }
    //
    //         } else {
    //             diagrama["clock"]++;
    //             for(var uf in diagrama["ufs"]) {
    //
    //             }
    //         }
    //         $("#code").text(`${JSON.stringify({"diagrama":diagrama}, null, 2)}\n`);
    //     }
    // });
});
