# Skills

Reusable skills that give AI coding agents deep expertise in specific domains. Each skill is a set of markdown files containing structured knowledge, workflows, and patterns that an agent loads on demand.

Works with any AI coding agent — [Claude Code](https://claude.ai/code), [OpenCode](https://opencode.ai), [GitHub Copilot](https://github.com/features/copilot), [Cursor](https://cursor.com), [Windsurf](https://codeium.com/windsurf), [Codex](https://openai.com/index/codex/), and others.

## Introduction

This repository contains essential skills for day-to-day tasks, including learning. These skills are designed to be small, easy to adapt, and composable, based on decades of engineering experience.

## Skills

| Skill | Description |
|---|---|
| [adaptive-tutor](./adaptive-tutor/) | Elite Adaptive Tutor AI designed to teach ANY concept effectively through a structured teaching loop. |
| [remotion-remocn-video](./remotion-remocn-video/) | Build production-grade programmatic videos with Remotion v4 and remocn components. Covers project setup, scene composition, animation choreography, visual design, and ad narrative structures. |

## Quickstart (30-second setup)

1.  Run the skills.sh installer:

```bash
npx skills@latest add oracleot/skills
```

2.  Pick the skills you want, and which coding agents you want to install them on.
    
3.  Bam - you're ready to go.
    

## Summary of Skills

This repository focuses on skills that address common failure modes in AI-assisted development:

### Learning & Teaching
- **Adaptive Tutor** - Teach any concept effectively through assessment, explanation, Socratic questioning, testing, feedback, adaptation, and reinforcement

### Video Production
- **Remotion** - Create programmatic videos with Remotion v4 and remocn components

## Installation

Install via the [skills.sh](https://skills.sh) CLI — the easiest way to add skills to any agent:

```bash
npx skills add oracleot/skills
```

Or install a single skill:

```bash
npx skills add oracleot/skills/adaptive-tutor
npx skills add oracleot/skills/remotion-remocn-video
```

### Manual installation

If you prefer to install manually, copy the skill folder into your agent's skills directory:

```bash
# OpenCode
cp -r adaptive-tutor/ ~/.agents/skills/
cp -r remotion-remocn-video/ ~/.agents/skills/

# Claude Code
cp -r adaptive-tutor/ ~/.claude/skills/
cp -r remotion-remocn-video/ ~/.claude/skills/

# Cursor / Windsurf / others
# Paste the contents of SKILL.md into your project rules or custom instructions
```

## Structure

Each skill follows the same pattern:

```
skill-name/
  SKILL.md              # Entry point — overview, workflow, quick reference
  topic-a.md            # Deep-dive on a specific topic
  topic-b.md            # Deep-dive on another topic
  ...
```

The agent loads `SKILL.md` first, then pulls in sub-files as needed for the task at hand.

## License

MIT
