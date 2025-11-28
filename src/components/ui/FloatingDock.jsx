import { cn } from "../../lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { useRef, useState } from "react";

export const FloatingDock = ({ items, desktopClassName, mobileClassName }) => {
  return (
    <>
      <FloatingDockDesktop items={items} className={desktopClassName} />
      <FloatingDockMobile items={items} className={mobileClassName} />
    </>
  );
};

const FloatingDockMobile = ({ items, className }) => {
  return (
    <div className={cn("relative block md:hidden", className)}>
      <div className="mx-auto flex h-16 items-center justify-around gap-4 rounded-2xl bg-gray-800/80 backdrop-blur-xl border border-gray-700/50 px-4">
        {items.map((item) => (
          <item.href key={item.title} className="relative flex flex-col items-center justify-center group">
            <div className="relative p-2.5 rounded-xl transition-all duration-300">
              <item.icon className="h-5 w-5 text-gray-400 group-hover:text-purple-400 transition-colors" />
            </div>
            <span className="text-xs text-gray-500 group-hover:text-gray-400 transition-colors">
              {item.title}
            </span>
          </item.href>
        ))}
      </div>
    </div>
  );
};

const FloatingDockDesktop = ({ items, className }) => {
  let mouseX = useMotionValue(Infinity);
  return (
    <motion.div
      onMouseMove={(e) => mouseX.set(e.pageX)}
      onMouseLeave={() => mouseX.set(Infinity)}
      className={cn(
        "mx-auto hidden md:flex h-16 items-center justify-center gap-4 rounded-2xl bg-neutral-900/90 backdrop-blur-xl border border-neutral-800/50 px-4 shadow-xl",
        className
      )}
    >
      {items.map((item) => (
        <IconContainer mouseX={mouseX} key={item.title} {...item} />
      ))}
    </motion.div>
  );
};

function IconContainer({ mouseX, title, icon: Icon, href: LinkComponent }) {
  let ref = useRef(null);

  let distance = useTransform(mouseX, (val) => {
    let bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };

    return val - bounds.x - bounds.width / 2;
  });

  let widthTransform = useTransform(distance, [-150, 0, 150], [40, 80, 40]);
  let heightTransform = useTransform(distance, [-150, 0, 150], [40, 80, 40]);

  let widthTransformIcon = useTransform(distance, [-150, 0, 150], [20, 40, 20]);
  let heightTransformIcon = useTransform(
    distance,
    [-150, 0, 150],
    [20, 40, 20]
  );

  let yTransform = useTransform(distance, [-150, 0, 150], [0, -20, 0]);

  let width = useSpring(widthTransform, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });
  let height = useSpring(heightTransform, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });

  let widthIcon = useSpring(widthTransformIcon, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });
  let heightIcon = useSpring(heightTransformIcon, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });

  let y = useSpring(yTransform, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });

  const [hovered, setHovered] = useState(false);

  return (
    <LinkComponent>
      <motion.div
        ref={ref}
        style={{ width, height, y }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="relative flex items-center justify-center rounded-full bg-neutral-800/90 border border-neutral-700/50 backdrop-blur-sm hover:bg-neutral-700/90 transition-colors"
      >
        <AnimatePresence>
          {hovered && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 2 }}
              className="absolute -top-10 left-1/2 -translate-x-1/2 whitespace-pre rounded-md bg-neutral-900 border border-neutral-700 px-3 py-1 text-xs text-neutral-100 text-center shadow-xl"
            >
              {title}
            </motion.div>
          )}
        </AnimatePresence>
        <motion.div
          style={{ width: widthIcon, height: heightIcon }}
          className="flex items-center justify-center"
        >
          <Icon className="text-neutral-400" />
        </motion.div>
      </motion.div>
    </LinkComponent>
  );
}

// Import motion utilities from framer-motion
import {
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";

export default FloatingDock;