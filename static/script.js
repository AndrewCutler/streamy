window.onload = function () {
	let chunks = [];
	let mediaRecorder;
	let recording = false;
	let videoUrl;

	function createMediaRecorder(stream) {
		const _mediaRecorder = new MediaRecorder(stream);

		// save data to chunks
		_mediaRecorder.ondataavailable = function ({ data }) {
			// console.log(e);
			chunks.push(data);
		};

		_mediaRecorder.onstop = async function () {
			const videoBlob = new Blob(chunks, { type: 'video/webm' });
			videoUrl = window.URL.createObjectURL(videoBlob);
			getVideoElement().src = videoUrl;

			const formData = new FormData();
			formData.append('content', videoBlob);
			await fetch('save', {
				method: 'POST',
				body: formData,
			});

			chunks = [];
		};

		return _mediaRecorder;
	}

	function getVideoElement() {
		return document.getElementsByTagName('video')[0];
	}

	function download(path, filename) {
		const anchor = document.createElement('a');
		anchor.href = path;
		anchor.download = filename;

		document.body.appendChild(anchor);
		anchor.click();
		document.body.removeChild(anchor);
	}

	async function getMedia() {
		let stream;

		try {
			stream = await navigator.mediaDevices.getUserMedia({
				video: true,
			});

			mediaRecorder = createMediaRecorder(stream);
			// stream cam to video element
			const videoElement = getVideoElement();
			videoElement.srcObject = stream;
			videoElement.onloadedmetadata = (e) => {
				videoElement.play();
			};
		} catch (err) {
			console.error(err);
		}
	}

	const getAccessButton = document.getElementById('get-access');
	getAccessButton.onclick = function () {
		getMedia();
	};

	const recordButton = document.getElementById('record');
	recordButton.onclick = function () {
		recording = !recording;
		console.log('recording: ', recording);
		if (recording) {
			mediaRecorder.start();
			recordButton.style.background = 'black';
			recordButton.style.color = 'red';
			recordButton.innerText = 'Stop';
		} else {
			mediaRecorder.stop();
			recordButton.style.background = 'gray';
			recordButton.style.color = 'black';
			recordButton.innerText = 'Record';
		}
	};

	const downloadButton = document.getElementById('download');
	downloadButton.onclick = function () {
		download(videoUrl, 'test.webm');
		window.URL.revokeObjectURL(videoUrl);
	};
};
