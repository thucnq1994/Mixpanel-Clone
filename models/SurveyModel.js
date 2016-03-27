module.exports = function (mongoose) {

	var SurveySchema = mongoose.Schema({
		"project_id" : {type: Object, ref:'project', required: true},
		"name" : {type: String, required: true},
		"date" : { type: Date, default: Date.now },
	});

	return mongoose.model('survey', SurveySchema);
};