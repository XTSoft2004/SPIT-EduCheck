export default function BackgroundLogin() {
    const duration = "20s";
    const images = Array.from({ length: 10 }, (_, i) => `/slides/img-${i + 1}.webp`);

    return (
        <div className="relative w-full h-screen flex items-center justify-center overflow-hidden bg-black">
            <div className="relative w-full h-[65vh] flex flex-col items-center justify-between">
                {[...Array(2)].map((_, i) => (
                    <div
                        key={i}
                        className={`w-full flex gap-2 animate-marquee`}
                        style={{
                            animationDuration: duration,
                            animationDirection: i % 2 === 0 ? "normal" : "reverse",
                        }}
                    >
                        {images.map((src, index) => (
                            <img
                                key={index}
                                src={src}
                                alt={`Slide ${index + 1}`}
                                loading="lazy"
                                className="w-[300px] h-[200px] object-cover rounded-lg shadow-lg"
                            />
                        ))}
                    </div>
                ))}
            </div>
            {/* Fade Effect */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black"></div>
        </div>
    );
}
