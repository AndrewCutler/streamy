window.onload = function () {
	let chunks = [];
	let mediaRecorder;
	let recording = false;
	let videoUrl;

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

	const onStop = async () => {
		// const audioBlob = new Blob(chunks, { type: 'audio/ogg; codecs=opus' });
		// const audioUrl = window.URL.createObjectURL(audioBlob);
		// document.getElementsByTagName('audio')[0].src = audioUrl;

		// includes audio
		const videoBlob = new Blob(chunks, { type: 'video/webm' });
		videoUrl = window.URL.createObjectURL(videoBlob);
		getVideoElement().src = videoUrl;

		const formData = new FormData();
		formData.append('content', videoBlob);
		// await fetch('save', {
		// 	method: 'POST',
		// 	body: formData,
		// });
		chunks = [];
	};

	async function getMedia() {
		let stream;

		try {
			stream = await navigator.mediaDevices.getUserMedia({
				video: true,
				// audio: true,
			});
			mediaRecorder = new MediaRecorder(stream);
			// save data to chunks
			mediaRecorder.ondataavailable = (e) => {
				console.log(e);
				chunks.push(e.data);
			};
			mediaRecorder.onstop = onStop;

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
	getAccessButton.onclick = () => {
		getMedia();
	};

	const recordButton = document.getElementById('record');
	recordButton.onclick = () => {
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
	downloadButton.onclick = () => {
		download(videoUrl, 'test.webm');
		window.URL.revokeObjectURL(videoUrl);
	};

	// document.getElementsByTagName('video')[0].onclick = () => {
	// 	console.log({ chunks });
	// };
};
