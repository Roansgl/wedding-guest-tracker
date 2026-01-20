import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Ornament } from "@/components/wedding/Ornament";
import { DancingCouple } from "@/components/wedding/DancingCouple";

const Dankie = () => {
  const [showCouple, setShowCouple] = useState(false);

  useEffect(() => {
    // Show dancing couple after 1 second
    const timer = setTimeout(() => setShowCouple(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen gradient-hero texture-paper flex items-center justify-center">
      <div className="px-6 py-12 text-center space-y-8 max-w-lg mx-auto">
        {/* Main "Baie Dankie" text with animation */}
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="space-y-4"
        >
          <h1 className="font-display text-6xl md:text-7xl text-foreground italic tracking-wide">
            Baie Dankie
          </h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="text-muted-foreground font-body text-xl"
          >
            Ons is so opgewonde om saam met jou te vier!
          </motion.p>
        </motion.div>

        {/* Ornament */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ delay: 0.5, duration: 0.6, ease: "easeOut" }}
        >
          <Ornament variant="line" />
        </motion.div>

        {/* Dancing Couple Animation - appears after 1 second */}
        <AnimatePresence>
          {showCouple && (
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="pt-4"
            >
              <DancingCouple />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Dankie;
