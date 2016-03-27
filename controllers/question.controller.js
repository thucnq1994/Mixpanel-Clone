function GET(req, res){
	
	var response = {};
	if ( 1==1 ) { // Kiem tra quyen han
		if( typeof req.params.id == 'undefined' || req.params.id.length == 0 ) {
			global.Server.Model.QuestionModel.find({}, function(err, data) {
				if(err) {
	                response = {"error" : true,"message" : "Error fetching data"};
	            } else {
	                response = {"error" : false,"message" : data};
	            }
				res.json(response);
			});
		} else {
			global.Server.Model.QuestionModel.findById( req.params.id, function(err, question) {
				if(err) {
	                res.json({"error" : true,"message" : "Error fetching data"});
	            } else {
					if ( question ){
						response = {"error" : false,"message" : question};
					} else {
						response = {"error" : true,"message" : "Question does not exists"};
					}
					res.json(response);
				}
			});
		}
	} else {
		response = {"error" : true,"message" : "You dont have permission to do this action!"};
		res.json(response);
	}
}

function POST(req, res){
	var sess = req.session;
	if (sess.current_user) {
		if( typeof req.body.survey_id == 'undefined' || req.body.survey_id.length == 0 || typeof req.body.index == 'undefined' || req.body.index.length == 0 || typeof req.body.type == 'undefined' || req.body.type.length == 0 || typeof req.body.question == 'undefined' || req.body.question.length == 0
		) {
			res.json({"error" : true,"message" : "Question: Wrong param"});
		} else {
			var question = global.Server.Model.QuestionModel();
			question.survey_id = req.body.survey_id;
			question.index = req.body.index;
			question.type = req.body.type;
			question.question = req.body.question;
			question.answer = req.body.answer;
			question.save(function(err){
				if(err){
					console.log(err);
					response = {"error" : true,"message" : "Error when inserting data"};
				} else {
					response = {"error" : false,"message" : "Question inserted successfully"};
				}
				res.json(response);
			});
		}
	} else {
		res.json({ "error": true, "message": "You dont have permission to do this action"});
	}
}

function PUT(req, res) {
	if ( 1==1 ) {
		if( typeof req.params.id == 'undefined' || req.params.id.length == 0 || 
		 	typeof req.body.index == 'undefined' || req.body.index.length == 0 || 
		 	typeof req.body.type == 'undefined' || req.body.type.length == 0 || 
		 	typeof req.body.question == 'undefined' || req.body.question.length == 0 || 
		 	typeof req.body.answer == 'undefined' || req.body.answer.length == 0 ) {
			res.json({"error" : true,"message" : "Wrong param!"});
		} else {
			global.Server.Model.QuestionModel.findOne({"_id" : req.params.id}, function(err, question) {
				if(err) {
	                res.json({"error" : true,"message" : "Error fetching data"});
	            } else {
					if ( question ){
						question.index = req.body.index;
						question.type = req.body.type;
						question.question = req.body.question;
						question.answer = req.body.answer;
		                question.save(function(err){
		                    if(err) {
		                        response = {"error" : true,"message" : "Error updating data"};
		                    } else {
		                        response = {"error" : false,"message" : "Data is updated for "+req.params.id};
		                    }
		                    res.json(response);
		                })
					} else {
						res.json({"error" : true,"message" : "Question does not exists"});
					}
				}
			});
			
		}
	} else {
		res.json({"error" : true,"message" : "You dont have permission to do this action!"});
	}
}

function DELETE(req,res){
	var response = {};
	if ( 1==1 ) {
		if( typeof req.params.id == 'undefined' || req.params.id.length == 0 ) {
			response = {"error" : true,"message" : "Wrong param"};
			res.json(response);
		} else {
		    // find the data
		    global.Server.Model.QuestionModel.findById(req.params.id,function(err,data){
		        if(err) {
		            response = {"error" : true,"message" : "Error fetching data"};
		            res.json(response);
		        } else {
		            // data exists, remove it.
		            global.Server.Model.QuestionModel.remove({_id : req.params.id},function(err){
		                if(err) {
		                    response = {"error" : true,"message" : "Error deleting data"};
		                } else {
		                    response = {"error" : true,"message" : "Data associated with "+req.params.id+" is deleted"};
		                }
		                res.json(response);
		            });
		        }
		    });
		}
	} else {
		response = {"error" : true,"message" : "You dont have permission to do this action!"};
		res.json(response);
	}
}

module.exports.GET = GET;
module.exports.POST = POST;
module.exports.PUT = PUT;
module.exports.DELETE = DELETE;