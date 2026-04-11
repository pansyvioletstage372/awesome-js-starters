import type { Metadata } from "next";
import PageShell from "@/components/PageShell";
import ChatMode from "@/components/ChatMode";

export const metadata: Metadata = {
  title: "Chat",
  description:
    "Have a conversation with our AI to find the perfect npm packages for your project.",
};

export default function ChatPage() {
  return (
    <PageShell
      title="Chat with AI"
      description="Not sure what you need? Have a conversation — ask follow-up questions, refine your requirements, and get tailored recommendations."
    >
      <ChatMode />
    </PageShell>
  );
}
