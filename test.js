// test.js — proves the leaderboard works.
// Run with: npm test (run `npm run seed` first)
//
// The test takes a seeded post, upvotes it 50 times, then asserts that it appears
// in the top 10 of getTop(10).

import { upvote, getTop, redis } from "./leaderboard.js";

async function run() {
  const target = "post:50";

  try {
    for (let i = 0; i < 50; i++) {
      await upvote(target);
    }

    const top = await getTop(10);
    console.log("Top 10:");
    top.forEach((post, index) => {
      console.log(`  #${index + 1}  ${post.id}  score=${post.score}  ${post.title} (${post.author})`);
    });

    const madeIt = top.some((post) => post.id === target);
    console.log(madeIt ? `\nPASS ✅  ${target} reached the top 10` : `\nFAIL ❌  ${target} is NOT in the top 10`);
    if (!madeIt) process.exitCode = 1;
  } finally {
    redis.disconnect();
  }
}

run().catch((error) => {
  console.error("Leaderboard test failed:", error);
  redis.disconnect();
  process.exitCode = 1;
});
