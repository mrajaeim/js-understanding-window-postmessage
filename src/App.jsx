import { useState, useEffect } from 'react';

const countries = {
  USA: [37.0902, -95.7129],
  France: [46.2276, 2.2137],
  Japan: [36.2048, 138.2529],
  Brazil: [-14.235, -51.9253],
  Australia: [-25.2744, 133.7751],
  SouthAfrica: [-30.5595, 22.9375],
};

// Main App Component
const App = () => {
  const [iframeRef, setIframeRef] = useState(null);
  const [messages, setMessages] = useState([]);

  // Listen for messages from the iframe
  useEffect(() => {
    const handleMessage = (event) => {
      setMessages((prev) => [
        ...prev,
        {
          type: 'incoming',
          data: event.data,
          timestamp: new Date().toLocaleTimeString(),
        },
      ]);
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const handleCountryClick = (country) => {
    if (iframeRef) {
      const message = { country };
      iframeRef.contentWindow.postMessage(message, '*');

      // Log outgoing message
      setMessages((prev) => [
        ...prev,
        {
          type: 'outgoing',
          data: message,
          timestamp: new Date().toLocaleTimeString(),
        },
      ]);
    }
  };

  return (
    <div className="h-screen flex">
      {/* Left side - Map */}
      <div className="w-2/3 h-full bg-gray-100 relative">
        <iframe
          ref={setIframeRef}
          srcDoc={`
            <!DOCTYPE html>
            <html>
              <head>
                <link rel="stylesheet" href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css" />
                <style>
                  body { margin: 0; }
                  #map { height: 100vh; }
                </style>
              </head>
              <body>
                <div id="map"></div>
                <script src="https://unpkg.com/leaflet@1.7.1/dist/leaflet.js"></script>
                <script>
                  const map = L.map('map').setView([0, 0], 2);
                  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  }).addTo(map);

                  window.addEventListener('message', (event) => {
                    const { country } = event.data;
                    const coordinates = ${JSON.stringify(countries)}[country];
                    if (coordinates) {
                      map.setView(coordinates, 5);
                      // Send confirmation message back to parent
                      window.parent.postMessage({ 
                        type: 'confirmation',
                        message: 'Map moved to ' + country
                      }, '*');
                    }
                  });
                </script>
              </body>
            </html>
          `}
          className="w-full h-full border-none"
          title="Map"
        />
      </div>

      {/* Right side - Control Panel */}
      <div className="w-1/3 p-4 bg-white flex flex-col h-full">
        <h2 className="text-xl font-bold mb-4">Select a Country</h2>
        <div className="grid grid-cols-2 gap-4 mb-6">
          {Object.keys(countries).map((country) => (
            <button
              key={country}
              onClick={() => handleCountryClick(country)}
              className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              {country}
            </button>
          ))}
        </div>

        {/* Message Log Section */}
        <div className="flex-1 overflow-hidden">
          <h3 className="text-lg font-semibold mb-2">Message Log</h3>
          <div className="bg-gray-100 p-3 rounded h-full overflow-y-auto">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`mb-2 p-2 rounded ${
                  msg.type === 'outgoing'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-green-100 text-green-800'
                }`}
              >
                <div className="text-xs opacity-75">{msg.timestamp}</div>
                <div className="font-medium">{msg.type.toUpperCase()}</div>
                <div className="text-sm">
                  {JSON.stringify(msg.data, null, 2)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
