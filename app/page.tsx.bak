"use client";
import { useState, useEffect } from "react";
import { Plus, Shield, Moon, Sun, Trash2, Check, Share2 } from "lucide-react";
type Request = { id:string; name:string; reason:string; amount:number; urgency:string; status:string; date:string; };
const REL = ["Mum","Dad","Brother","Sister","Uncle","Aunty","Cousin","Wife","Husband"];
export default function Page(){
  const [theme,setTheme]=useState("light");
  const [budget,setBudget]=useState(50000);
  const [reqs,setReqs]=useState<Request[]>([]);
  const [showForm,setShowForm]=useState(false);
  const [form,setForm]=useState({name:"Mum",reason:"",amount:"",urgency:"HIGH"});
  useEffect(()=>{
    const st=localStorage.getItem("wahala-theme");
    const sb=localStorage.getItem("wahala-budget");
    const sr=localStorage.getItem("wahala-reqs");
    if(st){setTheme(st);document.documentElement.classList.toggle("dark",st==="dark");}
    if(sb) setBudget(JSON.parse(sb));
    if(sr) setReqs(JSON.parse(sr));
    else setReqs([{id:"1",name:"Mum",reason:"School fees",amount:20000,urgency:"HIGH",status:"PENDING",date:new Date().toISOString()},{id:"2",name:"Uncle",reason:"Car fuel",amount:10000,urgency:"MEDIUM",status:"PENDING",date:new Date(Date.now()-86400000).toISOString()}]);
  },[]);
  useEffect(()=>{localStorage.setItem("wahala-budget",JSON.stringify(budget));},[budget]);
  useEffect(()=>{localStorage.setItem("wahala-reqs",JSON.stringify(reqs));},[reqs]);
  const toggleTheme=()=>{const nt=theme==="light"?"dark":"light";setTheme(nt);localStorage.setItem("wahala-theme",nt);document.documentElement.classList.toggle("dark",nt==="dark");};
  const total=reqs.reduce((s,r)=>s+r.amount,0);
  const paid=reqs.filter(r=>r.status==="PAID").reduce((s,r)=>s+r.amount,0);
  const pending=total-paid;
  const used=paid;
  const pct=budget?Math.min(100,Math.round((used/budget)*100)):0;
  const level=total>70000?"High":total>40000?"Medium":"Low";
  const add=()=>{if(!form.reason||!form.amount) return;setReqs([{id:Date.now().toString(),name:form.name,reason:form.reason,amount:parseInt(form.amount),urgency:form.urgency,status:"PENDING",date:new Date().toISOString()},...reqs]);setForm({name:"Mum",reason:"",amount:"",urgency:"HIGH"});setShowForm(false);};
  const share=()=>{const text=`Family Wahala OS - Total: N${total} Paid: N${paid} Pending: N${pending} Budget: N${budget} (${pct}% used)`;window.open(`https://wa.me/?text=${encodeURIComponent(text)}`,"_blank");};
  return (<div className="min-h-screen text-[#111827] dark:text-zinc-100"><div className="max-w-6xl mx-auto px-4 py-6">
  <div className="flex items-center justify-between mb-6"><div className="flex items-center gap-3"><div className="w-10 h-10 bg-[#0F4C3A] rounded-xl flex items-center justify-center text-white"><Shield size={20}/></div><div><h1 className="text-2xl font-extrabold text-[#0F4C3A] dark:text-emerald-300">Family Wahala OS</h1><p className="text-xs opacity-60 -mt-1">Black Tax Budget Tracker</p></div></div><div className="flex items-center gap-2"><button onClick={toggleTheme} className="w-9 h-9 rounded-full bg-white dark:bg-zinc-800 border flex items-center justify-center">{theme==="light"?<Moon size={16}/>:<Sun size={16}/>}</button><button onClick={share} className="hidden md:flex items-center gap-2 px-3 py-2 bg-white dark:bg-zinc-800 border rounded-full text-sm"><Share2 size={16}/>Share</button><button onClick={()=>setShowForm(true)} className="flex items-center gap-2 px-4 py-2 bg-[#0F4C3A] text-white rounded-full text-sm font-semibold"><Plus size={16}/>New Request</button></div></div>
  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6"><div className="bg-white dark:bg-zinc-900 rounded-2xl p-4 border shadow-sm"><div className="text-xs opacity-60">Total Wahala This Month</div><div className="text-2xl font-bold mt-1">N{total.toLocaleString()}</div></div><div className="bg-[#F0FDF4] dark:bg-emerald-950/30 rounded-2xl p-4 border"><div className="text-xs text-emerald-800 dark:text-emerald-300">Paid</div><div className="text-2xl font-bold mt-1 text-emerald-800">N{paid.toLocaleString()}</div></div><div className="bg-[#FEF2F2] dark:bg-red-950/20 rounded-2xl p-4 border"><div className="text-xs text-red-700">Pending</div><div className="text-2xl font-bold mt-1 text-red-700">N{pending.toLocaleString()}</div></div><div className="bg-amber-50 dark:bg-amber-950/20 rounded-2xl p-4 border"><div className="text-xs text-amber-800">Wahala Level</div><div className="text-xl font-bold mt-1 text-amber-800">{level} {level==="High"?"🔥🔥🔥":level==="Medium"?"🔥🔥":"🔥"}</div></div></div>
  <div className="bg-white dark:bg-zinc-900 rounded-2xl p-5 border shadow-sm mb-6"><div className="flex justify-between"><h3 className="font-bold">Budget Progress</h3><span className="px-3 py-1 bg-amber-100 rounded-full text-xs font-bold">{pct}% used</span></div><div className="w-full h-3 bg-zinc-100 dark:bg-zinc-800 rounded-full mt-3"><div className="h-3 rounded-full bg-[#0F4C3A]" style={{width:`${pct}%`}}></div></div><div className="flex justify-between text-sm mt-2"><span>N{used.toLocaleString()} used</span><span>N{(budget-used).toLocaleString()} remaining</span></div><input type="number" value={budget} onChange={e=>setBudget(parseInt(e.target.value)||0)} className="mt-3 w-32 px-3 py-1.5 rounded-full border bg-zinc-50 dark:bg-zinc-800 text-sm"/></div>
  <div className="bg-white dark:bg-zinc-900 rounded-2xl border shadow-sm overflow-hidden"><div className="p-5"><h3 className="font-bold">Family Requests</h3></div><div className="divide-y dark:divide-zinc-800">{reqs.map(r=>(<div key={r.id} className="p-4 flex items-center justify-between"><div className="flex items-center gap-3"><div className="w-9 h-9 rounded-full bg-zinc-100 flex items-center justify-center">{r.name[0]}</div><div><div className="font-semibold text-sm">{r.name} - {r.reason}</div><div className="text-xs opacity-60">{new Date(r.date).toLocaleDateString()}</div></div></div><div className="flex items-center gap-2"><div className="font-bold">N{r.amount.toLocaleString()}</div><button onClick={()=>setReqs(reqs.map(x=>x.id===r.id?{...x,status:x.status==="PAID"?"PENDING":"PAID"}:x))} className={`w-8 h-8 rounded-full border flex items-center justify-center ${r.status==="PAID"?"bg-green-600 text-white":"bg-white"}`}><Check size={14}/></button><button onClick={()=>setReqs(reqs.filter(x=>x.id!==r.id))} className="w-8 h-8 rounded-full border flex items-center justify-center"><Trash2 size={14}/></button></div></div>))}</div></div></div>
  {showForm&&(<div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"><div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 w-full max-w-md"><h3 className="font-bold mb-4">New Request</h3><select value={form.name} onChange={e=>setForm({...form,name:e.target.value})} className="w-full px-3 py-2.5 rounded-xl border mb-2">{REL.map(r=><option key={r}>{r}</option>)}</select><input placeholder="Reason" value={form.reason} onChange={e=>setForm({...form,reason:e.target.value})} className="w-full px-3 py-2.5 rounded-xl border mb-2"/><input placeholder="Amount" type="number" value={form.amount} onChange={e=>setForm({...form,amount:e.target.value})} className="w-full px-3 py-2.5 rounded-xl border mb-2"/><select value={form.urgency} onChange={e=>setForm({...form,urgency:e.target.value})} className="w-full px-3 py-2.5 rounded-xl border mb-2"><option>LOW</option><option>MEDIUM</option><option>HIGH</option><option>EMERGENCY</option></select><div className="flex gap-2"><button onClick={()=>setShowForm(false)} className="flex-1 py-2.5 border rounded-xl">Cancel</button><button onClick={add} className="flex-1 py-2.5 bg-[#0F4C3A] text-white rounded-xl">Add</button></div></div></div>)}
  </div>);
}
