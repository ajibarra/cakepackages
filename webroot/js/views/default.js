$(document).ready(function() {
	App.init();

	$.ajaxSetup({
		beforeSend: function() {
			App.loadIndicator('start');
		},
		complete: function() {
			App.loadIndicator('stop');
		}
	});
	
	$("#language-switcher li a span").each(function() {
		var html = $(this).html();
		html = html.replace(/\(.*$/, '');
		html = $.trim(html);
		$(this).html(html);
	})
	var $selected = $("#language-switcher li.selected").remove().html();
	$("#language-switcher").before('<div id="selectedLanguage">' + $selected + '</div>');
	$("#language-switcher").hide();

	$("#selectedLanguage").click(function() {
		$("#language-switcher").slideToggle();
		return false;
	});

	$('#flashMessage')
		.slideToggle('fast');

	$('#container')
		.delegate('.idea > .rating > a.vote', 'click', function(e) {
			var self = this;
			var voteCallback = function() {
				$.ajax({
					url : self.href + '.json',
					dataType: 'json',
					data: {},
					success: function(data) {
						if (data.result.status == 'success') {
							$(self)
								.closest('.idea').addClass('voted')
									.find('.rating .current').html(data.result.rating)
								.end()
								.find('.rating a').remove();
						}
					},
				});
			}
			if (!('username' in App.user)) {
				App.requestLogin(voteCallback);
			} else {
				voteCallback();
			}
			e.preventDefault();
		});
});