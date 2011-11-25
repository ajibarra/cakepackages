/**
 * App application wide Javascript namespace
 * 
 */
var App = {};

App.init = function (){
	for (var prop in this) {
		if (typeof this[prop].init == 'function') {
			App.initModule(prop);
		}
	}
};
App.initModule = function (module) {
	if (this[module].require != undefined) {
		var classes = this[module].require.slice();
		classes.push(this[module].init.bind(this[module]));
		App.use.apply(window, classes);
	} else {
		this[module].init();
	}
};

App.loadIndicator = function(status) {
	if (status == 'start') {
		$('<div id="ajax-indicator" />')
			.append('<img src="'+App.basePath+'img/loading.gif">')
			.dialog({
				width:260,
				height:50,
				modal:true
			})
			.closest('.ui-dialog.ui-widget')
				.css('border', 'none')
				.css('background', 'transparent');
	} else {
		$('#ajax-indicator').dialog('close').dialog('destroy').remove();
	}
}

App.playlistContainer = (function() {
	var hide = function() {
		$('#container .inner-container .playlist-toggle').fadeOut('fast');
		$(".playlist-player")
			.hide("scale", {direction:"vertical", origin: ["top", "center"]}, function() {
				$('#container .inner-container .playlist-toggle').removeClass('hide').addClass('show').fadeIn();
			});
	}
	var show = function() {
		$('#container .inner-container .playlist-toggle').fadeOut('fast');
		$(".playlist-player")
			.slideDown('slow', function() {
				$('#container .inner-container .playlist-toggle').removeClass('show').addClass('hide').fadeIn();
			});
	}
	return {hide: hide, show: show}
})();

App.requestLogin = function(callback) {
	$.get(App.basePath + 'login', {}, function(form) {

		$('<div class="dialog" />')
			.append(form)
				.find('div.submit')
					.append('<span class="close">or <a href="javascript:void()">Cancel</a></span>')
						.find('a').click(function() { $(this).closest('.dialog').dialog('close'); })
					.end()
				.end()
				.find('form')
				.submit(function(e) {
					var dg = $(this).closest('.dialog');
					$.ajax({
						url: this.action,
						type: 'POST',
						dataType: 'json',
						data: $(this).serialize(),
						beforeSend: function(request) {
							request.setRequestHeader("Accept", "application/json");
						},
						success: function(response) {
							if (response.user) {
								App.user = response.user;
								dg.dialog('destroy');
								callback.call();
							} else {
								alert('Invalid username or password');
							}
						}
					})
					e.preventDefault();
				})
			.end()
			.dialog({
				width: 300,
				height:300,
				close: function() {
					$(this).dialog('destroy');
				}
			})
	})
}

App.ajaxForm = function() {
	var self = this;
	var postCallback = function() {
		$.ajax({
			url: self.href,
			success: function(response) {
				var dg = $('<div class="dialog" />');
					dg.append(response)
					.find('div.submit')
						.append('<span class="close">or <a href="javascript:void()">Cancel</a></span>')
							.find('a').click(function() { $(this).closest('.dialog').dialog('close'); })
						.end()
					.end()
					.find('form')
						.submit(function(e){
							$.ajax({
								type: 'POST',
								dataType: 'json',
								url: this.action + '.json',
								data: $(this).serialize(),
								success: function(response) {
									msg = $(response.message).text();
									if (response.success) {
										dg.dialog('destroy');
										new Message(msg);
									} else {
										new Error(msg);
									}
								}
							})
							e.preventDefault();
						})
					.end()
					.dialog({
						height:330,
						width:300,
						close: function() {
							$(this).dialog('destroy');
						}
					})
			}
		});
	}
	if (!('username' in App.user)) {
		App.requestLogin(postCallback)
	} else {
		postCallback();
	}
}

/**
 * Create a basic prototypal inheritance Class.
 * 
 * Create new classes with Class.create({prototype object});
 * Extend a class with Class.extend({prototype object});
 * Tape on new methods to all existing instances with Class.implement({object});
 * 
 * Classes can have an init() function which acts as a constructor for the prototype
 */
function Class (features) {
	var klass = function (noStart) {
		if (typeof this.init == 'function' && noStart != 'noInit') {
			return this.init.apply(this, arguments);
		}
		return this;
	};
	for (var key in this) {
		klass[key] = this[key];
	}
	klass.prototype = features;
	return klass;
};

Class.prototype.extend = function (features) {
	var oldProto, oldFunc, newFunc, func;
	oldProto = new this('noInit');

	var makeParent = function(parent, current) {
		return function () {
			this.parent = parent;
			return current.apply(this, arguments);
		};
	};

	for (var key in features) {
		oldFunc = oldProto[key];
		newFunc = features[key];
		if (typeof oldFunc != 'function' || typeof newFunc != 'function') {
			func = newFunc;
		} else {
			func = makeParent(oldFunc, newFunc);
		}
		oldProto[key] = func;
	}
	return new Class(oldProto);
};

Class.prototype.implement = function (features) {
	for (var key in features) {
		this.prototype[key] = features[key];
	}
};

/**
 * Empty function good for comparing to empty functions
 */
Class.empty = function () { };



/**
 * Add bind function to all functions.
 *
 * lets change 'this' in any function.
 */
if (typeof Function.bind != 'function') {
	Function.prototype.bind = function (obj) {
		var method = this;
		return function() {
			return method.apply(obj, arguments);
		};
	}
}

// Convert CamelCase string to camel_case string.
if (typeof String.underscore != 'function') {
	String.prototype.underscore = function () {
		var underscored = this.replace(/([A-Z])/g, '_$1').toLowerCase();
		if (underscored.substr(0, 1) == '_') {
			return underscored.substring(1);
		}
		return underscored;
	}
}


if (console === undefined) {
	var console = {
		log: function () {},
		error: function () {},
		trace: function () {}
	};
}

/*
 Popup functionality
*/

function clearMessages() {
	document.getElementById('messages-container').removeChild(document.getElementById('messages-container').firstChild);
}

Message = function(text) {
	this.flush(text);
}

Message.prototype = {
	oBox: null,
	flush: function(text) {
		this.oBox = document.createElement('div');
		this.oBox.className = 'message';
		this.oBox.innerHTML = text;
		var __self = this;
		this.oBox.onclick = function() {
			document.getElementById('messages-container').removeChild(__self.oBox);
		};
		document.getElementById('messages-container').appendChild(this.oBox);
		setTimeout('clearMessages()', 5000);
	}		
}

Error = function(text) {
	this.flush(text);
}

Error.prototype = {	
	oBox: null,
	flush: function(text) {
		this.oBox = document.createElement('div');
		this.oBox.className = 'error';
		this.oBox.innerHTML = text;
		var __self = this;
		this.oBox.onclick = function() {
			document.getElementById('messages-container').removeChild(__self.oBox);
		};
		document.getElementById('messages-container').appendChild(this.oBox);
		setTimeout('clearMessages()', 5000);
	}
	
}
