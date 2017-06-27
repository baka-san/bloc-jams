// Store state of playing songs
var currentAlbum = null;
var currentlyPlayingSongNumber = null;
var currentSongFromAlbum = null;
var currentSoundFile = null;
var currentVolume = 80;

$(function(){ 

	var createSongRow = function(songNumber, songName, songLength) {
	    var template =
	       '<tr class="album-view-song-item">'
	     + '  <td class="song-item-number" data-song-number="' + songNumber
	     + '">' + songNumber + '</td>'
	     + '  <td class="song-item-title">' + songName + '</td>'
	     + '  <td class="song-item-duration">' + songLength + '</td>'
	     + '</tr>'
	     ;

	    var $row = $(template);

	 	var clickHandler =  function() {

	 		var songNumber = parseInt($(this).attr('data-song-number'));

	 		// No song is playing, start playing new
	 		if (currentlyPlayingSongNumber === null) {

	 			// Set the initial volume


	 			playSong($(this));
	 		} 

	 		// Play or pause the current song
	 		else if (currentlyPlayingSongNumber === songNumber) {

	 			// Current song is paused, play it
	 			if (currentSoundFile.isPaused()) {
	 				playSong($(this));
	 			} 
	 			// Current song is playing, pause it
	 			else {
	 				pauseSong($(this));
	 		   	}

	 		// Change to a new song
	 		} else if (currentlyPlayingSongNumber !== songNumber) {

	 			// change play/pause button back to song number
	 		    var currentSongElement = getSongNumberCell(currentlyPlayingSongNumber);
	 		    currentSongElement.html(currentSongElement.attr('data-song-number'));

	 		    // Stop the current song
	 		    currentSoundFile.stop();
	 		    debugger;
	 		    // Set the seek bar position to current
	 		    $('.player-bar .fill').width(0);
	 		    $('.player-bar .thumb').css('left', 0);

	 		    // Start playing a new song
	 		    playSong($(this));
	 		} 
	 	};

	 	var playSong = function(clicked) {

	 		// Change the pause/play button to pause
	 		clicked.html(pauseButtonTemplate);

	 		// Update song variable info if new song
	 		if (currentlyPlayingSongNumber !== songNumber) {
	 			// Update song variable info
	 			setSong(songNumber);
	 		}

	 		// update player bar song name
	 		updatePlayerBarSong();

	 		// change player bar play button to pause
	 		$('.play-pause > span').attr('class', 'ion-pause')

	 		// Set the audio file to play
	 		currentSoundFile.play();
	 	};

	 	var pauseSong = function(clicked) {
	 		
	 		// change the pause/play button to play
	 		clicked.html(playButtonTemplate);

	 		// change player bar play button to play
	 		$('.play-pause > span').attr('class', 'ion-play');

	 		// Set the audio file to pause
	 		currentSoundFile.pause();
	 	};

	    var onHover = function(event) {
			var songItem = $(this).find('.song-item-number');
			var songNumber = parseInt(songItem.attr('data-song-number'));

			// Display play button on mouseover/mouseleave IF NOT playing
			if (songNumber !== currentlyPlayingSongNumber) {

		    	// Change to play button on mouseover
		    	songItem.html(playButtonTemplate);
		    }
	    };

	    var offHover = function(event) {
			var songItem = $(this).find('.song-item-number');
			var songNumber = parseInt(songItem.attr('data-song-number'));

        	if (songNumber !== currentlyPlayingSongNumber) {
        		songItem.html(songNumber);
        	}
	    };

	    $row.find('.song-item-number').click(clickHandler);
	    $row.hover(onHover, offHover);
	    return $row;
	};

	var setSong = function(songNumber) {
		currentlyPlayingSongNumber = parseInt(songNumber);
		currentSongFromAlbum = currentAlbum.songs[songNumber - 1];
		currentSoundFile = new buzz.sound(currentSongFromAlbum.audioUrl, {
			formats: ['mp3'],
			preload: true
		});
		setVolume(currentVolume);
	};

	var seek = function(time) {
	    if (currentSoundFile) {
	        currentSoundFile.setTime(time);
	    }
	}

	var setVolume = function(volume) {
		if(currentSoundFile) {
			currentSoundFile.setVolume(volume);
		}
	};

	var getSongNumberCell = function(number) {
		return $('.song-item-number[data-song-number="' + number + '"]');
	};

	var setCurrentAlbum = function(album) {
		currentAlbum = album;
		$albumTitle.text(album.title);

		$albumArtist.text(album.artist);
		$albumReleaseInfo.text(album.year + ' ' + album.label);
		$albumImage.attr('src', album.albumArtUrl);

	    $albumSongList.empty();

	    for (var i = 0; i < album.songs.length; i++) {
	    	$newRow = createSongRow(i + 1, album.songs[i].title, album.songs[i].duration);
	    	$albumSongList.append($newRow);
	    }
	};

	var updateSeekBarWhileSongPlays = function() {
	    if (currentSoundFile) {
	        
	        currentSoundFile.bind('timeupdate', function(event) {

	            var seekBarFillRatio = this.getTime() / this.getDuration();
	            var $seekBar = $('.seek-control .seek-bar');
	
	            updateSeekPercentage($seekBar, seekBarFillRatio);
	        });
	    }
	};

	var updateSeekPercentage = function($seekBar, seekBarFillRatio) {
	   var offsetXPercent = seekBarFillRatio * 100;
	   // Make sure the volume is between 0-100
	   offsetXPercent = Math.max(0, offsetXPercent);
	   offsetXPercent = Math.min(100, offsetXPercent);
	
	   // #2
	   var percentageString = offsetXPercent + '%';
	   $seekBar.find('.fill').width(percentageString);
	   $seekBar.find('.thumb').css({left: percentageString});
	};

	var setupSeekBars = function() {
		// Find both volume / audio control seekbars
	    var $seekBars = $('.player-bar .seek-bar');
	
		// Move the thumb when the bar is clicked
	    $seekBars.click(function(event) {
	    	//debugger;
	        // event.pageX = offset of click from page left
	        // $(this).offset().left = offset of bar from page left
	        // offsetX = amount the playbar moved
	        // barWidth = total width of playbar
	        var offsetX = event.pageX - $(this).offset().left;
	        var barWidth = $(this).width();
	        
	        // Find ratio seekbar changed
	        var seekBarFillRatio = offsetX / barWidth;
	
	        // Actually update the position of the thumb
	        updateSeekPercentage($(this), seekBarFillRatio);
	        
	        // Change the currentSoundFile's position
	        if ($(this).parent().attr('class') == 'seek-control') {
	        	seek(seekBarFillRatio * currentSongFromAlbum.duration);
	        }
	        else {
	        	setVolume(seekBarFillRatio * 100);
	        }
	    });

	    // Allow user to drag the thumb 
	    $seekBars.find('.thumb').mousedown(function(event) {
	        // Find the seekbar
	        var $seekBar = $(this).parent();
	    
	        // Make thumb move on drag
	        $(document).bind('mousemove.thumb', function(event){
	            var offsetX = event.pageX - $seekBar.offset().left;
	            var barWidth = $seekBar.width();
	            var seekBarFillRatio = offsetX / barWidth;
	    
	            updateSeekPercentage($seekBar, seekBarFillRatio);

	            // Change the currentSoundFile's position
	            if ($(this).parent().attr('class') == 'seek-control') {
	            	seek(seekBarFillRatio * currentSongFromAlbum.duration);
	            }
	            else {
	            	setVolume(seekBarFillRatio * 100);
	            }
	        });
	    
	        // Make thumb stop moving when unclicked
	        $(document).bind('mouseup.thumb', function() {
	            $(document).unbind('mousemove.thumb');
	            $(document).unbind('mouseup.thumb');
	        });

	    });
	};

	var updatePlayerBarSong = function() {
		// update player bar song name
		$('.player-bar .artist-name').text(currentAlbum.artist);
		$('.player-bar .song-name').text(currentSongFromAlbum.title);
		$('.player-bar .artist-song-mobile').text(currentSongFromAlbum.title + ' - ' + currentAlbum.artist);
	};

	var trackIndex = function(album, song) {
		return album.songs.indexOf(song);
	};

	// Next button: go to next song
	var nextSong = function() {

	    // switch current song back to a song number
	    var currentSongElement = getSongNumberCell(currentlyPlayingSongNumber);
	    currentSongElement.html(currentSongElement.attr('data-song-number'));

	    // Stop the current song
	    currentSoundFile.stop();

		// Find next song's index
		var nextSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);
		nextSongIndex++;

		// Check if it's the last song
		if (nextSongIndex >= currentAlbum.songs.length) {
			nextSongIndex = 0;
		}

		// Update song variable info
		setSong(nextSongIndex + 1);

        // update next song, change to pause button
        var nextSongElement = getSongNumberCell(currentlyPlayingSongNumber);
        nextSongElement.html(pauseButtonTemplate);

        // update player bar song name
        updatePlayerBarSong();

        // Play the song
        currentSoundFile.play();
	};

	// Previous button: go to previous song
	var previousSong = function() {
	    // switch current song back to a song number
	    var currentSongElement = getSongNumberCell(currentlyPlayingSongNumber);
	    currentSongElement.html(currentSongElement.attr('data-song-number'));

	    // Stop the current song
	    currentSoundFile.stop();

		// Find next song's index
		var prevSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);
		prevSongIndex--;

		// Check if it's the last song
		if (prevSongIndex < 0) {
			prevSongIndex = currentAlbum.songs.length - 1;
		}

		// Update song variable info
		setSong(prevSongIndex + 1);

        // update next song, change to pause button
        var prevSongElement = getSongNumberCell(currentlyPlayingSongNumber);
        prevSongElement.html(pauseButtonTemplate);

        // update player bar song name
        updatePlayerBarSong();

        // Play the song
        currentSoundFile.play();
	};

	var togglePlayFromPlayerBar = function() {

		// There is a currently playing song
		if (currentSoundFile) {
			// Find the currentlyPlayingSongElement
			var songElement = getSongNumberCell(currentlyPlayingSongNumber);
		}

		// No currentlyPlayingSong, play first song
		else {
			// Find the first song in the 
			var songElement = getSongNumberCell(1);
		}

		// Simulate a click on the selected element in the song table
		songElement.trigger('click');
	};

	// Album button templates
	var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';
	var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';
	
	// Set random album -- testing
	setCurrentAlbum(albumPicasso);

	setupSeekBars();

	// Set next button listener
	$('.main-controls .next').click(nextSong);
	$('.main-controls .previous').click(previousSong);
	$('.main-controls .play-pause').click(togglePlayFromPlayerBar);
});

