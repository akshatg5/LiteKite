import React, { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface CardProps {
  title: string;
  src: string;
}

const Card = React.memo(({
  card,
  index,
  hovered,
  setHovered,
}: {
  card: CardProps;
  index: number;
  hovered: number | null;
  setHovered: React.Dispatch<React.SetStateAction<number | null>>;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: index * 0.1 }}
    onMouseEnter={() => setHovered(index)}
    onMouseLeave={() => setHovered(null)}
    className={cn(
      "rounded-lg relative bg-gray-100 dark:bg-neutral-900 overflow-hidden h-60 md:h-80 w-full transition-all duration-300 ease-out cursor-pointer",
      hovered !== null && hovered !== index && "blur-sm scale-[0.97] opacity-50"
    )}
  >
    <img
      src={card.src}
      alt={card.title}
      className="object-cover absolute inset-0 w-full h-full transition-transform duration-300 ease-out transform hover:scale-110"
    />
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: hovered === index ? 1 : 0, y: hovered === index ? 0 : 20 }}
      transition={{ duration: 0.3 }}
      className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end py-6 px-4"
    >
      <h3 className="text-xl md:text-2xl font-bold text-white">{card.title}</h3>
    </motion.div>
  </motion.div>
));

Card.displayName = "Card";

export function FocusCards({ cards }: { cards: CardProps[] }) {
  const [hovered, setHovered] = useState<number | null>(null);
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto w-full">
      {cards.map((card, index) => (
        <Card
          key={card.title}
          card={card}
          index={index}
          hovered={hovered}
          setHovered={setHovered}
        />
      ))}
    </div>
  );
}