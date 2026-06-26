/* ===========================================
   MERGE
=========================================== */

function getMergeSource(){

    if(croppedImages.length>0){

        return croppedImages;

    }

    return files;

}


/* ===========================================
   MERGE IMAGES
=========================================== */

function mergeImages(){

    const source = getMergeSource();

    clearPreviewInfo();

    if(source.length===0){

        mergedCanvas = null;

        if(typeof renderPreview==="function"){

            renderPreview();

        }

        setStatus("Chưa có ảnh để ghép");

        return;

    }

    const { cols, rows } = getGrid(source.length);

    const canvas = document.createElement("canvas");

    canvas.width = cols * cellWidth;

    canvas.height = rows * cellHeight;

    const ctx = canvas.getContext("2d");

    ctx.fillStyle = "#ffffff";

    ctx.fillRect(0, 0, canvas.width, canvas.height);

    source.forEach((img, index)=>{

        const col = index % cols;

        const row = Math.floor(index / cols);

        const x = col * cellWidth;

        const y = row * cellHeight;

        drawFitted(ctx, img, x, y, cellWidth, cellHeight);

        addPreviewInfo(x, y, cellWidth, cellHeight, img);

    });

    mergedCanvas = canvas;

    if(typeof renderPreview==="function"){

        renderPreview();

    }

    setStatus("Đã ghép " + source.length + " ảnh");

}


/* ===========================================
   DRAW FITTED (giữ tỉ lệ, căn giữa trong cell)
=========================================== */

function drawFitted(ctx, img, x, y, w, h){

    const ratio = Math.min(

        w / img.width,

        h / img.height

    );

    const drawW = img.width * ratio;

    const drawH = img.height * ratio;

    const offsetX = x + (w - drawW) / 2;

    const offsetY = y + (h - drawH) / 2;

    ctx.drawImage(img, offsetX, offsetY, drawW, drawH);

}


/* ===========================================
   EXPORT
=========================================== */

window.mergeAPI = {

    mergeImages,

    getMergeSource

};
