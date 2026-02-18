export default function SupportPage() {
  return (
    <div className="min-h-screen bg-background py-6">
      <div className="max-w-4xl mx-auto px-4">
        {/* Simple Header - Centered */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 text-center">
            Support GeoKHub
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-center">
            Help keep the tech news and content flowing!
          </p>
        </div>

        {/* Ko-fi Widget */}
        <div className="bg-card rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
          <iframe
            id="kofiframe"
            src="https://ko-fi.com/geokhub/?hidefeed=true&widget=true&embed=true&preview=true"
            style={{
              border: "none",
              width: "100%",
              padding: "4px",
              background: "#f9f9f9",
            }}
            height="712"
            title="geokhub"
          />
        </div>

        {/* Simple Footer Note - Centered */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
            Thank you for your support! 🙏
          </p>
        </div>
      </div>
    </div>
  );
}