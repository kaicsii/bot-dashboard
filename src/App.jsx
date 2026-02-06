import { useState, useMemo, useEffect } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell, LabelList,
  AreaChart, Area,
} from "recharts";

/* ══════════════════════════════════════════════════
   DATA
   Bot 識別：國家=China、管道=Direct ｜ 2025/01 – 2026/01
   ══════════════════════════════════════════════════ */
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
  trend: ML.map((_, i) => ({ month: ML[i], ms: MS[i], pv: mPV[d.key][i], sess: mSess[d.key][i] })),
  peakPV: Math.max(...mPV[d.key]),
  peakMonth: ML[mPV[d.key].indexOf(Math.max(...mPV[d.key]))],
}));

const gPV  = data.reduce((s,d) => s + d.totalPV, 0);
const gSes = data.reduce((s,d) => s + d.totalSess, 0);
const gBPV = data.reduce((s,d) => s + d.botPV, 0);
const gBSe = data.reduce((s,d) => s + d.botSess, 0);

/* ══════════════════════════════════════════════════
   RESPONSIVE HOOK
   ══════════════════════════════════════════════════ */
function useBreakpoint() {
  const [w, setW] = useState(typeof window !== "undefined" ? window.innerWidth : 1200);
  useEffect(() => {
    let raf;
    const h = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(() => setW(window.innerWidth)); };
    window.addEventListener("resize", h);
    return () => { window.removeEventListener("resize", h); cancelAnimationFrame(raf); };
  }, []);
  return { w, mob: w < 640, tab: w >= 640 && w < 1024, desk: w >= 1024 };
}

/* ══════════════════════════════════════════════════
   HELPERS
   ══════════════════════════════════════════════════ */
const fmtN = v => v >= 1e6 ? (v/1e6).toFixed(1)+"M" : v >= 1e4 ? (v/1e3).toFixed(0)+"k" : v.toLocaleString();
const fmtK = v => v >= 1e6 ? (v/1e6).toFixed(1)+"M" : v >= 1e3 ? (v/1e3).toFixed(1)+"k" : String(v);
const sevC = r => r >= 10 ? "#ef4444" : r >= 5 ? "#f97316" : r >= 1 ? "#eab308" : "#22c55e";
const sevL = r => r >= 10 ? "🔴 嚴重" : r >= 5 ? "🟠 高" : r >= 1 ? "🟡 中" : "🟢 低";

/* ══════════════════════════════════════════════════
   SHARED STYLES (responsive tokens)
   ══════════════════════════════════════════════════ */
const R = (mob, tab) => ({
  pad:   mob ? "16px 8px" : tab ? "24px 14px" : "32px 20px",
  gap:   mob ? 10 : tab ? 14 : 18,
  secR:  mob ? 10 : tab ? 12 : 14,
  secPad:mob ? "12px 10px" : tab ? "16px 14px" : "20px 18px",
  h1:    mob ? 17 : tab ? 20 : 24,
  h2:    mob ? 13 : tab ? 14 : 15,
  body:  mob ? 11 : 12,
  small: mob ? 10 : 11,
  tiny:  mob ? 9 : 10,
  kpiVal:mob ? 16 : tab ? 19 : 22,
  chartH:mob ? 480 : tab ? 440 : 420,
  barSz: mob ? 9 : tab ? 12 : 14,
  yW:    mob ? 48 : tab ? 58 : 76,
  trendH:mob ? 110 : tab ? 130 : 140,
});

/* ══════════════════════════════════════════════════
   TOOLTIP COMPONENTS
   ══════════════════════════════════════════════════ */
const ttBase = { background:"rgba(10,14,26,.97)", backdropFilter:"blur(12px)", boxShadow:"0 8px 32px rgba(0,0,0,.5)", fontFamily:"'Noto Sans TC',sans-serif" };

const RatioTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  const d = enriched.find(x => x.short === label);
  if (!d) return null;
  return (
    <div style={{ ...ttBase, border:"1px solid rgba(239,68,68,.2)", borderRadius:10, padding:"10px 12px", maxWidth:260 }}>
      <div style={{ fontSize:12, fontWeight:700, color:d.color, marginBottom:6 }}>{d.name}</div>
      <div style={{ display:"grid", gridTemplateColumns:"auto auto", gap:"2px 10px", fontSize:11 }}>
        <span style={{ color:"#94a3b8" }}>全站 PV</span><span style={{ color:"#e2e8f0", textAlign:"right" }}>{d.totalPV.toLocaleString()}</span>
        <span style={{ color:"#ef4444" }}>Bot PV</span><span style={{ color:"#ef4444", textAlign:"right", fontWeight:600 }}>{d.botPV.toLocaleString()}</span>
        <span style={{ color:"#fbbf24" }}>佔比</span><span style={{ color:"#fbbf24", textAlign:"right", fontWeight:700 }}>{d.botPVRatio.toFixed(2)}%</span>
        <div style={{ gridColumn:"1/-1", borderTop:"1px solid rgba(148,163,184,.1)", margin:"2px 0" }} />
        <span style={{ color:"#94a3b8" }}>全站 Sess</span><span style={{ color:"#e2e8f0", textAlign:"right" }}>{d.totalSess.toLocaleString()}</span>
        <span style={{ color:"#f97316" }}>Bot Sess</span><span style={{ color:"#f97316", textAlign:"right", fontWeight:600 }}>{d.botSess.toLocaleString()}</span>
        <span style={{ color:"#fbbf24" }}>佔比</span><span style={{ color:"#fbbf24", textAlign:"right", fontWeight:700 }}>{d.botSessRatio.toFixed(2)}%</span>
      </div>
    </div>
  );
};

const StackTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  const d = enriched.find(x => x.short === label);
  if (!d) return null;
  return (
    <div style={{ ...ttBase, border:"1px solid rgba(239,68,68,.2)", borderRadius:10, padding:"10px 12px", maxWidth:240 }}>
      <div style={{ fontSize:12, fontWeight:700, color:d.color, marginBottom:4 }}>{d.name}</div>
      {payload.map((p,i) => (
        <div key={i} style={{ fontSize:11, color:p.color||p.fill, margin:"1px 0" }}>{p.name}：{Number(p.value).toLocaleString()}</div>
      ))}
    </div>
  );
};

const TrendTT = ({ active, payload, label, sc }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ ...ttBase, border:`1px solid ${sc}40`, borderRadius:8, padding:"8px 10px", maxWidth:180 }}>
      <div style={{ fontSize:10, color:"#94a3b8", marginBottom:3 }}>{label}</div>
      {payload.map((p,i) => (
        <div key={i} style={{ fontSize:11, color: p.dataKey==="pv" ? sc : "#f97316", fontWeight:600 }}>
          {p.dataKey==="pv" ? "Bot PV" : "Bot Sess"}：{Number(p.value).toLocaleString()}
        </div>
      ))}
    </div>
  );
};

/* ══════════════════════════════════════════════════
   TREND CARD (per-site sparkline)
   ══════════════════════════════════════════════════ */
const TrendCard = ({ site, r, mob, trendMetric }) => {
  const sc = sevC(site.botPVRatio);
  return (
    <div style={{ background:"rgba(30,41,59,.3)", border:`1px solid ${site.color}18`, borderRadius: r.secR, padding: mob ? "10px 8px 6px" : "14px 12px 8px", display:"flex", flexDirection:"column" }}>
      {/* header */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:6, gap:6 }}>
        <div style={{ display:"flex", alignItems:"center", gap:6, minWidth:0 }}>
          <span style={{ width:8, height:8, borderRadius:"50%", background:site.color, flexShrink:0 }} />
          <div style={{ minWidth:0 }}>
            <div style={{ fontSize: mob ? 12 : 13, fontWeight:700, color:site.color, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{site.short}</div>
            <div style={{ fontSize: r.tiny, color:"#64748b", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{site.name}</div>
          </div>
        </div>
        <div style={{ flexShrink:0, textAlign:"right" }}>
          <span style={{ display:"inline-block", padding:"1px 7px", borderRadius:8, fontSize:9, fontWeight:700, background:sc+"18", color:sc, border:`1px solid ${sc}30`, whiteSpace:"nowrap" }}>{sevL(site.botPVRatio)}</span>
          <div style={{ fontSize:9, color:"#64748b", marginTop:1 }}>{site.botPVRatio.toFixed(2)}%</div>
        </div>
      </div>
      {/* stat pills */}
      <div style={{ display:"flex", gap: mob ? 4 : 6, marginBottom:6 }}>
        {[
          { label:"Bot PV", val:fmtN(site.botPV), c:"#ef4444" },
          { label:"Bot Sess", val:fmtN(site.botSess), c:"#f97316" },
          { label:"峰值月", val: site.peakMonth.replace("2025/","").replace("2026/","'26/"), c:"#e2e8f0" },
        ].map((p,i) => (
          <div key={i} style={{ flex:1, background:"rgba(15,23,42,.45)", borderRadius:5, padding: mob ? "3px 5px" : "4px 6px" }}>
            <div style={{ fontSize:8, color: p.c === "#e2e8f0" ? "#64748b" : p.c, lineHeight:1.2 }}>{p.label}</div>
            <div style={{ fontSize: mob ? 10 : 11, fontWeight:700, color:p.c, lineHeight:1.3 }}>{p.val}</div>
          </div>
        ))}
      </div>
      {/* chart */}
      <div style={{ flex:1, minHeight: r.trendH }}>
        <ResponsiveContainer width="100%" height={r.trendH}>
          <AreaChart data={site.trend} margin={{ top:2, right:2, left:-14, bottom:0 }}>
            <defs>
              <linearGradient id={`g_${site.key}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={site.color} stopOpacity={.3} />
                <stop offset="95%" stopColor={site.color} stopOpacity={.02} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 6" stroke="rgba(148,163,184,.05)" />
            <XAxis dataKey="ms" tick={{ fill:"#64748b", fontSize:8 }} tickLine={false} axisLine={false} interval={mob ? 3 : 2} />
            <YAxis tick={{ fill:"#64748b", fontSize:8 }} tickLine={false} axisLine={false} tickFormatter={fmtK} width={32} />
            <Tooltip content={<TrendTT sc={site.color} />} />
            <Area type="monotone" dataKey={trendMetric} stroke={site.color} strokeWidth={1.5}
              fill={`url(#g_${site.key})`} dot={false}
              activeDot={{ r:2.5, fill:site.color, stroke:"#0f172a", strokeWidth:1.5 }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════════
   MOBILE DATA CARD (replaces table row)
   ══════════════════════════════════════════════════ */
const DataCard = ({ d, i, r }) => {
  const pc = sevC(d.botPVRatio);
  const sc = sevC(d.botSessRatio);
  return (
    <div style={{ background: i%2===0 ? "rgba(239,68,68,.03)" : "rgba(30,41,59,.25)", border:"1px solid rgba(148,163,184,.07)", borderRadius:10, padding:"12px 12px 10px" }}>
      {/* site header */}
      <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:8 }}>
        <span style={{ fontSize:12, fontWeight:700, color:"#64748b", minWidth:22 }}>#{i+1}</span>
        <span style={{ width:8, height:8, borderRadius:"50%", background:d.color, flexShrink:0 }} />
        <span style={{ fontWeight:600, color:d.color, fontSize:13 }}>{d.short}</span>
        <span style={{ color:"#475569", fontSize:10, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{d.name}</span>
      </div>
      {/* 2×2 metrics */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:6, marginBottom:8 }}>
        {[
          { label:"全站 PV", val:fmtN(d.totalPV), c:"#e2e8f0" },
          { label:"Bot PV", val:d.botPV.toLocaleString(), c:"#ef4444" },
          { label:"全站 Sess", val:fmtN(d.totalSess), c:"#e2e8f0" },
          { label:"Bot Sess", val:d.botSess.toLocaleString(), c:"#f97316" },
        ].map((m,j) => (
          <div key={j} style={{ background:"rgba(15,23,42,.45)", borderRadius:7, padding:"6px 8px" }}>
            <div style={{ fontSize:9, color: m.c==="#e2e8f0" ? "#94a3b8" : m.c, marginBottom:1 }}>{m.label}</div>
            <div style={{ fontSize:12, color:m.c, fontWeight:600 }}>{m.val}</div>
          </div>
        ))}
      </div>
      {/* ratio badges */}
      <div style={{ display:"flex", gap:6 }}>
        {[
          { label:"Bot PV 佔比", val:d.botPVRatio.toFixed(2)+"%", c:pc },
          { label:"Bot Sess 佔比", val:d.botSessRatio.toFixed(2)+"%", c:sc },
        ].map((b,j) => (
          <div key={j} style={{ flex:1, textAlign:"center", padding:"5px 0", borderRadius:7, background:b.c+"14", border:`1px solid ${b.c}28` }}>
            <div style={{ fontSize:9, color:"#94a3b8" }}>{b.label}</div>
            <div style={{ fontSize:14, fontWeight:700, color:b.c }}>{b.val}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════════
   MAIN COMPONENT
   ══════════════════════════════════════════════════ */
export default function BotRatioAnalysis() {
  const { w, mob, tab, desk } = useBreakpoint();
  const r = R(mob, tab);

  const [sortBy, setSortBy] = useState("pvRatio");
  const [ratioMetric, setRatioMetric] = useState("pv");   // Chart 1: pv or sess
  const [metric, setMetric] = useState("pv");              // Chart 2: pv or sess
  const [trendMetric, setTrendMetric] = useState("pv");

  const sorted = useMemo(() => {
    const a = [...enriched];
    if (sortBy === "pvRatio")  return a.sort((x,y) => y.botPVRatio  - x.botPVRatio);
    if (sortBy === "sessRatio")return a.sort((x,y) => y.botSessRatio- x.botSessRatio);
    if (sortBy === "botPV")    return a.sort((x,y) => y.botPV       - x.botPV);
    return a.sort((x,y) => y.totalPV - x.totalPV);
  }, [sortBy]);

  const chartRatio = sorted.map(d => ({
    short: d.short, color: d.color,
    ratio: ratioMetric === "pv" ? +d.botPVRatio.toFixed(2) : +d.botSessRatio.toFixed(2),
  }));
  const chartStack = sorted.map(d => ({ short:d.short, color:d.color, botVal: metric==="pv" ? d.botPV : d.botSess, cleanVal: metric==="pv" ? d.cleanPV : d.cleanSess }));

  /* ── shared layout tokens ── */
  const mx   = { maxWidth:1200, margin:"0 auto" };
  const card = { background:"rgba(30,41,59,.35)", border:"1px solid rgba(239,68,68,.08)", borderRadius:r.secR, padding:r.secPad, backdropFilter:"blur(8px)" };

  const btn = (active) => ({
    padding: mob ? "8px 11px" : "6px 14px",
    borderRadius: 7, border:"none", cursor:"pointer",
    fontSize: mob ? 11 : 12, fontWeight:600,
    fontFamily:"'Noto Sans TC',sans-serif",
    background: active ? "linear-gradient(135deg,#dc2626,#ef4444)" : "rgba(30,41,59,.55)",
    color: active ? "#fff" : "#94a3b8",
    minHeight: mob ? 38 : 32,                /* touch-friendly */
    WebkitTapHighlightColor: "transparent",
    transition: "background .15s, color .15s",
  });

  const legend = (color, text) => (
    <span style={{ fontSize: r.small, color:"#94a3b8", display:"inline-flex", alignItems:"center", gap:4 }}>
      <span style={{ display:"inline-block", width:9, height:9, borderRadius:2, background:color }} />{text}
    </span>
  );

  return (
    <div style={{ minHeight:"100vh", background:"linear-gradient(145deg,#0c0a14 0%,#1a0a0a 30%,#0f172a 70%,#0a0e1a 100%)", fontFamily:"'Noto Sans TC',sans-serif", color:"#e2e8f0", padding:r.pad }}>
      <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@300;400;500;600;700&display=swap" rel="stylesheet" />

      {/* ════ ALERT BANNER ════ */}
      <div style={{ ...mx, marginBottom: mob ? 12 : 16 }}>
        <div style={{ background:"rgba(239,68,68,.07)", border:"1px solid rgba(239,68,68,.22)", borderRadius: mob ? 8 : 10, padding: mob ? "8px 10px" : "10px 16px", display:"flex", alignItems:"flex-start", gap: mob ? 8 : 10 }}>
          <span style={{ fontSize: mob ? 16 : 20, lineHeight:1, flexShrink:0, marginTop:1 }}>🤖</span>
          <div style={{ minWidth:0 }}>
            <div style={{ fontSize: r.body, fontWeight:600, color:"#fca5a5" }}>Bot 流量佔比分析</div>
            <div style={{ fontSize: r.small, color:"#94a3b8", marginTop:1, lineHeight:1.5 }}>
              比較各站 Bot 流量（國家=China、管道=Direct）佔全站流量之比例{mob ? <br/> : " ｜ "}期間 2025/01 – 2026/01
            </div>
          </div>
        </div>
      </div>

      {/* ════ TITLE ════ */}
      <div style={{ ...mx, marginBottom:4, display:"flex", alignItems:"center", gap: mob ? 6 : 10 }}>
        <div style={{ width: mob ? 3 : 5, height: mob ? 24 : 32, borderRadius:2, background:"linear-gradient(180deg,#ef4444,#f97316)", flexShrink:0 }} />
        <h1 style={{ fontSize:r.h1, fontWeight:700, margin:0, background:"linear-gradient(135deg,#fecaca,#f97316,#fbbf24)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", lineHeight:1.3 }}>
          Bot 流量佔全站比例分析
        </h1>
      </div>

      {/* ════ SUBTITLE ════ */}
      <div style={{ ...mx, marginBottom: mob ? 14 : 18, paddingLeft: mob ? 9 : 15 }}>
        {mob ? (
          <div style={{ color:"#64748b", fontSize:10, lineHeight:1.7 }}>
            <div>Bot PV {gBPV.toLocaleString()} / 全站 {gPV.toLocaleString()} = <b style={{ color:"#fbbf24" }}>{(gBPV/gPV*100).toFixed(2)}%</b></div>
            <div>Bot Sess {gBSe.toLocaleString()} / 全站 {gSes.toLocaleString()} = <b style={{ color:"#fbbf24" }}>{(gBSe/gSes*100).toFixed(2)}%</b></div>
          </div>
        ) : (
          <p style={{ color:"#64748b", fontSize: r.body, margin:0, lineHeight:1.6 }}>
            全 {data.length} 站合計：Bot PV {gBPV.toLocaleString()} / {gPV.toLocaleString()} = <b style={{ color:"#fbbf24" }}>{(gBPV/gPV*100).toFixed(2)}%</b>
            　｜　Bot Sess {gBSe.toLocaleString()} / {gSes.toLocaleString()} = <b style={{ color:"#fbbf24" }}>{(gBSe/gSes*100).toFixed(2)}%</b>
          </p>
        )}
      </div>

      {/* ════ KPI CARDS ════ */}
      <div style={{ ...mx, marginBottom: mob ? 14 : 18, display:"grid", gridTemplateColumns: mob ? "1fr 1fr" : tab ? "repeat(3,1fr)" : "repeat(6,1fr)", gap: mob ? 6 : tab ? 10 : 12 }}>
        {[
          { l:"全站 PV 合計", v: mob ? fmtN(gPV) : gPV.toLocaleString(), c:"#e2e8f0", ic:"📊" },
          { l:"Bot PV 合計",  v: mob ? fmtN(gBPV): gBPV.toLocaleString(),c:"#ef4444", ic:"🤖" },
          { l:"Bot PV 佔比",  v:(gBPV/gPV*100).toFixed(2)+"%",           c:"#fbbf24", ic:"⚠️" },
          { l:"全站 Sess 合計",v: mob ? fmtN(gSes): gSes.toLocaleString(),c:"#e2e8f0", ic:"🔗" },
          { l:"Bot Sess 合計", v: mob ? fmtN(gBSe): gBSe.toLocaleString(),c:"#f97316", ic:"🤖" },
          { l:"Bot Sess 佔比", v:(gBSe/gSes*100).toFixed(2)+"%",          c:"#fbbf24", ic:"⚠️" },
        ].map((c,i) => (
          <div key={i} style={{ background:"rgba(30,41,59,.45)", border:"1px solid rgba(239,68,68,.08)", borderRadius: mob ? 8 : 10, padding: mob ? "8px 8px" : "12px 14px", backdropFilter:"blur(8px)" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <span style={{ fontSize: r.tiny, color:"#94a3b8", fontWeight:500 }}>{c.l}</span>
              <span style={{ fontSize: mob ? 12 : 14 }}>{c.ic}</span>
            </div>
            <div style={{ fontSize: r.kpiVal, fontWeight:700, color:c.c, marginTop:2, lineHeight:1.2 }}>{c.v}</div>
          </div>
        ))}
      </div>

      {/* ════ SORT CONTROLS ════ */}
      <div style={{ ...mx, marginBottom: mob ? 10 : 14, display:"flex", flexWrap:"wrap", gap: mob ? 5 : 8, alignItems:"center" }}>
        {!mob && <span style={{ fontSize: r.small, color:"#64748b" }}>排序：</span>}
        {[
          { v:"pvRatio",  l: mob ? "PV佔比↓"   : "Bot PV 佔比 ↓" },
          { v:"sessRatio",l: mob ? "Sess佔比↓"  : "Bot Sess 佔比 ↓" },
          { v:"botPV",    l: mob ? "Bot量↓"      : "Bot PV 量 ↓" },
          { v:"totalPV",  l: mob ? "全站PV↓"     : "全站 PV ↓" },
        ].map(s => (
          <button key={s.v} onClick={() => setSortBy(s.v)} style={btn(sortBy===s.v)}>{s.l}</button>
        ))}
      </div>

      {/* ════ CHART 1 — RATIO BAR ════ */}
      <div style={{ ...mx, ...card, marginBottom: r.gap }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10, flexWrap:"wrap", gap:6 }}>
          <h2 style={{ fontSize:r.h2, fontWeight:600, color:"#fca5a5", margin:0 }}>
            📊 各站 Bot {ratioMetric === "pv" ? "PV" : "工作階段"} 佔比（%）
          </h2>
          <div style={{ display:"flex", gap:5 }}>
            {[{v:"pv",l:"Bot PV 佔比"},{v:"sess",l:"Bot Sess 佔比"}].map(m => (
              <button key={m.v} onClick={() => setRatioMetric(m.v)} style={btn(ratioMetric===m.v)}>{m.l}</button>
            ))}
          </div>
        </div>
        <ResponsiveContainer width="100%" height={r.chartH}>
          <BarChart data={chartRatio} layout="vertical"
            margin={{ top:8, right: mob ? 42 : tab ? 60 : 76, left:0, bottom:4 }}>
            <CartesianGrid strokeDasharray="3 6" stroke="rgba(148,163,184,.07)" horizontal={false} />
            <XAxis type="number" tick={{ fill:"#64748b", fontSize: r.tiny }} tickLine={false} axisLine={false} tickFormatter={v => v+"%"} domain={[0,"auto"]} />
            <YAxis type="category" dataKey="short" tick={{ fill:"#94a3b8", fontSize: mob ? 10 : r.body }} width={r.yW} tickLine={false} axisLine={false} />
            <Tooltip content={<RatioTooltip />} />
            <Bar dataKey="ratio" name={ratioMetric === "pv" ? "Bot PV 佔比 %" : "Bot Sess 佔比 %"}
              fillOpacity={.85} radius={[0,5,5,0]} barSize={mob ? 12 : tab ? 16 : 18}>
              {!mob && <LabelList dataKey="ratio" position="right"
                formatter={v => v.toFixed(2)+"%"}
                style={{ fill: ratioMetric === "pv" ? "#fca5a5" : "#fdba74", fontSize:10, fontWeight:600 }} />}
              {chartRatio.map((d,i) => <Cell key={i} fill={d.color} fillOpacity={.85} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        <div style={{ display:"flex", justifyContent:"center", gap: mob ? 10 : 20, marginTop:4, flexWrap:"wrap" }}>
          {legend(ratioMetric === "pv" ? "#ef4444" : "#f97316", ratioMetric === "pv" ? "Bot PV 佔比" : "Bot 工作階段佔比")}
        </div>
      </div>

      {/* ════ CHART 2 — STACKED ABSOLUTE ════ */}
      <div style={{ ...mx, ...card, marginBottom: r.gap }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10, flexWrap:"wrap", gap:6 }}>
          <h2 style={{ fontSize:r.h2, fontWeight:600, color:"#fca5a5", margin:0 }}>
            📊 全站 vs Bot 流量{mob ? "" : " — 絕對值"}
          </h2>
          <div style={{ display:"flex", gap:5 }}>
            {[{v:"pv",l:"瀏覽量"},{v:"sess",l:"工作階段"}].map(m => (
              <button key={m.v} onClick={() => setMetric(m.v)} style={btn(metric===m.v)}>{m.l}</button>
            ))}
          </div>
        </div>
        <ResponsiveContainer width="100%" height={r.chartH}>
          <BarChart data={chartStack} layout="vertical"
            margin={{ top:4, right:8, left:0, bottom:4 }}>
            <CartesianGrid strokeDasharray="3 6" stroke="rgba(148,163,184,.07)" horizontal={false} />
            <XAxis type="number" tick={{ fill:"#64748b", fontSize: r.tiny }} tickLine={false} axisLine={false}
              tickFormatter={v => v >= 1e6 ? (v/1e6).toFixed(1)+"M" : v >= 1e3 ? (v/1e3).toFixed(0)+"k" : v} />
            <YAxis type="category" dataKey="short" tick={{ fill:"#94a3b8", fontSize: mob ? 10 : r.body }} width={r.yW} tickLine={false} axisLine={false} />
            <Tooltip content={<StackTooltip />} />
            <Bar dataKey="cleanVal" name="正常流量" stackId="a" fill="#c9d1dc" fillOpacity={.55} radius={0} barSize={mob ? 12 : tab ? 16 : 20} />
            <Bar dataKey="botVal" name="Bot 流量" stackId="a" fill="#ef4444" fillOpacity={.85} radius={[0,4,4,0]} barSize={mob ? 12 : tab ? 16 : 20}>
              {chartStack.map((d,i) => <Cell key={i} fill={d.color} fillOpacity={.9} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        <div style={{ display:"flex", justifyContent:"center", gap: mob ? 10 : 20, marginTop:4, flexWrap:"wrap" }}>
          {legend("#334155","正常流量")}
          {legend("#ef4444","Bot 流量")}
        </div>
      </div>

      {/* ════ PER-SITE BOT TREND ════ */}
      <div style={{ ...mx, ...card, marginBottom: r.gap }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom: mob ? 6 : 12, flexWrap:"wrap", gap:6 }}>
          <h2 style={{ fontSize:r.h2, fontWeight:600, color:"#fca5a5", margin:0 }}>📈 各站 Bot 流量月趨勢</h2>
          <div style={{ display:"flex", gap:5 }}>
            {[{v:"pv",l:"Bot PV"},{v:"sess",l:"Bot Sess"}].map(m => (
              <button key={m.v} onClick={() => setTrendMetric(m.v)} style={btn(trendMetric===m.v)}>{m.l}</button>
            ))}
          </div>
        </div>
        <div style={{ fontSize: r.tiny, color:"#64748b", marginBottom: mob ? 8 : 12, paddingLeft:1 }}>
          2025/01 – 2026/01 ｜ 依 Bot PV 佔比排列 ｜ 各圖 Y 軸獨立
        </div>
        <div style={{ display:"grid", gridTemplateColumns: mob ? "1fr" : tab ? "1fr 1fr" : "repeat(3,1fr)", gap: mob ? 8 : tab ? 10 : 12 }}>
          {sorted.map(s => (
            <TrendCard key={s.key} site={s} r={r} mob={mob} trendMetric={trendMetric} />
          ))}
        </div>
      </div>

      {/* ════ DATA TABLE / CARDS ════ */}
      <div style={{ ...mx, ...card, marginBottom: r.gap }}>
        <h2 style={{ fontSize:r.h2, fontWeight:600, color:"#fca5a5", margin:"0 0 10px 2px" }}>📋 Bot 流量佔比明細</h2>

        {mob ? (
          /* ── MOBILE: card list ── */
          <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
            {sorted.map((d,i) => <DataCard key={d.key} d={d} i={i} r={r} />)}
            {/* grand total card */}
            <div style={{ background:"rgba(251,191,36,.05)", border:"1px solid rgba(251,191,36,.18)", borderRadius:10, padding:"12px 12px 10px" }}>
              <div style={{ fontSize:13, fontWeight:700, color:"#fbbf24", marginBottom:6 }}>📊 全站合計</div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:6, marginBottom:6 }}>
                {[
                  { l:"全站 PV", v:fmtN(gPV), c:"#e2e8f0" },
                  { l:"Bot PV", v:fmtN(gBPV), c:"#ef4444" },
                  { l:"全站 Sess", v:fmtN(gSes), c:"#e2e8f0" },
                  { l:"Bot Sess", v:fmtN(gBSe), c:"#f97316" },
                ].map((m,j) => (
                  <div key={j} style={{ background:"rgba(15,23,42,.45)", borderRadius:7, padding:"6px 8px" }}>
                    <div style={{ fontSize:9, color: m.c==="#e2e8f0" ? "#94a3b8" : m.c }}>{m.l}</div>
                    <div style={{ fontSize:12, color:m.c, fontWeight:600 }}>{m.v}</div>
                  </div>
                ))}
              </div>
              <div style={{ display:"flex", gap:6 }}>
                {[
                  { l:"Bot PV 佔比", v:(gBPV/gPV*100).toFixed(2)+"%" },
                  { l:"Bot Sess 佔比", v:(gBSe/gSes*100).toFixed(2)+"%" },
                ].map((b,j) => (
                  <div key={j} style={{ flex:1, textAlign:"center", padding:"5px 0", borderRadius:7, background:"rgba(251,191,36,.1)", border:"1px solid rgba(251,191,36,.22)" }}>
                    <div style={{ fontSize:9, color:"#94a3b8" }}>{b.l}</div>
                    <div style={{ fontSize:14, fontWeight:700, color:"#fbbf24" }}>{b.v}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* ── TABLET / DESKTOP: scrollable table ── */
          <div style={{ overflowX:"auto", WebkitOverflowScrolling:"touch" }}>
            <table style={{ width:"100%", borderCollapse:"separate", borderSpacing:"0 2px", minWidth: tab ? 680 : "auto" }}>
              <thead>
                <tr>
                  {["#","網站","全站 PV","Bot PV","Bot PV 佔比","全站 Sess","Bot Sess","Bot Sess 佔比"].map((h,i) => (
                    <th key={i} style={{ padding: tab ? "7px 5px" : "8px 10px", textAlign: i<2 ? "left":"right", fontSize: tab ? 10 : 11, color:"#94a3b8", fontWeight:600, borderBottom:"1px solid rgba(148,163,184,.1)", whiteSpace:"nowrap" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sorted.map((d,i) => {
                  const pc = sevC(d.botPVRatio);
                  const sc2 = sevC(d.botSessRatio);
                  const cp = tab ? "7px 5px" : "8px 10px";
                  const fs = tab ? 11 : 12;
                  return (
                    <tr key={d.key} style={{ background: i%2===0 ? "rgba(239,68,68,.03)" : "transparent" }}>
                      <td style={{ padding:cp, fontSize:fs, color:"#64748b", fontWeight:600, width:30 }}>{i+1}</td>
                      <td style={{ padding:cp, fontSize:fs, fontWeight:500, whiteSpace:"nowrap" }}>
                        <span style={{ display:"inline-block", width:7, height:7, borderRadius:"50%", background:d.color, marginRight:5, verticalAlign:"middle" }} />
                        <span style={{ color:d.color }}>{d.short}</span>
                        {desk && <span style={{ color:"#475569", fontSize:10, marginLeft:5 }}>{d.name}</span>}
                      </td>
                      <td style={{ padding:cp, fontSize:fs, color:"#94a3b8", textAlign:"right" }}>{d.totalPV.toLocaleString()}</td>
                      <td style={{ padding:cp, fontSize:fs, color:"#ef4444", textAlign:"right", fontWeight:600 }}>{d.botPV.toLocaleString()}</td>
                      <td style={{ padding:cp, textAlign:"right" }}>
                        <span style={{ display:"inline-block", padding:"1px 7px", borderRadius:10, fontSize: tab ? 10 : fs, fontWeight:700, background:pc+"16", color:pc, border:`1px solid ${pc}28` }}>{d.botPVRatio.toFixed(2)}%</span>
                      </td>
                      <td style={{ padding:cp, fontSize:fs, color:"#94a3b8", textAlign:"right" }}>{d.totalSess.toLocaleString()}</td>
                      <td style={{ padding:cp, fontSize:fs, color:"#f97316", textAlign:"right", fontWeight:600 }}>{d.botSess.toLocaleString()}</td>
                      <td style={{ padding:cp, textAlign:"right" }}>
                        <span style={{ display:"inline-block", padding:"1px 7px", borderRadius:10, fontSize: tab ? 10 : fs, fontWeight:700, background:sc2+"16", color:sc2, border:`1px solid ${sc2}28` }}>{d.botSessRatio.toFixed(2)}%</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr style={{ borderTop:"2px solid rgba(148,163,184,.15)" }}>
                  <td colSpan={2} style={{ padding:"10px 10px", fontSize:12, color:"#e2e8f0", fontWeight:700 }}>全站合計</td>
                  <td style={{ padding:"10px 10px", fontSize:11, color:"#94a3b8", textAlign:"right", fontWeight:700 }}>{gPV.toLocaleString()}</td>
                  <td style={{ padding:"10px 10px", fontSize:11, color:"#ef4444", textAlign:"right", fontWeight:700 }}>{gBPV.toLocaleString()}</td>
                  <td style={{ padding:"10px 10px", textAlign:"right" }}>
                    <span style={{ display:"inline-block", padding:"1px 7px", borderRadius:10, fontSize:11, fontWeight:700, background:"rgba(251,191,36,.12)", color:"#fbbf24", border:"1px solid rgba(251,191,36,.25)" }}>{(gBPV/gPV*100).toFixed(2)}%</span>
                  </td>
                  <td style={{ padding:"10px 10px", fontSize:11, color:"#94a3b8", textAlign:"right", fontWeight:700 }}>{gSes.toLocaleString()}</td>
                  <td style={{ padding:"10px 10px", fontSize:11, color:"#f97316", textAlign:"right", fontWeight:700 }}>{gBSe.toLocaleString()}</td>
                  <td style={{ padding:"10px 10px", textAlign:"right" }}>
                    <span style={{ display:"inline-block", padding:"1px 7px", borderRadius:10, fontSize:11, fontWeight:700, background:"rgba(251,191,36,.12)", color:"#fbbf24", border:"1px solid rgba(251,191,36,.25)" }}>{(gBSe/gSes*100).toFixed(2)}%</span>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </div>

      {/* ════ KEY FINDINGS ════ */}
      {/*
      <div style={{ ...mx, ...card, marginBottom: r.gap }}>
        <h2 style={{ fontSize:r.h2, fontWeight:600, color:"#fca5a5", margin:"0 0 10px 0" }}>🔍 關鍵發現</h2>
        <div style={{ display:"grid", gridTemplateColumns: mob ? "1fr" : tab ? "1fr 1fr" : "repeat(2,1fr)", gap: mob ? 8 : 10 }}>
          {[
            { t:"臺北旅遊網受創最重", d:`Bot PV 佔全站 ${(4652824/29743387*100).toFixed(1)}%、Bot 工作階段佔 ${(4366246/14544064*100).toFixed(1)}%，Bot 工作階段佔比偏高代表 Bot 建立了大量獨立連線。`, ic:"🔴" },
            { t:"金門、台南 Bot 佔比居次", d:`金門 Bot PV 佔比 ${(328522/4306758*100).toFixed(1)}%、台南 ${(262823/5107667*100).toFixed(1)}%，中型網站中 Bot 已明顯影響數據可信度。`, ic:"🟠" },
            { t:"大站 Bot 絕對量高但佔比低", d:`桃園（${(108161/10984126*100).toFixed(2)}%）、臺中（${(124082/9305377*100).toFixed(2)}%）全站流量大，Bot 佔比低，但桃園 2025/11 突波值得注意。`, ic:"🟡" },
            { t:"風景區小站數據易失真", d:"參山（0.13%）、東海岸（0.32%）等小站佔比雖低，但集中在特定頁面或時段時仍會扭曲報告結論。", ic:"⚖️" },
          ].map((f,i) => (
            <div key={i} style={{ background:"rgba(239,68,68,.03)", border:"1px solid rgba(239,68,68,.08)", borderRadius: mob ? 8 : 10, padding: mob ? "10px 10px" : "12px 14px" }}>
              <div style={{ fontSize: r.body, fontWeight:600, color:"#fca5a5", marginBottom:3 }}>{f.ic} {f.t}</div>
              <div style={{ fontSize: r.small, color:"#94a3b8", lineHeight:1.65 }}>{f.d}</div>
            </div>
          ))}
        </div>
      </div>
      */}

      {/* ════ FOOTER ════ */}
      <div style={{ ...mx, marginTop: mob ? 10 : 14, textAlign:"center", padding:"0 4px" }}>
        <p style={{ fontSize: r.tiny, color:"#475569", lineHeight:1.6, margin:0 }}>
          資料來源：Google Analytics 4 ｜ Bot 識別：國家=China、管道=Direct{mob ? <br/> : " ｜ "}全站數據：同期間無篩選 ｜ 產出日期：2026/02/04
        </p>
      </div>
    </div>
  );
}