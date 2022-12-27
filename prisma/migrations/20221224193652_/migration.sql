-- AlterTable
ALTER TABLE "User" ADD COLUMN     "password_hash" TEXT NOT NULL DEFAULT '';

-- CreateTable
CREATE TABLE "BankAccount" (
    "id" TEXT NOT NULL,
    "currency" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "BankAccount_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "BankAccount" ADD CONSTRAINT "BankAccount_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
