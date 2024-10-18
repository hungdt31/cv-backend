import { PrismaClient } from "@prisma/client";

async function main() {
  const prisma = new PrismaClient()
  const data = await prisma.$queryRaw`SELECT * FROM User`
  console.log(data)
}
main();

