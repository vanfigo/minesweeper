$(document).ready(function(){

	var cellArray = [],
		totalMines = 0,
		totalCells = 0,
		flags = 0,
		xCells = 0,
		yCells = 0,
		difficultArray = [{
			xCells: 10,
			yCells: 10,
			mines:	10
		},{
			xCells: 30,
			yCells: 20,
			mines:	60
		},{
			xCells: 50,
			yCells: 25,
			mines:	120
		}];
		$('.alert, .card').hide();

	var validateClick = function(){
		coordinatesArray = $(this).attr('coordinate').split(',');
		var xPos = parseInt(coordinatesArray[0]);
			yPos = parseInt(coordinatesArray[1]),
			value = cellArray[yPos][xPos];
		if($(this).hasClass("flag")) {
			$(this).removeClass("flag");
			flags--;
			updateResult();
		} else {
			if(value === null) {
				var bombCount = getMineCount(xPos, yPos);
				if(bombCount === 0) {
					revealCeroCells(xPos, yPos);
				} else {
					cellArray[yPos][xPos] = bombCount;
					$(this).addClass('marked');
					$(this).text(bombCount);
					totalCells--;
				}
			} else {
				if(value < 0) {
					loseGame();
					return 0;
				}
			}

			updateResult();
			if(totalCells === totalMines){
				winGame();
			}
		}
	};

	var validateRightClick = function() {
		coordinatesArray = $(this).attr('coordinate').split(',');
		var xPos = parseInt(coordinatesArray[0]);
			yPos = parseInt(coordinatesArray[1]),
			value = cellArray[yPos][xPos];
		if((value === null || value < 0) && !$(this).hasClass('flag')) {
			$(this).addClass('flag');
			flags++;
			updateResult();
		}
	};

	var startBoard = function() {
		if( $('option:selected').val() === '' ) {
			alert('Please select a difficult');
			return 0;
		}

		$('.progress').show();
		$('#result').hide();
		$('.navbar').removeClass('bg-success bg-danger').addClass('bg-warning');

		var optionSelected = parseInt($('option:selected').val());
		var boardData = difficultArray[optionSelected];
		xCells = boardData.xCells;
		yCells = boardData.yCells;
		totalMines = boardData.mines;
		flags = 0;
		$("div.game").empty();
		$("div.game").width(23 * xCells);
		for(var y = 0; y < yCells; y++) {
			cellArray[y] = [];
			for(var x = 0; x < xCells; x++) {
				cellArray[y].push(null);
				var cell = document.createElement('div');
				cell.className = 'cell';
				cell.setAttribute('coordinate', x + ', ' + y);
				$("div.game").append(cell);
			}
		}
		var i = totalMines;
		while(i > 0) {
			var xPos = Math.floor(Math.random() * xCells + 1) - 1,
				yPos = Math.floor(Math.random() * yCells + 1) - 1;
			if(cellArray[yPos][xPos] === null) {
				cellArray[yPos][xPos] = -1;
				i--;
			}
		}
		totalCells = xCells * yCells;
		updateResult();
		$('div.cell').bind('click', validateClick);
		$('div.cell').bind('contextmenu', validateRightClick);
	};

	var getMineCount = function(xPos, yPos){
		var bombCount = 0;
		//look to the right
		if(xPos+1 < xCells && cellArray[yPos][xPos+1] < 0) {
			bombCount++;
		}
		//look to the right-bottom
		if(xPos+1 < xCells && yPos+1 < yCells && cellArray[yPos+1][xPos+1] < 0) {
			bombCount++;
		}
		//look to the bottom
		if(yPos+1 < yCells && cellArray[yPos+1][xPos] < 0) {
			bombCount++;
		}
		//look to the left-bottom
		if(xPos-1 >= 0 && yPos+1 < yCells && cellArray[yPos+1][xPos-1] < 0) {
			bombCount++;
		}
		//look to the left
		if(xPos-1 >= 0 && cellArray[yPos][xPos-1] < 0) {
			bombCount++;
		}
		//look to the left-top
		if(xPos-1 >= 0 && yPos-1 >= 0 && cellArray[yPos-1][xPos-1] < 0) {
			bombCount++;
		}
		//look to the top
		if(yPos-1 >= 0 && cellArray[yPos-1][xPos] < 0) {
			bombCount++;
		}
		//look to the right-top
		if(xPos+1 < xCells && yPos-1 >= 0 &&cellArray[yPos-1][xPos+1] < 0) {
			bombCount++;
		}
		return bombCount;
	};

	var revealCeroCells = function(xPos, yPos) {
		var bombCount = getMineCount(xPos, yPos);

		if(cellArray[yPos][xPos] !== null) {
			return 0;
		}
		totalCells--;
		var cell = $('div[coordinate="' + xPos + ', ' + yPos + '"]');
		cellArray[yPos][xPos] = bombCount;

		if(cell.hasClass('flag')) {
			cell.removeClass('flag');
			flags--;
		}
		if(bombCount === 0) {
			cell.addClass('cero');
		} else {
			cell.addClass('marked');
			cell.text(bombCount);
			return 0;
		}
		//look to the right
		if(xPos + 1 < xCells) {
			revealCeroCells(xPos+1, yPos);
		}
		//look to the right-bottom
		if(xPos + 1 < xCells && yPos + 1 < yCells) {
			revealCeroCells(xPos+1, yPos+1);
		}
		//look to the bottom
		if(yPos + 1 < yCells) {
			revealCeroCells(xPos, yPos+1);
		}
		//look to the left-bottom
		if(xPos - 1 >= 0 && yPos + 1 < yCells) {
			revealCeroCells(xPos-1, yPos+1);
		}
		//look to the left
		if(xPos - 1 >= 0) {
			revealCeroCells(xPos-1, yPos);
		}
		//look to the left-top
		if(xPos - 1 >= 0 && yPos - 1 >= 0) {
			revealCeroCells(xPos-1, yPos-1);
		}
		//look to the top
		if(yPos - 1 >= 0) {
			revealCeroCells(xPos, yPos-1);
		}
		//look to the right-top
		if(xPos + 1 < xCells && yPos - 1 >= 0) {
			revealCeroCells(xPos+1, yPos-1);
		}
	};

	var winGame = function() {
		$('div.cell').each(function(key, value){
			if($(value).attr('class').split(' ').length === 1) {
				$(value).addClass('flag');
			}
		});
		$('div.cell').unbind('click');
		$('div.cell').unbind('contextmenu');
		$('.navbar').removeClass('bg-warning').addClass('bg-success');
		$('.progress').hide();
		$('#result').show().text('You win');
	};

	var loseGame = function() {
		for(var yPos = 0; yPos < yCells; yPos++){
			for(var xPos = 0; xPos < xCells; xPos++){
				var cell =$ ('div[coordinate="' + xPos + ', ' + yPos + '"]');
				if(cellArray[yPos][xPos] < 0){
					cell.addClass('mine');
				} else {
					if(cell.hasClass('flag')){
						cell.addClass('wrong');
					}
				}
			}
		}
		$('div.cell').unbind('click');
		$('div.cell').unbind('contextmenu');
		$('.navbar').removeClass('bg-warning').addClass('bg-danger');
		$('.progress').hide();
		$('#result').show().text('You lose');
	};

	var updateResult = function() {
		var minesLeft = totalMines - flags,
			progress = 100 - (minesLeft * 100 / totalMines);
		minesLeft = minesLeft < 0 ? 0 : minesLeft;
		progress = progress > 100 ? 100 : progress;
		$('#mine-count').text(minesLeft);
		$('.progress-bar').attr('aria-valuenow', progress).width(progress + '%');
	};

	$('.btn-game').bind('click', function(){
		$('div.cell').unbind('click');
		$('div.cell').unbind('contextmenu');
		startBoard();
	});

});
