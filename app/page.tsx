"use client";

import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle, ArrowDownRight, ArrowUpRight, BarChart3, Bell, CalendarDays,
  Check, ChevronRight, CircleDollarSign, Clock3, Edit3, Filter, Home,
  Lightbulb, List, Menu, Moon, MoreHorizontal, Pencil, Plus, Search, Settings,
  Shield, Sparkles, Sun, Trash2, TrendingDown, TrendingUp, Users, Wallet, X,
  Target, CheckCircle2, XCircle, Share2, Download, BookOpen, ArrowRight
} from "lucide-react";

type Status = "PENDING" | "APPROVED" | "REJECTED" | "PAID";
type Priority = "LOW" | "MEDIUM" | "HIGH" | "EMERGENCY";
type Category = string;

type Request = {
  id: string; name: string; reason: string; amount: number; urgency: Priority;
  status: Status; date: string; category: Category; dueDate?: string; note?: string;
};

type Expense = {
  id: string; description: string; amount: number; category: Category; date: string;
  status: "PAID"; note?: string; sourceRequestId?: string; person?: string;
};

type Upcoming = { id: string; name: string; amount: number; category: Category; dueDate: string; priority: Priority; note?: string; };
type Goal = { id: string; name: string; target: number; saved: number; note?: string; };

type Modal = "request" | "expense" | "upcoming" | "goal" | "budget" | "income" | null;
type Tab = "home" | "expenses" | "requests" | "budget" | "more";

const REL = ["Mum", "Dad", "Brother", "Sister", "Uncle", "Aunty", "Cousin", "Wife", "Husband", "Other"];
const CATS = ["Food", "Transport", "Housing", "Utilities", "Education", "Health", "Airtime & Data", "Shopping", "Family", "Business", "Entertainment", "Other"];
const PRIORITIES: Priority[] = ["LOW", "MEDIUM", "HIGH", "EMERGENCY"];
const money = (n: number) => `₦${Math.max(0, Math.round(n)).toLocaleString("en-NG")}`;
const uid = () => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
const today = () => { const d = new Date(); const local = new Date(d.getTime() - d.getTimezoneOffset() * 60000); return local.toISOString().slice(0, 10); };
const daysUntil = (date: string) => Math.ceil((new Date(`${date}T23:59:59`).getTime() - Date.now()) / 86400000);


export default function Page() {
  const [theme, setTheme] = useState("dark");
  const [income, setIncome] = useState(0);
  const [budget, setBudget] = useState(0);
  const [hydrated, setHydrated] = useState(false);
  const [reqs, setReqs] = useState<Request[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [upcoming, setUpcoming] = useState<Upcoming[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [tab, setTab] = useState<Tab>("home");
  const [modal, setModal] = useState<Modal>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", reason: "", amount: "", urgency: "MEDIUM" as Priority, category: "Family", dueDate: "", note: "" });
  const [expenseForm, setExpenseForm] = useState({ description: "", amount: "", category: "Food", date: today(), note: "" });
  const [upcomingForm, setUpcomingForm] = useState({ name: "", amount: "", category: "Education", dueDate: today(), priority: "HIGH" as Priority, note: "" });
  const [goalForm, setGoalForm] = useState({ name: "", target: "", saved: "" });
  const [showGuide, setShowGuide] = useState(false);
  const [guideStep, setGuideStep] = useState(0);
  const [installPrompt, setInstallPrompt] = useState<any>(null);
  const [installHelp, setInstallHelp] = useState(false);

  useEffect(() => {
    const get = (key: string) => localStorage.getItem(key);
    const parseNumber = (value: string | null) => {
      if (value === null) return 0;
      try {
        const parsed = Number(JSON.parse(value));
        return Number.isFinite(parsed) && parsed >= 0 ? parsed : 0;
      } catch { return 0; }
    };

    const st = get("wahala-theme"); if (st === "light" || st === "dark") setTheme(st);
    setBudget(parseNumber(get("wahala-budget")));
    setIncome(parseNumber(get("wahala-income")));

    const sr = get("wahala-reqs");
    if (sr) {
      try {
        const parsed = JSON.parse(sr);
        setReqs(Array.isArray(parsed) ? parsed.map((r: Request) => ({ ...r, category: r.category || "Family", urgency: r.urgency || "MEDIUM" })) : []);
      } catch { setReqs([]); }
    } else setReqs([]);

    const se = get("wahala-expenses");
    if (se) { try { const parsed = JSON.parse(se); setExpenses(Array.isArray(parsed) ? parsed : []); } catch { setExpenses([]); } }
    else setExpenses([]);

    const su = get("wahala-upcoming");
    if (su) { try { const parsed = JSON.parse(su); setUpcoming(Array.isArray(parsed) ? parsed : []); } catch { setUpcoming([]); } }
    else setUpcoming([]);

    const sg = get("wahala-goals");
    if (sg) { try { const parsed = JSON.parse(sg); setGoals(Array.isArray(parsed) ? parsed : []); } catch { setGoals([]); } }
    else setGoals([]);

    setHydrated(true);
    if (!localStorage.getItem("wahala-guide-complete")) setShowGuide(true);
  }, []);

  useEffect(() => {
    const onBeforeInstall = (event: Event) => {
      event.preventDefault();
      setInstallPrompt(event);
    };
    const onInstalled = () => { setInstallPrompt(null); setInstallHelp(false); };
    window.addEventListener("beforeinstallprompt", onBeforeInstall);
    window.addEventListener("appinstalled", onInstalled);
    if ("serviceWorker" in navigator && process.env.NODE_ENV === "production") {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    }
    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstall);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    document.body.classList.toggle("light-mode", theme !== "dark");
    if (hydrated) localStorage.setItem("wahala-theme", theme);
  }, [theme, hydrated]);
  useEffect(() => { if (hydrated) localStorage.setItem("wahala-income", JSON.stringify(income)); }, [income, hydrated]);
  useEffect(() => { if (hydrated) localStorage.setItem("wahala-budget", JSON.stringify(budget)); }, [budget, hydrated]);
  useEffect(() => { if (hydrated) localStorage.setItem("wahala-reqs", JSON.stringify(reqs)); }, [reqs, hydrated]);
  useEffect(() => { if (hydrated) localStorage.setItem("wahala-expenses", JSON.stringify(expenses)); }, [expenses, hydrated]);
  useEffect(() => { if (hydrated) localStorage.setItem("wahala-upcoming", JSON.stringify(upcoming)); }, [upcoming, hydrated]);
  useEffect(() => { if (hydrated) localStorage.setItem("wahala-goals", JSON.stringify(goals)); }, [goals, hydrated]);

  // Migrate legacy PAID requests into the expense ledger once, without double counting.
  useEffect(() => {
    if (!reqs.length) return;
    setExpenses(current => {
      const next = [...current];
      reqs.filter(r => r.status === "PAID").forEach(r => {
        if (!next.some(e => e.sourceRequestId === r.id)) next.push({ id: `req-${r.id}`, description: r.reason, amount: r.amount, category: r.category, date: r.date, status: "PAID", sourceRequestId: r.id, person: r.name });
      });
      return next;
    });
  }, [reqs]);

  const spent = useMemo(() => expenses.reduce((s, e) => s + e.amount, 0), [expenses]);
  const pending = useMemo(() => reqs.filter(r => r.status === "PENDING" || r.status === "APPROVED").reduce((s, r) => s + r.amount, 0), [reqs]);
  const moneyRemaining = income - spent;
  const budgetPct = budget > 0 ? Math.round((spent / budget) * 100) : 0;
  const budgetRemaining = budget - spent;
  const upcomingTotal = upcoming.reduce((s, x) => s + x.amount, 0);
  const overdue = upcoming.filter(x => daysUntil(x.dueDate) < 0).reduce((s, x) => s + x.amount, 0);
  const committed = pending + upcomingTotal;

  const wahala = useMemo(() => {
    // A brand-new user should see a neutral starting state, not an artificial warning.
    if (income === 0 && budget === 0 && spent === 0 && pending === 0 && upcomingTotal === 0 && overdue === 0) {
      return { label: "LOW", emoji: "🟢", tone: "green", text: "No wahala yet. Add your income, bills, or expenses to start tracking." };
    }
    let score = 0;
    if (budgetPct >= 100) score += 45; else if (budgetPct >= 85) score += 32; else if (budgetPct >= 65) score += 20; else if (budgetPct >= 40) score += 10;
    if (income <= 0) score += 30; else if (spent > income) score += 35; else if (spent / income >= .8) score += 25; else if (spent / income >= .6) score += 12;
    if (pending > 0) score += pending > income * .2 ? 18 : 8;
    if (upcomingTotal > Math.max(0, moneyRemaining)) score += 20;
    if (overdue > 0) score += 15;
    if (score >= 70) return { label: "CRITICAL", emoji: "🔴", tone: "red", text: "Your upcoming commitments may put serious pressure on your available money." };
    if (score >= 45) return { label: "HIGH", emoji: "🟠", tone: "orange", text: "You're spending fast and still have important commitments ahead." };
    if (score >= 25) return { label: "MEDIUM", emoji: "🟡", tone: "amber", text: "You're okay for now, but your spending needs attention." };
    return { label: "LOW", emoji: "🟢", tone: "green", text: "You're comfortably within your current plan." };
  }, [budgetPct, income, spent, pending, upcomingTotal, overdue, moneyRemaining]);

  const filteredExpenses = useMemo(() => expenses.filter(e => (categoryFilter === "All" || e.category === categoryFilter) && (`${e.description} ${e.category} ${e.person || ""}`).toLowerCase().includes(search.toLowerCase())).sort((a,b) => b.date.localeCompare(a.date)), [expenses, categoryFilter, search]);
  const history = [...expenses].sort((a,b) => b.date.localeCompare(a.date)).slice(0, 5);
  const categoryTotals = useMemo(() => CATS.map(c => ({ name: c, amount: expenses.filter(e => e.category === c).reduce((s,e) => s+e.amount,0) })).filter(x => x.amount > 0).sort((a,b) => b.amount-a.amount), [expenses]);
  const biggestCategory = categoryTotals[0];
  const topUpcoming = [...upcoming].sort((a,b) => a.dueDate.localeCompare(b.dueDate)).slice(0, 4);
  const goalTotal = goals.reduce((s,g) => s+g.target, 0);
  const goalSaved = goals.reduce((s,g) => s+g.saved, 0);

  const insights = useMemo(() => {
    const out: string[] = [];
    if (income > 0) out.push(`You've spent ${Math.min(999, Math.round((spent / income) * 100))}% of your monthly income.`);
    if (biggestCategory) out.push(`${biggestCategory.name} is your biggest spending category at ${money(biggestCategory.amount)}.`);
    if (moneyRemaining >= 0) out.push(`You have ${money(moneyRemaining)} available after paid expenses.`); else out.push(`You've spent ${money(Math.abs(moneyRemaining))} more than your income.`);
    if (upcomingTotal > Math.max(0, moneyRemaining)) out.push(`Your upcoming wahala is ${money(upcomingTotal)} — more than your current available money.`);
    if (budget > 0 && spent > budget) out.push(`You've exceeded your monthly budget by ${money(spent-budget)}.`);
    if (!out.length) out.push("Add your income and first expense to unlock useful money insights.");
    return out.slice(0, 4);
  }, [income, spent, biggestCategory, moneyRemaining, upcomingTotal, budget]);

  const closeModal = () => { setModal(null); setEditingId(null); };
  const openRequest = (r?: Request) => {
    if (r) { setEditingId(r.id); setForm({ name:r.name, reason:r.reason, amount:String(r.amount), urgency:r.urgency, category:r.category, dueDate:r.dueDate || "", note:r.note || "" }); }
    else { setEditingId(null); setForm({name:"",reason:"",amount:"",urgency:"MEDIUM",category:"Family",dueDate:"",note:""}); }
    setModal("request");
  };
  const saveRequest = () => {
    const amount = Number(form.amount); if (!form.reason.trim() || !amount || amount <= 0) return;
    const base: Request = { id: editingId || uid(), name:form.name, reason:form.reason.trim(), amount, urgency:form.urgency, status: editingId ? (reqs.find(r=>r.id===editingId)?.status || "PENDING") : "PENDING", date: editingId ? (reqs.find(r=>r.id===editingId)?.date || new Date().toISOString()) : new Date().toISOString(), category:form.category, dueDate:form.dueDate || undefined, note:form.note || undefined };
    setReqs(v => editingId ? v.map(r => r.id === editingId ? base : r) : [base, ...v]); closeModal();
  };
  const togglePaid = (r: Request) => {
    if (r.status === "PAID") {
      setExpenses(v => v.filter(e => e.sourceRequestId !== r.id));
      setReqs(v => v.map(x => x.id === r.id ? {...x,status:"PENDING"} : x));
    } else {
      const expense: Expense = { id:`req-${r.id}`, description:r.reason, amount:r.amount, category:r.category, date:new Date().toISOString(), status:"PAID", sourceRequestId:r.id, person:r.name };
      setExpenses(v => v.some(e=>e.sourceRequestId===r.id) ? v : [expense, ...v]);
      setReqs(v => v.map(x => x.id === r.id ? {...x,status:"PAID"} : x));
    }
  };
  const deleteRequest = (id:string) => { setReqs(v=>v.filter(r=>r.id!==id)); setExpenses(v=>v.filter(e=>e.sourceRequestId!==id)); };
  const saveExpense = () => { const amount=Number(expenseForm.amount); if(!expenseForm.description.trim()||!amount) return; const item:Expense={id:editingId||uid(),description:expenseForm.description.trim(),amount,category:expenseForm.category,date:expenseForm.date,status:"PAID",note:expenseForm.note||undefined}; setExpenses(v=>editingId?v.map(e=>e.id===editingId?item:e):[item,...v]); closeModal(); };
  const openExpense = (e?:Expense) => { if(e){setEditingId(e.id);setExpenseForm({description:e.description,amount:String(e.amount),category:e.category,date:e.date.slice(0,10),note:e.note||""});}else{setEditingId(null);setExpenseForm({description:"",amount:"",category:"Food",date:today(),note:""});} setModal("expense"); };
  const saveUpcoming = () => { const amount=Number(upcomingForm.amount); if(!upcomingForm.name.trim()||!amount) return; setUpcoming(v=>editingId?v.map(x=>x.id===editingId?{...x,id:editingId,name:upcomingForm.name,amount,category:upcomingForm.category,dueDate:upcomingForm.dueDate,priority:upcomingForm.priority,note:upcomingForm.note}:x):[{id:uid(),name:upcomingForm.name,amount,category:upcomingForm.category,dueDate:upcomingForm.dueDate,priority:upcomingForm.priority,note:upcomingForm.note},...v]); closeModal(); };
  const saveGoal = () => { const target=Number(goalForm.target), saved=Number(goalForm.saved)||0; if(!goalForm.name.trim()||!target) return; setGoals(v=>editingId?v.map(g=>g.id===editingId?{...g,name:goalForm.name,target,saved}:g):[...v,{id:uid(),name:goalForm.name,target,saved}]); closeModal(); };
  const share = () => { const text=`Family Wahala OS — Income ${money(income)}, Spent ${money(spent)}, Pending ${money(pending)}, Remaining ${money(moneyRemaining)}, Wahala ${wahala.label}`; window.open(`https://wa.me/?text=${encodeURIComponent(text)}`,"_blank"); };
  const finishGuide = (dontShowAgain = true) => {
    if (dontShowAgain) localStorage.setItem("wahala-guide-complete", "1");
    setShowGuide(false); setGuideStep(0);
  };
  const handleInstall = async () => {
    if (installPrompt) {
      await installPrompt.prompt();
      try { await installPrompt.userChoice; } finally { setInstallPrompt(null); }
    } else setInstallHelp(true);
  };
  const guideItems = [
    { title: "Your Dashboard", text: "Get a quick view of your income, paid expenses, pending family requests and overall Wahala Level. Add your income and budget to make the insights more useful.", icon: Home },
    { title: "Expenses", text: "Record money you have already spent, organise it by category and review where your money goes. Use search and filters to find records.", icon: List },
    { title: "Family Requests", text: "Track money requests from family members, set priorities and due dates, and mark a request as paid when you have settled it.", icon: Users },
    { title: "Budget & Goals", text: "Set your monthly income and spending budget, monitor progress, and create savings goals with a target amount.", icon: Target },
    { title: "More Tools", text: "Share a money snapshot and switch between light and dark appearance. Your records are currently saved in this browser on this device.", icon: Settings },
  ];

  const nav = [{id:"home",label:"Home",icon:Home},{id:"expenses",label:"Expenses",icon:List},{id:"requests",label:"Requests",icon:Users},{id:"budget",label:"Budget",icon:BarChart3},{id:"more",label:"More",icon:MoreHorizontal}] as const;
  const pageTitle = tab === "home" ? "Your money at a glance" : tab === "expenses" ? "Expenses" : tab === "requests" ? "Family Requests" : tab === "budget" ? "Budget & Goals" : "More tools";
  const wahalaBorder = wahala.tone === "green" ? "border-emerald-500/20" : wahala.tone === "red" ? "border-red-500/20" : wahala.tone === "orange" ? "border-orange-500/20" : "border-amber-500/20";

  return <div className={`min-h-screen pb-24 md:pb-8 ${theme === "dark" ? "bg-[#080d0b] text-zinc-100" : "bg-[#f7f8f6] text-zinc-900"}`}>
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5 md:py-8">
      <header className="flex items-center justify-between gap-4 mb-7">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-[#075c46] flex items-center justify-center shadow-lg shadow-emerald-950/30"><Shield size={22}/></div>
          <div><h1 className="text-2xl sm:text-3xl font-black tracking-tight text-emerald-300">Family Wahala OS</h1><p className="text-xs sm:text-sm text-zinc-400">Black Tax Budget Tracker</p></div>
        </div>
        <div className="flex items-center gap-2">
          <button aria-label="Install Family Wahala OS" title="Install app" onClick={handleInstall} className="mini-btn"><Download size={16}/><span className="hidden sm:inline">Install app</span></button>
          <button aria-label="Open app guide" title="App guide" onClick={()=>{setGuideStep(0);setShowGuide(true)}} className="icon-btn"><BookOpen size={18}/></button>
          <button aria-label="Toggle theme" onClick={()=>setTheme(theme==="dark"?"light":"dark")} className="icon-btn">{theme==="dark"?<Sun size={18}/>:<Moon size={18}/>}</button>
          <button onClick={share} className="hidden sm:flex items-center gap-2 px-3 py-2.5 rounded-xl border border-zinc-700 bg-zinc-900 text-sm"><Share2 size={16}/>Share</button>
          <button onClick={()=>openRequest()} className="primary-btn"><Plus size={17}/> <span className="hidden sm:inline">New Request</span><span className="sm:hidden">Request</span></button>
        </div>
      </header>

      {installHelp && <div className="card p-4 mb-5 border-emerald-700/50"><div className="flex items-start justify-between gap-3"><div><p className="font-semibold">Install Family Wahala OS</p><p className="text-sm text-zinc-400 mt-1">In Chrome, open the ⋮ menu and choose <strong>Install app</strong> or <strong>Add to Home screen</strong>. If the option is missing, open the deployed HTTPS website in Chrome and try again after it finishes loading.</p></div><button className="icon-btn shrink-0" aria-label="Close install instructions" onClick={()=>setInstallHelp(false)}><X size={16}/></button></div></div>}

      <div className="mb-6 flex items-center justify-between gap-3">
        <div><p className="text-xs uppercase tracking-[.18em] text-emerald-400 font-bold">Dashboard</p><h2 className="text-xl sm:text-2xl font-bold mt-1">{pageTitle}</h2></div>
        <div className="relative md:hidden"><button className="icon-btn" onClick={()=>setMenuOpen(v=>!v)}><Menu size={19}/></button>{menuOpen&&<div className="absolute right-0 top-12 z-40 w-48 card p-2">{nav.map(n=><button key={n.id} onClick={()=>{setTab(n.id);setMenuOpen(false)}} className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-zinc-800 text-left"><n.icon size={17}/>{n.label}</button>)}</div>}</div>
      </div>

      {tab === "home" && <>
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          <Stat title="Income This Month" value={money(income)} icon={<Wallet size={15}/>} action={()=>setModal("income")} />
          <Stat title="Spent (Paid)" value={money(spent)} tone="green" icon={<ArrowDownRight size={15}/>} />
          <Stat title="Pending" value={money(pending)} tone="red" icon={<Clock3 size={15}/>} />
          <Stat title="Wahala Level" value={`${wahala.label} ${wahala.emoji}`} tone={wahala.tone as any} icon={<AlertTriangle size={15}/>} />
        </section>

        <section className="grid lg:grid-cols-[1.4fr_.8fr] gap-4 mb-6">
          <div className="card p-5 sm:p-6">
            <div className="flex items-start justify-between gap-4"><div><p className="section-kicker">Monthly budget</p><div className="flex items-center gap-2 mt-1"><h3 className="text-2xl sm:text-3xl font-black">{money(budget)}</h3><button className="mini-btn" onClick={()=>setModal("budget")}><Pencil size={13}/>Edit</button></div></div><span className={`badge ${budgetPct>=100?"badge-red":budgetPct>=75?"badge-orange":"badge-green"}`}>{budgetPct}% used</span></div>
            <div className="progress mt-5"><div style={{width:`${Math.min(100,Math.max(0,budgetPct))}%`}} className={`progress-fill ${budgetPct>=100?"danger":budgetPct>=75?"warn":""}`}/></div>
            <div className="flex justify-between text-sm mt-3"><span className="text-zinc-400">{money(spent)} spent</span><span className={budgetRemaining<0?"text-red-400":"text-zinc-300"}>{budgetRemaining<0?`${money(Math.abs(budgetRemaining))} over budget`: `${money(budgetRemaining)} remaining`}</span></div>
          </div>
          <div className={`card p-5 sm:p-6 ${wahalaBorder}`}>
            <div className="flex justify-between items-start"><div><p className="section-kicker">Wahala Level</p><h3 className="text-2xl font-black mt-1">{wahala.emoji} {wahala.label}</h3></div><Sparkles className="text-amber-400" size={20}/></div>
            <p className="text-sm text-zinc-400 mt-3 leading-6">{wahala.text}</p>
            {committed>0&&<div className="mt-4 rounded-xl soft-panel border border-zinc-800 p-3 text-xs text-zinc-400">Pending + upcoming: <strong className="text-zinc-100">{money(committed)}</strong></div>}
          </div>
        </section>

        <section className="grid lg:grid-cols-3 gap-4 mb-6">
          <div className="card p-5 lg:col-span-2">
            <div className="flex items-center justify-between mb-4"><div><p className="section-kicker">Coming up</p><h3 className="text-lg font-bold">Upcoming Wahala</h3></div><button className="mini-btn" onClick={()=>{setEditingId(null);setUpcomingForm({name:"",amount:"",category:"Education",dueDate:today(),priority:"HIGH",note:""});setModal("upcoming")}}><Plus size={14}/>Add</button></div>
            {topUpcoming.length===0?<Empty title="Nothing scary on the calendar yet 😌" text="Add an upcoming bill so Family Wahala OS can warn you before it hits."/>:<div className="space-y-2">{topUpcoming.map(u=><UpcomingRow key={u.id} item={u} onDelete={()=>setUpcoming(v=>v.filter(x=>x.id!==u.id))}/>)}</div>}
          </div>
          <div className="card p-5"><p className="section-kicker">Money insights</p><h3 className="text-lg font-bold mb-4">What your money is saying</h3><div className="space-y-3">{insights.map((x,i)=><div key={i} className="flex gap-3 p-3 rounded-xl soft-panel border border-zinc-800"><Lightbulb size={16} className="text-amber-400 shrink-0 mt-0.5"/><p className="text-sm leading-5 text-zinc-300">{x}</p></div>)}</div></div>
        </section>

        <section className="grid lg:grid-cols-2 gap-4 mb-6">
          <div className="card overflow-hidden"><div className="p-5 flex items-center justify-between"><div><p className="section-kicker">Family</p><h3 className="text-lg font-bold">Requests</h3></div><button className="text-sm text-emerald-300" onClick={()=>setTab("requests")}>View all</button></div>{reqs.slice(0,3).map(r=><RequestRow key={r.id} r={r} onPaid={()=>togglePaid(r)} onEdit={()=>openRequest(r)} onDelete={()=>deleteRequest(r.id)}/>)}{!reqs.length&&<Empty title="Peace in the family... for now 😂" text="Create a request when the next wahala arrives."/>}</div>
          <div className="card p-5"><div className="flex items-center justify-between mb-4"><div><p className="section-kicker">Spending</p><h3 className="text-lg font-bold">Where Your Money Went</h3></div><button className="text-sm text-emerald-300" onClick={()=>setTab("expenses")}>View details</button></div>{categoryTotals.length===0?<Empty title="No expenses yet" text="Once you record your first expense, your spending breakdown will appear here."/>:<div className="space-y-3">{categoryTotals.slice(0,5).map(c=><div key={c.name}><div className="flex justify-between text-sm mb-1"><span>{c.name}</span><span className="text-zinc-400">{money(c.amount)}</span></div><div className="progress h-2"><div className="progress-fill" style={{width:`${Math.round((c.amount/Math.max(1,spent))*100)}%`}}/></div></div>)}</div>}</div>
        </section>

        <section className="card p-5 mb-6"><div className="flex items-center justify-between mb-4"><div><p className="section-kicker">Goals</p><h3 className="text-lg font-bold">Savings Goals</h3></div><button className="mini-btn" onClick={()=>{setEditingId(null);setGoalForm({name:"",target:"",saved:""});setModal("goal")}}><Plus size={14}/>Goal</button></div>{goals.length===0?<Empty title="Give your money somewhere to go." text="Create a savings goal for emergencies, school fees, rent or anything important."/>:<div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">{goals.map(g=><GoalCard key={g.id} g={g} onDelete={()=>setGoals(v=>v.filter(x=>x.id!==g.id))}/>)}</div>}</section>
      </>}

      {tab === "expenses" && <ExpensesPage expenses={filteredExpenses} search={search} setSearch={setSearch} category={categoryFilter} setCategory={setCategoryFilter} onAdd={()=>openExpense()} onEdit={openExpense} onDelete={id=>setExpenses(v=>v.filter(e=>e.id!==id))} />}
      {tab === "requests" && <RequestsPage reqs={reqs} onAdd={()=>openRequest()} onEdit={openRequest} onDelete={deleteRequest} onPaid={togglePaid} />}
      {tab === "budget" && <BudgetPage income={income} budget={budget} spent={spent} moneyRemaining={moneyRemaining} budgetPct={budgetPct} goals={goals} onIncome={()=>setModal("income")} onBudget={()=>setModal("budget")} onGoal={()=>{setEditingId(null);setGoalForm({name:"",target:"",saved:""});setModal("goal")}} onDeleteGoal={id=>setGoals(v=>v.filter(g=>g.id!==id))} />}
      {tab === "more" && <MorePage onShare={share} onTheme={()=>setTheme(theme==="dark"?"light":"dark")} theme={theme} />}

      <div className="hidden md:flex fixed bottom-6 left-1/2 -translate-x-1/2 z-30 p-1.5 rounded-2xl border backdrop-blur shadow-2xl desktop-nav">{nav.map(n=><button key={n.id} onClick={()=>setTab(n.id)} className={`nav-btn ${tab===n.id?"active":""}`}><n.icon size={17}/>{n.label}</button>)}</div>
    </div>

    <div className="mobile-nav md:hidden">{nav.map(n=><button key={n.id} onClick={()=>setTab(n.id)} className={tab===n.id?"active":""}><n.icon size={18}/><span>{n.label}</span></button>)}</div>

    {showGuide && <div className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"><div role="dialog" aria-modal="true" aria-labelledby="guide-title" className="w-full max-w-lg rounded-3xl border border-zinc-700 bg-[#0b1210] text-zinc-100 shadow-2xl overflow-hidden"><div className="p-6 sm:p-7"><div className="flex items-center justify-between"><span className="text-xs font-bold tracking-[.18em] uppercase text-emerald-400">Quick start · {guideStep+1} of {guideItems.length}</span><button onClick={()=>finishGuide(true)} className="icon-btn" aria-label="Close guide"><X size={18}/></button></div><div className="mt-6 w-14 h-14 rounded-2xl bg-emerald-950 border border-emerald-800 flex items-center justify-center text-emerald-300">{(() => { const GuideIcon = guideItems[guideStep].icon; return <GuideIcon size={26}/>; })()}</div><h2 id="guide-title" className="text-2xl font-black mt-5">{guideItems[guideStep].title}</h2><p className="text-sm sm:text-base leading-7 text-zinc-300 mt-3">{guideItems[guideStep].text}</p><div className="flex gap-1.5 mt-6">{guideItems.map((item,i)=><span key={item.title} className={`h-1.5 rounded-full flex-1 ${i===guideStep?"bg-emerald-400":"bg-zinc-700"}`}/>)}</div><div className="flex items-center justify-between gap-3 mt-7"><button onClick={()=>guideStep===0?finishGuide(true):setGuideStep(v=>v-1)} className="secondary-btn">{guideStep===0?"Skip guide":"Back"}</button><button onClick={()=>guideStep===guideItems.length-1?finishGuide(true):setGuideStep(v=>v+1)} className="primary-btn">{guideStep===guideItems.length-1?"Get started":"Next"}<ArrowRight size={16}/></button></div><button onClick={()=>finishGuide(true)} className="w-full text-xs text-zinc-500 hover:text-zinc-300 mt-4">Don’t show this automatically again</button></div></div></div>}

    {modal && <ModalShell title={modal==="request"?(editingId?"Edit Request":"New Request"):modal==="expense"?(editingId?"Edit Expense":"Add Expense"):modal==="upcoming"?"Upcoming Wahala":modal==="goal"?(editingId?"Edit Savings Goal":"New Savings Goal"):modal==="budget"?"Monthly Budget":"Monthly Income"} onClose={closeModal}>
      {modal==="request"&&<FormGrid><Field label="Who is requesting"><select value={form.name} onChange={e=>setForm({...form,name:e.target.value})} className="input">{REL.map(x=><option key={x}>{x}</option>)}</select></Field><Field label="Request title"><input autoFocus value={form.reason} onChange={e=>setForm({...form,reason:e.target.value})} className="input" placeholder="School fees"/></Field><Field label="Amount"><input type="number" value={form.amount} onChange={e=>setForm({...form,amount:e.target.value})} className="input" placeholder="20000"/></Field><Field label="Category"><select value={form.category} onChange={e=>setForm({...form,category:e.target.value})} className="input">{CATS.map(x=><option key={x}>{x}</option>)}</select></Field><Field label="Priority"><select value={form.urgency} onChange={e=>setForm({...form,urgency:e.target.value as Priority})} className="input">{PRIORITIES.map(x=><option key={x}>{x}</option>)}</select></Field><Field label="Due date"><input type="date" value={form.dueDate} onChange={e=>setForm({...form,dueDate:e.target.value})} className="input"/></Field><Field label="Note" full><textarea value={form.note} onChange={e=>setForm({...form,note:e.target.value})} className="input min-h-20" placeholder="Optional note"/></Field><ModalButtons onCancel={closeModal} onSave={saveRequest} label={editingId?"Save Changes":"Create Request"}/></FormGrid>}
      {modal==="expense"&&<FormGrid><Field label="Description" full><input autoFocus value={expenseForm.description} onChange={e=>setExpenseForm({...expenseForm,description:e.target.value})} className="input" placeholder="Groceries"/></Field><Field label="Amount"><input type="number" value={expenseForm.amount} onChange={e=>setExpenseForm({...expenseForm,amount:e.target.value})} className="input" placeholder="5000"/></Field><Field label="Category"><select value={expenseForm.category} onChange={e=>setExpenseForm({...expenseForm,category:e.target.value})} className="input">{CATS.map(x=><option key={x}>{x}</option>)}</select></Field><Field label="Date"><input type="date" value={expenseForm.date} onChange={e=>setExpenseForm({...expenseForm,date:e.target.value})} className="input"/></Field><Field label="Note" full><textarea value={expenseForm.note} onChange={e=>setExpenseForm({...expenseForm,note:e.target.value})} className="input min-h-20"/></Field><ModalButtons onCancel={closeModal} onSave={saveExpense} label={editingId?"Save Changes":"Add Expense"}/></FormGrid>}
      {modal==="upcoming"&&<FormGrid><Field label="What is coming?"><input autoFocus value={upcomingForm.name} onChange={e=>setUpcomingForm({...upcomingForm,name:e.target.value})} className="input" placeholder="School fees"/></Field><Field label="Amount"><input type="number" value={upcomingForm.amount} onChange={e=>setUpcomingForm({...upcomingForm,amount:e.target.value})} className="input" placeholder="100000"/></Field><Field label="Category"><select value={upcomingForm.category} onChange={e=>setUpcomingForm({...upcomingForm,category:e.target.value})} className="input">{CATS.map(x=><option key={x}>{x}</option>)}</select></Field><Field label="Due date"><input type="date" value={upcomingForm.dueDate} onChange={e=>setUpcomingForm({...upcomingForm,dueDate:e.target.value})} className="input"/></Field><Field label="Priority"><select value={upcomingForm.priority} onChange={e=>setUpcomingForm({...upcomingForm,priority:e.target.value as Priority})} className="input">{PRIORITIES.map(x=><option key={x}>{x}</option>)}</select></Field><Field label="Note"><input value={upcomingForm.note} onChange={e=>setUpcomingForm({...upcomingForm,note:e.target.value})} className="input"/></Field><ModalButtons onCancel={closeModal} onSave={saveUpcoming} label="Save Upcoming Wahala"/></FormGrid>}
      {modal==="goal"&&<FormGrid><Field label="Goal name"><input autoFocus value={goalForm.name} onChange={e=>setGoalForm({...goalForm,name:e.target.value})} className="input" placeholder="Emergency Fund"/></Field><Field label="Target amount"><input type="number" value={goalForm.target} onChange={e=>setGoalForm({...goalForm,target:e.target.value})} className="input" placeholder="200000"/></Field><Field label="Already saved"><input type="number" value={goalForm.saved} onChange={e=>setGoalForm({...goalForm,saved:e.target.value})} className="input" placeholder="80000"/></Field><ModalButtons onCancel={closeModal} onSave={saveGoal} label={editingId?"Save Goal":"Create Goal"}/></FormGrid>}
      {modal==="budget"&&<FormGrid><Field label="Monthly budget"><input autoFocus type="number" value={budget} onChange={e=>setBudget(Number(e.target.value)||0)} className="input text-xl font-bold"/></Field><div className="rounded-xl bg-zinc-950 border border-zinc-800 p-4 text-sm text-zinc-400">Current usage: <strong className="text-zinc-100">{budgetPct}%</strong> · Remaining: <strong className={budgetRemaining<0?"text-red-400":"text-emerald-300"}>{budgetRemaining<0?money(Math.abs(budgetRemaining))+" over":money(budgetRemaining)}</strong></div><ModalButtons onCancel={closeModal} onSave={closeModal} label="Done"/></FormGrid>}
      {modal==="income"&&<FormGrid><Field label="Monthly income"><input autoFocus type="number" value={income} onChange={e=>setIncome(Number(e.target.value)||0)} className="input text-xl font-bold"/></Field><div className="rounded-xl bg-zinc-950 border border-zinc-800 p-4 text-sm text-zinc-400">Available after paid expenses: <strong className={moneyRemaining<0?"text-red-400":"text-emerald-300"}>{money(moneyRemaining)}</strong></div><ModalButtons onCancel={closeModal} onSave={closeModal} label="Done"/></FormGrid>}
    </ModalShell>}
  </div>;
}

function Stat({title,value,icon,tone="default",action}:{title:string;value:string;icon:React.ReactNode;tone?:string;action?:()=>void}){return <div onClick={action} className={`stat-card ${action?"cursor-pointer":""}`}><div className={`text-xs flex items-center gap-1 ${tone==="green"?"text-emerald-400":tone==="red"?"text-red-400":tone==="orange"?"text-orange-400":tone==="amber"?"text-amber-400":"text-zinc-400"}`}>{icon}{title}</div><div className="text-xl sm:text-2xl font-black mt-2">{value}</div></div>}
function RequestRow({r,onPaid,onEdit,onDelete}:{r:Request;onPaid:()=>void;onEdit:()=>void;onDelete:()=>void}){return <div className="list-row"><div className="flex items-center gap-3 min-w-0"><div className="avatar">{r.name[0]}</div><div className="min-w-0"><div className="font-semibold truncate">{r.name} · {r.reason}</div><div className="text-xs text-zinc-500 mt-1">{r.category} · {r.urgency} · {r.status}</div></div></div><div className="flex items-center gap-2 shrink-0"><strong>{money(r.amount)}</strong><button onClick={onEdit} className="icon-small"><Edit3 size={14}/></button><button onClick={onPaid} className={`icon-small ${r.status==="PAID"?"bg-emerald-600 text-white border-emerald-500":""}`}><Check size={14}/></button><button onClick={onDelete} className="icon-small"><Trash2 size={14}/></button></div></div>}
function UpcomingRow({item,onDelete}:{item:Upcoming;onDelete:()=>void}){const d=daysUntil(item.dueDate);return <div className="list-row rounded-xl border border-zinc-800 soft-panel"><div className="flex items-center gap-3"><div className={`priority-dot ${item.priority.toLowerCase()}`}/><div><div className="font-semibold">{item.name}</div><div className="text-xs text-zinc-500 mt-1">{item.category} · {d<0?`Overdue by ${Math.abs(d)} days`:d===0?"Due today":`Due in ${d} days`}</div></div></div><div className="flex items-center gap-3"><strong>{money(item.amount)}</strong><button onClick={onDelete} className="icon-small"><Trash2 size={14}/></button></div></div>}
function GoalCard({g,onDelete}:{g:Goal;onDelete:()=>void}){const pct=Math.min(100,Math.round((g.saved/Math.max(1,g.target))*100));return <div className="rounded-2xl border border-zinc-800 soft-panel p-4"><div className="flex justify-between gap-2"><div className="font-semibold">{g.name}</div><button className="text-zinc-500" onClick={onDelete}><Trash2 size={14}/></button></div><div className="text-sm text-zinc-400 mt-2">{money(g.saved)} / {money(g.target)}</div><div className="progress h-2 mt-3"><div className="progress-fill" style={{width:`${pct}%`}}/></div><div className="text-xs text-zinc-500 mt-2">{pct}% complete</div></div>}
function Empty({title,text}:{title:string;text:string}){return <div className="empty"><div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center"><Sparkles size={17} className="text-emerald-400"/></div><div><p className="font-semibold">{title}</p><p className="text-sm text-zinc-500 mt-1">{text}</p></div></div>}
function ExpensesPage({expenses,search,setSearch,category,setCategory,onAdd,onEdit,onDelete}:{expenses:Expense[];search:string;setSearch:(v:string)=>void;category:string;setCategory:(v:string)=>void;onAdd:()=>void;onEdit:(e:Expense)=>void;onDelete:(id:string)=>void}){return <section><div className="card p-5 mb-4"><div className="flex flex-col sm:flex-row gap-3"><div className="search"><Search size={17}/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search expenses..."/></div><select value={category} onChange={e=>setCategory(e.target.value)} className="input sm:max-w-56"><option>All</option>{CATS.map(x=><option key={x}>{x}</option>)}</select><button onClick={onAdd} className="primary-btn"><Plus size={16}/> Add Expense</button></div></div><div className="card overflow-hidden"><div className="p-5 flex justify-between"><div><p className="section-kicker">Ledger</p><h3 className="text-lg font-bold">All Expenses</h3></div><div className="text-sm text-zinc-500">{expenses.length} records</div></div>{expenses.length===0?<Empty title="No expenses yet" text="Add your first expense to start understanding where the money goes."/>:<div>{expenses.map(e=><div key={e.id} className="list-row border-t border-zinc-800"><div><div className="font-semibold">{e.description}</div><div className="text-xs text-zinc-500 mt-1">{e.category} · {new Date(e.date).toLocaleDateString()} {e.person?`· ${e.person}`:""}</div></div><div className="flex items-center gap-3"><strong>{money(e.amount)}</strong><button className="icon-small" onClick={()=>onEdit(e)}><Edit3 size={14}/></button><button className="icon-small" onClick={()=>onDelete(e.id)}><Trash2 size={14}/></button></div></div>)}</div>}</div></section>}
function RequestsPage({reqs,onAdd,onEdit,onDelete,onPaid}:{reqs:Request[];onAdd:()=>void;onEdit:(r:Request)=>void;onDelete:(id:string)=>void;onPaid:(r:Request)=>void}){return <section><div className="card overflow-hidden"><div className="p-5 flex items-center justify-between"><div><p className="section-kicker">Family money flow</p><h3 className="text-lg font-bold">Family Requests</h3></div><button onClick={onAdd} className="primary-btn"><Plus size={16}/> New Request</button></div>{reqs.length===0?<Empty title="Peace in the family... for now 😂" text="No requests are waiting for you."/>:reqs.map(r=><RequestRow key={r.id} r={r} onPaid={()=>onPaid(r)} onEdit={()=>onEdit(r)} onDelete={()=>onDelete(r.id)}/>)}</div></section>}
function BudgetPage({income,budget,spent,moneyRemaining,budgetPct,goals,onIncome,onBudget,onGoal,onDeleteGoal}:{income:number;budget:number;spent:number;moneyRemaining:number;budgetPct:number;goals:Goal[];onIncome:()=>void;onBudget:()=>void;onGoal:()=>void;onDeleteGoal:(id:string)=>void}){return <section className="space-y-4"><div className="grid md:grid-cols-3 gap-4"><div className="card p-5"><p className="section-kicker">Monthly income</p><h3 className="text-2xl font-black mt-1">{money(income)}</h3><button className="mini-btn mt-4" onClick={onIncome}><Pencil size={13}/> Edit income</button></div><div className="card p-5"><p className="section-kicker">Monthly budget</p><h3 className="text-2xl font-black mt-1">{money(budget)}</h3><button className="mini-btn mt-4" onClick={onBudget}><Pencil size={13}/> Edit budget</button></div><div className="card p-5"><p className="section-kicker">Remaining after paid</p><h3 className={`text-2xl font-black mt-1 ${moneyRemaining<0?"text-red-400":"text-emerald-300"}`}>{money(moneyRemaining)}</h3><p className="text-sm text-zinc-500 mt-2">Budget usage: {budgetPct}%</p></div></div><div className="card p-5"><div className="flex justify-between"><h3 className="font-bold">Budget Progress</h3><strong>{budgetPct}%</strong></div><div className="progress mt-4"><div className="progress-fill" style={{width:`${Math.min(100,Math.max(0,budgetPct))}%`}}/></div><div className="flex justify-between mt-3 text-sm text-zinc-500"><span>{money(spent)} spent</span><span>{budgetPct>100?money(spent-budget)+" over":money(budget-spent)+" remaining"}</span></div></div><div className="card p-5"><div className="flex justify-between items-center mb-4"><h3 className="font-bold">Savings Goals</h3><button className="primary-btn" onClick={onGoal}><Plus size={16}/> Goal</button></div>{goals.length===0?<Empty title="No savings goals yet" text="Set a target and make your money work toward something."/>:<div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">{goals.map(g=><GoalCard key={g.id} g={g} onDelete={()=>onDeleteGoal(g.id)}/>)}</div>}</div></section>}
function MorePage({onShare,onTheme,theme}:{onShare:()=>void;onTheme:()=>void;theme:string}){return <section className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4"><button onClick={onShare} className="card p-5 text-left hover:border-emerald-700"><Share2 className="text-emerald-400"/><h3 className="font-bold mt-3">Share Snapshot</h3><p className="text-sm text-zinc-500 mt-1">Share your current money summary.</p></button><button onClick={onTheme} className="card p-5 text-left hover:border-emerald-700">{theme==="dark"?<Sun className="text-amber-400"/>:<Moon className="text-emerald-400"/>}<h3 className="font-bold mt-3">Switch Appearance</h3><p className="text-sm text-zinc-500 mt-1">Current mode: {theme}.</p></button><div className="card p-5"><Settings className="text-zinc-400"/><h3 className="font-bold mt-3">Family Wahala OS</h3><p className="text-sm text-zinc-500 mt-1">Local-first budgeting. Your data stays in this browser for now.</p></div></section>}
function ModalShell({title,onClose,children}:{title:string;onClose:()=>void;children:React.ReactNode}){return <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4"><div className="w-full sm:max-w-xl max-h-[92vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl border shadow-2xl modal-surface"><div className="sticky top-0 z-10 flex items-center justify-between p-5 border-b backdrop-blur modal-header"><h3 className="text-lg font-bold">{title}</h3><button className="icon-btn" onClick={onClose}><X size={18}/></button></div><div className="p-5">{children}</div></div></div>}
function FormGrid({children}:{children:React.ReactNode}){return <div className="grid grid-cols-2 gap-3">{children}</div>}
function Field({label,children,full=false}:{label:string;children:React.ReactNode;full?:boolean}){return <label className={full?"col-span-2":"col-span-2 sm:col-span-1"}><span className="field-label">{label}</span>{children}</label>}
function ModalButtons({onCancel,onSave,label}:{onCancel:()=>void;onSave:()=>void;label:string}){return <div className="col-span-2 flex gap-2 pt-2"><button onClick={onCancel} className="secondary-btn flex-1">Cancel</button><button onClick={onSave} className="primary-btn flex-1 justify-center">{label}</button></div>}
