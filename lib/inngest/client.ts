import { Inngest } from "inngest";
export const inngest = new Inngest({
  name: "Stock Marketplace Inngest Client",
  id: "signalist",
  ai: { gemini: { apiKey: process.env.GEMINI_API_KEY } },
});
