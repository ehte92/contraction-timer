import { useEffect, useState } from "react";
import Layout from "./layout/Layout";

interface Timer {
  hours: number;
  minutes: number;
  seconds: number;
}

function App() {
  const [timer, setTimer] = useState<Timer>({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [contractions, setContractions] = useState<
    { time: string; duration: string }[]
  >([]);
  const [currentContractionStart, setCurrentContractionStart] = useState<
    number | null
  >(null);

  useEffect(() => {
    let interval: number | undefined = undefined;

    if (isRunning) {
      interval = window.setInterval(() => {
        // Use window.setInterval to clarify browser context
        const elapsedTime = Date.now() - (startTime ?? 0);
        const hours = Math.floor(elapsedTime / 3600000); // 1000 * 60 * 60
        const minutes = Math.floor((elapsedTime % 3600000) / 60000); // 1000 * 60
        const seconds = Math.floor((elapsedTime % 60000) / 1000);

        setTimer({ hours, minutes, seconds });
      }, 1000);
    } else if (!isRunning && startTime !== null) {
      clearInterval(interval);
    }

    return () => {
      if (interval !== undefined) {
        clearInterval(interval);
      }
    };
  }, [isRunning, startTime]);

  const startTimer = () => {
    setStartTime(Date.now());
    setIsRunning(true);
    setCurrentContractionStart(Date.now());
  };

  const stopTimer = () => {
    if (currentContractionStart) {
      const endTime = Date.now();
      const duration = endTime - currentContractionStart; // Calculate duration in milliseconds
      const durationSeconds = Math.floor(duration / 1000); // Convert duration to seconds
      const startTimeFormatted = new Date(
        currentContractionStart
      ).toLocaleTimeString();
      const durationFormatted = `${Math.floor(durationSeconds / 60)} minutes ${
        durationSeconds % 60
      } seconds`;

      // Add the new contraction log
      setContractions((prevContractions) => [
        { time: startTimeFormatted, duration: durationFormatted },
        ...prevContractions,
      ]);

      setIsRunning(false);
      setCurrentContractionStart(null); // Reset the start time
    }
  };

  // Function to format time values for display
  const formatTime = (value: number): string => {
    return value.toString().padStart(2, "0");
  };

  return (
    <Layout>
      <div className="container mx-auto px-4">
        <h1 className="text-2xl font-bold">Contraction Timer</h1>
        {/* Timer */}
        <div className="flex justify-center items-center">
          <div className="flex items-center justify-center space-x-2 py-4 rounded-lg">
            <div className="text-center flex flex-col justify-center">
              <div className="rounded-lg bg-gray-600 px-6 py-2 text-4xl font-bold text-primary">
                {formatTime(timer.hours)}
              </div>
              <div className="text-sm font-semibold mt-2">Hours</div>
            </div>
            {/* Encapsulating the colon in a div with adjusted alignment */}
            <div className="flex items-center justify-center h-full mb-8">
              <span className="text-4xl font-bold">:</span>
            </div>
            <div className="text-center flex flex-col justify-center">
              <div className="rounded-lg bg-gray-600 px-6 py-2 text-4xl font-bold text-primary">
                {formatTime(timer.minutes)}
              </div>
              <div className="text-sm font-semibold mt-2">Minutes</div>
            </div>
            <div className="flex items-center justify-center h-full mb-8">
              <span className="text-4xl font-bold">:</span>
            </div>
            <div className="text-center flex flex-col justify-center">
              <div className="rounded-lg bg-gray-600 px-6 py-2 text-4xl font-bold text-primary">
                {formatTime(timer.seconds)}
              </div>
              <div className="text-sm font-semibold mt-2">Seconds</div>
            </div>
          </div>
        </div>
        {/* Timer */}

        {/* Button */}
        <div className="flex justify-center items-center mt-4">
          <div className="flex justify-between space-x-2 w-full">
            {/* Start button */}
            <button
              className="btn btn-primary w-1/2"
              onClick={startTimer}
              disabled={isRunning}
            >
              Start
            </button>
            {/* Stop button */}
            <button
              className="btn btn-secondary w-1/2"
              onClick={stopTimer}
              disabled={!isRunning}
            >
              Stop
            </button>
          </div>
        </div>
        {/* Button */}

        {/* Info */}
        <div className="mt-4">
          <div className="bg-gray-800 rounded-lg shadow-lg p-4 border-l-4 border-primary">
            <div className="grid grid-cols-3 gap-4">
              {/* Item 1: Past Hour */}
              <div className="text-center">
                <div className="text-md font-semibold text-primary">
                  Past Hour
                </div>
                <div className="text-sm text-secondary">0 Contractions</div>
              </div>

              {/* Item 2: Avg Duration */}
              <div className="text-center">
                <div className="text-md font-semibold text-primary">
                  Avg Duration
                </div>
                <div className="text-sm text-secondary">0:00</div>
              </div>

              {/* Item 3: Avg Frequency */}
              <div className="text-center">
                <div className="text-md font-semibold text-primary">
                  Avg Freq
                </div>
                <div className="text-sm text-secondary">0:00</div>
              </div>
            </div>
          </div>
        </div>
        {/* Info */}

        {/* Timeline */}
        {contractions.length > 0 && (
          <div className="mt-4 h-96 overflow-auto">
            <ul className="timeline timeline-snap-icon max-md:timeline-compact timeline-vertical">
              {contractions.map((contraction, index) => (
                <li key={index} className="timeline-item">
                  <div className="timeline-middle">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="w-5 h-5"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="timeline-end timeline-box">
                    <time className="text-sm text-secondary">
                      {contraction.time}
                    </time>
                    <p className="text-md font-semibold text-primary">
                      {contraction.duration}
                    </p>
                  </div>
                  {index !== contractions.length - 1 && <hr />}
                </li>
              ))}
            </ul>
          </div>
        )}
        {/* Timeline */}
      </div>
    </Layout>
  );
}

export default App;
