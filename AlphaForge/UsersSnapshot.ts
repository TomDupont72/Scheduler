import { usersSnapshotQueue } from "../queue";
import { chunks } from "../utils";

const apiUrl = process.env.ALPHAFORGE_API_URL;

async function main() {
  const res = await fetch(`${apiUrl}/api/user/get-all-users`);

  const userIds = (await res.json()) as { data: { id: "string" }[] };

  console.log(userIds.data.map((item) => item.id));

  for (const batch of chunks(userIds.data, 10)) {
    await usersSnapshotQueue.add("users-snapshot", {
      userIds: batch.map((item) => item.id),
    });
  }

  console.log(`Enqueued ${userIds.data.length} users`);
}

main().then(() => process.exit());
