"use client";
import { useState } from "react";

export default function AgentTrace({ result }) {
    if (!result) return null;

    const { extraction, agent_result, ai_extraction, execution_schema, response_schema } = result;
    const [activeTab, setActiveTab] = useState(0);

    const tabs = [
        { label: "🧠 AI Extraction", emoji: "1️⃣", color: "rgba(129, 140, 248, 0.6)" },
        { label: "⚙️ Execution", emoji: "2️⃣", color: "rgba(52, 211, 153, 0.6)" },
        { label: "🖥️ Response", emoji: "3️⃣", color: "rgba(251, 191, 36, 0.6)" },
    ];

    return (
        <div className="animate-fade-in stagger-2 mb-12">
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
                <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-[var(--color-border)]"></div>
                <h3 className="text-[10px] font-bold text-[var(--color-primary)] uppercase tracking-widest px-4 py-1 rounded-full border border-[var(--color-primary)]/30 bg-[var(--color-primary)]/5">
                    3-Schema AI Pipeline
                </h3>
                <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-[var(--color-border)]"></div>
            </div>

            {/* Pipeline Flow Arrow */}
            <div className="flex items-center justify-center gap-2 mb-6">
                <span className="text-xs font-mono text-[var(--color-text-muted)]">🎙️ Voice</span>
                <span className="text-[var(--color-text-muted)] text-xs">→</span>
                <span className="text-xs font-mono text-[var(--color-text-muted)]">📝 Transcript</span>
                <span className="text-[var(--color-text-muted)] text-xs">→</span>
                {tabs.map((tab, i) => (
                    <span key={i} className="flex items-center gap-1">
                        <button
                            onClick={() => setActiveTab(i)}
                            className={`text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full border transition-all duration-300 ${activeTab === i
                                ? "border-[var(--color-primary)] bg-[var(--color-primary)]/10 text-[var(--color-primary)] shadow-[0_0_15px_rgba(99,102,241,0.15)]"
                                : "border-[var(--color-border)] text-[var(--color-text-muted)] hover:border-[var(--color-primary)]/40"
                                }`}
                        >
                            {tab.emoji} {tab.label.split(" ").slice(1).join(" ")}
                        </button>
                        {i < 2 && <span className="text-[var(--color-text-muted)] text-xs mx-1">→</span>}
                    </span>
                ))}
            </div>

            {/* Transcript Section */}
            <div className="mb-6">
                <p className="text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-widest mb-2">📝 Raw Transcript</p>
                <p className="text-sm font-serif italic text-[var(--color-text-secondary)] border-l-2 border-[var(--color-border)] pl-3 py-1">
                    &quot;{result.transcript}&quot;
                </p>
            </div>

            {/* Tab Content */}
            <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] overflow-hidden">
                {/* Tab Header Bar */}
                <div className="flex border-b border-[var(--color-border)]">
                    {tabs.map((tab, i) => (
                        <button
                            key={i}
                            onClick={() => setActiveTab(i)}
                            className={`flex-1 px-4 py-3 text-xs font-bold uppercase tracking-widest transition-all duration-300 ${activeTab === i
                                ? "text-[var(--color-primary)] bg-[var(--color-primary)]/5 border-b-2 border-[var(--color-primary)]"
                                : "text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)]"
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Schema Content */}
                <div className="p-5">
                    {activeTab === 0 && ai_extraction && (
                        <SchemaView
                            title="AI Extraction Schema"
                            subtitle="Raw LLM output — semantic, not DB-safe"
                            color="indigo"
                            data={ai_extraction}
                        />
                    )}
                    {activeTab === 1 && execution_schema && (
                        <SchemaView
                            title="Execution Schema"
                            subtitle="Deterministic agent contract — validated input for backend tools"
                            color="emerald"
                            data={execution_schema}
                        />
                    )}
                    {activeTab === 2 && response_schema && (
                        <ResponseView data={response_schema} />
                    )}
                </div>
            </div>

            {/* Agent Steps */}
            {agent_result?.steps?.length > 0 && (
                <div className="mt-8">
                    <p className="text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-widest mb-4">🔧 Orchestrator Actions</p>
                    <div className="space-y-3">
                        {agent_result.steps.map((step, i) => (
                            <div key={i} className="relative pl-4 border-l border-[var(--color-border-accent)]">
                                <div className={`absolute -left-1.5 top-1.5 w-3 h-3 rounded-full border-2 border-[var(--color-background)] ${step.result?.success === false ? "bg-red-500" : step.result?.success === true ? "bg-emerald-500" : "bg-indigo-500"
                                    }`}></div>
                                <p className="text-sm font-medium tracking-tight text-[var(--color-text)]">{step.action.replace(/_/g, " ")}</p>
                                <p className="text-xs text-[var(--color-text-muted)] mt-0.5">{step.reasoning}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Summary */}
            {agent_result?.summary && (
                <div className="mt-8 text-center">
                    <span className="inline-block text-xs font-bold uppercase tracking-widest text-[#10b981] bg-[#10b981]/10 px-4 py-2 rounded-full border border-[#10b981]/20">
                        {agent_result.summary}
                    </span>
                </div>
            )}
        </div>
    );
}


function SchemaView({ title, subtitle, color, data }) {
    const colorClass = color === "indigo" ? "text-indigo-400" : "text-emerald-400";

    return (
        <div>
            <div className="mb-3">
                <p className={`text-xs font-bold ${colorClass} uppercase tracking-widest`}>{title}</p>
                <p className="text-[10px] text-[var(--color-text-muted)] mt-0.5">{subtitle}</p>
            </div>
            <pre className="font-mono text-xs leading-relaxed text-[var(--color-text-secondary)] bg-[var(--color-background)] rounded-xl p-4 border border-[var(--color-border)] overflow-x-auto whitespace-pre-wrap">
                <JsonHighlight data={data} color={colorClass} />
            </pre>
        </div>
    );
}


function JsonHighlight({ data, color }) {
    if (!data) return <span className="text-[var(--color-text-muted)]">null</span>;

    const json = JSON.stringify(data, null, 2);
    // Highlight keys and values with colors
    const lines = json.split("\n");

    return (
        <code>
            {lines.map((line, i) => {
                // Match JSON key-value patterns
                const keyMatch = line.match(/^(\s*)"([^"]+)"(:)/);
                if (keyMatch) {
                    const [, indent, key, colon] = keyMatch;
                    const rest = line.slice(keyMatch[0].length);
                    return (
                        <div key={i}>
                            <span>{indent}</span>
                            <span className={color}>&quot;{key}&quot;</span>
                            <span>{colon}</span>
                            <ValueHighlight value={rest} />
                        </div>
                    );
                }
                return <div key={i}>{line}</div>;
            })}
        </code>
    );
}


function ValueHighlight({ value }) {
    const trimmed = value.trim();

    // String values
    if (trimmed.startsWith('"')) {
        return <span className="text-amber-300"> {value}</span>;
    }
    // Numbers
    if (/^\s*\d/.test(trimmed)) {
        return <span className="text-cyan-300"> {value}</span>;
    }
    // Booleans
    if (trimmed.startsWith("true") || trimmed.startsWith("false")) {
        return <span className={trimmed.startsWith("true") ? "text-emerald-400" : "text-red-400"}> {value}</span>;
    }
    // null
    if (trimmed.startsWith("null")) {
        return <span className="text-[var(--color-text-muted)]"> {value}</span>;
    }
    return <span> {value}</span>;
}


function ResponseView({ data }) {
    if (!data) return null;

    const checks = [
        { key: "job_logged", label: "Job Logged", icon: "📋" },
        { key: "inventory_updated", label: "Inventory Updated", icon: "📦" },
        { key: "invoice_generated", label: "Invoice Generated", icon: "💰" },
        { key: "followup_scheduled", label: "Follow-up Scheduled", icon: "📅" },
    ];

    return (
        <div>
            <div className="mb-3">
                <p className="text-xs font-bold text-amber-400 uppercase tracking-widest">Response Schema</p>
                <p className="text-[10px] text-[var(--color-text-muted)] mt-0.5">Frontend/UI state — what changed, not how</p>
            </div>

            {/* Status Indicators */}
            <div className="grid grid-cols-2 gap-3 mb-4">
                {checks.map(({ key, label, icon }) => (
                    <div
                        key={key}
                        className={`flex items-center gap-2 p-3 rounded-xl border transition-all ${data[key]
                            ? "border-emerald-500/30 bg-emerald-500/5"
                            : "border-[var(--color-border)] bg-[var(--color-background)] opacity-50"
                            }`}
                    >
                        <span className="text-base">{icon}</span>
                        <span className="text-xs font-medium">{label}</span>
                        <span className="ml-auto text-sm">{data[key] ? "✅" : "—"}</span>
                    </div>
                ))}
            </div>

            {/* Revenue & Follow-up */}
            <div className="grid grid-cols-2 gap-3 mb-4">
                {data.revenue_added > 0 && (
                    <div className="p-3 rounded-xl border border-emerald-500/30 bg-emerald-500/5">
                        <p className="text-[10px] text-[var(--color-text-muted)] uppercase tracking-widest">Revenue Added</p>
                        <p className="text-lg font-mono font-bold text-emerald-400">${data.revenue_added.toFixed(2)}</p>
                    </div>
                )}
                {data.next_followup_date && (
                    <div className="p-3 rounded-xl border border-amber-500/30 bg-amber-500/5">
                        <p className="text-[10px] text-[var(--color-text-muted)] uppercase tracking-widest">Next Follow-up</p>
                        <p className="text-sm font-mono font-bold text-amber-400">{data.next_followup_date}</p>
                    </div>
                )}
            </div>

            {/* Low Stock Alerts */}
            {data.low_stock_items?.length > 0 && (
                <div className="p-3 rounded-xl border border-red-500/30 bg-red-500/5 mb-4">
                    <p className="text-[10px] text-red-400 font-bold uppercase tracking-widest mb-1">⚠️ Low Stock Alert</p>
                    <div className="flex flex-wrap gap-2">
                        {data.low_stock_items.map((item, i) => (
                            <span key={i} className="text-xs px-2 py-0.5 rounded-full bg-red-500/10 text-red-400 border border-red-500/20">{item}</span>
                        ))}
                    </div>
                </div>
            )}

            {/* Job Summary */}
            {data.job_summary && (
                <div className="p-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-background)]">
                    <p className="text-[10px] text-[var(--color-text-muted)] uppercase tracking-widest mb-2">Job Summary</p>
                    <pre className="font-mono text-xs leading-relaxed text-[var(--color-text-secondary)] whitespace-pre-wrap">
                        <JsonHighlight data={data.job_summary} color="text-amber-400" />
                    </pre>
                </div>
            )}
        </div>
    );
}
