import { useRef, useLayoutEffect, useState } from "react";
import {
    motion,
    useScroll,
    useSpring,
    useTransform,
    useMotionValue,
    useVelocity,
    useAnimationFrame
} from "framer-motion";
import { wrap } from "@motionone/utils";

interface ParallaxProps {
    children: string;
    baseVelocity: number;
}

export default function ParallaxText({ children, baseVelocity = 100 }: ParallaxProps) {
    const baseX = useMotionValue(0);
    const { scrollY } = useScroll();
    const scrollVelocity = useVelocity(scrollY);
    const smoothVelocity = useSpring(scrollVelocity, {
        damping: 50,
        stiffness: 400
    });
    const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 5], {
        clamp: false
    });

    const containerRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLSpanElement>(null);
    const [repeatCount, setRepeatCount] = useState(4);

    useLayoutEffect(() => {
        if (containerRef.current && textRef.current) {
            const containerWidth = containerRef.current.offsetWidth;
            const textWidth = textRef.current.offsetWidth;
            if (textWidth === 0) return;
            // Add 2 extra for overflow/looping
            const count = Math.ceil(containerWidth / textWidth) + 2;
            setRepeatCount(count);
        }
    }, [children]);

    // Adjust wrap range based on repeatCount
    const x = useTransform(baseX, (v) => {
        const range = -100 / repeatCount;
        return `${wrap(range, 0, v)}%`;
    });

    const directionFactor = useRef<number>(1);
    useAnimationFrame((_, delta) => {
        let moveBy = directionFactor.current * baseVelocity * (delta / 1000);

        if (velocityFactor.get() < 0) {
            directionFactor.current = -1;
        } else if (velocityFactor.get() > 0) {
            directionFactor.current = 1;
        }

        moveBy += directionFactor.current * moveBy * velocityFactor.get();

        baseX.set(baseX.get() + moveBy);
    });

    return (
        <div className="parallax" ref={containerRef} style={{ overflow: "hidden" }}>
            <motion.div className="scroller" style={{ x, display: "flex", whiteSpace: "nowrap" }}>
                {Array.from({ length: repeatCount }).map((_, i) => (
                    <span
                        key={i}
                        ref={i === 0 ? textRef : undefined}
                        style={{ display: "inline-block" }}
                    >
                        {children}
                    </span>
                ))}
            </motion.div>
        </div>
    );
}