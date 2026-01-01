import { useState } from "react";
import { generateSmartInsights } from "../lib/smartCoach";
import Modal from "./Modal";
import { toast } from "sonner";
import { FaRobot, FaMagic } from "react-icons/fa";
import Spinner from "./Spinner";

interface AiCoachProps {
  userName: string;
  habits: any[];
}

const AiCoach = ({ userName, habits }: AiCoachProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [insight, setInsight] = useState<string | null>(null);

  const handleGetInsights = async () => {
    setLoading(true);
    setInsight(null);
    setIsOpen(true);
    try {
      const result = await generateSmartInsights(userName, habits);
      setInsight(result);
    } catch (error) {
      console.error(error);
      toast.error("failed to generate insights");
      setIsOpen(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={handleGetInsights}
        className="fixed bottom-6 right-6 bg-primary text-text p-4 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 z-50 flex items-center gap-2 group"
        title="Get AI Insights"
      >
        <FaRobot className="text-xl" />
        <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 ease-in-out whitespace-nowrap font-medium">
          get smart insights
        </span>
      </button>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <div className="p-2">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-yellow-100 p-2 rounded-full">
              <FaMagic className="text-yellow-600 text-xl" />
            </div>
            <h2 className="text-xl font-bold text-text">
              smart habit coach
            </h2>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-10 gap-4">
              <Spinner />
              <p className="text-gray-500 animate-pulse">
                analyzing your progress...
              </p>
            </div>
          ) : (
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-100 shadow-inner">
              <p className="whitespace-pre-wrap leading-relaxed text-gray-700">
                {insight}
              </p>
            </div>
          )}
          
          <div className="mt-6 flex justify-end">
            <button
              onClick={() => setIsOpen(false)}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors font-medium text-sm"
            >
              close
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default AiCoach;
