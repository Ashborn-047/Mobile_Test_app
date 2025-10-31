import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Card } from "../../../../src/components/Card";
import { Button } from "../../../../src/components/Button";
import { LoadingShimmer } from "../../../../src/components/LoadingShimmer";
// import { RadarChartComponent } from '../../../../src/components/RadarChart'; // Removed unused import
import { PersonalityProfileV2 /*, PersonalityTrait */ } from "../types"; // Removed unused PersonalityTrait import
import { storage } from "../../../../src/utils/storage";
import { generatePersonalitySummary } from "../utils";
import { AnimatedAvatarV2 } from "./AnimatedAvatarV2";
// import { ResultsCard } from './ResultsCard'; // Removed unused import
import { generatePersonalityCard } from "../../../../src/utils/share"; // Import share utility

interface PersonalityResultsProps {
  onRetakeQuiz: () => void;
  answers: Record<string, number>;
}

export const Results = ({ onRetakeQuiz, answers }: PersonalityResultsProps) => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<PersonalityProfileV2 | null>(null);
  const [loading, setLoading] = useState(true);
  const reportRef = useRef<HTMLDivElement>(null); // Ref for the shareable card

  useEffect(() => {
    const saveAndSetProfile = async () => {
      setLoading(true);
      const { summary, traits, emoji } = generatePersonalitySummary(answers);
      // Mock brain dominance for now
      const brainDominance = Math.floor(Math.random() * 100);

      const newProfile: PersonalityProfileV2 = {
        id: Date.now().toString(),
        summary,
        traits: traits.map((t) => ({
          ...t,
          value: Math.min(100, Math.max(0, t.value)),
        })), // Ensure values are 0-100
        radarData: traits.map((t) => ({
          ...t,
          value: Math.min(100, Math.max(0, t.value)),
        })), // Using traits directly for radar data for simplicity
        createdAt: new Date().toISOString(),
        emoji,
        brainDominance: brainDominance, // Add brainDominance to the profile type
        personalityType: "Creative Visionary", // Mock
        superpower: "Innovation", // Mock
        challenge: "Follow-through", // Mock
      } as PersonalityProfileV2; // Cast to bypass TS issues with new fields temporarily

      const existingProfiles =
        storage.get<PersonalityProfileV2[]>("personalityHistory") || [];
      const updatedProfiles = [...existingProfiles, newProfile];
      storage.set("personalityHistory", updatedProfiles);
      storage.set("currentPersonalityProfile", newProfile);
      storage.set("hasCompletedPersonalityQuiz", true);
      setProfile(newProfile);
      setLoading(false);

      setTimeout(() => {
        // Optionally show confetti animation here
        // alert('✨ Profile Complete! Your journey begins.');
        // The actual celebration message/animation will be part of the Hero section.
      }, 400);
    };
    saveAndSetProfile();
  }, [answers]);

  if (loading) {
    return (
      <div className="min-h-screen p-6 max-w-4xl mx-auto">
        <LoadingShimmer />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center text-red-500">Error loading profile.</div>
    );
  }

  const lastQuizDate = new Date(profile.createdAt);
  const ninetyDaysAgo = new Date();
  ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
  const showRetakeReminder = lastQuizDate < ninetyDaysAgo;

  // Confetti effect (visual mock for now)
  const Confetti = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-50">
      {Array.from({ length: 50 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute bg-turquoise rounded-full"
          initial={{
            x: Math.random() * window.innerWidth,
            y: -20,
            opacity: 0,
            scale: Math.random() * 0.5 + 0.5,
          }}
          animate={{
            y: window.innerHeight + 20,
            opacity: [0, 1, 0.5, 0],
            scale: 0,
            rotate: Math.random() * 720,
          }}
          transition={{
            duration: Math.random() * 3 + 2,
            repeat: Infinity,
            delay: Math.random() * 5,
          }}
          style={{
            width: `${Math.random() * 10 + 5}px`,
            height: `${Math.random() * 10 + 5}px`,
          }}
        />
      ))}
    </div>
  );

  return (
    <div className="min-h-screen relative">
      <Confetti />
      {/* HERO SECTION */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 min-h-screen bg-gradient-to-br from-teal-light to-dark-teal flex flex-col items-center justify-center p-6 text-white text-center"
      >
        <h1 className="font-bold text-[36px] md:text-[48px] leading-tight text-turquoise mb-4 drop-shadow-lg">
          🎯 YOUR PERSONALITY UNLOCKED
        </h1>
        <AnimatePresence>
          <motion.div
            key="emoji-avatar"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              type: "spring",
              stiffness: 100,
              damping: 10,
              delay: 0.5,
            }}
            className="mb-6"
          >
            <AnimatedAvatarV2 emoji={profile.emoji} size="lg" />
          </motion.div>
        </AnimatePresence>
        <h2 className="text-[28px] md:text-[36px] font-bold mb-4">
          {profile.personalityType}
        </h2>

        {/* Animated Brain Visual (Mock for now) */}
        <motion.div
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: "80%", opacity: 1 }}
          transition={{ delay: 1, duration: 1, type: "spring" }}
          className="w-3/4 max-w-md bg-gray-700 rounded-full h-4 overflow-hidden mb-4"
        >
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${profile.brainDominance}%` }}
            transition={{ delay: 1.5, duration: 1.5, ease: "easeInOut" }}
            className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full"
          />
          <div className="absolute top-0 left-0 w-full h-full flex justify-between items-center text-xs font-semibold px-2">
            <span className="text-white">
              {profile.brainDominance}% Right Brain
            </span>
            <span className="text-white">
              {100 - profile.brainDominance}% Left Brain
            </span>
          </div>
        </motion.div>

        <p className="text-lg mb-2">
          Superpower:{" "}
          <span className="text-green-400 font-semibold">
            {profile.superpower}
          </span>
        </p>
        <p className="text-lg">
          Challenge:{" "}
          <span className="text-orange-400 font-semibold">
            {profile.challenge}
          </span>
        </p>

        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2, type: "spring" }}
          onClick={() => {
            if (reportRef.current) {
              reportRef.current.scrollIntoView({ behavior: "smooth" });
            }
          }}
          className="mt-8 px-8 py-3 bg-turquoise text-dark-teal rounded-full font-bold shadow-lg hover:scale-105 transition-all"
        >
          Explore Full Report
        </motion.button>
      </motion.div>

      {/* FULL REPORT SECTIONS */}
      <motion.div
        ref={reportRef}
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.5, duration: 0.5 }}
        className="relative z-20 p-6 max-w-6xl mx-auto space-y-12 bg-cream-light rounded-t-3xl shadow-lg -mt-12"
      >
        {/* YOUR CORE IDENTITY */}
        <section className="py-8">
          <h2 className="text-3xl font-bold text-dark-teal mb-6 text-center">
            Your Core Identity
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-indigo-100 border-indigo-300 text-indigo-900">
              <h3 className="font-semibold text-xl">Personality Type</h3>
              <p className="text-2xl font-bold">{profile.personalityType}</p>
            </Card>
            <Card className="bg-purple-100 border-purple-300 text-purple-900">
              <h3 className="font-semibold text-xl">Brain Dominance</h3>
              <p className="text-2xl font-bold">
                {profile.brainDominance >= 50
                  ? `${profile.brainDominance}% Right Brain`
                  : `${100 - profile.brainDominance}% Left Brain`}
              </p>
            </Card>
            <Card className="bg-green-100 border-green-300 text-green-900">
              <h3 className="font-semibold text-xl">Superpower</h3>
              <p className="text-2xl font-bold">{profile.superpower}</p>
            </Card>
            <Card className="bg-orange-100 border-orange-300 text-orange-900">
              <h3 className="font-semibold text-xl">Challenge</h3>
              <p className="text-2xl font-bold">{profile.challenge}</p>
            </Card>
          </div>
        </section>

        {/* HOW YOUR MIND WORKS */}
        <section className="py-8">
          <h2 className="text-3xl font-bold text-dark-teal mb-6 text-center">
            How Your Mind Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <h3 className="font-semibold text-lg">🎯 Decision Making</h3>
              <p className="text-gray-700">
                {profile.brainDominance > 70
                  ? "You lead with intuition and creative leaps."
                  : profile.brainDominance < 30
                    ? "Your decisions are driven by logic and detailed analysis."
                    : "You blend intuition with logic for balanced choices."}
              </p>
            </Card>
            <Card>
              <h3 className="font-semibold text-lg">💬 Communication Style</h3>
              <p className="text-gray-700">
                {profile.traits.find((t) => t.trait === "Extraversion")?.value >
                60
                  ? "You're an expressive storyteller, engaging others with ease."
                  : "You prefer concise, clear communication, valuing depth over breadth."}
              </p>
            </Card>
            <Card>
              <h3 className="font-semibold text-lg">📚 Learning Preference</h3>
              <p className="text-gray-700">
                {profile.traits.find((t) => t.trait === "Openness")?.value > 70
                  ? "Hands-on experimentation and exploring new concepts excites you."
                  : "You prefer structured learning, mastering fundamentals before innovation."}
              </p>
            </Card>
            <Card>
              <h3 className="font-semibold text-lg">🔧 Problem Solving</h3>
              <p className="text-gray-700">
                {profile.traits.find((t) => t.trait === "Conscientiousness")
                  ?.value < 40
                  ? "You tackle problems with creative, out-of-the-box solutions."
                  : "You approach challenges systematically, focusing on root causes and efficiency."}
              </p>
            </Card>
          </div>
        </section>

        {/* TOP TRAITS (Animated progress bars - placeholders) */}
        <section className="py-8">
          <h2 className="text-3xl font-bold text-dark-teal mb-6 text-center">
            Your Top Traits
          </h2>
          <div className="space-y-4">
            {profile.traits.map((trait, index) => (
              <Card
                key={trait.trait}
                className="p-4 bg-gray-50 border-gray-200"
              >
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(trait.value / 100) * 100}%` }}
                  transition={{
                    duration: 1,
                    delay: index * 0.1,
                    ease: "easeOut",
                  }}
                  className="h-3 rounded-full overflow-hidden mb-2"
                  style={{
                    background: `linear-gradient(to right, ${["#f43f5e", "#3b82f6", "#10b981", "#eab308", "#9b87f5"][index % 5]} 0%, #d1d5db 100%)`,
                  }}
                />
                <h3 className="font-semibold text-lg text-dark-teal">
                  {trait.trait}{" "}
                  <span className="text-sm">({trait.value}/100)</span>
                </h3>
                <p className="text-gray-700 text-sm">
                  {"★".repeat(Math.round(trait.value / 20))}
                  {"☆".repeat(5 - Math.round(trait.value / 20))}
                </p>
              </Card>
            ))}
          </div>
        </section>

        {/* IN RELATIONSHIPS */}
        <section className="py-8">
          <h2 className="text-3xl font-bold text-dark-teal mb-6 text-center">
            In Relationships
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <h3 className="font-semibold text-lg">As a Friend</h3>
              <p className="text-gray-700">
                {profile.traits.find((t) => t.trait === "Agreeableness")
                  ?.value > 70
                  ? "You're a deeply empathetic and supportive friend, always there to listen."
                  : profile.traits.find((t) => t.trait === "Extraversion")
                        ?.value > 60
                    ? "Your vibrant energy makes you the life of any social gathering."
                    : "You're a loyal and thoughtful friend, valuing deep connections."}
              </p>
            </Card>
            <Card>
              <h3 className="font-semibold text-lg">As a Leader</h3>
              <p className="text-gray-700">
                {profile.personalityType.includes("Visionary")
                  ? "You're a visionary leader, inspiring others with bold ideas and a clear direction."
                  : profile.traits.find((t) => t.trait === "Conscientiousness")
                        ?.value > 70
                    ? "You lead with meticulous planning and a focus on achieving tangible results."
                    : "You lead by example, fostering a collaborative and supportive environment."}
              </p>
            </Card>
            <Card>
              <h3 className="font-semibold text-lg">In Teams</h3>
              <p className="text-gray-700">
                {profile.traits.find((t) => t.trait === "Agreeableness")
                  ?.value > 60
                  ? "You excel in collaborative teams, mediating conflicts and building consensus."
                  : profile.traits.find((t) => t.trait === "Extraversion")
                        ?.value > 50
                    ? "You energize team discussions, bringing new perspectives and driving momentum."
                    : "You contribute thoughtfully, ensuring quality and attention to detail."}
              </p>
            </Card>
            <Card>
              <h3 className="font-semibold text-lg">Your People Need</h3>
              <p className="text-gray-700">
                {profile.traits.find((t) => t.trait === "Agreeableness")
                  ?.value > 60
                  ? "They need your compassion and understanding to thrive."
                  : profile.traits.find((t) => t.trait === "Openness")?.value >
                      60
                    ? "They need your innovative spirit to break new ground."
                    : "They thrive with your clear direction and steadfast support."}
              </p>
            </Card>
          </div>
        </section>

        {/* YOUR NATURAL HABITAT */}
        <section className="py-8">
          <h2 className="text-3xl font-bold text-dark-teal mb-6 text-center">
            Your Natural Habitat
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <h3 className="font-semibold text-lg">Work Environment</h3>
              <p className="text-gray-700">
                {profile.traits.find((t) => t.trait === "Openness")?.value > 70
                  ? "You thrive in dynamic, creative environments that encourage exploration."
                  : profile.traits.find((t) => t.trait === "Conscientiousness")
                        ?.value > 60
                    ? "A structured, organized setting where efficiency is valued suits you best."
                    : "You prefer a balanced environment, blending collaboration with independent work."}
              </p>
            </Card>
            <Card>
              <h3 className="font-semibold text-lg">Best Time</h3>
              <p className="text-gray-700">
                "Your peak energy and focus often occur in the late morning and
                early afternoon, but you can adapt."
              </p>
            </Card>
            <Card>
              <h3 className="font-semibold text-lg">Productivity Style</h3>
              <p className="text-gray-700">
                {profile.traits.find((t) => t.trait === "Conscientiousness")
                  ?.value > 60
                  ? "You excel with structured routines and meticulously planned tasks."
                  : profile.traits.find((t) => t.trait === "Openness")?.value >
                      50
                    ? "You're most productive in bursts of creative energy, often switching between tasks."
                    : "You maintain a steady pace, consistently moving forward with tasks."}
              </p>
            </Card>
            <Card>
              <h3 className="font-semibold text-lg">Stress Response</h3>
              <p className="text-gray-700">
                {profile.traits.find((t) => t.trait === "Neuroticism")?.value >
                60
                  ? "You tend to internalize stress, benefiting from mindfulness and self-care practices."
                  : "You actively seek solutions and externalize stress through action or discussion."}
              </p>
            </Card>
          </div>
        </section>

        {/* CAREER DNA */}
        <section className="py-8">
          <h2 className="text-3xl font-bold text-dark-teal mb-6 text-center">
            Career DNA
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-green-50 border-green-200 text-green-900">
              <h3 className="font-semibold text-xl mb-3">
                ✅ YOU'RE BUILT FOR
              </h3>
              <ul className="list-disc list-inside space-y-1">
                {profile.traits.find((t) => t.trait === "Openness")?.value >
                  60 && <li>Innovation & Creative Problem Solving</li>}
                {profile.traits.find((t) => t.trait === "Conscientiousness")
                  ?.value > 60 && <li>Structured Execution & Planning</li>}
                {profile.traits.find((t) => t.trait === "Extraversion")?.value >
                  60 && <li>Leadership & Public Speaking</li>}
                {profile.traits.find((t) => t.trait === "Agreeableness")
                  ?.value > 60 && <li>Team Collaboration & Mentorship</li>}
                {profile.brainDominance > 50 && (
                  <li>Big-Picture Strategy & Vision</li>
                )}
                {profile.brainDominance < 50 && (
                  <li>Detail-Oriented Analysis & Logic</li>
                )}
              </ul>
            </Card>
            <Card className="bg-red-50 border-red-200 text-red-900">
              <h3 className="font-semibold text-xl mb-3">❌ AVOID THESE</h3>
              <ul className="list-disc list-inside space-y-1">
                {profile.traits.find((t) => t.trait === "Openness")?.value <
                  40 && <li>Highly Repetitive & Monotonous Tasks</li>}
                {profile.traits.find((t) => t.trait === "Conscientiousness")
                  ?.value < 40 && <li>Unstructured & Ambiguous Roles</li>}
                {profile.traits.find((t) => t.trait === "Extraversion")?.value <
                  40 && <li>Constant Public Interaction Roles</li>}
                {profile.traits.find((t) => t.trait === "Agreeableness")
                  ?.value < 40 && (
                  <li>Conflict-Heavy & Uncollaborative Environments</li>
                )}
                {profile.brainDominance > 70 && (
                  <li>Excessive Micro-Management</li>
                )}
                {profile.brainDominance < 30 && (
                  <li>Roles Requiring Pure Abstract Ideation</li>
                )}
              </ul>
            </Card>
          </div>
        </section>

        {/* FAMOUS PERSONALITIES LIKE YOU */}
        <section className="py-8">
          <h2 className="text-3xl font-bold text-dark-teal mb-6 text-center">
            Famous Personalities Like You
          </h2>
          <div className="flex overflow-x-auto pb-4 space-x-4">
            {[
              {
                name: "Steve Jobs",
                emoji: "🍎",
                desc: "Visionary, innovator, driven by intuition.",
                traits: ["Openness", "Conscientiousness"],
              },
              {
                name: "Oprah Winfrey",
                emoji: "🌟",
                desc: "Empathetic leader, excellent communicator.",
                traits: ["Extraversion", "Agreeableness"],
              },
              {
                name: "Elon Musk",
                emoji: "🚀",
                desc: "Bold inventor, highly conscientious & open.",
                traits: ["Openness", "Conscientiousness"],
              },
              {
                name: "Albert Einstein",
                emoji: "🧠",
                desc: "Deep thinker, highly open and intellectual.",
                traits: ["Openness"],
              },
              {
                name: "Malala Yousafzai",
                emoji: "🕊️",
                desc: "Courageous advocate, agreeable and inspiring.",
                traits: ["Agreeableness", "Extraversion"],
              },
            ]
              .filter((p) =>
                p.traits.some(
                  (t) =>
                    (profile.traits.find((pt) => pt.trait === t)?.value || 0) >
                    60,
                ),
              )
              .slice(0, 3)
              .map((person, i) => (
                <Card key={i} className="min-w-[200px] text-center">
                  <AnimatedAvatarV2 emoji={person.emoji} size="sm" />
                  <h3 className="font-semibold text-lg text-dark-teal mt-2">
                    {person.name}
                  </h3>
                  <p className="text-gray-700 text-sm">{person.desc}</p>
                </Card>
              ))}
          </div>
        </section>

        {/* SHAREABLE PERSONALITY CARD */}
        <section className="py-8 flex flex-col items-center">
          <h2 className="text-3xl font-bold text-dark-teal mb-6 text-center">
            Share Your Journey!
          </h2>
          <div
            id="shareable-personality-card"
            className="w-full max-w-sm rounded-xl overflow-hidden shadow-lg p-6 text-white text-center"
            style={{
              background: `linear-gradient(135deg, ${profile.traits[0]?.value > 50 ? "#09dac6" : "#9b87f5"} 0%, ${profile.traits[1]?.value > 50 ? "#05352d" : "#7e69ab"} 100%)`,
            }}
          >
            <AnimatedAvatarV2 emoji={profile.emoji} size="lg" />
            <h3 className="text-2xl font-bold mt-4">
              {profile.personalityType}
            </h3>
            <p className="text-sm mt-1">
              {profile.brainDominance}% Right Brain
            </p>
            <div className="mt-4">
              {profile.traits.slice(0, 3).map((trait) => (
                <p key={trait.trait} className="text-sm">
                  {trait.trait}: {"★".repeat(Math.round(trait.value / 20))}
                  {"☆".repeat(5 - Math.round(trait.value / 20))}
                </p>
              ))}
            </div>
            <p className="text-xs mt-4 opacity-70">Created with Lifesync</p>
          </div>
          <div className="flex gap-4 mt-6">
            <Button
              onClick={() =>
                generatePersonalityCard(
                  "shareable-personality-card",
                  "my-lifesync-persona.png",
                )
              }
            >
              💾 Save Image
            </Button>
            <Button
              variant="secondary"
              onClick={() => alert("Social sharing coming soon!")}
            >
              📤 Share to Social Media
            </Button>
          </div>
        </section>

        {/* WHAT'S NEXT? */}
        <section className="py-8 text-center">
          <h2 className="text-3xl font-bold text-dark-teal mb-6">
            What's Next?
          </h2>
          <div className="flex flex-col md:flex-row justify-center gap-4">
            <Button onClick={() => navigate("/career")}>
              Explore Career Paths →
            </Button>
            <Button
              variant="secondary"
              onClick={() => alert("Download Full Report Coming Soon!")}
            >
              Download Full Report 📄
            </Button>
            {showRetakeReminder && (
              <Button onClick={onRetakeQuiz} variant="secondary">
                Retake Now ⏰
              </Button>
            )}
            {!showRetakeReminder && (
              <Button onClick={onRetakeQuiz} variant="secondary">
                Retake in 3 Months ⏰
              </Button>
            )}
          </div>
        </section>
      </motion.div>
    </div>
  );
};
