import {
  PersonalityTrait,
  PersonalityProfileV2,
  ComparisonResult,
} from "./types";

export const calculateRadarData = (
  profile: PersonalityProfileV2,
): PersonalityTrait[] => {
  // In a real app, this would be more complex, based on quiz answers.
  // For now, we'll use the profile's traits to generate radar data.
  return profile.traits.map((t) => ({ trait: t.trait, value: t.value }));
};

export const getTraitChange = (
  before: number,
  after: number,
): "up" | "down" | "same" => {
  if (after > before) return "up";
  if (after < before) return "down";
  return "same";
};

export const comparePersonalityProfiles = (
  profileBefore: PersonalityProfileV2,
  profileAfter: PersonalityProfileV2,
): ComparisonResult[] => {
  const comparison: ComparisonResult[] = [];
  profileBefore.traits.forEach((traitBefore) => {
    const traitAfter = profileAfter.traits.find(
      (t) => t.trait === traitBefore.trait,
    );
    if (traitAfter) {
      comparison.push({
        trait: traitBefore.trait,
        valueBefore: traitBefore.value,
        valueAfter: traitAfter.value,
        change: getTraitChange(traitBefore.value, traitAfter.value),
      });
    }
  });
  return comparison;
};
