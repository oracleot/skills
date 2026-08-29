# Runbook and Experience

Use this reference when creating the runbook or either presentation surface.

## Narrative design

Select the smallest implemented workflow that demonstrates a meaningful outcome. Useful story shapes include:

- Question → Answer → Investigate → Segment → Visualise → Refine → Save
- Discover → Configure → Execute → Review → Share

Reliability and narrative clarity outrank feature density. Prefer predictable data states, realistic actions, tested or highly predictable text inputs, clear transitions, and explicit recovery paths. Optional deeper dives belong in presenter notes and must not clutter the default audience sequence.

## Canonical runbook model

Each demo step may contain:

- `title`: a short chapter name
- `objective`: why the step exists; presenter-only
- `say`: one or two natural sentences of suggested narration
- `action`: the exact product interaction to perform
- `prompt`: exact text to enter, when applicable
- `expected_result`: specific visible evidence that the action succeeded
- `audience_takeaway`: the capability or value to emphasize
- `fallback`: a practical recovery action, alternate input, saved state, or safe skip
- `target_path`: route to show without duplicating the configurable base URL; presenter-only
- `required_state`: account, data, and setup that must exist before the step; presenter-only
- `mutates_data`: whether the action changes hosted data; presenter-only
- `reset`: how to restore prepared demo data after the step; presenter-only

Omit fields that do not apply. Keep the model structured and shared rather than duplicating content in each renderer.

Derive prompts and expected results from actual implementation and available data. A fallback must be actionable and private. Do not promise exact output when the underlying product is nondeterministic; identify stable success signals instead.

For a production demonstration, every mutating step needs prepared demo data, a stable visible success signal, and a practical reset or safe-skip path. If those safeguards do not exist, redesign the step as read-only, use an approved non-production environment, or ask the user how to proceed.

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
