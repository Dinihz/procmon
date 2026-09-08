const fs = require("node:fs/promises");
const pidDoUsuario = process.argv[2];

async function buscarProcessos() {
  try {
    const data = await fs.readdir("/proc", "utf8");
    console.log(data)

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
  } catch (err) {
    console.error("Deu erro 29: ", err)
  }
}

buscarProcessos()
