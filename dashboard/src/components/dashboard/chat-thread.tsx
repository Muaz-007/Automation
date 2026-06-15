import { Check, CheckCheck } from "lucide-react";
import { formatRelativeTime } from "@/lib/utils";

type Message = {
  id: string;
  role: "user" | "assistant" | "system";
  message: string;
  created_at: Date;
};

function formatTime(d: Date) {
  return new Date(d).toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

function formatDayDivider(d: Date) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const yest = new Date(today);
  yest.setDate(yest.getDate() - 1);
  const target = new Date(d);
  target.setHours(0, 0, 0, 0);

  if (target.getTime() === today.getTime()) return "Today";
  if (target.getTime() === yest.getTime()) return "Yesterday";
  return target.toLocaleDateString([], {
    weekday: "long",
    month: "short",
    day: "numeric",
  });
}

/**
 * WhatsApp-style chat thread.
 * - Customer messages on the left (white/dark bubble)
 * - Business/AI messages on the right (green-tinted bubble)
 * - Day dividers, time stamps in-bubble, blue ticks for AI replies
 * - Subtle pattern background that adapts to light/dark mode
 */
export function ChatThread({ messages }: { messages: Message[] }) {
  if (messages.length === 0) {
    return (
      <div className="relative flex h-72 items-center justify-center rounded-xl border border-border bg-muted/30">
        <p className="text-sm text-muted-foreground">No messages yet.</p>
      </div>
    );
  }

  // Group messages by day
  const groups: { dayKey: string; label: string; items: Message[] }[] = [];
  for (const m of messages) {
    const d = new Date(m.created_at);
    d.setHours(0, 0, 0, 0);
    const dayKey = d.toISOString();
    const last = groups[groups.length - 1];
    if (last && last.dayKey === dayKey) {
      last.items.push(m);
    } else {
      groups.push({ dayKey, label: formatDayDivider(d), items: [m] });
    }
  }

  return (
    <div className="relative overflow-hidden rounded-xl border border-border">
      {/* Pattern background — subtle doodle-like dots that adapt to theme */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[#efeae2] dark:bg-[#0b141a]"
      />
      <div
        aria-hidden
        className="absolute inset-0 -z-10 opacity-[0.05] dark:opacity-[0.08]"
        style={{
          backgroundImage:
            "radial-gradient(circle, currentColor 1px, transparent 1px)",
          backgroundSize: "20px 20px",
          color: "currentColor",
        }}
      />

      <div className="max-h-[60vh] space-y-3 overflow-y-auto p-4 sm:p-6">
        {groups.map((g) => (
          <div key={g.dayKey} className="space-y-1.5">
            {/* Day divider */}
            <div className="flex justify-center py-2">
              <span className="rounded-md bg-white/80 px-2.5 py-1 text-[11px] font-medium text-zinc-700 shadow-sm dark:bg-zinc-800/80 dark:text-zinc-300">
                {g.label}
              </span>
            </div>

            {g.items
              .filter((m) => m.role === "user" || m.role === "assistant")
              .map((m, idx, arr) => {
                const isUser = m.role === "user";
                const prev = arr[idx - 1];
                const isGroupedWithPrev = prev?.role === m.role;
                return (
                  <div
                    key={m.id}
                    className={`flex ${isUser ? "justify-start" : "justify-end"}`}
                  >
                    <div
                      className={`relative max-w-[78%] rounded-lg px-3 py-1.5 pb-5 text-sm shadow-sm ${
                        isUser
                          ? "bg-white text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100"
                          : "bg-[#dcf8c6] text-zinc-900 dark:bg-emerald-900/40 dark:text-emerald-50"
                      } ${
                        isGroupedWithPrev
                          ? ""
                          : isUser
                            ? "rounded-tl-none"
                            : "rounded-tr-none"
                      }`}
                    >
                      {/* Tail (only on first message in group) */}
                      {!isGroupedWithPrev && (
                        <span
                          aria-hidden
                          className={`absolute top-0 h-0 w-0 ${
                            isUser
                              ? "-left-[7px] border-r-[8px] border-t-[8px] border-r-white border-t-transparent dark:border-r-zinc-800"
                              : "-right-[7px] border-l-[8px] border-t-[8px] border-l-[#dcf8c6] border-t-transparent dark:border-l-emerald-900/40"
                          }`}
                        />
                      )}

                      <p className="whitespace-pre-wrap pr-12 leading-relaxed">
                        {m.message}
                      </p>

                      {/* Time + ticks inside the bubble, bottom-right */}
                      <span
                        className={`absolute bottom-1 right-2 inline-flex items-center gap-0.5 text-[10px] ${
                          isUser
                            ? "text-zinc-500 dark:text-zinc-400"
                            : "text-emerald-700/70 dark:text-emerald-200/70"
                        }`}
                      >
                        {formatTime(m.created_at)}
                        {!isUser &&
                          (idx === arr.length - 1 ? (
                            <CheckCheck className="h-3 w-3 text-blue-500" />
                          ) : (
                            <CheckCheck className="h-3 w-3" />
                          ))}
                      </span>
                    </div>
                  </div>
                );
              })}
          </div>
        ))}

        {/* Last-activity hint at the very bottom */}
        <div className="pt-2 text-center">
          <span className="text-[10px] text-muted-foreground">
            Last activity {formatRelativeTime(messages[messages.length - 1].created_at)}
          </span>
        </div>
      </div>
    </div>
  );
}
