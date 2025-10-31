import html2canvas from "html2canvas";

export const generatePersonalityCard = async (
  elementId: string,
  filename = "personality-profile.png",
) => {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error("Element not found for screenshot", elementId);
    return;
  }

  try {
    const canvas = await html2canvas(element, {
      scale: 2, // Improve quality
      useCORS: true, // Handle images/assets from different origins if any
    });
    const image = canvas.toDataURL("image/png");

    // Create a link and trigger download
    const link = document.createElement("a");
    link.href = image;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error("Error generating personality card", error);
  }
};
