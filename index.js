async function main() {}
const fs = require("node:fs/promises");

async function main() {
  const userPid = process.argv[2];

  const pids = await getProcessPid(userPid);

  if (pids.length === 0) {
    console.log(`${userPid} process not found.`);
    return;
  }

  const memoryList = [];
  for (const pid of pids) {
    const memory = await getProcessMemory(pid);
    memoryList.push(memory);
  }

  const total = memoryList.reduce((acc, val) => acc + val, 0);
  const formattedMemory = formatMemory(total);

  console.log(`===== PROCMON =====\n Process: ${userPid}\n PIDs: ${pids.length}\n Memory: ${formattedMemory}\n
  ==================`);
}

async function getProcessPid(userPid) {
  try {
    const data = await fs.readdir("/proc", "utf8");
    const readPid = data.filter((item) => !isNaN(item));

    let pids = readPid;
    const arrayPids = [];
    for (const pid of pids) {
      try {
        const name = await fs.readFile(`/proc/${pid}/comm`, "utf8");

        if (name.trim() === userPid) {
          arrayPids.push(pid);
        }
      } catch (err) {
        console.error(err);
      }
    }

    return arrayPids;
  } catch (err) {
    console.error(err);
  }
}

async function getProcessMemory(pid) {
  try {
    const status = await fs.readFile(`/proc/${pid}/status`, "utf8");
    const formatStatus = status.split("\n");
    const lineVmrss = formatStatus.find((l) => l.startsWith("VmRSS:"));
    if (!lineVmrss) return 0;
    const parts = lineVmrss.split(/\s+/);
    return Number(parts[1]);
  } catch (err) {
    return 0;
  }
}

function formatMemory(kb) {
  if (kb >= 1024 * 1024) {
    return `${(kb / (1024 * 1024)).toFixed(2)} GB`;
  } else if (kb >= 1024) {
    return `${(kb / 1024).toFixed(2)} MB`;
  } else {
    return `${kb} KB`;
  }
}

main();
