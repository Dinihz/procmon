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

    const total = arrayStatus.reduce((total, memoria) => total + memoria, 0)

    let memoriaFormatada = ""

    if (total >=  1024 * 1024) {
      memoriaFormatada = `${(total / (1024 * 1024)).toFixed(2)} GB`
    } else if (total >= 1024) {
      memoriaFormatada = `${(total / 1024).toFixed(2)} MB`
    } else {
      memoriaFormatada = `${total} KB`
    }

    console.log(arrayStatus)
    console.log(memoriaFormatada)
  } catch (err) {
    console.error("Deu erro 29: ", err)
  }
}

buscarProcessos()
