import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'

function splitText(
    text: string,
    scrollYProgress: any
) {
    const words = text.split(' ');
    const total = words.length + words.length / 2;
    return words.map((word, i) => {
        // Spread the animation across the whole scroll
        const start = i / total;
        const end = (i + 1) / total;
        const opacity = useTransform(scrollYProgress, [start, end], [0.2, 1]);

        return (
            <motion.span
                key={i}
                style={{
                    display: 'inline-block',
                    opacity,
                    whiteSpace: 'pre',
                }}
            >
                {word + (i !== total - 1 ? '\u00A0' : '')}
            </motion.span>
        )
    })
}

const RevealText = ({
    text,
}: {
    text: string
}) => {
    const ref = useRef<HTMLDivElement>(null)
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"],
    })

    return (
        <motion.div ref={ref} className="overflow-hidden">
            {splitText(text, scrollYProgress)}
        </motion.div>
    )
}

export default RevealText