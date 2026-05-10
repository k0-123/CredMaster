# Reflection

### 1. What was the most challenging part of this project?
The most challenging part was balancing the "hard" logic of the audit engine with the "soft" requirements of a premium UI. The audit engine needed to be accurate and testable (hence the 18 unit tests), but the results also needed to be visually compelling to drive lead conversion. Specifically, mapping the complex pricing tiers of 8 different AI tools into a unified logic that could accurately calculate savings across seat waste, plan downgrades, and tool overlap required significant attention to detail.

### 2. How did you handle the trade-offs between performance and aesthetics?
I prioritized "Visual Performance." A site can look beautiful but if it feels sluggish, the premium feel is lost. I used `next/font` to eliminate render-blocking requests, lazy-loaded heavy components like the `BenchmarkPanel` and `LeadCaptureModal`, and used CSS-only animations where possible. The biggest trade-off was using high-quality video backgrounds on the landing page; I mitigated this by using optimized CDNs and ensuring the critical path (the audit form) remains interactive immediately even if the video is still buffering.

### 3. What would you do differently if you had more time?
If I had more time, I would implement:
- **Direct Integration**: Use OAuth to pull real seat data from GitHub/Anthropic/OpenAI APIs rather than relying on user input.
- **Multi-Currency Support**: Many global teams pay in EUR or GBP.
- **Deep Historical Benchmarking**: Compare spend not just against peers, but against the same company's spend over the last 6 months to show trends.

### 4. How does this tool solve a real problem for companies?
AI spend is currently a "black hole" in many engineering budgets. Companies are "double-paying" (e.g., Cursor + Copilot) or "over-paying" (e.g., Pro seats for managers who only need basic access). CredMaster provides the data-backed clarity Engineering Managers need to justify budget cuts to Finance, or conversely, to justify spending more on higher-efficiency tools by showing exactly where the waste is currently located.

### 5. What was your experience using AI to build this project?
Using AI (specifically Next.js and Tailwind patterns) allowed for extremely rapid prototyping. The ability to generate complex UI components and then immediately "harden" them with accessibility and performance fixes made it possible to hit a production-ready standard in days rather than weeks. The AI was particularly helpful in generating the initial audit ruleset, which I then manually refined for accuracy.
