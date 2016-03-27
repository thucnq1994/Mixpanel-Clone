function getSessionData(req,res,next){
  	var sess = req.session;

  	var mess_content = null;
	var mess_type = null;
	if(sess.message) {
		if(sess.message.content){
			mess_content = sess.message.content;
			sess.message.content = null;
		}
		if(sess.message.type){
			mess_type = sess.message.type;
			sess.message.type = null;
		}
	}
	
  	if (sess.current_user) {
  		req.currentData = {
	  		current_user : sess.current_user,
	  		message : { content : mess_content, type : mess_type },
	  		projects : null,
	  		cur_project : sess.cur_project ? sess.cur_project : null
  		};

  		global.Server.Model.ProjectModel.find({"user" : sess.current_user.id}, function(err, projects) {
			req.currentData.projects = projects;
			if ( sess.cur_project == null && projects.length > 0 ) {
				sess.cur_project = projects[0];
				req.currentData.cur_project = projects[0];
			}
			next();
		});
  		

	} else {
  		req.currentData = {
	  		current_user : null,
	  		message : { content : mess_content, type : mess_type },
	  		projects : null,
	  		cur_project: null
  		};
  		next();
  	}
  	
}

module.exports.getSessionData = getSessionData;