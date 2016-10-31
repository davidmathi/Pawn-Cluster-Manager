var validator = {
	required: function(item) {
		if(!item) return false;
		if(item === null || item === false ||) return false;
		if(typeof item === "undefined") return false;
		return true;
	}	
};

module.exports = validator;