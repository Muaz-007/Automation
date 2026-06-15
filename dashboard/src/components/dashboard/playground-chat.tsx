"use client";

import { useState, useTransition, useRef, useEffect } from "react";
import { AlertCircle, RotateCcw, Send, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  sendPlaygroundMessage,
  resetPlaygroundConversation,
} from "@/app/actions/playground";
import { useToast } from "@/components/toaster";

type Msg = {
  id: string;
  role: "user" | "assistant" | "error";
  text: string;
};

const TEST_PHONE = "+10000000001"; // synthetic — never collides with real WhatsApp numbers

const SAMPLE_PROMPTS = [
  "Hi, I'm looking for a 3 bedroom house in DHA Phase 6, budget around 1.5 crore.",
  "Hi! Do you have the black hoodie in size M in stock?",
  "I'd like to book a skin consultation for Saturday — what slots are available?",
];

export function PlaygroundChat({
  initialMessages = [],
}: {
  initialMessages?: Msg[];
}) {
  const [messages, setMessages] = useState<Msg[]>(initialMessages);
  const [input, setInput] = useState("");
  const [pending, start] = useTransition();
  const { toast } = useToast();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, pending]);

  function send(text: string) {
    if (!text.trim() || pending) return;
    const userMsg: Msg = {
      id: `u_${Date.now()}`,
      role: "user",
      text: text.trim(),
    };
    setMessages((m) => [...m, userMsg]);
    setInput("");

    start(async () => {
      const result = await sendPlaygroundMessage(text.trim(), TEST_PHONE);
      if (result.ok) {
        setMessages((m) => [
          ...m,
          { id: `a_${Date.now()}`, role: "assistant", text: result.reply },
        ]);
      } else {
        setMessages((m) => [
          ...m,
          { id: `e_${Date.now()}`, role: "error", text: result.error },
        ]);
        toast("error", result.error);
      }
    });
  }

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <Card className="lg:col-span-2 flex flex-col h-[calc(100dvh-12rem)]">
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-6 space-y-3"
        >
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-accent text-accent-foreground">
                <Sparkles className="h-5 w-5" />
              </div>
              <h3 className="mb-1 font-semibold">Start a test conversation</h3>
              <p className="mb-6 max-w-sm text-sm text-muted-foreground">
                Type any message — the AI will reply as if you were a real customer on WhatsApp. Extracted lead data appears on the right.
              </p>
              <div className="flex flex-wrap justify-center gap-2 max-w-lg">
                {SAMPLE_PROMPTS.map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => send(p)}
                    className="rounded-full border border-border bg-background px-3 py-1.5 text-xs hover:bg-muted text-left"
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          )}
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm ${
                  m.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : m.role === "error"
                      ? "border border-destructive/30 bg-destructive/5 text-destructive"
                      : "bg-muted text-foreground"
                }`}
              >
                {m.role === "error" && (
                  <div className="mb-1 flex items-center gap-1 text-xs font-semibold">
                    <AlertCircle className="h-3 w-3" /> AI error
                  </div>
                )}
                <p className="whitespace-pre-wrap">{m.text}</p>
              </div>
            </div>
          ))}
          {pending && (
            <div className="flex justify-start">
              <div className="rounded-2xl bg-muted px-4 py-2.5 text-sm">
                <span className="inline-flex gap-1">
                  <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.3s]" />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.15s]" />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground" />
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="border-t border-border p-4">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
            className="flex gap-2"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a message as if you were a WhatsApp customer..."
              className="flex-1 rounded-md border border-border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              disabled={pending}
            />
            <Button type="submit" disabled={pending || !input.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </Card>

      <Card>
        <CardContent className="p-6 space-y-4">
          <div>
            <h3 className="font-semibold">About the playground</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Every message you send here runs through the full pipeline: Claude, the lead extractor, and the database. The only thing skipped is the actual WhatsApp send.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-medium">Where to see results</h4>
            <ul className="mt-2 space-y-1.5 text-sm text-muted-foreground">
              <li>• Lead appears on <a href="/leads" className="text-primary hover:underline">/leads</a></li>
              <li>• Full conversation on <a href="/conversations" className="text-primary hover:underline">/conversations</a></li>
              <li>• Extracted data populates as you talk</li>
            </ul>
          </div>

          <div className="border-t border-border pt-4">
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={() => {
                start(async () => {
                  await resetPlaygroundConversation(TEST_PHONE);
                  setMessages([]);
                  toast("info", "Playground reset");
                });
              }}
              disabled={pending}
            >
              <RotateCcw className="h-4 w-4" /> Reset conversation
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
