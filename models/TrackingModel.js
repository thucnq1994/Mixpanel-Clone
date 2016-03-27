module.exports = function (mongoose) {

	var TrackingSchema = mongoose.Schema({
		"project_id" : {type: Object, ref:'project', required: true},
		"event" : {type: String, required: true},
		"data" : {type: String},
		"related_data" : {type: String},
		"date" : { type: Date, default: Date.now },
	});

	return mongoose.model('tracking', TrackingSchema);
};