<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# User Preferences & Rules

- NEVER run localhost or local dev servers (`npm run dev`, `uvicorn`, etc.) unless explicitly requested by the USER.
- Always use production deployment URLs (Vercel, Render, Supabase) for previewing and testing across multiple devices.
