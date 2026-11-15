# OS Scheduler – CPU Scheduling Algorithm Simulator

A browser-based Operating Systems mini-project built using **HTML, CSS and vanilla JavaScript**. It simulates FCFS, non-preemptive SJF, non-preemptive Priority Scheduling and preemptive Round Robin.

## Features
- Add and remove processes with arrival time, burst time and priority.
- FCFS, SJF, Priority and Round Robin scheduling.
- Adjustable Round Robin time quantum.
- Gantt chart with process execution and CPU idle periods.
- Completion time, turnaround time and waiting time for every process.
- Average waiting time, average turnaround time, CPU busy time and CPU utilization.
- Responsive layout and sample process data.

## Run locally
1. Download or clone this repository.
2. Open `index.html` in Chrome, Edge or Firefox.
3. Select an algorithm, edit the process values and click **Run simulation**.
4. Select Round Robin to edit the time quantum.

No installation, server or external JavaScript library is required. Google Fonts are optional; the page has fallback fonts.

## Scheduling definitions
- **FCFS:** Non-preemptive; the earliest-arrived ready process runs to completion.
- **SJF:** Non-preemptive; among ready processes, the smallest burst time runs next.
- **Priority:** Non-preemptive; among ready processes, the smallest priority number runs next (1 is highest).
- **Round Robin:** Preemptive; ready processes take turns for up to the selected time quantum.

Waiting time = Turnaround time − Burst time.  
Turnaround time = Completion time − Arrival time.  
CPU utilization = Total CPU busy time ÷ Total elapsed timeline × 100.

## Suggested test cases
Use these values and compare the output manually:

| Process | Arrival | Burst | Priority |
|---|---:|---:|---:|
| P1 | 0 | 5 | 2 |
| P2 | 1 | 3 | 1 |
| P3 | 2 | 8 | 3 |
| P4 | 3 | 6 | 2 |

With FCFS, the execution order should be P1 → P2 → P3 → P4. Try SJF and Priority to see the order change. For Round Robin, set quantum to 2 and check that processes appear in multiple time slices.

Also test:
- One process only.
- A process arriving after time 0 (the chart should show IDLE).
- Two processes arriving at the same time.
- Round Robin with quantum 1.
- Invalid negative arrival time or zero burst time (an error should be shown).


## Project structure
```text
os-scheduler-simulator/
├── index.html
├── styles.css
├── script.js
└── README.md
```

## Limitations
SJF and Priority are implemented as non-preemptive versions. Context-switching overhead is not included in the calculations. This is an educational simulator, not a real operating-system scheduler.
