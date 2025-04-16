import React, { useRef, useEffect, useState } from "react";

type ImageGalleryProps = {
  images: { src: string; label: string }[];
};

export const ImageGallery: React.FC<ImageGalleryProps> = ({ images }) => {
  const groupContainerRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const [fullscreenIdx, setFullscreenIdx] = useState<number | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    let motionAnimate: any, motionScroll: any;
    let cleanup: (() => void)[] = [];

    import("motion").then(({ animate, scroll }) => {
      motionAnimate = animate;
      motionScroll = scroll;

      const group = groupContainerRef.current?.querySelector(".img-group");
      if (group) {
        const animation = motionScroll(
          motionAnimate(group, {
            transform: ["none", `translateX(-${(images.length - 1) * 23}vw)`],
          }),
          { target: groupContainerRef.current }
        );
        cleanup.push(() => animation && animation.cancel && animation.cancel());
      }

      if (progressRef.current) {
        const progressAnim = motionScroll(
          motionAnimate(progressRef.current, { scaleX: [0, 1] }),
          { target: groupContainerRef.current }
        );
        cleanup.push(
          () => progressAnim && progressAnim.cancel && progressAnim.cancel()
        );
      }
    });

    return () => {
      cleanup.forEach((fn) => fn());
    };
  }, [images.length]);

  // Handle Escape key to close fullscreen
  useEffect(() => {
    if (fullscreenIdx === null) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setFullscreenIdx(null);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [fullscreenIdx]);

  return (
    <>
      <article id="gallery" className="w-[98vw] -mt-64">
        <section
          className="img-group-container h-[300vh] relative"
          ref={groupContainerRef}
        >
          <div className="sticky top-0 overflow-hidden">
            <ul className="img-group flex">
              {images.map((img, idx) => {
                return (
                  <li
                    className="img-container flex w-full lg:w-1/4 h-screen flex-none items-center justify-center flex-col"
                    key={img.src}
                  >
                    <img
                      src={img.src}
                      alt={img.label}
                      width={300}
                      className="h-auto"
                      loading="lazy"
                      decoding="async"
                      style={{ cursor: "pointer" }}
                      onClick={() => setFullscreenIdx(idx)}
                    />
                  </li>
                );
              })}
            </ul>
          </div>
        </section>
      </article>
      <div
        className="progress fixed left-0 right-0 h-[5px] bg-[#9911ff] bottom-[50px] scale-x-0"
        ref={progressRef}
        style={{ transformOrigin: "left" }}
      ></div>
      {/* Fullscreen overlay */}
      {fullscreenIdx !== null && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50"
          onClick={() => setFullscreenIdx(null)}
        >
          <img
            src={images[fullscreenIdx].src.replace("/optimized/", "/assets/")}
            alt={images[fullscreenIdx].label}
            className="max-w-full max-h-full"
            style={{ boxShadow: "0 0 40px #000" }}
            onClick={e => e.stopPropagation()}
          />
          <button
            onClick={() => setFullscreenIdx(null)}
            className="absolute top-4 right-4 text-white text-3xl bg-black bg-opacity-50 rounded px-3 py-1"
            aria-label="Close fullscreen"
            style={{ cursor: "pointer" }}
          >
            &times;
          </button>
        </div>
      )}
    </>
  );
};
