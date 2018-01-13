// scoreboarding.js


function getConfig() {
    var conf = {};

    conf["nInst"] = $("#nInst").val();
    if(conf["nInst"] < 1) {
        alert("O número de instruções deve ser no mínimo 1!");
        return null;
    }

    var ciclos = {}

    ciclos["Integer"] = $("#ciclosInt").val();
    ciclos["Add"] = $("#ciclosFPAdd").val();
    ciclos["Mult"] = $("#ciclosFPMul").val();
    ciclos["Div"] = $("#ciclosFPDiv").val();

    if ((ciclos["Integer"] < 1) || (ciclos["Add"] < 1) ||
        (ciclos["Mult"] < 1) || (ciclos["Div"] < 1)) {
        alert("A quantidade de ciclos por instrução, para todas as unidades, deve ser de no mínimo 1 ciclo!");
        return null;
    }

    conf["ciclos"] = ciclos

    var unidades = {}
    unidades["Integer"] = $("#fuInt").val();
    unidades["Add"] = $("#fuFPAdd").val();
    unidades["Mult"] = $("#fuFPMul").val();
    unidades["Div"] = $("#fuFPDiv").val();

    if ((unidades["Integer"] < 1) || (unidades["Add"] < 1) ||
        (unidades["Mult"] < 1) || (unidades["Div"] < 1)) {
        alert("A quantidade de unidades funcionais deve ser no mínimo 1!");
        return nulls;
    }

    conf["unidades"] = unidades;

    return conf;
}

function getInst(i) {
    var inst = {};
    inst["indice"] = i;
    inst["d"] = $(`#D${i}`).val();
    inst["r"] = $(`#R${i}`).val();
    inst["s"] = $(`#S${i}`).val();
    inst["t"] = $(`#T${i}`).val();

    return inst;
}

//Alerta padrão para entradas inválidas das instruções
function alertValidaInstrucao(instrucao) {
    saida = "A instrução \n";
    saida += instrucao["d"] + " " + instrucao["r"] + ", ";
    saida += instrucao["s"] + ", " + instrucao["t"];
    saida += " não atende os paramêtros do comando " + instrucao["d"];
    alert(saida);
}


function invalidaInstR(instrucao) {
	return (instrucao[0] != 'R' || instrucao.replace("R", "") == "" || isNaN(instrucao.replace("R", "")));	
}

function invalidaInstF(instrucao) {
	return (instrucao[0] != 'F' || instrucao.replace("F", "") == "" ||
			instrucao.replace("F", "") % 2 != 0);
}

function validaInstrucao(instrucao) {
    var unidade = getUnidadeInstrucao(instrucao["d"]);
    if(!unidade) {
        alert("O comando da instrução é inváilido");
        return false;
    }
    if(unidade == "Integer") {
        var comando = instrucao["d"]
        var falhou = false;
        
        if(comando == "LD" || comando == "SD") {
			if(invalidaInstF(instrucao["r"]) || isNaN(parseInt(instrucao["s"])) || invalidaInstR(instrucao["t"])) {
				alertValidaInstrucao(instrucao);
				return false;
			}
            return true;
        }
        if(comando == "BEQ") {
            if(invalidaInstR(instrucao["r"]) || invalidaInstR(instrucao["s"]) || (instrucao["t"].replace(" ", "") == "")) {
                alertValidaInstrucao(instrucao);
                return false;
            }
            return true;
        }
        if(comando == "BNEZ") {
            if(invalidaInstR(instrucao["r"]) || (instrucao["s"].replace(" ", "") == "") || (instrucao["t"].replace(" ", "") != "")) {
                alertValidaInstrucao(instrucao);
                return false;
            }
            return true;
        }
        if(comando == "ADD") {
            if(invalidaInstR(instrucao["r"]) || invalidaInstR(instrucao["s"]) || invalidaInstR(instrucao["t"])) {
                alertValidaInstrucao(instrucao);
                return false;
            }
            return true;
        }
        if(comando == "DADDUI") {
            if(invalidaInstR(instrucao["r"]) || invalidaInstR(instrucao["s"]) || isNaN(parseInt(instrucao["t"]))) {
                alertValidaInstrucao(instrucao);
                return false;
            }
        }
        return true;
    }

    if(invalidaInstF(instrucao["r"]) || invalidaInstF(instrucao["s"]) || invalidaInstF(instrucao["t"])) {
        alertValidaInstrucao(instrucao);
        return false;
    }
    return true;


}

function getAllInst(nInst) {
    var insts = []

    for (var i = 0; i < nInst; i++) {
        var instrucao = getInst(i);
        if(!validaInstrucao(instrucao)) {
            return null;
        }
        insts.push(instrucao);
    }

    return insts;
}

function getUnidadeInstrucao(instrucao) {
    switch (instrucao) {
        case "ADD":
        case "DADDUI":
        case "BEQ":
        case "BNEZ":
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
            return null
    }
}

function temEscrita(comando) {
    switch (comando) {
        case "SD":
        case "BEQ":
        case "BNEZ":
            return false;
        default:
            return true;
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
        linha["instrucao"] = insts[i];
        linha["n"] = i;
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
    //Unidades funcionais
    var ufs = {};
    for(var tipoUnidade in CONFIG["unidades"]) {
        for(i = 0; i < CONFIG["unidades"][tipoUnidade]; i++) {
            uf = {};
            uf["instrucao"] = null;
            uf["tipo"] = tipoUnidade;
            uf["tempo"] = null;
            uf["nome"] = tipoUnidade + (i + 1);
            uf["ocupado"] = false;
            uf["operacao"] = null;
            uf["fi"] = null;        //nao lembro dessas bagaca, apenas copiei
            uf["fj"] = null;
            uf["fk"] = null;
            uf["qi"] = null;        //usado somente no SD, BEQ e BNEZ
            uf["qj"] = null;
            uf["qk"] = null;
            uf["rj"] = false;
            uf["rk"] = false;
            uf["escrevendo"] = false; //usado para saber se falta terminar a escrita
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

function decrementaUnidadeFuncional(diagrama) {
    unidades = diagrama["uf"];
    for(key in unidades) {
        unidade = unidades[key];
        if(unidade["ocupado"] && !unidade["escrevendo"]) {
            linha = unidade["instrucao"]["indice"];
            if(diagrama["tabela"][linha]["ro"]) {
                if(unidade["tempo"]) {
                    unidade["tempo"]--;
                }
                if(unidade["tempo"] === 0 && !unidade["travou"]) {
                    instrucao = unidade["instrucao"];
                    diagrama["tabela"][instrucao["indice"]]["ec"] = diagrama["clock"];
                    unidade["travou"] = true;
                }
            }
        }
    }
}

function primeiraInstrucaoComDestino(unidade, unidades) {
    for(j in unidades) {
        var unidadeAux = unidades[j];
        if(unidadeAux["ocupado"]) {
            if(unidade["fi"] == unidadeAux["fi"]) {
                if(unidadeAux["instrucao"]["indice"] < unidade["instrucao"]["indice"]) {
                    return false;
                }
            }
        }
    }
    return true;
}

function ninguemTemQueLerAntes(unidade, unidades, diagrama) {
    for(j in unidades) {
        var unidadeAux = unidades[j];
        if(unidadeAux["ocupado"]) {
            linha = diagrama["tabela"][unidadeAux["instrucao"]["indice"]];
            if(unidadeAux["instrucao"]["indice"] < unidade["instrucao"]["indice"]  && !(linha["ro"])) {
                if(temEscrita(unidade["instrucao"]["d"])) {
                    if((unidade["fi"] == unidadeAux["fj"]) || (unidade["fi"] == unidadeAux["fk"])) {
                        return false;
                    }
                } else {
                    if(unidadeAux["instrucao"]["d"] == "BEQ") {
                        if(unidade["fi"] == undidadeAux["fj"]) {
                            return false;
                        }
                    }
                    if(unidadeAux["instrucao"]["d"] == "SD" || unidadeAux["instrucao"]["d"] == "BNEZ") {
                        if(unidade["fi"] == unidadeAux["instrucao"]["r"]) {
                            return false;
                        }
                    }
                }
            }
        }
    }
    return true;
}

function atualizaUnidades(unidade, unidades) {
    for(key in unidades) {
        unidadeAux = unidades[key];
        if(temEscrita(unidade["operacao"])) {
            if(temEscrita(unidadeAux["operacao"])) {
                if(unidade["fi"] == unidadeAux["fj"]) {
                    unidadeAux["qj"] = null;
                    unidadeAux["rj"] = "sim";
                }
                if(unidade["fi"] == unidadeAux["fk"]) {
                    unidadeAux["qk"] = null;
                    unidadeAux["rk"] = "sim";
                }
            } else {
                if(unidadeAux["instrucao"]["d"] == "SD") {
                    if(unidade["fi"] == unidadeAux["fk"]) {
                        unidadeAux["qk"] = null;
                        unidadeAux["rk"] = "sim";
                    }
                }

                if(unidadeAux["instrucao"]["d"] == "BEQ") {
                    if(unidade["fi"] == unidadeAux["fj"]) {
                        unidadeAux["qj"] = null;
                        unidadeAux["rj"] = "sim";
                    }
                }
                if(unidade["fi"] == unidadeAux["instrucao"]["r"]) {
                    unidadeAux["qi"] = null;
                }
            }
        }
    }
}


function escreveDestino(diagrama) {
    var unidades = diagrama["uf"];
    for(i in unidades) {
        var unidade = unidades[i];
        if(unidade["ocupado"] && !unidade["escrevendo"]) {
            var linha = diagrama["tabela"][unidade["instrucao"]["indice"]];
            if(primeiraInstrucaoComDestino(unidade, unidades) && ninguemTemQueLerAntes(unidade, unidades, diagrama) && linha["ec"]) {
                linha["wr"] = diagrama["clock"];
                unidade["tempo"] = null;
                unidade["ocupado"] = false;
                unidade["escrevendo"] = true;
            }
        }
    }

}

function leOperandos(diagrama) {
    for(key in unidades) {
        unidade = unidades[key];
        if(unidade["ocupado"] && !unidade["escrevendo"]) {
            if(temEscrita(unidade["instrucao"]["d"])) {
                if(!unidade["qj"] && !unidade["qk"]) {
                    linha = unidade["instrucao"]["indice"];
                    if(!diagrama["tabela"][linha]["ro"]) {
                        diagrama["tabela"][linha]["ro"] = diagrama["clock"];
                    }
                }
            } else {
                if(!unidade["qi"]) {
                    linha = unidade["instrucao"]["indice"];
                    if(!diagrama["tabela"][linha]["ro"]) {
                        comando = unidade["instrucao"]["d"];
                        if(comando == "BNEZ") {
                            diagrama["tabela"][linha]["ro"] = diagrama["clock"];
                            return;
                        }
                        if(comando == "SD") {
                            if(!unidade["qk"]) {
                                diagrama["tabela"][linha]["ro"] = diagrama["clock"];
                                return;
                            }
                        }
                        if(comando == "BEQ") {
                            if(!unidade["qj"]) {
                                diagrama["tabela"][linha]["ro"] = diagrama["clock"];
                                return;
                            }
                        }
                    }
                }
            }
        }
    }

}


function avancaCiclo(diagrama) {
    ++diagrama["clock"]; // Provavelmente deve ser trocado

    escreveDestino(diagrama);
    decrementaUnidadeFuncional(diagrama);
    leOperandos(diagrama);
    despachaInst(diagrama);

    atualizaClock(diagrama["clock"]);
    atualizaTabelaEstadoInstrucaoHTML(diagrama["tabela"]);
    atualizaTabelaEstadoUFHTML(diagrama["uf"]);
    atualizaTabelaEstadoMenHTML(diagrama["destino"]);

    var achou = false;
    for(i in diagrama["tabela"]) {
        if(!diagrama["tabela"][i]["wr"]) {
            achou = true;
        }
    }

    return (!achou);
}

function despachaInst(diagrama) {
    // Acha a primeira instrução não despachada
    var pos = -1;
    var achou = false
    for (var i = 0 ; (!achou && i < diagrama["config"]["nInst"]); ++i) {
        if(!diagrama["tabela"][i]["is"]) {
            achou = true;
            pos = i;
        }
    }
    if(pos === -1) {
        resetaEscritas(diagrama);
        return;
    }
    // Verificar se a unidade funcional está livre
    var tipoUF = getUnidadeInstrucao(diagrama["tabela"][pos]["d"]);
    console.log(`O tipo da UF: ${tipoUF}`);

    var nomeUF = null;
    achou = false;
    unidadesEscrevendo = {};
    for (var i = 1; (!achou && i <= diagrama["config"]["unidades"][tipoUF]); i++) {
        var nome = `${tipoUF}${i}`;
        ocp = diagrama["uf"][nome]["ocupado"];
        if(!ocp) {
            if(!diagrama["uf"][nome]["escrevendo"]) {
                achou = true;
                nomeUF = nome;
            }
        }
    }

    // Despacha a instrucao
    var inst = diagrama["tabela"][pos];
    var escreve = temEscrita(inst["d"]);
    var mem = diagrama["destino"][inst["r"]];
    if(nomeUF && (!mem || !escreve)) {
        console.log(`Despachando instrução ${pos}`);
        console.log(`UF livre: ${nomeUF}`);
        var uf = diagrama["uf"][nomeUF];
        uf["instrucao"] = inst["instrucao"];
        inst["is"] = diagrama["clock"];
        uf["tempo"] = diagrama["config"]["ciclos"][uf["tipo"]];
        uf["ocupado"] = true;
        uf["operacao"] = inst["d"];
        if(escreve) {
            uf["fi"] = ehRegistrador(inst["r"]) ? inst["r"] : null;
        }
        uf["fj"] = ehRegistrador(inst["s"]) ? inst["s"] : null;
        uf["fk"] = ehRegistrador(inst["t"]) ? inst["t"] : null;

        if(diagrama["destino"][inst["r"]] && !escreve) {
            uf["qi"] = diagrama["destino"][inst["r"]];
        }
        if(diagrama["destino"][inst["s"]] ) {
            uf["qj"] = diagrama["destino"][inst["s"]];
            uf["rj"] = "não";
        } else {
            if(uf["fj"]) {
                uf["rj"] = "sim";
            }
        }
        if(diagrama["destino"][inst["t"]]) {
            uf["qk"] = diagrama["destino"][inst["t"]];
            uf["rk"] = "não";
        } else {
            if(uf["fk"]) {
                uf["rk"] = "sim";
            }
        }
        if(escreve) {
            diagrama["destino"][inst["r"]] = nomeUF;
        }

    } else {
        //for(key in diagrama["uf"]) {
            //unidade = diagrama["uf"][key]
            //if(unidade["escrevendo"] && unidade["travou"]) {
                //diagrama["destino"][unidade["fi"]] = null;
                //unidade["travou"] = false;
                //unidade["escrevendo"] = false;
            //}
        //}
        console.log(`Unidades ocupadas, não despachando a instrução`);
    }
    resetaEscritas(diagrama);
}

function resetaEscritas(diagrama) {
    for(key in diagrama["uf"]) {
        unidade = diagrama["uf"][key];
        if(unidade["escrevendo"] && unidade["travou"]) {
            atualizaUnidades(unidade, diagrama["uf"])
            diagrama["destino"][unidade["fi"]] = null;
            unidade["travou"] = false;
            unidade["escrevendo"] = false;
            unidade["instrucao"] = null;
            unidade["operacao"] = null;
            unidade["fi"] = null;
            unidade["fj"] = null;
            unidade["fk"] = null;
            unidade["qj"] = null;
            unidade["qk"] = null;
            unidade["rj"] = false;
            unidade["rk"] = false;
        }
    }
}

// -----------------------------------------------------------------------------

function atualizaTabelaEstadoInstrucaoHTML(tabelaInsts) {
    for(i in tabelaInsts) {
        var inst = tabelaInsts[i];
        $(`#i${inst["n"]}_is`).text(inst["is"] ? inst["is"] : "");
        $(`#i${inst["n"]}_ro`).text(inst["ro"] ? inst["ro"] : "");
        $(`#i${inst["n"]}_ec`).text(inst["ec"] ? inst["ec"] : "");
        $(`#i${inst["n"]}_wr`).text(inst["wr"] ? inst["wr"] : "");
    }
}

function atualizaTabelaEstadoUFHTML(ufs) {
    for(i in ufs) {
        var uf = ufs[i];
        $(`#${uf["nome"]}_tempo`).text((uf["tempo"] !== null) ? uf["tempo"] : "");
        $(`#${uf["nome"]}_ocupado`).text((uf["ocupado"]) ? "sim" : "não");
        $(`#${uf["nome"]}_operacao`).text(uf["operacao"] ? uf["operacao"] : "");
        $(`#${uf["nome"]}_fi`).text(uf["fi"] ? uf["fi"] : "");
        $(`#${uf["nome"]}_fj`).text(uf["fj"] ? uf["fj"] : "");
        $(`#${uf["nome"]}_fk`).text(uf["fk"] ? uf["fk"] : "");
        $(`#${uf["nome"]}_qj`).text(((uf["qj"]) && (uf["qj"] !== 1)) ? uf["qj"] : "");
        $(`#${uf["nome"]}_qk`).text(((uf["qk"]) && (uf["qk"] !== 1)) ? uf["qk"] : "");
        $(`#${uf["nome"]}_rj`).text(uf["rj"] ? uf["rj"] : "");
        $(`#${uf["nome"]}_rk`).text(uf["rk"] ? uf["rk"] : "");
    }
}

function atualizaTabelaEstadoMenHTML(men) {
    for (var reg in men) {
        $(`#${reg}`).html(men[reg] ? men[reg] : "&nbsp;");
    }
}

function atualizaClock(clock) {
    $("#clock").html("<h3>Clock: <small id='clock'>" + clock + "</small></h3>");

}

// -----------------------------------------------------------------------------

function gerarTabelaEstadoInstrucaoHTML(diagrama) {
    var s = (
        "<h3>Estado das instruções</h3><table class='result'>"
        + "<tr><th></th><th>Inst</th><th>i</th><th>j</th>"
        + "<th>k</th><th>Is</th><th>RO</th><th>EC</th><th>Wr</th></tr>"
    );

    for (var i = 0 ; i < diagrama["config"]["nInst"]; ++i) {
        inst = diagrama["tabela"][i];
        s += (
            `<tr> <td>I${i}</td> <td>${inst["d"]}</td>
            <td>${inst["r"]}</td> <td>${inst["s"]}</td> <td>${inst["t"]}</td>
            <td id='i${i}_is'></td> <td id='i${i}_ro'></td> <td id='i${i}_ec'></td>
            <td id='i${i}_wr'></td> </tr>`
        );
    }

    s += "</table>";
    $("#estadoInst").html(s);
}

function gerarTabelaEstadoUFHTML(diagrama) {
    var s = (
        "<h3>Estado das UF</h3><table class='result'><tr> <th>Tempo</th> <th>UF</th> <th>Ocupado</th>"
        + "<th>Op</th> <th>Fi</th> <th>Fj</th> <th>Fk</th> <th>Qj</th> <th>Qk</th>"
        + "<th>Rj</th> <th>Rk</th> </tr>"
    );

    for(key in diagrama["uf"]) {
        var uf = diagrama["uf"][key];
        s += `<tr><td id="${uf["nome"]}_tempo"></td>
             <td>${uf["nome"]}</td> <td id="${uf["nome"]}_ocupado"></td>
             <td id="${uf["nome"]}_operacao"></td><td id="${uf["nome"]}_fi"></td>
             <td id="${uf["nome"]}_fj"></td> <td id="${uf["nome"]}_fk"></td>
             <td id="${uf["nome"]}_qj"></td> <td id="${uf["nome"]}_qk"></td>
             <td id="${uf["nome"]}_rj"></td> <td id="${uf["nome"]}_rk"></td> </tr>
             `
    }

    s += "</table>"
    $("#estadoUF").html(s);
}

function gerarTabelaEstadoMenHTML(diagrama) {
    var s = `<h3>Estado da Memória</h3> <table class="result">`;

    for(var i = 0; i < 2; ++i) {
        s += `<tr>`
        for(var j = 0; j < 16; j += 2) {
            s += `<th>F${j+i*16}</th>`
        }
        s += `</tr> <tr>`
        for(var j = 0; j < 16; j += 2) {
            s += `<td id="F${j+i*16}">&nbsp;</td>`
        }
        s += `</tr>`
    }

    s += "</table>"
    $("#estadoMem").html(s);
}

function geraTabelaParaInserirInstrucoes(nInst) {
    var tabela = "<table>"
        for(var i = 0; i < nInst; i++) {
            var d = "D" + i;
            var r = "R" + i;
            var s = "S" + i;
            var t = "T" + i;
            tabela += (
                "<tr>" +
                    "<td>" +
                        "<select size=\"1\" name=\"" + d + "\" id=\"" + d + "\">" +
                        "<option selected value = \"\">None</option>" +
                        "<option value=\"LD\">LD</option>" +
                        "<option value=\"SD\">SD</option>" +
                        "<option value=\"MULTD\">MULTD</option>" +
                        "<option value=\"DIVD\">DIVD</option>" +
                        "<option value=\"ADDD\">ADDD</option>" +
                        "<option value=\"SUBD\">SUBD</option>" +
                        "<option value=\"ADD\">ADD</option>" +
                        "<option value=\"DADDUI\">DADDUI</option>" +
                        "<option value=\"BEQ\">BEQ</option>" +
                        "<option value=\"BNEZ\">BNEZ</option>" +
                    "</td>" +
                    "<td><input type=\"text\" name=\""+ r + "\" id=\""+ r + "\" size=\"3\" maxlength=\"3\" /></td>" +
                    "<td><input type=\"text\" name=\""+ s + "\" id=\""+ s + "\" size=\"3\" maxlength=\"5\" /></td>" +
                    "<td><input type=\"text\" name=\""+ t + "\" id=\""+ t + "\" size=\"3\" maxlength=\"3\" /></td>" +
                "</tr>"
            );
        }
        tabela += "</table>";
        $("#listaInstrucoes").html(tabela);
}


// -----------------------------------------------------------------------------

function carregaExemplo() {
    var exN = $("#exemploSelect").val();

    $.getJSON(`./exemplos/ex${exN}.json`, function() {
        console.log("Lido :3");

    }).fail(function() {
      alert("Não foi possivel carregar o exemplo.")
    }).done(function(data) {
        $("#nInst").val(data["insts"].length);
        confirmou = confirmarNInst();

        for (var i = 0; i < data["insts"].length; i++) {
           $(`#D${i}`).val(data["insts"][i]["D"]);
           $(`#R${i}`).val(data["insts"][i]["R"]);
           $(`#S${i}`).val(data["insts"][i]["S"]);
           $(`#T${i}`).val(data["insts"][i]["T"]);
        }

        for (var key in data["config"]) {
           $(`#${key}`).val(parseInt(data["config"][key]));
        }
    });
}


function confirmarNInst() {
    var nInst = $("#nInst").val();
    if(nInst < 1) {
        alert("O número de instruções deve ser no mínimo 1");
        return false;
    }
    geraTabelaParaInserirInstrucoes(nInst);
    return true;
}


function limparCampos() {
    $("#exemploSelect").val("---");

    $("#nInst").val(1);
    $("#listaInstrucoes").html("");

    $("#ciclosInt").val(1);
    $("#ciclosFPAdd").val(1);
    $("#ciclosFPMul").val(1);
    $("#ciclosFPDiv").val(1);

    $("#fuInt").val(1);
    $("#fuFPAdd").val(1);
    $("#fuFPMul").val(1);
    $("#fuFPDiv").val(1);

    $("#clock").html("");
    $("#estadoInst").html("");
    $("#estadoUF").html("");
    $("#estadoMem").html("");
}


$(document).ready(function() {
    var confirmou = false;
    var diagrama = null;
    var terminou = false;

    $("#limpar").click(function() {
        limparCampos();
    })

    $("#carregaExemplo").click(function() {
        carregaExemplo();
        confirmou = true;
    });

    $("#confirmarNInst").click(function() {
        confirmou = confirmarNInst();
    });

    $("#enviar").click(function() {
        if(!confirmou) {
            alert("Confirme o número de instruções!");
            return;
        }
        const CONFIG = getConfig();
        if(!CONFIG) {
            return;
        }
        var insts = getAllInst(CONFIG["nInst"]);
        if(!insts) {
            return;
        }
        diagrama = inicializaDiagrama(CONFIG, insts);
        gerarTabelaEstadoInstrucaoHTML(diagrama);
        atualizaTabelaEstadoInstrucaoHTML(diagrama["tabela"])
        gerarTabelaEstadoUFHTML(diagrama);
        atualizaTabelaEstadoUFHTML(diagrama["uf"]);
        gerarTabelaEstadoMenHTML(diagrama);
        atualizaTabelaEstadoMenHTML(diagrama["destino"]);
        terminou = false;
        $("#clock").html("<h3>Clock: <small id='clock'>0</small></h3>");
    });

    $("#proximo").click(function() {
        if(!diagrama) {
            alert("Envie primeiro");
            return;
        }
        if(terminou) {
            alert("Todas as instruções estão completadas.");
            return;
        }
        terminou = avancaCiclo(diagrama);

    });
    $("#resultado").click(function() {
        if(!diagrama) {
            alert("Envie primeiro");
            return;
        }
        while(!terminou) {
            terminou = avancaCiclo(diagrama);
        }
    });
});
