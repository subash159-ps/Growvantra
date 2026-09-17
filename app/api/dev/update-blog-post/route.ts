import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// TEMPORARY, ONE-OFF ROUTE — used once to edit a single blog post's content
// directly in production via a token-protected endpoint (no admin session
// available from the tooling that created this). Delete after use.

const SLUG = "digital-marketing-trends-in-2026-how-ai-seo-social-media-are-changing-business-growth";

export async function POST(request: Request) {
  const token = request.headers.get("x-seed-token");
  if (!process.env.UPDATE_TOKEN || token !== process.env.UPDATE_TOKEN) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const existing = await prisma.blogPost.findUnique({ where: { slug: SLUG } });
  if (!existing) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }

  const updatedContent = existing.content
    .replace(
      "Short-form video remains an important marketing format across platforms such as Instagram, YouTube, and TikTok.",
      "Short-form video remains an important marketing format across platforms such as Instagram, YouTube, and Snapchat.",
    )
    .replace(
      "HubSpot's 2026 research identifies social media as one of the central marketing channels, with Instagram, Facebook, TikTok, and other platforms playing different roles.",
      "HubSpot's 2026 research identifies social media as one of the central marketing channels, with Instagram, Facebook, Snapchat, and other platforms playing different roles.",
    );

  const post = await prisma.blogPost.update({
    where: { slug: SLUG },
    data: { content: updatedContent },
  });

  return NextResponse.json({
    ok: true,
    id: post.id,
    changed: post.content !== existing.content,
  });
}
