/*
  Warnings:

  - Added the required column `money_source_id` to the `transactions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "transactions" ADD COLUMN     "money_source_id" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "money_sources" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "user_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "money_sources_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "money_sources_user_id_name_key" ON "money_sources"("user_id", "name");

-- AddForeignKey
ALTER TABLE "money_sources" ADD CONSTRAINT "money_sources_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_money_source_id_fkey" FOREIGN KEY ("money_source_id") REFERENCES "money_sources"("id") ON DELETE CASCADE ON UPDATE CASCADE;
