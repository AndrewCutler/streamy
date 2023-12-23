window.onload = function () {
	let chunks = [];
	let mediaRecorder;
	let recording = false;

	const onStop = async () => {
		const audioBlob = new Blob(chunks, { type: 'audio/ogg; codecs=opus' });
		const audioUrl = window.URL.createObjectURL(audioBlob);
		document.getElementsByTagName('audio')[0].src = audioUrl;

		// includes audio
		const videoBlob = new Blob(chunks, { type: 'video/webm' });
		const videoUrl = window.URL.createObjectURL(videoBlob);
		document.getElementsByTagName('video')[0].src = videoUrl;

        console.log('save')
		await fetch('/save', {
			method: 'POST',
			body: chunks,
		});
		chunks = [];
	};

	async function getMedia() {
		let stream;

		try {
			stream = await navigator.mediaDevices.getUserMedia({
				video: true,
				audio: true,
			});
			mediaRecorder = new MediaRecorder(stream);
			mediaRecorder.ondataavailable = (e) => {
				console.log(e);
				chunks.push(e.data);
			};
			mediaRecorder.onstop = onStop;
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

	document.getElementsByTagName('video')[0].onclick = () => {
		console.log({ chunks });
	};
};
