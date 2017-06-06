window.onload = function() {
	// Global variables
	var albumTitle = document.getElementsByClassName('album-view-title')[0];
	var albumArtist = document.getElementsByClassName('album-view-artist')[0];
	var albumReleaseInfo = document.getElementsByClassName('album-view-release-info')[0];
	var albumImage = document.getElementsByClassName('album-cover-art')[0];
	var albumSongList = document.getElementsByClassName('album-view-song-list')[0];

	// Example Album
	var albumPicasso = {
	    title: 'The Colors',
	    artist: 'Pablo Picasso',
	    label: 'Cubism',
	    year: '1881',
	    albumArtUrl: 'assets/images/album_covers/01.png',
	    songs: [
	        { title: 'Blue', duration: '4:26' },
	        { title: 'Green', duration: '3:14' },
	        { title: 'Red', duration: '5:01' },
	        { title: 'Pink', duration: '3:21'},
	        { title: 'Magenta', duration: '2:15'}
	    ]
	};

	// Another Example Album
	var albumMarconi = {
	    title: 'The Telephone',
	    artist: 'Guglielmo Marconi',
	    label: 'EM',
	    year: '1909',
	    albumArtUrl: 'assets/images/album_covers/20.png',
	    songs: [
	        { title: 'Hello, Operator?', duration: '1:01' },
	        { title: 'Ring, ring, ring', duration: '5:01' },
	        { title: 'Fits in your pocket', duration: '3:21'},
	        { title: 'Can you hear me now?', duration: '3:14' },
	        { title: 'Wrong phone number', duration: '2:15'}
	    ]
	};

	var createSongRow = function(songNumber, songName, songLength) {
	    var template =
	       '<tr class="album-view-song-item">'
	     + '  <td class="song-item-number" data-song-number="' + songNumber
	     + '">' + songNumber + '</td>'
	     + '  <td class="song-item-title">' + songName + '</td>'
	     + '  <td class="song-item-duration">' + songLength + '</td>'
	     + '</tr>'
	     ;

	    return template;
	};

	var setCurrentAlbum = function(album) {
	    // #1

	    // #2
	    albumTitle.firstChild.nodeValue = album.title;
	    albumArtist.firstChild.nodeValue = album.artist;
	    albumReleaseInfo.firstChild.nodeValue = album.year + ' ' + album.label;
	    albumImage.setAttribute('src', album.albumArtUrl);

	    // #3
	    albumSongList.innerHTML = '';

	    // #4
	    for (var i = 0; i < album.songs.length; i++) {
	        albumSongList.innerHTML += createSongRow(i + 1, album.songs[i].title, album.songs[i].duration);
	    }
	};




	//=========== GRANT'S CODE =================

	var findParentByClassName = function(element, desiredParent) {
		var currentParent = element.parentElement;
		while (currentParent && currentParent.className !== null) {
			if (currentParent.className == desiredParent) {
				return currentParent;
			}
			else {
				currentParent = currentParent.parentElement;
			}
		} 
	};

	var getSongItem = function(element) {
		switch (element.className) {
			case 'ion-play': 
			case 'ion-pause':
			case 'album-song-button': 
				return findParentByClassName(element, 'song-item-number');
			case 'song-item-number':
				return element;
			case 'song-item-title': 
				return element.previousElementSibling;
			case 'song-item-duration': 
				return element.previousElementSibling.previousElementSibling;
			case 'album-view-song-item':
				return element.querySelector('song-item-number');
			default:
				return;
		}
	}  

	// Handle play or pause button clicks
	var clickHandler = function(targetElement) {

		// Store the actual element, not the song number
		// Number can be retrieved via:
		// clickedSong.getAttribute('data-song-number')
		var clickedSong = getSongItem(targetElement);

		// Nothing playing or other song. 
		// On play click, display pause
		// Set currentlyPlayingSong to clicked song
		if (currentlyPlayingSong === null) {
			clickedSong.innerHTML = pauseButtonTemplate;
			currentlyPlayingSong = clickedSong;  //.getAttribute('data-song-number');
		}
		// Click currently playing. 
		// On pause click, display play. 
		// Set currentlyPlayingSong to null
		else if (currentlyPlayingSong === 
					clickedSong ) {       //.getAttribute('data-song-number')
			clickedSong.innerHTML = playButtonTemplate;
			currentlyPlayingSong = null;
		}
		// Click not currently playing song.
		// On play click, display pause
		// Restore playing song to number
		// Set currentlyPlayingSong to clicked song
		else if (currentlyPlayingSong !== 
					clickedSong) {         ////.getAttribute('data-song-number')

			currentlyPlayingSong.innerHTML = currentlyPlayingSong.getAttribute('data-song-number');
			clickedSong.innerHTML = pauseButtonTemplate;
			currentlyPlayingSong = clickedSong;     //.getAttribute('data-song-number');
		} 
	};

	// Set random album -- testing
	setCurrentAlbum(albumPicasso);

	// Album button templates
	var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';
	var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';

	// Store state of playing songs
	var currentlyPlayingSong = null;

	// All song rows in album
	var songRows = document.getElementsByClassName('album-view-song-item');	

	// Change current song button on click
	for (var i = 0; i < songRows.length; i++) {
	    songRows[i].addEventListener('click', function(event) {
	    	clickHandler(event.target);
	    });
	}

	// Change button on mouseover
	albumSongList.addEventListener('mouseover', function(event) {

		// Define currently hovered row and the song number element
		// NOTE: I am not storing the actual song number as in
		//       the Bloc tutorial
		var songRow = findParentByClassName(event.target, 'album-view-song-item');
		var songItem = getSongItem(event.target);

		// Display play button on mouseover/mouseleave IF NOT playing
		if (songItem !== currentlyPlayingSong) {
			    	
	    	// Change to play button on mouseover
	    	songItem.innerHTML = playButtonTemplate;

    		// Play button disappears upon leaving song row IF NOT playing
	        songRow.addEventListener('mouseleave', function(event) {
	        	if (songItem !== currentlyPlayingSong) {
	        		songItem.innerHTML = songItem.getAttribute("data-song-number");
	        	}
	        });
	    }	
	});

	//============ END GRANT'S CODE ===========



	//============ BLOC TUTORIAL =============

	// var findParentByClassName = function(element, targetClass) {
	//     if (element) {
	//         var currentParent = element.parentElement;
	//         while (currentParent.className !== targetClass && currentParent.className !== null) {
	//             currentParent = currentParent.parentElement;
	//         }
	//         return currentParent;
	//     }
	// };

	// var getSongItem = function(element) {
	// 	    switch (element.className) {
	// 	        case 'album-song-button':
	// 	        case 'ion-play':
	// 	        case 'ion-pause':
	// 	            return findParentByClassName(element, 'song-item-number');
	// 	        case 'album-view-song-item':
	// 	            return element.querySelector('.song-item-number');
	// 	        case 'song-item-title':
	// 	        case 'song-item-duration':
	// 	            return findParentByClassName(element, 'album-view-song-item').querySelector('.song-item-number');
	// 	        case 'song-item-number':
	// 	            return element;
	// 	        default:
	// 	            return;
	// 	}
	// };

	// // Handle play or pause button clicks
	// var clickHandler = function(targetElement) {

	// 	var songItem = getSongItem(targetElement);

	// 	if (currentlyPlayingSong === null) {
	// 	    songItem.innerHTML = pauseButtonTemplate;
	// 	    currentlyPlayingSong = songItem.getAttribute('data-song-number');
	// 	} else if (currentlyPlayingSong === songItem.getAttribute('data-song-number')) {
	// 	    songItem.innerHTML = playButtonTemplate;
	// 	    currentlyPlayingSong = null;
	// 	} else if (currentlyPlayingSong !== songItem.getAttribute('data-song-number')) {
	// 	    var currentlyPlayingSongElement = document.querySelector('[data-song-number="' + currentlyPlayingSong + '"]');
	// 	    currentlyPlayingSongElement.innerHTML = currentlyPlayingSongElement.getAttribute('data-song-number');
	// 	    songItem.innerHTML = pauseButtonTemplate;
	// 	    currentlyPlayingSong = songItem.getAttribute('data-song-number');
	// 	} 
	// };

	// // Set random album -- testing
	// setCurrentAlbum(albumPicasso);

	// // Elements we'll be adding listeners to
	// var songListContainer = document.getElementsByClassName('album-view-song-list')[0];
	// var songRows = document.getElementsByClassName('album-view-song-item');

	// // Album button templates
	// var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';
	// var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';

	// // Store state of playing songs
	// var currentlyPlayingSong = null;

	// // Don't change button if song is currently playing
	// albumSongList.addEventListener('mouseover', function(event) {
	// 	if (currentlyPlayingSong !== getSongItem(event.target).getAttribute('data-song-number')) {
	// 	    // Add play button on mouseover
	// 	    if (event.target.parentElement.className === 'album-view-song-item') {
	// 	        event.target.parentElement.querySelector('.song-item-number').innerHTML = playButtonTemplate;
	// 	    }

	// 	    for (var i = 0; i < songRows.length; i++) {

	// 	    	// Revert play button back to song number on mouseleave
	// 	        songRows[i].addEventListener('mouseleave', function(event) {

	// 	        // #1 definitions
	// 	    	var songItem = getSongItem(event.target);
	// 	    	var songItemNumber = songItem.getAttribute('data-song-number');
		    	
	// 	    	// #2 don't change button if song is playing
	// 	    	if (songItemNumber !== currentlyPlayingSong) {
	// 	    	    songItem.innerHTML = songItemNumber;
	// 	    	}

	// 	    	});

	// 	        // Change current song on click
	// 	        songRows[i].addEventListener('click', function(event) {
	// 	        	clickHandler(event.target);
	// 	        });
	// 	    }
	// 	}
	// });

	//============ END BLOC TUTORIAL =============



};

