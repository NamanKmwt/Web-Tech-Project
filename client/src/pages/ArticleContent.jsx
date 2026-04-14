import React, { Suspense } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react'; // Added Chevron icons
import useSWR from 'swr';
import { fetcher, API_BASE } from '../utils/fetcher';

const ArticleContent = ({ id }) => {
    // 1. Fetch the single article
    const { data: article, error } = useSWR(`${API_BASE}/articles/${id}`, fetcher, { suspense: true });

    // 2. Fetch the full list of articles to figure out what's Next/Prev
    // (This is extremely fast because SWR caches it from the NewsGrid page!)
    const { data: allArticles } = useSWR(`${API_BASE}/articles`, fetcher, { suspense: true });

    if (error) return <div className="text-f1-red text-center py-32 font-bold tracking-widest uppercase">Failed to load telemetry.</div>;
    if (!article) return null;

    // 3. Find adjacent articles
    let prevArticle = null;
    let nextArticle = null;

    if (allArticles) {
        const currentIndex = allArticles.findIndex(a => a._id === id);

        // Assuming your backend sorts by newest first (index 0 is newest)
        if (currentIndex < allArticles.length - 1 && currentIndex !== -1) {
            // Older article
            prevArticle = allArticles[currentIndex + 1];
        }
        if (currentIndex > 0) {
            // Newer article
            nextArticle = allArticles[currentIndex - 1];
        }
    }

    return (
        <motion.article
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24"
        >
            <Link to="/news" className="inline-flex items-center space-x-2 text-titanium-silver hover:text-f1-red transition-colors mb-10 group">
                <ArrowLeft size={20} className="transform group-hover:-translate-x-1 transition-transform" />
                <span className="font-bold tracking-widest uppercase text-sm">Back to Paddock</span>
            </Link>

            <header className="mb-10">
                <span className="inline-block px-3 py-1 bg-f1-red text-white text-xs font-bold uppercase tracking-widest mb-4">
                    {article.category}
                </span>
                <h1 className="text-4xl md:text-6xl font-black italic tracking-tighter text-white mb-6 leading-tight">
                    {article.title}
                </h1>
                {article.date && <p className="text-titanium-silver text-sm">{new Date(article.date).toLocaleDateString()}</p>}
            </header>

            <div className="w-full h-[400px] md:h-[600px] mb-12 overflow-hidden relative border border-white/10">
                <div className="absolute inset-0 bg-gradient-to-t from-carbon-black to-transparent z-10" />
                <img
                    src={article.imageUrl || '/images/news1.png'}
                    alt={article.title}
                    className="w-full h-full object-cover"
                />
            </div>

            <div className="prose prose-invert prose-lg max-w-none text-titanium-silver leading-relaxed">
                {article.content ? (
                    article.content.split('\n').map((paragraph, idx) => (
                        <p key={idx} className="mb-6">{paragraph}</p>
                    ))
                ) : (
                    <p className="italic">Transmission interrupted. Story content not found.</p>
                )}
            </div>

            {/* 4. Next / Previous Navigation Footer */}
            <div className="mt-20 pt-10 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-6">
                {/* Next Article Link */}
                {nextArticle ? (
                    <Link to={`/news/${nextArticle._id}`} className="group flex items-center justify-end gap-4 w-full sm:w-1/2 hover:bg-white/5 p-4 rounded-lg transition-colors text-right border border-transparent hover:border-white/10">
                        <div className="overflow-hidden">
                            <span className="text-titanium-silver text-xs font-bold uppercase tracking-widest block mb-1">Previous</span>
                            <p className="text-white font-bold italic truncate">{nextArticle.title}</p>
                        </div>
                        <div className="bg-carbon-black p-2 rounded-full text-titanium-silver group-hover:text-f1-red transition-colors">
                            <ChevronLeft size={24} />
                        </div>
                    </Link>
                ) : <div className="w-full sm:w-1/2" />}

                {/* Previous Article Link */}
                {prevArticle ? (
                    <Link to={`/news/${prevArticle._id}`} className="group flex items-center gap-4 w-full sm:w-1/2 hover:bg-white/5 p-4 rounded-lg transition-colors border border-transparent hover:border-white/10">
                        <div className="bg-carbon-black p-2 rounded-full text-titanium-silver group-hover:text-f1-red transition-colors">
                            <ChevronRight size={24} />
                        </div>
                        <div className="overflow-hidden">
                            <span className="text-titanium-silver text-xs font-bold uppercase tracking-widest block mb-1">Next</span>
                            <p className="text-white font-bold italic truncate">{prevArticle.title}</p>
                        </div>
                    </Link>
                ) : <div className="w-full sm:w-1/2" />}


            </div>
        </motion.article>
    );
};

const ArticlePage = () => {
    const { id } = useParams();

    return (
        <div key={id} className="min-h-screen bg-carbon-black text-white">
            <Suspense fallback={
                <div className="min-h-screen flex items-center justify-center text-titanium-silver font-bold tracking-widest uppercase animate-pulse">
                    Loading Story...
                </div>
            }>
                <ArticleContent id={id} />
            </Suspense>
        </div>
    );
};

export default ArticlePage;