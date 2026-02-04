import { useState, useMemo } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, ComposedChart, Line, Cell, LabelList
} from "recharts";

/*
  Bot 流量佔比分析：14 個觀光旅遊網站
  Bot 識別條件：國家=China、管道=Direct
  期間：2025/01/01 – 2026/01/31
  
  全站數據（無篩選） vs Bot 數據（China + Direct）
*/

const data = [
  {
    key: "taipei", name: "臺北旅遊網", short: "臺北", color: "#f43f5e",
    totalPV: 29743387, totalSess: 14544064,
    botPV: 4652824, botSess: 4366246,
  },
  {
    key: "kaohsiung", name: "高雄旅遊網", short: "高雄", color: "#06b6d4",
    totalPV: 7071698, totalSess: 4380967,
    botPV: 134222, botSess: 129353,
  },
  {
    key: "newTaipei", name: "新北市旅遊網", short: "新北", color: "#eab308",
    totalPV: 6878769, totalSess: 3939825,
    botPV: 199565, botSess: 177005,
  },
  {
    key: "tainan", name: "台南旅遊網", short: "台南", color: "#22c55e",
    totalPV: 5107667, totalSess: 3399765,
    botPV: 262823, botSess: 260447,
  },
  {
    key: "kinmen", name: "金門旅遊網", short: "金門", color: "#f97316",
    totalPV: 4306758, totalSess: 2275599,
    botPV: 328522, botSess: 312433,
  },
  {
    key: "taoyuan", name: "桃園觀光導覽網", short: "桃園", color: "#ec4899",
    totalPV: 10984126, totalSess: 6287770,
    botPV: 108161, botSess: 108144,
  },
  {
    key: "taichung", name: "臺中觀光旅遊網", short: "臺中", color: "#8b5cf6",
    totalPV: 9305377, totalSess: 4869486,
    botPV: 124082, botSess: 125814,
  },
  {
    key: "alishan", name: "阿里山國家風景區", short: "阿里山", color: "#14b8a6",
    totalPV: 2524061, totalSess: 1494563,
    botPV: 12203, botSess: 12067,
  },
  {
    key: "eastCoast", name: "東海岸旅遊網", short: "東海岸", color: "#a855f7",
    totalPV: 1660658, totalSess: 956616,
    botPV: 5289, botSess: 5076,
  },
  {
    key: "siraya", name: "西拉雅國家風景區", short: "西拉雅", color: "#818cf8",
    totalPV: 1033621, totalSess: 685015,
    botPV: 7537, botSess: 7591,
  },
  {
    key: "valley", name: "花東縱谷旅遊網", short: "花東縱谷", color: "#34d399",
    totalPV: 980293, totalSess: 693056,
    botPV: 6816, botSess: 6746,
  },
  {
    key: "triMtn", name: "參山國家風景區", short: "參山", color: "#c084fc",
    totalPV: 889641, totalSess: 574250,
    botPV: 1112, botSess: 1175,
  },
  {
    key: "yunjianan", name: "雲嘉南旅遊網", short: "雲嘉南", color: "#38bdf8",
    totalPV: 646210, totalSess: 411416,
    botPV: 7699, botSess: 7927,
  },
  {
    key: "eastTW", name: "東區觀光圈", short: "東觀光圈", color: "#fb923c",
    totalPV: 351635, totalSess: 106370,
    botPV: 3281, botSess: 1767,
  },
];

// Pre-compute ratios
const enriched = data.map(d => ({
  ...d,
  botPVRatio: d.botPV / d.totalPV * 100,
  botSessRatio: d.botSess / d.totalSess * 100,
  cleanPV: d.totalPV - d.botPV,
  cleanSess: d.totalSess - d.botSess,
}));

const grandTotalPV = data.reduce((s, d) => s + d.totalPV, 0);
const grandTotalSess = data.reduce((s, d) => s + d.totalSess, 0);
const grandBotPV = data.reduce((s, d) => s + d.botPV, 0);
const grandBotSess = data.reduce((s, d) => s + d.botSess, 0);

const RatioTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  const item = enriched.find(d => d.short === label);
  if (!item) return null;
  return (
    <div style={{
      background: "rgba(10, 14, 26, 0.97)", border: "1px solid rgba(239,68,68,0.2)",
      borderRadius: 10, padding: "14px 18px", backdropFilter: "blur(12px)",
      boxShadow: "0 8px 32px rgba(0,0,0,0.5)", minWidth: 240,
      fontFamily: "'Noto Sans TC', sans-serif",
    }}>
      <p style={{ fontSize: 13, fontWeight: 700, color: item.color, margin: "0 0 8px" }}>{item.name}</p>
      <div style={{ display: "grid", gridTemplateColumns: "auto auto", gap: "4px 16px", fontSize: 12 }}>
        <span style={{ color: "#94a3b8" }}>全站瀏覽量</span>
        <span style={{ color: "#e2e8f0", textAlign: "right" }}>{item.totalPV.toLocaleString()}</span>
        <span style={{ color: "#ef4444" }}>Bot 瀏覽量</span>
        <span style={{ color: "#ef4444", textAlign: "right", fontWeight: 600 }}>{item.botPV.toLocaleString()}</span>
        <span style={{ color: "#fbbf24" }}>Bot PV 佔比</span>
        <span style={{ color: "#fbbf24", textAlign: "right", fontWeight: 700 }}>{item.botPVRatio.toFixed(2)}%</span>
        <td colSpan={2} style={{ borderTop: "1px solid rgba(148,163,184,0.15)", padding: "2px 0" }} />
        <span style={{ color: "#94a3b8" }}>全站工作階段</span>
        <span style={{ color: "#e2e8f0", textAlign: "right" }}>{item.totalSess.toLocaleString()}</span>
        <span style={{ color: "#f97316" }}>Bot 工作階段</span>
        <span style={{ color: "#f97316", textAlign: "right", fontWeight: 600 }}>{item.botSess.toLocaleString()}</span>
        <span style={{ color: "#fbbf24" }}>Bot Sess 佔比</span>
        <span style={{ color: "#fbbf24", textAlign: "right", fontWeight: 700 }}>{item.botSessRatio.toFixed(2)}%</span>
      </div>
    </div>
  );
};

const StackTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  const item = enriched.find(d => d.short === label);
  if (!item) return null;
  return (
    <div style={{
      background: "rgba(10, 14, 26, 0.97)", border: "1px solid rgba(239,68,68,0.2)",
      borderRadius: 10, padding: "14px 18px", backdropFilter: "blur(12px)",
      boxShadow: "0 8px 32px rgba(0,0,0,0.5)", minWidth: 220,
      fontFamily: "'Noto Sans TC', sans-serif",
    }}>
      <p style={{ fontSize: 13, fontWeight: 700, color: item.color, margin: "0 0 8px" }}>{item.name}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ fontSize: 12, color: p.color || p.fill, margin: "3px 0" }}>
          {p.name}：{Number(p.value).toLocaleString()}
        </p>
      ))}
    </div>
  );
};

export default function BotRatioAnalysis() {
  const [sortBy, setSortBy] = useState("pvRatio");
  const [metric, setMetric] = useState("pv");

  const sorted = useMemo(() => {
    const arr = [...enriched];
    switch (sortBy) {
      case "pvRatio": return arr.sort((a, b) => b.botPVRatio - a.botPVRatio);
      case "sessRatio": return arr.sort((a, b) => b.botSessRatio - a.botSessRatio);
      case "botPV": return arr.sort((a, b) => b.botPV - a.botPV);
      case "totalPV": return arr.sort((a, b) => b.totalPV - a.totalPV);
      default: return arr;
    }
  }, [sortBy]);

  const chartRatio = sorted.map(d => ({
    short: d.short,
    color: d.color,
    botPVRatio: parseFloat(d.botPVRatio.toFixed(2)),
    botSessRatio: parseFloat(d.botSessRatio.toFixed(2)),
  }));

  const chartStack = sorted.map(d => ({
    short: d.short,
    color: d.color,
    botVal: metric === "pv" ? d.botPV : d.botSess,
    cleanVal: metric === "pv" ? d.cleanPV : d.cleanSess,
  }));

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(145deg, #0c0a14 0%, #1a0a0a 30%, #0f172a 70%, #0a0e1a 100%)",
      fontFamily: "'Noto Sans TC', sans-serif", color: "#e2e8f0", padding: "36px 20px",
    }}>
      <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@300;400;500;600;700&display=swap" rel="stylesheet" />

      {/* Alert Banner */}
      <div style={{ maxWidth: 1200, margin: "0 auto 20px" }}>
        <div style={{
          background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.25)",
          borderRadius: 10, padding: "12px 18px",
          display: "flex", alignItems: "center", gap: 12,
        }}>
          <span style={{ fontSize: 22 }}>🤖</span>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#fca5a5" }}>Bot 流量佔比分析</div>
            <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 2 }}>
              比較各站 Bot 流量（國家=China、管道=Direct）佔全站流量之比例 ｜ 2025/01 – 2026/01
            </div>
          </div>
        </div>
      </div>

      {/* Title */}
      <div style={{ maxWidth: 1200, margin: "0 auto 8px", display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ width: 6, height: 36, borderRadius: 3, background: "linear-gradient(180deg, #ef4444, #f97316)" }} />
        <h1 style={{
          fontSize: 24, fontWeight: 700, margin: 0,
          background: "linear-gradient(135deg, #fecaca, #f97316, #fbbf24)",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
        }}>
          Bot 流量佔全站比例分析
        </h1>
      </div>
      <p style={{ maxWidth: 1200, margin: "0 auto 24px 18px", color: "#64748b", fontSize: 13, paddingLeft: 18 }}>
        全 {data.length} 站合計：Bot 瀏覽量 {grandBotPV.toLocaleString()} / 全站 {grandTotalPV.toLocaleString()} = <span style={{ color: "#fbbf24", fontWeight: 700 }}>{(grandBotPV / grandTotalPV * 100).toFixed(2)}%</span>
        　｜　Bot 工作階段 {grandBotSess.toLocaleString()} / 全站 {grandTotalSess.toLocaleString()} = <span style={{ color: "#fbbf24", fontWeight: 700 }}>{(grandBotSess / grandTotalSess * 100).toFixed(2)}%</span>
      </p>

      {/* KPIs */}
      <div style={{ maxWidth: 1200, margin: "0 auto 24px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 14 }}>
        {[
          { label: "全站瀏覽量合計", value: grandTotalPV.toLocaleString(), color: "#e2e8f0", icon: "📊" },
          { label: "Bot 瀏覽量合計", value: grandBotPV.toLocaleString(), color: "#ef4444", icon: "🤖" },
          { label: "Bot PV 佔比", value: (grandBotPV / grandTotalPV * 100).toFixed(2) + "%", color: "#fbbf24", icon: "⚠️" },
          { label: "全站工作階段合計", value: grandTotalSess.toLocaleString(), color: "#e2e8f0", icon: "🔗" },
          { label: "Bot 工作階段合計", value: grandBotSess.toLocaleString(), color: "#f97316", icon: "🤖" },
          { label: "Bot Sess 佔比", value: (grandBotSess / grandTotalSess * 100).toFixed(2) + "%", color: "#fbbf24", icon: "⚠️" },
        ].map((c, i) => (
          <div key={i} style={{
            background: "rgba(30,41,59,0.5)", border: "1px solid rgba(239,68,68,0.1)",
            borderRadius: 12, padding: "14px 16px", backdropFilter: "blur(8px)",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 11, color: "#94a3b8", fontWeight: 500 }}>{c.label}</span>
              <span style={{ fontSize: 16 }}>{c.icon}</span>
            </div>
            <div style={{ fontSize: 22, fontWeight: 700, color: c.color, marginTop: 4 }}>{c.value}</div>
          </div>
        ))}
      </div>

      {/* Sort controls */}
      <div style={{ maxWidth: 1200, margin: "0 auto 16px", display: "flex", flexWrap: "wrap", gap: 8 }}>
        <span style={{ fontSize: 12, color: "#64748b", lineHeight: "32px" }}>排序方式：</span>
        {[
          { v: "pvRatio", l: "Bot PV 佔比 ↓" },
          { v: "sessRatio", l: "Bot Sess 佔比 ↓" },
          { v: "botPV", l: "Bot PV 量 ↓" },
          { v: "totalPV", l: "全站 PV ↓" },
        ].map(m => (
          <button key={m.v} onClick={() => setSortBy(m.v)} style={{
            padding: "6px 14px", borderRadius: 7, border: "none", cursor: "pointer",
            fontSize: 12, fontWeight: 600, fontFamily: "'Noto Sans TC', sans-serif",
            background: sortBy === m.v ? "linear-gradient(135deg, #dc2626, #ef4444)" : "rgba(30,41,59,0.6)",
            color: sortBy === m.v ? "#fff" : "#94a3b8",
          }}>{m.l}</button>
        ))}
      </div>

      {/* Bot Ratio Bar Chart */}
      <div style={{
        maxWidth: 1200, margin: "0 auto 24px",
        background: "rgba(30,41,59,0.4)", border: "1px solid rgba(239,68,68,0.1)",
        borderRadius: 14, padding: "24px 16px 12px", backdropFilter: "blur(8px)",
      }}>
        <h2 style={{ fontSize: 15, fontWeight: 600, color: "#fca5a5", margin: "0 0 16px 8px" }}>
          📊 各站 Bot 流量佔比（%）
        </h2>
        <ResponsiveContainer width="100%" height={440}>
          <ComposedChart data={chartRatio} margin={{ top: 20, right: 20, left: 10, bottom: 5 }} layout="vertical">
            <CartesianGrid strokeDasharray="3 6" stroke="rgba(148,163,184,0.08)" horizontal={false} />
            <XAxis type="number" tick={{ fill: "#64748b", fontSize: 11 }} tickLine={false} axisLine={false}
              tickFormatter={v => v + "%"} domain={[0, "auto"]} />
            <YAxis type="category" dataKey="short" tick={{ fill: "#94a3b8", fontSize: 12 }} width={80} tickLine={false} axisLine={false} />
            <Tooltip content={<RatioTooltip />} />
            <Bar dataKey="botPVRatio" name="Bot PV 佔比 %" fill="#ef4444" fillOpacity={0.8} radius={[0, 4, 4, 0]} barSize={14}>
              <LabelList dataKey="botPVRatio" position="right"
                formatter={v => v.toFixed(2) + "%"}
                style={{ fill: "#fca5a5", fontSize: 11, fontWeight: 600 }} />
              {chartRatio.map((d, i) => (
                <Cell key={i} fill={d.color} fillOpacity={0.85} />
              ))}
            </Bar>
            <Bar dataKey="botSessRatio" name="Bot Sess 佔比 %" fill="#f97316" fillOpacity={0.6} radius={[0, 4, 4, 0]} barSize={14}>
              <LabelList dataKey="botSessRatio" position="right"
                formatter={v => v.toFixed(2) + "%"}
                style={{ fill: "#fdba74", fontSize: 11, fontWeight: 500 }} />
            </Bar>
          </ComposedChart>
        </ResponsiveContainer>
        <div style={{ display: "flex", justifyContent: "center", gap: 24, marginTop: 8 }}>
          <span style={{ fontSize: 12, color: "#94a3b8" }}><span style={{ display: "inline-block", width: 12, height: 12, borderRadius: 2, background: "#ef4444", marginRight: 6, verticalAlign: "middle" }} />Bot PV 佔比</span>
          <span style={{ fontSize: 12, color: "#94a3b8" }}><span style={{ display: "inline-block", width: 12, height: 12, borderRadius: 2, background: "#f97316", marginRight: 6, verticalAlign: "middle" }} />Bot 工作階段佔比</span>
        </div>
      </div>

      {/* Stacked absolute chart */}
      <div style={{
        maxWidth: 1200, margin: "0 auto 24px",
        background: "rgba(30,41,59,0.4)", border: "1px solid rgba(239,68,68,0.1)",
        borderRadius: 14, padding: "24px 16px 12px", backdropFilter: "blur(8px)",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <h2 style={{ fontSize: 15, fontWeight: 600, color: "#fca5a5", margin: "0 0 0 8px" }}>
            📊 全站流量 vs Bot 流量 — 絕對值對照
          </h2>
          <div style={{ display: "flex", gap: 6 }}>
            {[{v:"pv",l:"瀏覽量"},{v:"sess",l:"工作階段"}].map(m => (
              <button key={m.v} onClick={() => setMetric(m.v)} style={{
                padding: "5px 14px", borderRadius: 7, border: "none", cursor: "pointer",
                fontSize: 12, fontWeight: 600, fontFamily: "'Noto Sans TC', sans-serif",
                background: metric === m.v ? "linear-gradient(135deg, #dc2626, #ef4444)" : "rgba(30,41,59,0.6)",
                color: metric === m.v ? "#fff" : "#94a3b8",
              }}>{m.l}</button>
            ))}
          </div>
        </div>
        <ResponsiveContainer width="100%" height={440}>
          <BarChart data={chartStack} margin={{ top: 5, right: 20, left: 10, bottom: 5 }} layout="vertical">
            <CartesianGrid strokeDasharray="3 6" stroke="rgba(148,163,184,0.08)" horizontal={false} />
            <XAxis type="number" tick={{ fill: "#64748b", fontSize: 10 }} tickLine={false} axisLine={false}
              tickFormatter={v => v >= 1000000 ? `${(v/1000000).toFixed(1)}M` : v >= 1000 ? `${(v/1000).toFixed(0)}k` : v} />
            <YAxis type="category" dataKey="short" tick={{ fill: "#94a3b8", fontSize: 12 }} width={80} tickLine={false} axisLine={false} />
            <Tooltip content={<StackTooltip />} />
            <Bar dataKey="cleanVal" name="正常流量" stackId="a" fill="#334155" fillOpacity={0.6} radius={0} barSize={20} />
            <Bar dataKey="botVal" name="Bot 流量" stackId="a" fill="#ef4444" fillOpacity={0.85} radius={[0, 4, 4, 0]} barSize={20}>
              {chartStack.map((d, i) => (
                <Cell key={i} fill={d.color} fillOpacity={0.9} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        <div style={{ display: "flex", justifyContent: "center", gap: 24, marginTop: 8 }}>
          <span style={{ fontSize: 12, color: "#94a3b8" }}><span style={{ display: "inline-block", width: 12, height: 12, borderRadius: 2, background: "#334155", marginRight: 6, verticalAlign: "middle" }} />正常流量</span>
          <span style={{ fontSize: 12, color: "#94a3b8" }}><span style={{ display: "inline-block", width: 12, height: 12, borderRadius: 2, background: "#ef4444", marginRight: 6, verticalAlign: "middle" }} />Bot 流量（佔比部分以各站代表色標示）</span>
        </div>
      </div>

      {/* Detailed Table */}
      <div style={{
        maxWidth: 1200, margin: "0 auto 24px",
        background: "rgba(30,41,59,0.4)", border: "1px solid rgba(239,68,68,0.1)",
        borderRadius: 14, padding: "24px 16px 12px", backdropFilter: "blur(8px)",
      }}>
        <h2 style={{ fontSize: 15, fontWeight: 600, color: "#fca5a5", margin: "0 0 16px 8px" }}>
          📋 Bot 流量佔比明細表
        </h2>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: "0 3px" }}>
            <thead>
              <tr>
                {["#", "網站", "全站 PV", "Bot PV", "Bot PV 佔比", "全站 Sessions", "Bot Sessions", "Bot Sess 佔比"].map((h, i) => (
                  <th key={i} style={{
                    padding: "10px 10px", textAlign: i < 2 ? "left" : "right",
                    fontSize: 11, color: "#94a3b8", fontWeight: 600,
                    borderBottom: "1px solid rgba(148,163,184,0.12)", whiteSpace: "nowrap",
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sorted.map((d, i) => {
                const pvSeverity = d.botPVRatio >= 10 ? "#ef4444" : d.botPVRatio >= 5 ? "#f97316" : d.botPVRatio >= 1 ? "#eab308" : "#22c55e";
                const sessSeverity = d.botSessRatio >= 10 ? "#ef4444" : d.botSessRatio >= 5 ? "#f97316" : d.botSessRatio >= 1 ? "#eab308" : "#22c55e";
                return (
                  <tr key={d.key} style={{ background: i % 2 === 0 ? "rgba(239,68,68,0.03)" : "transparent" }}>
                    <td style={{ padding: "10px 10px", fontSize: 12, color: "#64748b", fontWeight: 600, width: 40 }}>{i + 1}</td>
                    <td style={{ padding: "10px 10px", fontSize: 13, fontWeight: 500, whiteSpace: "nowrap" }}>
                      <span style={{ display: "inline-block", width: 10, height: 10, borderRadius: "50%", background: d.color, marginRight: 8, verticalAlign: "middle" }} />
                      <span style={{ color: d.color }}>{d.short}</span>
                      <span style={{ color: "#475569", fontSize: 11, marginLeft: 6 }}>{d.name}</span>
                    </td>
                    <td style={{ padding: "10px 10px", fontSize: 12, color: "#94a3b8", textAlign: "right" }}>{d.totalPV.toLocaleString()}</td>
                    <td style={{ padding: "10px 10px", fontSize: 12, color: "#ef4444", textAlign: "right", fontWeight: 600 }}>{d.botPV.toLocaleString()}</td>
                    <td style={{ padding: "10px 10px", textAlign: "right" }}>
                      <span style={{
                        display: "inline-block", padding: "3px 10px", borderRadius: 12,
                        fontSize: 12, fontWeight: 700,
                        background: pvSeverity + "18", color: pvSeverity, border: `1px solid ${pvSeverity}30`,
                      }}>
                        {d.botPVRatio.toFixed(2)}%
                      </span>
                    </td>
                    <td style={{ padding: "10px 10px", fontSize: 12, color: "#94a3b8", textAlign: "right" }}>{d.totalSess.toLocaleString()}</td>
                    <td style={{ padding: "10px 10px", fontSize: 12, color: "#f97316", textAlign: "right", fontWeight: 600 }}>{d.botSess.toLocaleString()}</td>
                    <td style={{ padding: "10px 10px", textAlign: "right" }}>
                      <span style={{
                        display: "inline-block", padding: "3px 10px", borderRadius: 12,
                        fontSize: 12, fontWeight: 700,
                        background: sessSeverity + "18", color: sessSeverity, border: `1px solid ${sessSeverity}30`,
                      }}>
                        {d.botSessRatio.toFixed(2)}%
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr style={{ borderTop: "2px solid rgba(148,163,184,0.2)" }}>
                <td colSpan={2} style={{ padding: "12px 10px", fontSize: 13, color: "#e2e8f0", fontWeight: 700 }}>全站合計</td>
                <td style={{ padding: "12px 10px", fontSize: 12, color: "#94a3b8", textAlign: "right", fontWeight: 700 }}>{grandTotalPV.toLocaleString()}</td>
                <td style={{ padding: "12px 10px", fontSize: 12, color: "#ef4444", textAlign: "right", fontWeight: 700 }}>{grandBotPV.toLocaleString()}</td>
                <td style={{ padding: "12px 10px", textAlign: "right" }}>
                  <span style={{
                    display: "inline-block", padding: "3px 10px", borderRadius: 12,
                    fontSize: 12, fontWeight: 700, background: "rgba(251,191,36,0.15)", color: "#fbbf24", border: "1px solid rgba(251,191,36,0.3)",
                  }}>
                    {(grandBotPV / grandTotalPV * 100).toFixed(2)}%
                  </span>
                </td>
                <td style={{ padding: "12px 10px", fontSize: 12, color: "#94a3b8", textAlign: "right", fontWeight: 700 }}>{grandTotalSess.toLocaleString()}</td>
                <td style={{ padding: "12px 10px", fontSize: 12, color: "#f97316", textAlign: "right", fontWeight: 700 }}>{grandBotSess.toLocaleString()}</td>
                <td style={{ padding: "12px 10px", textAlign: "right" }}>
                  <span style={{
                    display: "inline-block", padding: "3px 10px", borderRadius: 12,
                    fontSize: 12, fontWeight: 700, background: "rgba(251,191,36,0.15)", color: "#fbbf24", border: "1px solid rgba(251,191,36,0.3)",
                  }}>
                    {(grandBotSess / grandTotalSess * 100).toFixed(2)}%
                  </span>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Key Findings */}
      <div style={{
        maxWidth: 1200, margin: "0 auto 24px",
        background: "rgba(30,41,59,0.4)", border: "1px solid rgba(239,68,68,0.1)",
        borderRadius: 14, padding: "24px 22px", backdropFilter: "blur(8px)",
      }}>
        <h2 style={{ fontSize: 15, fontWeight: 600, color: "#fca5a5", margin: "0 0 14px 0" }}>
          🔍 關鍵發現
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 14 }}>
          {[
            {
              title: "臺北旅遊網受創最重",
              desc: `Bot PV 佔全站 ${(4652824/29743387*100).toFixed(1)}%、Bot 工作階段佔 ${(4366246/14544064*100).toFixed(1)}%，Bot 工作階段佔比偏高代表 Bot 建立了大量獨立連線。`,
              icon: "🔴",
            },
            {
              title: "金門、台南 Bot 佔比居次",
              desc: `金門 Bot PV 佔比 ${(328522/4306758*100).toFixed(1)}%、台南 ${(262823/5107667*100).toFixed(1)}%，在中型網站中 Bot 已明顯影響數據可信度。`,
              icon: "🟠",
            },
            {
              title: "大站的 Bot 絕對量高但佔比低",
              desc: `桃園（${(108161/10984126*100).toFixed(2)}%）、臺中（${(124082/9305377*100).toFixed(2)}%）全站流量大，Bot 佔比相對低，但桃園 2025/11 突波仍值得注意。`,
              icon: "🟡",
            },
            {
              title: "風景區小站佔比低，但數據易失真",
              desc: "參山（0.13%）、東海岸（0.32%）等小站 Bot 佔比雖低，但若集中在特定頁面或時段，仍會嚴重扭曲個別報告結論。",
              icon: "⚖️",
            },
          ].map((item, i) => (
            <div key={i} style={{
              background: "rgba(239,68,68,0.04)", border: "1px solid rgba(239,68,68,0.1)",
              borderRadius: 10, padding: "14px 16px",
            }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#fca5a5", marginBottom: 6 }}>{item.icon} {item.title}</div>
              <div style={{ fontSize: 12, color: "#94a3b8", lineHeight: 1.7 }}>{item.desc}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: "20px auto 0", textAlign: "center" }}>
        <p style={{ fontSize: 11, color: "#475569" }}>
          資料來源：Google Analytics 4 ｜ Bot 識別條件：國家=China、管道=Direct ｜ 全站數據：同期間無篩選 ｜ 產出日期：2026/02/04
        </p>
      </div>
    </div>
  );
}