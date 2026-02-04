import { useState, useMemo } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, BarChart, Bar, ComposedChart, Area
} from "recharts";

const MONTHS = ["202501","202502","202503","202504","202505","202506","202507","202508","202509","202510","202511","202512","202601"];
const MONTH_LABELS = ["2025/01","2025/02","2025/03","2025/04","2025/05","2025/06","2025/07","2025/08","2025/09","2025/10","2025/11","2025/12","2026/01"];

const sites = [
  { key: "taipei", name: "臺北旅遊網", short: "臺北", color: "#f43f5e" },
  { key: "kinmen", name: "金門旅遊網", short: "金門", color: "#f97316" },
  { key: "newTaipei", name: "新北市旅遊網", short: "新北", color: "#eab308" },
  { key: "tainan", name: "台南旅遊網", short: "台南", color: "#22c55e" },
  { key: "kaohsiung", name: "高雄旅遊網", short: "高雄", color: "#06b6d4" },
  { key: "taichung", name: "臺中觀光旅遊網", short: "臺中", color: "#8b5cf6" },
  { key: "taoyuan", name: "桃園觀光導覽網", short: "桃園", color: "#ec4899" },
  { key: "alishan", name: "阿里山國家風景區", short: "阿里山", color: "#14b8a6" },
  { key: "siraya", name: "西拉雅國家風景區", short: "西拉雅", color: "#818cf8" },
  { key: "eastCoast", name: "東海岸旅遊網", short: "東海岸", color: "#a855f7" },
  { key: "valley", name: "花東縱谷旅遊網", short: "花東縱谷", color: "#34d399" },
  { key: "eastTW", name: "東區觀光圈", short: "東觀光圈", color: "#fb923c" },
  { key: "yunjianan", name: "雲嘉南旅遊網", short: "雲嘉南", color: "#38bdf8" },
  { key: "triMtn", name: "參山國家風景區", short: "參山", color: "#c084fc" },
];

// Monthly PV data per site
const rawPV = {
  taipei:     [371871,207707,178014,158428,262696,133703,13868,26091,79222,500239,651397,781115,1288473],
  kinmen:     [2464,2579,4468,8574,4312,4805,4999,6116,12219,52454,98432,101992,25108],
  newTaipei:  [637,701,919,859,3148,1240,1448,1134,1420,3995,8488,99866,75710],
  tainan:     [466,495,1338,27731,55644,1288,1941,1387,2818,21057,63434,38046,47178],
  kaohsiung:  [4,9,9,732,1481,942,2030,3887,2538,9375,23033,23299,66883],
  taichung:   [50,86,77,77,71,57,447,97,170,587,82586,30313,9464],
  taoyuan:    [13,19,12,19,19,27,99,56,1306,516,85868,14920,5287],
  alishan:    [21,5,21,17,9,37,17,13,15,90,176,425,11357],
  siraya:     [2,7,5,3,2,1,1,5,4,29,56,200,7222],
  eastCoast:  [54,18,4,10,19,32,24,68,20,97,78,296,4569],
  valley:     [5,4,2,2,7,3,8,9,14,35,61,171,6495],
  eastTW:     [0,22,108,57,12,213,69,72,177,619,703,367,862],
  yunjianan:  [0,2,5,1,1,4,1,5,1,52,115,791,6721],
  triMtn:     [2,5,1,1,19,4,2,3,8,23,21,82,941],
};
const rawSess = {
  taipei:     [342220,194673,163755,141315,236421,122775,10525,21671,73248,508482,632746,736111,1182304],
  kinmen:     [1536,1435,3036,6731,3360,3708,3796,5164,11447,50474,95928,101375,24443],
  newTaipei:  [551,651,813,799,2949,1059,1354,953,1402,3903,7898,92873,61800],
  tainan:     [450,484,1344,27862,54693,1240,1880,1334,2475,20795,63614,38438,45838],
  kaohsiung:  [5,9,5,714,1446,901,1938,3882,2526,9219,23134,23106,62469],
  taichung:   [36,65,58,63,43,46,73,166,275,590,83797,30877,9725],
  taoyuan:    [11,14,9,15,19,21,63,47,860,542,86446,14758,5339],
  alishan:    [10,4,12,9,7,10,18,26,19,78,189,410,11275],
  siraya:     [2,2,2,2,2,1,1,30,13,29,72,201,7237],
  eastCoast:  [8,12,5,10,12,22,15,52,34,36,84,309,4477],
  valley:     [2,5,2,3,7,4,5,26,29,31,67,171,6395],
  eastTW:     [0,9,52,27,6,92,38,54,72,322,383,209,503],
  yunjianan:  [0,1,3,1,2,3,1,30,12,52,125,792,6905],
  triMtn:     [2,4,1,1,10,5,2,43,25,16,39,85,942],
};

// Build chart-ready data
const chartData = MONTHS.map((m, i) => {
  const row = { month: MONTH_LABELS[i] };
  sites.forEach(s => {
    row[s.key + "_pv"] = rawPV[s.key][i];
    row[s.key + "_sess"] = rawSess[s.key][i];
  });
  row.total_pv = sites.reduce((sum, s) => sum + rawPV[s.key][i], 0);
  row.total_sess = sites.reduce((sum, s) => sum + rawSess[s.key][i], 0);
  return row;
});

// Totals per site
const siteTotals = sites.map(s => ({
  ...s,
  totalPV: rawPV[s.key].reduce((a, b) => a + b, 0),
  totalSess: rawSess[s.key].reduce((a, b) => a + b, 0),
})).sort((a, b) => b.totalPV - a.totalPV);

const grandTotalPV = siteTotals.reduce((s, d) => s + d.totalPV, 0);
const grandTotalSess = siteTotals.reduce((s, d) => s + d.totalSess, 0);

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  const sorted = [...payload].sort((a, b) => (b.value || 0) - (a.value || 0));
  return (
    <div style={{
      background: "rgba(10, 14, 26, 0.96)", border: "1px solid rgba(99,102,241,0.25)",
      borderRadius: 10, padding: "14px 18px", backdropFilter: "blur(12px)",
      boxShadow: "0 8px 32px rgba(0,0,0,0.5)", maxHeight: 420, overflowY: "auto",
    }}>
      <p style={{ color: "#94a3b8", fontSize: 12, margin: "0 0 10px", fontFamily: "'Noto Sans TC', sans-serif" }}>{label}</p>
      {sorted.map((p, i) => (
        p.value > 0 && <p key={i} style={{
          color: p.color, fontSize: 13, margin: "3px 0", fontWeight: 500,
          fontFamily: "'Noto Sans TC', sans-serif",
        }}>
          {p.name}：{p.value.toLocaleString()}
        </p>
      ))}
    </div>
  );
};

export default function AllSitesTrendChart() {
  const [metric, setMetric] = useState("pv");
  const [selected, setSelected] = useState(new Set(sites.map(s => s.key)));
  const [viewMode, setViewMode] = useState("line");

  const toggleSite = (key) => {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(key)) { if (next.size > 1) next.delete(key); }
      else next.add(key);
      return next;
    });
  };

  const selectAll = () => setSelected(new Set(sites.map(s => s.key)));
  const selectNone = () => setSelected(new Set([sites[0].key]));

  const suffix = metric === "pv" ? "_pv" : "_sess";
  const metricLabel = metric === "pv" ? "瀏覽量" : "工作階段";

  // For stacked bar
  const stackData = chartData.map(row => {
    const d = { month: row.month };
    sites.forEach(s => { if (selected.has(s.key)) d[s.key] = row[s.key + suffix]; });
    return d;
  });

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(145deg, #0a0e1a 0%, #0f172a 40%, #1a1040 100%)",
      fontFamily: "'Noto Sans TC', sans-serif", color: "#e2e8f0", padding: "36px 20px",
    }}>
      <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@300;400;500;600;700&display=swap" rel="stylesheet" />

      {/* Header */}
      <div style={{ maxWidth: 1200, margin: "0 auto 28px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
          <div style={{ width: 6, height: 36, borderRadius: 3, background: "linear-gradient(180deg, #f43f5e, #818cf8)" }} />
          <h1 style={{
            fontSize: 24, fontWeight: 700, margin: 0,
            background: "linear-gradient(135deg, #fce7f3, #818cf8, #34d399)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          }}>
            全站 China × Direct 流量趨勢總覽
          </h1>
        </div>
        <p style={{ color: "#64748b", fontSize: 13, margin: "0 0 0 18px" }}>
          篩選條件：國家 = China ｜ 管道 = Direct ｜ 期間 2025/01 – 2026/01 ｜ 共 {sites.length} 個網站
        </p>
      </div>

      {/* Grand KPIs */}
      <div style={{ maxWidth: 1200, margin: "0 auto 24px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 14 }}>
        {[
          { label: "全站瀏覽量總計", value: grandTotalPV.toLocaleString(), color: "#818cf8", icon: "📊" },
          { label: "全站工作階段總計", value: grandTotalSess.toLocaleString(), color: "#34d399", icon: "🔗" },
          { label: "涵蓋網站數", value: sites.length, color: "#f472b6", icon: "🌐" },
          { label: "資料月份數", value: "13 個月", color: "#fbbf24", icon: "📅" },
        ].map((c, i) => (
          <div key={i} style={{
            background: "rgba(30,41,59,0.5)", border: "1px solid rgba(99,102,241,0.1)",
            borderRadius: 12, padding: "16px 18px", backdropFilter: "blur(8px)",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 12, color: "#94a3b8", fontWeight: 500 }}>{c.label}</span>
              <span style={{ fontSize: 18 }}>{c.icon}</span>
            </div>
            <div style={{ fontSize: 24, fontWeight: 700, color: c.color, marginTop: 6 }}>{c.value}</div>
          </div>
        ))}
      </div>

      {/* Controls */}
      <div style={{ maxWidth: 1200, margin: "0 auto 16px", display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center" }}>
        <div style={{ display: "flex", gap: 6 }}>
          {[{v:"pv",l:"📊 瀏覽量"},{v:"sess",l:"🔗 工作階段"}].map(m => (
            <button key={m.v} onClick={() => setMetric(m.v)} style={{
              padding: "7px 16px", borderRadius: 7, border: "none", cursor: "pointer",
              fontSize: 12, fontWeight: 600, fontFamily: "'Noto Sans TC', sans-serif",
              background: metric === m.v ? "linear-gradient(135deg, #6366f1, #818cf8)" : "rgba(30,41,59,0.6)",
              color: metric === m.v ? "#fff" : "#94a3b8",
              boxShadow: metric === m.v ? "0 3px 12px rgba(99,102,241,0.3)" : "none",
            }}>{m.l}</button>
          ))}
        </div>
        <div style={{ width: 1, height: 24, background: "rgba(148,163,184,0.15)", margin: "0 4px" }} />
        <div style={{ display: "flex", gap: 6 }}>
          {[{v:"line",l:"📈 折線"},{v:"stack",l:"📊 堆疊"}].map(m => (
            <button key={m.v} onClick={() => setViewMode(m.v)} style={{
              padding: "7px 16px", borderRadius: 7, border: "none", cursor: "pointer",
              fontSize: 12, fontWeight: 600, fontFamily: "'Noto Sans TC', sans-serif",
              background: viewMode === m.v ? "linear-gradient(135deg, #6366f1, #818cf8)" : "rgba(30,41,59,0.6)",
              color: viewMode === m.v ? "#fff" : "#94a3b8",
              boxShadow: viewMode === m.v ? "0 3px 12px rgba(99,102,241,0.3)" : "none",
            }}>{m.l}</button>
          ))}
        </div>
        <div style={{ width: 1, height: 24, background: "rgba(148,163,184,0.15)", margin: "0 4px" }} />
        <button onClick={selectAll} style={{ padding: "6px 12px", borderRadius: 6, border: "none", cursor: "pointer", fontSize: 11, background: "rgba(34,197,94,0.15)", color: "#34d399", fontFamily: "'Noto Sans TC', sans-serif" }}>全選</button>
        <button onClick={selectNone} style={{ padding: "6px 12px", borderRadius: 6, border: "none", cursor: "pointer", fontSize: 11, background: "rgba(239,68,68,0.15)", color: "#f87171", fontFamily: "'Noto Sans TC', sans-serif" }}>清除</button>
      </div>

      {/* Site toggles */}
      <div style={{ maxWidth: 1200, margin: "0 auto 20px", display: "flex", flexWrap: "wrap", gap: 6 }}>
        {sites.map(s => (
          <button key={s.key} onClick={() => toggleSite(s.key)} style={{
            padding: "5px 12px", borderRadius: 20, border: `1.5px solid ${selected.has(s.key) ? s.color : "rgba(148,163,184,0.15)"}`,
            cursor: "pointer", fontSize: 12, fontWeight: 500,
            fontFamily: "'Noto Sans TC', sans-serif",
            background: selected.has(s.key) ? `${s.color}18` : "transparent",
            color: selected.has(s.key) ? s.color : "#64748b",
            transition: "all 0.2s",
          }}>
            <span style={{ display: "inline-block", width: 8, height: 8, borderRadius: "50%", background: s.color, marginRight: 6, opacity: selected.has(s.key) ? 1 : 0.3 }} />
            {s.short}
          </button>
        ))}
      </div>

      {/* Main Chart */}
      <div style={{
        maxWidth: 1200, margin: "0 auto 24px",
        background: "rgba(30,41,59,0.4)", border: "1px solid rgba(99,102,241,0.1)",
        borderRadius: 14, padding: "24px 16px 12px", backdropFilter: "blur(8px)",
      }}>
        <h2 style={{ fontSize: 15, fontWeight: 600, color: "#c7d2fe", margin: "0 0 16px 8px" }}>
          {viewMode === "line" ? `月度${metricLabel}趨勢（折線圖）` : `月度${metricLabel}趨勢（堆疊柱狀圖）`}
        </h2>
        <ResponsiveContainer width="100%" height={420}>
          {viewMode === "line" ? (
            <LineChart data={chartData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 6" stroke="rgba(148,163,184,0.08)" />
              <XAxis dataKey="month" tick={{ fill: "#64748b", fontSize: 11 }} tickLine={false} axisLine={{ stroke: "rgba(148,163,184,0.12)" }} />
              <YAxis tick={{ fill: "#64748b", fontSize: 10 }} tickLine={false} axisLine={false} tickFormatter={v => v >= 1000 ? `${(v/1000).toFixed(0)}k` : v} />
              <Tooltip content={<CustomTooltip />} />
              {sites.filter(s => selected.has(s.key)).map(s => (
                <Line key={s.key} type="monotone" dataKey={s.key + suffix} name={s.short}
                  stroke={s.color} strokeWidth={2} dot={{ r: 3, fill: s.color, stroke: "#0f172a", strokeWidth: 1.5 }}
                  activeDot={{ r: 5, fill: s.color, stroke: "#0f172a", strokeWidth: 2 }} />
              ))}
            </LineChart>
          ) : (
            <BarChart data={stackData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 6" stroke="rgba(148,163,184,0.08)" />
              <XAxis dataKey="month" tick={{ fill: "#64748b", fontSize: 11 }} tickLine={false} axisLine={{ stroke: "rgba(148,163,184,0.12)" }} />
              <YAxis tick={{ fill: "#64748b", fontSize: 10 }} tickLine={false} axisLine={false} tickFormatter={v => v >= 1000 ? `${(v/1000).toFixed(0)}k` : v} />
              <Tooltip content={<CustomTooltip />} />
              {sites.filter(s => selected.has(s.key)).map(s => (
                <Bar key={s.key} dataKey={s.key} name={s.short} stackId="a" fill={s.color} fillOpacity={0.85} />
              ))}
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Ranking Table */}
      <div style={{
        maxWidth: 1200, margin: "0 auto 24px",
        background: "rgba(30,41,59,0.4)", border: "1px solid rgba(99,102,241,0.1)",
        borderRadius: 14, padding: "24px 16px 12px", backdropFilter: "blur(8px)",
      }}>
        <h2 style={{ fontSize: 15, fontWeight: 600, color: "#c7d2fe", margin: "0 0 16px 8px" }}>
          網站流量排名（期間總計）
        </h2>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: "0 3px" }}>
            <thead>
              <tr>
                {["排名", "網站", "瀏覽量", "工作階段", "瀏覽量佔比", "工作階段佔比"].map((h, i) => (
                  <th key={i} style={{
                    padding: "10px 12px", textAlign: i < 2 ? "left" : "right",
                    fontSize: 12, color: "#94a3b8", fontWeight: 600,
                    borderBottom: "1px solid rgba(148,163,184,0.12)",
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {siteTotals.map((s, i) => (
                <tr key={s.key} style={{ background: i % 2 === 0 ? "rgba(99,102,241,0.04)" : "transparent" }}>
                  <td style={{ padding: "10px 12px", fontSize: 13, color: i < 3 ? "#fbbf24" : "#94a3b8", fontWeight: 700, width: 50 }}>
                    {i < 3 ? ["🥇","🥈","🥉"][i] : `#${i + 1}`}
                  </td>
                  <td style={{ padding: "10px 12px", fontSize: 13, fontWeight: 500 }}>
                    <span style={{ display: "inline-block", width: 10, height: 10, borderRadius: "50%", background: s.color, marginRight: 8, verticalAlign: "middle" }} />
                    <span style={{ color: s.color }}>{s.short}</span>
                    <span style={{ color: "#64748b", fontSize: 11, marginLeft: 8 }}>{s.name}</span>
                  </td>
                  <td style={{ padding: "10px 12px", fontSize: 13, color: "#818cf8", textAlign: "right", fontWeight: 600 }}>{s.totalPV.toLocaleString()}</td>
                  <td style={{ padding: "10px 12px", fontSize: 13, color: "#34d399", textAlign: "right", fontWeight: 600 }}>{s.totalSess.toLocaleString()}</td>
                  <td style={{ padding: "10px 12px", fontSize: 12, color: "#94a3b8", textAlign: "right" }}>{(s.totalPV / grandTotalPV * 100).toFixed(1)}%</td>
                  <td style={{ padding: "10px 12px", fontSize: 12, color: "#94a3b8", textAlign: "right" }}>{(s.totalSess / grandTotalSess * 100).toFixed(1)}%</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr style={{ borderTop: "2px solid rgba(148,163,184,0.2)" }}>
                <td colSpan={2} style={{ padding: "12px 12px", fontSize: 13, color: "#e2e8f0", fontWeight: 700 }}>合計</td>
                <td style={{ padding: "12px 12px", fontSize: 13, color: "#818cf8", textAlign: "right", fontWeight: 700 }}>{grandTotalPV.toLocaleString()}</td>
                <td style={{ padding: "12px 12px", fontSize: 13, color: "#34d399", textAlign: "right", fontWeight: 700 }}>{grandTotalSess.toLocaleString()}</td>
                <td style={{ padding: "12px 12px", fontSize: 12, color: "#94a3b8", textAlign: "right" }}>100%</td>
                <td style={{ padding: "12px 12px", fontSize: 12, color: "#94a3b8", textAlign: "right" }}>100%</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Monthly Detail Table */}
      <div style={{
        maxWidth: 1200, margin: "0 auto 24px",
        background: "rgba(30,41,59,0.4)", border: "1px solid rgba(99,102,241,0.1)",
        borderRadius: 14, padding: "24px 16px 12px", backdropFilter: "blur(8px)",
      }}>
        <h2 style={{ fontSize: 15, fontWeight: 600, color: "#c7d2fe", margin: "0 0 16px 8px" }}>
          各站月度{metricLabel}明細
        </h2>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: "0 2px", minWidth: 900 }}>
            <thead>
              <tr>
                <th style={{ padding: "8px 10px", textAlign: "left", fontSize: 11, color: "#94a3b8", fontWeight: 600, borderBottom: "1px solid rgba(148,163,184,0.12)", position: "sticky", left: 0, background: "#0f172a", zIndex: 2 }}>網站</th>
                {MONTH_LABELS.map(m => (
                  <th key={m} style={{ padding: "8px 6px", textAlign: "right", fontSize: 10, color: "#94a3b8", fontWeight: 500, borderBottom: "1px solid rgba(148,163,184,0.12)", whiteSpace: "nowrap" }}>{m}</th>
                ))}
                <th style={{ padding: "8px 10px", textAlign: "right", fontSize: 11, color: "#fbbf24", fontWeight: 600, borderBottom: "1px solid rgba(148,163,184,0.12)" }}>總計</th>
              </tr>
            </thead>
            <tbody>
              {siteTotals.map((s, i) => {
                const data = metric === "pv" ? rawPV[s.key] : rawSess[s.key];
                const total = data.reduce((a, b) => a + b, 0);
                const maxVal = Math.max(...data);
                return (
                  <tr key={s.key} style={{ background: i % 2 === 0 ? "rgba(99,102,241,0.03)" : "transparent" }}>
                    <td style={{ padding: "8px 10px", fontSize: 12, color: s.color, fontWeight: 600, position: "sticky", left: 0, background: i % 2 === 0 ? "rgba(15,23,42,0.97)" : "rgba(15,23,42,0.95)", zIndex: 1, whiteSpace: "nowrap" }}>
                      <span style={{ display: "inline-block", width: 8, height: 8, borderRadius: "50%", background: s.color, marginRight: 6 }} />
                      {s.short}
                    </td>
                    {data.map((v, j) => (
                      <td key={j} style={{
                        padding: "8px 6px", fontSize: 11, textAlign: "right",
                        color: v === maxVal && v > 0 ? "#fbbf24" : v > 0 ? "#c7d2fe" : "#475569",
                        fontWeight: v === maxVal && v > 0 ? 700 : 400,
                      }}>{v.toLocaleString()}</td>
                    ))}
                    <td style={{ padding: "8px 10px", fontSize: 12, color: s.color, textAlign: "right", fontWeight: 700 }}>{total.toLocaleString()}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: "20px auto 0", textAlign: "center" }}>
        <p style={{ fontSize: 11, color: "#475569" }}>
          資料來源：Google Analytics 4 ｜ 篩選：國家=China、管道=Direct ｜ 產出日期：2026/02/04
        </p>
      </div>
    </div>
  );
}