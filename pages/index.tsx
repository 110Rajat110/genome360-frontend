import { useState } from "react";

type Result = { prediction?: number; probability?: number; error?: string };
const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000";

export default function Home() {
  // Genomics
  const [prs, setPrs] = useState(0);
  const [cnvCount, setCnvCount] = useState(0);
  const [snpRs429358, setSnpRs429358] = useState(0);
  const [geneAPOEe4, setGeneAPOEe4] = useState(0);
  const [geneBRCA1, setGeneBRCA1] = useState(0);

  // Biomarkers
  const [chol, setChol] = useState<number | ''>('');
  const [hdl, setHdl] = useState<number | ''>('');
  const [ldl, setLdl] = useState<number | ''>('');
  const [trig, setTrig] = useState<number | ''>('');
  const [glucose, setGlucose] = useState<number | ''>('');
  const [hba1c, setHba1c] = useState<number | ''>('');
  const [sbp, setSbp] = useState<number | ''>('');
  const [dbp, setDbp] = useState<number | ''>('');
  const [familyHx, setFamilyHx] = useState<string>("");
  const [comorbid, setComorbid] = useState<string>("");

  // Lifestyle & Env
  const [dietQ, setDietQ] = useState(3);
  const [activity, setActivity] = useState(0);
  const [smoking, setSmoking] = useState("never");
  const [alcohol, setAlcohol] = useState(0);
  const [stress, setStress] = useState(3);
  const [sleep, setSleep] = useState(7);
  const [pollution, setPollution] = useState(3);

  // Pharmacogenomics
  const [cyp2d6, setCyp2d6] = useState("normal");
  const [cyp2c19, setCyp2c19] = useState("normal");
  const [cyp3a4, setCyp3a4] = useState(3);
  const [abcb1, setAbcb1] = useState(0);
  const [egfrL858R, setEgfrL858R] = useState(0);

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Result | null>(null);

  function splitCsvToList(s: string): string[] {
    return s.trim() ? s.split(",").map(x => x.trim()).filter(Boolean) : [];
  }

  async function handlePredict() {
    try {
      setLoading(true);
      setResult(null);

      const body = {
        genomic: {
          polygenic_risk_score: prs,
          cnv_count: cnvCount,
          snps: { rs429358: snpRs429358 },
          key_gene_variants: { APOE_e4: geneAPOEe4, BRCA1: geneBRCA1 }
        },
        biomarkers: {
          cholesterol_total: chol === '' ? null : Number(chol),
          hdl: hdl === '' ? null : Number(hdl),
          ldl: ldl === '' ? null : Number(ldl),
          triglycerides: trig === '' ? null : Number(trig),
          glucose_fasting: glucose === '' ? null : Number(glucose),
          hba1c: hba1c === '' ? null : Number(hba1c),
          systolic_bp: sbp === '' ? null : Number(sbp),
          diastolic_bp: dbp === '' ? null : Number(dbp),
          family_history: splitCsvToList(familyHx),
          comorbidities: splitCsvToList(comorbid)
        },
        lifestyle: {
          diet_quality: dietQ,
          physical_activity_hours_per_week: activity,
          smoking_status: smoking,
          alcohol_units_per_week: alcohol,
          stress_level: stress,
          sleep_hours: sleep,
          pollution_exposure_index: pollution
        },
        pharmacogenomics: {
          cyp2d6_metabolizer: cyp2d6,
          cyp2c19_metabolizer: cyp2c19,
          cyp3a4_activity: cyp3a4,
          abcb1_variant: abcb1,
          receptor_mutations: { EGFR_L858R: egfrL858R }
        }
      };

      const res = await fetch(`${API_BASE}/api/predict`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      setResult(json);
    } catch (e: any) {
      setResult({ error: String(e) });
    } finally {
      setLoading(false);
    }
  }

  const page = {
    background: "linear-gradient(135deg, #0ea5e9 0%, #8b5cf6 50%, #f43f5e 100%)",
    minHeight: "100vh",
    padding: "32px 20px"
  } as const;

  const container: React.CSSProperties = {
    maxWidth: 1000, margin: "0 auto", display: "grid", gap: 16
  };

  const card = (hue: string): React.CSSProperties => ({
    padding: 16,
    borderRadius: 14,
    border: "1px solid rgba(255,255,255,0.25)",
    background: `linear-gradient(180deg, rgba(255,255,255,0.35), rgba(255,255,255,0.15))`,
    backdropFilter: "blur(8px)",
    boxShadow: `0 10px 30px rgba(0,0,0,0.20)`,
    transition: "transform .2s ease",
  });

  const sectionGrid = (cols: number): React.CSSProperties => ({
    display: "grid",
    gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
    gap: 12
  });

  const label: React.CSSProperties = { fontSize: 13, color: "#1f2937", fontWeight: 600 };

  const inputBase: React.CSSProperties = {
    width: "100%",
    padding: "10px 12px",
    borderRadius: 10,
    border: "1px solid #e5e7eb",
    background: "white",
    color: "#111827",
    outline: "none",
    boxShadow: "0 1px 0 rgba(0,0,0,0.03)"
  };

  const btn: React.CSSProperties = {
    background: "linear-gradient(135deg, #22c55e 0%, #06b6d4 50%, #3b82f6 100%)",
    color: "white",
    fontWeight: 700,
    padding: "14px 18px",
    border: "none",
    borderRadius: 12,
    cursor: "pointer",
    width: 240,
    boxShadow: "0 10px 20px rgba(59,130,246,0.35)",
    transition: "transform .15s ease, box-shadow .15s ease"
  };

  const headerCard: React.CSSProperties = {
    padding: 20,
    borderRadius: 16,
    border: "1px solid rgba(255,255,255,0.35)",
    background: "linear-gradient(180deg, rgba(255,255,255,0.9), rgba(255,255,255,0.6))",
    boxShadow: "0 12px 40px rgba(0,0,0,0.25)"
  };

  return (
    <div style={page}>
      <div style={container}>
        <header style={headerCard}>
          <h1 style={{ margin: 0, color: "#0f172a" }}>Genome360 Prototype</h1>
          <p style={{ marginTop: 6, color: "#334155" }}>
            Colorful, interactive risk simulation with genomics, biomarkers, lifestyle and pharmacogenomics.
          </p>
        </header>

        <section style={card("#60a5fa")}>
          <h3 style={{ marginTop: 0, color: "#0f172a" }}>Genomic Data</h3>
          <div style={sectionGrid(3)}>
            <div><div style={label}>PRS: {prs}</div><input type="range" min={0} max={10} step={0.1} value={prs} onChange={e=>setPrs(Number(e.target.value))} /></div>
            <div><div style={label}>CNV count: {cnvCount}</div><input type="range" min={0} max={20} step={1} value={cnvCount} onChange={e=>setCnvCount(Number(e.target.value))} /></div>
            <div><div style={label}>SNP rs429358 (0/1/2)</div><input style={inputBase} type="number" min={0} max={2} value={snpRs429358} onChange={e=>setSnpRs429358(Number(e.target.value))} /></div>
            <div><div style={label}>APOE ε4 (0/1)</div><input style={inputBase} type="number" min={0} max={1} value={geneAPOEe4} onChange={e=>setGeneAPOEe4(Number(e.target.value))} /></div>
            <div><div style={label}>BRCA1 variant (0/1)</div><input style={inputBase} type="number" min={0} max={1} value={geneBRCA1} onChange={e=>setGeneBRCA1(Number(e.target.value))} /></div>
          </div>
        </section>

        <section style={card("#f97316")}>
          <h3 style={{ marginTop: 0, color: "#0f172a" }}>Clinical / Biomarkers</h3>
          <div style={sectionGrid(4)}>
            <div><div style={label}>Total Chol</div><input style={inputBase} value={chol} onChange={e=>setChol(e.target.value === '' ? '' : Number(e.target.value))} placeholder="mg/dL" /></div>
            <div><div style={label}>HDL</div><input style={inputBase} value={hdl} onChange={e=>setHdl(e.target.value === '' ? '' : Number(e.target.value))} /></div>
            <div><div style={label}>LDL</div><input style={inputBase} value={ldl} onChange={e=>setLdl(e.target.value === '' ? '' : Number(e.target.value))} /></div>
            <div><div style={label}>Triglycerides</div><input style={inputBase} value={trig} onChange={e=>setTrig(e.target.value === '' ? '' : Number(e.target.value))} /></div>
            <div><div style={label}>Glucose fasting</div><input style={inputBase} value={glucose} onChange={e=>setGlucose(e.target.value === '' ? '' : Number(e.target.value))} /></div>
            <div><div style={label}>HbA1c (%)</div><input style={inputBase} value={hba1c} onChange={e=>setHba1c(e.target.value === '' ? '' : Number(e.target.value))} /></div>
            <div><div style={label}>SBP</div><input style={inputBase} value={sbp} onChange={e=>setSbp(e.target.value === '' ? '' : Number(e.target.value))} /></div>
            <div><div style={label}>DBP</div><input style={inputBase} value={dbp} onChange={e=>setDbp(e.target.value === '' ? '' : Number(e.target.value))} /></div>
            <div style={{ gridColumn: "span 2" }}><div style={label}>Family history (csv)</div><input style={inputBase} value={familyHx} onChange={e=>setFamilyHx(e.target.value)} placeholder="e.g., cancer, diabetes" /></div>
            <div style={{ gridColumn: "span 2" }}><div style={label}>Comorbidities (csv)</div><input style={inputBase} value={comorbid} onChange={e=>setComorbid(e.target.value)} placeholder="e.g., hypertension, CKD" /></div>
          </div>
        </section>

        <section style={card("#10b981")}>
          <h3 style={{ marginTop: 0, color: "#0f172a" }}>Lifestyle & Environment</h3>
          <div style={sectionGrid(3)}>
            <div><div style={label}>Diet quality: {dietQ}</div><input type="range" min={1} max={5} step={1} value={dietQ} onChange={e=>setDietQ(Number(e.target.value))} /></div>
            <div><div style={label}>Activity (hrs/wk): {activity}</div><input type="range" min={0} max={20} step={0.5} value={activity} onChange={e=>setActivity(Number(e.target.value))} /></div>
            <div><div style={label}>Smoking</div>
              <select style={inputBase} value={smoking} onChange={e=>setSmoking(e.target.value)}>
                <option value="never">never</option>
                <option value="former">former</option>
                <option value="current">current</option>
              </select>
            </div>
            <div><div style={label}>Alcohol units/wk: {alcohol}</div><input type="range" min={0} max={30} step={1} value={alcohol} onChange={e=>setAlcohol(Number(e.target.value))} /></div>
            <div><div style={label}>Stress: {stress}</div><input type="range" min={1} max={5} step={1} value={stress} onChange={e=>setStress(Number(e.target.value))} /></div>
            <div><div style={label}>Sleep hours: {sleep}</div><input type="range" min={3} max={10} step={0.5} value={sleep} onChange={e=>setSleep(Number(e.target.value))} /></div>
            <div><div style={label}>Pollution index: {pollution}</div><input type="range" min={1} max={5} step={1} value={pollution} onChange={e=>setPollution(Number(e.target.value))} /></div>
          </div>
        </section>

        <section style={card("#f59e0b")}>
          <h3 style={{ marginTop: 0, color: "#0f172a" }}>Pharmacogenomics</h3>
          <div style={sectionGrid(3)}>
            <div><div style={label}>CYP2D6</div>
              <select style={inputBase} value={cyp2d6} onChange={e=>setCyp2d6(e.target.value)}>
                <option value="poor">poor</option>
                <option value="intermediate">intermediate</option>
                <option value="normal">normal</option>
                <option value="ultrarapid">ultrarapid</option>
              </select>
            </div>
            <div><div style={label}>CYP2C19</div>
              <select style={inputBase} value={cyp2c19} onChange={e=>setCyp2c19(e.target.value)}>
                <option value="poor">poor</option>
                <option value="intermediate">intermediate</option>
                <option value="normal">normal</option>
                <option value="ultrarapid">ultrarapid</option>
              </select>
            </div>
            <div><div style={label}>CYP3A4 activity: {cyp3a4}</div><input type="range" min={1} max={5} step={1} value={cyp3a4} onChange={e=>setCyp3a4(Number(e.target.value))} /></div>
            <div><div style={label}>ABCB1 variant (0/1)</div><input style={inputBase} type="number" min={0} max={1} value={abcb1} onChange={e=>setAbcb1(Number(e.target.value))} /></div>
            <div><div style={label}>EGFR L858R (0/1)</div><input style={inputBase} type="number" min={0} max={1} value={egfrL858R} onChange={e=>setEgfrL858R(Number(e.target.value))} /></div>
          </div>
        </section>

        <button
          onClick={handlePredict}
          disabled={loading}
          style={btn}
          onMouseEnter={(e)=>{ (e.currentTarget.style.transform="translateY(-2px)"); (e.currentTarget.style.boxShadow="0 14px 28px rgba(59,130,246,0.45)")}}
          onMouseLeave={(e)=>{ (e.currentTarget.style.transform="translateY(0)"); (e.currentTarget.style.boxShadow="0 10px 20px rgba(59,130,246,0.35)")}}
        >
          {loading ? "Running..." : "Run Prediction"}
        </button>

        {result && (
          <section style={{ padding: 16, borderRadius: 14, border: "1px solid rgba(255,255,255,0.35)", background: "linear-gradient(180deg, rgba(255,255,255,0.95), rgba(255,255,255,0.7))", boxShadow: "0 10px 30px rgba(0,0,0,0.2)" }}>
            <h3 style={{ marginTop: 0, color: "#0f172a" }}>Result</h3>
            <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
              {"prediction" in result && (
                <span style={{ padding: "8px 12px", borderRadius: 999, color: "white", background: result.prediction ? "#ef4444" : "#10b981", fontWeight: 700 }}>
                  {result.prediction ? "High Risk" : "Low Risk"}
                </span>
              )}
              {"probability" in result && (
                <span style={{ padding: "8px 12px", borderRadius: 999, color: "#0f172a", background: "#fde68a", fontWeight: 700 }}>
                  P = {(Number(result.probability || 0) * 100).toFixed(1)}%
                </span>
              )}
            </div>
            <pre style={{ marginTop: 12, background: "#0f172a", color: "#e5e7eb", padding: 12, borderRadius: 10, overflowX: "auto" }}>
              {JSON.stringify(result, null, 2)}
            </pre>
          </section>
        )}
      </div>
    </div>
  );
}
