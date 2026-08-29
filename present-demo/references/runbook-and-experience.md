# Runbook and Experience

Use this reference when creating the runbook or either presentation surface.

## Narrative design

Select the smallest implemented workflow that demonstrates a meaningful outcome. Useful story shapes include:

- Question → Answer → Investigate → Segment → Visualise → Refine → Save
- Discover → Configure → Execute → Review → Share

Reliability and narrative clarity outrank feature density. Prefer realistic actions, clear transitions, and stable visible waypoints supported by the implementation. The runbook guides the presenter; the user remains responsible for credentials, browser state, and product interaction.

## Audience and duration

Design for the audience confirmed during setup:

- For executives or business stakeholders, emphasize outcomes, decisions, and visible value; keep implementation detail in optional notes.
- For product or operational audiences, emphasize workflow, usability, and the before/after experience.
- For technical audiences, use precise product and implementation language where the codebase supports it, while keeping the live product central.
- For mixed audiences, lead with value and layer technical detail into presenter notes or optional deeper dives.

Treat the confirmed duration as live-demo runtime only, excluding introductions, Q&A, and discussion. Reserve a short opening and closing, then divide the remaining time into chapters with enough room for real browser interaction. As a planning guide, allow roughly 45–90 seconds per primary chapter: a short demo may need only two or three chapters, while a longer demo should use more chapters and finer narrative breakdown. Do not pad a longer runtime with decorative slides or unsupported features.

Record the target total and an estimated duration for each primary chapter. The estimates should sum to approximately the confirmed runtime. Optional deeper dives do not count toward the primary runtime unless the user explicitly includes them.

## Canonical runbook model

Each demo step may contain:

- `title`: a short chapter name
- `objective`: why the step exists; presenter-only
- `say`: one or two natural sentences of suggested narration
- `action`: the exact product interaction to perform
- `prompt`: exact text to enter, when applicable
- `expected_result`: specific visible evidence that the action succeeded
- `audience_takeaway`: the capability or value to emphasize
- `fallback`: an optional private recovery cue that does not require the agent to operate the product
- `estimated_seconds`: the chapter's share of the confirmed demo runtime
- `target_path`: route to show without duplicating the configurable base URL; presenter-only

Omit fields that do not apply. Keep the model structured and shared rather than duplicating content in each renderer.

Derive actions and expected results from actual implementation. Do not promise exact output when the underlying product is nondeterministic; identify stable visible waypoints instead. Do not turn product setup, credentials, or data preparation into requirements for generating the presentation shell.

## Audience window

The audience must never see internal labels or instructions such as Objective, Say, Do, Expected result, Audience should notice, Fallback, Presenter note, or Runbook instruction.

Use this default sequence:

1. A minimal opening with the product or feature name, one-line value proposition, and a real logo only when confidently identified.
2. One chapter per primary runbook step. Show a short heading in lightweight chrome and devote roughly 85–90% of the usable area to the live product.
3. A simple closing takeaway, optionally summarizing the demonstrated workflow.

Avoid a runbook sidebar, explanatory slide text during product interaction, generic presentation templates, excessive cards, decorative motion, and anything that competes with the product. Make transitions quick and unobtrusive.

Include a visible `Presenter notes` control in presenter-controlled chrome. Opening it must not reload the product, reset state, or advance the runbook.

## Presenter Notes window

Open Presenter Notes as a separate Electron `BrowserWindow`. If it is already open, focus it instead of creating another. Closing or reopening it must not affect presentation or browser state.

Optimize for fast scanning with large readable text, strong hierarchy, minimal decoration, and clear controls. For the active chapter show, when applicable:

- `Step N of M — Title`
- Objective
- Say
- Do
- Prompt in a distinct block with `Copy prompt`; copy only the prompt value
- Expected result
- Audience should notice
- Fallback, visually secondary
- A compact next-step preview

Presenter Notes may include optional deeper-dive steps, but these must be clearly separated from the primary flow.

## Navigation behavior

Both windows support Previous and Next and update the same shared state. Support Left Arrow/Page Up for previous and Right Arrow/Page Down for next. Space may advance only when it cannot disrupt product input or interaction. Add audience swipe navigation only when it can be distinguished reliably from product gestures and scrolling.

Do not capture presentation shortcuts while the user is typing, selecting text, scrolling, or otherwise interacting with the embedded product. Prefer explicit presentation focus and visible controls over aggressive global interception.

The expected physical setup is Presenter Notes on the laptop and the audience window on an external display. Allow the audience window to move and enter fullscreen independently; do not force both windows onto one display. Remember safe window state when useful.
