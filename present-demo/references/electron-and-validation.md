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

## Integrated browser contract

Prefer `WebContentsView` for authenticated products, redirects, production Content Security Policy, and session continuity. Keep it alive across chapter changes; attach, detach, or resize it without recreating its `WebContents`.

Browser chrome belongs to the audience renderer and must include:

- Back and Forward using the current `webContents.navigationHistory`
- Reload of the currently displayed URL
- An editable address field
- Loading, Live, and Offline state
- The exact failed URL and error when navigation fails
- A Retry action that bypasses stale cache

Accept only valid HTTP and HTTPS URLs from the address field. Treat the address field as user-controlled input and validate IPC payloads again in the main process. Derive the final displayed address from the active `WebContents` URL rather than trusting renderer state.

Keep browser navigation separate from presentation state. Changing the URL must not advance the runbook, and changing chapters must not reset browser history, cookies, authentication, or the current URL. Use `webContents.navigationHistory`; the older `webContents.canGoBack()` and `webContents.canGoForward()` methods are deprecated.

References: [NavigationHistory](https://www.electronjs.org/docs/latest/api/navigation-history) and [webContents](https://www.electronjs.org/docs/latest/api/web-contents/).

## Browser session and security

For a user-changeable browser, use a named in-memory session by default. It preserves authentication and navigation while the presentation is open but discards session data when Electron exits. The user controls any login and product state inside the integrated browser. Use a persistent `persist:` partition only when the user explicitly requests cross-launch browser state and the navigation policy makes that safe.

Keep context isolation and sandboxing enabled, disable Node integration, and expose only narrow preload operations. Handle both permission checks and permission requests; deny permissions by default unless the demonstrated product genuinely needs a reviewed capability.

Allow development-certificate exceptions only for localhost development hosts. Do not weaken certificate verification for production or arbitrary remote hosts. Handle popup links deliberately by navigating the existing browser, opening a controlled secondary surface, or denying them. Do not allow uncontrolled `BrowserWindow` creation.

References: [session](https://www.electronjs.org/docs/latest/api/session) and [Electron security guidance](https://www.electronjs.org/docs/latest/tutorial/security).

## Loading and failure state

Track main-frame navigation failure explicitly. Chromium may finish rendering its internal error document after `did-fail-load`; do not interpret that later completion as proof that the requested product URL loaded successfully. Ignore subframe failures when calculating the main browser status.

On successful main-frame navigation, derive the final address from the active `WebContents` URL and report Live. On failure, retain the requested URL and error details and report Offline. Reload the current destination rather than resetting to the original configured URL; Retry must use cache-bypassing reload behavior.

Electron distinguishes `did-fail-load`, `did-finish-load`, and cache-bypassing reload behavior; see [webContents](https://www.electronjs.org/docs/latest/api/web-contents/).

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
3. Selected-URL checks: confirm the user-selected environment opens in the integrated browser without operating its product workflow.

Do not substitute source inspection for runtime validation when the environment can run the application. Do not request credentials or manipulate product data for validation, and do not claim that the product workflow was exercised.

At minimum, launch the generated Electron application and verify:

- The audience window renders and the opening provides an obvious action to enter the live product
- Product chapters show visible integrated-browser chrome
- The explicitly confirmed environment URL is selected; no discovered or hard-coded fallback URL can silently replace it
- The URL field is editable and accepts a different valid HTTP or HTTPS URL
- Address, loading state, and navigation history remain synchronized
- Back, Forward, and Reload operate on the embedded browser
- A successful page reports Live
- An unreachable page reports Offline with the exact URL and error
- Retry bypasses cache and recovers after the server becomes available
- The same product `WebContents` survives opening, product, and closing chapters
- Presenter Notes can drive shared presentation state
- Closing and reopening Presenter Notes preserves the current chapter and browser
- Repeated Presenter Notes activation produces only one notes window
- Copy Prompt copies exactly the prompt text
- Presentation navigation does not hijack typing or ordinary product interaction
- Opening and closing surfaces render correctly
- Product assets resolve and uncertain branding is not fabricated
- The output directory is the intended one and is ignored when expected

Do not exercise the primary product path as part of shell validation. The user controls authentication, data, and product interaction after launch.

When GUI automation is unavailable, run a Chromium DevTools Protocol smoke test rather than falling back directly to source inspection. Adapt the bundled [`scripts/runtime-smoke.cjs`](../scripts/runtime-smoke.cjs) template and use its two local fixture origins plus offline/recovery cycle so the test does not depend on product credentials. Preserve the template's `data-demo-surface`, `data-demo-stage`, `data-demo-control`, `data-demo-current-step`, `data-demo-browser-status`, `data-demo-browser-error`, and `data-demo-retry-mode` hooks and remote-debugging setup in the generated app. These hooks form a small, stable testing interface; they must not expose privileged Electron capabilities to remote content. Pair the runtime recovery check with source verification that the Retry IPC handler calls `reloadIgnoringCache()` on the active product `WebContents`.

If Electron itself cannot run, perform static checks and clearly provide a short manual test checklist for every remaining runtime item. Explain the constraint rather than implying that source inspection validated behavior. Otherwise, launch the completed demo after validation and leave it open for the user.

## Gitignore safety

Check ignore status using Git rather than assuming a dot-prefixed directory is ignored. If the user authorized an ignore change, add only the exact generated path or narrow pattern requested and verify it. Report the change explicitly.
