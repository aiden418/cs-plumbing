"use client";

import { Clock, ArrowLeft, Phone, Calendar } from "lucide-react";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import { BUSINESS } from "@/lib/constants";
import type { BlogPost } from "@/lib/types";

export default function BlogContent({ post }: { post: BlogPost }) {
  return (
    <>
      {/* Hero */}
      <section className="pt-24 sm:pt-28 lg:pt-32 pb-8 sm:pb-12 bg-surface">
        <Container>
          <div className="max-w-3xl">
            <a
              href="/blog"
              className="inline-flex items-center gap-1.5 text-primary text-sm mb-4 hover:gap-2.5 transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Blog
            </a>
            <div className="flex items-center gap-3 mb-4">
              <span className="text-xs font-semibold text-primary uppercase tracking-wider">
                {post.category}
              </span>
              <span className="flex items-center gap-1 text-xs text-gray-500">
                <Clock className="w-3 h-3" />
                {post.readTime}
              </span>
              <span className="text-xs text-gray-500">
                {new Date(post.publishDate).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight">
              {post.title}
            </h1>
          </div>
        </Container>
      </section>

      {/* Content */}
      <section className="py-8 sm:py-12 lg:py-16">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
            {/* Article */}
            <article
              className="lg:col-span-2 prose prose-invert prose-sm sm:prose-base max-w-none
                prose-headings:text-white prose-headings:font-bold
                prose-h2:text-xl sm:prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4
                prose-h3:text-lg prose-h3:mt-6 prose-h3:mb-3
                prose-p:text-gray-400 prose-p:leading-relaxed
                prose-a:text-primary prose-a:no-underline hover:prose-a:underline
                prose-li:text-gray-400
                prose-strong:text-white
                prose-ul:space-y-1"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            {/* Sidebar */}
            <aside className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                <div className="bg-surface rounded-2xl border border-white/5 p-5 sm:p-6">
                  <h3 className="text-lg font-bold text-white mb-3">
                    Need Help?
                  </h3>
                  <p className="text-gray-400 text-sm mb-4">
                    Our team is ready to help with any plumbing question or
                    project. Call us or book online.
                  </p>
                  <div className="space-y-3">
                    <Button
                      href={`tel:${BUSINESS.phoneRaw}`}
                      variant="secondary"
                      size="sm"
                      icon={<Phone className="w-4 h-4" />}
                      className="w-full"
                    >
                      {BUSINESS.phone}
                    </Button>
                    <Button
                      href="/booking"
                      size="sm"
                      icon={<Calendar className="w-4 h-4" />}
                      className="w-full"
                    >
                      Book Online
                    </Button>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </Container>
      </section>
    </>
  );
}
