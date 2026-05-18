import fernet from "fernet";
import { ENCRYPTION_KEY } from "../environment";
import { Buffer } from "buffer";

if (typeof window !== "undefined" && !(window as any).Buffer) {
  (window as any).Buffer = Buffer;
}

export const decryptPayload = (envelope: any): any => {
  if (!envelope || !envelope.encrypted_data || ENCRYPTION_KEY === "") return envelope;
  try {
    const secret = new fernet.Secret(ENCRYPTION_KEY);
    const fernetToken = Buffer.from(envelope.encrypted_data, "base64").toString("utf-8");
    const token = new fernet.Token({ secret, token: fernetToken, ttl: 0 });
    return JSON.parse(token.decode());
  } catch (error) {
    console.warn("Payload decryption failed:", error);
    throw new Error("Failed to decrypt server response.");
  }
};
