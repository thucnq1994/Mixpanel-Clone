function GET(req, res){
	var response = {};
	if ( 1==1 ) { // Kiem tra quyen han
		if( typeof req.params.id == 'undefined' || req.params.id.length == 0 ) {
			global.Server.Model.SurveyModel.find({}, function(err, data) {
				if(err) {
	                response = {"error" : true,"message" : "Error fetching data"};
	            } else {
	                response = {"error" : false,"message" : data};
	            }
				res.json(response);
			});
		} else {
			// ID is exists, GET detail by ID
			global.Server.Model.SurveyModel.findById( req.params.id, function(err, Survey) {
				if(err) {
	                res.json({"error" : true,"message" : "Error fetching data"});
	            } else {
					if ( Survey ){
						response = {"error" : false,"message" : Survey};
					} else {
						response = {"error" : true,"message" : "Survey does not exists"};
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
	if ( sess.current_user ) {
		if( typeof req.body.name == 'undefined' || req.body.name.length == 0 ) {
			res.json({"error" : true,"message" : "Survey: Wrong param"});
		} else {
			global.Server.Model.ProjectModel.findOne({"_id" : req.body.project_id}, function(err, project) {
				if(err) {
					console.log(err);
		            res.json({"error" : true,"message" : "Error when authorization"});
		        } else {
					var survey = global.Server.Model.SurveyModel();
					survey.project_id = project._id;
					survey.name = req.body.name;
					survey.save(function(err, data){
						if(err){
							console.log(err);
							response = {"error" : true,"message" : "Error when inserting data"};
						} else {
							response = {"error" : false,"message" : data};
						}
						res.json(response);
					});
				}
			});
		}
	} else {
		res.json({ "error": true, "message": "You dont have permission to do this action!"});
	}
}

function PUT(req, res) {
	if ( 1==1 ) {
		if( typeof req.params.id == 'undefined' || req.params.id.length == 0 ) {
			response = {"error" : true,"message" : "Wrong param"};
			res.json(response);
		} else {
			global.Server.Model.SurveyModel.findById( req.params.id, function(err, survey) {
				if(err) {
	                res.json({"error" : true,"message" : "Error fetching data"});
	            } else {
					if ( survey ){
						if(req.body.name !== undefined) {
		                    survey.name = req.body.name;
		                }
						if(req.body.question !== undefined) {
		                    survey.question = req.body.question;
		                }
		                // save the data
		                survey.save(function(err){
		                    if(err) {
		                        response = {"error" : true,"message" : "Error updating data"};
		                    } else {
		                        response = {"error" : false,"message" : "Data is updated for "+req.params.id};
		                    }
		                    res.json(response);
		                });
					} else {
						response = {"error" : true,"message" : "Survey does not exists"};
						res.json(response);
					}
				}
			});
			
		}
	} else {
		response = {"error" : true,"message" : "You dont have permission to do this action!"};
		res.json(response);
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
		    global.Server.Model.SurveyModel.findById(req.params.id,function(err,data){
		        if(err) {
		            response = {"error" : true,"message" : "Error fetching data"};
		            res.json(response);
		        } else {
		            // data exists, remove it.
		            global.Server.Model.SurveyModel.remove({_id : req.params.id},function(err){
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

function index(req, res){
	var sess = req.session;
	if (sess.current_user) {
		if ( sess.cur_project && sess.cur_project._id ) {
			global.Server.Model.ProjectModel.findById(sess.cur_project._id, function(err, project) {
				if(err) {
					console.log(err);
					sess.message = { content : 'Error when getting project data', type : 'danger' };
					res.redirect('/');
				}

				getSurveyList({"project_id" : project._id}, function(err, data){
					res.render('survey', { surveys: data, data : req.currentData });
				});
			});
		} else {
			sess.message = { content : 'You need to create a project to access this section', type : 'danger' };
			res.redirect('/');
		}
	} else {
		sess.message = { content : 'You must login to access this area!', type : 'danger' };
		res.redirect('/login');
	}
}

function getSurveyList( param, cb){
	global.Server.Model.SurveyModel.find(param).sort({'date' : -1}).limit(100).exec(function(err, data) {

		if (err) {
			console.log(err);
			return cb && cb(err);
		}

		return cb && cb(null, data);
	});
}

function delete_survey(req, res){
	var sess = req.session;
	if (sess.current_user) {
		global.Server.Model.SurveyModel.findOne({"_id" : req.params.id}, function(err, survey) {
			if(err) {
				console.log(err);
				sess.message = { content : 'Error when getting survey data', type : 'danger' };
				res.redirect('/survey');
			}
			if (survey) {
				global.Server.Model.ProjectModel.findById(sess.cur_project._id, function(err, project){
					if(err) {
						sess.message = { content : 'Error when getting project data!', type : 'danger' };
						res.redirect('/survey');
					} else {
						if( survey.project_id.toString() === project._id.toString() ) {
							global.Server.Model.QuestionModel.remove({"survey_id" : survey._id.toString()}, function(err){
								if(err){
									console.log(err);
									sess.message = { content : 'Error when remove question!', type : 'danger' };
									res.redirect('/survey');
								} else {
									survey.remove(function(err){
										if(err) {
											sess.message = { content : 'Delete survey failed!', type : 'danger' };
											res.redirect('/survey');
										} else {
											sess.message = { content : 'Delete successful!', type : 'success' };
											res.redirect('/survey');
										}
									});
								}
							});
						} else {
							sess.message = { content : 'Error: You cant delete this survey!', type : 'danger' };
							res.redirect('/survey');
						}
					}
				});
			} else {
				sess.message = { content : 'Error: Survey does not exist!', type : 'danger' };
				res.redirect('/survey');
			}
			
		});
	} else {
		sess.message = { content : 'You must login to access this area!', type : 'danger' };
		res.redirect('/login');
	}
}

function create_survey(req, res) {
	var sess = req.session;
	if (sess.current_user) {
		if ( sess.cur_project && sess.cur_project._id ) {
			global.Server.Model.ProjectModel.findById(sess.cur_project._id, function(err, project) {
				if(err) {
					console.log(err);
					sess.message = { content : 'Error when getting project data', type : 'danger' };
					res.redirect('/');
				}

				res.render('create-survey', { data : req.currentData });
			});
		} else {
			sess.message = { content : 'You need to create a project to access this section', type : 'danger' };
			res.redirect('/');
		}
	} else {
		sess.message = { content : 'You must login to access this area!', type : 'danger' };
		res.redirect('/login');
	}
}


function update_survey(req, res) {
	var sess = req.session;
	if (sess.current_user) {
		global.Server.Model.SurveyModel.findOne({"_id" : req.params.id}, function(err, survey) {
			if(err) {
				console.log(err);
				sess.message = { content : 'Error when getting project data', type : 'danger' };
				res.redirect('/');
			}
			global.Server.Model.QuestionModel.find({"survey_id" : survey._id.toString()}).sort({'index' : 1}).exec(function(err, question) {
				var questionList = {};
				var i = 1;
				for (var key in question) {
					if (question.hasOwnProperty(key)) {
						var tempObj = {};
						tempObj.id = i;
						tempObj.question_id = question[key]._id;
						tempObj.type = question[key].type;
						tempObj.question = question[key].question;
						tempObj.answer = question[key].answer;
						questionList[i] = tempObj;
						i++;
					}
				}
				res.render('update-survey', { data : req.currentData, survey : survey, questionList : questionList });
			});
		});
	} else {
		sess.message = { content : 'You must login to access this area!', type : 'danger' };
		res.redirect('/login');
	}
}

function create_survey_POST(req, res) {

}

module.exports.GET = GET;
module.exports.POST = POST;
module.exports.PUT = PUT;
module.exports.DELETE = DELETE;
module.exports.index = index;
module.exports.create_survey = create_survey;
module.exports.update_survey = update_survey;
module.exports.create_survey_POST = create_survey_POST;
module.exports.delete_survey = delete_survey;