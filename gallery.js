setTimeout(() => {
    if (db) {
        let dbTransactionVideo = db.transaction("video", "readonly");
        let videoStore = dbTransactionVideo.objectStore("video");
        let videoRequest = videoStore.getAll();
        videoRequest.onsuccess = (e) => {
            let videoResult = videoRequest.result;
            let galleryCont = document.querySelector(".gallery-cont");
            videoResult.forEach((videoObj) => {
                let mediaElem = document.createElement("div");
                mediaElem.setAttribute("class", "media-cont");
                mediaElem.setAttribute("id", videoObj.id);

                let url = URL.createObjectURL(videoObj.blobData);
                mediaElem.innerHTML = `
                    <div class="media">
                        <video autoplay loop src="${url}"></video>
                    </div>
                    <div class="download action-btn">Download</div>
                    <div class="delete action-btn">Delete</div>
                `;
                galleryCont.appendChild(mediaElem);

                let deleteBtn = mediaElem.querySelector(".delete");
                deleteBtn.addEventListener("click",deleteListener);
                let downloadBtn = mediaElem.querySelector(".download");
                downloadBtn.addEventListener("click",downloadListener);
                
            });
        }

        let dbTransactionImg = db.transaction("image", "readonly");
        let imgStore = dbTransactionImg.objectStore("image");
        let imgRequest = imgStore.getAll();
        imgRequest.onsuccess = (e) => {
            let imgResult = imgRequest.result;
            let galleryCont = document.querySelector(".gallery-cont");
            imgResult.forEach((imgObj) => {
                let mediaElem = document.createElement("div");
                mediaElem.setAttribute("class", "media-cont");
                mediaElem.setAttribute("id", imgObj.id);

                let url = imgObj.url;
                mediaElem.innerHTML = `
                    <div class="media">
                        <img src="${url}"></img>
                    </div>
                    <div class="download action-btn">Download</div>
                    <div class="delete action-btn">Delete</div>
                `;
                galleryCont.appendChild(mediaElem);

                let deleteBtn = mediaElem.querySelector(".delete");
                deleteBtn.addEventListener("click",deleteListener);
                let downloadBtn = mediaElem.querySelector(".download");
                downloadBtn.addEventListener("click",downloadListener);
                
            });
        }
    }
}, 100);

function deleteListener(e) {

    let id = e.target.parentElement.getAttribute("id");

    if(id.slice(0,3) === "vid") {
        let videoDBTransaction = db.transaction("video","readwrite");
        let videoStore = videoDBTransaction.objectStore("video");
        videoStore.delete(id);
    } else if(id.slice(0,3) === "img") {
        let imgDBTransaction = db.transaction("image","readwrite");
        let imgStore = imgDBTransaction.objectStore("image");
        imgStore.delete(id);
    }

    e.target.parentElement.remove();
}

function downloadListener(e) {
    let id = e.target.parentElement.getAttribute("id");

    if(id.slice(0,3) === "vid") {
        let videoDBTransaction = db.transaction("video","readwrite");
        let videoStore = videoDBTransaction.objectStore("video");
        let videoRequest = videoStore.get(id);
        videoRequest.onsuccess = (e) => {
            let videoResult = videoRequest.result;
            let videoURL = URL.createObjectURL(videoResult.blobData);

            let a = document.createElement("a");
            a.href = videoURL;
            a.download = "stream.mp4";
            a.click();
        }
    } else if(id.slice(0,3) === "img") {
        let imgDBTransaction = db.transaction("image","readwrite");
        let imgStore = imgDBTransaction.objectStore("image");
        let imgRequest = imgStore.get(id);
        imgRequest.onsuccess = (e) => {
            let imgResult = imgRequest.result;

            let a = document.createElement("a");
            a.href = imgResult.url;
            a.download = "img.jpg";
            a.click();
        }
    }
}