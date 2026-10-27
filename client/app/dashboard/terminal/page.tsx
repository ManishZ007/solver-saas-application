"use client";

import dynamic from "next/dynamic";
import { Terminal, BookOpen, Zap } from "lucide-react";

const TerminalWindow = dynamic(
  () => import("@/components/terminal/TerminalWindow"),
  { ssr: false, loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-[#0d1117] rounded-b-lg">
      <div className="flex items-center gap-2 text-green-400 text-sm animate-pulse">
        <Terminal className="w-4 h-4" />
        Initializing terminal...
      </div>
    </div>
  )}
);

const CHEATSHEET = [
  { cmd: "ls -la", desc: "List all files with details" },
  { cmd: "cd ~", desc: "Go to home directory" },
  { cmd: "mkdir -p a/b/c", desc: "Create nested directories" },
  { cmd: "cat file.txt", desc: "Read file contents" },
  { cmd: "grep -n pattern file", desc: "Search with line numbers" },
  { cmd: "echo $HOME", desc: "Print env variable" },
  { cmd: "echo hi > file.txt", desc: "Write text to file" },
  { cmd: "echo more >> file.txt", desc: "Append text to file" },
  { cmd: "wc file.txt", desc: "Count words/lines/bytes" },
  { cmd: "head -n 5 file", desc: "Show first 5 lines" },
];

export default function TerminalPage() {
  return (
    <div className="flex flex-col lg:flex-row gap-4 h-[calc(100vh-5rem)]">
      {/* Terminal panel */}
      <div className="flex-1 flex flex-col min-h-[500px] lg:min-h-0">
        {/* Title bar */}
        <div className="flex items-center gap-2 bg-[#161b22] border border-[#30363d] rounded-t-lg px-4 py-2">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
            <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
            <div className="w-3 h-3 rounded-full bg-[#28c840]" />
          </div>
          <span className="ml-2 text-xs text-[#8b949e] font-mono">
            user@solver — bash
          </span>
          <div className="ml-auto flex items-center gap-1 text-xs text-[#8b949e]">
            <Zap className="w-3 h-3 text-yellow-400" />
            Solver Linux Terminal
          </div>
        </div>

        {/* xterm.js container */}
        <div className="flex-1 border border-t-0 border-[#30363d] rounded-b-lg overflow-hidden">
          <TerminalWindow />
        </div>
      </div>

      {/* Sidebar: cheatsheet + tips */}
      <div className="lg:w-72 flex flex-col gap-3 overflow-y-auto">
        <div className="border rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <BookOpen className="w-4 h-4 text-blue-500" />
            <h2 className="font-semibold text-sm">Quick Cheatsheet</h2>
          </div>
          <div className="flex flex-col gap-1.5">
            {CHEATSHEET.map(({ cmd, desc }) => (
              <div key={cmd} className="group">
                <code className="text-xs text-green-500 font-mono bg-muted px-1.5 py-0.5 rounded">
                  {cmd}
                </code>
                <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="border rounded-lg p-4">
          <h2 className="font-semibold text-sm mb-3">Keyboard Shortcuts</h2>
          <div className="flex flex-col gap-2 text-xs">
            {[
              ["↑ / ↓", "Navigate history"],
              ["Tab", "Autocomplete"],
              ["Ctrl + C", "Cancel command"],
              ["Ctrl + L", "Clear screen"],
            ].map(([key, desc]) => (
              <div key={key} className="flex items-center justify-between">
                <kbd className="bg-muted border rounded px-1.5 py-0.5 font-mono text-xs">
                  {key}
                </kbd>
                <span className="text-muted-foreground">{desc}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="border rounded-lg p-4 bg-blue-500/5 border-blue-500/20">
          <h2 className="font-semibold text-sm mb-2 text-blue-500">Try this exercise</h2>
          <ol className="text-xs text-muted-foreground flex flex-col gap-1 list-decimal pl-4">
            <li>Create a folder: <code className="text-green-500">mkdir myproject</code></li>
            <li>Go into it: <code className="text-green-500">cd myproject</code></li>
            <li>Create a file: <code className="text-green-500">touch app.js</code></li>
            <li>Write to it: <code className="text-green-500">echo "console.log('hi')" &gt; app.js</code></li>
            <li>Read it back: <code className="text-green-500">cat app.js</code></li>
          </ol>
        </div>
      </div>
    </div>
  );
}
