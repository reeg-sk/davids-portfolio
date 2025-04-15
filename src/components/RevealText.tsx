import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'

function splitText(
    text: string,
    scrollYProgress: any
) {
    return text.split('').map((char, i) => {
        const start = i * 0.01
        const end = start + 0.1
        const opacity = useTransform(scrollYProgress, [start, end], [0.2, 1])

        return (
            <motion.span
                key={i}
                style={{
                    display: 'inline-block',
                    opacity,
                }}
            >
                {char === ' ' ? '\u00A0' : char}
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