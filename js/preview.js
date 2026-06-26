/* ===========================================
   PREVIEW
=========================================== */

function renderPreview(){

    if(!mergedCanvas){

        preview.width = 0;

        preview.height = 0;

        clearPreview();

        return;

    }

    preview.width = mergedCanvas.width * zoom;

    preview.height = mergedCanvas.height * zoom;

    const ctx = preview.getContext("2d");

    ctx.clearRect(0, 0, preview.width, preview.height);

    ctx.save();

    ctx.scale(zoom, zoom);

    ctx.drawImage(mergedCanvas, 0, 0);

    ctx.restore();

    drawDimOverlay(ctx);

    drawSelectionHighlight(ctx);

    drawDragGhost(ctx);

    drawDeleteButtons(ctx);

}


/* ===========================================
   NÚT XÓA TRÊN Ô ĐANG HOVER / ĐANG CHỌN
=========================================== */

let previewHoverOnlyIndex = -1;

function drawDeleteButtons(ctx){

    if(previewHasDragged) return; // không hiện nút xóa khi đang kéo-thả

    const targets = new Set();

    if(previewHoverOnlyIndex>=0) targets.add(previewHoverOnlyIndex);

    if(selectedIndex>=0) targets.add(selectedIndex);

    targets.forEach(index=>{

        const btn = getDeleteButtonRect(index);

        if(!btn) return;

        ctx.save();

        ctx.scale(zoom, zoom);

        ctx.beginPath();

        ctx.arc(btn.cx, btn.cy, btn.r, 0, Math.PI*2);

        ctx.fillStyle = "rgba(20,18,24,.85)";

        ctx.fill();

        ctx.lineWidth = 1.5 / zoom;

        ctx.strokeStyle = "rgba(255,255,255,.25)";

        ctx.stroke();

        ctx.strokeStyle = "#ffffff";

        ctx.lineWidth = 2 / zoom;

        ctx.lineCap = "round";

        const off = btn.r * 0.42;

        ctx.beginPath();

        ctx.moveTo(btn.cx - off, btn.cy - off);

        ctx.lineTo(btn.cx + off, btn.cy + off);

        ctx.moveTo(btn.cx + off, btn.cy - off);

        ctx.lineTo(btn.cx - off, btn.cy + off);

        ctx.stroke();

        ctx.restore();

    });

}


/* ===========================================
   LÀM MỜ CÁC Ô KHÁC KHI ĐANG KÉO 1 Ô
=========================================== */

function drawDimOverlay(ctx){

    if(

        !previewHasDragged ||

        previewDragIndex===-1 ||

        previewDragIndex>=previewImages.length

    ){

        return;

    }

    ctx.save();

    ctx.scale(zoom, zoom);

    ctx.fillStyle = "rgba(0,0,0,.55)";

    previewImages.forEach((info, index)=>{

        if(

            index===previewDragIndex ||

            index===previewHoverIndex

        ) return;

        ctx.fillRect(info.x, info.y, info.w, info.h);

    });

    ctx.restore();

}


/* ===========================================
   HIGHLIGHT Ô ĐANG CHỌN (theo selectedIndex)
=========================================== */

function drawSelectionHighlight(ctx){

    if(

        selectedIndex<0 ||

        selectedIndex>=previewImages.length

    ){

        return;

    }

    const info = previewImages[selectedIndex];

    ctx.save();

    ctx.scale(zoom, zoom);

    ctx.strokeStyle = "#3d8bfd";

    ctx.lineWidth = 3 / zoom;

    ctx.strokeRect(info.x, info.y, info.w, info.h);

    ctx.restore();

}


/* ===========================================
   HIGHLIGHT Ô ĐANG RÊ ĐẾN (khi kéo-thả)
=========================================== */

function drawDragGhost(ctx){

    if(

        previewDragIndex===-1 ||

        previewHoverIndex===-1 ||

        previewHoverIndex===previewDragIndex ||

        previewHoverIndex>=previewImages.length

    ){

        return;

    }

    const info = previewImages[previewHoverIndex];

    ctx.save();

    ctx.scale(zoom, zoom);

    ctx.strokeStyle = "#ffb300";

    ctx.lineWidth = 3 / zoom;

    ctx.setLineDash([6 / zoom, 4 / zoom]);

    ctx.strokeRect(info.x, info.y, info.w, info.h);

    ctx.restore();

}


/* ===========================================
   TÌM Ô THEO TỌA ĐỘ CHUỘT
=========================================== */

function getPreviewIndexAt(clientX, clientY){

    if(!mergedCanvas) return -1;

    const rect = preview.getBoundingClientRect();

    const x = (clientX - rect.left) / zoom;

    const y = (clientY - rect.top) / zoom;

    return previewImages.findIndex(info=>

        x>=info.x &&

        x<=info.x+info.w &&

        y>=info.y &&

        y<=info.y+info.h

    );

}


/* ===========================================
   VÙNG NÚT XÓA (góc trên-phải mỗi ô, đơn vị canvas gốc)
=========================================== */

const DELETE_BTN_RADIUS = 11;

const DELETE_BTN_MARGIN = 8;

function getDeleteButtonRect(index){

    const info = previewImages[index];

    if(!info) return null;

    const cx = info.x + info.w - DELETE_BTN_MARGIN - DELETE_BTN_RADIUS;

    const cy = info.y + DELETE_BTN_MARGIN + DELETE_BTN_RADIUS;

    return { cx, cy, r: DELETE_BTN_RADIUS };

}

function isPointInDeleteButton(index, clientX, clientY){

    const btn = getDeleteButtonRect(index);

    if(!btn) return false;

    const rect = preview.getBoundingClientRect();

    const x = (clientX - rect.left) / zoom;

    const y = (clientY - rect.top) / zoom;

    const dx = x - btn.cx;

    const dy = y - btn.cy;

    return (dx*dx + dy*dy) <= (btn.r*btn.r);

}


/* ===========================================
   XÓA ẢNH TỪ PREVIEW (đồng bộ files + croppedImages)
=========================================== */

function deletePreviewImage(index){

    if(index<0 || index>=previewImages.length) return;

    const source = getMergeSource();

    // Kiểm tra đồng bộ TRƯỚC khi xóa, vì sau khi splice độ dài sẽ đổi.

    const filesInSyncWithCropped =

        croppedImages.length>0 &&

        files.length===croppedImages.length;

    source.splice(index, 1);

    if(source===croppedImages && filesInSyncWithCropped){

        // croppedImages và files đang khớp 1-1 -> xóa luôn ảnh gốc tương ứng

        files.splice(index, 1);

    }

    if(selectedIndex===index){

        selectedIndex = -1;

    }else if(selectedIndex>index){

        selectedIndex--;

    }

    previewHoverOnlyIndex = -1;

    renderSidebar();

    mergeImages();

    setStatus("Đã xóa ảnh");

}


/* ===========================================
   CHỌN ẢNH TRONG SIDEBAR THEO INDEX
=========================================== */

function selectThumbByIndex(index){

    document.querySelectorAll(".thumb-item").forEach((el, i)=>{

        el.classList.toggle("selected", i===index);

    });

}


/* ===========================================
   SWAP 2 Ô TRÊN PREVIEW (đồng bộ files + croppedImages)
=========================================== */

function swapPreviewIndexes(a, b){

    if(

        a===b ||

        a<0 || b<0 ||

        a>=previewImages.length ||

        b>=previewImages.length

    ){

        return;

    }

    const source = getMergeSource();

    const tmp = source[a];

    source[a] = source[b];

    source[b] = tmp;

    // Nếu đang dùng files trực tiếp (chưa crop) thì source === files,
    // còn nếu có croppedImages, ảnh gốc trong files cũng cần đổi theo
    // để giữ thumbnail sidebar đúng thứ tự với ảnh đã ghép.

    if(croppedImages.length>0 && files.length===croppedImages.length){

        const tmpFile = files[a];

        files[a] = files[b];

        files[b] = tmpFile;

    }

    renderSidebar();

    mergeImages();

    selectedIndex = b;

    selectThumbByIndex(b);

    setStatus("Đã đổi vị trí ảnh");

}


/* ===========================================
   STATE KÉO-THẢ TRÊN CANVAS
=========================================== */

let previewDragIndex = -1;

let previewHoverIndex = -1;

let previewMouseDownIndex = -1;

let previewHasDragged = false;


/* ===========================================
   MOUSE DOWN — BẮT ĐẦU CÓ THỂ KÉO
=========================================== */

preview.addEventListener(

    "mousedown",

    e=>{

        const index = getPreviewIndexAt(e.clientX, e.clientY);

        // Nếu mousedown ngay trên nút xóa, không bắt đầu kéo -> để click xử lý xóa

        if(index>=0 && isPointInDeleteButton(index, e.clientX, e.clientY)){

            previewMouseDownIndex = -1;

            previewHasDragged = false;

            return;

        }

        previewMouseDownIndex = index;

        previewHasDragged = false;

    }

);


/* ===========================================
   MOUSE MOVE — RÊ ẢNH (sau khi đã mousedown trên 1 ô)
=========================================== */

preview.addEventListener(

    "mousemove",

    e=>{

        const hitIndex = getPreviewIndexAt(e.clientX, e.clientY);

        if(previewMouseDownIndex===-1){

            const overDeleteBtn =

                hitIndex>=0 &&

                isPointInDeleteButton(hitIndex, e.clientX, e.clientY);

            preview.style.cursor =

                overDeleteBtn ? "pointer" :

                hitIndex===-1 ? "default" : "grab";

            if(previewHoverOnlyIndex!==hitIndex){

                previewHoverOnlyIndex = hitIndex;

                renderPreview();

            }

            return;

        }

        previewHoverOnlyIndex = -1;

        previewHasDragged = true;

        previewDragIndex = previewMouseDownIndex;

        preview.style.cursor = "grabbing";

        previewHoverIndex = hitIndex;

        renderPreview();

    }

);


/* ===========================================
   MOUSE UP — THẢ ẢNH VÀO Ô ĐANG HOVER
=========================================== */

preview.addEventListener(

    "mouseup",

    e=>{

        preview.style.cursor = "";

        if(previewHasDragged && previewDragIndex!==-1){

            const dropIndex = getPreviewIndexAt(e.clientX, e.clientY);

            swapPreviewIndexes(previewDragIndex, dropIndex);

        }

        previewMouseDownIndex = -1;

        previewDragIndex = -1;

        previewHoverIndex = -1;

        previewHasDragged = false;

        renderPreview();

    }

);

preview.addEventListener(

    "mouseleave",

    ()=>{

        let needsRender = false;

        if(previewHasDragged){

            previewHoverIndex = -1;

            needsRender = true;

        }

        if(previewHoverOnlyIndex!==-1){

            previewHoverOnlyIndex = -1;

            needsRender = true;

        }

        preview.style.cursor = "default";

        if(needsRender){

            renderPreview();

        }

    }

);


/* ===========================================
   CLICK — CHỌN ẢNH, HOẶC SWAP NẾU ĐÃ CÓ Ô CHỌN TRƯỚC
=========================================== */

preview.addEventListener(

    "click",

    e=>{

        if(previewHasDragged){

            // click này là phần cuối của 1 lần kéo, đã xử lý ở mouseup

            return;

        }

        const hitIndex = getPreviewIndexAt(e.clientX, e.clientY);

        if(hitIndex===-1) return;

        // Ưu tiên xử lý nút xóa trước, không cho rơi vào logic chọn/swap

        if(isPointInDeleteButton(hitIndex, e.clientX, e.clientY)){

            deletePreviewImage(hitIndex);

            return;

        }

        if(

            selectedIndex>=0 &&

            selectedIndex<previewImages.length &&

            selectedIndex!==hitIndex

        ){

            swapPreviewIndexes(selectedIndex, hitIndex);

            return;

        }

        selectedIndex = hitIndex;

        selectThumbByIndex(hitIndex);

        renderPreview();

    }

);


/* ===========================================
   EXPORT
=========================================== */

window.previewAPI = {

    renderPreview,

    swapPreviewIndexes,

    deletePreviewImage

};
