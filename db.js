let db;
let openRequest = indexedDB.open("myDataBase");
openRequest.addEventListener("success",(e)=> {
    console.log("DB Success");
    db = openRequest.result;
});
openRequest.addEventListener("error",(e)=> {
    console.log("DB Error");
});
openRequest.addEventListener("upgradeneeded",(e)=> {
    console.log("DB Upgrade");
    db = openRequest.result;

    db.createObjectStore("video", {keyPath: "id"});
    db.createObjectStore("image", {keyPath: "id"});

});
