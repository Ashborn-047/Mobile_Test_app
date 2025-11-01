import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "../../../components/Card";
import { Button } from "../../../components/Button";
import { AnimatedAvatarV2 } from "../../Personality/components/AnimatedAvatarV2";
import { PersonalityProfileV2 } from "../../Personality/types";
import { storage } from "../../../utils/storage";
import { gradients } from "../../../theme";

interface ProfileCardProps {
  profile: PersonalityProfileV2 | null;
  className?: string;
  // Add any other props needed for profile completion, etc.
}

export const ProfileCard = ({ profile }: ProfileCardProps) => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState<string>(
    storage.get("userName") || "Guest",
  );
  const [isEditingName, setIsEditingName] = useState(false);

  const lastQuizDate = profile ? new Date(profile.createdAt) : null;
  const ninetyDaysAgo = new Date();
  ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
  const showUpdateReminder = lastQuizDate && lastQuizDate < ninetyDaysAgo;

  const handleNameSave = () => {
    storage.set("userName", userName);
    setIsEditingName(false);
  };

  // Mock profile completion for now
  const profileCompletion = profile ? 75 : 0;

  return (
    <Card
      className={`${gradients.profileCard} col-span-1 md:col-span-3 h-48 flex flex-col justify-between`}
    >
      <div>
        <div className="flex items-center gap-3 mb-2">
          <AnimatedAvatarV2 emoji={profile?.emoji || "👋"} size="sm" />
          {isEditingName ? (
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              onBlur={handleNameSave}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleNameSave();
              }}
              className="bg-transparent border-b border-white/50 text-white text-xl font-semibold focus:outline-none"
            />
          ) : (
            <h3
              className="text-xl font-semibold text-white"
              onClick={() => setIsEditingName(true)}
            >
              {userName}
            </h3>
          )}
        </div>
        <p className="text-white/80 text-sm">{profileCompletion}% Complete</p>
        {lastQuizDate && (
          <p className="text-white/80 text-xs mt-1">
            Last quiz: {lastQuizDate.toLocaleDateString()}
          </p>
        )}
      </div>
      <div className="mt-4">
        {!profile ? (
          <Button onClick={() => navigate("/personality")} className="w-full">
            Take Personality Quiz
          </Button>
        ) : (
          <Button onClick={() => navigate("/personality")} className="w-full">
            View Your Persona
          </Button>
        )}
        {showUpdateReminder && (
          <Button
            onClick={() => navigate("/personality")}
            variant="secondary"
            className="w-full mt-2 text-red-400 border-red-400 hover:bg-red-400/10"
          >
            Update Profile ⏰
          </Button>
        )}
      </div>
    </Card>
  );
};
