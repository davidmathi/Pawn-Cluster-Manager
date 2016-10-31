module.exports = {
	mergeObjects: function(obj1, obj2) {
		if(
			!typeof obj1 == "object" ||
			!typeof obj2 == "object"
		)
			return obj1;

		for(var key in obj2) {
			obj1[key] = obj2[key];
		}
		return obj1;
	}
};