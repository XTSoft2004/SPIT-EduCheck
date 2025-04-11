export const fileToBase64 = async (file: File): Promise<string> => {
    // Chỉ import khi ở client
    const heic2any = (await import('heic2any')).default;

    let finalFile = file;

    // 1. Nếu là HEIC thì convert sang JPEG
    if (file.name.toLowerCase().endsWith('.heic')) {
        const converted = await heic2any({
            blob: file,
            toType: 'image/jpeg',
            quality: 0.8,
        });

        finalFile = new File(
            [Array.isArray(converted) ? converted[0] : converted],
            file.name.replace(/\.heic$/i, '.jpg'),
            { type: 'image/jpeg' }
        );
    }

    // 2. Convert to base64
    return await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(finalFile);
    });
};