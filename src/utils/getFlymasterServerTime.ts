export interface FlymasterTime {
  st: number;
}

export const getFlymasterServerTime = async (groupId: number | string) => {
  const timestamp = Date.now();
  const fmTimeUrl = `https://lb.flymaster.net/time.php?grp=${groupId}&_=${timestamp}`;
  const res = await fetch(fmTimeUrl, {
    cache: "no-store",
    headers: {
      "user-agent": "Chrome",
    },
  });

  if (!res) throw new Error("No time response from flymaster server");

  const body = (await res.json()) as FlymasterTime;
  return body.st;
};
