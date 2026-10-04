# Post ideas backlog

A queue of future posts for this blog, each written as a prompt so it can be handed to a writer later
(a person, a Claude Code session, whatever is around) without re-explaining the blog. Pick an idea,
paste the **House style** block plus the idea's **Prompt** block into the writer, supply anything listed
under **Needs from the author**, and the output goes into `src/data/articles.ts` like the existing posts,
flagged `draft: true` so it shows up on `/stage` for review first.

Ideas are grouped by angle and tagged with a priority:

- **high**: strongest, writable now from public facts.
- **medium**: good, but needs material only I can supply first.
- **low**: speculative, or depends on a hook I may not actually have.

Delete an idea when it ships; add new ones at the bottom of the right section.

## Processing prompt

Use this as the instruction when turning an idea into a post:

> Write a blog post for ofry.net/blog from the idea below. Follow the house style exactly. Read the
> existing posts in `src/data/articles.ts` first so you do not repeat an anecdote, an opening move, or a
> closing move they already use. Return the post as one object matching the `Article` type in
> `src/types/article.ts` (`id`, `title`, `excerpt`, `content`, `date`, `image`, `tags`), with `id` equal
> to the idea's slug and `draft: true`, and add it to the top of the `articles` array. Keep it between
> 550 and 900 words.
> Where the idea lists things it needs from the author, use only what the author actually supplied;
> if something is missing, leave a clearly marked `[TODO: ...]` rather than inventing it.

## House style

**Voice**

- First person, conversational, direct. Wry and a little self-deprecating. Short paragraphs; a one-line
  punch next to an explanatory paragraph is fine.
- Concrete over abstract: name the board, the bot, the repo, the exact failure. Show the thing, then the lesson.
- The tinkerer's frame: take it apart, see how it works, put it back together better. Honest about what
  did not work and what was never finished.
- When work comes up, it is from a practitioner's stance at the public level only: no customer names,
  internal architecture, metrics, roadmap, or colleagues.
- No generic blog prose: no "in today's fast-paced world", no "delve", no "game-changer", no "journey",
  no tidy triads for their own sake, no "it's not X, it's Y", no rhetorical questions, no motivational
  ending, no closing paragraph that restates the post.
- Open with something specific (a scene, a failure, an object on the desk). End grounded: a takeaway,
  a next step, or an admission. Never end on a question to the reader.
- Never invent numbers, dates, names, quotes, or "I did" claims. If a detail is not in the idea or
  supplied by the author, leave a `[TODO]`.

**Format the renderer supports** (see `parseContent` in `src/pages/ArticlePage.tsx`)

- Paragraphs separated by one blank line. No `#` headings, no HTML, no images inside the content.
- A section heading is a paragraph that is exactly `**Heading Text**` on its own line. A normal
  paragraph must not both start and end with `**`.
- Bullet lists: consecutive lines starting with `- `. Numbered lists: consecutive lines starting with `1. `.
- Inline `**bold**`, inline `` `code` ``, links as `[text](https://...)` to real URLs only.
- Fenced code blocks (```` ```lang ```` ... ```` ``` ````), at most 12 lines, only where a snippet genuinely helps.

**Metadata**

- `excerpt`: one or two sentences, under 220 characters, in the same voice, not the first sentence of the post.
- `date`: `YYYY-MM-DD`. `tags`: 2-4 lowercase words from the shared vocabulary (hardware, esp32, mcp, llm,
  agents, testing, playwright, telegram, side-projects, tooling, ci, github-actions, career, retrospective,
  build-log, react, vite, self-hosting, macos, security, sso) before inventing a new one.
- `image`: an Unsplash URL that has been checked to return 200, with `?w=800&q=80&auto=format&fit=crop`.
- `draft`: `true` until reviewed. Drafts are hidden from the public site and only show under the unlisted
  `/stage` path (`ofry.net/blog/stage`); remove the flag to publish.

## Ideas

24 ideas, grouped by angle, highest priority first within each group.

### Hardware and RF

#### A Second Factor on a Five-Dollar Board

`esp32-mfa-authenticator-trust-boundaries` · priority: **high** · shape: field-notes · tags: esp32, security, sso, hardware

He starred esp32-mfa-authenticator, a TOTP code generator running on an ESP32. Field notes from reading it with the eyes of someone who works on enterprise SSO: TOTP is just HMAC and a clock, the clock is the hard part on a board with no battery-backed RTC, and the secret has to live somewhere on flash.

**Prompt**

> Write field notes on reading esp32-mfa-authenticator, a TOTP second-factor device on an ESP32, from the point of view of someone who spends workdays on SSO and OIDC. Open with the contrast: in the day job a second factor is a product with a vendor and a contract; on the bench it is HMAC-SHA1, a thirty-second window, and a six-digit truncation you can read in an afternoon. Beats: (1) what the code actually does and how little of it is cryptography; (2) the clock problem, no battery-backed RTC on most boards, so NTP on boot, drift between syncs, and what happens offline; (3) where the secret lives, NVS or raw flash, whether flash encryption is on, and what a USB cable gives an attacker; (4) the threat model it honestly fits, losing your phone, versus the one it does not, a determined person with the board in hand; (5) what reading the tiny version clarified about the big ones he works with. Takeaway: a small auth implementation shows you exactly which parts the enterprise versions are hiding, and which of those parts are the actual security. Anchor on the starred repo, the SSO role, and the ESP32 stack. Avoid any Tastewise SSO internals, security claims not verified against the repo's current code, and recommending it as a real second factor without the caveats above.

**Anchors:** Starred esp32-mfa-authenticator; Leads enterprise SSO authentication work at Tastewise (public role description, high level only); ESP32 experience: esp-cyd-mcp, ESP32-AirConditioner fork; Starred objective-see/Malware (macOS security research): he reads security code

**Needs from the author:** Whether he flashed it to a board, and which board; Whether he found a concrete weakness or a concrete good decision in the code he wants highlighted

#### WebSocket or Bluetooth? Decide Before You Write a Tool

`websocket-vs-bluetooth-llm-to-microcontroller` · priority: **high** · shape: opinion · tags: mcp, esp32, hardware, security

esp-cyd-mcp puts the MCP server on the board and talks over WebSocket on Wi-Fi; the claude-desktop-buddy example reaches a board over Bluetooth from the desktop. An opinion piece on what the transport choice decides for you: where the protocol lives, where the trust boundary sits, and what fails when it fails.

**Prompt**

> Write an opinion piece comparing two ways of letting a model touch a microcontroller: an MCP server living on the board over WebSocket, as in esp-cyd-mcp, versus a Bluetooth link from the desktop agent, as in the claude-desktop-buddy maker example. Open with the concrete difference in the first minute of use: one needs Wi-Fi credentials compiled in and a network you trust, the other needs pairing and the laptop within a few meters. Beats: (1) where the protocol runs, on the board or on the desktop as a bridge, and what that means for how much firmware you maintain; (2) proximity as a security feature versus a network reachable by anything on it; (3) failure modes, Wi-Fi drops and WebSocket reconnects versus BLE disconnects and MTU limits, and which one the model handles more gracefully; (4) which fits which build, a screen on a shelf versus a device on the desk; (5) his pick for the next project and why. Takeaway: the transport decides who hosts the protocol and where the trust boundary is, so choose it before writing a single tool definition. Anchor on esp-cyd-mcp, the claude-desktop-buddy fork, and WebSocket. Do not retell the esp-cyd-mcp build log. Avoid latency numbers, claims about the Bluetooth API beyond what the example's README shows, and any Tastewise internals.

**Anchors:** esp-cyd-mcp: MCP server over WebSocket on the ESP32-2432S028R; claude-desktop-buddy fork: 'Reference and example for the Bluetooth API for makers in Claude Cowork & Claude Code Desktop', C++; WebSockets and MCP in his stack; Enterprise SSO work means he thinks about trust boundaries (public, high level); Published 'Giving an LLM a Screen' covers the esp-cyd-mcp build itself; do not retell it

**Needs from the author:** Whether he has flashed claude-desktop-buddy onto a board, and which board; Which transport he would actually pick for his next build, and the reason

#### The Probe Changes the Circuit

`rf-debugging-the-probe-changes-the-circuit` · priority: **medium** · shape: retrospective · tags: hardware, testing, retrospective

In RF you cannot see the signal, so you attach an instrument, and the instrument loads the circuit and changes what you are measuring. A retrospective on how that lesson from the 2004-2016 hardware years shows up in software: logging that shifts timing, debuggers that hide races, and tests that pass on a laptop and fail in CI.

**Prompt**

> Write a retrospective on one lesson from the RF years: the probe changes the circuit. Open on the bench, a circuit that behaves one way with the scope probe attached and another way without it, told in outline from a real memory the author supplies. Beats: (1) why RF is invisible, you never see the signal, only what an instrument says about it, and every instrument has a cost in loading, capacitance, or noise; (2) the noise floor, learning that not every wobble is a bug, and that chasing noise wastes weeks; (3) the software versions he keeps meeting: a log line that shifts timing enough to hide a race, a debugger that serializes what was parallel, a Playwright run that passes on a fast laptop and fails in a slow CI container; (4) the habit that resulted, deciding what the measurement costs before trusting what it shows, and preferring instruments that are always on over ones bolted on during a crisis; (5) a short link back to 'Hardware Has No Undo' as the sibling lesson, without repeating it. Takeaway: observability is never free, so budget for the distortion it adds. Anchor on the 2004-2016 RF period, Playwright and Jest, and his testing ownership. Avoid naming employers or products from the RF years, invented measurements, and company internals.

**Anchors:** Early career 2004-2016: RF circuits, microcontrollers; 'It started with a soldering iron and a pile of components I probably shouldn't have plugged in'; Owns E2E testing and code quality at Tastewise (public role description); Playwright and Jest in his stack; Published 'Hardware Has No Undo' already covers the backwards capacitor and defining failure before shipping; reference it, do not retell it

**Needs from the author:** One concrete RF bench story he is comfortable telling: what circuit, what instrument, what it changed; Whether there is a specific flaky-test incident (anonymized) he wants used as the software mirror

#### There's a GSM Base Station in My Forks

`openbts-fork-gsm-protocol-stack-retrospective` · priority: **medium** · shape: retrospective · tags: hardware, retrospective, career

Among Ofry's forks, between React Native libraries and Telegram bots, sits OpenBTS, a GSM+GPRS radio access network node. The post uses that fork as a window into the 2004-2016 RF years and argues that a well-layered protocol implementation is the best reading material an engineer can keep around.

**Prompt**

> Write a retrospective about why a software lead keeps a fork of OpenBTS. Open with the forks list on GitHub: scroll past React Native shims and Telegram bots and there is a GSM base station, and explain how it got there. Beats: (1) what OpenBTS actually is, a software GSM/GPRS access node that lets ordinary phones attach over the Um air interface and hands calls off to SIP; (2) what reading it shows, the physical layer bursts, timing advance, and the L2/L3 signaling state machines stacked so cleanly you can read the tower top to bottom; (3) which habits from the RF years this fed, timing budgets, everything-is-a-state-machine, the layer that owns errors; (4) the honest part, what he did and did not do with it, and the plain note that you do not transmit on GSM bands without a license; (5) what carried over to building an MCP server over WebSocket on an ESP32: framing, retries, and deciding which layer gets to fail. Takeaway: a good protocol implementation is a better textbook than any tutorial, and an old fork is a reading list, not a project. Anchor on the openbts fork, the 2004-2016 RF period, and esp-cyd-mcp. Avoid claiming he ran a base station, owning SDR hardware he has not confirmed, telco employer details, or invented numbers.

**Anchors:** openbts fork: 'GSM+GPRS Radio Access Network Node' (profile notes it reflects his RF background); Early career 2004-2016: RF circuits, microcontrollers, code that talks to hardware; esp-cyd-mcp speaks MCP over WebSocket, a protocol tower of his own; 'I'm the person who takes things apart to see how they work'

**Needs from the author:** Whether he ever ran OpenBTS on real radio hardware, and if so on what; Roughly when and why he forked it (what he was looking for in the code); Any RF-era story from 2004-2016 he is comfortable telling in outline

#### Stop Walking to the Board

`esp32-ota-partitions-lessons-from-wled-and-launcher` · priority: **medium** · shape: how-to · tags: esp32, hardware, tooling, how-to

A practical how-to on over-the-air updates for ESP32 projects, learned by reading two repos he starred: WLED, which ships OTA as a first-class feature, and bmorcelli/Launcher, which swaps whole firmwares on M5Stack and Marauder devices. The partition table is the installer, and it has to be planned before the first flash.

**Prompt**

> Write a how-to on adding over-the-air updates to an ESP32 project, framed as what he learned from reading WLED and bmorcelli/Launcher rather than from documentation. Open with the moment the board goes into an enclosure or onto a shelf and the USB cable stops being an option. Beats: (1) the ESP32 partition layout for OTA, an otadata partition plus two app slots, and why the default single-app scheme in the board menu silently rules OTA out; (2) the minimal path with Arduino's Update or ArduinoOTA, with one code block of at most twelve lines; (3) how WLED treats OTA as a product feature, a web page, a password, a progress bar, and what that says about respecting the person holding the device; (4) how Launcher goes further by loading entirely different firmwares from storage, and what the partition tricks behind that imply; (5) a short gotcha list: flash size on cheap boards, keeping a recovery path, not bricking the only board you have. Takeaway: the partition table is the installer, decide it before the first flash, not after. Anchor on WLED, Launcher, the CYD board, and the Arduino/ESP-IDF stack. Avoid invented flash sizes for his specific board unless the author confirms, claims that esp-cyd-mcp already supports OTA unless true, and more than two code blocks.

**Anchors:** Starred WLED (ESP32 LED control) and bmorcelli/Launcher (ESP32 firmware launcher, M5Stack/Marauder); esp-cyd-mcp on the ESP32-2432S028R, his most-starred repo; ESP32-Cheap-Yellow-Display community contributor; C++ ESP32/Arduino/ESP-IDF style stack

**Needs from the author:** Whether esp-cyd-mcp currently supports OTA or is still flashed over USB; Which CYD variant and flash size he actually owns; Whether he has used Launcher on an M5Stack-class device or only read the code

#### Reading a Reactor Simulator on a Sunday

`vver-simulator-control-loops-field-notes` · priority: **low** · shape: field-notes · tags: hardware, side-projects

VVERSimulator is a C++ simulator of a pressurized-water reactor's primary circuit, and Ofry forked it. Field notes on reading it as a tinkerer: a simulation is a pile of coupled feedback loops with a clock, which is the same shape as an RF control loop or an ESP32 main loop.

**Prompt**

> Write field notes on reading the VVERSimulator source, a pressurized-water reactor primary-circuit simulator in C++. Open with the obvious question a reader will have, why does someone who builds MCP servers have a reactor simulator in his forks, and answer it with the honest version: curiosity, and the fact that it is a feedback-loop system small enough to read in an afternoon. Beats: (1) what the simulator models at a high level, heat in, coolant flow, pressure, rods, each a loop coupled to the others, described only as the code shows it; (2) the structure of the main loop, state, step, integrate, and how it compares to the main loop of an ESP32 sketch; (3) the parallel to RF control loops from his hardware years, gain, delay, oscillation, the same intuition under a different physics; (4) one thing the code does that he found elegant and one he would have written differently; (5) what reading other people's simulations teaches about reasoning on real-time systems. Takeaway: simulations are the cheapest place to build intuition for feedback, and reading one is a skill worth keeping. Anchor on the fork, C++, the RF period, and the main-loop comparison. Avoid any claim about nuclear safety, real reactor engineering, invented physics numbers, or Autofleet internals beyond the public description.

**Anchors:** VVERSimulator fork: pressurized water reactor simulator, C++; C++ in his stack (ESP32/Arduino/ESP-IDF style); RF circuits and control loops from the 2004-2016 period; 'Endlessly curious, perpetually tinkering'

**Needs from the author:** What drew him to this particular repo and when he forked it; Whether he has run or modified it, or only read it; Which part of the code he actually found interesting (so the writer does not guess)

### AI platform and MCP

#### Nobody Logs In to My ESP32

`mcp-authorization-hobby-board-vs-enterprise-server` · priority: **medium** · shape: field-notes · tags: mcp, security, sso, esp32

esp-cyd-mcp sits on MCP registries next to enterprise connectors, and it has no authentication at all: anyone on the Wi-Fi can flip a GPIO pin. Field notes from someone who maintains that board and also works on enterprise SSO for MCP servers at his day job, on what auth decides about what an MCP server can be.

**Prompt**

> Write field notes on MCP authorization from someone who maintains both ends: a hobby MCP server on an ESP32 with no auth, and enterprise MCP servers where SSO is part of the remit. Open with the registry moment: esp-cyd-mcp listed next to CRM and database connectors, and the realisation that one of those entries will do whatever anyone on the Wi-Fi asks. Beats: (1) what the board actually has, a WebSocket on a LAN, no token, no identity, and why that was the right call for a desk toy and the wrong call for anything else; (2) what the MCP spec asks of HTTP-transport servers, OAuth-style authorization with the server acting as a resource server, stated only as far as the current spec revision supports and checked against it, and the plain fact that a WebSocket on a microcontroller sits outside that story; (3) the question the hobby server cannot answer and the work one must: who is calling, on whose behalf, with which tenant's data; (4) proximity and a private network as a stand-in for identity, and exactly where that stops; (5) the rule he would carry both ways: a tool that moves a pin and a tool that returns market data both need to know who asked. Takeaway: auth is not a layer you add to an MCP server later; it decides what the server is allowed to be. Anchor on esp-cyd-mcp, the registry listings, and the SSO remit at the public level. Avoid Tastewise internals, named IdP integrations, invented incidents, and spec claims not verified against the current revision.

**Anchors:** esp-cyd-mcp: MCP over WebSocket on the CYD, listed on pulsemcp and mcpservers.org; Current role: AI platform initiatives including MCP servers and enterprise SSO (public, high level); Tastewise public positioning: MCP integration inside ChatGPT, Claude, Copilot and Gemini; Published 'Giving an LLM a Screen' and 'One MCP Server, Four Agents' cover the build and host behaviour; this is only about identity and trust

**Needs from the author:** Whether esp-cyd-mcp has gained any auth (even a shared token) since the build log, or is still open on the LAN; How much he can say, generically, about how auth is approached for a multi-host MCP server (build vs. buy, OAuth vs. API keys) without touching internals

*Reframed from an earlier draft idea: Reframed from mcp-server-on-ten-dollar-board. The judges liked the registry anecdote and the honest no-auth admission but rejected the 'industry wastes MCP on REST wrappers' hot take and the soldering-iron manifesto. Those are gone; the piece is now about the one thing the two servers he maintains genuinely differ on, identity, which also ties in his SSO work. Price claims removed.*

#### Testing an MCP Server With No Model in the Room

`mcp-server-scripted-client-tests-jest-ws` · priority: **medium** · shape: how-to · tags: mcp, testing, esp32, how-to

A model is the worst possible test client because it never sends the same request twice. A how-to on driving esp-cyd-mcp from a Node script over ws, then turning that script into a Jest suite that snapshots the tool list, checks result shapes, and sends one deliberately bad payload to see whether the board reboots or replies.

**Prompt**

> Write a how-to on testing an MCP server with a scripted client instead of a model. Open with the problem: the published post One MCP Server, Four Agents graded what four hosts did with the board's tools, but before any of that you need to know the server answers correctly, and a model is the worst test client because it never sends the same thing twice. Beats: (1) the smallest client, a Node script using ws that opens the socket, sends initialize, tools/list, then one tools/call, and prints what comes back, with one snippet of at most twelve lines; (2) turning that into a Jest suite: snapshot the tool list so a renamed tool fails a test, assert on result shape rather than content, and one test that sends a malformed payload to see whether the board reboots or replies with a JSON-RPC error; (3) running the same suite against a real board on the desk versus a server on a laptop, and what changes (timeouts, reconnects, a board that needs a power cycle); (4) where the deterministic suite stops and the trace-grading from the four-hosts post begins. Takeaway: a scripted client is the bottom rung of the evaluation ladder, and it is the rung that finds protocol bugs. Anchor on esp-cyd-mcp, ws, Jest, and the four-hosts post. Take tool names and argument schemas from the repo, never guess them. Do not claim any work server is tested this way unless the author confirms. Do not retell the build log.

**Anchors:** esp-cyd-mcp: JSON-RPC over WebSocket on the CYD; the published build log admits the protocol is wrong in four places; Node.js, Jest and WebSockets in his stack; jest-newrelic shows he bends Jest to odd jobs; Published 'One MCP Server, Four Agents' grades agent traces; this is the deterministic rung underneath it; Owns E2E testing and code quality

**Needs from the author:** The current tool names and whether the firmware implements the MCP initialize handshake, so the snippet is real; Whether such a suite exists in the repo or would be written for the post; Whether the four protocol bugs from the build log were found by hand or by a script

*Reframed from an earlier draft idea: Reframed from cyd-mcp-websocket-from-node, which the judges called README-shaped with guessed tool names and a tiny audience. The reframe turns the same twenty-line client into a testing technique that applies to any MCP server, links to two published posts without repeating them, and moves the tool-name problem into needs_from_author.*

#### Teaching an Agent This Blog's Odd Rules

`writing-an-agent-skill-for-this-blog` · priority: **medium** · shape: build-log · tags: agents, llm, tooling, build-log

The blog renderer has strict, slightly odd content rules that lived only in his head. A build log of writing them down as an agent skill, watching the first version get ignored, and learning where a skill ends and a validator script begins.

**Prompt**

> Write a build log about writing an agent skill (in the public anthropics/skills format) that teaches a coding agent how to add a post to this blog. Open with the renderer's rules: headings are a paragraph that is exactly bold text, lists are consecutive lines, no markdown # headings, no HTML, fenced code only when it earns it. Those rules existed nowhere but his head and the renderer source. Beats: (1) first draft of the SKILL.md: too long, too explanatory, and the agent followed roughly half of it; (2) cutting it to rules plus one good example, and what changed; (3) realising some rules should not be prose at all: a small validator script bundled with the skill that fails on # headings and HTML, so the agent gets an error instead of a suggestion; (4) what the skill still gets wrong, honestly. Takeaway: a skill is a README the reader actually opens, so keep it short, and move hard rules into code the agent can run. Anchor on the blog repo's real stack and content format and on the anthropics/skills format. Do not retell the site build log. Avoid inventing skill-format features beyond what the public spec documents, token-savings numbers, or claims about work usage. One short snippet of the validator or the skill is fine.

**Anchors:** Stars anthropics/skills; follows the Claude Code / agent ecosystem closely; This blog: React 19 + TypeScript + Vite + styled-components, posts as typed objects in a TS file, deployed to GitHub Pages; The renderer's content rules: bold-only headings as their own paragraph, consecutive-line lists, no # headings, no HTML, 0-2 short fenced blocks; Published 'This Blog Shipped With Five Placeholder Posts About Ceramics' covers the site build; this is only about the skill

**Needs from the author:** The actual SKILL.md and validator, or willingness to write them for the post; Which model and Claude Code version he tested the skill with; Whether the skill lives in the blog repo publicly

#### The Spec Is the Part You Can Argue With

`spec-driven-development-with-agents` · priority: **medium** · shape: opinion · tags: agents, llm, tooling, opinion

'Write the spec first' sounds like waterfall until the implementer is an agent that will produce whatever you asked for in minutes. Then the spec is the only artifact a team can review before the tokens are spent.

**Prompt**

> Write an opinion piece on spec-driven development in the age of agentic coding tools, from a platform lead who stars github/spec-kit and contributes to Claude Code. Open with the objection: anyone who worked through the 2010s was taught that big upfront specs are how projects die, so why is he writing them again. Beats: (1) what changed: when implementation takes minutes, the expensive step is agreeing on what to build, and a spec is the cheapest place to disagree; (2) what a spec needs that a prompt does not: non-goals, constraints, and acceptance checks that a reviewer, human or model, can run; (3) where spec-kit's structure earns its place and where it is ceremony: a one-file fix does not need a constitution; (4) a brief nod to hardware: he grew up reading datasheets before powering anything, and this is the same reflex, kept to a paragraph since 'Hardware Has No Undo' already covers deciding how you'll know it's broken. Takeaway: the spec is the review surface for work that has not happened yet; on a four-person team that is the review that matters most. Keep it about the before; the sibling piece on reviewing Claude Code diffs covers the after, so cross-reference it in one line. Anchor on spec-kit, Claude Code, and his code-quality ownership. Avoid claiming spec-kit is used at Tastewise unless the author confirms, invented velocity numbers, and any team-process detail beyond the size of the team.

**Anchors:** Stars github/spec-kit (spec-driven development) and anthropics/skills; Contributor to anthropics/claude-code; Platform lead owning code quality and technical direction for a team of 4; Hardware background: RF circuits, microcontrollers (read the datasheet before soldering)

**Needs from the author:** Whether he has actually run spec-kit, on what (side project vs. work), and what he can say about it; One spec he is willing to excerpt or paraphrase

### Engineering craft at work

#### Three Things Customers Mean by "SSO"

`enterprise-sso-vendor-side-what-customers-ask-for` · priority: **high** · shape: field-notes · tags: sso, security, career

Seen from the vendor side, 'do you support SSO?' is three separate asks wearing one word: login through the customer's IdP (OIDC or SAML), user lifecycle (SCIM), and enforcement ('disable passwords for our domain'). Field notes on telling them apart before writing code, and on why the admin's configuration screen is the real feature.

**Prompt**

> Write field notes from the vendor side of enterprise SSO, from a practitioner who has built it for a B2B AI platform, kept generic enough to apply to any SaaS. Open with the security questionnaire checkbox that reads 'supports SSO' and the months-long thread it quietly starts. Beats: (1) SSO is three asks, not one: identity (OIDC vs SAML, and why SAML is still on the table even though OIDC is kinder to implement), provisioning and deprovisioning (SCIM, and why deprovisioning is the part nobody budgets for), and enforcement (domain-level password lockout, break-glass admin); (2) the questions to ask the customer's IT admin before touching code: which IdP, metadata URL vs manual certs, who owns the test tenant; (3) the data-model decision that matters more than the protocol: tenants, domains, and what a user is when they arrive from an IdP with a different email than before; (4) what goes wrong in testing: clock skew, certificate rotation, IdP-initiated logins with no session to attach to, the IdP admin who went on leave; (5) the opinion: the self-service configuration screen for the customer's admin is the actual feature, and building it first saves more support than protocol correctness. Takeaway: build the IdP-agnostic account model first; the handshake is the smaller half. Avoid naming any customer, any specific IdP integration Tastewise has, timelines, ticket counts, internal architecture, and any claim that he did SSO work at Panaya. Protocol details must be correct.

**Anchors:** Current role: Platform Engineering Lead at Tastewise, enterprise SSO authentication is part of the remit; Earlier enterprise SaaS work: Panaya (2016-2018), Autofleet enterprise clients globally (2020-2024), as general enterprise context only; Technical stack includes SSO/OIDC/SAML; profile demands claims be accurate for those protocols

**Needs from the author:** Whether he can say in general terms which IdPs he has tested against (e.g. Okta, Entra, Google) or should stay fully generic; Whether the SSO work was build vs. buy (library/vendor) and if that is shareable; Any anonymized customer question he is comfortable paraphrasing

*Reframed from an earlier draft idea: Merges the fresh 'three asks' framing with the best beats of the rejected enterprise-sso-from-the-vendor-side (clock skew, cert rotation, IdP-initiated logins, and the admin-screen-is-the-feature opinion). The invented 'I touched SSO at Panaya in 2016' hook that sank the original is explicitly forbidden. Squarely his current remit and writable at the generic level now.*

#### How I Review a Diff Claude Code Wrote

`reviewing-diffs-written-by-claude-code` · priority: **high** · shape: how-to · tags: llm, agents, tooling, how-to

Agent-written diffs fail in different places than human diffs do. A reviewer's checklist from someone who owns code quality for a team of four, has contributed to Claude Code, and once forked GitHub Desktop just to focus on the diff.

**Prompt**

> Write a how-to for reviewing pull requests whose code was written by Claude Code, from the stance of the person responsible for code quality on a small team. Open with the gh-diff fork: years ago he forked GitHub Desktop to strip it down to the diff view, and that habit, diff first and everything else second, turns out to be the wrong order for agent output. Beats: (1) read the ask before the diff: the prompt or plan the agent worked from is the spec, and most bad agent diffs are faithful to a bad ask; (2) the smells specific to agent diffs: changes wider than the task, a new helper that duplicates an existing util, tests that assert the implementation rather than the behaviour, and confident commit messages; (3) what to fix yourself vs. send back, and why sending it back to the agent costs something different than sending it back to a person; (4) the CLAUDE.md file as the place review arguments go to die: every convention argued about twice becomes a line in it, and arguing once with the file beats arguing weekly with each other; (5) reviewing a teammate's agent-assisted PR: review the human's intent, not the model's prose. Takeaway: review the ask, then the diff, and make the ask part of the PR. Anchor on his Claude Code contribution, the gh-diff fork, and his code-quality ownership. Avoid naming a model version unless the author supplies it, invented acceptance-rate numbers, any anecdote identifiable as a specific teammate on a four-person team, and any Tastewise repository detail. One short illustrative snippet at most.

**Anchors:** Contributor to anthropics/claude-code (listed on his site); gh-diff: his fork of GitHub Desktop, 'Focus on diffing your code'; Stars winfunc/opcode (GUI for Claude Code) and anthropics/claude-code; Owns code quality and frontend infrastructure for a team of 4

**Needs from the author:** An anonymized, non-identifiable example of an agent diff he sent back and why; Whether he still uses the gh-diff fork, what it strips, and what he reviews diffs in today; Which Claude Code setup (model, permissions mode) he is comfortable naming

*Reframed from an earlier draft idea: Merges the fresh how-to with the rejected reviewing-claude-code-diffs-team-of-four: keeps its CLAUDE.md-as-living-style-guide beat, drops the identifiable teammate anecdote the judges flagged, and swaps the opinion shape for a checklist, which is less saturated. Also absorbs the standalone gh-diff opinion as the opener; the fork's status moves into needs_from_author.*

#### Why My Jest Tests Report to New Relic

`jest-newrelic-observability-in-tests` · priority: **medium** · shape: build-log · tags: testing, tooling, build-log

A slow integration suite with no way to see which test touched which service led to a small package that wraps every Jest test in an APM transaction. A build log of jest-newrelic and what it exposed.

**Prompt**

> Write a build log of jest-newrelic, a package that attaches a New Relic transaction to each Jest test so an APM dashboard shows per-test segments. Open with the problem as he hit it: an integration suite getting slower, and the only tool for finding out why being console.time and guesswork. Beats: (1) the idea: tests are traffic against a real-ish environment, so instrument them like traffic; (2) the mechanics and the traps: New Relic agent require-order vs. Jest's module registry, running inside Jest workers, naming transactions after test paths; (3) what it revealed once it worked, only what the author confirms; an illustrative example such as a test making a real network call it should have mocked is acceptable if clearly framed; (4) why it became a package rather than a setup file, and whether he would do it with OpenTelemetry today. Takeaway: tests are production traffic for your test environment, and most teams fly it blind. Anchor on the jest-newrelic repo and his Node/GCP era. Avoid invented latency numbers, claims that it runs at Tastewise, and any current-employer environment detail. One short snippet of the setup is fine.

**Anchors:** jest-newrelic: his package, 'Add newrelic transaction to jest tests'; Node.js on GCP at Autofleet (2020-2024); Jest in his stack; cidemon fork (macOS menu bar CI/deploy monitor): cares about CI visibility; Owns E2E testing direction today

**Needs from the author:** Which project or era the package was built for and what it actually revealed; Whether the package is still maintained or frozen; Whether he would use OpenTelemetry instead today

#### The Error That Logged as {}

`winston-stackdriver-serialize-error-node-gcp` · priority: **medium** · shape: how-to · tags: tooling, autofleet, how-to

JSON.stringify(new Error('x')) is '{}', and Stackdriver's Error Reporting only groups what it can parse. A how-to on getting Node errors through Winston into GCP logging with their stacks intact, built on his forks of nodejs-logging-winston and serialize-error.

**Prompt**

> Write a how-to on logging Node.js errors to Google Cloud Logging through Winston so that stacks, causes, and custom properties survive and Error Reporting groups them. Open with the one-liner that explains everything: JSON.stringify(new Error('boom')) returns '{}', so the first version of every structured logger throws away the thing you most need. Beats: (1) what Cloud Logging wants: severity, a message, and the shape Error Reporting parses, including where the stack must live; (2) why serialize-error exists: nested causes, non-enumerable properties, circular references, and the custom fields you attach in a catch block; (3) the transport is the right place to do this once, not every catch site; what his nodejs-logging-winston fork needed to change, as the author confirms; (4) the gotcha list: a stack in message groups, a stack in metadata does not; logging the same error twice at two layers; errors thrown in a Jest worker look different. Takeaway: decide the shape of an error log once, in the transport, and never call JSON.stringify on an Error again. Anchor on the two forks and his Node/GCP years at Autofleet. Avoid an invented incident narrative, invented volumes, and any Autofleet internals beyond the public stack. One short snippet is appropriate.

**Anchors:** nodejs-logging-winston fork (Stackdriver/Winston); serialize-error fork; Node.js on GCP at Autofleet (2020-2024); Technical stack: Node.js, GCP, Docker

**Needs from the author:** What his nodejs-logging-winston and serialize-error forks actually changed, or whether they were plain mirrors; Whether this was Autofleet-era or earlier

### Career

#### Everything I Held in My Head Had to Come Out

`founding-engineer-to-leading-a-team-of-four` · priority: **medium** · shape: retrospective · tags: career, retrospective

As Autofleet's founding engineer, the system lived in his head and that was fine. Leading a four-person platform team at Tastewise, it is a liability. A retrospective on the specific habits that had to change, the ones that were secretly good, and the rule that every answer given twice becomes a test, a check or a doc.

**Prompt**

> Write a retrospective on going from founding engineer (one person who knows everything) to leading a four-person platform team. Keep the focus on knowledge and ownership, not architecture; 'What Survived Four Years at Autofleet' already covers which decisions aged well. Open with a concrete moment, supplied by the author, where being the only one who knew something was efficient at Autofleet and became a bottleneck on a team of four. Beats: (1) the founding-engineer habits that were adaptive: deciding fast, fixing in place, no doc because no reader; (2) which of those turned into blockers with four people: unwritten conventions, the review queue only he could clear, context living in his terminal history; (3) the rule that came out of it: every answer he gives twice becomes a lint rule, a CI check, a Playwright test or a short decision note, so the system explains itself and he stops being the oracle; (4) the first time someone shipped something he would have done differently and it was fine, told without identifying anyone; (5) what he kept: the instinct to take the thing apart before delegating it. Takeaway: a team of four is the size where 'I'll just do it' stops being faster, and the fix is to put the rules in tooling, not in more meetings. Avoid colleague names, team rituals that imply internal process, headcount history, invented teammate scenes, stock leadership beats about over-reviewing, and any Tastewise architecture.

**Anchors:** Founding Engineer at Autofleet 2020-2024, built the platform from zero through acquisition by Element Fleet Management; Platform Engineering Lead at Tastewise since 2025, leads a team of 4; Owns technical direction for frontend infrastructure, E2E testing, and code quality; Published 'What Survived Four Years at Autofleet' covers which technical decisions aged well; do not retread it

**Needs from the author:** One real moment he is willing to share where his sole-owner knowledge blocked someone; Whether he is comfortable mentioning the acquisition period as part of the transition; Two or three actual 'answer given twice' items that became a check or a doc (no internals needed)

*Reframed from an earlier draft idea: Merges the fresh prompt with the one line the judges saved from the rejected from-founding-engineer-to-lead-of-four ('every answer I give twice becomes a test, a CI check or a README'). The stock IC-to-lead beats (over-reviewing confession, teammate-rewrote-my-code) are explicitly excluded. Stays medium until he supplies a real moment; without one it drifts back toward the genre the judges rejected.*

#### Three Forks and a Bottom Sheet

`react-native-forks-autofleet-locomotion` · priority: **medium** · shape: field-notes · tags: react-native, retrospective, autofleet

Building the open-source Autofleet rider app in React Native left him with forks of reanimated-bottom-sheet, drop-shadow, svg-view, and a styled-components Babel plugin. Field notes on why each fork happened and the maintenance bill that followed.

**Prompt**

> Write field notes on owning forked dependencies, grounded in the React Native forks from the Autofleet locomotion app. Keep this strictly about dependency ownership; 'What Survived Four Years at Autofleet' covers architecture and must not be repeated. Open with the moment of the first fork: a bug upstream, a PR that would not land in time, a release due. Beats: (1) why each fork happened, one line each, only as the author confirms: a fix upstream would not take, a React Native version bump upstream had not done, a feature too niche to upstream; (2) the hidden bill: every React Native upgrade now has extra repos to rebase, and the fork nobody remembers the reason for; (3) patch-package vs. a fork: when a patch is enough and when a fork is honest; (4) upstreaming: what got merged (the Pull Shark badge is real) and what died in his fork, and how to tell early which it will be; (5) the rule he would apply now: write the exit criteria the day you fork. Takeaway: a fork is a dependency you now maintain; name the condition under which you delete it. Anchor on the four named forks and the public locomotion repo. Avoid inventing the reason for any fork, Autofleet internals beyond the public repo, invented upgrade-time numbers, and any claim that he drove the open-sourcing of locomotion.

**Anchors:** Autofleet/locomotion: open-source React Native + Node.js rider app, customizable for any ride-hailing operation; Forks: react-native-reanimated-bottom-sheet, react-native-drop-shadow, react-native-svg-view, babel-plugin-styled-components; GitHub achievements: Pull Shark x4 (merged PRs upstream); Founding Engineer at Autofleet 2020-2024; Published 'What Survived Four Years at Autofleet' covers architecture decisions; this is strictly dependency ownership

**Needs from the author:** The real reason for each of the four forks; Which upstream PRs got merged vs. stayed in his fork; Whether locomotion is still maintained after the acquisition

#### I Worked on a Product That Predicted What Would Break

`change-impact-analysis-to-owning-the-tests` · priority: **low** · shape: field-notes · tags: career, testing, retrospective

At Panaya (2016-2018) he was a full-stack engineer on an enterprise product whose entire premise was change-impact analysis: tell a large company what an upgrade will break before they run it. Now he owns E2E testing and code quality for a team of four, and the question 'what does this change touch?' is the same question, asked of a pull request instead of an ERP upgrade.

**Prompt**

> Write field notes connecting one idea across two jobs: change-impact analysis as a product, and test selection as a job. Open with what change-impact analysis is, in one paragraph at the public level: large companies fear upgrading core systems because nobody can say what will break, and a product exists whose whole job is to answer that. He was a full-stack engineer on that product, not its designer, and the post should say so. Beats: (1) the shape of the question the product answered, which code paths does this change reach, and why enterprises pay for it; (2) the same question on a four-person team: the blast radius of a PR, which E2E specs are worth running, and why 'run everything' is the answer until it is too slow; (3) the cheap approximations he reaches for now: lint rules and type checks as instant impact analysis, tagged Playwright specs, dependency-aware CI; (4) what the expensive version got right that the cheap versions do not, stated conceptually; (5) the honest limit: he borrowed the question, not the algorithm. Takeaway: most of testing strategy is impact analysis with a worse model, so be explicit about the model you are using. Avoid Panaya internals, its algorithms, customer names or scenes, any Tastewise CI specifics, and the 'what enterprise taught me' framing. Do not retell the CI export or Playwright posts; cross-reference in one line each.

**Anchors:** Software Engineer at Panaya (2016-2018), full-stack on an enterprise SaaS platform for change-impact analysis (public positioning only); Owns technical direction for E2E testing and code quality at Tastewise, team of 4; Playwright and Jest in his stack; published posts on CI telemetry and Playwright already exist; 'I'm the person who takes things apart to see how they work'

**Needs from the author:** How much he can say about Panaya's product beyond the public positioning, and what part he worked on; Whether he actually practises any form of test selection today or runs the full suite (either answer is fine, but the post must match)

*Reframed from an earlier draft idea: Reframed from panaya-enterprise-lessons-before-startup, which the judges called a management-blog genre with invented customer scenes. The salvageable part is the product itself: change-impact analysis is literally the question his testing job asks. The enterprise-mindset frame, the security-questionnaire scene and the three-instincts list are gone. Low because it depends on what he can say about a product he only worked on.*

### Personal tools and Telegram bots

#### My Home IP Is a Static File on GitHub Pages

`dynamic-dns-gh-pages-build-log` · priority: **high** · shape: build-log · tags: self-hosting, build-log, github-actions, security, side-projects

A build log of dynamic-dns-gh-pages, a TypeScript project that publishes a home IP address as a static file on GitHub Pages so his self-hosted services stay reachable without a DDNS account. Including the obvious objection: you are publishing your home IP.

**Prompt**

> Write a build log about dynamic-dns-gh-pages, Ofry's TypeScript project that uses GitHub Pages as a dynamic DNS record. Open with the itch: a home connection whose IP changes, a NAS full of services, and a refusal to sign up for yet another DDNS provider. Beats: (1) the core trick, a small file on a static host that always contains the current IP, and why a static file on a CDN is a perfectly good key-value store for one key; (2) the pusher side, what runs where to detect the change and commit it, and what it does when nothing changed; (3) the consumer side, which of his self-hosted services or clients reads the record; (4) the security objection he had to answer honestly: a public repo with a home IP is a public home IP, and what he did or did not do about it; (5) the failure he hit, such as Pages caching or a rate limit, and how the fix looked. One short snippet at most. Takeaway: free static hosting is infrastructure if you are willing to abuse it a little. Anchor on the repo, TypeScript, GitHub Pages and his Synology services. Avoid inventing the exact update frequency, his actual IP or domain, or a claim that this is secure for anyone else.

**Anchors:** dynamic-dns-gh-pages (TS) in his dev tooling repos; Self-hosts media/files on a Synology; Jellyfin, Seafile; GitHub Actions in his stack; objective-see/Malware starred (macOS security interest)

**Needs from the author:** How the repo actually works today: what pushes the IP and what reads it; Whether the record is public or obfuscated in any way; Whether it is still in use

#### Teaching an ESP32 to Talk to My Air Conditioner

`esp32-air-conditioner-ir-remote-build-log` · priority: **medium** · shape: build-log · tags: esp32, hardware, build-log, side-projects

A build log of the ESP32-AirConditioner fork: capturing the infrared protocol of a split AC remote, replaying it from an ESP32, and finding that the microcontroller is the easy part while the IR dialect is where the weekend goes.

**Prompt**

> Write a build log for the ESP32-AirConditioner fork: making an ESP32 control a split air conditioner over infrared. Open with the trigger, a Tel Aviv summer and a remote that is never in the room you are in, then move straight to the first thing that went wrong. Beats: (1) the parts on the bench, an ESP32, an IR receiver to capture, an IR LED and transistor to send, nothing exotic; (2) capturing the remote's protocol and discovering that AC remotes send the entire state (mode, temperature, fan, swing) in one long frame instead of a keypress, which changes the design; (3) the sending side, timing, carrier frequency, and the moment the AC beeped for the first time; (4) the control surface, a Telegram command or a tiny HTTP endpoint, chosen because that is what he always reaches for; (5) the honest state of the project, what works, what is held with tape, and what he would redo. Takeaway: the microcontroller is a solved problem; the protocol of the thing you are talking to is the actual project. Anchor on the fork, the ESP32, Tel Aviv, and his Telegram-bot habit. Avoid naming an AC brand or protocol the author has not confirmed, invented timings, and claiming the fork does things its code does not.

**Anchors:** ESP32-AirConditioner fork (C++); Lives in Tel Aviv (summers make AC control a real itch); ESP32/Arduino/ESP-IDF experience, esp-cyd-mcp; Telegram bots as his default one-user interface (remoteServerBot, esp8266-telegramBot); 'Little things for the fun of it'

**Needs from the author:** Whether he actually built and ran it, or only forked the repo; The AC brand and which IR library or decoding approach the build used; A photo or sketch of the wiring, if any exists; What the current state is: working daily, abandoned, or half done

#### The Wave Forecast Belongs on the Wall

`epaper-wave-forecast-display-build-log` · priority: **low** · shape: build-log · tags: esp32, hardware, build-log, side-projects

ForecastBot already pulls the Israeli wave forecast into Telegram. The next small build with parts on hand: an ESP32 driving an e-paper panel that shows the forecast on the wall, with e-paper lessons borrowed from crosspoint-reader, the open-source e-reader firmware he starred. A display with no input turns out to be a different product than a bot.

**Prompt**

> Write a build log for a glanceable wave-forecast display: an ESP32 and an e-paper panel on the wall, fed by the same forecast ForecastBot already posts to Telegram. Open with the small annoyance that justifies it, checking a bot message every morning when the answer could just be on the wall. Beats: (1) parts on the bench and why e-paper rather than the Cheap Yellow Display, readable in daylight, holds the image unpowered, looks like a thing rather than a gadget; (2) reusing ForecastBot's fetch and shaping the data into something that fits one screen; (3) the refresh economics, e-paper hates frequent redraws, forecasts change slowly, so the board sleeps most of the day and wakes to redraw; (4) what reading crosspoint-reader taught about driving the panel, partial refresh, fonts, ghosting; (5) the ugly first version on the wall and what still bothers him. Takeaway: a display with no input is a different product than a bot, and most of the design is deciding what not to show. Anchor on ForecastBot, crosspoint-reader, the ESP32, and the coast. Avoid invented power or battery numbers, claims about ForecastBot's data source unless the author confirms it, and retelling the Telegram-bots retrospective.

**Anchors:** ForecastBot (JS, 2023): a Telegram bot for wave forecast in Israel; Starred crosspoint-reader (open-source e-reader firmware); ESP32 parts and experience: esp-cyd-mcp, CYD community; Surfs or follows wave forecasts on the Israeli coast; Published 'Everything I Was Too Lazy to Build a UI For' covers the bots; this is the opposite move, a UI with no input

**Needs from the author:** Whether he owns an e-paper panel, and which one (size, driver); The build has to actually happen first; a photo of the result; ForecastBot's data source and whether it is still running; Which board he used and whether it is on battery or USB power

### macOS and self-hosting

#### The Recording Stays on My Mac

`mila-fork-local-whisper-transcription-macos` · priority: **medium** · shape: build-log · tags: macos, llm, build-log, tooling

Ofry forked mila, a native macOS app that runs whisper.cpp locally with optional speaker diarization, because he wanted recordings transcribed without uploading them anywhere. A build log of what he changed, what diarization actually gets right, and where local models still lose to the cloud.

**Prompt**

> Write a build log about Ofry's fork of mila, the native macOS transcription app built on whisper.cpp with optional speaker diarization. Open with the moment he had a recording he was not willing to upload to a transcription service, and the realisation that his Mac could do the job itself. Beats: (1) what mila already did when he forked it and why forking beat writing from scratch; (2) the specific change or fix he made in the fork, described at the level of code and build, including the first time it ran end to end; (3) what speaker diarization gets right and the kinds of audio where it labels the wrong person; (4) model size versus speed on his own machine, described qualitatively; (5) an honest verdict on whether he still reaches for it or falls back to a cloud service. Takeaway: local transcription is now a normal tool, not a demo, and the privacy win is real only if you actually use it. Anchor on the mila fork, whisper.cpp, diarization and his Swift-via-forks pattern. Avoid invented word-error rates, benchmark numbers, Mac model names unless he supplies them, and any claim about what Tastewise records or transcribes.

**Anchors:** mila fork: native macOS local transcription app (whisper.cpp) with optional speaker diarization; Swift appears in his stack via forks; 'Lately that's AI: wiring up LLMs, poking at what these models can actually do'; macOS power-user tooling

**Needs from the author:** What his mila fork actually changes compared with upstream; Which whisper model size he settled on and the Mac hardware he runs it on; Whether he still uses it, and for what kind of recordings (vague is fine)

#### The Menu Bar Is the Only Dashboard I Look At

`menu-bar-dashboard-menumeters-cidemon-vorssaint` · priority: **medium** · shape: field-notes · tags: macos, tooling, ci, side-projects

Field notes on treating the macOS menu bar as an ambient dashboard: a MenuMeters fork for CPU and network, a cidemon fork for CI jobs and deployments, and vorssaint-utils as the toolkit. What earns a spot next to the clock, what gets evicted, and why a lead of four wants CI status in his peripheral vision.

**Prompt**

> Write field notes on Ofry's macOS menu bar as a deliberately curated dashboard. Open with a description of what currently sits to the left of his clock and the rule that got each item there. Beats: (1) MenuMeters, a menu bar app older than many of his repos, why he keeps a fork alive instead of using a newer meter, and what he changed; (2) cidemon, forked to watch CI jobs and deployments, and why a glance at a coloured dot beats opening the GitHub Actions tab, framed from the perspective of someone responsible for E2E and code quality across a small team; (3) vorssaint-utils as the toolkit he reads when he wants to build a menu bar item of his own, and what makes a menu bar app different from a window app (no focus, no chrome, must be cheap); (4) things he evicted from the bar and why. Takeaway: peripheral vision is a scarce resource, and a menu bar item has to pay rent every day. Anchor on the MenuMeters and cidemon forks and vorssaint-utils. Do not re-explain gh-actions-hp, which has its own published post; a one-line cross-reference is enough. Avoid invented CI pipeline names, Tastewise internals and any claim about what his team's CI looks like.

**Anchors:** MenuMeters fork (macOS menu bar app); cidemon fork: monitors CI jobs/deployments from the menu bar; vorssaint-utils starred: macOS menu bar toolkit; Owns technical direction for E2E testing and code quality; leads a team of 4; macOS user who customizes the menu bar

**Needs from the author:** What his MenuMeters fork changes and which upstream fork it is based on; What cidemon watches for him and what he changed in the fork (CI provider, polling, UI); A current screenshot or honest description of his menu bar

#### The Fork Is the Receipt: Seafile on a Synology

`seafile-synology-self-hosted-sync-retrospective` · priority: **medium** · shape: retrospective · tags: self-hosting, retrospective, tooling

Ofry forked seafile7 to keep Seafile 7 installing on his Synology rather than use the vendor's own sync. A retrospective on what self-hosting file sync has actually cost over the years: DSM upgrades that broke the package, the fork he had to maintain, and whether he would choose it again today.

**Prompt**

> Write a retrospective on running Seafile on a Synology NAS, anchored on his seafile7 fork. Open with the decision point: a NAS that ships its own sync product, and his choice to run Seafile instead, stated with the reasons he had at the time. Beats: (1) what the seafile7 fork is for, in plain terms, and the DSM change that made a fork necessary; (2) the upgrade that broke it, described as a specific evening rather than a category of pain, and how he recovered; (3) the maintenance tax of being downstream of two moving targets, Seafile and DSM, and how long he kept paying it; (4) what he would choose today, whether Seafile in Docker, the vendor's sync, or something else, and the honest reason; (5) a nod, if it fits, to the blog's ethos about things that age and still work. Takeaway: self-hosting is a maintenance subscription paid in evenings, and the fork is the receipt. Anchor on the seafile7 fork, the Synology, and his broader self-hosting stack. Avoid invented storage sizes, DSM version numbers he has not confirmed, data-loss stories that did not happen, a year count in the title or body unless he supplies it, and any mention of work files.

**Anchors:** seafile7 fork: self-hosted file sync on Synology; Self-hosts media/files on a Synology; Self-hosting listed in his technical stack (Synology, Seafile, Jellyfin); Docker in his stack

**Needs from the author:** What the seafile7 fork changes and which DSM version it targets; Whether Seafile still runs on his NAS today, and what replaced it if not; The specific upgrade or incident that broke it

#### I Keep Rebuilding Arc Inside Firefox

`zen-arc-firefox-theming-morfix-greasemonkey` · priority: **medium** · shape: opinion · tags: macos, tooling, side-projects, opinion

An opinion piece on why Ofry stays in the Firefox lineage, from an ArcWTF theme to the Zen browser, and why a browser he can bend matters: the Search-in-Morfix add-on he wrote for Hebrew lookups and a Greasemonkey script that outlived the product it patched.

**Prompt**

> Write an opinion piece on why Ofry keeps choosing a browser he can bend over a browser that is polished, anchored on the Firefox lineage: the ArcWTF theme, the Zen browser, his Search-in-Morfix add-on and a Greasemonkey script called QuickSkype. Open with the admission that he has tried to make Firefox look like Arc more than once and is not sorry. Beats: (1) what Arc got right about layout and what he refused to give up to get it, which led to ArcWTF and later Zen; (2) Search-in-Morfix as the clearest case for a bendable browser: a Hebrew-English dictionary lookup he wanted at a keystroke, built as a one-user add-on and still useful years later, with at most one short snippet of its contextMenus handler; (3) QuickSkype as the counterexample, a Greasemonkey script that patched a web app which then changed under it, and what a dead script teaches about building on someone else's DOM; (4) the dark-mode and small-touches argument, that the browser is the screen he looks at most and should match his taste. Takeaway: a tool you can modify ages better than a tool you can only admire. Anchor on the named add-on, script, theme and browser. Do not retread the Wolt Chrome extension, which has its own post; mention it at most in passing. Avoid invented user counts, review quotes, or claims about Mozilla or Zen internals.

**Anchors:** zen-browser and ArcWTF Firefox theme starred; Search-in-Morfix: Firefox add-on to search the Morfix Hebrew-English dictionary; QuickSkype: a Greasemonkey script; Hebrew speaker in Tel Aviv; Dark mode preference

**Needs from the author:** Whether he currently runs Zen, themed Firefox, or both; What QuickSkype actually did and when it stopped working; Whether Search-in-Morfix is still installed and maintained

## Considered and dropped

Kept so the same idea does not get re-proposed.

- esp32-mcp-server-tool-design-lessons: already merged into the published 'Giving an LLM a Screen' (its excerpt carries the tool-design lessons); nothing left to salvage
- soldering-iron-to-websocket: twenty-year career sweep the judges called a LinkedIn arc; its RF material is better served by 'The Probe Changes the Circuit' and the OpenBTS retrospective
- twenty-years-taking-things-apart: the site bio stretched to essay length, every anecdote slot a placeholder; no sharper personal hook found that the OpenBTS and probe pieces do not already own
- llm-as-untrusted-client: consensus take by 2026 and its best material is in the published 'One MCP Server, Four Agents'; the Autofleet retry muscle memory alone cannot carry a post
- open-sourcing-locomotion-rider-app: the profile does not establish he drove the open-sourcing or fielded the first external issues; locomotion is covered by 'Three Forks and a Bottom Sheet' instead
- search-in-morfix-firefox-addon: thin thirty-line WebExtension tutorial; folded into 'I Keep Rebuilding Arc Inside Firefox' as one beat with one snippet
- self-hosting-seafile-jellyfin-hackmd: saturated homelab roundup with an invented switched-off list; replaced by the single-service Seafile-on-Synology retrospective
- forecastbot-wave-forecast-telegram: one-user-tool thesis duplicates the published Wolt post and ForecastBot is already covered in the Telegram retrospective; the e-paper display is the only forward move left
- enterprise-sso-from-the-vendor-side: merged into enterprise-sso-vendor-side-what-customers-ask-for (kept its protocol gotchas and admin-screen opinion, dropped the unsupported Panaya-2016 hook)
- reviewing-claude-code-diffs-team-of-four: merged into reviewing-diffs-written-by-claude-code (kept the CLAUDE.md beat, dropped the identifiable teammate anecdote)
- from-founding-engineer-to-lead-of-four: merged into founding-engineer-to-leading-a-team-of-four (kept the 'every answer given twice becomes a check' rule, dropped the stock leadership beats)
- gh-diff-forking-github-desktop-to-subtract (fresh): third idea on gh-diff/forks; its subtractive-fork opener now lives in the Claude Code review how-to and the fork-bill thesis is already in 'Three Forks and a Bottom Sheet'
- quick-look-markdown-source-code-macos (fresh): a thin install-and-configure tutorial for two starred tools; the two-second-friction opinion is not enough to lift it, and the mac angle is already well covered
- macos-audio-routing-blackhole-eqmac-finetune (fresh): generic three-tool how-to whose only personal anchor (feeding mila) is already in the mila build log, and the record-the-other-side-of-the-call framing needs consent caveats that would eat the post

