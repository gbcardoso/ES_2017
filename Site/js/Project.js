class Project{
	constructor(obj,key){
		this.obj = obj;
		/*
			(obj) 	obj
						id
						description
						default_branch
						public
						archived
						created_at
						http_url_to_repo
						issues_enabled
						last_activity_at
						merge_request_enabled
						name
						name_with_namespace
						path
						path_with_namespace
						snippets_enabled
						ssh_url_to_repo
						visibility_level
						web_url
						wiki_enabled
					(obj)namespace
									avatar
									created_at
									id
									name
									owner_id
									path
									updated_at
							(obj)	__proto__
						owner
									avatar_url
									id
									name
									state
									username
							(obj)	__proto__
						(obj)__proto__
			(obj)	__proto__
		*/
		this.list = []/*lista de branches*/
		this.commits = [];/*lista de commits*/
	}

}