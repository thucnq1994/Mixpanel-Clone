module.exports = function (mongoose) {

	var ProjectSchema = mongoose.Schema({
		"name" : {type : String, required : true },
		"url" : {type : String, default: "http://example.com" },
		"timezone" : {type : String, default: "Asia/Ho_Chi_Minh" },
		"user" : { type: Object, ref: 'user' }
	});	

	return mongoose.model('project', ProjectSchema);
};