//= require <popup>

App.packagesView = {
	
	init: function() {
		var self = this;
		
		$('div.actions')
			.delegate('a.rate', 'click', function(e) {
				var self = this;
				var rateCallback = function() {
					$.ajax({
						url: self.href + '.json',
						success: function(result, textStatus) {
							new Message(textStatus);
							if (result.status != 'error') {
								new Message(result.message);
							} else {
								new Error(result.message);
							}
						}
					});
				}
				if (!('username' in App.user)) {
					App.requestLogin(rateCallback)
				} else {
					rateCallback();
				}
				e.preventDefault();
			})
	}
};