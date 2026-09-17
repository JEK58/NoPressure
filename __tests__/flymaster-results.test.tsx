/** @jest-environment node */

import {
  getLatestScoredTaskId,
  getTaskPosition,
} from "@/server/api/routers/flymaster-results";

const frontPage = `
  <div class="task-card">
    <div class="task-date">2026-08-09</div>
    <div class="task-name">Training <span>Training day</span></div>
    <a class="js-results-link" data-base-url="bsTaskResultsFiltered.php?idgroup=7800&taskId=1211"></a>
  </div>
  <div class="task-card">
    <div class="task-date">2026-08-10</div>
    <div class="task-name">Task 1 <span>Official</span></div>
    <a class="js-results-link" data-base-url="bsTaskResultsFiltered.php?idgroup=7800&taskId=1215"></a>
  </div>
  <div class="task-card">
    <div class="task-date">2026-08-11</div>
    <div class="task-name">Task 2 <span>Provisional</span></div>
    <a class="js-results-link" data-base-url="bsTaskResultsFiltered.php?idgroup=7800&taskId=1216"></a>
  </div>
`;

function taskTable(rows: string, header = "Lead Pts") {
  return `
    <table id="score-table">
      <thead><tr><th>#</th><th>Id</th><th>${header}</th></tr></thead>
      <tbody>${rows}</tbody>
    </table>
  `;
}

describe("Flymaster official results", () => {
  it("chooses the newest non-training task even when it is provisional", () => {
    expect(getLatestScoredTaskId(frontPage)).toBe("1216");
  });

  it("calculates pilot 666's leading-points percentage from the task leader", () => {
    const html = taskTable(`
      <tr class="fs_res_res_row"><td>1</td><td class="col-id">22</td><td>200.0</td></tr>
      <tr class="fs_res_res_row"><td>33</td><td class="col-id">666</td><td><strong>154.9</strong></td></tr>
      <tr class="fs_res_res_row"><td>34</td><td class="col-id">7</td><td>100.0</td></tr>
    `);

    expect(getTaskPosition(html, "666")).toEqual({
      position: 33,
      leadingPercentage: 77,
    });
  });

  it("returns 100 percent for a tied task leader", () => {
    const html = taskTable(`
      <tr class="fs_res_res_row"><td>1</td><td class="col-id">22</td><td>200</td></tr>
      <tr class="fs_res_res_row"><td>1</td><td class="col-id">666</td><td>200</td></tr>
    `);

    expect(getTaskPosition(html, "666")).toEqual({
      position: 1,
      leadingPercentage: 100,
    });
  });

  it("keeps a valid rank but omits the percentage for zero or missing leading points", () => {
    const zeroPoints = taskTable(
      `<tr class="fs_res_res_row"><td>4</td><td class="col-id">666</td><td>0</td></tr>`,
    );
    const missingPoints = taskTable(
      `<tr class="fs_res_res_row"><td>4</td><td class="col-id">666</td><td>—</td></tr>`,
    );

    expect(getTaskPosition(zeroPoints, "666")).toEqual({ position: 4 });
    expect(getTaskPosition(missingPoints, "666")).toEqual({ position: 4 });
  });

  it("returns an unknown position when the pilot or table cannot be found", () => {
    const html = taskTable(
      `<tr class="fs_res_res_row"><td>1</td><td class="col-id">22</td><td>200</td></tr>`,
    );

    expect(getTaskPosition(html, "666")).toEqual({ position: "?" });
    expect(getTaskPosition("<main>No results</main>", "666")).toEqual({
      position: "?",
    });
  });
});
