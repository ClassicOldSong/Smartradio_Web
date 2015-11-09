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
		$('.pick').fadeIn();
		menu.fadeOut();
	});
	$('#findbtn').click(function() {
		$('.lost').fadeIn();
		menu.fadeOut();
	});
	$('#songsearch').click(function() {
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

	function renderMenu() {
		menu.css('display', 'none');
		setTimeout(function() {
			menu.css('display', 'block');
			menu.className = pos + effect;
		}, 1);
	}

	function addSongList(data) {
		var $coverimg = $('<img src="'+data.songcover+'" alt="专辑封面" width="160px" height="160px" ondragstart="return false" onerror="this.src=\'image/music.jpg\'"/>');
		var $cover = $('<div class="title-page"/>')
			.append($coverimg);
		var $title = $('<h1/>')
			.text(data.songtitle);
		var $message = $('<p/>')
			.text(data.message);
		var $headmsg = $('<div class="song-title"/>')
			.append($title, $message);
		var $user = $('<p/>')
			.text('点歌人：'+data.user);
		var $to = $('<p/>')
			.text('送给：'+data.to);
		var $isplayedbtn = $('<button type="button">');
		if (data.info == "0") {
			$isplayedbtn.text('未播放');
		} else if (data.info == "1") {
			$isplayedbtn.text('无法播放')
				.css('background-color', '#FF0000');
		} else if (data.info == "2") {
			$isplayedbtn.text('已播放')
				.css('background-color', '#20B333');
		} else {
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
		mainpage.prepend($listDiv);
	}

	function addAnnounce(data, isnotice) {
		var $messageBody = $('<p/>')
			.text(data);
		var $messageWrap = $('<div class="levitate module-announcement"/>')
			.append('<div class="module-content"/>')
			.append($messageBody);
		if (isnotice) {
			$messageWrap.css('background-color', '#00BBFF');
		}
		
		//Append to announcement
		if (isnotice) {
			announce.prepend($messageWrap);
		} else {
			announce.append($messageWrap);
		}
	}

	var testsonginfo = {
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
	addAnnounce(testnotice, true);
});