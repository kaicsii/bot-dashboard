import { useState, useMemo, useEffect } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ComposedChart, Cell, LabelList,
  AreaChart, Area, LineChart, Line
} from "recharts";

/* ══════════════════════════════════════════════
   Data: Summary + Monthly Bot Trend
   Bot 識別：國家=China、管道=Direct
   期間：2025/01 – 2026/01
   ══════════════════════════════════════════════ */

const ML = ["2025/01","2025/02","2025/03","2025/04","2025/05","2025/06","2025/07","2025/08","2025/09","2025/10","2025/11","2025/12","2026/01"];
const MS = ["1月","2月","3月","4月","5月","6月","7月","8月","9月","10月","11月","12月","1月"];

const data = [
  { key:"taipei",name:"臺北旅遊網",short:"臺北",color:"#f43f5e",totalPV:29743387,totalSess:14544064,botPV:4652824,botSess:4366246 },
  { key:"kaohsiung",name:"高雄旅遊網",short:"高雄",color:"#06b6d4",totalPV:7071698,totalSess:4380967,botPV:134222,botSess:129353 },
  { key:"newTaipei",name:"新北市旅遊網",short:"新北",color:"#eab308",totalPV:6878769,totalSess:3939825,botPV:199565,botSess:177005 },
  { key:"tainan",name:"台南旅遊網",short:"台南",color:"#22c55e",totalPV:5107667,totalSess:3399765,botPV:262823,botSess:260447 },
  { key:"kinmen",name:"金門旅遊網",short:"金門",color:"#f97316",totalPV:4306758,totalSess:2275599,botPV:328522,botSess:312433 },
  { key:"taoyuan",name:"桃園觀光導覽網",short:"桃園",color:"#ec4899",totalPV:10984126,totalSess:6287770,botPV:108161,botSess:108144 },
  { key:"taichung",name:"臺中觀光旅遊網",short:"臺中",color:"#8b5cf6",totalPV:9305377,totalSess:4869486,botPV:124082,botSess:125814 },
  { key:"alishan",name:"阿里山國家風景區",short:"阿里山",color:"#14b8a6",totalPV:2524061,totalSess:1494563,botPV:12203,botSess:12067 },
  { key:"eastCoast",name:"東海岸旅遊網",short:"東海岸",color:"#a855f7",totalPV:1660658,totalSess:956616,botPV:5289,botSess:5076 },
  { key:"siraya",name:"西拉雅國家風景區",short:"西拉雅",color:"#818cf8",totalPV:1033621,totalSess:685015,botPV:7537,botSess:7591 },
  { key:"valley",name:"花東縱谷旅遊網",short:"花東縱谷",color:"#34d399",totalPV:980293,totalSess:693056,botPV:6816,botSess:6746 },
  { key:"triMtn",name:"參山國家風景區",short:"參山",color:"#c084fc",totalPV:889641,totalSess:574250,botPV:1112,botSess:1175 },
  { key:"yunjianan",name:"雲嘉南旅遊網",short:"雲嘉南",color:"#38bdf8",totalPV:646210,totalSess:411416,botPV:7699,botSess:7927 },
  { key:"eastTW",name:"東區觀光圈",short:"東觀光圈",color:"#fb923c",totalPV:351635,totalSess:106370,botPV:3281,botSess:1767 },
];

/* Monthly bot PV per site */
const mPV = {
  taipei:[371871,207707,178014,158428,262696,133703,13868,26091,79222,500239,651397,781115,1288473],
  kinmen:[2464,2579,4468,8574,4312,4805,4999,6116,12219,52454,98432,101992,25108],
  newTaipei:[637,701,919,859,3148,1240,1448,1134,1420,3995,8488,99866,75710],
  tainan:[466,495,1338,27731,55644,1288,1941,1387,2818,21057,63434,38046,47178],
  kaohsiung:[4,9,9,732,1481,942,2030,3887,2538,9375,23033,23299,66883],
  taichung:[50,86,77,77,71,57,447,97,170,587,82586,30313,9464],
  taoyuan:[13,19,12,19,19,27,99,56,1306,516,85868,14920,5287],
  alishan:[21,5,21,17,9,37,17,13,15,90,176,425,11357],
  siraya:[2,7,5,3,2,1,1,5,4,29,56,200,7222],
  eastCoast:[54,18,4,10,19,32,24,68,20,97,78,296,4569],
  valley:[5,4,2,2,7,3,8,9,14,35,61,171,6495],
  eastTW:[0,22,108,57,12,213,69,72,177,619,703,367,862],
  yunjianan:[0,2,5,1,1,4,1,5,1,52,115,791,6721],
  triMtn:[2,5,1,1,19,4,2,3,8,23,21,82,941],
};
const mSess = {
  taipei:[342220,194673,163755,141315,236421,122775,10525,21671,73248,508482,632746,736111,1182304],
  kinmen:[1536,1435,3036,6731,3360,3708,3796,5164,11447,50474,95928,101375,24443],
  newTaipei:[551,651,813,799,2949,1059,1354,953,1402,3903,7898,92873,61800],
  tainan:[450,484,1344,27862,54693,1240,1880,1334,2475,20795,63614,38438,45838],
  kaohsiung:[5,9,5,714,1446,901,1938,3882,2526,9219,23134,23106,62469],
  taichung:[36,65,58,63,43,46,73,166,275,590,83797,30877,9725],
  taoyuan:[11,14,9,15,19,21,63,47,860,542,86446,14758,5339],
  alishan:[10,4,12,9,7,10,18,26,19,78,189,410,11275],
  siraya:[2,2,2,2,2,1,1,30,13,29,72,201,7237],
  eastCoast:[8,12,5,10,12,22,15,52,34,36,84,309,4477],
  valley:[2,5,2,3,7,4,5,26,29,31,67,171,6395],
  eastTW:[0,9,52,27,6,92,38,54,72,322,383,209,503],
  yunjianan:[0,1,3,1,2,3,1,30,12,52,125,792,6905],
  triMtn:[2,4,1,1,10,5,2,43,25,16,39,85,942],
};

/* Pre-compute */
const enriched = data.map(d => ({
  ...d,
  botPVRatio: d.botPV / d.totalPV * 100,
  botSessRatio: d.botSess / d.totalSess * 100,
  cleanPV: d.totalPV - d.botPV,
  cleanSess: d.totalSess - d.botSess,
  trend: ML.map((m, i) => ({ month: ML[i], ms: MS[i], pv: mPV[d.key][i], sess: mSess[d.key][i] })),
  peakPV: Math.max(...mPV[d.key]),
  peakMonth: ML[mPV[d.key].indexOf(Math.max(...mPV[d.key]))],
}));

const grandTotalPV = data.reduce((s, d) => s + d.totalPV, 0);
const grandTotalSess = data.reduce((s, d) => s + d.totalSess, 0);
const grandBotPV = data.reduce((s, d) => s + d.botPV, 0);
const grandBotSess = data.reduce((s, d) => s + d.botSess, 0);

/* ── Responsive hook ── */
function useWidth() {
  const [w, setW] = useState(typeof window !== "undefined" ? window.innerWidth : 1200);
  useEffect(() => {
    const h = () => setW(window.innerWidth);
    window.addEventListener("resize", h);
    return () => window.removeEventListener("resize", h);
  }, []);
  return w;
}

/* ── Helpers ── */
const fmtN = v => v >= 1e6 ? (v/1e6).toFixed(1)+"M" : v >= 1e4 ? (v/1e3).toFixed(0)+"k" : v.toLocaleString();
const fmtK = v => v >= 1e6 ? (v/1e6).toFixed(1)+"M" : v >= 1e3 ? (v/1e3).toFixed(1)+"k" : v;
const sevColor = r => r >= 10 ? "#ef4444" : r >= 5 ? "#f97316" : r >= 1 ? "#eab308" : "#22c55e";
const sevLabel = r => r >= 10 ? "🔴 嚴重" : r >= 5 ? "🟠 高" : r >= 1 ? "🟡 中" : "🟢 低";

/* ── Tooltips ── */
const RatioTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  const item = enriched.find(d => d.short === label);
  if (!item) return null;
  return (
    <div style={{ background:"rgba(10,14,26,0.97)", border:"1px solid rgba(239,68,68,0.2)", borderRadius:10, padding:"12px 14px", backdropFilter:"blur(12px)", boxShadow:"0 8px 32px rgba(0,0,0,0.5)", maxWidth:280, fontFamily:"'Noto Sans TC',sans-serif" }}>
      <p style={{ fontSize:13, fontWeight:700, color:item.color, margin:"0 0 8px" }}>{item.name}</p>
      <div style={{ display:"grid", gridTemplateColumns:"auto auto", gap:"3px 12px", fontSize:12 }}>
        <span style={{ color:"#94a3b8" }}>全站 PV</span><span style={{ color:"#e2e8f0", textAlign:"right" }}>{item.totalPV.toLocaleString()}</span>
        <span style={{ color:"#ef4444" }}>Bot PV</span><span style={{ color:"#ef4444", textAlign:"right", fontWeight:600 }}>{item.botPV.toLocaleString()}</span>
        <span style={{ color:"#fbbf24" }}>佔比</span><span style={{ color:"#fbbf24", textAlign:"right", fontWeight:700 }}>{item.botPVRatio.toFixed(2)}%</span>
        <div style={{ gridColumn:"1/-1", borderTop:"1px solid rgba(148,163,184,0.12)", margin:"2px 0" }} />
        <span style={{ color:"#94a3b8" }}>全站 Sess</span><span style={{ color:"#e2e8f0", textAlign:"right" }}>{item.totalSess.toLocaleString()}</span>
        <span style={{ color:"#f97316" }}>Bot Sess</span><span style={{ color:"#f97316", textAlign:"right", fontWeight:600 }}>{item.botSess.toLocaleString()}</span>
        <span style={{ color:"#fbbf24" }}>佔比</span><span style={{ color:"#fbbf24", textAlign:"right", fontWeight:700 }}>{item.botSessRatio.toFixed(2)}%</span>
      </div>
    </div>
  );
};

const StackTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  const item = enriched.find(d => d.short === label);
  if (!item) return null;
  return (
    <div style={{ background:"rgba(10,14,26,0.97)", border:"1px solid rgba(239,68,68,0.2)", borderRadius:10, padding:"12px 14px", backdropFilter:"blur(12px)", boxShadow:"0 8px 32px rgba(0,0,0,0.5)", maxWidth:260, fontFamily:"'Noto Sans TC',sans-serif" }}>
      <p style={{ fontSize:13, fontWeight:700, color:item.color, margin:"0 0 6px" }}>{item.name}</p>
      {payload.map((p,i) => (
        <p key={i} style={{ fontSize:12, color:p.color||p.fill, margin:"2px 0" }}>{p.name}：{Number(p.value).toLocaleString()}</p>
      ))}
    </div>
  );
};

const TrendTooltip = ({ active, payload, label, siteColor, siteName }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background:"rgba(10,14,26,0.97)", border:`1px solid ${siteColor}40`, borderRadius:8, padding:"10px 12px", backdropFilter:"blur(12px)", boxShadow:"0 4px 20px rgba(0,0,0,0.5)", fontFamily:"'Noto Sans TC',sans-serif", maxWidth:200 }}>
      <div style={{ fontSize:11, color:"#94a3b8", marginBottom:4 }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ fontSize:12, color: p.dataKey === "pv" ? siteColor : "#f97316", fontWeight:600, margin:"2px 0" }}>
          {p.dataKey === "pv" ? "Bot PV" : "Bot Sess"}：{Number(p.value).toLocaleString()}
        </div>
      ))}
    </div>
  );
};

/* ── Per-site Trend Card ── */
const SiteTrendCard = ({ site, isMobile, isTablet, trendMetric }) => {
  const sev = sevColor(site.botPVRatio);
  const chartH = isMobile ? 120 : 140;
  const showVal = trendMetric === "pv" ? "pv" : "sess";

  return (
    <div style={{
      background: "rgba(30,41,59,0.35)", border: `1px solid ${site.color}20`,
      borderRadius: isMobile ? 10 : 12, padding: isMobile ? "12px 10px 8px" : "16px 14px 10px",
      display: "flex", flexDirection: "column",
    }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
          <span style={{ width: 10, height: 10, borderRadius: "50%", background: site.color, flexShrink: 0 }} />
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: isMobile ? 13 : 14, fontWeight: 700, color: site.color, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{site.short}</div>
            <div style={{ fontSize: 10, color: "#64748b", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{site.name}</div>
          </div>
        </div>
        <div style={{ textAlign: "right", flexShrink: 0, marginLeft: 8 }}>
          <span style={{ display: "inline-block", padding: "2px 8px", borderRadius: 10, fontSize: 10, fontWeight: 700, background: sev + "18", color: sev, border: `1px solid ${sev}30` }}>
            {sevLabel(site.botPVRatio)}
          </span>
          <div style={{ fontSize: 10, color: "#64748b", marginTop: 2 }}>PV佔比 {site.botPVRatio.toFixed(2)}%</div>
        </div>
      </div>

      {/* Stats row */}
      <div style={{ display: "flex", gap: isMobile ? 6 : 8, marginBottom: 8 }}>
        <div style={{ flex: 1, background: "rgba(15,23,42,0.5)", borderRadius: 6, padding: "5px 8px" }}>
          <div style={{ fontSize: 9, color: "#ef4444" }}>Bot PV</div>
          <div style={{ fontSize: isMobile ? 12 : 13, fontWeight: 700, color: "#ef4444" }}>{fmtN(site.botPV)}</div>
        </div>
        <div style={{ flex: 1, background: "rgba(15,23,42,0.5)", borderRadius: 6, padding: "5px 8px" }}>
          <div style={{ fontSize: 9, color: "#f97316" }}>Bot Sess</div>
          <div style={{ fontSize: isMobile ? 12 : 13, fontWeight: 700, color: "#f97316" }}>{fmtN(site.botSess)}</div>
        </div>
        <div style={{ flex: 1, background: "rgba(15,23,42,0.5)", borderRadius: 6, padding: "5px 8px" }}>
          <div style={{ fontSize: 9, color: "#94a3b8" }}>峰值月</div>
          <div style={{ fontSize: isMobile ? 11 : 12, fontWeight: 600, color: "#e2e8f0" }}>{site.peakMonth}</div>
        </div>
      </div>

      {/* Trend chart */}
      <div style={{ flex: 1 }}>
        <ResponsiveContainer width="100%" height={chartH}>
          <AreaChart data={site.trend} margin={{ top: 4, right: 4, left: -10, bottom: 0 }}>
            <defs>
              <linearGradient id={`grad_${site.key}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={site.color} stopOpacity={0.35} />
                <stop offset="95%" stopColor={site.color} stopOpacity={0.03} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 6" stroke="rgba(148,163,184,0.06)" />
            <XAxis dataKey="ms" tick={{ fill: "#64748b", fontSize: 9 }} tickLine={false} axisLine={false} interval={isMobile ? 2 : 1} />
            <YAxis tick={{ fill: "#64748b", fontSize: 9 }} tickLine={false} axisLine={false}
              tickFormatter={v => fmtK(v)} width={38} />
            <Tooltip content={<TrendTooltip siteColor={site.color} siteName={site.short} />} />
            <Area type="monotone" dataKey={showVal} stroke={site.color} strokeWidth={2} fill={`url(#grad_${site.key})`} dot={false} activeDot={{ r: 3, fill: site.color, stroke: "#0f172a", strokeWidth: 2 }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

/* ── Mobile summary card (for ratio table) ── */
const MobileCard = ({ d, i }) => {
  const pvC = sevColor(d.botPVRatio);
  const sessC = sevColor(d.botSessRatio);
  return (
    <div style={{ background: i%2===0 ? "rgba(239,68,68,0.04)" : "rgba(30,41,59,0.3)", border:"1px solid rgba(148,163,184,0.08)", borderRadius:10, padding:"14px 14px 12px" }}>
      <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:10 }}>
        <span style={{ fontSize:14, fontWeight:700, color:"#64748b", minWidth:24 }}>#{i+1}</span>
        <span style={{ width:10, height:10, borderRadius:"50%", background:d.color, flexShrink:0 }} />
        <span style={{ fontWeight:600, color:d.color, fontSize:14 }}>{d.short}</span>
        <span style={{ color:"#475569", fontSize:11 }}>{d.name}</span>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
        <div style={{ background:"rgba(15,23,42,0.5)", borderRadius:8, padding:"8px 10px" }}>
          <div style={{ fontSize:10, color:"#94a3b8", marginBottom:2 }}>全站 PV</div>
          <div style={{ fontSize:13, color:"#e2e8f0", fontWeight:600 }}>{fmtN(d.totalPV)}</div>
        </div>
        <div style={{ background:"rgba(15,23,42,0.5)", borderRadius:8, padding:"8px 10px" }}>
          <div style={{ fontSize:10, color:"#ef4444", marginBottom:2 }}>Bot PV</div>
          <div style={{ fontSize:13, color:"#ef4444", fontWeight:600 }}>{d.botPV.toLocaleString()}</div>
        </div>
        <div style={{ background:"rgba(15,23,42,0.5)", borderRadius:8, padding:"8px 10px" }}>
          <div style={{ fontSize:10, color:"#94a3b8", marginBottom:2 }}>全站 Sess</div>
          <div style={{ fontSize:13, color:"#e2e8f0", fontWeight:600 }}>{fmtN(d.totalSess)}</div>
        </div>
        <div style={{ background:"rgba(15,23,42,0.5)", borderRadius:8, padding:"8px 10px" }}>
          <div style={{ fontSize:10, color:"#f97316", marginBottom:2 }}>Bot Sess</div>
          <div style={{ fontSize:13, color:"#f97316", fontWeight:600 }}>{d.botSess.toLocaleString()}</div>
        </div>
      </div>
      <div style={{ display:"flex", gap:8, marginTop:8 }}>
        <div style={{ flex:1, textAlign:"center", padding:"6px 0", borderRadius:8, background:pvC+"15", border:`1px solid ${pvC}30` }}>
          <div style={{ fontSize:10, color:"#94a3b8" }}>Bot PV 佔比</div>
          <div style={{ fontSize:15, fontWeight:700, color:pvC }}>{d.botPVRatio.toFixed(2)}%</div>
        </div>
        <div style={{ flex:1, textAlign:"center", padding:"6px 0", borderRadius:8, background:sessC+"15", border:`1px solid ${sessC}30` }}>
          <div style={{ fontSize:10, color:"#94a3b8" }}>Bot Sess 佔比</div>
          <div style={{ fontSize:15, fontWeight:700, color:sessC }}>{d.botSessRatio.toFixed(2)}%</div>
        </div>
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════
   Main Component
   ══════════════════════════════════════════════ */
export default function BotRatioAnalysis() {
  const w = useWidth();
  const isMobile = w < 640;
  const isTablet = w >= 640 && w < 1024;

  const [sortBy, setSortBy] = useState("pvRatio");
  const [metric, setMetric] = useState("pv");
  const [trendMetric, setTrendMetric] = useState("pv");

  const sorted = useMemo(() => {
    const arr = [...enriched];
    switch(sortBy) {
      case "pvRatio": return arr.sort((a,b) => b.botPVRatio - a.botPVRatio);
      case "sessRatio": return arr.sort((a,b) => b.botSessRatio - a.botSessRatio);
      case "botPV": return arr.sort((a,b) => b.botPV - a.botPV);
      case "totalPV": return arr.sort((a,b) => b.totalPV - a.totalPV);
      default: return arr;
    }
  }, [sortBy]);

  const chartRatio = sorted.map(d => ({
    short: d.short, color: d.color,
    botPVRatio: parseFloat(d.botPVRatio.toFixed(2)),
    botSessRatio: parseFloat(d.botSessRatio.toFixed(2)),
  }));

  const chartStack = sorted.map(d => ({
    short: d.short, color: d.color,
    botVal: metric==="pv" ? d.botPV : d.botSess,
    cleanVal: metric==="pv" ? d.cleanPV : d.cleanSess,
  }));

  /* Responsive values */
  const pad = isMobile ? "20px 10px" : isTablet ? "28px 16px" : "36px 20px";
  const secPad = isMobile ? "14px 10px 10px" : "24px 16px 12px";
  const chartH = isMobile ? 520 : isTablet ? 460 : 440;
  const barSz = isMobile ? 10 : 14;
  const yAxisW = isMobile ? 52 : 80;
  const titleSz = isMobile ? 18 : isTablet ? 21 : 24;
  const h2Sz = isMobile ? 13 : 15;

  const card = { background:"rgba(30,41,59,0.4)", border:"1px solid rgba(239,68,68,0.1)", borderRadius: isMobile ? 10 : 14, padding:secPad, backdropFilter:"blur(8px)" };
  const mx = { maxWidth:1200, margin:"0 auto" };

  const btnStyle = (active) => ({
    padding: isMobile ? "7px 10px" : "6px 14px", borderRadius:7, border:"none", cursor:"pointer",
    fontSize: isMobile ? 11 : 12, fontWeight:600, fontFamily:"'Noto Sans TC',sans-serif",
    background: active ? "linear-gradient(135deg,#dc2626,#ef4444)" : "rgba(30,41,59,0.6)",
    color: active ? "#fff" : "#94a3b8", minHeight: isMobile ? 34 : "auto",
  });

  /* Trend grid columns */
  const trendCols = isMobile ? "1fr" : isTablet ? "1fr 1fr" : "repeat(3, 1fr)";

  return (
    <div style={{ minHeight:"100vh", background:"linear-gradient(145deg,#0c0a14 0%,#1a0a0a 30%,#0f172a 70%,#0a0e1a 100%)", fontFamily:"'Noto Sans TC',sans-serif", color:"#e2e8f0", padding:pad }}>
      <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@300;400;500;600;700&display=swap" rel="stylesheet" />

      {/* ── Alert Banner ── */}
      <div style={{ ...mx, marginBottom:16 }}>
        <div style={{ background:"rgba(239,68,68,0.08)", border:"1px solid rgba(239,68,68,0.25)", borderRadius:10, padding: isMobile ? "10px 12px" : "12px 18px", display:"flex", alignItems:"flex-start", gap: isMobile ? 8 : 12 }}>
          <span style={{ fontSize: isMobile ? 18 : 22, lineHeight:1, flexShrink:0 }}>🤖</span>
          <div style={{ minWidth:0 }}>
            <div style={{ fontSize: isMobile ? 12 : 13, fontWeight:600, color:"#fca5a5" }}>Bot 流量佔比分析</div>
            <div style={{ fontSize: isMobile ? 11 : 12, color:"#94a3b8", marginTop:2, wordBreak:"break-word" }}>
              比較各站 Bot 流量（國家=China、管道=Direct）佔全站流量之比例 ｜ 2025/01 – 2026/01
            </div>
          </div>
        </div>
      </div>

      {/* ── Title ── */}
      <div style={{ ...mx, marginBottom:6, display:"flex", alignItems:"center", gap: isMobile ? 8 : 12 }}>
        <div style={{ width: isMobile ? 4 : 6, height: isMobile ? 28 : 36, borderRadius:3, background:"linear-gradient(180deg,#ef4444,#f97316)", flexShrink:0 }} />
        <h1 style={{ fontSize:titleSz, fontWeight:700, margin:0, background:"linear-gradient(135deg,#fecaca,#f97316,#fbbf24)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", lineHeight:1.3 }}>
          Bot 流量佔全站比例分析
        </h1>
      </div>

      {/* Subtitle */}
      <div style={{ ...mx, marginBottom:20, paddingLeft: isMobile ? 12 : 18 }}>
        {isMobile ? (
          <div style={{ color:"#64748b", fontSize:11, lineHeight:1.8 }}>
            <div>Bot PV {grandBotPV.toLocaleString()} / 全站 {grandTotalPV.toLocaleString()} = <span style={{ color:"#fbbf24", fontWeight:700 }}>{(grandBotPV/grandTotalPV*100).toFixed(2)}%</span></div>
            <div>Bot Sess {grandBotSess.toLocaleString()} / 全站 {grandTotalSess.toLocaleString()} = <span style={{ color:"#fbbf24", fontWeight:700 }}>{(grandBotSess/grandTotalSess*100).toFixed(2)}%</span></div>
          </div>
        ) : (
          <p style={{ color:"#64748b", fontSize:13, margin:0 }}>
            全 {data.length} 站合計：Bot PV {grandBotPV.toLocaleString()} / 全站 {grandTotalPV.toLocaleString()} = <span style={{ color:"#fbbf24", fontWeight:700 }}>{(grandBotPV/grandTotalPV*100).toFixed(2)}%</span>
            　｜　Bot Sess {grandBotSess.toLocaleString()} / 全站 {grandTotalSess.toLocaleString()} = <span style={{ color:"#fbbf24", fontWeight:700 }}>{(grandBotSess/grandTotalSess*100).toFixed(2)}%</span>
          </p>
        )}
      </div>

      {/* ── KPIs ── */}
      <div style={{ ...mx, marginBottom:20, display:"grid", gridTemplateColumns: isMobile ? "1fr 1fr" : isTablet ? "repeat(3,1fr)" : "repeat(6,1fr)", gap: isMobile ? 8 : 14 }}>
        {[
          { label:"全站 PV 合計", value: isMobile ? fmtN(grandTotalPV) : grandTotalPV.toLocaleString(), color:"#e2e8f0", icon:"📊" },
          { label:"Bot PV 合計", value: isMobile ? fmtN(grandBotPV) : grandBotPV.toLocaleString(), color:"#ef4444", icon:"🤖" },
          { label:"Bot PV 佔比", value:(grandBotPV/grandTotalPV*100).toFixed(2)+"%", color:"#fbbf24", icon:"⚠️" },
          { label:"全站 Sess 合計", value: isMobile ? fmtN(grandTotalSess) : grandTotalSess.toLocaleString(), color:"#e2e8f0", icon:"🔗" },
          { label:"Bot Sess 合計", value: isMobile ? fmtN(grandBotSess) : grandBotSess.toLocaleString(), color:"#f97316", icon:"🤖" },
          { label:"Bot Sess 佔比", value:(grandBotSess/grandTotalSess*100).toFixed(2)+"%", color:"#fbbf24", icon:"⚠️" },
        ].map((c,i) => (
          <div key={i} style={{ background:"rgba(30,41,59,0.5)", border:"1px solid rgba(239,68,68,0.1)", borderRadius: isMobile ? 8 : 12, padding: isMobile ? "10px 10px" : "14px 16px", backdropFilter:"blur(8px)" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <span style={{ fontSize: isMobile ? 10 : 11, color:"#94a3b8", fontWeight:500 }}>{c.label}</span>
              <span style={{ fontSize: isMobile ? 14 : 16 }}>{c.icon}</span>
            </div>
            <div style={{ fontSize: isMobile ? 17 : 22, fontWeight:700, color:c.color, marginTop:3 }}>{c.value}</div>
          </div>
        ))}
      </div>

      {/* ── Sort Controls ── */}
      <div style={{ ...mx, marginBottom:14, display:"flex", flexWrap:"wrap", gap: isMobile ? 6 : 8, alignItems:"center" }}>
        {!isMobile && <span style={{ fontSize:12, color:"#64748b", lineHeight:"32px" }}>排序：</span>}
        {[
          { v:"pvRatio", l: isMobile ? "PV佔比↓" : "Bot PV 佔比 ↓" },
          { v:"sessRatio", l: isMobile ? "Sess佔比↓" : "Bot Sess 佔比 ↓" },
          { v:"botPV", l: isMobile ? "Bot量↓" : "Bot PV 量 ↓" },
          { v:"totalPV", l: isMobile ? "全站PV↓" : "全站 PV ↓" },
        ].map(m => (
          <button key={m.v} onClick={() => setSortBy(m.v)} style={btnStyle(sortBy===m.v)}>{m.l}</button>
        ))}
      </div>

      {/* ── Chart 1: Ratio ── */}
      <div style={{ ...mx, ...card, marginBottom:20 }}>
        <h2 style={{ fontSize:h2Sz, fontWeight:600, color:"#fca5a5", margin:"0 0 12px 4px" }}>📊 各站 Bot 流量佔比（%）</h2>
        <ResponsiveContainer width="100%" height={chartH}>
          <ComposedChart data={chartRatio} margin={{ top:10, right: isMobile ? 48 : 80, left:0, bottom:5 }} layout="vertical">
            <CartesianGrid strokeDasharray="3 6" stroke="rgba(148,163,184,0.08)" horizontal={false} />
            <XAxis type="number" tick={{ fill:"#64748b", fontSize: isMobile ? 9 : 11 }} tickLine={false} axisLine={false} tickFormatter={v => v+"%"} domain={[0,"auto"]} />
            <YAxis type="category" dataKey="short" tick={{ fill:"#94a3b8", fontSize: isMobile ? 10 : 12 }} width={yAxisW} tickLine={false} axisLine={false} />
            <Tooltip content={<RatioTooltip />} />
            <Bar dataKey="botPVRatio" name="Bot PV 佔比 %" fill="#ef4444" fillOpacity={0.8} radius={[0,4,4,0]} barSize={barSz}>
              {!isMobile && <LabelList dataKey="botPVRatio" position="right" formatter={v => v.toFixed(2)+"%"} style={{ fill:"#fca5a5", fontSize:10, fontWeight:600 }} />}
              {chartRatio.map((d,i) => <Cell key={i} fill={d.color} fillOpacity={0.85} />)}
            </Bar>
            <Bar dataKey="botSessRatio" name="Bot Sess 佔比 %" fill="#f97316" fillOpacity={0.6} radius={[0,4,4,0]} barSize={barSz}>
              {!isMobile && <LabelList dataKey="botSessRatio" position="right" formatter={v => v.toFixed(2)+"%"} style={{ fill:"#fdba74", fontSize:10, fontWeight:500 }} />}
            </Bar>
          </ComposedChart>
        </ResponsiveContainer>
        <div style={{ display:"flex", justifyContent:"center", gap: isMobile ? 12 : 24, marginTop:6, flexWrap:"wrap" }}>
          <span style={{ fontSize: isMobile ? 10 : 12, color:"#94a3b8" }}><span style={{ display:"inline-block", width:10, height:10, borderRadius:2, background:"#ef4444", marginRight:5, verticalAlign:"middle" }} />Bot PV 佔比</span>
          <span style={{ fontSize: isMobile ? 10 : 12, color:"#94a3b8" }}><span style={{ display:"inline-block", width:10, height:10, borderRadius:2, background:"#f97316", marginRight:5, verticalAlign:"middle" }} />Bot 工作階段佔比</span>
        </div>
      </div>

      {/* ── Chart 2: Stacked Absolute ── */}
      <div style={{ ...mx, ...card, marginBottom:20 }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12, flexWrap:"wrap", gap:8 }}>
          <h2 style={{ fontSize:h2Sz, fontWeight:600, color:"#fca5a5", margin:"0 0 0 4px" }}>
            📊 全站 vs Bot 流量{isMobile ? "" : " — 絕對值"}
          </h2>
          <div style={{ display:"flex", gap:6 }}>
            {[{v:"pv",l:"瀏覽量"},{v:"sess",l:"工作階段"}].map(m => (
              <button key={m.v} onClick={() => setMetric(m.v)} style={btnStyle(metric===m.v)}>{m.l}</button>
            ))}
          </div>
        </div>
        <ResponsiveContainer width="100%" height={chartH}>
          <BarChart data={chartStack} margin={{ top:5, right:10, left:0, bottom:5 }} layout="vertical">
            <CartesianGrid strokeDasharray="3 6" stroke="rgba(148,163,184,0.08)" horizontal={false} />
            <XAxis type="number" tick={{ fill:"#64748b", fontSize: isMobile ? 9 : 10 }} tickLine={false} axisLine={false}
              tickFormatter={v => v >= 1e6 ? (v/1e6).toFixed(1)+"M" : v >= 1e3 ? (v/1e3).toFixed(0)+"k" : v} />
            <YAxis type="category" dataKey="short" tick={{ fill:"#94a3b8", fontSize: isMobile ? 10 : 12 }} width={yAxisW} tickLine={false} axisLine={false} />
            <Tooltip content={<StackTooltip />} />
            <Bar dataKey="cleanVal" name="正常流量" stackId="a" fill="#334155" fillOpacity={0.6} radius={0} barSize={isMobile ? 14 : 20} />
            <Bar dataKey="botVal" name="Bot 流量" stackId="a" fill="#ef4444" fillOpacity={0.85} radius={[0,4,4,0]} barSize={isMobile ? 14 : 20}>
              {chartStack.map((d,i) => <Cell key={i} fill={d.color} fillOpacity={0.9} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        <div style={{ display:"flex", justifyContent:"center", gap: isMobile ? 10 : 24, marginTop:6, flexWrap:"wrap" }}>
          <span style={{ fontSize: isMobile ? 10 : 12, color:"#94a3b8" }}><span style={{ display:"inline-block", width:10, height:10, borderRadius:2, background:"#334155", marginRight:5, verticalAlign:"middle" }} />正常流量</span>
          <span style={{ fontSize: isMobile ? 10 : 12, color:"#94a3b8" }}><span style={{ display:"inline-block", width:10, height:10, borderRadius:2, background:"#ef4444", marginRight:5, verticalAlign:"middle" }} />Bot 流量</span>
        </div>
      </div>

      {/* ══════════════════════════════════════════════
          NEW: Per-Site Bot Traffic Trend
         ══════════════════════════════════════════════ */}
      <div style={{ ...mx, ...card, marginBottom:20, padding: isMobile ? "14px 10px 10px" : "24px 18px 14px" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom: isMobile ? 10 : 16, flexWrap:"wrap", gap:8 }}>
          <h2 style={{ fontSize:h2Sz, fontWeight:600, color:"#fca5a5", margin:0 }}>
            📈 各站 Bot 流量月趨勢（2025/01 – 2026/01）
          </h2>
          <div style={{ display:"flex", gap:6 }}>
            {[{v:"pv",l:"Bot PV"},{v:"sess",l:"Bot Sess"}].map(m => (
              <button key={m.v} onClick={() => setTrendMetric(m.v)} style={btnStyle(trendMetric===m.v)}>{m.l}</button>
            ))}
          </div>
        </div>
        <div style={{ fontSize: isMobile ? 10 : 11, color:"#64748b", marginBottom: isMobile ? 10 : 14, paddingLeft:2 }}>
          依 Bot PV 佔比由高至低排列 ｜ 各圖 Y 軸為獨立刻度
        </div>
        <div style={{ display:"grid", gridTemplateColumns: trendCols, gap: isMobile ? 10 : 14 }}>
          {sorted.map(site => (
            <SiteTrendCard key={site.key} site={site} isMobile={isMobile} isTablet={isTablet} trendMetric={trendMetric} />
          ))}
        </div>
      </div>

      {/* ── Data Table / Cards ── */}
      <div style={{ ...mx, ...card, marginBottom:20 }}>
        <h2 style={{ fontSize:h2Sz, fontWeight:600, color:"#fca5a5", margin:"0 0 14px 4px" }}>📋 Bot 流量佔比明細</h2>

        {isMobile ? (
          <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
            {sorted.map((d,i) => <MobileCard key={d.key} d={d} i={i} />)}
            <div style={{ background:"rgba(251,191,36,0.06)", border:"1px solid rgba(251,191,36,0.2)", borderRadius:10, padding:"14px 14px 12px" }}>
              <div style={{ fontSize:14, fontWeight:700, color:"#fbbf24", marginBottom:8 }}>📊 全站合計</div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
                <div style={{ background:"rgba(15,23,42,0.5)", borderRadius:8, padding:"8px 10px" }}>
                  <div style={{ fontSize:10, color:"#94a3b8", marginBottom:2 }}>全站 PV</div>
                  <div style={{ fontSize:13, color:"#e2e8f0", fontWeight:600 }}>{fmtN(grandTotalPV)}</div>
                </div>
                <div style={{ background:"rgba(15,23,42,0.5)", borderRadius:8, padding:"8px 10px" }}>
                  <div style={{ fontSize:10, color:"#ef4444", marginBottom:2 }}>Bot PV</div>
                  <div style={{ fontSize:13, color:"#ef4444", fontWeight:600 }}>{fmtN(grandBotPV)}</div>
                </div>
                <div style={{ background:"rgba(15,23,42,0.5)", borderRadius:8, padding:"8px 10px" }}>
                  <div style={{ fontSize:10, color:"#94a3b8", marginBottom:2 }}>全站 Sess</div>
                  <div style={{ fontSize:13, color:"#e2e8f0", fontWeight:600 }}>{fmtN(grandTotalSess)}</div>
                </div>
                <div style={{ background:"rgba(15,23,42,0.5)", borderRadius:8, padding:"8px 10px" }}>
                  <div style={{ fontSize:10, color:"#f97316", marginBottom:2 }}>Bot Sess</div>
                  <div style={{ fontSize:13, color:"#f97316", fontWeight:600 }}>{fmtN(grandBotSess)}</div>
                </div>
              </div>
              <div style={{ display:"flex", gap:8, marginTop:8 }}>
                <div style={{ flex:1, textAlign:"center", padding:"6px 0", borderRadius:8, background:"rgba(251,191,36,0.12)", border:"1px solid rgba(251,191,36,0.25)" }}>
                  <div style={{ fontSize:10, color:"#94a3b8" }}>Bot PV 佔比</div>
                  <div style={{ fontSize:15, fontWeight:700, color:"#fbbf24" }}>{(grandBotPV/grandTotalPV*100).toFixed(2)}%</div>
                </div>
                <div style={{ flex:1, textAlign:"center", padding:"6px 0", borderRadius:8, background:"rgba(251,191,36,0.12)", border:"1px solid rgba(251,191,36,0.25)" }}>
                  <div style={{ fontSize:10, color:"#94a3b8" }}>Bot Sess 佔比</div>
                  <div style={{ fontSize:15, fontWeight:700, color:"#fbbf24" }}>{(grandBotSess/grandTotalSess*100).toFixed(2)}%</div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div style={{ overflowX:"auto", WebkitOverflowScrolling:"touch" }}>
            <table style={{ width:"100%", borderCollapse:"separate", borderSpacing:"0 3px", minWidth: isTablet ? 700 : "auto" }}>
              <thead>
                <tr>
                  {["#","網站","全站 PV","Bot PV","Bot PV 佔比","全站 Sess","Bot Sess","Bot Sess 佔比"].map((h,i) => (
                    <th key={i} style={{ padding: isTablet ? "8px 6px" : "10px 10px", textAlign: i<2 ? "left" : "right", fontSize: isTablet ? 10 : 11, color:"#94a3b8", fontWeight:600, borderBottom:"1px solid rgba(148,163,184,0.12)", whiteSpace:"nowrap" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sorted.map((d,i) => {
                  const pvC = sevColor(d.botPVRatio);
                  const sessC = sevColor(d.botSessRatio);
                  const cp = isTablet ? "8px 6px" : "10px 10px";
                  const fs = isTablet ? 11 : 12;
                  return (
                    <tr key={d.key} style={{ background: i%2===0 ? "rgba(239,68,68,0.03)" : "transparent" }}>
                      <td style={{ padding:cp, fontSize:fs, color:"#64748b", fontWeight:600, width:36 }}>{i+1}</td>
                      <td style={{ padding:cp, fontSize:fs, fontWeight:500, whiteSpace:"nowrap" }}>
                        <span style={{ display:"inline-block", width:8, height:8, borderRadius:"50%", background:d.color, marginRight:6, verticalAlign:"middle" }} />
                        <span style={{ color:d.color }}>{d.short}</span>
                        {!isTablet && <span style={{ color:"#475569", fontSize:11, marginLeft:6 }}>{d.name}</span>}
                      </td>
                      <td style={{ padding:cp, fontSize:fs, color:"#94a3b8", textAlign:"right" }}>{d.totalPV.toLocaleString()}</td>
                      <td style={{ padding:cp, fontSize:fs, color:"#ef4444", textAlign:"right", fontWeight:600 }}>{d.botPV.toLocaleString()}</td>
                      <td style={{ padding:cp, textAlign:"right" }}>
                        <span style={{ display:"inline-block", padding:"2px 8px", borderRadius:12, fontSize:fs, fontWeight:700, background:pvC+"18", color:pvC, border:`1px solid ${pvC}30` }}>{d.botPVRatio.toFixed(2)}%</span>
                      </td>
                      <td style={{ padding:cp, fontSize:fs, color:"#94a3b8", textAlign:"right" }}>{d.totalSess.toLocaleString()}</td>
                      <td style={{ padding:cp, fontSize:fs, color:"#f97316", textAlign:"right", fontWeight:600 }}>{d.botSess.toLocaleString()}</td>
                      <td style={{ padding:cp, textAlign:"right" }}>
                        <span style={{ display:"inline-block", padding:"2px 8px", borderRadius:12, fontSize:fs, fontWeight:700, background:sessC+"18", color:sessC, border:`1px solid ${sessC}30` }}>{d.botSessRatio.toFixed(2)}%</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr style={{ borderTop:"2px solid rgba(148,163,184,0.2)" }}>
                  <td colSpan={2} style={{ padding:"12px 10px", fontSize:13, color:"#e2e8f0", fontWeight:700 }}>全站合計</td>
                  <td style={{ padding:"12px 10px", fontSize:12, color:"#94a3b8", textAlign:"right", fontWeight:700 }}>{grandTotalPV.toLocaleString()}</td>
                  <td style={{ padding:"12px 10px", fontSize:12, color:"#ef4444", textAlign:"right", fontWeight:700 }}>{grandBotPV.toLocaleString()}</td>
                  <td style={{ padding:"12px 10px", textAlign:"right" }}>
                    <span style={{ display:"inline-block", padding:"2px 8px", borderRadius:12, fontSize:12, fontWeight:700, background:"rgba(251,191,36,0.15)", color:"#fbbf24", border:"1px solid rgba(251,191,36,0.3)" }}>{(grandBotPV/grandTotalPV*100).toFixed(2)}%</span>
                  </td>
                  <td style={{ padding:"12px 10px", fontSize:12, color:"#94a3b8", textAlign:"right", fontWeight:700 }}>{grandTotalSess.toLocaleString()}</td>
                  <td style={{ padding:"12px 10px", fontSize:12, color:"#f97316", textAlign:"right", fontWeight:700 }}>{grandBotSess.toLocaleString()}</td>
                  <td style={{ padding:"12px 10px", textAlign:"right" }}>
                    <span style={{ display:"inline-block", padding:"2px 8px", borderRadius:12, fontSize:12, fontWeight:700, background:"rgba(251,191,36,0.15)", color:"#fbbf24", border:"1px solid rgba(251,191,36,0.3)" }}>{(grandBotSess/grandTotalSess*100).toFixed(2)}%</span>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </div>

      {/* ── Key Findings ── */}
      <div style={{ ...mx, ...card, marginBottom:20, padding: isMobile ? "14px 12px" : "24px 22px" }}>
        <h2 style={{ fontSize:h2Sz, fontWeight:600, color:"#fca5a5", margin:"0 0 12px 0" }}>🔍 關鍵發現</h2>
        <div style={{ display:"grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fit, minmax(280px, 1fr))", gap: isMobile ? 10 : 14 }}>
          {[
            { title:"臺北旅遊網受創最重", desc:`Bot PV 佔全站 ${(4652824/29743387*100).toFixed(1)}%、Bot 工作階段佔 ${(4366246/14544064*100).toFixed(1)}%，Bot 工作階段佔比偏高代表 Bot 建立了大量獨立連線。`, icon:"🔴" },
            { title:"金門、台南 Bot 佔比居次", desc:`金門 Bot PV 佔比 ${(328522/4306758*100).toFixed(1)}%、台南 ${(262823/5107667*100).toFixed(1)}%，在中型網站中 Bot 已明顯影響數據可信度。`, icon:"🟠" },
            { title:"大站 Bot 絕對量高但佔比低", desc:`桃園（${(108161/10984126*100).toFixed(2)}%）、臺中（${(124082/9305377*100).toFixed(2)}%）全站流量大，Bot 佔比相對低，但桃園 2025/11 突波仍值得注意。`, icon:"🟡" },
            { title:"風景區小站數據易失真", desc:"參山（0.13%）、東海岸（0.32%）等小站 Bot 佔比雖低，但若集中在特定頁面或時段，仍會嚴重扭曲個別報告結論。", icon:"⚖️" },
          ].map((item,i) => (
            <div key={i} style={{ background:"rgba(239,68,68,0.04)", border:"1px solid rgba(239,68,68,0.1)", borderRadius: isMobile ? 8 : 10, padding: isMobile ? "12px 12px" : "14px 16px" }}>
              <div style={{ fontSize: isMobile ? 12 : 13, fontWeight:600, color:"#fca5a5", marginBottom:4 }}>{item.icon} {item.title}</div>
              <div style={{ fontSize: isMobile ? 11 : 12, color:"#94a3b8", lineHeight:1.7 }}>{item.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Footer ── */}
      <div style={{ ...mx, marginTop:16, textAlign:"center", padding:"0 4px" }}>
        <p style={{ fontSize: isMobile ? 10 : 11, color:"#475569", lineHeight:1.7 }}>
          資料來源：Google Analytics 4 ｜ Bot 識別條件：國家=China、管道=Direct{isMobile ? <br/> : " ｜ "}全站數據：同期間無篩選 ｜ 產出日期：2026/02/04
        </p>
      </div>
    </div>
  );
}