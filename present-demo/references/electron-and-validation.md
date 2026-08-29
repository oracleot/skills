# Electron Implementation and Validation

Use this reference when choosing the Electron architecture, generating files, updating an existing demo, or validating it.

## Architecture invariants

Keep one authoritative presentation state in the Electron main process. Renderers request changes and subscribe to state snapshots through narrowly scoped IPC. Do not maintain independent slide counters.

Conceptually:

```text
Audience or Notes action
        ↓
Main-process presentation state
        ↓
Audience update + Notes update
```

Expose only required operations through a preload bridge with context isolation. Validate IPC payloads and avoid broad renderer access to Electron or Node APIs. Keep the presentation controller independent of the embedded product session.

The browser surface must fit the target application. Investigate authentication, redirects, cookie/session behavior, Content Security Policy, local certificates, popup/new-window flows, permissions, and application navigation before choosing it. Prefer a current Electron-native embedding mechanism when an iframe is insufficient, and verify the chosen mechanism against the Electron version actually installed or selected. Do not disable security controls globally merely to make embedding easier.

Changing chapters normally changes presentation decoration only. Do not recreate, navigate, or reload the product browser unless the runbook explicitly requires it. Opening Presenter Notes must only create or focus its window.

## Generated directory

Keep the app understandable and self-contained. Include only what the selected stack needs, typically:

- Package metadata and run scripts
- Electron main process and preload bridge
- Audience and Presenter Notes renderer entry points
- Shared runbook types/data and presentation-state definitions
- Browser integration and local assets actually required
- Configuration and concise run/setup instructions

Do not copy large areas of the product repository. Reference product assets when stable, or copy only the assets required for the demo to run independently. Avoid modifying production source code for convenience.

Inspect an existing generated demo before updating it. Make targeted changes, preserve useful presenter customizations, and keep known-working browser integration unless changed product requirements justify replacing it.

## Validation strategy

Use the strongest practical level available:

1. Static checks: package scripts, types, linting, asset resolution, runbook integrity, and gitignore status.
2. Electron integration checks: start the app and exercise both windows, IPC, navigation, and clipboard behavior.
3. Product-flow checks: run the primary feature path against the intended local or hosted environment when credentials, services, and data are available.

Do not substitute source inspection for runtime validation when the environment can run the application. Do not claim product-flow validation when authentication, data, services, or GUI access prevented it.

At minimum verify:

- The Electron app starts and the audience window renders
- Presenter Notes opens separately, and repeated activation focuses the single existing window
- Both windows show the same current step and can drive Previous/Next updates
- Opening, closing, and reopening notes does not reset or advance the demo
- Copy Prompt copies exactly the prompt text
- Presentation navigation does not hijack typing or ordinary product interaction
- Browser session state survives relevant chapter changes
- Opening and closing surfaces render correctly
- Product assets resolve and uncertain branding is not fabricated
- The output directory is the intended one and is ignored when expected

Where possible, exercise the primary happy path and at least one fallback. Confirm expected results through stable visible signals.

If runtime Electron testing is unavailable, run static checks and clearly provide a short manual test checklist for the remaining items.

## Gitignore safety

Check ignore status using Git rather than assuming a dot-prefixed directory is ignored. If the user authorized an ignore change, add only the exact generated path or narrow pattern requested and verify it. Report the change explicitly.
