const validateClubData = (data) => {
  if (!data.clubName || typeof data.clubName !== "string") return "Invalid or missing club name.";
  if (!data.imageUrl || typeof data.imageUrl !== "string") return "Invalid or missing image URL.";
  if (!data.clubHead || typeof data.clubHead !== "string") return "Invalid or missing club head.";
  if (!data.clubAbbrevation || typeof data.clubAbbrevation !== "string") return "Invalid or missing club abbreviation.";
  if (!data.godName || typeof data.godName !== "string") return "Invalid or missing god name.";
  return null;
};

const validateClubID = (clubID) => {
  if (!clubID || typeof clubID !== "number" || clubID <= 0) return "Invalid club ID.";
  return null;
};

export { validateClubData, validateClubID };
