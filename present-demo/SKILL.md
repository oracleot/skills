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

## Resolve the demo target

Favour a verified production URL for live demos unless the user explicitly requests local, preview, staging, or another environment.

Use this precedence:

1. A URL explicitly supplied by the user
2. The product's verified production URL
3. A verified hosted preview or staging URL when production is unsuitable
4. A local development URL only when requested, when no hosted environment exists, or when the feature cannot safely be demonstrated elsewhere

Discover candidate URLs from deployment configuration, repository documentation, hosting metadata, and existing demo configuration. Verify the selected URL is reachable and record redirects, authentication requirements, and the final route before building the Electron browser. Do not silently default to localhost merely because the source repository is local.

When the demonstrated workflow mutates production data, confirm that a designated demo account and safe demo data exist. Otherwise choose a read-only path, use an approved non-production environment, or ask the user for direction. Never use real customer, patient, or other sensitive records for a live demonstration.

Store the selected URL as configurable demo state rather than embedding it throughout the implementation. The default may come from the runbook or configuration, but the audience browser URL must remain editable by the user.

## Create the canonical runbook

Write the runbook before building presentation UI. Organize it around a realistic user goal and outcome—not a feature inventory. Prefer a reliable 3–5 minute happy path with a small number of meaningful transitions. Add deeper-dive steps only when useful, and keep them out of the default audience flow.

The runbook is the single content model for the opening, demo chapters, closing, and presenter notes. Read [references/runbook-and-experience.md](references/runbook-and-experience.md) before authoring it or implementing either window.

## Choose and preserve the output location

If the user supplied a path, use it. Otherwise inspect the repository structure and applicable `.gitignore` files. Prefer a clearly appropriate existing ignored location for generated or local tooling.

If no appropriate ignored location exists, stop before writing the demo and ask the user to choose a path. Suggest a narrow option such as `.demo/` and explicitly ask whether it may be added to `.gitignore`. Never silently modify ignore rules.

When a demo already exists, update it in place. Preserve its output path, working browser integration, and useful customizations. Avoid version-suffixed copies and broad regeneration.

## Build the Electron experience

Keep generated files isolated inside the chosen demo directory and avoid production-code changes unless integration genuinely requires them. Follow the target repository's language, package-manager, and tooling conventions when practical; otherwise use a small, understandable Electron application without unnecessary abstraction.

Build two coordinated surfaces:

1. An audience window with a minimal opening, lightweight chapter context, the live product as the dominant surface, and a simple closing.
2. A separate private Presenter Notes `BrowserWindow` with the current runbook details, prompt copying, and presentation controls.

Maintain one main-process source of truth for the current presentation step and synchronize both renderers through narrow Electron IPC. Keep presentation state separate from product/browser state so chapter changes do not reset the product session.

Choose an Electron-native browser surface based on the product's authentication, cookies, redirects, local environment, navigation, and security constraints. Do not assume an iframe works. Preserve session state across relevant chapters.

Make the audience surface look and behave like an integrated browser rather than merely an embedded webpage. During product chapters, show browser chrome with Back, Forward, Reload, an editable URL field, and a concise Loading, Live, or Offline state. Include an explicit opening action such as `Open live product` so entering the browser is discoverable without relying only on presentation arrows.

Read [references/electron-and-validation.md](references/electron-and-validation.md) before selecting the browser integration, IPC boundary, window behavior, output structure, or test approach.

## Complete the work

Provide concise run instructions inside the generated directory. Install dependencies only when authorized and needed. Copy and adapt [scripts/runtime-smoke.cjs](scripts/runtime-smoke.cjs) into the generated demo, preserve its stable test hooks, and run it against the built application. Validate observable behavior in proportion to the environment available; do not claim that the live product flow works if it could not be exercised.

Report:

- The generated or updated demo path
- The primary narrative and approximate duration
- What was validated and how
- Any untested product dependency, assumption, or manual setup step
- Whether the directory is ignored and whether `.gitignore` changed
