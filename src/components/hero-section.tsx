export const HeroSection = () => {
  return (
    <div className="relative">
      <div className="absolute -top-16 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-800 to-transparent" />
      <div className="space-y-8">
        <div className="flex flex-col items-center text-center">
          <div className="inline-flex items-center px-4 py-1.5 mb-6 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700">
            <span className="flex items-center gap-1.5">
              {/* This was already emerald green and looks great */}
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              100% browser-based conversion
            </span>
          </div>
          {/* --- STYLE UPDATE: Changed gradient text to solid emerald green --- */}
          <h1 className="text-5xl font-bold tracking-tight text-center text-emerald-600 dark:text-emerald-500 mb-4 max-w-2xl">
            Transform Your PDFs into Clean Markdown
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-xl mb-8">
            Instantly convert PDF documents to perfectly formatted Markdown.
            Your files never leave your device — everything happens right in
            your browser.
          </p>
        </div>
      </div>
      <div className="absolute -bottom-16 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-800 to-transparent" />
    </div>
  );
};
