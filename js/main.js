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
		$('#modulepick').css('margin-top', $('body').scrollTop()+'px');
		$('.pick').fadeIn();
		menu.fadeOut();
	});
	$('#findbtn').click(function() {
		$('#modulelost').css('margin-top', $('body').scrollTop()+'px');
		$('.lost').fadeIn();
		menu.fadeOut();
	});
	$('#songsearch').click(function() {
		$('#modulesearch').css('margin-top', $('body').scrollTop()+50+'px');
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
		inputTitle = $('#titleinput').val();
		searchoffset = 0;
		$('.resultlist').empty();
		$('.resultlist').append($('<li class="songinfo"/>')
			.text('加载更多 »')
			.attr('id', 'morebtn')
			.attr('style', 'display: none;')
			.click(function() {
				searchoffset = searchoffset + 10;
				applySearch(inputTitle, searchoffset);
			})
		);
		applySearch(inputTitle, 0);
	});

	$('.toastwrap').click(function() {
		$('.toastwrap').fadeOut();
	});

	$('#submitSong').click(function() {
		var sendername = $('#sendername').val().trim();
		var playtime = $('#playtime').val().trim();
		var toname = $('#toname').val().trim();
		var sendmessage = $('#sendmessage').val().trim();
		var ifsubmit = typeof selectedSong.name == 'undefined' ? false : sendername == '' ? false : playtime == '' ? false : toname == '' ? false : sendmessage == '' ? false : true;
		console.log(sendername+' '+playtime+' '+toname+' '+sendmessage);
		console.log(ifsubmit);
		if (ifsubmit) {
			/*Test song adding*/
			//addSongList({
			//	songcover: selectedSong.picUrl,
			//	songtitle: selectedSong.name,
			//	info: "0",
			//	user: sendername,
			//	to: toname,
			//	message: "「" + sendmessage + "」"
			//});
			/*End testing*/
			var postinfo = {
				mod: "requestmusicpost",
				user: sendername,
				songid: selectedSong.musicid,
				to: toname,
				message: sendmessage,
				time: playtime.replace(/\-/g, '\/')
			}
			console.log(postinfo);
			$.post('http://121.41.115.101:88/api/command/update.php', postinfo, function(res) {
				console.log(res);
				getSongList();
				setToast(res.message);
			}, 'json');
			$('.overlay').fadeOut();
			menu.fadeIn();
		}
	});

	$('#submitLost').click(function() {
		var getname = $('#getname').val().trim();
		var contactinfo = $('#contactinfo').val().trim();
		var iteminfo = $('#iteminfo').val().trim();
		var ifsubmit = getname == '' ? false : contactinfo == '' ? false : iteminfo == '' ? false : true;
		if (ifsubmit) {
			/*Test adding message*/
			//var message = "来自" + getname + "同学的寻物启事：" + iteminfo + "，请有拾到者拨打电话" + contactinfo + "。谢谢！";
			//addAnnounce(message);
			/*End testing*/
			var postinfo = {
				mod: "LostandfoundPost",
				user: getname,
				message: iteminfo,
				tel: contactinfo
			}
			console.log(postinfo);
			$.post('http://121.41.115.101:88/api/command/update.php', postinfo, function(res) {
				console.log(res);
				getMessageList();
				setToast(res.message);
			}, 'json');
			$('.overlay').fadeOut();
			menu.fadeIn();
		}
	});

	function setToast(data) {
		$('.toast').text(data);
		$('.toastwrap').fadeIn();
	}

	function applySearch(title, offset) {
		$.get('http://s.music.163.com/search/get', {
			'type': 1,
			's': title,
			'limit': 10,
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
							$('#songsearch').text(songinfo);
							$('.overlay.song').fadeOut();
						})
					);
				}
				if (data.result.songCount > 10) {
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
		var $coverimg = $('<img src="' + data.songcover + '" alt="专辑封面" width="160px" height="160px" ondragstart="return false" onerror="this.src=\'image/music.jpg\'"/>');
		var $cover = $('<div class="title-page"/>')
			.append($coverimg);
		var $title = $('<h1/>')
			.text(data.songtitle);
		var $message = $('<p/>')
			.text(data.message);
		var $headmsg = $('<div class="song-title"/>')
			.append($title, $message);
		var $user = $('<p/>')
			.text('点歌人：' + data.user);
		var $to = $('<p/>')
			.text('送给：' + data.to);
		var $isplayedbtn = $('<button type="button">');
		switch (data.info) {
			case "0":
				$isplayedbtn.text('未播放');
				break;
			case "1":
				$isplayedbtn.text('已播放')
					.css('background-color', '#20B333');
				break;
			case "2":
				$isplayedbtn.text('无法播放')
					.css('background-color', '#FF0000');
				break;
			default:
				$isplayedbtn.text('未知')
					.css('background-color', '#0000FF');
		}
		var $isplayed = $('<div class="button-r"/>')
			.append($isplayedbtn);
		var $info = $('<div class="module-action x">')
			.append($user, $to, $isplayed);
		var $mainBody = $('<div class="module-r"/>')
			.append($headmsg, $info);
		var $listDiv = $('<div class="module levitate row"/>')
			.append($cover, $mainBody);

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
			$messageWrap.css('background-color', '#00BBFF');
			announce.prepend($messageWrap);
		} else {
			announce.append($messageWrap);
		}
	}

	function getMessageList() {
		$.get('http://121.41.115.101:88/api/command/message.php', function(res) {
			console.log(res);
			announce.empty();
			addAnnounce(res.notice, true);
			if (res.permission == 0) {
				menu.hide();
				addAnnounce('当前不能点歌', true);
			}
			for (i in res.lostandfound) {
				addAnnounce(res.lostandfound[i], 0);
			}
		}, 'json');
	}

	function getSongList() {
		$.get('http://121.41.115.101:88/api/command/index.php', function(res) {
			console.log(res);
			mainpage.empty();
			for (i in res) {
				addSongList(res[i]);
			}
		}, 'json');
	}

	getMessageList();
	getSongList();

	/*var testsonginfo = {
		info: "0",
		songtitle: "西行妖の春",
		songcover: "http://p1.music.126.net/GAoElZdWZdGJ_ZPa8GRNVQ==/801543976648994.jpg?param=160x160",
		user: "TestUser",
		to: "TestTo",
		message: "现充统统去死吧！！！！"
	};
	var testlost = "失物招领测试";
	var testnotice = "通知测试";
	addSongList(testsonginfo);
	addAnnounce(testlost);
	addAnnounce(testnotice, true);*/
});