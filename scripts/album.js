// Store state of playing songs
var currentAlbum = null;
var currentlyPlayingSongNumber = null;
var currentSongFromAlbum = null;

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

	 	// GRANT
	    var clickHandler =  function() {

    		var songNumber = parseInt($(this).attr('data-song-number'));

    		// No song is playing
    		if (currentlyPlayingSongNumber === null) {

    			// change the pause play button to pause
    		   $(this).html(pauseButtonTemplate);
    			setSong(songNumber);

    			// update player bar song name
    			updatePlayerBarSong();

    			// change player bar play button to pause
    			$('.play-pause > span').attr('class', 'ion-pause')

    		// Pause the currently playing song
    		} else if (currentlyPlayingSongNumber === songNumber) {
    		    $(this).html(playButtonTemplate);
    		    setSong(null);

    		    // change player bar play button to play
    		    $('.play-pause > span').attr('class', 'ion-play');

    		// Change to a new song
    		} else if (currentlyPlayingSongNumber !== songNumber) {
    			// change play/pause button back to song number
    		    var currentSongElement = getSongNumberCell(currentlyPlayingSongNumber);
    		    currentSongElement.html(currentSongElement.attr('data-song-number'));

    		    // update clicked song 
    		    $(this).html(pauseButtonTemplate);
    		    setSong(songNumber);

    		    // update player bar song name
    		    updatePlayerBarSong();

    		    // change player bar play button to pause
    		    $('.play-pause > span').attr('class', 'ion-pause');

    		} 

	    };

	    var onHover = function(event) {
			var songItem = $(this).find('.song-item-number');
			var songNumber = parseInt(songItem.attr('data-song-number'));

			// Display play button on mouseover/mouseleave IF NOT playing
			if (songNumber !== currentlyPlayingSongNumber) {

		    	// Change to play button on mouseover
		    	songItem.html(playButtonTemplate);
		    };
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
		if (songNumber === null) {
			currentlyPlayingSongNumber = null;
			currentSongFromAlbum = null;	
		} else {
			currentlyPlayingSongNumber = parseInt(songNumber);
			currentSongFromAlbum = currentAlbum.songs[songNumber - 1];
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

		// Find next song's index
		var nextSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);
		nextSongIndex++;

		// Check if it's the last song
		if (nextSongIndex >= currentAlbum.songs.length) {
			nextSongIndex = 0;
		};

		// update currentSongFromAlbum 
		currentSongFromAlbum = currentAlbum.songs[nextSongIndex];

	    // update currentlyPlayingSongNumber
		currentlyPlayingSongNumber = nextSongIndex + 1;

        // update next song, change to pause button
        var nextSongElement = getSongNumberCell(currentlyPlayingSongNumber);
        nextSongElement.html(pauseButtonTemplate);

        // update player bar song name
        updatePlayerBarSong();
	};

	// Previous button: go to previous song
	var previousSong = function() {
	    // switch current song back to a song number
	    var currentSongElement = getSongNumberCell(currentlyPlayingSongNumber);
	    currentSongElement.html(currentSongElement.attr('data-song-number'));

		// Find next song's index
		var prevSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);
		prevSongIndex--;

		// Check if it's the last song
		if (prevSongIndex < 0) {
			prevSongIndex = currentAlbum.songs.length - 1;
		};

		// update currentSongFromAlbum 
		currentSongFromAlbum = currentAlbum.songs[prevSongIndex];

	    // update currentlyPlayingSongNumber
		currentlyPlayingSongNumber = prevSongIndex + 1;

        // update next song, change to pause button
        var prevSongElement = getSongNumberCell(currentlyPlayingSongNumber);
        prevSongElement.html(pauseButtonTemplate);

        // update player bar song name
        updatePlayerBarSong();
	};

	// Album button templates
	var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';
	var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';
	
	// Set random album -- testing
	setCurrentAlbum(albumPicasso);

	// Set next button listener
	$('.main-controls .next').click(nextSong);
	$('.main-controls .previous').click(previousSong);
});

