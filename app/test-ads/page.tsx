import { AdInContent } from "@/components/ads";
import AdsterraDebug from "@/components/ads/AdsterraDebug";
import CmpBanner from "@/components/consent/CmpBanner";

export default function TestAdsPage() {
  return (
    <div className="min-h-screen bg-neutral-50 text-gray-900 p-8">
      <h1 className="text-3xl font-bold mb-6">Adsterra Test Page</h1>
      <p className="mb-4">This page tests the AdInContent component.</p>

      <div className="mb-8 p-4 bg-white rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Ad Display Test</h2>
        <AdInContent />
      </div>

      <div className="mb-8 p-4 bg-white rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Debug Information</h2>
        <div id="debug-info" className="p-4 bg-gray-100 rounded font-mono text-sm"></div>
      </div>

      <AdsterraDebug />

      <div className="p-4 bg-white rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Consent Banner</h2>
        <CmpBanner />
      </div>

      <script
        dangerouslySetInnerHTML={{
          __html: `
            // Debug information
            const debugInfo = document.getElementById('debug-info');
            debugInfo.innerHTML = \`
              <p><strong>Cookies:</strong> ${document.cookie}</p>
              <p><strong>User Agent:</strong> ${navigator.userAgent}</p>
              <p><strong>URL:</strong> ${window.location.href}</p>
            \`;
            
            // Check if container exists after a delay
            setTimeout(() => {
              const container = document.getElementById('container-1ae6deb893d2fba7115c6c32ef705246');
              if (container) {
                debugInfo.innerHTML += \`<p><strong>Container found:</strong> Yes</p>\`;
                debugInfo.innerHTML += \`<p><strong>Container content:</strong> \${container.innerHTML}</p>\`;
                debugInfo.innerHTML += \`<p><strong>Container children:</strong> \${container.children.length}</p>\`;
              } else {
                debugInfo.innerHTML += \`<p><strong>Container found:</strong> No</p>\`;
              }
            }, 3000);
          `,
        }}
      />
    </div>
  );
}