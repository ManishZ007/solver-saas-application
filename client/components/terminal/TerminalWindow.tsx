"use client";

import { useEffect, useRef, useCallback } from "react";
import { createState, runCommand, getCompletions } from "@/lib/terminalSimulator";
import type { TerminalState } from "@/lib/terminalSimulator";

const PROMPT_BASE = "\x1b[1;32muser@solver\x1b[0m:\x1b[1;34m";
const PROMPT_END = "\x1b[0m$ ";

function buildPrompt(cwd: string[]): string {
  const path = cwd.length === 0 ? "/" : cwd.join("/") === "home/user" ? "~" : "/" + cwd.join("/");
  return PROMPT_BASE + path + PROMPT_END;
}

export default function TerminalWindow() {
  const containerRef = useRef<HTMLDivElement>(null);
  const termRef = useRef<import("xterm").Terminal | null>(null);
  const stateRef = useRef<TerminalState>(createState());
  const inputRef = useRef<string>("");
  const cursorRef = useRef<number>(0);
  const histIdxRef = useRef<number>(-1);

  const writePrompt = useCallback((term: import("xterm").Terminal) => {
    term.write("\r\n" + buildPrompt(stateRef.current.cwd));
    inputRef.current = "";
    cursorRef.current = 0;
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;

    let term: import("xterm").Terminal;
    let fitAddon: import("xterm-addon-fit").FitAddon;

    (async () => {
      const { Terminal } = await import("xterm");
      const { FitAddon } = await import("xterm-addon-fit");
      // xterm CSS loaded via global import

      term = new Terminal({
        cursorBlink: true,
        fontSize: 14,
        fontFamily: '"JetBrains Mono", "Fira Code", "Cascadia Code", monospace',
        theme: {
          background: "#0d1117",
          foreground: "#c9d1d9",
          cursor: "#58a6ff",
          black: "#484f58",
          red: "#ff7b72",
          green: "#3fb950",
          yellow: "#d29922",
          blue: "#58a6ff",
          magenta: "#bc8cff",
          cyan: "#39c5cf",
          white: "#b1bac4",
          brightBlack: "#6e7681",
          brightRed: "#ffa198",
          brightGreen: "#56d364",
          brightYellow: "#e3b341",
          brightBlue: "#79c0ff",
          brightMagenta: "#d2a8ff",
          brightCyan: "#56d4dd",
          brightWhite: "#f0f6fc",
        },
        allowProposedApi: true,
      });

      fitAddon = new FitAddon();
      term.loadAddon(fitAddon);
      term.open(containerRef.current!);
      fitAddon.fit();
      termRef.current = term;

      // Welcome banner
      term.writeln("\x1b[1;34m╔══════════════════════════════════════════════════╗\x1b[0m");
      term.writeln("\x1b[1;34m║\x1b[0m  \x1b[1;33m⚡ Solver Linux Terminal\x1b[0m                         \x1b[1;34m║\x1b[0m");
      term.writeln("\x1b[1;34m║\x1b[0m  Learn Linux commands in your browser             \x1b[1;34m║\x1b[0m");
      term.writeln("\x1b[1;34m║\x1b[0m  Type \x1b[1;32mhelp\x1b[0m to see all commands                   \x1b[1;34m║\x1b[0m");
      term.writeln("\x1b[1;34m╚══════════════════════════════════════════════════╝\x1b[0m");

      term.write(buildPrompt(stateRef.current.cwd));

      term.onKey(({ key, domEvent }) => {
        const ev = domEvent;
        const printable = !ev.altKey && !ev.ctrlKey && !ev.metaKey;

        if (ev.key === "Enter") {
          const cmd = inputRef.current;
          term.write("\r\n");
          if (cmd.trim()) {
            histIdxRef.current = -1;
            const { output, newState } = runCommand(stateRef.current, cmd);
            stateRef.current = newState;
            if (output) {
              if (output === "\x1b[2J\x1b[H") {
                term.clear();
              } else {
                // Replace \n with \r\n for terminal display
                term.writeln(output.replace(/\n/g, "\r\n"));
              }
            }
          }
          writePrompt(term);

        } else if (ev.key === "Backspace") {
          if (cursorRef.current > 0) {
            const before = inputRef.current.slice(0, cursorRef.current - 1);
            const after = inputRef.current.slice(cursorRef.current);
            inputRef.current = before + after;
            cursorRef.current--;
            term.write("\b \b");
          }

        } else if (ev.key === "Tab") {
          ev.preventDefault();
          const completions = getCompletions(stateRef.current, inputRef.current);
          if (completions.length === 1) {
            const completed = completions[0];
            // Clear current input
            term.write("\b \b".repeat(inputRef.current.length));
            term.write(completed);
            inputRef.current = completed;
            cursorRef.current = completed.length;
          } else if (completions.length > 1) {
            term.write("\r\n" + completions.join("  ") + "\r\n");
            term.write(buildPrompt(stateRef.current.cwd) + inputRef.current);
          }

        } else if (ev.key === "ArrowUp") {
          const h = stateRef.current.history;
          if (h.length === 0) return;
          const newIdx = Math.min(histIdxRef.current + 1, h.length - 1);
          histIdxRef.current = newIdx;
          const cmd = h[h.length - 1 - newIdx];
          term.write("\b \b".repeat(inputRef.current.length));
          term.write(cmd);
          inputRef.current = cmd;
          cursorRef.current = cmd.length;

        } else if (ev.key === "ArrowDown") {
          if (histIdxRef.current <= 0) {
            histIdxRef.current = -1;
            term.write("\b \b".repeat(inputRef.current.length));
            inputRef.current = "";
            cursorRef.current = 0;
          } else {
            histIdxRef.current--;
            const h = stateRef.current.history;
            const cmd = h[h.length - 1 - histIdxRef.current];
            term.write("\b \b".repeat(inputRef.current.length));
            term.write(cmd);
            inputRef.current = cmd;
            cursorRef.current = cmd.length;
          }

        } else if (ev.ctrlKey && ev.key === "c") {
          term.write("^C");
          writePrompt(term);

        } else if (ev.ctrlKey && ev.key === "l") {
          term.clear();
          term.write(buildPrompt(stateRef.current.cwd));

        } else if (printable) {
          const before = inputRef.current.slice(0, cursorRef.current);
          const after = inputRef.current.slice(cursorRef.current);
          inputRef.current = before + key + after;
          cursorRef.current++;
          term.write(key);
        }
      });

      const handleResize = () => fitAddon.fit();
      window.addEventListener("resize", handleResize);

      return () => {
        window.removeEventListener("resize", handleResize);
        term.dispose();
      };
    })();

    return () => {
      termRef.current?.dispose();
    };
  }, [writePrompt]);

  return (
    <div
      ref={containerRef}
      className="w-full h-full rounded-b-lg overflow-hidden"
      style={{ background: "#0d1117" }}
    />
  );
}
