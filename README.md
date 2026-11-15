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

## Upload to GitHub
1. Sign in at [GitHub](https://github.com/) and click **New repository**.
2. Name it `os-scheduler-simulator`; choose Public if you want to share it easily.
3. Create the repository.
4. On the repository page, choose **Add file → Upload files**.
5. Upload `index.html`, `styles.css`, `script.js` and `README.md` (or upload the extracted project folder contents).
6. In **Commit changes**, enter a summary such as `Add CPU scheduling simulator` and click **Commit changes**.

## Deploy with GitHub Pages
1. Open your repository on GitHub.
2. Go to **Settings → Pages**.
3. Under **Build and deployment**, choose **Deploy from a branch**.
4. Select branch `main` and folder `/ (root)`, then click **Save**.
5. Wait for GitHub Pages to publish. Refresh the Pages settings page to find the published website URL.
6. Open the URL and test all four algorithms. Your home page is `index.html`, so it should load automatically.

## Generate a QR code
1. Copy your published GitHub Pages URL.
2. Open a QR code generator such as [QRCode Monkey](https://www.qrcode-monkey.com/) or [Adobe Express QR Code Generator](https://www.adobe.com/express/feature/image/qr-code-generator).
3. Paste your live project URL and generate the QR code.
4. Download the QR image and scan it using your phone camera.
5. Confirm that it opens the deployed project, not the GitHub repository editor.

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
