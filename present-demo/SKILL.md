---
name: present-demo
description: Investigate an implemented product feature and generate or update a polished Electron live-demo application with a reliable story-led runbook, an audience-facing product view, private synchronized presenter notes, product-aware styling, and validation. Use when the user invokes /present-demo or asks to create, prepare, build, or refresh an interactive live product demo for a feature in an existing codebase. Do not use for prerecorded product videos, static slide decks, or product features that have not been implemented.
---

# Present Demo

Build a live product demonstration system around a feature that already exists. The product experience is the main content; presentation chrome exists only to guide the story and presenter.

## Interpret the request

Treat text following `/present-demo` as the target feature or workflow. Use the current repository unless the user identifies another codebase.

Generate the demo when asked to build or prepare it. If the user asks only for a plan, critique, or runbook, produce only that requested artifact.

## Investigate before generating

Use the codebase as the source of truth. Locate and understand:

- How users enter the feature and the workflow they follow
- Routes, screens, interactions, state transitions, inputs, outputs, and data dependencies
- Loading, empty, success, and error states
- Product terminology, likely failures, reliable recovery paths, and realistic example inputs
- The application shell, typography, tokens, layout, components, icons, themes, and brand assets

Trace behavior far enough to distinguish implemented capabilities from names, mockups, dead code, or aspirational documentation. Do not invent unsupported behavior. Where evidence is ambiguous, choose the smallest conservative path likely to work live and state any material assumption.

Inspect the product's visual language before designing the Electron shell. Reuse a confidently identified repository logo or product mark where appropriate; otherwise use restrained neutral presentation styling. Keep branding subtle and do not imitate or redraw uncertain assets.

Read [references/theme-adaptation.md](references/theme-adaptation.md) before deriving demo styling. The audience must recognize the demo as belonging to the product without the presentation chrome competing with it.

## Complete the setup checkpoint

After investigation and before writing the runbook or generating files, get these three inputs from the user:

- **Audience:** who will watch. Use their roles, familiarity, and likely interests to set the tone, vocabulary, and technical depth.
- **Duration:** the live-demo runtime in minutes, excluding introductions, Q&A, and discussion. Use it to size and pace the primary narrative.
- **Demo environment:** the exact environment and HTTP or HTTPS URL the integrated browser should open.

Always ask the user to select and confirm the demo environment during this checkpoint. Never infer, choose, or default to production, preview, staging, localhost, or a URL discovered in the repository. Candidate URLs discovered during investigation may be presented as options, but discovery is not authorization to select one.

Do not proceed until all three inputs are explicit. If the user supplied audience or duration earlier, restate the interpreted value for confirmation alongside the required environment question. Treat the supplied duration only as demo runtime.

After the user chooses the environment, verify that exact URL is reachable and record redirects and the final route. The presentation app only provides the integrated browser; do not request credentials, prepare or inspect demo data, log in, seed state, or perform the product workflow. The user controls the browser session and product interaction.

Store the confirmed URL as configurable demo state rather than embedding it throughout the implementation. The audience browser URL must remain editable by the user.

## Create the canonical runbook

Write the runbook before building presentation UI. Organize it around a realistic user goal and outcome—not a feature inventory. Let the confirmed audience determine tone and technical depth. Let the confirmed demo-only duration determine the number of chapters, the granularity of the breakdown, and the time allocated to each transition. Longer demos should add meaningful narrative breakdown or relevant depth, not filler.

The runbook is the single content model for the opening, demo chapters, closing, and presenter notes. Read [references/runbook-and-experience.md](references/runbook-and-experience.md) before authoring it or implementing either window.

## Adapt the canonical demo shell

Start new generated demos by copying the complete [`templates/electron-live-demo/`](templates/electron-live-demo/) shell into the approved output directory. It is the shared implementation foundation, not a visual mandate. Do not regenerate its Electron architecture. Adapt only the documented extension points:

- `src/shared/runbook.cjs` for the verified narrative and presenter content
- `src/shared/demo-theme.cjs` for product-specific visual tokens supported by repository evidence
- the configured initial target URL and narrowly reviewed product navigation/permission requirements in `src/main.cjs`

Preserve the two-window model, main-process presentation state, `WebContentsView` lifetime, named session, narrow preload API, IPC validation, browser controls, and all `data-demo-*` smoke-test hooks. Do not turn product chapters into slides or replace the integrated browser with an iframe just for styling.

For an existing demo, preserve useful customizations and update it in place. Migrate toward the canonical contracts only where that can be done safely without breaking a known-working product integration.

## Choose and preserve the output location

If the user supplied a path, use it. Otherwise inspect the repository structure and applicable `.gitignore` files. Prefer a clearly appropriate existing ignored location for generated or local tooling.

If no appropriate ignored location exists, stop before writing the demo and ask the user to choose a path. Suggest a narrow option such as `.demo/` and explicitly ask whether it may be added to `.gitignore`. Never silently modify ignore rules.

When a demo already exists, update it in place. Preserve its output path, working browser integration, and useful customizations. Avoid version-suffixed copies and broad regeneration.

## Build the Electron experience

Keep generated files isolated inside the chosen demo directory and avoid production-code changes unless integration genuinely requires them. Follow the target repository's language, package-manager, and tooling conventions when practical; otherwise adapt the canonical template instead of regenerating Electron infrastructure.

Build two coordinated surfaces:

1. An audience window with a minimal opening, lightweight chapter context, the live product as the dominant surface, and a simple closing.
2. A separate private Presenter Notes `BrowserWindow` with the current runbook details, prompt copying, and presentation controls.

Maintain one main-process source of truth for the current presentation step and synchronize both renderers through narrow Electron IPC. Keep presentation state separate from product/browser state so chapter changes do not reset the product session.

Choose an Electron-native browser surface based on the product's authentication, cookies, redirects, local environment, navigation, and security constraints. Do not assume an iframe works. Preserve session state across relevant chapters.

Make the audience surface look and behave like an integrated browser rather than merely an embedded webpage. During product chapters, show browser chrome with Back, Forward, Reload, an editable URL field, and a concise Loading, Live, or Offline state. Include an explicit opening action such as `Open live product` so entering the browser is discoverable without relying only on presentation arrows.

Read [references/electron-and-validation.md](references/electron-and-validation.md) before selecting the browser integration, IPC boundary, window behavior, output structure, or test approach.

## Complete the work

Provide concise run instructions inside the generated directory. Install dependencies only when authorized and needed. Copy and adapt [scripts/runtime-smoke.cjs](scripts/runtime-smoke.cjs) into the generated demo, preserve its stable test hooks, and run it against the built application. Validate the Electron shell without operating the product workflow or requiring product credentials.

After validation, always launch the completed Electron demo and leave it open for the user. Do not finish by merely reporting a launch command. If launching is genuinely impossible because GUI access or required authorization is unavailable, report the exact blocker and the launch command; never imply that the app was launched.

Report:

- The generated or updated demo path
- The primary narrative and approximate duration
- What was validated and how
- Whether the completed demo was launched, or the exact blocker if it could not be
- Any untested shell dependency, assumption, or manual setup step
- Whether the directory is ignored and whether `.gitignore` changed
