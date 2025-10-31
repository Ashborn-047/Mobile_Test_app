import React from "react";
import { motion, AnimatePresence } from "framer-motion";

interface NotificationProps {
  message: string;
  type: "success" | "warning" | "info";
  onDismiss: () => void;
  isVisible: boolean;
}

export const Notification: React.FC<NotificationProps> = ({
  message,
  type,
  onDismiss,
  isVisible,
}) => {
  let bgColor = "";
  let textColor = "";
  let borderColor = "";

  switch (type) {
    case "success":
      bgColor = "bg-green-100";
      textColor = "text-green-800";
      borderColor = "border-green-300";
      break;
    case "warning":
      bgColor = "bg-yellow-100";
      textColor = "text-yellow-800";
      borderColor = "border-yellow-300";
      break;
    case "info":
    default:
      bgColor = "bg-blue-100";
      textColor = "text-blue-800";
      borderColor = "border-blue-300";
      break;
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          transition={{ duration: 0.3 }}
          className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 p-4 rounded-lg shadow-lg flex items-center justify-between space-x-4 ${bgColor} ${borderColor} border`}
        >
          <p className={`text-sm font-medium ${textColor}`}>{message}</p>
          <button
            onClick={onDismiss}
            className={`text-lg font-bold ${textColor} opacity-70 hover:opacity-100`}
          >
            &times;
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
