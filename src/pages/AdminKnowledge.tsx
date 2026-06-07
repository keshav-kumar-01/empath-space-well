import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import AdminProtected from "@/components/AdminProtected";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { Loader2, Trash2, FileText, Upload, BookOpen } from "lucide-react";

interface KnowledgeDoc {
  id: string;
  title: string;
  source: string | null;
  category: string | null;
  created_at: string;
  chunk_count?: number;
}

const AdminKnowledgeInner: React.FC = () => {
  const [title, setTitle] = useState("");
  const [source, setSource] = useState("");
  const [category, setCategory] = useState("");
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [docs, setDocs] = useState<KnowledgeDoc[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDocs = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("knowledge_documents")
      .select("id, title, source, category, created_at")
      .order("created_at", { ascending: false });
    if (error) {
      toast({ title: "Failed to load documents", description: error.message, variant: "destructive" });
    } else {
      // fetch chunk counts
      const docsWithCounts = await Promise.all(
        (data ?? []).map(async (d) => {
          const { count } = await supabase
            .from("knowledge_chunks")
            .select("*", { count: "exact", head: true })
            .eq("document_id", d.id);
          return { ...d, chunk_count: count ?? 0 };
        }),
      );
      setDocs(docsWithCounts);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchDocs();
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2_000_000) {
      toast({ title: "File too large", description: "Max 2MB plain text", variant: "destructive" });
      return;
    }
    const text = await file.text();
    setContent(text);
    if (!title) setTitle(file.name.replace(/\.[^.]+$/, ""));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      toast({ title: "Title and content are required", variant: "destructive" });
      return;
    }
    setSubmitting(true);
    try {
      const { data, error } = await supabase.functions.invoke("ingest-knowledge", {
        body: {
          title: title.trim(),
          source: source.trim() || null,
          category: category.trim() || null,
          content,
        },
      });
      if (error) throw error;
      toast({
        title: "Document ingested",
        description: `Created ${data?.chunks ?? 0} embeddings.`,
      });
      setTitle("");
      setSource("");
      setCategory("");
      setContent("");
      fetchDocs();
    } catch (err: any) {
      toast({
        title: "Ingestion failed",
        description: err?.message ?? "Unknown error",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this document and all its embeddings?")) return;
    const { error } = await supabase.from("knowledge_documents").delete().eq("id", id);
    if (error) {
      toast({ title: "Delete failed", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Document deleted" });
      fetchDocs();
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="mb-6 flex items-center gap-3">
          <BookOpen className="h-7 w-7 text-primary" />
          <div>
            <h1 className="text-2xl font-bold">Knowledge Base (RAG)</h1>
            <p className="text-sm text-muted-foreground">
              Upload documents the AI therapist can reference when answering users.
            </p>
          </div>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" /> Add document
            </CardTitle>
            <CardDescription>
              Paste content or upload a .txt / .md file. It will be chunked and embedded with Mistral.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="title">Title *</Label>
                  <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required maxLength={200} />
                </div>
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Input
                    id="category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="anxiety, depression, crisis…"
                    maxLength={50}
                  />
                </div>
                <div>
                  <Label htmlFor="source">Source / URL</Label>
                  <Input id="source" value={source} onChange={(e) => setSource(e.target.value)} maxLength={500} />
                </div>
              </div>

              <div>
                <Label htmlFor="file">Upload .txt / .md (optional)</Label>
                <Input id="file" type="file" accept=".txt,.md,.markdown" onChange={handleFileUpload} />
              </div>

              <div>
                <Label htmlFor="content">Content *</Label>
                <Textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={10}
                  required
                  placeholder="Paste your text here. It will be split into ~1000-char chunks and embedded."
                />
                <p className="text-xs text-muted-foreground mt-1">{content.length.toLocaleString()} characters</p>
              </div>

              <Button type="submit" disabled={submitting} className="w-full md:w-auto">
                {submitting ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Ingesting & embedding…</>
                ) : (
                  <><Upload className="mr-2 h-4 w-4" /> Ingest document</>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" /> Documents ({docs.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
            ) : docs.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">No documents yet.</p>
            ) : (
              <div className="space-y-3">
                {docs.map((d) => (
                  <div
                    key={d.id}
                    className="flex items-start justify-between gap-4 p-3 rounded-lg border bg-card hover:bg-accent/30 transition"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold truncate">{d.title}</h3>
                        {d.category && <Badge variant="secondary">{d.category}</Badge>}
                        <Badge variant="outline">{d.chunk_count} chunks</Badge>
                      </div>
                      {d.source && <p className="text-xs text-muted-foreground truncate mt-1">{d.source}</p>}
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(d.created_at).toLocaleString()}
                      </p>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(d.id)} aria-label="Delete document">
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

const AdminKnowledge: React.FC = () => {
  return (
    <>
      <SEO title="Knowledge Base Admin — Chetna AI" noindex />
      <AdminProtected>
        <AdminKnowledgeInner />
      </AdminProtected>
    </>
  );
};

export default AdminKnowledge;
