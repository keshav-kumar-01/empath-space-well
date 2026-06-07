import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Split text into ~1000-char chunks with ~200-char overlap, preferring paragraph/sentence boundaries.
function chunkText(text: string, target = 1000, overlap = 200): string[] {
  const clean = text.replace(/\r\n/g, "\n").trim();
  if (clean.length <= target) return [clean];

  const chunks: string[] = [];
  let i = 0;
  while (i < clean.length) {
    let end = Math.min(i + target, clean.length);
    if (end < clean.length) {
      // Try to end at a paragraph or sentence break
      const slice = clean.slice(i, end);
      const lastPara = slice.lastIndexOf("\n\n");
      const lastSentence = Math.max(slice.lastIndexOf(". "), slice.lastIndexOf("। "));
      if (lastPara > target * 0.5) end = i + lastPara;
      else if (lastSentence > target * 0.5) end = i + lastSentence + 1;
    }
    chunks.push(clean.slice(i, end).trim());
    if (end >= clean.length) break;
    i = end - overlap;
    if (i < 0) i = 0;
  }
  return chunks.filter((c) => c.length > 20);
}

async function embedBatch(texts: string[], apiKey: string): Promise<number[][]> {
  const res = await fetch("https://api.mistral.ai/v1/embeddings", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({ model: "mistral-embed", input: texts }),
  });
  if (!res.ok) {
    const t = await res.text();
    throw new Error(`Mistral embeddings error ${res.status}: ${t}`);
  }
  const data = await res.json();
  return data.data.map((d: any) => d.embedding);
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader) throw new Error("No authorization header");

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const mistralKey = Deno.env.get("MISTRAL_API_KEY");
    if (!mistralKey) throw new Error("MISTRAL_API_KEY not configured");

    // Verify user + admin role
    const userClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: { user }, error: userErr } = await userClient.auth.getUser();
    if (userErr || !user) throw new Error("Unauthorized");

    const { data: isAdmin, error: roleErr } = await userClient.rpc("has_role", {
      _user_id: user.id,
      _role: "admin",
    });
    if (roleErr || !isAdmin) throw new Error("Admin access required");

    const body = await req.json();
    const { title, content, source, category, metadata } = body ?? {};
    if (!title || !content || typeof content !== "string") {
      return new Response(JSON.stringify({ error: "title and content are required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (content.length > 500_000) {
      return new Response(JSON.stringify({ error: "content too large (max 500k chars)" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const admin = createClient(supabaseUrl, serviceKey);

    // Insert document
    const { data: doc, error: docErr } = await admin
      .from("knowledge_documents")
      .insert({
        title,
        source: source ?? null,
        category: category ?? null,
        content,
        metadata: metadata ?? {},
        created_by: user.id,
      })
      .select()
      .single();
    if (docErr) throw docErr;

    // Chunk + embed in batches of 16
    const chunks = chunkText(content);
    const BATCH = 16;
    let inserted = 0;
    for (let i = 0; i < chunks.length; i += BATCH) {
      const batch = chunks.slice(i, i + BATCH);
      const embeddings = await embedBatch(batch, mistralKey);
      const rows = batch.map((text, idx) => ({
        document_id: doc.id,
        chunk_index: i + idx,
        chunk_text: text,
        embedding: embeddings[idx] as any,
      }));
      const { error: insErr } = await admin.from("knowledge_chunks").insert(rows);
      if (insErr) throw insErr;
      inserted += rows.length;
    }

    return new Response(
      JSON.stringify({ success: true, document_id: doc.id, chunks: inserted }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (error) {
    console.error("ingest-knowledge error:", error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
