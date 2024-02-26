import { createLazyFileRoute } from "@tanstack/react-router";
import useStore from "../store/contractionStore";

export const Route = createLazyFileRoute("/timeline")({
  component: Timeline,
});

function Timeline() {
  const { contractions } = useStore();
  return (
    <div className="container mx-auto px-4">
      <h1 className="text-2xl font-bold">Contraction Timeline</h1>
      {contractions.length > 0 && (
        <div className="mt-4">
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
    </div>
  );
}
