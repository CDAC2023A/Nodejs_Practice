import qr from "qrcode";
import sharp from "sharp";
import fs from "fs/promises";

// Function to generate SVG QR code from user data
export const generateQRCodeSVG = async (userData: any): Promise<string> => {
  try {
    // Convert user data to JSON string
    const jsonData = JSON.stringify(userData);

    // Generate QR code as SVG file
    const qrCodeFilePath = "qrcode.svg";
    await qr.toFile(qrCodeFilePath, jsonData, { type: "svg" });

    // Read the SVG file and return its content as a string
    const qrCodeSVGBuffer = await fs.readFile(qrCodeFilePath);
    const qrCodeSVGString = qrCodeSVGBuffer.toString();

    // Optionally, you can remove the file after reading it
    await fs.unlink(qrCodeFilePath);

    return qrCodeSVGString;
  } catch (error) {
    console.error("Error generating SVG QR code:", error);
    throw new Error("Error generating SVG QR code");
  }
};

export default generateQRCodeSVG;
