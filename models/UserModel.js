module.exports = function (mongoose) {

	var UserSchema = mongoose.Schema({
		"username" : {type : String, required : true, unique : true },
		"pwd" : {type : String, required : true },
		"name" : {type : String, default: "Username"},
		"group" : { type: Number, default: 1 }
	});	

	return mongoose.model('user', UserSchema);
};