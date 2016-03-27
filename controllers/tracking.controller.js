function GET(req, res){
	var response = {};
	if ( 1==1 ) { // Kiem tra quyen han
		if( typeof req.params.id == 'undefined' || req.params.id.length == 0 ) {
			global.Server.Model.TrackingModel.find({}, function(err, data) {
				if(err) {
	                response = {"error" : true,"message" : "Error fetching data"};
	            } else {
	                response = {"error" : false,"message" : data};
	            }
				res.json(response);
			});
		} else {
			// ID is exists, GET detail of user by ID
			global.Server.Model.TrackingModel.findById( req.params.id, function(err, data) {
				if(err) {
	                res.json({"error" : true,"message" : "Error fetching data"});
	            } else {
					if ( data ){
						response = {"error" : false,"message" : data};
					} else {
						response = {"error" : true,"message" : "Tracking does not exists"};
					}
				}
				res.json(response);
			});
		}
	} else {
		response = {"error" : true,"message" : "You dont have permission to do this action!"};
		res.json(response);
	}
}

function POST(req, res) {
	global.Server.Model.ProjectModel.find({"token" : req.body.token}, function(err, project) {
		if(err) {
			console.log(err);
            res.json({"error" : true,"message" : "Error when authorization"});
        } else {
            if( project ) {
            	if( typeof req.body.event == 'undefined' || req.body.event.length == 0 ) {
					res.json({"error" : true,"message" : "Wrong param"});
				} else {
					var tracking = global.Server.Model.TrackingModel({
						"project_id" : project._id,
						"event" : req.body.event,
						"data" : req.body.data || "",
						"related_data" : req.body.related_data || ""
					});
					tracking.save(function(err){
						if(err){
							console.log(err);
							response = {"error" : true,"message" : "Error fetching data"};
						} else {
							response = {"error" : false,"message" : "Tracking recorded successfully"};
						}
						res.json(response);
					});
				}
            } else {
				res.json({"error" : true,"message" : "You dont have permission to do this action!"});
			}
        }
		
	});
}

function live(req, res){
	var sess = req.session;
	if ( sess.current_user != null ) {
		if ( sess.cur_project && sess.cur_project._id ) {
			global.Server.Model.ProjectModel.findById(sess.cur_project._id, function(err, project) {
				if(err) {
					console.log(err);
					sess.message = { content : 'Error when getting project data', type : 'danger' };
					res.redirect('/');
				}

				getLiveData({"project_id" : project._id}, function(err, data){
					res.render('live', { livedata : data, data : req.currentData });
				});
			});
		} else {
			sess.message = { content : 'You need to create a project to access this section', type : 'danger' };
			res.redirect('/');
		}
		
	} else {
		sess.message = { content : 'You must login to access this area', type : 'danger' };
		res.redirect('/login');
	}
}

function getLiveData( param, cb){
	global.Server.Model.TrackingModel.find(param).sort({'date' : -1}).limit(100).exec(function(err, data) {

		if (err) {
			console.log(err);
			return cb && cb(err);
		}

		return cb && cb(null, data);
	});
}

function RECORD(req, res){
	global.Server.Model.ProjectModel.findById(req.params.id, function(err, project) {
		if(err) {
			console.log(err);
            res.json({"error" : true,"message" : "Error when authorization"});
        } else {
            if( project && typeof project !== 'undefined' ) {
            	if( typeof req.query.event == 'undefined' || req.query.event.length == 0 ) {
					res.json({"error" : true,"message" : "Wrong param" + req.query.event});
				} else {
					var tracking = global.Server.Model.TrackingModel({
						"project_id" : project._id,
						"event" : req.query.event,
						"data" : JSON.stringify(req.query.data) || "",
						"related_data" : JSON.stringify(req.query.related_data) || ""
					});
					tracking.save(function(err){
						if(err){
							console.log(err);
							response = {"error" : true,"message" : "Error fetching data"};
						} else {
							response = {"error" : false,"message" : "Tracking recorded successfully"};
						}
						res.json(response);
					});
				}
            } else {
				res.json({"error" : true,"message" : "You dont have permission to do this action!"});
			}
        }
		
	});
}

module.exports.GET = GET;
module.exports.RECORD = RECORD;
module.exports.POST = POST;
module.exports.LIVE = live;