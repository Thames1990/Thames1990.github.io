import { caseStudies } from '@/data/portfolio';

export function FieldNotes() {
  return (
    <div className="bench-readouts__panel">
      <h2 className="bench-readouts__label">Evidence that shipped</h2>
      <ul className="bench-readouts__list">
        {caseStudies.map((study) => {
          const outcome = study.outcomes[0];

          return (
            <li key={study.index} className="bench-readout">
              <a className="bench-readout__project" href={`#project-${study.index}`}>
                <span>{study.title}</span>
                <small>{study.eyebrow}</small>
              </a>
              <span className="bench-readout__result">
                <strong>{outcome.value}</strong>
                <small>{outcome.label}</small>
              </span>
            </li>
          );
        })}
      </ul>
      <p className="bench-readouts__note">Select a result to inspect the delivery</p>
    </div>
  );
}
