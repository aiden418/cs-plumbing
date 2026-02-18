"use client";

import { motion } from "framer-motion";
import { staggerItem } from "@/components/animations/StaggerChildren";
import { Clock, ArrowRight } from "lucide-react";
import type { BlogPost } from "@/lib/types";

export default function BlogCard({ post }: { post: BlogPost }) {
  return (
    <motion.a
      href={`/blog/${post.slug}`}
      variants={staggerItem}
      className="bg-surface rounded-2xl border border-white/5 p-5 sm:p-6 lg:p-8 hover:border-primary/20 transition-all duration-500 block group"
    >
      <div className="flex items-center gap-3 mb-3">
        <span className="text-xs font-semibold text-primary uppercase tracking-wider">
          {post.category}
        </span>
        <span className="flex items-center gap-1 text-xs text-gray-500">
          <Clock className="w-3 h-3" />
          {post.readTime}
        </span>
      </div>
      <h2 className="text-lg sm:text-xl font-bold text-white mb-2 sm:mb-3 group-hover:text-primary transition-colors">
        {post.title}
      </h2>
      <p className="text-gray-400 text-xs sm:text-sm leading-relaxed mb-4">
        {post.excerpt}
      </p>
      <span className="inline-flex items-center gap-1.5 text-primary text-sm font-medium group-hover:gap-2.5 transition-all">
        Read More <ArrowRight className="w-4 h-4" />
      </span>
    </motion.a>
  );
}
