module.exports = function (mongoose) {

	var QuestionSchema = mongoose.Schema({
		"survey_id" : {type: Object, ref:'survey', required: true},
		"index" : {type: Number, required: true, min: 1},
		"type" : {type: String, required: true},
		"question" : {type: String, required: true},
		"answer" : {type: String}
	});

	return mongoose.model('question', QuestionSchema);
};