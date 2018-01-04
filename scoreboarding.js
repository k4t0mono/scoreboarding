// scoreboarding.js

function teste() {
	console.log("aa");
}

function getConfig() {
	var conf = {};

	conf["nInst"] = $("#nInst").val();
	conf["ciclosInt"] = $("#ciclosInt").val();
	conf["ciclosFPAdd"] = $("#ciclosFPAdd").val();
	conf["ciclosFPMul"] = $("#ciclosFPMul").val();
	conf["ciclosFPDiv"] = $("#ciclosFPDiv").val();

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
		$("#code").text(`${JSON.stringify({"config":CONFIG, "insts":insts}, null, 2)}\n`);

	});
});
