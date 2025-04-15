import { useRef } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";

type AnimatedTextProps = {
  text: string;
  el?: React.ElementType;
  className?: string;
};

const defaultAnimation = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

export const AnimatedText: React.FC<AnimatedTextProps> = ({
  text,
  el: Wrapper = "p",
  className,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  return (
    <Wrapper className={className}>
      <span className="sr-only">{text}</span>
      <motion.span
        ref={ref}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        transition={{ staggerChildren: 0.02 }}
        aria-hidden
      >
        {text.split("").map((char, index) => (
          <motion.span variants={defaultAnimation} key={index}>
            {char}
          </motion.span>
        ))}
      </motion.span>
    </Wrapper>
  );
};
