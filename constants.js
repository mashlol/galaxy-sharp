var Constant = function(constant) {
	this.constant = constant;
};

Constant.prototype.toString = function() {
	return this.constant;
}

module.exports = {
	ANY_PLAYER: new Constant("c_playerAny"),
	IGNORE: new Constant("c_keyModifierStateIgnore"),
	W_KEY: new Constant("c_keyW"),
	A_KEY: new Constant("c_keyA"),
	S_KEY: new Constant("c_keyS"),
	D_KEY: new Constant("c_keyD"),
}