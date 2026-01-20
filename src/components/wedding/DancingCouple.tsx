import { motion } from "framer-motion";

export const DancingCouple = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="relative w-48 h-48 mx-auto"
    >
      <svg
        viewBox="0 0 200 200"
        className="w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Decorative hearts floating */}
        <motion.g
          animate={{ y: [-5, 5, -5] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          <path
            d="M30 40 C30 35 35 30 40 30 C45 30 50 35 50 40 C50 50 40 55 40 60 C40 55 30 50 30 40Z"
            fill="hsl(var(--terracotta))"
            opacity="0.3"
          />
        </motion.g>
        <motion.g
          animate={{ y: [5, -5, 5] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        >
          <path
            d="M160 50 C160 45 165 40 170 40 C175 40 180 45 180 50 C180 60 170 65 170 70 C170 65 160 60 160 50Z"
            fill="hsl(var(--terracotta))"
            opacity="0.25"
          />
        </motion.g>
        <motion.g
          animate={{ y: [-3, 3, -3] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        >
          <path
            d="M145 25 C145 22 148 19 151 19 C154 19 157 22 157 25 C157 30 151 33 151 36 C151 33 145 30 145 25Z"
            fill="hsl(var(--gold))"
            opacity="0.4"
          />
        </motion.g>

        {/* Dancing couple group with gentle sway */}
        <motion.g
          animate={{ rotate: [-2, 2, -2] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          style={{ transformOrigin: "100px 180px" }}
        >
          {/* Groom */}
          <g>
            {/* Groom body/suit */}
            <ellipse cx="85" cy="130" rx="18" ry="35" fill="hsl(var(--foreground))" opacity="0.85" />
            {/* Groom head */}
            <circle cx="85" cy="85" r="15" fill="hsl(var(--caramel))" opacity="0.8" />
            {/* Groom hair */}
            <ellipse cx="85" cy="75" rx="12" ry="6" fill="hsl(var(--foreground))" opacity="0.6" />
            {/* Groom arm reaching to bride */}
            <motion.path
              d="M100 110 Q120 100 115 120"
              stroke="hsl(var(--foreground))"
              strokeWidth="6"
              fill="none"
              strokeLinecap="round"
              animate={{ d: ["M100 110 Q120 100 115 120", "M100 112 Q122 102 117 122", "M100 110 Q120 100 115 120"] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
            {/* Groom other arm */}
            <path
              d="M70 115 Q55 125 60 140"
              stroke="hsl(var(--foreground))"
              strokeWidth="6"
              fill="none"
              strokeLinecap="round"
            />
            {/* Groom legs */}
            <path d="M80 160 L75 190" stroke="hsl(var(--foreground))" strokeWidth="5" strokeLinecap="round" />
            <path d="M90 160 L95 190" stroke="hsl(var(--foreground))" strokeWidth="5" strokeLinecap="round" />
          </g>

          {/* Bride */}
          <g>
            {/* Bride dress */}
            <path
              d="M115 110 Q115 125 100 180 L140 180 Q125 125 125 110 Z"
              fill="hsl(var(--parchment-light))"
              stroke="hsl(var(--gold))"
              strokeWidth="1"
              opacity="0.95"
            />
            {/* Dress details */}
            <path
              d="M108 130 Q120 145 132 130"
              stroke="hsl(var(--gold))"
              strokeWidth="0.5"
              fill="none"
              opacity="0.5"
            />
            <path
              d="M105 150 Q120 165 135 150"
              stroke="hsl(var(--gold))"
              strokeWidth="0.5"
              fill="none"
              opacity="0.5"
            />
            {/* Bride body/torso */}
            <ellipse cx="120" cy="105" rx="12" ry="18" fill="hsl(var(--parchment-light))" stroke="hsl(var(--gold))" strokeWidth="0.5" />
            {/* Bride head */}
            <circle cx="120" cy="80" r="14" fill="hsl(var(--caramel))" opacity="0.75" />
            {/* Bride hair */}
            <ellipse cx="120" cy="72" rx="13" ry="8" fill="hsl(var(--rust))" opacity="0.5" />
            {/* Bride veil */}
            <path
              d="M108 70 Q100 85 105 110"
              stroke="hsl(var(--parchment-light))"
              strokeWidth="8"
              fill="none"
              opacity="0.5"
              strokeLinecap="round"
            />
            {/* Bride arm to groom */}
            <motion.path
              d="M108 100 Q95 105 100 115"
              stroke="hsl(var(--caramel))"
              strokeWidth="5"
              fill="none"
              strokeLinecap="round"
              opacity="0.8"
              animate={{ d: ["M108 100 Q95 105 100 115", "M108 102 Q93 107 98 117", "M108 100 Q95 105 100 115"] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
            {/* Bride bouquet */}
            <circle cx="100" cy="120" r="8" fill="hsl(var(--terracotta))" opacity="0.7" />
            <circle cx="96" cy="117" r="4" fill="hsl(var(--rust))" opacity="0.6" />
            <circle cx="104" cy="118" r="3" fill="hsl(var(--gold))" opacity="0.5" />
            <circle cx="99" cy="124" r="3" fill="hsl(var(--caramel))" opacity="0.6" />
          </g>
        </motion.g>

        {/* Sparkles */}
        <motion.circle
          cx="50" cy="70"
          r="2"
          fill="hsl(var(--gold))"
          animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.circle
          cx="150" cy="90"
          r="2.5"
          fill="hsl(var(--gold))"
          animate={{ opacity: [1, 0.3, 1], scale: [1.2, 0.8, 1.2] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        />
        <motion.circle
          cx="170" cy="130"
          r="1.5"
          fill="hsl(var(--terracotta))"
          animate={{ opacity: [0.5, 1, 0.5], scale: [1, 1.3, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
        />
        <motion.circle
          cx="35" cy="120"
          r="2"
          fill="hsl(var(--gold))"
          animate={{ opacity: [0.8, 0.3, 0.8], scale: [1.1, 0.9, 1.1] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut", delay: 0.7 }}
        />
      </svg>
    </motion.div>
  );
};
