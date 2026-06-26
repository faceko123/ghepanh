/* ===========================================
   SIDEBAR
=========================================== */

let dragIndex = -1;

let isSortingInternally = false;

/* ===========================================
   Render Sidebar
=========================================== */

function renderSidebar() {

    sidebar.innerHTML = "";

    files.forEach((img, index) => {

        const item = document.createElement("div");
        item.className = "thumb-item";
        item.draggable = true;

        // ======================
        // Thumbnail
        // ======================

        const thumb = document.createElement("img");

        thumb.src = img.src;

        thumb.className = "thumb";

        thumb.draggable = false;

        // ======================
        // Delete
        // ======================

        const remove = document.createElement("button");

        remove.className = "remove-btn";

        remove.innerHTML = "✖";

        remove.title = "Xóa";

        remove.onclick = e => {

            e.stopPropagation();

            files.splice(index, 1);

            updateImageCount();

            renderSidebar();

            if (typeof mergeImages === "function") {

                mergeImages();

            }

            setStatus("Đã xóa ảnh");

        };

        // ======================
        // Select
        // ======================

        item.onclick = () => {

            document.querySelectorAll(".thumb-item")
                .forEach(el => {

                    el.classList.remove("selected");

                });

            item.classList.add("selected");

            selectedIndex = index;

        };

        // ======================
        // Drag Start
        // ======================

        item.addEventListener(

            "dragstart",

            () => {

                dragIndex = index;

                isSortingInternally = true;

                item.classList.add("dragging");

                document
                    .querySelectorAll(".thumb-item")
                    .forEach(i => {

                        if (i !== item) {

                            i.classList.add("dimmed");

                        }

                    });

            }

        );

        // ======================
        // Drag End
        // ======================

        item.addEventListener(

            "dragend",

            () => {

                item.classList.remove("dragging");

                isSortingInternally = false;

                document
                    .querySelectorAll(".thumb-item")
                    .forEach(i => {

                        i.classList.remove("drag-over");

                        i.classList.remove("dimmed");

                    });

            }

        );

        // ======================
        // Drag Over
        // ======================

        item.addEventListener(

            "dragover",

            e => {

                e.preventDefault();

                e.stopPropagation();

                item.classList.add("drag-over");

            }

        );

        item.addEventListener(

            "dragleave",

            () => {

                item.classList.remove("drag-over");

            }

        );

        // ======================
        // Drop
        // ======================

        item.addEventListener(

            "drop",

            e => {

                e.preventDefault();

                e.stopPropagation();

                item.classList.remove("drag-over");

                if (dragIndex === index)
                    return;

                const img = files.splice(
                    dragIndex,
                    1
                )[0];

                files.splice(
                    index,
                    0,
                    img
                );

                renderSidebar();

                if (
                    typeof mergeImages === "function"
                ) {

                    mergeImages();

                }

                setStatus(
                    "Đã đổi vị trí ảnh"
                );

            }

        );

        item.appendChild(thumb);

        item.appendChild(remove);

        sidebar.appendChild(item);

    });

}

/* ===========================================
   Add Image
=========================================== */

async function addImages(fileList) {

    for (const file of fileList) {

        const img = new Image();

        img.src = URL.createObjectURL(file);

        await img.decode();

        files.push(img);

    }

    updateImageCount();

    renderSidebar();

    if (typeof mergeImages === "function") {

        mergeImages();

    }

}

/* ===========================================
   Clear
=========================================== */

function clearImages() {

    files.length = 0;

    croppedImages.length = 0;

    previewImages.length = 0;

    mergedCanvas = null;

    sidebar.innerHTML = "";

    clearPreview();

    updateImageCount();

    setStatus("Đã xóa toàn bộ ảnh");

}

/* ===========================================
   Move
=========================================== */

function moveImage(from, to) {

    if (
        from < 0 ||
        to < 0 ||
        from >= files.length ||
        to >= files.length
    ) {

        return;

    }

    const img = files.splice(
        from,
        1
    )[0];

    files.splice(
        to,
        0,
        img
    );

    renderSidebar();

    if (
        typeof mergeImages === "function"
    ) {

        mergeImages();

    }

}

/* ===========================================
   Keyboard
=========================================== */

document.addEventListener(

    "keydown",

    e => {

        if (
            selectedIndex === -1
        ) return;

        // Delete

        if (e.key === "Delete") {

            files.splice(
                selectedIndex,
                1
            );

            selectedIndex = -1;

            renderSidebar();

            mergeImages();

            updateImageCount();

        }

        // ↑

        if (
            e.ctrlKey &&
            e.key === "ArrowUp"
        ) {

            if (selectedIndex > 0) {

                moveImage(
                    selectedIndex,
                    selectedIndex - 1
                );

                selectedIndex--;

            }

        }

        // ↓

        if (
            e.ctrlKey &&
            e.key === "ArrowDown"
        ) {

            if (
                selectedIndex <
                files.length - 1
            ) {

                moveImage(
                    selectedIndex,
                    selectedIndex + 1
                );

                selectedIndex++;

            }

        }

    }

);