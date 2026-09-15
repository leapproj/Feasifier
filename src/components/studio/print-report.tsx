import { rankAlternatives } from "@/lib/alternatives";
import { kindLabel } from "@/lib/scoring";
import { useStudio } from "@/lib/store";
import type { FsVerdict, PoiKind } from "@/lib/types";
import { php } from "@/lib/utils";

const VERDICT: Record<FsVerdict, string> = {
  go: "FEASIBLE",
  caution: "PROCEED WITH CARE",
  "no-go": "WEAK SITE",
};

export function PrintReport() {
  const report = useStudio((s) => s.report);
  const scores = useStudio((s) => s.scores);
  const intel = useStudio((s) => s.intel);
  const idea = useStudio((s) => s.idea);
  const deep = useStudio((s) => s.deep);
  if (!report || !intel || !scores) return null;

  const alternatives = report.alternatives?.length
    ? report.alternatives
    : rankAlternatives(intel, idea);
  const dated = new Date().toLocaleDateString("en-PH", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <article id="print-report" className="hidden print:block">
      <header className="print-cover">
        <p className="print-kicker">Feasify · Site research studio</p>
        <h1>{report.title}</h1>
        <p className="print-meta">
          {dated}
          {deep ? " · Deep research" : ""} · Google Map pin {intel.lat.toFixed(5)}, {intel.lng.toFixed(5)}
        </p>
        <p className="print-verdict">
          {VERDICT[report.verdict]} · {report.feasibilityScore}/100
        </p>
        <p>{intel.displayName}</p>
      </header>

      <section>
        <h2>I. Executive summary</h2>
        <p>{report.summary}</p>
        <table>
          <tbody>
            <tr>
              <th>Proposed business</th>
              <td>{idea}</td>
            </tr>
            <tr>
              <th>Foot traffic</th>
              <td>{scores.footTraffic}/100</td>
            </tr>
            <tr>
              <th>Demand</th>
              <td>{scores.demand}/100</td>
            </tr>
            <tr>
              <th>Access</th>
              <td>{scores.access}/100</td>
            </tr>
            <tr>
              <th>Competition</th>
              <td>{scores.competition}/100 (higher = more crowded)</td>
            </tr>
            <tr>
              <th>Overall site</th>
              <td>{scores.overall}/100</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section>
        <h2>II. Location analysis</h2>
        <p>{report.location.footTraffic}</p>
        <p>{report.location.demographics}</p>
        <p>{report.location.access}</p>
        <h3>Nearby mix (850 m)</h3>
        <table>
          <thead>
            <tr>
              <th>Category</th>
              <th>Count</th>
            </tr>
          </thead>
          <tbody>
            {(Object.keys(intel.counts) as PoiKind[]).map((k) => (
              <tr key={k}>
                <td>{kindLabel(k)}</td>
                <td>{intel.counts[k]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section>
        <h2>III. Market</h2>
        <p>
          <strong>Demand.</strong> {report.market.demand}
        </p>
        <p>
          <strong>Competition.</strong> {report.market.competition}
        </p>
        <p>
          <strong>Positioning.</strong> {report.market.positioning}
        </p>
      </section>

      <section>
        <h2>IV. Technical</h2>
        <p>{report.technical || "Confirm occupancy type with the city building official before fit-out."}</p>
      </section>

      <section>
        <h2>V. Organization and management</h2>
        <p>{report.management || "Owner-operator for the first six months with one closer and simple daily cash control."}</p>
      </section>

      <section>
        <h2>VI. Financial (directional, PHP)</h2>
        <table>
          <tbody>
            <tr>
              <th>Startup cost</th>
              <td>{php(report.financials.startupCostPhp)}</td>
            </tr>
            <tr>
              <th>Revenue / month (year 1)</th>
              <td>{php(report.financials.monthlyRevenuePhp)}</td>
            </tr>
            <tr>
              <th>Opex / month</th>
              <td>{php(report.financials.monthlyOpexPhp)}</td>
            </tr>
            <tr>
              <th>Break-even</th>
              <td>{report.financials.breakEvenMonths} months</td>
            </tr>
            <tr>
              <th>Year-3 ROI</th>
              <td>{report.financials.year3RoiPct}%</td>
            </tr>
          </tbody>
        </table>
        <p>{report.financials.notes}</p>
      </section>

      <section>
        <h2>VII. Socio-economic</h2>
        <p>{report.socioeconomic || "A micro outlet keeps spend inside the barangay if the offer complements, rather than undercuts, older stores."}</p>
      </section>

      <section>
        <h2>VIII. Alternative businesses ranked by feasibility on this pin</h2>
        <p>
          Same lot, other MSME ideas scored against the live amenity mix. Rank 1 is the strongest
          alternative if the proposed idea is weak or crowded.
        </p>
        <table>
          <thead>
            <tr>
              <th>Rank</th>
              <th>Idea</th>
              <th>Score</th>
              <th>Verdict</th>
              <th>Why this pin</th>
            </tr>
          </thead>
          <tbody>
            {alternatives.map((a) => (
              <tr key={a.idea}>
                <td>{a.rank}</td>
                <td>{a.idea}</td>
                <td>{a.score}/100</td>
                <td>{VERDICT[a.verdict]}</td>
                <td>{a.why}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section>
        <h2>IX. Risks</h2>
        <ol>
          {report.risks.map((r) => (
            <li key={r.title}>
              <strong>
                {r.title} ({r.level})
              </strong>
              — {r.detail}
            </li>
          ))}
        </ol>
      </section>

      <section>
        <h2>X. Permits</h2>
        <ol>
          {report.permits.map((p) => (
            <li key={p.name}>
              <strong>{p.name}.</strong> {p.note}
            </li>
          ))}
        </ol>
      </section>

      <section>
        <h2>XI. Recommendations</h2>
        <ol>
          {report.recommendations.map((r) => (
            <li key={r}>{r}</li>
          ))}
        </ol>
      </section>

      <section>
        <h2>XII. Research log</h2>
        <ol>
          {report.researchLog.map((s) => (
            <li key={s.step}>
              <strong>{s.step}.</strong> {s.finding}
            </li>
          ))}
        </ol>
      </section>

      <footer>
        Prepared with Feasify. Location intelligence from the live map pin and amenity scan. Financials
        are directional MSME ranges, not a bank-ready audit.
      </footer>
    </article>
  );
}
