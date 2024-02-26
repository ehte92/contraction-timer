import { useEffect, useState } from "react";
import Layout from "./layout/Layout";

interface Timer {
  hours: number;
  minutes: number;
  seconds: number;
}

interface Contraction {
  time: string;
  duration: string;
}

function App() {
  const [timer, setTimer] = useState<Timer>({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [contractions, setContractions] = useState<Contraction[]>([]);
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

  const parseLasHourTime = (timeString: string): number => {
    const [hoursMinutes, period] = timeString.split(" ");
    let hours = parseInt(hoursMinutes.split(":")[0], 10);
    const minutes = parseInt(hoursMinutes.split(":")[1], 10);
    const seconds = parseInt(hoursMinutes.split(":")[2], 10);

    // Adjust hours for 12-hour format
    if (period === "PM" && hours < 12) hours += 12;
    if (period === "AM" && hours === 12) hours = 0;

    // Since minutes and seconds are not reassigned, we can declare them with `const`
    const date = new Date();
    date.setHours(hours, minutes, seconds, 0);

    return date.getTime();
  };

  // Calculate number of contractions in the last hour
  const contractionsLastHour = contractions.filter((contraction) => {
    const currentTime = Date.now();
    const contractionTime = new Date(parseLasHourTime(contraction.time)); // Ensure this parses correctly

    // Check if the contraction occurred in the last hour
    return currentTime - contractionTime.getTime() < 3600000; // 3600000 milliseconds = 1 hour
  });

  // Calculate average duration of contractions
  const averageDuration =
    contractions.length > 0
      ? contractions.reduce((total, contraction) => {
          const durationParts = contraction.duration.split(" ");
          const durationMinutes = parseInt(durationParts[0]);
          const durationSeconds = parseInt(durationParts[2]);
          return total + durationMinutes * 60 + durationSeconds;
        }, 0) / contractions.length
      : 0; // Return 0 if no contractions

  // Format average duration for display
  const formatAverageDuration = (duration: number): string => {
    if (duration === 0) {
      return "0:00"; // Or "N/A" or any placeholder you find suitable
    }
    const minutes = Math.floor(duration / 60);
    const seconds = Math.floor(duration % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const calculateAverageInterval = (
    contractions: Contraction[]
  ): string | null => {
    if (contractions.length < 2) return null; // Need at least two contractions to calculate intervals

    // Parse each contraction time to milliseconds
    const timesInMs = contractions.map((contraction) =>
      parseTime(contraction.time)
    );

    // Sort times in ascending order to ensure correct interval calculation
    timesInMs.sort((a, b) => a - b);

    // Calculate intervals between consecutive contractions
    const intervals = timesInMs
      .slice(1)
      .map((time, index) => time - timesInMs[index]);

    // Compute the average of these intervals
    const averageIntervalMs =
      intervals.reduce((acc, interval) => acc + interval, 0) / intervals.length;

    // Convert milliseconds to minutes and seconds
    const averageIntervalMinutes = Math.floor(averageIntervalMs / 60000);
    const averageIntervalSeconds = Math.floor(
      (averageIntervalMs % 60000) / 1000
    );

    // Format the average interval as M:SS
    const formattedAverageInterval = `${averageIntervalMinutes}:${averageIntervalSeconds
      .toString()
      .padStart(2, "0")}`;

    return formattedAverageInterval;
  };

  const parseTime = (timeString: string): number => {
    const [time, modifier] = timeString.split(" ");
    let hours = parseInt(time.split(":")[0], 10);
    const minutes = parseInt(time.split(":")[1], 10);
    const seconds = parseInt(time.split(":")[2], 10);

    if (hours === 12) hours = 0; // Handle 12 AM and 12 PM
    if (modifier === "PM") hours += 12;

    // Assuming the current date for all times to calculate the timestamp
    const date = new Date();
    date.setHours(hours, minutes, seconds, 0);
    return date.getTime();
  };

  const averageInterval = calculateAverageInterval(contractions);

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
                <div className="text-sm text-secondary">
                  {contractionsLastHour.length} Contractions
                </div>
              </div>

              {/* Item 2: Avg Duration */}
              <div className="text-center">
                <div className="text-md font-semibold text-primary">
                  Duration
                </div>
                <div className="text-sm text-secondary">
                  {formatAverageDuration(averageDuration)}
                </div>
              </div>

              {/* Item 3: Avg Interval */}
              <div className="text-center">
                <div className="text-md font-semibold text-primary">
                  Interval
                </div>
                <div className="text-sm text-secondary">
                  {averageInterval ? averageInterval : "0:00"}
                </div>
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
