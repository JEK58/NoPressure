import { env } from "@/env.mjs";
interface Position {
  position: number;
  score: string;
}

interface ErrorResponse {
  error: string;
}

const headers = {
  Authorization: env.API_KEY,
};

it("finds the correct number of event platforms", async () => {
  const res = await fetch("http://localhost:3001/api/v1/comps", { headers });
  const comps = (await res.json()) as unknown[];

  expect(comps.length).toBe(3);
});

it("finds all pilots in a Flyevent comp", async () => {
  const id = "2413";
  const expectedNumPilots = 90;
  const res = await fetch(
    `http://localhost:3001/api/v1/flyevent/pilots?groupId=${id}`,
    { headers },
  );
  const comps = (await res.json()) as unknown[];

  expect(comps.length).toBe(expectedNumPilots);
});

it("it rejects if the groupId is not a valid number", async () => {
  const id = "F2413";
  const expectedError = "groupId must be a valid number (in string format)";

  const res = await fetch(
    `http://localhost:3001/api/v1/flyevent/pilots?groupId=${id}`,
    { headers },
  );
  const error = (await res.json()) as ErrorResponse;

  expect(error.error).toBe(expectedError);
});

it("finds all pilots in a Flymaster comp", async () => {
  const id = "5444";
  const expectedNumPilots = 40;
  const res = await fetch(
    `http://localhost:3001/api/v1/flymaster/pilots?groupId=${id}`,
    { headers },
  );
  const comps = (await res.json()) as unknown[];

  expect(comps.length).toBe(expectedNumPilots);
});

it("finds the correct position for a pilot in a Flyevent comp", async () => {
  interface Position {
    position: number;
    score: string;
  }

  const pilotId = "196";
  const groupId = "2413";

  const expectedPosition = 1;
  const expectedScore = "595.0";

  const res = await fetch(
    `http://localhost:3001/api/v1/flyevent/position?groupId=${groupId}&pilotId=${pilotId}`,
    { headers },
  );
  const position = (await res.json()) as Position;

  expect(position.position).toBe(expectedPosition);
  expect(position.score).toBe(expectedScore);
});

it("finds the correct position for a pilot in a Flymaster group", async () => {
  interface Position {
    position: number;
    score: string;
  }

  const pilotId = "168498";
  const groupId = "5444";

  const expectedPosition = "?";
  const expectedScore = undefined;

  const res = await fetch(
    `http://localhost:3001/api/v1/flymaster/position?groupId=${groupId}&pilotId=${pilotId}`,
    { headers },
  );
  const position = (await res.json()) as Position;

  expect(position.position).toBe(expectedPosition);
  expect(position.score).toBe(expectedScore);
});

it("finds the correct position for a pilot in a PWC", async () => {
  const pilotId = "333";

  const expectedPosition = "57";
  const expectedScore = "618.1";

  const res = await fetch(
    `http://localhost:3001/api/v1/pwc/position?pilotId=${pilotId}`,
    { headers },
  );
  const position = (await res.json()) as Position;

  expect(position.position).toBe(expectedPosition);
  expect(position.score).toBe(expectedScore);
});
