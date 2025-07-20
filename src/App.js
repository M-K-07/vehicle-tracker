// src/App.js
import { useEffect, useState } from 'react';
import MapView from './components/MapView';

function App() {
  const [route, setRoute] = useState([]);
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [reachedEnd, setReachedEnd] = useState(false);

  useEffect(() => {
    const fetchRoute = async () => {
      try {
        const res = await fetch('/dummy-route.json');
        const data = await res.json();
        setRoute(data);
      } catch (err) {
        console.error('Failed to fetch route:', err);
      }
    };
    fetchRoute();
  }, []);

  useEffect(() => {
    let intervalId;

    if (playing) {
      intervalId = setInterval(() => {
        setIndex(prev => {
          if (prev < route.length - 1) {
            return prev + 1;
          } else {
            clearInterval(intervalId);
            setReachedEnd(true);
            setPlaying(false);
            return 0;
          }
        });
      }, 1000);
    }

    return () => clearInterval(intervalId);
  }, [playing, route]);


  if (route.length === 0) {
    return (
      <div style={{ textAlign: 'center', marginTop: '40px' }}>
        <div style={{ fontSize: '2rem', marginBottom: '10px' }}>⏳</div>
        <p>Loading route data...</p>
      </div>
    );
  }

  const handlePlayClick = () => {
    if (reachedEnd) {
      setIndex(0);
      setReachedEnd(false);
    }
    setPlaying(true);
  };


  const current = route[index];

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <main className="flex-1 flex flex-col items-center w-full">
        <div className="w-full h-full flex-1 flex flex-col">
          <MapView route={route} currentIndex={index} />
        </div>

        {playing ? (
          <button onClick={() => setPlaying(false)} className='px-4 py-2 text-lg rounded bg-blue-500 text-white hover:bg-blue-600 transition-colors duration-150'>⏸ Stop</button>
        ) : (
          <button onClick={handlePlayClick} disabled={playing} className='px-4 py-2 text-lg rounded bg-blue-500 text-white hover:bg-blue-600 transition-colors duration-150'>
            {reachedEnd ? '🔄 Restart' : '▶️ Start'}
          </button>
        )}
      </main>


      <footer className="flex justify-center items-center py-3 bg-gray-100 text-gray-700 text-sm mt-auto">
        <div className="flex flex-col sm:flex-row sm:gap-6 gap-2 px-4 py-2 rounded shadow-sm bg-white w-full max-w-md mx-auto text-center">
          <div className="w-full sm:w-auto flex-1">
            <span className="font-medium">Location:</span> <span className="break-all">{current.latitude}, {current.longitude}</span>
          </div>
          <div className="w-full sm:w-auto flex-1">
            <span className="font-medium">Time:</span> {new Date(current.timestamp).toLocaleTimeString(['en-US'], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
