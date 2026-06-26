/* ===========================================
   DRAG & DROP FILE NGOÀI VÀO APP
=========================================== */

const dropZones = [
    sidebar,
    document.querySelector(".preview-wrapper")
].filter(Boolean);


/* ===========================================
   NGĂN HÀNH VI MẶC ĐỊNH CỦA BROWSER
=========================================== */

["dragenter", "dragover", "dragleave", "drop"].forEach(

    eventName=>{

        window.addEventListener(

            eventName,

            e=>{

                e.preventDefault();

            }

        );

    }

);


/* ===========================================
   GẮN SỰ KIỆN CHO TỪNG VÙNG THẢ
=========================================== */

dropZones.forEach(zone=>{

    zone.addEventListener(

        "dragover",

        e=>{

            e.preventDefault();

            zone.classList.add("drag-over");

        }

    );

    zone.addEventListener(

        "dragleave",

        e=>{

            e.preventDefault();

            zone.classList.remove("drag-over");

        }

    );

    zone.addEventListener(

        "drop",

        async e=>{

            e.preventDefault();

            zone.classList.remove("drag-over");

            if(typeof isSortingInternally!=="undefined" && isSortingInternally){

                return;

            }

            const dropped = [...e.dataTransfer.files].filter(

                f=>f.type.startsWith("image/")

            );

            if(dropped.length===0){

                setStatus("Không có ảnh hợp lệ trong file vừa thả");

                return;

            }

            if(typeof addImages==="function"){

                await addImages(dropped);

                setStatus("Đã thêm " + dropped.length + " ảnh (kéo thả)");

            }

        }

    );

});


/* ===========================================
   EXPORT
=========================================== */

window.dragAPI = {

    dropZones

};
