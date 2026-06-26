/* ===========================================
   CROP
=========================================== */

let cropRect = {

    x: 95,

    y: 177,

    w: 137,

    h: 208

};


/* ===========================================
   SET CROP
=========================================== */

function setCropRect(x, y, w, h){

    cropRect.x = x;

    cropRect.y = y;

    cropRect.w = w;

    cropRect.h = h;

}


/* ===========================================
   RESET
=========================================== */

function resetCrop(){

    croppedImages = [];

    if(typeof mergeImages==="function"){

        mergeImages();

    }

    setStatus("Đã khôi phục ảnh gốc");

}


/* ===========================================
   CROP ALL
=========================================== */

function cropAll(){

    if(files.length===0){

        alert("Chưa có ảnh.");

        return;

    }

    croppedImages=[];

    let skipped=0;

    files.forEach(img=>{

        if(

            img.width<cropRect.x+cropRect.w ||

            img.height<cropRect.y+cropRect.h

        ){

            skipped++;

            return;

        }

        const canvas=document.createElement("canvas");

        canvas.width=cropRect.w;

        canvas.height=cropRect.h;

        const ctx=canvas.getContext("2d");

        ctx.drawImage(

            img,

            cropRect.x,

            cropRect.y,

            cropRect.w,

            cropRect.h,

            0,

            0,

            cropRect.w,

            cropRect.h

        );

        croppedImages.push(canvas);

    });

    if(typeof mergeImages==="function"){

        mergeImages();

    }

    setStatus(

        "Đã crop "

        +

        croppedImages.length

        +

        " ảnh"

    );

    if(skipped>0){

        console.warn(

            skipped,

            "ảnh bị bỏ qua."

        );

    }

}


/* ===========================================
   CROP ONE
=========================================== */

function cropSingle(index){

    if(

        index<0 ||

        index>=files.length

    ){

        return null;

    }

    const img=files[index];

    if(

        img.width<cropRect.x+cropRect.w ||

        img.height<cropRect.y+cropRect.h

    ){

        return null;

    }

    const canvas=document.createElement("canvas");

    canvas.width=cropRect.w;

    canvas.height=cropRect.h;

    const ctx=canvas.getContext("2d");

    ctx.drawImage(

        img,

        cropRect.x,

        cropRect.y,

        cropRect.w,

        cropRect.h,

        0,

        0,

        cropRect.w,

        cropRect.h

    );

    return canvas;

}


/* ===========================================
   AUTO CROP
=========================================== */

function autoCrop(){

    croppedImages=[];

    files.forEach((img,index)=>{

        const c=cropSingle(index);

        if(c){

            croppedImages.push(c);

        }

    });

    mergeImages();

}


/* ===========================================
   CHANGE CROP
=========================================== */

function updateCrop(

    x,

    y,

    w,

    h

){

    cropRect.x=x;

    cropRect.y=y;

    cropRect.w=w;

    cropRect.h=h;

    autoCrop();

}


/* ===========================================
   GET RECT
=========================================== */

function getCropRect(){

    return{

        x:cropRect.x,

        y:cropRect.y,

        width:cropRect.w,

        height:cropRect.h

    };

}


/* ===========================================
   EXPORT CROP
=========================================== */

window.cropAPI={

    cropAll,

    cropSingle,

    resetCrop,

    autoCrop,

    updateCrop,

    getCropRect

};