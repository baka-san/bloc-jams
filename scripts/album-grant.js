// Store state of playing songs
var currentAlbum = null;
var currentlyPlayingSongItem = null;  //<td class="song-item-number" data-song-number="songNumber">songNumber</td>
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

    		var songNumber = $(this).attr('data-song-number');
    		//var clickedSongItem = $(this);

    		// No song is playing
    		if (currentlyPlayingSongItem === null) {

    			// change the pause play button to pause
    			currentlyPlayingSongItem = $(this);
    			currentSongFromAlbum = currentAlbum.songs[songNumber - 1];

    			// update player bar song name
    			updatePlayerBarSong();

    			// change player bar play button to pause
    			$('.play-pause > span').attr('class', 'ion-pause')

    		// Pause the currently playing song
    		// Note: can't compare objects, must compare properties
    		} else if (currentlyPlayingSongItem.attr('data-song-number') === songNumber) {
    		    $(this).html(playButtonTemplate);
    		    currentlyPlayingSongItem = null;
    		    currentSongFromAlbum = null;

    		    // change player bar play button to play
    		    $('.play-pause > span').attr('class', 'ion-play');

    		// Change to a new song
    		} else {
    			// change play/pause button back to song number
    		    currentlyPlayingSongItem.html(currentlyPlayingSongItem.attr('data-song-number'));

    		    // update clicked song 
    		    $(this).html(pauseButtonTemplate);
    		    currentlyPlayingSongItem = $(this);
    		    currentSongFromAlbum = currentAlbum.songs[songNumber - 1];

    		    // update player bar song name
    		    updatePlayerBarSong();

    		    // change player bar play button to pause
    		    $('.play-pause > span').attr('class', 'ion-pause');

    		} 

	    };

	    var updatePlayerBarSong = function() {
	    	// update player bar song name
	    	$('.player-bar .artist-name').text(currentAlbum.artist);
	    	$('.player-bar .song-name').text(currentSongFromAlbum.title);
	    	$('.player-bar .artist-song-mobile').text(currentSongFromAlbum.title + ' - ' + currentAlbum.artist);
	    };

	    var onHover = function(event) {
			var songItem = $(this).find('.song-item-number');
			var songNumber = songItem.attr("data-song-number");

			// Display play button on mouseover/mouseleave IF NOT playing
			if (songNumber !== currentlyPlayingSongItem.attr("data-song-number")) {
		    	// Change to play button on mouseover
		    	songItem.html(playButtonTemplate);
		    };
	    };

	    var offHover = function(event) {
	    	var songItem = $(this).find('.song-item-number');
	    	var songNumber = songItem.attr("data-song-number");

        	if (songItem !== currentlyPlayingSongItem) {
        		songItem.html(songNumber);
        	}
	    };

	    $row.find('.song-item-number').click(clickHandler);
	    $row.hover(onHover, offHover);
	    return $row;
	};



	// 	// ========= BLOC ==========

	// 	var clickHandler = function() {
	// 		var songNumber = $(this).attr('data-song-number');

	// 		if (currentlyPlayingSongNumber !== null) {
	// 			// Revert to song number for currently playing song because user started playing new song.
	// 			var currentlyPlayingCell = $('.song-item-number[data-song-number="' + currentlyPlayingSongNumber + '"]');
	// 			currentlyPlayingCell.html(currentlyPlayingSongNumber);
	// 		}
	// 		if (currentlyPlayingSongNumber !== songNumber) {
	// 			// Switch from Play -> Pause button to indicate new song is playing.
	// 			$(this).html(pauseButtonTemplate);
	// 			currentlyPlayingSongNumber = songNumber;
	// 		} else if (currentlyPlayingSongNumber === songNumber) {
	// 			// Switch from Pause -> Play button to pause currently playing song.
	// 			$(this).html(playButtonTemplate);
	// 			currentlyPlayingSongNumber = null;
	// 		}
	// 	};

	//     var onHover = function(event) {
	//         var songNumberCell = $(this).find('.song-item-number');
	//         var songNumber = songNumberCell.attr('data-song-number');

	//         if (songNumber !== currentlyPlayingSongNumber) {
	//             songNumberCell.html(playButtonTemplate);
	//         }
	//     };

	//     var offHover = function(event) {
	//         var songNumberCell = $(this).find('.song-item-number');
	//         var songNumber = songNumberCell.attr('data-song-number');

	//         if (songNumber !== currentlyPlayingSongNumber) {
	//             songNumberCell.html(songNumber);
	//         }
	// 	};
	//     $row.find('.song-item-number').click(clickHandler);
	//     $row.hover(onHover, offHover);
	//     return $row;
	// };

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

	var trackIndex = function(album, song) {
		return album.songs.indexOf(song);
	};

	// Next button: go to next song
	var nextSong = function() {

		// update currentSongFromAlbum 
		//currentAlbum.songs[currentlyPlayingSongNumber];

		// update next song to pause button for album-view-song-list
		//$('.song-item-number').html( (attr('')

		// update currentlyPlayingSongNumber
		//currentlyPlayingSongNumber += 1;


		// switch current song back to a song number

		// change playbar song info

		//
	};

	// Previous button: go to previous song
	var previousSong = function() {

	};

	// Album button templates
	var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';
	var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';
	
	// Set random album -- testing
	setCurrentAlbum(albumPicasso);
});

