/* ===========================================
   EXPORT PNG
=========================================== */

function exportPNG(){

    if(!mergedCanvas){

        alert("Chưa có ảnh để xuất. Hãy ghép ảnh trước.");

        return;

    }

    mergedCanvas.toBlob(

        blob=>{

            if(!blob){

                setStatus("Lỗi khi xuất ảnh");

                return;

            }

            const url = URL.createObjectURL(blob);

            const a = document.createElement("a");

            a.href = url;

            a.download = "merged-" + Date.now() + ".png";

            document.body.appendChild(a);

            a.click();

            document.body.removeChild(a);

            URL.revokeObjectURL(url);

            setStatus("Đã lưu file PNG");

        },

        "image/png"

    );

}


/* ===========================================
   EXPORT
=========================================== */

window.exportAPI = {

    exportPNG

};
