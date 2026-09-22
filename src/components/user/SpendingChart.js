"use client";
import{Area,AreaChart,ResponsiveContainer,Tooltip,XAxis,YAxis}from"recharts";
export default function SpendingChart({data}){return <div className="h-72 w-full"><ResponsiveContainer><AreaChart data={data}><XAxis dataKey="month"/><YAxis/><Tooltip/><Area type="monotone" dataKey="amount" strokeWidth={2} fillOpacity={.15}/></AreaChart></ResponsiveContainer></div>}