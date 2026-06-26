/* ===========================================
   GLOBAL DATA
=========================================== */

const files = [];

let croppedImages = [];

let mergedCanvas = null;

let zoom = 1;

let cellWidth = 200;

let cellHeight = 300;

let previewImages = [];

let selectedIndex = -1;

let manualCols = null; // null = tự động tính khung lưới; số nguyên = người dùng chỉ định


/* ===========================================
   DOM
=========================================== */

const imageInput =
    document.getElementById("imageInput");

const sidebar =
    document.getElementById("sidebar");

const preview =
    document.getElementById("preview");

const cropBtn =
    document.getElementById("cropBtn");

const mergeBtn =
    document.getElementById("mergeBtn");

const downloadBtn =
    document.getElementById("downloadBtn");

const zoomRange =
    document.getElementById("zoomRange");

const zoomText =
    document.getElementById("zoomText");

const imageCount =
    document.getElementById("imageCount");

const statusText =
    document.getElementById("statusText");

const colsInput =
    document.getElementById("colsInput");

const autoGridBtn =
    document.getElementById("autoGridBtn");


/* ===========================================
   STATUS
=========================================== */

function setStatus(text){

    statusText.textContent = text;

}


/* ===========================================
   IMAGE COUNT
=========================================== */

function updateImageCount(){

    imageCount.textContent =
        `${files.length} ảnh`;

}


/* ===========================================
   CLEAR PREVIEW
=========================================== */

function clearPreview(){

    const ctx =
        preview.getContext("2d");

    ctx.clearRect(
        0,
        0,
        preview.width,
        preview.height
    );

}


/* ===========================================
   GRID
=========================================== */

function getGrid(count){

    if(count<=0){

        return { cols: 1, rows: 1 };

    }

    // Người dùng đã tự chọn số cột -> giữ nguyên số cột,

    // chỉ tự tính số dòng cần thiết (có thể dư ô trống ở dòng cuối).

    if(manualCols && manualCols>0){

        const cols = manualCols;

        const rows =
            Math.ceil(
                count / cols
            );

        return {

            cols,

            rows

        };

    }

    if(count<=4){

        // 1 -> 1x1, 2 -> 2x1, 3 -> 3x1, 4 -> 2x2

        if(count===4){

            return { cols: 2, rows: 2 };

        }

        return { cols: count, rows: 1 };

    }

    // Tìm cách chia "khít" (cols * rows === count),

    // luôn ưu tiên cols >= rows (dáng ngang), và trong các lựa chọn

    // hợp lệ thì chọn cặp gần vuông nhất.

    let best = null;

    for(let rows=1; rows<=Math.floor(Math.sqrt(count)); rows++){

        if(count % rows !== 0) continue;

        const cols = count / rows;

        if(!best || (cols - rows) < (best.cols - best.rows)){

            best = { cols, rows };

        }

    }

    if(best){

        return best;

    }

    // Số nguyên tố / không chia khít được -> bù thêm ô trống,

    // vẫn ưu tiên dáng gần vuông, ngang hơn dọc.

    const cols =
        Math.ceil(
            Math.sqrt(count)
        );

    const rows =
        Math.ceil(
            count / cols
        );

    return {

        cols,

        rows

    };

}


/* ===========================================
   SWAP
=========================================== */

function swapImages(a,b){

    const tmp =
        files[a];

    files[a] =
        files[b];

    files[b] =
        tmp;

}


/* ===========================================
   REMOVE
=========================================== */

function removeImage(index){

    files.splice(index,1);

    updateImageCount();

}


/* ===========================================
   ZOOM
=========================================== */

zoomRange.addEventListener(

    "input",

    ()=>{

        zoom =
            zoomRange.value / 100;

        zoomText.textContent =
            zoomRange.value + "%";

        if(
            typeof renderPreview
            ===
            "function"
        ){

            renderPreview();

        }

    }

);


/* ===========================================
   PREVIEW IMAGE INFO
=========================================== */

function addPreviewInfo(

    x,

    y,

    w,

    h,

    image

){

    previewImages.push({

        x,

        y,

        w,

        h,

        image

    });

}

function clearPreviewInfo(){

    previewImages = [];

}