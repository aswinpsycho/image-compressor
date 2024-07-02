document.getElementById('upload').addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (e) => {
        const img = new Image();
        img.src = e.target.result;
        img.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            const MAX_WIDTH = 800;
            const MAX_HEIGHT = 600;
            let width = img.width;
            let height = img.height;

            if (width > height) {
                if (width > MAX_WIDTH) {
                    height *= MAX_WIDTH / width;
                    width = MAX_WIDTH;
                }
            } else {
                if (height > MAX_HEIGHT) {
                    width *= MAX_HEIGHT / height;
                    height = MAX_HEIGHT;
                }
            }

            canvas.width = width;
            canvas.height = height;

            ctx.drawImage(img, 0, 0, width, height);

            let desiredSize = parseFloat(document.getElementById('size').value);
            const sizeUnit = document.getElementById('size-unit').value;

            if (sizeUnit === 'MB') {
                desiredSize *= 1024; // Convert MB to KB
            }

            const output = document.getElementById('output');
            const downloadButton = document.getElementById('download');

            const compressImage = (quality) => {
                return new Promise((resolve) => {
                    const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
                    const byteString = atob(compressedDataUrl.split(',')[1]);
                    const buffer = new ArrayBuffer(byteString.length);
                    const view = new Uint8Array(buffer);

                    for (let i = 0; i < byteString.length; i++) {
                        view[i] = byteString.charCodeAt(i);
                    }

                    const blob = new Blob([buffer], { type: 'image/jpeg' });
                    resolve(blob);
                });
            };

            const checkSizeAndCompress = async () => {
                let quality = 0.9;
                let step = 0.1;
                let compressedBlob = await compressImage(quality);

                while (compressedBlob.size / 1024 > desiredSize && quality > 0) {
                    quality -= step;
                    compressedBlob = await compressImage(quality);
                }

                const compressedDataUrl = URL.createObjectURL(compressedBlob);
                output.innerHTML = `<img src="${compressedDataUrl}" alt="Compressed Image"/>`;

                downloadButton.style.display = 'block';
                downloadButton.href = compressedDataUrl;
                downloadButton.download = 'compressed.jpg';
            };

            checkSizeAndCompress();
        };
    };
});

