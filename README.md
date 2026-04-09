# Agent Skills

Reusable skills that give AI coding agents deep expertise in specific domains. Each skill is a set of markdown files containing structured knowledge, workflows, and patterns that an agent loads on demand.

Works with any AI agent that supports custom instructions or skill files — [OpenCode](https://opencode.ai), [Claude Code](https://docs.anthropic.com/en/docs/claude-code), [GitHub Copilot](https://github.com/features/copilot), [Cursor](https://cursor.com), [Windsurf](https://windsurf.com), [Codex](https://openai.com/index/codex/), and others.

## Skills

| Skill | Description |
|---|---|
| [remotion-remocn-video](./remotion-remocn-video/) | Build production-grade programmatic videos with Remotion v4 and remocn components. Covers project setup, scene composition, animation choreography, visual design, and ad narrative structures. |

## How to Use

Each skill has a `SKILL.md` entry point and optional sub-files for deep-dive topics. You can use them in several ways:

### Copy into your project

Drop the skill folder into your project's agent configuration directory:

```bash
# OpenCode
cp -r remotion-remocn-video/ ~/.agents/skills/

# Claude Code
cp -r remotion-remocn-video/ ~/.claude/skills/

# Cursor / Windsurf
# Paste SKILL.md contents into your project's rules or instructions file
```

### Reference directly

Point your agent to the raw file URL:

```
https://raw.githubusercontent.com/oracleot/agent-skills/main/remotion-remocn-video/SKILL.md
```

### Include in system prompts

Copy the contents of `SKILL.md` (and any sub-files you need) into your agent's system prompt or custom instructions.

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
