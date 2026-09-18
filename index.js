const fs = require("node:fs/promises");
const userPid = process.argv[2];

//buscarPIDs(nome): vai em /proc e devolve a lista de PIDs correspondentes
//  │ • lerMemoria(pid) (ou calcularMemoria(pids)): lê os status e soma/formata a memória
//  │ • formatarMemoria(kb): cuida só da matemática de kB/MB/GB
//  │ • Limpar os console.log de debug temporários (como aqueles console.log(arrayPids) e console.log(arrayStatus) que a gente usou
//  │ para testar).

async function searchPids() {
  try {
    const data = await fs.readdir("/proc", "utf8");
    const readPid = data.filter((item => !isNaN(item)));

    let pids = readPid
    const arrayPids = []
    for (const pid of pids) {
      try {
        const name = await fs.readFile(`/proc/${pid}/comm`, "utf8")

        if (name.trim() === userPid) {
         arrayPids.push(pid)
        }

      } catch (err) {
        console.error(err)
      }
    }

    if (arrayPids.length === 0) {
      console.log(`"${pidDoUsuario}" process not found.`)
      return;
    }

    const readStatus = arrayPids
    const arrayStatus = []
    for (const rs of readStatus) {
      try {
        const status = await fs.readFile(`/proc/${rs}/status`, "utf8")

        const formatStatus = status.split('\n')
        const lineVmrss = formatStatus.find(formatStatus => formatStatus.startsWith("VmRSS:"))
        const parts = lineVmrss.split(/\s+/);
        const memoryInKb = Number(parts[1]);

        arrayStatus.push(memoryInKb);

      } catch (err) {
        console.error(err)
      }
    }

    const total = arrayStatus.reduce((total, memoria) => total + memoria, 0)

    let formatMemory = ""

    if (total >=  1024 * 1024) {
      formatMemory = `${(total / (1024 * 1024)).toFixed(2)} GB`
    } else if (total >= 1024) {
      formatMemory = `${(total / 1024).toFixed(2)} MB`
    } else {
      formatMemory = `${total} KB`
    }

    console.log(arrayStatus)
    console.log(`===== PROCMON =====\n Process: ${userPid}\n PIDs: ${arrayPids.length}\n Memory: ${formatMemory}\n ==================`)
  } catch (err) {
    console.error("Deu erro 29: ", err)
  }
}

searchPids()
