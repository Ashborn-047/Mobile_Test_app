import { useEffect, useState } from "react";
import { useNavigate, NavigateFunction } from "react-router-dom";
import { motion } from "framer-motion";
import { Card } from "../../components/Card";
import { Button } from "../../components/Button";
import { storage } from "../../utils/storage";
import { WelcomeModal } from "../../components/WelcomeModal";
import { Notification } from "../../components/common/Notification"; // Import Notification component
import { PersonalityProfileV2, Career } from "../Personality/types"; // Import Career type
import { gradients } from "../../theme"; // Import gradients from theme.ts
import { ProfileCard } from "./components/ProfileCard"; // Import the new ProfileCard
import { api } from "../../utils/api"; // Import the API utility
import { Expense } from "../../utils/types"; // Import Expense type
import { itemVariants } from "../../utils/motion"; // Import itemVariants from motion utils

interface DailySync {
  hasProfile: boolean;
  mood: string;
  spend: number;
  progress: number;
}

// Placeholder components for the new Bento grid cards
const DailySyncCard = ({ dailySync }: { dailySync: DailySync }) => (
  <Card className={`${gradients.dailySyncCard} col-span-1 sm:col-span-1 md:col-span-6 lg:col-span-3 h-48`}>
    <h3 className="text-xl font-semibold text-white">Daily Sync</h3>
    <p className="text-white/80">Mood: {dailySync?.mood || "Neutral"}</p>
    <p className="text-white/80">
      Spend: ${dailySync?.spend?.toFixed(2) || "0.00"}
    </p>
    <p className="text-white/80">Progress: {dailySync?.progress || 0}%</p>
  </Card>
);

const QuickTipCard = () => (
  <Card className={`${gradients.quickTipCard} col-span-1 sm:col-span-1 md:col-span-6 lg:col-span-3 h-48`}>
    <h3 className="text-xl font-semibold text-dark-teal">💡 Quick Tip</h3>
    <p className="text-dark-teal/80">"Embrace change for growth!"</p>
  </Card>
);

const PersonalityDisplayCard = ({
  profile,
  navigate,
}: {
  profile: PersonalityProfileV2 | null;
  navigate: NavigateFunction;
}) => (
  <Card
    className={`${gradients.personalityCard} col-span-1 md:col-span-7 h-64 flex flex-col justify-between`}
  >
    <div>
      <h3 className="text-xl font-semibold text-white">Your Personality</h3>
      <p className="text-white/80">
        {profile?.summary.substring(0, 50) || "Complete quiz for insights"}
      </p>
    </div>
    <div className="flex flex-wrap gap-2 mt-2">
      {profile?.traits.map((t) => (
        <span
          key={t.trait}
          className="px-3 py-1 bg-white/20 text-white rounded-full text-xs"
        >
          {t.trait}
        </span>
      ))}
    </div>
    <Button
      onClick={() => navigate("/personality")}
      variant="secondary"
      className="mt-4 w-full"
    >
      View Report
    </Button>
  </Card>
);

const CareerMatchCard = ({
  careers,
  navigate,
}: {
  careers: Career[];
  navigate: NavigateFunction;
}) => (
  <Card
    className={`${gradients.careerCard} col-span-1 md:col-span-5 h-64 flex flex-col justify-between`}
  >
    <div>
      <h3 className="text-xl font-semibold text-white">Career Match</h3>
      {careers.length > 0 ? (
        <p className="text-white/80">Top: {careers[0].title}</p>
      ) : (
        <p className="text-white/80">No recommendations yet</p>
      )}
    </div>
    <Button
      onClick={() => navigate("/career")}
      variant="secondary"
      className="mt-4 w-full"
    >
      Continue →
    </Button>
  </Card>
);

interface StatsModalProps {
  open: boolean;
  onClose: () => void;
  totalSpend: number;
  topCategory: string;
  numCategories: number;
  latestExpense: string;
  savingsTip: string;
}

const StatsModal = ({
  open,
  onClose,
  totalSpend,
  topCategory,
  numCategories,
  latestExpense,
  savingsTip,
}: StatsModalProps) => {
  if (!open) return null;
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-teal-dark/70 backdrop-blur-sm z-50 flex items-center justify-center p-6"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="bg-gradient-to-b from-teal-light to-dark-teal rounded-2xl border border-turquoise/30 p-8 shadow-[0_0_40px_rgba(9,218,198,0.12)] text-white w-full max-w-md"
      >
        <h2 className="font-bold text-2xl text-turquoise mb-4 text-center">
          📊 Your Financial Snapshot
        </h2>
        <div className="space-y-3 text-lg">
          <p>
            Total Spent:{" "}
            <span className="font-semibold text-turquoise">
              ${totalSpend.toFixed(2)}
            </span>
          </p>
          <p>
            Top Category:{" "}
            <span className="font-semibold text-turquoise">
              {topCategory || "N/A"}
            </span>
          </p>
          <p>
            Categories Tracked:{" "}
            <span className="font-semibold text-turquoise">
              {numCategories}
            </span>
          </p>
          <p>
            Latest Expense:{" "}
            <span className="font-semibold text-turquoise">
              {latestExpense || "N/A"}
            </span>
          </p>
          <p className="mt-4 text-sm italic text-turquoise/80">
            💡 {savingsTip}
          </p>
        </div>
        <Button onClick={onClose} className="w-full mt-6">
          Close
        </Button>
      </motion.div>
    </motion.div>
  );
};

const QuickActionButtons = ({
  navigate,
  onShowStats,
}: {
  navigate: NavigateFunction;
  onShowStats: () => void;
}) => (
  <motion.div
    variants={itemVariants}
    className="col-span-1 sm:col-span-2 md:col-span-12 lg:col-span-12 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4"
  >
    <Button
      className={`${gradients.quickActionsCard} col-span-1`}
      onClick={() => navigate("/personality")}
    >
      Take Quiz
    </Button>
    <Button
      className={`${gradients.quickActionsCard} col-span-1`}
      onClick={() => navigate("/career")}
    >
      Explore Careers
    </Button>
    <Button
      className={`${gradients.quickActionsCard} col-span-1`}
      onClick={() => navigate("/mindmesh")}
    >
      Mind Mesh
    </Button>
    <Button
      className={`${gradients.quickActionsCard} col-span-1`}
      onClick={() => navigate("/budget")}
    >
      Budget Buddy
    </Button>
    <Button
      className={`${gradients.quickActionsCard} col-span-1`}
      onClick={onShowStats}
    >
      Stats Card
    </Button>
  </motion.div>
);

export const Dashboard = () => {
  const navigate = useNavigate();
  const [dailySync, setDailySync] = useState<DailySync | null>(null);
  const [showWelcome, setShowWelcome] = useState(false);
  const [showBanner, setShowBanner] = useState(false);
  const [currentProfile, setCurrentProfile] =
    useState<PersonalityProfileV2 | null>(null);
  const [recommendedCareers, setRecommendedCareers] = useState<Career[]>([]);
  const [showStatsModal, setShowStatsModal] = useState(false);
  const [showQuizReminderNotification, setShowQuizReminderNotification] =
    useState(false); // New state for quiz reminder
  const [totalSpend, setTotalSpend] = useState(0);
  const [topCategory, setTopCategory] = useState("");
  const [numCategories, setNumCategories] = useState(0);
  const [latestExpense, setLatestExpense] = useState("");
  const [savingsTip, setSavingsTip] = useState("");

  useEffect(() => {
    const hasCompleted =
      storage.get<boolean>("hasCompletedPersonalityQuiz") === true;
    const storedProfile = storage.get<PersonalityProfileV2>(
      "currentPersonalityProfile",
    );
    setCurrentProfile(storedProfile);

    // Logic for 90-day quiz reminder
    if (storedProfile) {
      const lastQuizDate = new Date(storedProfile.createdAt);
      const ninetyDaysAgo = new Date();
      ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

      if (lastQuizDate < ninetyDaysAgo) {
        const reminderDismissed =
          sessionStorage.getItem("ls_quiz_reminder_dismissed") === "1";
        setShowQuizReminderNotification(!reminderDismissed);
      }
    }

    const expenses = storage.get<Expense[]>("expenses") || [];
    const mood = storage.get<string>("currentMood");

    const todayExpenses = expenses.filter(
      (e: Expense) =>
        new Date(e.date).toDateString() === new Date().toDateString(),
    );

    const totalTodaySpend = todayExpenses.reduce(
      (sum: number, e: Expense) => sum + e.amount,
      0,
    );

    setDailySync({
      hasProfile: !!storedProfile,
      mood: mood || "Neutral",
      spend: totalTodaySpend,
      progress: storedProfile ? 75 : 0, // Mock progress
    });

    // Calculate stats for the modal
    const allExpenses = storage.get<Expense[]>("expenses") || [];
    const calculatedTotalSpend = allExpenses.reduce(
      (sum: number, exp: Expense) => sum + exp.amount,
      0,
    );
    setTotalSpend(calculatedTotalSpend);

    const categoryTotals = allExpenses.reduce(
      (acc: Record<string, number>, exp: Expense) => {
        acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
        return acc;
      },
      {} as Record<string, number>,
    );
    const categories = Object.keys(categoryTotals);
    setNumCategories(categories.length);
    const calculatedTopCategory = categories.reduce(
      (max, cat) =>
        categoryTotals[cat] > (categoryTotals[max] || 0) ? cat : max,
      categories[0] || "",
    );
    setTopCategory(calculatedTopCategory);

    const latest =
      allExpenses.length > 0
        ? allExpenses[allExpenses.length - 1].description
        : "";
    setLatestExpense(latest);

    const tip =
      calculatedTotalSpend > 500
        ? "Consider reviewing your top spending category for savings opportunities."
        : "You're doing great! Keep tracking to maintain healthy spending habits.";
    setSavingsTip(tip);

    // Fetch career recommendations if profile exists
    const fetchCareers = async () => {
      if (storedProfile) {
        try {
          const careers = await api.getCareerRecommendations(
            storedProfile.id,
            storedProfile,
          );
          setRecommendedCareers(careers);
        } catch (error) {
          console.error("Error fetching careers for dashboard:", error);
        } finally {
          // This block is intentionally left empty
        }
      }
    };
    fetchCareers();

    // First-time experience logic
    if (!hasCompleted) {
      setShowWelcome(true);
    } else if (hasCompleted && !storedProfile) {
      // Should not happen if quiz completion sets profile
      const bannerDismissed =
        sessionStorage.getItem("ls_banner_dismissed") === "1";
      setShowBanner(!bannerDismissed);
    }
  }, []);

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      <Notification
        message="Your personality profile is over 90 days old. Consider retaking the quiz for updated insights!"
        type="info"
        onDismiss={() => {
          sessionStorage.setItem("ls_quiz_reminder_dismissed", "1");
          setShowQuizReminderNotification(false);
        }}
        isVisible={showQuizReminderNotification}
      />
      {/* HEADER */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="mb-8 col-span-full"
      >
        <div className="bg-gradient-to-r from-teal-light to-turquoise/70 rounded-2xl border border-turquoise/30 px-6 py-8 text-center shadow-[0_0_30px_rgba(9,218,198,0.08)]">
          <h1 className="font-bold text-[28px] leading-tight text-teal-dark drop-shadow-sm">
            Lifesync
          </h1>
          <p className="mt-2 text-[16px] text-teal-dark/80">
            Your Personal Development Companion
          </p>
        </div>
      </motion.div>

      {/* Persistent Banner for Skipped Quiz */}
      {showBanner && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-6 col-span-full"
        >
          <div className="flex items-start justify-between gap-3 bg-turquoise/10 border border-turquoise/30 rounded-xl px-4 py-3">
            <div className="text-turquoise/90 text-sm">
              <button
                onClick={() => navigate("/personality")}
                className="underline underline-offset-4 hover:text-turquoise"
              >
                👋 Complete your personality profile to unlock career
                recommendations
              </button>
            </div>
            <button
              aria-label="Dismiss"
              className="text-turquoise/60 hover:text-turquoise"
              onClick={() => {
                sessionStorage.setItem("ls_banner_dismissed", "1");
                setShowBanner(false);
              }}
            >
              ✕
            </button>
          </div>
        </motion.div>
      )}

      {/* Bento Grid Layout */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{
          visible: { transition: { staggerChildren: 0.1 } },
        }}
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-12 gap-6"
      >
        <ProfileCard profile={currentProfile} className="col-span-1 md:col-span-12 lg:col-span-6"/>
        <DailySyncCard
          dailySync={
            dailySync || {
              hasProfile: false,
              mood: "Neutral",
              spend: 0,
              progress: 0,
            }
          }
        />
        <QuickTipCard />
        <PersonalityDisplayCard profile={currentProfile} navigate={navigate} />
        <CareerMatchCard careers={recommendedCareers} navigate={navigate} />
        <QuickActionButtons
          navigate={navigate}
          onShowStats={() => setShowStatsModal(true)}
        />
      </motion.div>

      <StatsModal
        open={showStatsModal}
        onClose={() => setShowStatsModal(false)}
        totalSpend={totalSpend}
        topCategory={topCategory}
        numCategories={numCategories}
        latestExpense={latestExpense}
        savingsTip={savingsTip}
      />

      <WelcomeModal
        open={showWelcome}
        onStartQuiz={() => {
          setShowWelcome(false);
          navigate("/personality");
          storage.set(
            "hasCompletedPersonality",
            false,
          ); /* to ensure the quiz is started */
        }}
        onSkip={() => {
          setShowWelcome(false);
          storage.set("hasCompletedPersonality", false);
          sessionStorage.setItem("ls_banner_dismissed", "0");
          setShowBanner(true);
        }}
      />
    </div>
  );
};
