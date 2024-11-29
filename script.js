let video = document.querySelector("video");
let recordBtnCont = document.querySelector(".record-btn-cont");
let recordBtn = document.querySelector(".record-btn");
let captureBtnCont = document.querySelector(".capture-btn-cont");
let captureBtn = document.querySelector(".capture-btn");
let recordFlag = false;
let trasparentColor = "transparent";

let recorder;
let chunks = [];

let constraints = {
    video: true,
    audio: true
}
navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
    video.srcObject = stream;
    recorder = new MediaRecorder(stream);
    recorder.addEventListener("start", (e) => {
        chunks = [];
        startTimer();
    });
    recorder.addEventListener("dataavailable", (e) => {
        chunks.push(e.data);
    });
    recorder.addEventListener("stop", (e) => {
        stopTimer();
        let blob = new Blob(chunks, { type: "video/mp4" });

        if (db) {
            let videoId = `vid-${Math.random()}`;
            let dbTransaction = db.transaction("video", "readwrite");
            let videoStore = dbTransaction.objectStore("video");
            let videoEntry = {
                id: videoId,
                blobData: blob
            }
            videoStore.add(videoEntry);
        }
    });
});

recordBtnCont.addEventListener("click", (e) => {
    if (!recorder) return;

    recordFlag = !recordFlag;
    if (recordFlag) {
        recorder.start();
        recordBtn.classList.add("scale-record");
    } else {
        recorder.stop();
        recordBtn.classList.remove("scale-record");
    }
});

let timerID;
let counter = 0;
let timer = document.querySelector(".timer");

function startTimer() {
    timer.style.display = 'block';
    function displayTimer() {
        let totalSeconds = counter;

        let hours = Number.parseInt(totalSeconds / 3600);
        totalSeconds = totalSeconds % 3600;

        let minutes = Number.parseInt(totalSeconds / 60);
        totalSeconds = totalSeconds % 60;

        let seconds = totalSeconds;

        hours = (hours < 10) ? `0${hours}` : hours;
        minutes = (minutes < 10) ? `0${minutes}` : minutes;
        seconds = (seconds < 10) ? `0${seconds}` : seconds;

        timer.innerText = `${hours}:${minutes}:${seconds}`;
        counter++;
    }
    timerID = setInterval(displayTimer, 1000);
}

function stopTimer() {
    timer.style.display = 'none';
    clearInterval(timerID);
    timer.innerText = "00:00:00"
}

captureBtnCont.addEventListener("click", (e) => {
    captureBtn.classList.add("scale-capture");

    let canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    let tool = canvas.getContext("2d");
    tool.drawImage(video, 0, 0, canvas.width, canvas.height);

    tool.fillStyle = trasparentColor;
    tool.fillRect(0, 0, canvas.width, canvas.height)

    let imageURL = canvas.toDataURL();

    if (db) {
        let imgId = `img-${Math.random()}`;
        let dbTransaction = db.transaction("image", "readwrite");
        let imgStore = dbTransaction.objectStore("image");
        let imgEntry = {
            id: imgId,
            url: imageURL
        }
        imgStore.add(imgEntry);
    }

    setTimeout(() => {
        captureBtn.classList.add("scale-calture");
    }, 500);
});

let filterLayer = document.querySelector(".filter-layer");
let allFilters = document.querySelectorAll(".filter");
allFilters.forEach((filterElem) => {
    filterElem.addEventListener("click", (e) => {
        trasparentColor = getComputedStyle(filterElem).getPropertyValue("background-color");
        filterLayer.style.backgroundColor = trasparentColor;
    });
});