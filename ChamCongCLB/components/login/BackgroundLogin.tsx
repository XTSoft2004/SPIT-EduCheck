import { Orbitron } from "next/font/google";

const orbitron = Orbitron({ subsets: ["latin"], weight: ["400", "700"] });

export default function BackgroundLogin() {
    const duration = "20s";
    const images = Array.from({ length: 10 }, (_, i) => `/slides/img-${i + 1}.webp`);

    return (
        <div className="relative w-full h-screen flex items-center justify-center overflow-hidden bg-black">
            {/* Text Layer */}
            <div className={`absolute flex flex-col items-center text-white font-bold z-10 drop-shadow-[0_0_20px_rgba(255,255,255,0.9)] animate-pulse text-center ${orbitron.className}`} >
                <p className="text-5xl md:text-7xl">SPIT TEAM</p>
                <p className="text-3xl md:text-5xl mt-2 opacity-90">SPIT here to fix</p>
            </div>

            {/* Marquee Images */}
            <div className="relative w-full h-[100vh] flex flex-col items-center justify-between">
                {[...Array(3)].map((_, i) => (
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
