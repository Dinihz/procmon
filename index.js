const fs = require("node:fs/promises");
const pidDoUsuario = process.argv[2];

async function buscarProcessos() {
  try {
    const data = await fs.readdir("/proc", "utf8");

    const readPid = data.filter((item => !isNaN(item)));

    let pids = readPid
    const arrayPids = []
    for (const pid of pids) {
      try {
        const nome = await fs.readFile(`/proc/${pid}/comm`, "utf8")

        if (nome.trim() === pidDoUsuario) {
         arrayPids.push(pid)
        }

      } catch (err) {
        console.error(err)
      }
    }
    console.log(arrayPids)

    const readStatus = arrayPids
    const arrayStatus = []
    for (const rs of readStatus) {
      try {
        const status = await fs.readFile(`/proc/${rs}/status`, "utf8")

        const formatStatus = status.split('\n')
        const linhaVmrss = formatStatus.find(formatStatus => formatStatus.startsWith("VmRSS:"))
        const partes = linhaVmrss.split(/\s+/);
        const memoriaEmKb = Number(partes[1]);

        arrayStatus.push(memoriaEmKb);

      } catch (err) {
        console.error(err)
      }
    }

    console.log(arrayStatus)
  } catch (err) {
    console.error("Deu erro 29: ", err)
  }
}

buscarProcessos()
