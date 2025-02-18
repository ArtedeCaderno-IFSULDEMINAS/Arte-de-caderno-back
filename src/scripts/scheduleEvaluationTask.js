import schedule from "node-schedule";
import Notice from "../models/notice.js";
import Log from "../models/log.js"
import distributeDraws from "./distributeDraws.js";

async function checkAndScheduleTask() {
    try {
        const notice = await Notice.findOne({ active: true });

        if (!notice) {
            console.log("Nenhum edital ativo encontrado.");
            const log = new Log({
                message: "Nenhum edital ativo encontrado.",
                stack: "checkAndScheduleTask",
                date: new Date(),
                type: LOG_TYPES.ERROR,
              });

              await log.save();
            return;
        }

        const startEvaluateDate = new Date(notice.start_evaluate_date);
        const now = new Date();

        if (startEvaluateDate <= now) {
            console.log("A data de avaliação já passou ou é agora. Tarefa não será agendada.");
            return;
        }

        schedule.scheduleJob(startEvaluateDate, () => {
            console.log(`Executando tarefa agendada para o edital ${notice.id}`);

            distributeDraws(notice.days_to_distribute, notice.end_evaluate_date);
        });

        console.log(`Tarefa agendada para ${startEvaluateDate.toLocaleString()}`);
    } catch (error) {
        console.error("Erro ao agendar a tarefa:", error);
    }
}

schedule.scheduleJob("0 0 * * *", () => {
    console.log("Executando verificação diária...");
    checkAndScheduleTask();
});

checkAndScheduleTask();
