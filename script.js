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

            const quality = parseFloat(document.getElementById('quality').value);
            const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
            const output = document.getElementById('output');
            output.innerHTML = `<img src="${compressedDataUrl}" alt="Compressed Image"/>`;

            const downloadButton = document.getElementById('download');
            downloadButton.style.display = 'block';
            downloadButton.href = compressedDataUrl;
            downloadButton.download = 'compressed.jpg';
        };
    };
});
