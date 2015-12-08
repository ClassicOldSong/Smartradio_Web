$(function() {
	var panel = $('#panel'),
		menu = $('#menu'),
		showcode = $('#showcode'),
		selectFx = $('#selections-fx'),
		selectPos = $('#selections-pos'),
		// demo defaults
		effect = 'mfb-zoomin',
		pos = 'mfb-component--br';
	var mainpage = $('.main-page');
	var announce = $('.announcement');

	var searchoffset = 0;
	var inputTitle = '';
	var selectedSong = {};
	var serverAddr = '';

	showcode.click(function() {
		panel.toggleClass('viewCode');
	});
	selectFx.change(function() {
		effect = this.options[this.selectedIndex].value;
		renderMenu();
	});
	selectPos.change(function() {
		pos = this.options[this.selectedIndex].value;
		renderMenu();
	});

	$('#pickbtn').click(function() {
		if ($.ua.browser.name == "firefox") {
			$('#modulepick').css('margin-top', $(window).scrollTop() + 'px');
		} else {
			$('#modulepick').css('margin-top', $('body').scrollTop() + 'px');
		}
		$('.pick').fadeIn();
		menu.fadeOut();
	});
	$('#findbtn').click(function() {
		if ($.ua.browser.name == "firefox") {
			$('#modulelost').css('margin-top', $(window).scrollTop() + 'px');
		} else {
			$('#modulelost').css('margin-top', $('body').scrollTop() + 'px');
		}
		$('.lost').fadeIn();
		menu.fadeOut();
	});
	$('#songsearch').click(function() {
		if ($(window).width() <= 1024 && $.ua.browser.name == "firefox") {
			$('#modulesearch').css('margin-top', $(window).scrollTop() + 100 + 'px');
		} else {
			$('#modulesearch').css('margin-top', $('body').scrollTop() + 100 + 'px');
		}
		$('.song').fadeIn();
		menu.fadeOut();
	});
	$('.overlay-z.bg, .cancelbtn.box').click(function() {
		$('.overlay').fadeOut();
		menu.fadeIn();
	});
	$('#searchwrap, #cancelbtn-search').click(function() {
		$('.overlay.song').fadeOut();
	});

	$('#searchsong').click(function() {
		startSearch();
	});

	$('.toastwrap').click(function() {
		$('.toastwrap').animate({
			bottom: "-" + $('.toastwrap').height() + "px"
		}, 200);
		menu.css('bottom', 0);
	});

	menu.mouseenter(function() {
		menu.attr('data-mfb-state', 'open');
	});
	menu.mouseleave(function() {
		menu.attr('data-mfb-state', 'closed');
	});

	$('#submitSong').click(function() {
		var sendername = $('#sendername').val().trim();
		var playtime = $('#playtime').val();
		var playdate = $('#playdate').val();
		var toname = $('#toname').val().trim();
		var sendmessage = $('#sendmessage').val().trim();
		var ifsubmit = function() {
			if (typeof selectedSong.name == 'undefined') {
				$('#songsearch').css('background-color', '#FF0000');
				return false;
			} else if (sendername == '') {
				$('#sendername').css('border-bottom', 'solid 1px #FF0000');
				return false;
			} else if (playdate == '') {
				$('#sendername').css('border-bottom', 'solid 1px #3B58B4');
				$('#playdate').css('border-bottom', 'solid 1px #FF0000');
				return false;
			} else if (playtime == '') {
				$('#sendername, #playdate').css('border-bottom', 'solid 1px #3B58B4');
				$('#playtime').css('border-bottom', 'solid 1px #FF0000');
				return false;
			} else if (toname == '') {
				$('#sendername, #playdate, #playtime').css('border-bottom', 'solid 1px #3B58B4');
				$('#toname').css('border-bottom', 'solid 1px #FF0000');
				return false;
			} else if (sendmessage == '') {
				$('#sendername, #playdate, #playtime, #toname').css('border-bottom', 'solid 1px #3B58B4');
				$('#sendmessage').css('border-bottom', 'solid 1px #FF0000');
				return false;
			} else {
				$('#sendername, #playdate, #playtime, #toname, #sendmessage').css('border-bottom', 'solid 1px #3B58B4');
				return true;
			}
		}
		if (ifsubmit()) {
			var postinfo = {
				mod: "requestmusicpost",
				user: sendername,
				songid: selectedSong.musicid,
				to: toname,
				option: playtime,
				message: sendmessage,
				time: playdate.replace(/\-/g, '\/')
			}
			$.post(serverAddr + '/api/command/update.php', postinfo, function(res) {
				getSongList();
				setToast(res.message);
			}, 'json');
			$('.overlay').fadeOut();
			menu.fadeIn();
		}
	});

	$('#submitLost').click(function() {
		var getname = $('#getname').val().trim();
		var contactinfo = $('#contactinfo')[0].valueAsNumber;
		var iteminfo = $('#iteminfo').val().trim();
		var ifsubmit = function() {
			if (getname == '') {
				$('#getname').css('border-bottom', 'solid 1px #FF0000');
				return false;
			} else if (isNaN(contactinfo)) {
				$('#getname').css('border-bottom', 'solid 1px #3B58B4');
				$('#contactinfo').css('border-bottom', 'solid 1px #FF0000');
				return false;
			} else if (iteminfo == '') {
				$('#getname, #contactinfo').css('border-bottom', 'solid 1px #3B58B4');
				$('#iteminfo').css('border-bottom', 'solid 1px #FF0000');
				return false;
			} else {
				$('#getname, #contactinfo, #iteminfo').css('border-bottom', 'solid 1px #3B58B4');
				var telReg = !!$('#contactinfo').val().match(/^((\d{11})|^((\d{7,8})|(\d{4}|\d{3})-(\d{7,8})|(\d{4}|\d{3})-(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1})|(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1}))$)$/);
				if (!telReg) {
					$('#contactinfo').css('border-bottom', 'solid 1px #FF0000');
				}
				return telReg;
			}
		}
		if (ifsubmit()) {
			var postinfo = {
				mod: "LostandfoundPost",
				user: getname,
				message: iteminfo,
				tel: $('#contactinfo').val()
			}
			$.post(serverAddr + '/api/command/update.php', postinfo, function(res) {
				getMessageList();
				setToast(res.message);
			}, 'json');
			$('.overlay').fadeOut();
			menu.fadeIn();
		}
	});

	$("#titleinput").keydown(function(event) {
		if (event.which === 13) {
			startSearch();
		}
	});

	function startSearch() {
		inputTitle = $('#titleinput').val();
		searchoffset = 0;
		$('.resultlist').empty();
		$('.resultlist').append($('<li class="songinfo"/>')
			.text('加载更多 »')
			.attr('id', 'morebtn')
			.attr('style', 'display: none;')
			.click(function() {
				searchoffset = searchoffset + 6;
				applySearch(inputTitle, searchoffset);
			})
		);
		applySearch(inputTitle, 0);
	}

	function setToast(data) {
		$('.toast').text(data);
		$('.toastwrap').css('bottom', '-' + $('.toastwrap').height() + 'px');
		$('.toastwrap').animate({
			bottom: 0
		}, 200);
		menu.css('bottom', $('.toastwrap').height() + 'px');
	}

	function applySearch(title, offset) {
		$.get('http://s.music.163.com/search/get', {
			'type': 1,
			's': title,
			'limit': 6,
			'offset': offset
		}, function(data) {
			if (data.result) {
				for (var i = 0; i < data.result.songs.length; i++) {
					var artists = data.result.songs[i].artists[0].name;
					var itemId = i + offset;
					for (var j = 1; j < data.result.songs[i].artists.length; j++) {
						if (data.result.songs[i].artists[j]) {
							artists = artists + "/" + data.result.songs[i].artists[j].name;
						}
					}
					$("#morebtn").before($('<li class="songinfo"/>')
						.text(data.result.songs[i].name + " - " + artists)
						.attr('listid', i)
						.attr('artists', artists)
						.attr('id', 'musiclistitem' + itemId)
						.click(function() {
							var listid = $(this).attr('listid');
							var songinfo = $(this).text();
							selectedSong = {
								'name': data.result.songs[listid].name,
								'picUrl': data.result.songs[listid].album.picUrl,
								'musicid': data.result.songs[listid].id
							}
							$('#songsearch').text(songinfo)
								.css('background-color', '#888');
							$('.overlay.song').fadeOut();
						})
					);
				}
				if (data.result.songCount > 6) {
					$("#morebtn").show();
				} else {
					$("#morebtn").before($('<li class="songinfo"/>').text('╮(╯_╰)╭没有更多了'));
				}
			} else {
				$("#morebtn").hide();
				$("#morebtn").before($('<li class="songinfo"/>').text('╮(╯_╰)╭没有更多了'));
			}
		}, 'jsonp');
	}

	function renderMenu() {
		menu.css('display', 'none');
		setTimeout(function() {
			menu.css('display', 'block');
			menu.className = pos + effect;
		}, 1);
	}

	function addSongList(data) {
		var $title = $('<h1/>')
			.text(data.songtitle);
		var $message = $('<p/>')
			.text(data.message);
		var $headmsg = $('<div class="song-title"/>')
			.append($title, $message);
		var $user = $('<p/>')
			.text('点歌人：' + data.user + '，送给：' + data.to);
		var $isplayedbtn = $('<button type="button">');
		switch (data.info) {
			case "0":
				$isplayedbtn.text('未播放');
				break;
			case "1":
				$isplayedbtn.text('已播放')
					.css('background-color', '#259B24');
				break;
			case "2":
				$isplayedbtn.text('无法播放')
					.css('background-color', '#E51C23');
				break;
			default:
				$isplayedbtn.text('未知')
					.css('background-color', '#5677FC');
		}
		var $isplayed = $('<div class="button-r"/>')
			.append($isplayedbtn);
		var $info = $('<div class="module-action x">')
			.append($user, $isplayed);
		var $mainBody = $('<div class="module-r"/>')
			.append($headmsg, $info);
		var $listDiv = $('<div class="module levitate row"/>')
			.append($mainBody);
		if ($(window).width() > 1024) {
			var $coverimg = $('<img src="' + data.songcover + '" alt="专辑封面" width="160px" height="160px" ondragstart="return false" onerror="this.src=\'image/music.jpg\'"/>');
			var $cover = $('<div class="title-page"/>')
				.append($coverimg);
			$listDiv.prepend($cover);
		}

		//Append to main-page
		mainpage.append($listDiv);
	}

	function addAnnounce(data, isnotice) {
		var $messageBody = $('<p/>')
			.text(data);
		var $messageWrap = $('<div class="levitate module-announcement"/>')
			.append($messageBody);

		//Append to announcement
		if (isnotice) {
			$messageWrap.css('background-color', '#03A9F4');
			announce.prepend($messageWrap);
		} else {
			announce.append($messageWrap);
		}
	}

	function getMessageList() {
		$.get(serverAddr + '/api/command/message.php', function(res) {
			announce.empty();
			if (res.notice != "") {
				addAnnounce(res.notice, true);
			}
			if (res.permission === "0") {
				$('#pickbtn').hide();
				setToast('当前不能点歌');
			}
			for (i in res.lostandfound) {
				addAnnounce(res.lostandfound[i], 0);
			}
		}, 'json');
	}

	function getSongList() {
		$.get(serverAddr + '/api/command/index.php', function(res) {
			mainpage.empty();
			for (i in res) {
				addSongList(res[i]);
			}
		}, 'json');
	}

	$.get('config.json', function(res) {
		serverAddr = res.serverAddr;
		$('#logo_').text(res.projectname);
		document.title = res.projectname + ' - Smartradio';
		getMessageList();
		getSongList();
	}, 'json');

	$('#playdate')[0].valueAsDate = new Date();
});