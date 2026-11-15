const $ = (id) => document.getElementById(id);
const algorithms = {
  fcfs: {name:"First Come First Serve", short:"FC", description:"Processes execute in the order they arrive.", type:"Non-preemptive", rule:"Earliest arrival", allocation:"Until completion", tip:"FCFS is simple and fair by arrival order, but a long process can make shorter processes wait."},
  sjf: {name:"Shortest Job First", short:"SJ", description:"The shortest available process is selected next.", type:"Non-preemptive", rule:"Smallest burst time", allocation:"Until completion", tip:"SJF can reduce average waiting time, but long processes may wait longer when short jobs keep arriving."},
  priority: {name:"Priority Scheduling", short:"PR", description:"The highest-priority available process runs next.", type:"Non-preemptive", rule:"Lowest priority number", allocation:"Until completion", tip:"Priority scheduling runs important processes first. A low-priority process may starve if higher-priority jobs keep arriving."},
  rr: {name:"Round Robin", short:"RR", description:"Each ready process gets a fixed time quantum in rotation.", type:"Preemptive", rule:"Ready-queue order", allocation:"One time quantum", tip:"Round Robin shares CPU time fairly. A smaller quantum improves responsiveness but increases context-switching overhead."}
};
let selected = "fcfs";
let lastResult = null;
let processCounter = 4;
const colors = ["#6078ee","#23a68b","#e39a48","#9b75d5","#d56d89","#3999bd","#829b43","#bd7b56"];

function addRow(p = {}) {
  const id = p.id || `P${processCounter++}`;
  const tr = document.createElement("tr");
  tr.innerHTML = `<td class="process-id">${id}</td>
    <td><input aria-label="${id} arrival time" type="number" min="0" step="1" value="${p.arrival ?? 0}" data-field="arrival"></td>
    <td><input aria-label="${id} burst time" type="number" min="1" step="1" value="${p.burst ?? 5}" data-field="burst"></td>
    <td><input aria-label="${id} priority" type="number" min="1" step="1" value="${p.priority ?? 1}" data-field="priority"></td>
    <td><button class="delete-btn" aria-label="Delete ${id}" title="Delete process">×</button></td>`;
  tr.dataset.pid = id;
  tr.querySelector(".delete-btn").addEventListener("click", () => {
    if ($("processBody").children.length <= 1) { showError("At least one process is required."); return; }
    tr.remove();
  });
  $("processBody").appendChild(tr);
}
function resetSample() {
  $("processBody").innerHTML = "";
  processCounter = 4;
  [{id:"P1",arrival:0,burst:5,priority:2},{id:"P2",arrival:1,burst:3,priority:1},{id:"P3",arrival:2,burst:8,priority:3},{id:"P4",arrival:3,burst:6,priority:2}].forEach(addRow);
  $("quantum").value = 2;
  clearResults();
}
function getProcesses() {
  return [...$("processBody").children].map((tr,index) => {
    const read = field => Number(tr.querySelector(`[data-field="${field}"]`).value);
    return {id:tr.dataset.pid, arrival:read("arrival"), burst:read("burst"), priority:read("priority"), order:index, remaining:read("burst")};
  });
}
function showError(message) { $("errorMessage").textContent = message; }
function clearResults() {
  lastResult = null; showError("");
  $("resultStatus").textContent = "Waiting to run"; $("resultStatus").classList.remove("done");
  ["avgWaiting","avgTurnaround","busyTime","utilization"].forEach(id => $(id).textContent="—");
  $("ganttChart").innerHTML = '<div class="empty-state">Run the simulation to generate the Gantt chart.</div>';
  $("resultBody").innerHTML = '<tr><td colspan="6" class="empty-cell">Your process results will appear here.</td></tr>';
}
function pushSegment(segments, process, start, end) {
  if (end <= start) return;
  const last = segments[segments.length-1];
  if (last && last.id === process && last.end === start) last.end = end;
  else segments.push({id:process,start,end});
}
function runNonPreemptive(processes, mode) {
  let time=0, completed=0;
  const segments=[], done=new Set(), stats={};
  while(completed < processes.length) {
    const ready=processes.filter(p=>!done.has(p.id) && p.arrival<=time);
    if(!ready.length) {
      const next=Math.min(...processes.filter(p=>!done.has(p.id)).map(p=>p.arrival));
      pushSegment(segments,"IDLE",time,next); time=next; continue;
    }
    ready.sort((a,b)=>{
      if(mode==="sjf") return a.burst-b.burst || a.arrival-b.arrival || a.order-b.order;
      if(mode==="priority") return a.priority-b.priority || a.arrival-b.arrival || a.order-b.order;
      return a.arrival-b.arrival || a.order-b.order;
    });
    const p=ready[0], start=time; time+=p.burst; done.add(p.id); completed++;
    pushSegment(segments,p.id,start,time);
    stats[p.id]={completion:time,turnaround:time-p.arrival,waiting:time-p.arrival-p.burst};
  }
  return {segments,stats};
}
function runRoundRobin(processes, quantum) {
  const sorted=[...processes].sort((a,b)=>a.arrival-b.arrival || a.order-b.order);
  let time=0, index=0, completed=0;
  const queue=[], segments=[], stats={};
  while(completed<sorted.length) {
    if(queue.length===0 && index<sorted.length && time<sorted[index].arrival) {
      pushSegment(segments,"IDLE",time,sorted[index].arrival); time=sorted[index].arrival;
    }
    while(index<sorted.length && sorted[index].arrival<=time) queue.push(sorted[index++]);
    if(!queue.length) continue;
    const p=queue.shift(), start=time, run=Math.min(quantum,p.remaining);
    time+=run; p.remaining-=run; pushSegment(segments,p.id,start,time);
    while(index<sorted.length && sorted[index].arrival<=time) queue.push(sorted[index++]);
    if(p.remaining>0) queue.push(p);
    else {completed++; stats[p.id]={completion:time,turnaround:time-p.arrival,waiting:time-p.arrival-p.burst};}
  }
  return {segments,stats};
}
function simulate() {
  showError("");
  const processes=getProcesses(), quantum=Number($("quantum").value);
  if(!processes.length) return showError("Add at least one process.");
  for(const p of processes) {
    if(!Number.isInteger(p.arrival)||p.arrival<0) return showError(`${p.id}: arrival time must be a whole number greater than or equal to 0.`);
    if(!Number.isInteger(p.burst)||p.burst<1) return showError(`${p.id}: burst time must be a whole number greater than 0.`);
    if(!Number.isInteger(p.priority)||p.priority<1) return showError(`${p.id}: priority must be a whole number greater than 0.`);
  }
  if(selected==="rr" && (!Number.isInteger(quantum)||quantum<1)) return showError("Time quantum must be a whole number greater than 0.");
  const copy=processes.map(p=>({...p}));
  const result=selected==="rr" ? runRoundRobin(copy,quantum) : runNonPreemptive(copy,selected);
  lastResult={...result,processes,quantum};
  renderResults(lastResult);
}
function renderResults(result) {
  const {segments,stats,processes}=result;
  const totalWaiting=processes.reduce((s,p)=>s+stats[p.id].waiting,0);
  const totalTurnaround=processes.reduce((s,p)=>s+stats[p.id].turnaround,0);
  const busy=processes.reduce((s,p)=>s+p.burst,0);
  const elapsed=segments.length ? segments[segments.length-1].end-segments[0].start : 0;
  $("avgWaiting").textContent=(totalWaiting/processes.length).toFixed(2);
  $("avgTurnaround").textContent=(totalTurnaround/processes.length).toFixed(2);
  $("busyTime").textContent=busy;
  $("utilization").textContent=elapsed ? `${(busy/elapsed*100).toFixed(1)}%` : "0%";
  $("resultStatus").textContent="Simulation complete"; $("resultStatus").classList.add("done");
  $("resultBody").innerHTML=processes.map(p=>`<tr><td>${p.id}</td><td>${p.arrival}</td><td>${p.burst}</td><td>${stats[p.id].completion}</td><td>${stats[p.id].turnaround}</td><td>${stats[p.id].waiting}</td></tr>`).join("");
  const totalWidth=segments.reduce((s,x)=>s+x.end-x.start,0)||1;
  $("ganttChart").innerHTML="";
  segments.forEach((seg,i)=>{
    const width=Math.max((seg.end-seg.start)/totalWidth*100,2.8);
    const div=document.createElement("div");
    div.className=`gantt-segment${seg.id==="IDLE"?" idle":""}`;
    div.style.width=`${width}%`;
    div.style.background=seg.id==="IDLE"?"#cfd5df":colors[processes.findIndex(p=>p.id===seg.id)%colors.length];
    div.innerHTML=`${seg.id}<span class="start-time">${seg.start}</span>${i===segments.length-1?`<span class="end-time">${seg.end}</span>`:""}`;
    $("ganttChart").appendChild(div);
  });
}
function selectAlgorithm(key) {
  selected=key;
  document.querySelectorAll(".algo-card").forEach(btn=>btn.classList.toggle("selected",btn.dataset.algo===key));
  const a=algorithms[key];
  $("selectedName").textContent=a.name; $("selectedDescription").textContent=a.description;
  $("schedulingType").textContent=a.type; $("selectionRule").textContent=a.rule;
  $("allocationRule").textContent=a.allocation; $("algorithmTip").textContent=a.tip;
  $("quantumControl").style.visibility=key==="rr"?"visible":"hidden";
  $("algoIcon")?.remove();
  document.querySelector(".algo-icon").textContent=a.short;
  clearResults();
}
document.querySelectorAll(".algo-card").forEach(btn=>btn.addEventListener("click",()=>selectAlgorithm(btn.dataset.algo)));
$("addProcess").addEventListener("click",()=>{addRow({arrival:0,burst:4,priority:1});clearResults();});
$("resetBtn").addEventListener("click",resetSample);
$("runBtn").addEventListener("click",simulate);
$("processBody").addEventListener("input",clearResults);
$("quantum").addEventListener("input",clearResults);
resetSample();
selectAlgorithm("fcfs");
