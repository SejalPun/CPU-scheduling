let processes = [];

function addProcess() {
    const pid = document.getElementById("pid").value;
    const arrival = parseInt(document.getElementById("arrival").value);
    const burst = parseInt(document.getElementById("burst").value);

    if (!pid || isNaN(arrival) || isNaN(burst)) {
        alert("Enter valid values!");
        return;
    }

    processes.push({
        pid,
        arrival,
        burst
    });

    displayProcesses();

    document.getElementById("pid").value = "";
    document.getElementById("arrival").value = "";
    document.getElementById("burst").value = "";
}

function displayProcesses() {
    let tbody = document.querySelector("#processTable tbody");
    tbody.innerHTML = "";

    processes.forEach(p => {
        tbody.innerHTML += `
        <tr>
            <td>${p.pid}</td>
            <td>${p.arrival}</td>
            <td>${p.burst}</td>
        </tr>`;
    });
}

function calculateSJF() {

    let n = processes.length;

    if (n === 0) {
        alert("Add processes first!");
        return;
    }

    let completed = 0;
    let currentTime = 0;
    let totalWT = 0;
    let totalTAT = 0;

    let proc = processes.map(p => ({
        ...p,
        done: false
    }));

    let result = [];

    while (completed < n) {

        let available = proc.filter(
            p => !p.done && p.arrival <= currentTime
        );

        if (available.length === 0) {
            currentTime++;
            continue;
        }

        available.sort((a,b) => a.burst - b.burst);

        let current = available[0];

        let startTime = currentTime;
        let completionTime = startTime + current.burst;
        let turnaroundTime = completionTime - current.arrival;
        let waitingTime = turnaroundTime - current.burst;

        totalWT += waitingTime;
        totalTAT += turnaroundTime;

        current.done = true;

        result.push({
            pid: current.pid,
            arrival: current.arrival,
            burst: current.burst,
            waitingTime,
            turnaroundTime,
            completionTime
        });

        currentTime = completionTime;
        completed++;
    }

    let output = `
    <h3>SJF Scheduling Result</h3>

    <table>
        <tr>
            <th>Process</th>
            <th>AT</th>
            <th>BT</th>
            <th>CT</th>
            <th>WT</th>
            <th>TAT</th>
        </tr>
    `;

    result.forEach(p => {
        output += `
        <tr>
            <td>${p.pid}</td>
            <td>${p.arrival}</td>
            <td>${p.burst}</td>
            <td>${p.completionTime}</td>
            <td>${p.waitingTime}</td>
            <td>${p.turnaroundTime}</td>
        </tr>`;
    });

    output += `
    </table>

    <h4>Average Waiting Time: ${(totalWT/n).toFixed(2)}</h4>
    <h4>Average Turnaround Time: ${(totalTAT/n).toFixed(2)}</h4>
    `;

    document.getElementById("result").innerHTML = output;
}