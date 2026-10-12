"use client";
import { useState, useEffect } from "react";
import { Plus, Shield, Moon, Sun, Trash2, Check, Share2, Wallet, List } from "lucide-react";

type Request = { id:string; name:string; reason:string; amount:number; urgency:string; status:string; date:string; category:string; };

const REL = ["Mum","Dad","Brother","Sister","Uncle","Aunty","Cousin","Wife","Husband","Other"];
const CATS = ["Food","Transport","Housing","Electricity","Education","Health","Family Support","Entertainment","Savings","Other"];

export default function Page(){
  const [theme,setTheme]=useState("light");
  const [income,setIncome]=useState(250000);
  const [budget,setBudget]=useState(50000);
  const [reqs,setReqs]=useState<Request[]>([]);
  const [showForm,setShowForm]=useState(false);
  const [form,setForm]=useState({name:"Mum",reason:"",amount:"",urgency:"HIGH",category:"Family Support"});

  useEffect(()=>{
    const st=localStorage.getItem("wahala-theme");
    const sb=localStorage.getItem("wahala-budget");
    const si=localStorage.getItem("wahala-income");
    const sr=localStorage.getItem("wahala-reqs");
    if(st){setTheme(st);document.documentElement.classList.toggle("dark",st==="dark");}
    if(sb) setBudget(JSON.parse(sb));
    if(si) setIncome(JSON.parse(si));
    if(sr) {
      const parsed = JSON.parse(sr);
      setReqs(parsed.map((r:any)=>({...r, category: r.category || "Family Support"})));
    }
    else setReqs([
      {id:"1",name:"Mum",reason:"School fees",amount:20000,urgency:"HIGH",status:"PENDING",date:new Date().toISOString(),category:"Education"},
      {id:"2",name:"Uncle",reason:"Car fuel",amount:10000,urgency:"MEDIUM",status:"PENDING",date:new Date(Date.now()-86400000).toISOString(),category:"Transport"}
    ]);
  },[]);

  useEffect(()=>{localStorage.setItem("wahala-budget",JSON.stringify(budget));},[budget]);
  useEffect(()=>{localStorage.setItem("wahala-income",JSON.stringify(income));},[income]);
  useEffect(()=>{localStorage.setItem("wahala-reqs",JSON.stringify(reqs));},[reqs]);

  const toggleTheme=()=>{const nt=theme==="light"?"dark":"light";setTheme(nt);localStorage.setItem("wahala-theme",nt);document.documentElement.classList.toggle("dark",nt==="dark");};

  const paid=reqs.filter(r=>r.status==="PAID").reduce((s,r)=>s+r.amount,0);
  const pending=reqs.filter(r=>r.status==="PENDING").reduce((s,r)=>s+r.amount,0);
  const total=paid+pending;
  const spent=paid;
  const moneyRemaining=income-spent;
  const pct=budget?Math.round((spent/budget)*100):0;
  const budgetRemaining=budget-spent;
  const level=pct>=100?"Critical":pct>=75?"High":pct>=50?"Medium":"Low";
  const history=[...reqs].filter(r=>r.status==="PAID").sort((a,b)=>new Date(b.date).getTime()-new Date(a.date).getTime());

  const add=()=>{if(!form.reason||!form.amount) return;setReqs([{id:Date.now().toString(),name:form.name,reason:form.reason,amount:parseInt(form.amount),urgency:form.urgency,status:"PENDING",date:new Date().toISOString(),category:form.category},...reqs]);setForm({name:"Mum",reason:"",amount:"",urgency:"HIGH",category:"Family Support"});setShowForm(false);};

  const share=()=>{const text=`Family Wahala OS - Income: N${income.toLocaleString()} Spent: N${spent.toLocaleString()} Pending: N${pending.toLocaleString()} Remaining: N${moneyRemaining.toLocaleString()} Budget: ${pct}% used`;window.open(`https://wa.me/?text=${encodeURIComponent(text)}`,"_blank");};

  return (<div className="min-h-screen text-[#111827] dark:text-zinc-100"><div className="max-w-6xl mx-auto px-4 py-6">
  <div className="flex items-center justify-between mb-6"><div className="flex items-center gap-3"><div className="w-10 h-10 bg-[#0F4C3A] rounded-xl flex items-center justify-center text-white"><Shield size={20}/></div><div><h1 className="text-2xl font-extrabold text-[#0F4C3A] dark:text-emerald-300">Family Wahala OS</h1><p className="text-xs opacity-60 -mt-1">Black Tax Budget Tracker</p></div></div><div className="flex items-center gap-2"><button onClick={toggleTheme} className="w-9 h-9 rounded-full bg-white dark:bg-zinc-800 border flex items-center justify-center">{theme==="light"?<Moon size={16}/>:<Sun size={16}/>}</button><button onClick={share} className="hidden md:flex items-center gap-2 px-3 py-2 bg-white dark:bg-zinc-800 border rounded-full text-sm"><Share2 size={16}/>Share</button><button onClick={()=>setShowForm(true)} className="flex items-center gap-2 px-4 py-2 bg-[#0F4C3A] text-white rounded-full text-sm font-semibold"><Plus size={16}/>New Request</button></div></div>

  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
    <div className="bg-white dark:bg-zinc-900 rounded-2xl p-4 border shadow-sm"><div className="text-xs opacity-60 flex items-center gap-1"><Wallet size={12}/> Income This Month</div><div className="text-2xl font-bold mt-1">N{income.toLocaleString()}</div></div>
    <div className="bg-[#F0FDF4] dark:bg-emerald-950/30 rounded-2xl p-4 border"><div className="text-xs text-emerald-800 dark:text-emerald-300">Spent (Paid)</div><div className="text-2xl font-bold mt-1 text-emerald-800">N{spent.toLocaleString()}</div></div>
    <div className="bg-[#FEF2F2] dark:bg-red-950/20 rounded-2xl p-4 border"><div className="text-xs text-red-700">Pending</div><div className="text-2xl font-bold mt-1 text-red-700">N{pending.toLocaleString()}</div></div>
    <div className="bg-amber-50 dark:bg-amber-950/20 rounded-2xl p-4 border"><div className="text-xs text-amber-800">Wahala Level</div><div className="text-xl font-bold mt-1 text-amber-800">{level} {level==="Critical"||level==="High"?"🔥":level==="Medium"?"🔥":"🔥"}</div></div>
  </div>

  <div className="grid md:grid-cols-2 gap-4 mb-6">
    <div className="bg-white dark:bg-zinc-900 rounded-2xl p-5 border shadow-sm">
      <h3 className="font-bold mb-2">Monthly Income</h3>
      <div className="text-sm opacity-60 mb-2">Money Remaining: <span className={`font-bold ${moneyRemaining<0?"text-red-600":"text-emerald-700"}`}>N{moneyRemaining.toLocaleString()}</span></div>
      <input type="number" value={income} onChange={e=>setIncome(parseInt(e.target.value)||0)} className="w-full px-3 py-2.5 rounded-xl border bg-zinc-50 dark:bg-zinc-800"/>
    </div>

    <div className="bg-white dark:bg-zinc-900 rounded-2xl p-5 border shadow-sm">
      <div className="flex justify-between items-center"><h3 className="font-bold">Budget Progress</h3><span className="px-3 py-1 bg-amber-100 dark:bg-amber-900 rounded-full text-xs font-bold">{pct}% used</span></div>
      <div className="w-full h-3 bg-zinc-100 dark:bg-zinc-800 rounded-full mt-3"><div className="h-3 rounded-full bg-[#0F4C3A]" style={{width:`${Math.min(100,pct)}%`}}></div></div>
      <div className="flex justify-between text-sm mt-2"><span>N{spent.toLocaleString()} used</span><span>N{budgetRemaining.toLocaleString()} remaining</span></div>
      <input type="number" value={budget} onChange={e=>setBudget(parseInt(e.target.value)||0)} className="mt-3 w-32 px-3 py-1.5 rounded-full border bg-zinc-50 dark:bg-zinc-800 text-sm"/>
    </div>
  </div>

  <div className="bg-white dark:bg-zinc-900 rounded-2xl border shadow-sm overflow-hidden mb-6"><div className="p-5"><h3 className="font-bold">Family Requests</h3></div><div className="divide-y dark:divide-zinc-800">{reqs.map(r=>(<div key={r.id} className="p-4 flex items-center justify-between"><div className="flex items-center gap-3"><div className="w-9 h-9 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">{r.name[0]}</div><div><div className="font-semibold text-sm">{r.name} - {r.reason}</div><div className="text-xs opacity-60">{r.category} • {new Date(r.date).toLocaleDateString()} • {r.urgency}</div></div></div><div className="flex items-center gap-2"><div className="font-bold">N{r.amount.toLocaleString()}</div><button onClick={()=>setReqs(reqs.map(x=>x.id===r.id?{...x,status:x.status==="PAID"?"PENDING":"PAID"}:x))} className={`w-8 h-8 rounded-full border flex items-center justify-center ${r.status==="PAID"?"bg-green-600 text-white":"bg-white dark:bg-zinc-800"}`}><Check size={14}/></button><button onClick={()=>setReqs(reqs.filter(x=>x.id!==r.id))} className="w-8 h-8 rounded-full border flex items-center justify-center"><Trash2 size={14}/></button></div></div>))}</div></div>

  <div className="bg-white dark:bg-zinc-900 rounded-2xl border shadow-sm overflow-hidden"><div className="p-5 flex items-center gap-2"><List size={18}/><h3 className="font-bold">Expense History</h3></div>
    {history.length===0?<div className="p-5 text-sm opacity-60">No paid expenses yet. Tap the check on a request when you pay it.</div>:
    <div className="divide-y dark:divide-zinc-800">{history.map(r=>(<div key={r.id} className="p-4 flex justify-between text-sm"><div><span className="font-semibold">{r.reason}</span> <span className="opacity-60">({r.category})</span><div className="text-xs opacity-60">{r.name} • {new Date(r.date).toLocaleDateString()}</div></div><div className="font-bold">N{r.amount.toLocaleString()}</div></div>))}</div>}
  </div>

  </div>
  {showForm&&(<div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"><div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 w-full max-w-md"><h3 className="font-bold mb-4">New Request</h3>
  <select value={form.name} onChange={e=>setForm({...form,name:e.target.value})} className="w-full px-3 py-2.5 rounded-xl border mb-2 bg-white dark:bg-zinc-800">{REL.map(r=><option key={r}>{r}</option>)}</select>
  <input placeholder="Reason" value={form.reason} onChange={e=>setForm({...form,reason:e.target.value})} className="w-full px-3 py-2.5 rounded-xl border mb-2 bg-white dark:bg-zinc-800"/>
  <input placeholder="Amount" type="number" value={form.amount} onChange={e=>setForm({...form,amount:e.target.value})} className="w-full px-3 py-2.5 rounded-xl border mb-2 bg-white dark:bg-zinc-800"/>
  <select value={form.category} onChange={e=>setForm({...form,category:e.target.value})} className="w-full px-3 py-2.5 rounded-xl border mb-2 bg-white dark:bg-zinc-800">{CATS.map(c=><option key={c}>{c}</option>)}</select>
  <select value={form.urgency} onChange={e=>setForm({...form,urgency:e.target.value})} className="w-full px-3 py-2.5 rounded-xl border mb-4 bg-white dark:bg-zinc-800"><option>LOW</option><option>MEDIUM</option><option>HIGH</option><option>EMERGENCY</option></select>
  <div className="flex gap-2"><button onClick={()=>setShowForm(false)} className="flex-1 py-2.5 border rounded-xl">Cancel</button><button onClick={add} className="flex-1 py-2.5 bg-[#0F4C3A] text-white rounded-xl">Add</button></div></div></div>)}
  </div>);
}
