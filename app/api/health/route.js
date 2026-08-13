// A way to check the AI layer is actually wired up in a deployment
// without asking it a question and without ever printing the key.
//
// This exists because the failure mode it catches is silent: forget
// OPENAI_API_KEY in the Vercel dashboard and the site deploys clean,
// looks perfect, and the ask box quietly tells everyone to send an
// email instead. Hitting /api/health answers "is the key there" in one
// request.
//
// Only ever reports whether a key is present and which model is
// configured — never the key, never a prefix of it.

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  const key = process.env.OPENAI_API_KEY;

  return Response.json(
    {
      ok: true,
      keyConfigured: Boolean(key && key.trim()),
      model: process.env.AI_MODEL || 'openai/gpt-4o-mini',
      baseUrl: process.env.OPENAI_BASE_URL || 'https://openrouter.ai/api/v1',
    },
    { headers: { 'Cache-Control': 'no-store' } }
  );
}
