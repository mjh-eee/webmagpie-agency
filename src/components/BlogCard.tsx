import React from 'react';
import { BookOpen, User, Calendar, ArrowRight } from 'lucide-react';
import { Blog } from '../types';

interface BlogCardProps {
  key?: React.Key;
  blog: Blog;
  onRead: (blog: Blog) => void;
}

export default function BlogCard({ blog, onRead }: BlogCardProps) {
  const formattedDate = new Date(blog.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col h-full text-left cursor-pointer group" onClick={() => onRead(blog)}>
      {/* Blog Card Image */}
      <div className="relative aspect-video w-full overflow-hidden bg-slate-100">
        <img
          src={blog.image}
          alt={blog.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-4 left-4 inline-flex items-center px-2.5 py-1 rounded-lg bg-teal-600/90 text-white text-xs font-bold shadow-sm backdrop-blur-sm">
          {blog.category}
        </div>
      </div>

      {/* Details Container */}
      <div className="p-6 flex flex-col flex-grow space-y-4">
        {/* Author / Date Info */}
        <div className="flex items-center gap-4 text-xs text-slate-400 font-semibold">
          <div className="flex items-center gap-1">
            <User className="w-3.5 h-3.5 text-slate-400" />
            <span>{blog.author}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>{formattedDate}</span>
          </div>
        </div>

        {/* Title & Excerpt */}
        <div className="space-y-2 flex-grow">
          <h3 className="text-base sm:text-lg font-bold text-slate-950 dark:text-white line-clamp-2 leading-snug group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
            {blog.title}
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 line-clamp-3 leading-relaxed">
            {blog.excerpt}
          </p>
        </div>

        {/* Read More link and read-time */}
        <div className="flex justify-between items-center border-t border-slate-50 dark:border-slate-800/80 pt-4 text-xs">
          <span className="text-slate-400 font-medium flex items-center gap-1">
            <BookOpen className="w-3.5 h-3.5" />
            {blog.readTime}
          </span>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onRead(blog);
            }}
            className="flex items-center gap-1 text-teal-600 dark:text-teal-400 font-bold group-hover:gap-2 transition-all cursor-pointer"
          >
            Read Article
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
