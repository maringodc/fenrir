const fs = require('node:fs');
const datastub = require('../currentgame.json');

const getNumber = () => {
	return datastub.number;
};

const getName = () => {
	return datastub.name;
}

const getPlayers = () => {
	return datastub.players;
}

const getPlayersAsDiscordList = () => {
	let msg = "";
	getPlayers().forEach((value, index, array) => {
		msg += "1. " + value + " \n";
	})
	return msg;
}

const getRoles = () => {
	return datastub.roles;
}

const getRolesAsDiscordList = () => {
	let msg = "";
	getRoles().forEach((value, index, array) => {
		msg += "- ";
		if(value.role){
		 	msg += value.role;
		}
		if(value.property && value.role){
		 	msg += " & ";
		}
		if(value.property){
		 	msg += value.property;
		}
		msg += " \n";
	});
	return msg;
}

exports.getNumber = getNumber;
exports.getName = getName;
exports.getPlayers = getPlayers;
exports.getPlayersAsDiscordList = getPlayersAsDiscordList;
exports.getRoles = getRoles;
exports.getRolesAsDiscordList = getRolesAsDiscordList;