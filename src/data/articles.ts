import type { Article } from '../types/article'

export const articles: Article[] = [
  {
    id: 'wolt-checker-bot-to-chrome-extension',
    title: 'I built the Wolt checker twice and ran it in the wrong place both times',
    excerpt: 'A forked Telegram bot that needs a server, then a Chrome extension that needs an open lid. Two versions of a one-user tool, and the maintenance bill for each.',
    content: `Thursday night, and the one place I actually want is showing the "Schedule order" button on Wolt. So I refresh. Four minutes later I refresh again. A person doing a cron job's work, badly.

**Round one: the fork**

I didn't start the Telegram bot from scratch. I found a Wolt checker bot on GitHub - a Python project from 2020 - forked it, and rewrote it in Node in July last year, keeping the idea and throwing out the code. It runs on \`node-telegram-bot-api\`: you send it a restaurant name, it hits Wolt's search API, and if the venue is closed it offers to register you. You say yes and it writes a row to SQLite. A second process re-runs that same search every ten seconds for every registered slug, with a hardcoded Tel Aviv lat/lon, finds the venue in the results, and messages you when \`venue.online\` flips to true. Search as a status endpoint. It's all in [wolt-checker-bot](https://github.com/OfryL/wolt-checker-bot).

That \`online\` boolean is the best part of the whole design. The API tells you the truth directly - no guessing from a web page.

The worst part is everything around it. Two long-running processes in a \`docker-compose\`, a bot token in an env file, a SQLite volume to not lose, and a machine that stays on for all of it. For a tool whose entire job is "tell me when the shawarma place is back", that's a lot of infrastructure to keep breathing. And in December Wolt moved the endpoints under me. The bot was fine. Hosting it was the job.

**Round two: the extension**

The browser already had the restaurant page open and was logged in to Wolt. There was no reason to run a server to fetch a page sitting in a tab in front of me.

So in August last year I built it as a Chrome extension: Manifest V3, a content script matched on \`https://wolt.com/*\`, a service worker in the background. The content script inspects the page three and five seconds after load, then on its own 30-second timer, decides whether the restaurant is open, and sends a \`statusUpdate\` message to the background. The background compares that to the last status in \`chrome.storage.local\` and, on the closed-to-open transition, fires a desktop notification and stops monitoring, with no server or token anywhere. A popup with a URL field and an interval, and that's it.

The part I'm least proud of is "decides whether the restaurant is open". The bot had a boolean. The extension has to read the page the way a human does:

\`\`\`js
// content.js, trimmed
const dialogClosed = [...document.querySelectorAll('[role="dialog"]')]
  .some(d => /not accepting orders/i.test(d.textContent));
const estimate = [...document.querySelectorAll('*')].some(el =>
  /\\d+[-–]\\d+\\s*min/i.test(el.textContent) &&
  !el.closest('[role="dialog"], [class*="schedule"]'));
const offline = [...document.querySelectorAll('*')].some(el =>
  el.textContent.includes('Offline') && el.childNodes.length <= 3);
// "Schedule order" buttons and Offline only matter when there's no estimate
const isScheduleOrder = dialogClosed || !estimate;
\`\`\`

A delivery estimate like "15–25 min" means open. No estimate means closed. The dialog overrides both. This week I overhauled all of this (v1.4.1), and the changelog in the README is mostly me being wrong about what open looks like - a version where "Add" buttons for a future order counted as open, a version where the "not accepting orders" dialog showed up after my check had run, hence the five-second check. I traded a clean signal for a free host.

The second wart is in \`background.js\`. There's also a \`chrome.alarms\` clock in the service worker, and the popup's interval field only reprograms that alarm. The alarm handler fetches the restaurant page and hands it to \`DOMParser\`, which doesn't exist inside a service worker. That path lands in a \`catch\` and logs. So the knob in the popup adjusts the path that never works, and the path that works is a hardcoded \`setInterval\` in the content script. It's all in [wolt-checker-chrome-extension](https://github.com/OfryL/wolt-checker-chrome-extension), warts included.

**Where the extension falls over**

It only works while the laptop is awake and the tab is open. Close the lid at 10:30 and the content script's timer sleeps with everything else. Leave the tab in the background and Chrome throttles it. A notification on a closed lid helps nobody, and the place that opened at eleven is closed again by the time I see it.

Which is why the bot never went away. I kept patching it for months after the extension's first version - new endpoints in December, \`dotenv\` in January - and then came back to the extension this week. Two tools, taking turns being the one that's running.

**What each one charges**

For a tool with one user, build time is almost free. The cost is a year of on-and-off tinkering, and each one charges for it differently:

- The bot wants a machine that stays on, a token, a database, and an API that keeps its shape.
- The extension wants a tab that stays open, a laptop that stays awake, and a DOM that keeps its shape, which it won't, because the DOM was never a signal in the first place.

The question I should have asked up front was "which one will still be working in six months without me touching it".

The next step is probably the bot again - just the notify service and the \`online\` boolean, on the Synology that's on anyway. Or I keep refreshing the tab on Thursdays. It's worked so far.`,
    date: '2026-09-29',
    draft: true,
    image: 'https://images.unsplash.com/photo-1617347454431-f49d7ff5c3b1?w=800&q=80&auto=format&fit=crop',
    tags: ['telegram', 'chrome-extension', 'side-projects', 'tooling']
  },
  {
    id: 'one-mcp-server-four-hosts',
    title: 'One MCP Server, Four Agents',
    excerpt: 'Four fresh agents, one Cheap Yellow Display, one tool list, one prompt: write "hello". I got a greeting, a greeting with a bonus sensor reading, and a barcode. Notes on grading the trace before the prose.',
    content: `The Cheap Yellow Display on my desk has a 320 by 240 screen, and I've now watched the word "hello" get drawn on it four different ways.

Same [esp-cyd-mcp](https://github.com/OfryL/esp-cyd-mcp) firmware, same tool list, same one-line prompt. The firmware still speaks its own dialect - it answers \`tools/list\` and \`tools/invoke\` over a WebSocket, and the \`initialize\` call every real host sends first still gets a polite \`Method not found\`. I [wrote up in March](https://ofry.net/blog/article/esp-cyd-mcp-build-log) why no real host can finish the handshake with it, and six months later none can; [MCP Inspector](https://github.com/modelcontextprotocol/inspector) over a \`websocat\` bridge confirms it on the first message. So the four runs went through a throwaway script of mine: a model's API on one side, the board's WebSocket on the other, every tool call forwarded as-is. A couple of models, fresh session each.

Four runs. One called \`display.text\` once and was done. One called \`display.clear\` first, which I appreciated. One drew the text, read a sensor it had no reason to read, and drew the text again. One never reached for \`display.text\` at all - it found \`display.rectangle\`, decided it could build letters out of that, and produced something closer to a barcode.

The server did the same thing every time: listed its tools, ran the ones it was asked to. None of that told me how the board would actually get driven. The protocol is the part everyone shares. The agent on the other end of it isn't, and the agent is what decides which tool to pick.

Work is the same story with more at stake. Tastewise's MCP integration runs inside ChatGPT, Claude, Copilot and Gemini - four hosts, none of which can reach a board on a desk, all of which want a public endpoint. That's the side I spend my days on, so the CYD is where I learn the lesson cheaply, and the lesson so far is that the agent rarely does what I pictured while writing the tool description.

**What they do, and what they don't**

Every run I've watched reads the tool list. If a description matches the question closely, the agent calls the tool, usually with sane arguments. It'll chain two or three calls when the task obviously needs it: read a sensor, then draw the value. And the summary at the end is always nicely written, whatever happened underneath it.

Then it gets thinner.

Nobody checks that a result makes sense. There's a temperature tool, and the sensor isn't plugged in. The firmware doesn't know that - it reads the floating pin, converts whatever voltage it finds into degrees, and hands back a number that looks like a temperature. The agent reports it as the room temperature with a straight face.

Partial results get rounded up. Ask \`touch.getHistory\` for the last ten touches, get three back, and the summary describes ten.

Stopping is hard in both directions. Some sessions keep calling tools after they have enough; others stop one call early and backfill the gap with prose.

Constraints decay, too. Tell the agent on turn one never to write to the SD card, and by turn ten the instruction has quietly fallen out of whatever it's paying attention to.

None of this is the protocol's fault. The gap is between what the agent actually did with your tools and what it says it did, and that gap moves from agent to agent.

**Grade the trace, then the prose**

I used to grade the final answer. It turns out to be the worst place to look, because a fluent paragraph hides a broken call sequence underneath it. The agent that drew a barcode wrote a lovely sentence about my greeting.

So now I read the transcript bottom up, tool calls first, prose last. On the CYD that's nothing fancy: a serial monitor open next to the chat, and a short list of boring checks. Whether \`display.text\` was called at all, and whether it was called once or in a loop. Whether the arguments matched the schema. Whether the touch count in the serial log is the count in the answer. I've also tried handing the transcript to another model and asking it to grade the prose, and I've watched it nod along with a wrong answer often enough that I treat its verdict as a suggestion.

**Write for the least careful caller**

You don't get to pick the agent, so every tool gets written for the least careful one that'll ever call it. Descriptions say when a tool is the wrong choice, not only what it does. I wrote that rule in March. The temperature tool proves I hadn't applied it to my own firmware. Return values should make a bad call look bad. The temperature tool is the worst offender. An analog pin can't tell me whether a sensor is attached, so the fix lives in the description: the value is raw, and it means nothing without a sensor on the pin. \`touch.getHistory\` should say "3 of 10 requested" right in the payload, in words the model would have to actively ignore.

The agent will also change under you with no changelog. The only defense I know is the boring one: rerun the same dumb hello prompt after every update and see whether the call sequence shifts.

I still haven't got all four runs to draw "hello" the same way. The barcode is still on the screen.`,
    date: '2026-09-02',
    draft: true,
    image: 'https://images.unsplash.com/photo-1761496847215-46592435aab0?w=800&q=80&auto=format&fit=crop',
    tags: ['mcp', 'agents', 'llm', 'evaluation']
  },
  {
    id: 'hardware-has-no-undo',
    title: 'Hardware Has No Undo',
    excerpt: 'A capacitor I soldered in backwards taught me to decide how I\'ll know a thing is broken before I ship it. It\'s why a flaky Playwright test bothers me the way a cold solder joint does.',
    content: `The smell gets to you before the understanding does. Hot plastic, a whiff of electrolyte, and an electrolytic capacitor on the bench that's now a slightly different shape than the one I soldered in. I'd put it in backwards. The circuit didn't throw or print anything. It just stopped being a circuit, and shortly after that it stopped being quiet.

That was the era of a bench covered in parts I had no datasheets for, most of them salvaged and a few of them already warm. The lesson that stuck had nothing to do with polarity. Hardware fails silently by default. If you want to know why it stopped, you have to have arranged that before it stopped - afterwards there's nothing to ask.

**A serial port and a status screen**

The most recent place I relearned this was [esp-cyd-mcp](https://github.com/OfryL/esp-cyd-mcp), the firmware that turns a Cheap Yellow Display into an MCP server over WebSocket. My debugger was a serial monitor at 115200 baud and the board's own screen. When the ESP32 panics you get a Guru Meditation Error and a backtrace of hex addresses, which is only useful if you kept the matching ELF and run the addresses through the decoder. More often you get nothing useful: a one-line reset reason, no context, and the board rebooting while the client on the other end waits politely for a reply that's never coming.

So the firmware tells on itself wherever I could make it. The serial log says when a client connects and disconnects and prints touch coordinates as they come in. At boot the display paints the board's IP, WebSocket port and WiFi state onto the TFT, and the main loop keeps the clock and signal bars fresh while it's connected.

That's less than it sounds. The drawing and GPIO tools still don't narrate what they're doing, and if the WiFi drops, the screen doesn't say so - the clock just stops moving. There's even a FreeRTOS display task in there, pinned to core 0, whose body is a comment about what it could do someday. Ugly, but when the thing you're debugging physically can't tell you what went wrong, ugly is what you have. And the gaps are exactly the places where it will fail without telling me.

**A cold solder joint and a flaky test**

I lead a team of four now, and the Playwright suite is one of the things that lands on my desk when it goes red. A flaky test bothers me the way a cold solder joint does, and for the same reason.

A cold joint looks fine from a foot away. It passes the continuity check when you press the probe against it. Then the board warms up, the joint opens, and the bug you're chasing moves somewhere else. A test that passes on retry is the same thing. It goes green, nobody looks, and whatever race it was pointing at keeps running in production with no one watching.

So what I push for in any Playwright config I get a say in is mostly the serial-monitor instinct:

- Trace and video on first retry, so a failure arrives with evidence instead of a screenshot of a blank page.
- No \`waitForTimeout\`. If the test needs to sleep, it doesn't know what it's waiting for, and neither do we.
- Test names that say what the user did, so the CI log reads like a story at 2am on a phone.
- \`retries: 1\`, and only so that trace exists. A test that needed the retry is a cold joint that happened to hold this time, and I want it reported as one.

**Software does have undo**

A bad release is a revert and a few minutes of your afternoon, not a puff of smoke. Plenty of good engineers ship fast on that basis and never need the paranoia a breadboard forces on you, and for a lot of code that's the right call. The paranoia isn't free, either. It costs features you didn't build.

The catch is that undo only helps if somebody noticed. Nobody reverts a deploy that looks fine from a foot away. What the breadboard drills into you is knowing, early and loudly, that you need to.

So the one rule I carry over from the bench: before you ship the thing, decide how you'll know it's broken. I don't always follow it. The Wolt checker extension still narrates every step of its restaurant-status detection to the console - restaurant detected as open, found the schedule button - exactly as it did the night I plugged it in and watched it work. Watching it work is the easy part. The capacitor would point out that's the wrong thing to be watching for.`,
    date: '2026-08-09',
    draft: true,
    image: 'https://images.unsplash.com/photo-1521798604188-0d6595d6d6ae?w=800&q=80&auto=format&fit=crop',
    tags: ['hardware', 'testing', 'opinion']
  },
  {
    id: 'playwright-e2e-with-llm-in-the-loop',
    title: 'Playwright E2E with an LLM in the Loop',
    excerpt: 'A model is consistent right up until it isn\'t. Stubs at the network boundary, a twelve-line SSE mock server, and exactly one @live spec.',
    content: `The first assertion anyone writes against a chat UI is on the words. The reply starts with "Based on" every run for a week, so the spec asserts that the reply starts with "Based on". Then it goes red. Nobody touched the feature. Re-run: green. Re-run: red. The model has decided that "Looking at" is also a perfectly good way to begin a sentence, and it's right, and the test is wrong.

I'd love to say I've never written that assertion. That's the trap: a model is consistent right up until it isn't, and an E2E suite that leans on that consistency is a slot machine with a nicer UI.

**The model endpoint is a network boundary**

The rule I landed on: nobody lets an E2E test hit a real payment gateway or a real email provider, and the model gets the same treatment. The suite stubs it. Whether the model gives good answers is a different question, and whoever wrote the prompt answers it with evals.

Obvious once it's said out loud. It was not obvious to me for a good while.

**Streaming is where the obvious answer stops working**

My first attempt was the standard Playwright move: \`page.route\` on the model endpoint, \`route.fulfill\` with a recorded JSON body. \`page.route\` only sees requests the browser makes; if a backend calls the model instead, the stub belongs there. For plain request-response calls, \`route.fulfill\` is fine and I'd do it again.

For a streamed reply it looked like it worked, which is worse. \`route.fulfill\` hands the browser one complete response. The body lands in a single piece, the app's stream reader gets everything on its first read, and the code that deals with a real stream - an event split across two reads, the typing indicator that should show between events - never runs. Green test, streaming path never exercised. The slot machine again, only this one always pays out green.

So the streamed fixtures come from something that can actually stream: a tiny local mock server. It reads a recorded SSE file and writes it out in 64-byte slices with a small delay between them, so events land split across reads the way they do over a real connection.

\`\`\`js
const http = require('node:http')
const { readFileSync } = require('node:fs')
http.createServer((req, res) => {
  const body = readFileSync(\`fixtures\${req.url}.sse\`)
  res.writeHead(200, { 'Content-Type': 'text/event-stream' })
  let offset = 0
  const tick = setInterval(() => {
    if (offset < body.length) return res.write(body.subarray(offset, (offset += 64)))
    clearInterval(tick)
    res.end()
  }, 40)
}).listen(4010)
\`\`\`

It's deliberately minimal. There's no 404: an unknown path throws inside the handler, the process dies, and Playwright reports a connection error instead of the real problem. One try/catch fixes that; I left it out to keep the snippet short.

Playwright's \`webServer\` option in \`playwright.config.ts\` accepts an array, so the mock sits next to the dev server entry and starts and stops with the run. The dev server already proxies the endpoint path to the real backend, and in the test run that proxy target becomes \`localhost:4010\`. The browser never talks to the mock directly - same origin, no CORS preflight to argue with. No test-only branches inside the app.

The fixtures are real responses, captured once from the actual model and saved as files. I hand-edited a couple too: a stream that stops before its terminal event - which only reads as a failure if the protocol has one, and the common streaming APIs do - and one with a chunk of garbage that isn't valid JSON. The model never produced those on request, and they're the cases I most wanted covered. A socket that actually drops mid-stream is a different animal, and the mock doesn't do that one yet.

Fixtures as files in the repo created a habit I like. They live next to the spec they serve. When someone changes the prompt, they re-record the fixtures on purpose, in the same PR, and the diff of the recorded stream gets read like any other code. If nobody remembers recording a fixture, it has probably been wrong for a while.

**Assert on the shape, never the words**

With the words out of the picture, what's left is the UI around the answer:

- the answer rendered and isn't empty
- the typing indicator showed while the fixture was mid-stream and was gone by the end
- the malformed-chunk fixture ends in an error state, not an uncaught exception
- the input re-enabled once the stream finished

None of those care whether the sentence begins with "Based on". If I catch myself writing \`toContainText\` against model output again, that's the signal the assertion belongs in an eval and should leave the suite.

**One live test, on its own schedule**

I keep exactly one spec that hits the real model. It's tagged \`@live\`, the PR run excludes it with \`--grep-invert @live\`, and it runs on a schedule of its own. When it fails, that's information about the model or the provider - a changed default, an expired key - and nobody re-runs it hoping it turns green, because nothing in the code moved.

What I haven't solved is drift: a fixture recorded in March is a faithful picture of March. I have half a plan to make the live run diff its response shape against the newest fixture and open an issue when they disagree. Until then the March fixture is the March model, and I re-record when the diff tells me to.`,
    date: '2026-07-15',
    draft: true,
    image: 'https://images.unsplash.com/photo-1762776531550-b7baa9bcf361?w=800&q=80&auto=format&fit=crop',
    tags: ['playwright', 'testing', 'llm']
  },
  {
    id: 'esp8266-telegram-bot-that-half-worked',
    title: 'The ESP8266 Telegram Bot That Half Worked',
    excerpt: 'A weekend sketch that let me text an ESP8266 from my phone, when it wasn\'t resetting itself. It took me eight years to notice I\'d written the same loop for esp-cyd-mcp.',
    content: `The first chat message I ever sent to a microcontroller was "hi". A few seconds later the ESP8266 on my desk blinked its LED and sent "hi" back, and I sat there grinning at a two-dollar chip that had just answered me.

This was a weekend project, the kind I still do. ESP8266 modules were a couple of dollars by then, with WiFi on board, and Telegram's Bot API was basically "poll this HTTPS endpoint, get JSON". I had just pushed remoteServerBot, a bot for commanding a remote server, and it ran on a real computer with a real amount of RAM. The idea that the same kind of thing could run on a chip with less memory than a browser tab was too good to leave alone. I had to try it.

The sketch connected to WiFi, called \`getUpdates\` in a loop, picked the text out of whatever JSON came back, and replied. I could type a command on my phone from anywhere and an LED on my desk would flip. That was the entire feature list, and I was thrilled with it.

The part that didn't work was everything around the edges. The Bot API is HTTPS only, and a TLS handshake on an ESP8266 eats a stupid chunk of the heap. I watched the free-heap number in the serial monitor drop every time the bot polled, then come back, then come back a little less. Replies arrived most of the time. A long message, or a few messages queued up while the chip was busy, and it would reset itself and reconnect a few seconds later as if nothing had happened. I never figured out whether it was the TLS buffers or me being careless with \`String\` objects on a heap that small. Probably both.

Then there was the certificate problem. The chip had no sane way to verify Telegram's certificate chain, so I did what everyone did at the time and skipped verification entirely. For a bot that toggled an LED, that felt fine. It still does, mostly.

I never finished it, and I never planned to. The point was to find out whether a chip could hold up its end of a chat, and it could, barely. Once I knew that, I was done, and something else was already on the desk.

There's a repo on GitHub called [esp8266-telegramBot](https://github.com/OfryL/esp8266-telegramBot). It's empty. I created it in June 2018, meant to push the sketch, and never did. I'm writing this from memory because there's no commit log to check. The sketch itself, if it survives, is on an old laptop somewhere. I've thought about digging it out and pushing it. I haven't. An empty repo with a name on it is an honest record of where I got to: far enough to want to share it, not far enough to actually do it.

Lately my current board is an ESP32 Cheap Yellow Display, and the thing I put on it is [esp-cyd-mcp](https://github.com/OfryL/esp-cyd-mcp): an MCP server running on the chip, over WebSocket, so an LLM can draw on the screen, read the touch panel, and poke at GPIO.

It took me until this spring to notice that this is the same program, eight years later.

A \`tools/call\` request in MCP is a JSON message that arrives, names a thing to do, and expects a JSON reply. The firmware waits for a message, does the thing, answers. That's the loop I wrote for the Telegram bot. The ESP32 has far more RAM, the WebSocket stays open instead of polling an HTTPS endpoint every few seconds, and the messages are JSON-RPC instead of Telegram update objects. None of that changes the loop.

What changed is the sender. Back then it was me on a phone typing a command. Now it's a model that has read the tool list and decided, on its own, that the right next step is to write a pixel or read a pin. The chip doesn't know the difference, and it shouldn't have to. Firmware that only ever sees JSON in and JSON out doesn't care who's typing, which is exactly what makes it worth plugging a model into.

There's probably still an ESP8266 in a drawer somewhere. If I ever find the old sketch on whatever laptop it's on, I'll flash it and see if the chip still answers "hi". My bet is that it does, and then crashes on the first long message.`,
    date: '2026-06-21',
    draft: true,
    image: 'https://images.unsplash.com/photo-1634452015397-ad0686a2ae2d?w=800&q=80&auto=format&fit=crop',
    tags: ['esp8266', 'telegram', 'hardware', 'side-projects']
  },
  {
    id: 'ten-years-of-telegram-bots',
    title: 'Everything I Was Too Lazy to Build a UI For',
    excerpt: 'Years of one-user bots, from an ESP8266 to a wave forecast and a Wolt checker. The ones I\'d rebuild without thinking do one dumb thing and never needed a database.',
    content: `Somewhere in my Telegram there is a conversation with BotFather that goes back a long way. Scroll up far enough and it turns into an archaeological dig: \`/newbot\`, a name, a username, a token, repeat. Half the names I don't recognize anymore. Every one of them was a UI I didn't want to build.

**A wrapper, then a chip**

Somewhere in that pile on GitHub is a Java wrapper around the Telegram Bot API. I wanted to call the API from Java without thinking about HTTP, so I wrapped it. It had no ambition beyond that, and I don't think it ever grew any.

Then there's the ESP8266 bot. I had a microcontroller with Wi-Fi and wanted a way to poke it that didn't involve sitting at a laptop. The realistic options were a web page served from the chip, a native app, or a chat. The chat won in about a minute. Telegram already had the app, the login, the push notifications, and a UI that worked on every device I owned. All the chip had to do was talk to \`api.telegram.org\`, and even on an ESP8266 that was less work than an app.

I had a thing. I wanted to talk to the thing from my phone. That was the whole pattern, and it held for everything after.

**Remote controls with a built-in audit log**

The pattern produced a cluster of bots that are really just remote controls. remoteServerBot ran commands on a server I didn't want to SSH into from a phone keyboard. connectionControllerBot managed and monitored a Unix network interface - bring it up, bring it down, tell me what it's doing right now. deluge-telegramer is the odd one out: a fork of a Deluge plugin that messages you when a torrent finishes, so it talks first instead of waiting to be asked. I've poked at Deluge itself, so forking the plugin and bolting on what I wanted felt like home ground.

The rule, which I never wrote down: a bot is a remote control with an audit log you get for free. Every command I sent is still in the chat. Every reply the server gave is right under it. I have never once wanted that history and not had it, which is more than I can say for my shell history.

A bot with exactly one user also needs barely any security model, which is a bigger part of the appeal than I'd like to admit. For anything bigger that stops being true, and I've mostly avoided building anything bigger.

**The ones that exist because a website was too far away**

utcnowbot replies with the current UTC time, and does nothing else. hebTranslateBot translates to and from Hebrew. ForecastBot, from 2023, gives me the wave forecast for the Israeli coast, so whether it's worth getting up early gets answered in a chat instead of a browser tab. There's a fork of a Wolt checker bot that tells you when a restaurant opens or starts delivering - a problem that only matters when you're hungry, and matters a lot right then. There's also a Snake bot. Telegram has a games platform, and Snake was the smallest game I could think of to find out what it took.

I could defend each of these as a product. I won't. They exist because writing a bot took less time than finding the right website and remembering to open it, and because a bot shows up in the same place my messages do.

**The quiet way a bot dies**

Some of these have surely stopped by now. I'd have to open each chat and send a command to find out which, and I haven't, partly because I suspect I'd rather not know the number.

What I do know is how quietly it happens. When a web app dies, you notice. There's a URL that 404s, a domain that lapses. A dead bot just stops talking. The chat is still there, and one day you scroll past it and the last message is from years ago. Nothing nags you to fix it, so you don't, which is its own small guilt.

Looking at which ones I'd rebuild in an afternoon without hesitating, they have a shape in common:

- one command, or close to it
- no database - state lives in the chat or doesn't exist
- one server, one chip, or one website on the other side, never two
- nobody but me allowed in

The ones I remember fighting with wanted more than that. A second feature wants a config, and a config wants a settings command. Then the settings command wants state, and you're running a service instead of a remote control.

At work I spend a lot of time on tool surface area - what an MCP server should expose, what an agent actually needs versus what's easy to bolt on. Same question, different pile of parts. I still have the BotFather chat open. There's almost certainly another one coming.`,
    date: '2026-05-27',
    draft: true,
    image: 'https://images.unsplash.com/photo-1662974770404-468fd9660389?w=800&q=80&auto=format&fit=crop',
    tags: ['telegram', 'side-projects', 'retrospective']
  },
  {
    id: 'autofleet-what-survived-four-years',
    title: 'What Survived Four Years at Autofleet',
    excerpt: 'Four years of building Autofleet\'s platform from zero. Looking back at which early decisions held up, the split wasn\'t the one I\'d have guessed.',
    content: `I joined Autofleet in 2020 as a founding engineer, when the platform didn't exist yet. React and Node on GCP, an empty repo, and a lot to build.

By 2024, when Element Fleet Management acquired the company, I'd watched four years of that code grow: some of it rewritten, most of it extended. Afterwards I did what I do with anything that has been running for a while, and took it apart in my head to see which parts had held. The answer wasn't the one I'd have predicted.

One caveat. That codebase belongs to someone else now, so I won't describe actual services or specific decisions. What I can describe is the shape of what lasted and the shape of what didn't, because I keep running into the same shapes in every codebase since.

**What held**

The plain data model. Anything that simply described the world as it was, what a vehicle is and when something happened to it, barely changed in character over four years. It got added to. It didn't get replaced. Every clever thing built later sat on top of it, and when a clever thing was removed, the plain layer underneath stayed.

The line between reacting and thinking. A fleet platform has two very different jobs: respond to what vehicles are doing right now, and spend a while on an optimization problem. They have different performance needs and don't belong in the same loop. Where that line was drawn clearly, either side could be swapped out without the other noticing. It costs almost nothing to draw early and a lot to draw late, and it's the first thing I look for now when I open a codebase I didn't write.

The boring stack. React, Node and GCP weren't an interesting choice in 2020, and they were still the stack four years later. I spent most of my energy on the product and almost none on the stack, which is roughly what you want from a stack.

**What didn't**

Abstractions for things that hadn't happened yet. I'll own this one. I had a habit, stronger in 2020 than now, of building the generic version because I could imagine a case the specific one wouldn't handle. The imagined case is always vivid, and the code built for it always looks clean, because nobody has used it. Then every real change has to go through a layer that serves exactly one implementation. I've removed enough of my own layers like that to recognize the pattern early now.

Anything only I understood. Setup that lived in my head, config that was correct only if you knew why. That works for a weekend project. On a platform other people have to run, it gets replaced sooner or later, and the replacement is always simpler and better.

**The pattern**

I kept looking for a more flattering lesson than "the simple parts lasted", and from every angle, that's the lesson.

If I started from an empty repo tomorrow, I wouldn't try to write more polished code. The early, unpolished code mostly held. I'd draw the reacting-versus-thinking line on day one, because that's when it's cheap. I'd be slower to build for a client I'd only imagined. And I'd write down the things only I knew while I still remembered why.

I still get the itch to write the generic version. These days I write the specific one, leave a comment where the seam would go, and wait to see if anyone needs it. Mostly nobody does.`,
    date: '2026-04-08',
    draft: true,
    image: 'https://images.unsplash.com/photo-1499744349893-0c6de53516e6?w=800&q=80&auto=format&fit=crop',
    tags: ['autofleet', 'career', 'architecture', 'retrospective']
  },
  {
    id: 'esp-cyd-mcp-build-log',
    title: 'Giving an LLM a Screen',
    excerpt: 'I put an MCP server on a cheap ESP32 display so a model could draw on it. The interesting part wasn\'t the pixels, it was deciding what a tool should refuse to do.',
    content: `A model calls \`display.rectangle\`, and a rectangle shows up on a 2.8-inch screen on my desk that cost less than lunch. That's [esp-cyd-mcp](https://github.com/OfryL/esp-cyd-mcp): firmware for the ESP32 "Cheap Yellow Display" that turns the board into an MCP server, so an LLM gets a screen, a touch panel, a few GPIO pins and a tiny speaker as tools.

The repo has one commit, \`init\`, and nothing since. The protocol handling in it is wrong in enough places that a real desktop host can't finish the handshake, and only the two example clients in the repo can talk to it. I'm not going to walk through the bugs. What stuck with me was what the board taught me about tools, and that part doesn't depend on the firmware being right.

**A tool is a promise about the world**

An API for a cloud service can be sloppy and nobody dies. An API for a chip is different, because the caller can physically break something. The display's SPI bus and its chip-select lines are the obvious example: write the wrong pin and the screen stops listening to its own driver. So \`gpio.pinMode\` has a fixed list of pins it's willing to touch and refuses everything else with a plain message.

That refusal is the most useful line in the firmware. A model will try things. The question isn't whether to let it, it's whether the tool says no clearly enough that the model can try something else.

**Names over flags**

The display tools are \`display.rectangle\` and \`display.fillRectangle\`, not one tool with a \`fill\` boolean. The same for outline and fill circles. A flag is the kind of argument a model drops when it's busy thinking about something else. A tool name is harder to forget, and a wrong tool name fails loudly instead of drawing the wrong shape.

**Errors belong to the model**

Every handler in the \`init\` commit returns something like \`{"success": false, "error": "Buzzer is disabled"}\`. A host doesn't know what to do with that, so it gets passed along as a mystery, if at all.

MCP splits errors in two. Protocol errors go back as JSON-RPC errors, and the host keeps those for itself. Tool failures go back as a normal result, marked as an error, with text the model can read. The difference matters more than I expected: "Buzzer is disabled. Call audio.enable first, then retry" is an instruction the model can act on, on its own, without me in the loop. That is the whole point of giving it a tool rather than a button.

**The description is the interface**

The host checks arguments against the schema. The model mostly reads the description string. Mine for \`audio.tone\` says \`Duration in ms (0 = continuous)\` and leaves it to the model to discover that there's a \`stopTone\` tool, and says nothing about the fact that a long tone blocks the board until it finishes, because that little amp runs in the same loop as everything else.

A tool description written for the person who built the board is useless to a model that has never seen it. The repo got listed on a couple of MCP directories, next to cloud APIs, so people I'll never meet are flashing my one commit and letting a model loose on their GPIO pins. Every description has to say what the tool refuses to do, for a reader who has only the description.

**What carried over**

Those two rules, refuse clearly and return errors the model can read, are the ones I took into the MCP servers I build at work, where the hosts are real and the handshake has to finish.

Fixing the firmware is a weekend. The board still has one commit, and a model can still draw a rectangle on it, which was the point.`,
    date: '2026-03-01',
    draft: true,
    image: 'https://images.unsplash.com/photo-1789036069459-f1a0c50739a6?w=800&q=80&auto=format&fit=crop',
    tags: ['esp32', 'mcp', 'build-log', 'hardware']
  },
  {
    id: 'export-github-actions-runs-org-wide',
    title: 'The Whole Org\'s CI in One JSON File',
    excerpt: 'The GitHub UI shows one repo at a time, useless when "CI is slow" spans more repos than fit on a screen. So I wrote gh-actions-hp to dump every repo\'s recent runs into one JSON file and look before touching a cache key.',
    content: `Eleven browser tabs, every one a different repo's Actions page, and I still couldn't answer the one-line question from the team channel: is CI actually slower this week, or does it just feel that way?

The GitHub UI is built for one repo and one workflow at a time. It falls apart once the pipelines are spread across more repos than fit on one screen, each with its own test job and its own idea of what "slow" means.

So I wrote a script: [gh-actions-hp](https://github.com/OfryL/gh-actions-hp). The README calls it a "Github oragnization level actions fetcher", typo included. It does one thing: walk every repo in an org, pull the recent workflow runs for each, and dump it all into one JSON file.

**The API underneath**

Two endpoints do all the work. \`GET /orgs/{org}/repos\` lists repositories, 100 per page. Then for each repo, \`GET /repos/{owner}/{repo}/actions/runs\` hands you the runs, newest first. It's Octokit via \`@actions/github\`, and the repo loop is the only part with any logic in it:

\`\`\`js
let page = 0;
let res = ['init'];
while (res && res.length !== 0) {
  ({ data: res } = await octokit.rest.repos.listForOrg({
    org: ORG, type: 'all', per_page: 100, page,
  }));
  page = page + 1;
  allRes.push(...res);
}
\`\`\`

Pagination first: you loop on \`page\` until the endpoint returns an empty array. Mine starts counting at 0, which GitHub treats as page 1, so the first hundred repos come back twice, and any of them with zero runs lands in the \`noFlows\` list twice. I noticed that while writing this post. It's harmless for what I use it for, so it's staying for now.

Then rate limits. An authenticated token gets 5,000 requests an hour, which sounds like plenty until you hit every repo in parallel and trip the secondary limits instead. The script awaits each repo in sequence. It's slow, and it finishes.

**Running it**

A token that can read Actions on the org's repos, the org name, and nothing else:

\`GH_ORG=your-org GH_TOKEN=ghp_... node index.js > actions.json\`

\`DEBUG=ghRepo\` lets you watch it crawl. The output has two keys: \`repoToWorkflows\`, an object keyed by repo full name, and \`noFlows\`, a list of repos that never got a workflow. Each run row keeps what a spreadsheet wants: workflow name, branch, event, \`status\`, \`conclusion\`, \`run_attempt\`, three timestamps, commit message and author, \`html_url\`. One quirk: \`pull_request_number\` is computed as \`pull_requests.length && pull_requests[0].number\`, so a run with no PR gets a literal 0, which bites the first time you filter on it.

There's no duration field in the list response. There is a per-run \`/timing\` endpoint that returns \`run_duration_ms\`, but that's one more call per row, so I subtract \`run_started_at\` from \`updated_at\` and call it close enough. \`jq '[.repoToWorkflows[][]]' actions.json\` flattens the nesting, and from there it's a CSV away from Sheets.

Caveat: \`WORKFLOWS_PER_REPO\` is a constant, set to 10, and the script doesn't paginate runs, so "for entire organization" in the repo description promises more than ten runs per repo delivers. For a real audit you bump it to 100 and run it nightly. Paginating the runs properly, and writing the duration into the row so I stop doing subtraction in a spreadsheet, is the obvious next fix. The nightly half already exists in the repo: a GitHub Action that fetches GitHub Actions on a 00:05 cron, builds a small antd table over the result, and uploads it with \`upload-artifact@v2\`. A workflow whose job is to report on workflows amused me more than it should.

**What a flat file shows you**

I'll skip our numbers, but the pattern will probably look familiar.

Sort by duration, descending. The top of the list is rarely the suite everyone blames. The E2E job is long, but predictably so, and people have made peace with it. The real outliers are rows with \`run_attempt\` greater than 1: someone hit "re-run all jobs" on a twenty-minute pipeline because one flaky step failed, and the whole thing ran again, build included. The row only shows the last attempt, so whatever you see, the real cost is more. Filter on that column and the cost of flakiness becomes a number you can put next to the cost of fixing the flaky test.

The other thing you see is drift: the same workflow name in six repos with wildly different timings, because each copy got tweaked by whoever touched it last and nobody compared them.

As for the question in the channel: not slower. Two re-runs louder, which feels like the same thing when you're the one waiting.

**Measure first, keep it dumb**

Every CI optimization thread I've seen starts with someone proposing a cache change for the job they personally wait on. Sometimes it's the cache. Usually it isn't, and the afternoon goes to tuning something that was fine.

So export first and look at the numbers. And keep the export tool stupid: one flat file, no dashboard with hardcoded job names. Workflows get renamed and merged every time someone reorganizes a repo; a row with a repo name and two timestamps survives all of that. Next time the channel asks, the answer is one \`node index.js\` away, page-0 bug and all.`,
    date: '2021-11-14',
    draft: true,
    image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=800&q=80&auto=format&fit=crop',
    tags: ['github-actions', 'ci', 'tooling']
  }
]
