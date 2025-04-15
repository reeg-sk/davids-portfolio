import React from "react";
import { motion, useScroll, useTransform } from "framer-motion";

interface ProjectItemProps {
    title: string;
    videoSrc: string;
    videoAlt?: string;
    description: string;
}

const ProjectItem: React.FC<ProjectItemProps> = ({
    title,
    videoSrc,
    videoAlt,
    description,
}) => {
    const ref = React.useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
    // Parallax effect for the video
    const videoY = useTransform(scrollYProgress, [0, 1], [0, 60]);

    return (
        <div ref={ref} className="w-full relative">
            <motion.video
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                muted
                autoPlay
                playsInline
                disablePictureInPicture
                loop
                src={videoSrc}
                style={{ y: videoY }}
                className="w-full h-full max-h-screen object-scale-down block"
                aria-label={videoAlt || title}
            />
        </div>
    );
};

export default ProjectItem;
