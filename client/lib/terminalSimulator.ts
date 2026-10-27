// Virtual Linux terminal simulator — runs entirely in the browser

export type FSNode =
  | { type: "file"; content: string }
  | { type: "dir"; children: Record<string, FSNode> };

export type FS = Record<string, FSNode>;

function buildInitialFS(): FSNode & { type: "dir" } {
  return {
    type: "dir",
    children: {
      home: {
        type: "dir",
        children: {
          user: {
            type: "dir",
            children: {
              projects: { type: "dir", children: {} },
              Documents: {
                type: "dir",
                children: {
                  "readme.txt": {
                    type: "file",
                    content:
                      "Welcome to Solver Terminal!\nThis is a simulated Linux environment for learning.",
                  },
                },
              },
              "hello.sh": {
                type: "file",
                content: '#!/bin/bash\necho "Hello, World!"',
              },
              ".bashrc": {
                type: "file",
                content:
                  '# .bashrc\nexport PATH="$HOME/bin:$PATH"\nalias ll="ls -la"',
              },
            },
          },
        },
      },
      etc: {
        type: "dir",
        children: {
          "os-release": {
            type: "file",
            content:
              'NAME="Solver Linux"\nVERSION="1.0"\nID=solver\nPRETTY_NAME="Solver Linux 1.0"',
          },
          hostname: { type: "file", content: "solver-terminal" },
        },
      },
      tmp: { type: "dir", children: {} },
      var: {
        type: "dir",
        children: {
          log: {
            type: "dir",
            children: {
              "system.log": {
                type: "file",
                content: "Oct 27 10:00:01 solver-terminal kernel: System started",
              },
            },
          },
        },
      },
    },
  };
}

export interface TerminalState {
  fs: FSNode & { type: "dir" };
  cwd: string[]; // path segments, e.g. ["home","user"]
  history: string[];
  historyIdx: number;
  env: Record<string, string>;
}

export function createState(): TerminalState {
  return {
    fs: buildInitialFS(),
    cwd: ["home", "user"],
    history: [],
    historyIdx: -1,
    env: {
      USER: "user",
      HOME: "/home/user",
      SHELL: "/bin/bash",
      TERM: "xterm-256color",
      PATH: "/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin",
    },
  };
}

// Navigate the virtual FS to a path
function getNode(
  root: FSNode & { type: "dir" },
  parts: string[]
): FSNode | null {
  let cur: FSNode = root;
  for (const p of parts) {
    if (cur.type !== "dir") return null;
    if (!(p in cur.children)) return null;
    cur = cur.children[p];
  }
  return cur;
}

function cwdString(cwd: string[]): string {
  return cwd.length === 0 ? "/" : "/" + cwd.join("/");
}

function resolvePath(state: TerminalState, input: string): string[] {
  if (!input || input === "~") return ["home", "user"];
  const parts = input.startsWith("/")
    ? input.split("/").filter(Boolean)
    : [...state.cwd, ...input.split("/").filter(Boolean)];

  const resolved: string[] = [];
  for (const p of parts) {
    if (p === ".") continue;
    else if (p === "..") {
      if (resolved.length > 0) resolved.pop();
    } else {
      resolved.push(p);
    }
  }
  return resolved;
}

const MAN_PAGES: Record<string, string> = {
  ls: `LS(1)                    User Commands                    LS(1)

NAME
       ls - list directory contents

SYNOPSIS
       ls [OPTION]... [FILE]...

DESCRIPTION
       List information about the FILEs (the current directory by default).

       -a     do not ignore entries starting with .
       -l     use a long listing format
       -h     with -l, print sizes like 1K 234M 2G`,

  cd: `CD(1)                    User Commands                    CD(1)

NAME
       cd - change directory

SYNOPSIS
       cd [DIR]

DESCRIPTION
       Change the shell working directory to DIR.
       Use 'cd -' to go to the previous directory.
       Use 'cd ~' or 'cd' to go to home directory.`,

  cat: `CAT(1)                   User Commands                    CAT(1)

NAME
       cat - concatenate files and print on the standard output

SYNOPSIS
       cat [OPTION]... [FILE]...

DESCRIPTION
       Concatenate FILE(s) to standard output.
       With no FILE, or when FILE is -, read standard input.`,

  grep: `GREP(1)                  User Commands                   GREP(1)

NAME
       grep - print lines that match patterns

SYNOPSIS
       grep [OPTION]... PATTERN [FILE]...

DESCRIPTION
       Searches for PATTERN in each FILE.

       -i     ignore case distinctions in patterns and data
       -r     read all files under each directory, recursively
       -n     print line number with output lines
       -v     select non-matching lines`,

  mkdir: `MKDIR(1)                 User Commands                   MKDIR(1)

NAME
       mkdir - make directories

SYNOPSIS
       mkdir [OPTION]... DIRECTORY...

DESCRIPTION
       Create the DIRECTORY(ies), if they do not already exist.

       -p     no error if existing, make parent directories as needed`,

  rm: `RM(1)                    User Commands                    RM(1)

NAME
       rm - remove files or directories

SYNOPSIS
       rm [OPTION]... [FILE]...

DESCRIPTION
       Remove (unlink) the FILE(s).

       -r, -R     remove directories and their contents recursively
       -f         ignore nonexistent files, never prompt`,

  echo: `ECHO(1)                  User Commands                   ECHO(1)

NAME
       echo - display a line of text

SYNOPSIS
       echo [SHORT-OPTION]... [STRING]...

DESCRIPTION
       Echo the STRING(s) to standard output.

       -n     do not output the trailing newline`,

  pwd: `PWD(1)                   User Commands                    PWD(1)

NAME
       pwd - print name of current/working directory

SYNOPSIS
       pwd`,

  touch: `TOUCH(1)                 User Commands                  TOUCH(1)

NAME
       touch - change file timestamps / create empty files

SYNOPSIS
       touch [OPTION]... FILE...

DESCRIPTION
       Update the access and modification times of each FILE.
       If FILE does not exist, create it as an empty file.`,
};

export function runCommand(
  state: TerminalState,
  raw: string
): { output: string; newState: TerminalState } {
  const trimmed = raw.trim();
  if (!trimmed) return { output: "", newState: state };

  // Handle >> and > redirects simply
  let cmd = trimmed;
  let redirectFile: string | null = null;
  let redirectAppend = false;

  const appendMatch = trimmed.match(/^([\s\S]*?)>>([\s\S]*?)$/);
  const writeMatch = trimmed.match(/^([\s\S]*?)>([\s\S]*?)$/);
  if (appendMatch) {
    cmd = appendMatch[1].trim();
    redirectFile = appendMatch[2].trim();
    redirectAppend = true;
  } else if (writeMatch) {
    cmd = writeMatch[1].trim();
    redirectFile = writeMatch[2].trim();
  }

  const tokens = cmd.split(/\s+/).filter(Boolean);
  if (tokens.length === 0) return { output: "", newState: state };

  const [command, ...args] = tokens;
  let ns: TerminalState = { ...state, history: [...state.history, raw] };
  let output = "";

  switch (command) {
    case "pwd": {
      output = cwdString(ns.cwd);
      break;
    }

    case "cd": {
      const target = args[0];
      if (!target || target === "~") {
        ns = { ...ns, cwd: ["home", "user"] };
      } else if (target === "-") {
        output = "cd: OLDPWD not set";
      } else {
        const parts = resolvePath(ns, target);
        const node = getNode(ns.fs, parts);
        if (!node) {
          output = `bash: cd: ${target}: No such file or directory`;
        } else if (node.type !== "dir") {
          output = `bash: cd: ${target}: Not a directory`;
        } else {
          ns = { ...ns, cwd: parts };
        }
      }
      break;
    }

    case "ls": {
      const hasA = args.includes("-a") || args.includes("-la") || args.includes("-al");
      const hasL = args.includes("-l") || args.includes("-la") || args.includes("-al");
      const pathArg = args.find((a) => !a.startsWith("-"));
      const parts = pathArg ? resolvePath(ns, pathArg) : ns.cwd;
      const node = getNode(ns.fs, parts);

      if (!node) {
        output = `ls: cannot access '${pathArg}': No such file or directory`;
      } else if (node.type === "file") {
        output = pathArg || cwdString(ns.cwd);
      } else {
        let entries = Object.entries(node.children);
        if (!hasA) entries = entries.filter(([k]) => !k.startsWith("."));
        if (hasL) {
          const lines = entries.map(([name, n]) => {
            const type = n.type === "dir" ? "d" : "-";
            const size =
              n.type === "file" ? String(n.content.length).padStart(6) : "  4096";
            const color = n.type === "dir" ? `\x1b[34m${name}\x1b[0m` : name;
            return `${type}rwxr-xr-x 1 user user ${size} Oct 27 10:00 ${color}`;
          });
          output = lines.join("\n");
        } else {
          const colored = entries.map(([name, n]) =>
            n.type === "dir" ? `\x1b[34m${name}\x1b[0m` : name
          );
          output = colored.join("  ");
        }
      }
      break;
    }

    case "cat": {
      if (args.length === 0) {
        output = "cat: missing operand";
        break;
      }
      const lines: string[] = [];
      for (const arg of args) {
        const parts = resolvePath(ns, arg);
        const node = getNode(ns.fs, parts);
        if (!node) {
          lines.push(`cat: ${arg}: No such file or directory`);
        } else if (node.type === "dir") {
          lines.push(`cat: ${arg}: Is a directory`);
        } else {
          lines.push(node.content);
        }
      }
      output = lines.join("\n");
      break;
    }

    case "echo": {
      const text = args
        .join(" ")
        .replace(/\$(\w+)/g, (_, k) => ns.env[k] ?? "");
      output = text;
      break;
    }

    case "mkdir": {
      const hasP = args.includes("-p");
      const targets = args.filter((a) => !a.startsWith("-"));
      for (const t of targets) {
        const parts = resolvePath(ns, t);
        if (parts.length === 0) { output = `mkdir: cannot create directory '/': File exists`; continue; }
        const parent = parts.slice(0, -1);
        const name = parts[parts.length - 1];
        const parentNode = getNode(ns.fs, parent);
        if (!parentNode || parentNode.type !== "dir") {
          if (!hasP) output = `mkdir: cannot create directory '${t}': No such file or directory`;
          continue;
        }
        if (name in parentNode.children) {
          if (!hasP) output = `mkdir: cannot create directory '${t}': File exists`;
          continue;
        }
        parentNode.children[name] = { type: "dir", children: {} };
      }
      break;
    }

    case "touch": {
      for (const t of args) {
        const parts = resolvePath(ns, t);
        if (parts.length === 0) { output = `touch: cannot touch '/': Is a directory`; continue; }
        const parent = parts.slice(0, -1);
        const name = parts[parts.length - 1];
        const parentNode = getNode(ns.fs, parent);
        if (!parentNode || parentNode.type !== "dir") {
          output = `touch: cannot touch '${t}': No such file or directory`;
          continue;
        }
        if (!(name in parentNode.children)) {
          parentNode.children[name] = { type: "file", content: "" };
        }
      }
      break;
    }

    case "rm": {
      const hasR = args.some((a) => a === "-r" || a === "-rf" || a === "-R" || a.includes("r"));
      const targets = args.filter((a) => !a.startsWith("-"));
      for (const t of targets) {
        const parts = resolvePath(ns, t);
        if (parts.length === 0) { output = `rm: it is dangerous to operate recursively on '/'`; continue; }
        const parent = parts.slice(0, -1);
        const name = parts[parts.length - 1];
        const parentNode = getNode(ns.fs, parent);
        if (!parentNode || parentNode.type !== "dir" || !(name in parentNode.children)) {
          output = `rm: cannot remove '${t}': No such file or directory`;
          continue;
        }
        const target = parentNode.children[name];
        if (target.type === "dir" && !hasR) {
          output = `rm: cannot remove '${t}': Is a directory`;
          continue;
        }
        delete parentNode.children[name];
      }
      break;
    }

    case "mv": {
      if (args.length < 2) { output = "mv: missing destination file operand"; break; }
      const [src, dest] = [args[0], args[1]];
      const srcParts = resolvePath(ns, src);
      const srcParent = srcParts.slice(0, -1);
      const srcName = srcParts[srcParts.length - 1];
      const srcParentNode = getNode(ns.fs, srcParent) as FSNode & { type: "dir" } | null;
      if (!srcParentNode || srcParentNode.type !== "dir" || !(srcName in srcParentNode.children)) {
        output = `mv: cannot stat '${src}': No such file or directory`;
        break;
      }
      const node = srcParentNode.children[srcName];
      const destParts = resolvePath(ns, dest);
      const destParent = destParts.slice(0, -1);
      const destName = destParts[destParts.length - 1];
      const destParentNode = getNode(ns.fs, destParent) as (FSNode & { type: "dir" }) | null;
      if (!destParentNode || destParentNode.type !== "dir") {
        output = `mv: cannot move '${src}' to '${dest}': No such file or directory`;
        break;
      }
      destParentNode.children[destName] = node;
      delete srcParentNode.children[srcName];
      break;
    }

    case "cp": {
      if (args.length < 2) { output = "cp: missing destination file operand"; break; }
      const [src, dest] = [args[0], args[1]];
      const srcParts = resolvePath(ns, src);
      const srcNode = getNode(ns.fs, srcParts);
      if (!srcNode) { output = `cp: cannot stat '${src}': No such file or directory`; break; }
      if (srcNode.type === "dir") { output = `cp: omitting directory '${src}'`; break; }
      const destParts = resolvePath(ns, dest);
      const destParent = destParts.slice(0, -1);
      const destName = destParts[destParts.length - 1];
      const destParentNode = getNode(ns.fs, destParent) as (FSNode & { type: "dir" }) | null;
      if (!destParentNode || destParentNode.type !== "dir") {
        output = `cp: cannot create regular file '${dest}': No such file or directory`;
        break;
      }
      destParentNode.children[destName] = { type: "file", content: srcNode.content };
      break;
    }

    case "grep": {
      const hasN = args.includes("-n");
      const hasI = args.includes("-i");
      const hasV = args.includes("-v");
      const cleaned = args.filter((a) => !a.startsWith("-"));
      if (cleaned.length < 2) { output = "Usage: grep [options] PATTERN FILE"; break; }
      const [pattern, ...files] = cleaned;
      const regex = new RegExp(pattern, hasI ? "i" : "");
      const results: string[] = [];
      for (const f of files) {
        const parts = resolvePath(ns, f);
        const node = getNode(ns.fs, parts);
        if (!node || node.type !== "file") { results.push(`grep: ${f}: No such file or directory`); continue; }
        node.content.split("\n").forEach((line, i) => {
          const match = regex.test(line);
          if ((!hasV && match) || (hasV && !match)) {
            results.push(hasN ? `${i + 1}:${line}` : line);
          }
        });
      }
      output = results.join("\n");
      break;
    }

    case "wc": {
      if (args.length === 0) { output = "wc: missing operand"; break; }
      const target = args[args.length - 1];
      const parts = resolvePath(ns, target);
      const node = getNode(ns.fs, parts);
      if (!node || node.type !== "file") { output = `wc: ${target}: No such file or directory`; break; }
      const lines = node.content.split("\n").length;
      const words = node.content.split(/\s+/).filter(Boolean).length;
      const bytes = node.content.length;
      output = `${String(lines).padStart(4)} ${String(words).padStart(4)} ${String(bytes).padStart(4)} ${target}`;
      break;
    }

    case "head": {
      const nIdx = args.indexOf("-n");
      const n = nIdx !== -1 ? parseInt(args[nIdx + 1]) || 10 : 10;
      const file = args.find((a) => !a.startsWith("-") && !/^\d+$/.test(a));
      if (!file) { output = "head: missing operand"; break; }
      const parts = resolvePath(ns, file);
      const node = getNode(ns.fs, parts);
      if (!node || node.type !== "file") { output = `head: cannot open '${file}': No such file or directory`; break; }
      output = node.content.split("\n").slice(0, n).join("\n");
      break;
    }

    case "tail": {
      const nIdx = args.indexOf("-n");
      const n = nIdx !== -1 ? parseInt(args[nIdx + 1]) || 10 : 10;
      const file = args.find((a) => !a.startsWith("-") && !/^\d+$/.test(a));
      if (!file) { output = "tail: missing operand"; break; }
      const parts = resolvePath(ns, file);
      const node = getNode(ns.fs, parts);
      if (!node || node.type !== "file") { output = `tail: cannot open '${file}': No such file or directory`; break; }
      output = node.content.split("\n").slice(-n).join("\n");
      break;
    }

    case "sort": {
      const file = args.find((a) => !a.startsWith("-"));
      if (!file) { output = "sort: missing operand"; break; }
      const parts = resolvePath(ns, file);
      const node = getNode(ns.fs, parts);
      if (!node || node.type !== "file") { output = `sort: cannot read: ${file}: No such file or directory`; break; }
      output = node.content.split("\n").sort().join("\n");
      break;
    }

    case "whoami": {
      output = ns.env.USER;
      break;
    }

    case "uname": {
      if (args.includes("-a")) {
        output = "Linux solver-terminal 5.15.0-solver #1 SMP Solver Linux x86_64 GNU/Linux";
      } else {
        output = "Linux";
      }
      break;
    }

    case "date": {
      output = new Date().toString();
      break;
    }

    case "uptime": {
      output = " 10:00:01 up 1 day,  2:30,  1 user,  load average: 0.01, 0.05, 0.03";
      break;
    }

    case "history": {
      output = ns.history
        .map((cmd, i) => `  ${String(i + 1).padStart(3)}  ${cmd}`)
        .join("\n");
      break;
    }

    case "env": {
      output = Object.entries(ns.env)
        .map(([k, v]) => `${k}=${v}`)
        .join("\n");
      break;
    }

    case "export": {
      for (const arg of args) {
        const [k, v] = arg.split("=");
        if (k && v !== undefined) ns.env[k] = v;
      }
      break;
    }

    case "clear": {
      output = "\x1b[2J\x1b[H";
      break;
    }

    case "man": {
      const topic = args[0];
      if (!topic) { output = "What manual page do you want?"; break; }
      if (topic in MAN_PAGES) {
        output = MAN_PAGES[topic];
      } else {
        output = `No manual entry for ${topic}`;
      }
      break;
    }

    case "help": {
      output = `\x1b[1;33mSolver Linux Terminal — Available Commands\x1b[0m

\x1b[1mNavigation:\x1b[0m
  pwd           Print working directory
  cd [dir]      Change directory
  ls [-al] [dir] List directory contents

\x1b[1mFile Operations:\x1b[0m
  cat [file]    Print file contents
  touch [file]  Create empty file
  mkdir [-p] [dir] Create directory
  rm [-r] [file] Remove file/directory
  mv [src] [dst] Move/rename
  cp [src] [dst] Copy file

\x1b[1mText Processing:\x1b[0m
  echo [text]   Print text
  grep [-inv] PATTERN FILE  Search in file
  wc [file]     Word/line/byte count
  head [-n N] [file]  First N lines
  tail [-n N] [file]  Last N lines
  sort [file]   Sort lines

\x1b[1mSystem Info:\x1b[0m
  whoami        Current user
  uname [-a]    System info
  date          Current date/time
  uptime        System uptime
  env           Environment variables
  export K=V    Set environment variable
  history       Command history

\x1b[1mOther:\x1b[0m
  man [cmd]     Manual page
  clear         Clear screen
  help          This help message

\x1b[1;32mTip:\x1b[0m Use Tab for autocomplete, ↑↓ for history`;
      break;
    }

    default: {
      output = `bash: ${command}: command not found\nType \x1b[33mhelp\x1b[0m to see available commands.`;
      break;
    }
  }

  // Handle redirect
  if (redirectFile && command !== "cd") {
    const parts = resolvePath(ns, redirectFile);
    if (parts.length > 0) {
      const parent = parts.slice(0, -1);
      const name = parts[parts.length - 1];
      const parentNode = getNode(ns.fs, parent);
      if (parentNode && parentNode.type === "dir") {
        const existing = parentNode.children[name];
        const prev = existing && existing.type === "file" && redirectAppend ? existing.content + "\n" : "";
        parentNode.children[name] = { type: "file", content: prev + output };
        output = "";
      }
    }
  }

  return { output, newState: ns };
}

export function getCompletions(state: TerminalState, partial: string): string[] {
  const parts = partial.split(" ");
  if (parts.length === 1) {
    const cmds = ["pwd","cd","ls","cat","touch","mkdir","rm","mv","cp","echo","grep","wc","head","tail","sort","whoami","uname","date","uptime","env","export","history","man","clear","help"];
    return cmds.filter((c) => c.startsWith(parts[0]));
  }
  // Complete file/dir names
  const last = parts[parts.length - 1];
  const pathParts = last.split("/");
  const prefix = pathParts.pop() ?? "";
  const dirPath = pathParts.join("/");
  const dirNode = getNode(state.fs, resolvePath(state, dirPath || "."));
  if (!dirNode || dirNode.type !== "dir") return [];
  return Object.keys(dirNode.children)
    .filter((k) => k.startsWith(prefix))
    .map((k) => {
      const base = parts.slice(0, -1).join(" ");
      const sep = dirPath ? dirPath + "/" : "";
      return (base ? base + " " : "") + sep + k;
    });
}
