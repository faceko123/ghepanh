/* ===========================================
   APP
=========================================== */

window.addEventListener(

    "load",

    ()=>{

        setStatus(
            "Sẵn sàng"
        );

        updateImageCount();

    }

);


/* ===========================================
   LOAD IMAGE
=========================================== */

imageInput.addEventListener(

    "change",

    async e=>{

        const list =
            [...e.target.files];

        for(

            const file

            of

            list

        ){

            const img =
                new Image();

            img.src =
                URL.createObjectURL(
                    file
                );

            await img.decode();

            files.push(img);

        }

        updateImageCount();

        if(
            typeof renderSidebar
            ===
            "function"
        ){

            renderSidebar();

        }

        if(
            typeof mergeImages
            ===
            "function"
        ){

            mergeImages();

        }

        setStatus(

            "Đã thêm "

            +

            list.length

            +

            " ảnh"

        );

    }

);


/* ===========================================
   BUTTON
=========================================== */

mergeBtn.addEventListener(

    "click",

    ()=>{

        if(

            typeof mergeImages

            ===

            "function"

        ){

            mergeImages();

        }

    }

);

cropBtn.addEventListener(

    "click",

    ()=>{

        if(

            typeof cropAll

            ===

            "function"

        ){

            cropAll();

        }

    }

);

downloadBtn.addEventListener(

    "click",

    ()=>{

        if(

            typeof exportPNG

            ===

            "function"

        ){

            exportPNG();

        }

    }

);


/* ===========================================
   CHỌN KHUNG LƯỚI (SỐ CỘT)
=========================================== */

colsInput.addEventListener(

    "change",

    ()=>{

        const value = parseInt(colsInput.value, 10);

        if(!value || value<1){

            manualCols = null;

            colsInput.value = "";

        }else{

            manualCols = value;

        }

        if(

            typeof mergeImages

            ===

            "function"

        ){

            mergeImages();

        }

        if(manualCols){

            setStatus("Đã đặt " + manualCols + " cột");

        }

    }

);

autoGridBtn.addEventListener(

    "click",

    ()=>{

        manualCols = null;

        colsInput.value = "";

        if(

            typeof mergeImages

            ===

            "function"

        ){

            mergeImages();

        }

        setStatus("Đã chuyển sang tự động sắp xếp khung");

    }

);


/* ===========================================
   SHORTCUT
=========================================== */

document.addEventListener(

    "keydown",

    e=>{

        if(

            e.ctrlKey

            &&

            e.key==="s"

        ){

            e.preventDefault();

            if(

                typeof exportPNG

                ===

                "function"

            ){

                exportPNG();

            }

        }

    }

);