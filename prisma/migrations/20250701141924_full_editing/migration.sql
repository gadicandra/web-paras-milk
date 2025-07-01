/*
  Warnings:

  - You are about to drop the column `susu_coklat_1L` on the `transaction` table. All the data in the column will be lost.
  - You are about to drop the column `susu_coklat_250` on the `transaction` table. All the data in the column will be lost.
  - You are about to drop the column `susu_coklat_500` on the `transaction` table. All the data in the column will be lost.
  - You are about to drop the column `susu_kopi_1L` on the `transaction` table. All the data in the column will be lost.
  - You are about to drop the column `susu_kopi_250` on the `transaction` table. All the data in the column will be lost.
  - You are about to drop the column `susu_kopi_500` on the `transaction` table. All the data in the column will be lost.
  - You are about to drop the column `susu_melon_1L` on the `transaction` table. All the data in the column will be lost.
  - You are about to drop the column `susu_melon_250` on the `transaction` table. All the data in the column will be lost.
  - You are about to drop the column `susu_melon_500` on the `transaction` table. All the data in the column will be lost.
  - You are about to drop the column `susu_plain_1L` on the `transaction` table. All the data in the column will be lost.
  - You are about to drop the column `susu_plain_250` on the `transaction` table. All the data in the column will be lost.
  - You are about to drop the column `susu_plain_500` on the `transaction` table. All the data in the column will be lost.
  - You are about to drop the column `susu_plain_sugar_1L` on the `transaction` table. All the data in the column will be lost.
  - You are about to drop the column `susu_plain_sugar_250` on the `transaction` table. All the data in the column will be lost.
  - You are about to drop the column `susu_plain_sugar_500` on the `transaction` table. All the data in the column will be lost.
  - You are about to drop the column `susu_premium_kopi` on the `transaction` table. All the data in the column will be lost.
  - You are about to drop the column `susu_premium_matcha` on the `transaction` table. All the data in the column will be lost.
  - You are about to drop the column `susu_stroberi_1L` on the `transaction` table. All the data in the column will be lost.
  - You are about to drop the column `susu_stroberi_250` on the `transaction` table. All the data in the column will be lost.
  - You are about to drop the column `susu_stroberi_500` on the `transaction` table. All the data in the column will be lost.
  - You are about to drop the column `susu_vanilla_1L` on the `transaction` table. All the data in the column will be lost.
  - You are about to drop the column `susu_vanilla_250` on the `transaction` table. All the data in the column will be lost.
  - You are about to drop the column `susu_vanilla_500` on the `transaction` table. All the data in the column will be lost.
  - You are about to drop the `cart` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `payment_method` to the `transaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `total_amount` to the `transaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `transaction` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
CREATE SEQUENCE transaction_id_seq;
ALTER TABLE "transaction" DROP COLUMN "susu_coklat_1L",
DROP COLUMN "susu_coklat_250",
DROP COLUMN "susu_coklat_500",
DROP COLUMN "susu_kopi_1L",
DROP COLUMN "susu_kopi_250",
DROP COLUMN "susu_kopi_500",
DROP COLUMN "susu_melon_1L",
DROP COLUMN "susu_melon_250",
DROP COLUMN "susu_melon_500",
DROP COLUMN "susu_plain_1L",
DROP COLUMN "susu_plain_250",
DROP COLUMN "susu_plain_500",
DROP COLUMN "susu_plain_sugar_1L",
DROP COLUMN "susu_plain_sugar_250",
DROP COLUMN "susu_plain_sugar_500",
DROP COLUMN "susu_premium_kopi",
DROP COLUMN "susu_premium_matcha",
DROP COLUMN "susu_stroberi_1L",
DROP COLUMN "susu_stroberi_250",
DROP COLUMN "susu_stroberi_500",
DROP COLUMN "susu_vanilla_1L",
DROP COLUMN "susu_vanilla_250",
DROP COLUMN "susu_vanilla_500",
ADD COLUMN     "payment_method" TEXT NOT NULL,
ADD COLUMN     "total_amount" DECIMAL(65,30) NOT NULL,
ADD COLUMN     "transaction_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "user_id" INTEGER NOT NULL,
ALTER COLUMN "id" SET DEFAULT nextval('transaction_id_seq'),
ALTER COLUMN "status" SET DATA TYPE TEXT,
ADD CONSTRAINT "transaction_pkey" PRIMARY KEY ("id");
ALTER SEQUENCE transaction_id_seq OWNED BY "transaction"."id";

-- DropIndex
DROP INDEX "transaction_id_key";

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- DropTable
DROP TABLE "cart";

-- CreateTable
CREATE TABLE "milk" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "milk_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "milk_variant" (
    "id" SERIAL NOT NULL,
    "product_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "price" DECIMAL(65,30) NOT NULL,
    "image_url" TEXT,

    CONSTRAINT "milk_variant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "transaction_detail" (
    "id" SERIAL NOT NULL,
    "transaction_id" INTEGER NOT NULL,
    "variant_id" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "price" DECIMAL(65,30) NOT NULL,
    "subTotal" DECIMAL(65,30) NOT NULL,

    CONSTRAINT "transaction_detail_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CartItem" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "variant_id" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "isSelected" BOOLEAN NOT NULL DEFAULT true,
    "added_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CartItem_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "milk_variant" ADD CONSTRAINT "milk_variant_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "milk"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transaction" ADD CONSTRAINT "transaction_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transaction_detail" ADD CONSTRAINT "transaction_detail_transaction_id_fkey" FOREIGN KEY ("transaction_id") REFERENCES "transaction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transaction_detail" ADD CONSTRAINT "transaction_detail_variant_id_fkey" FOREIGN KEY ("variant_id") REFERENCES "milk_variant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CartItem" ADD CONSTRAINT "CartItem_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CartItem" ADD CONSTRAINT "CartItem_variant_id_fkey" FOREIGN KEY ("variant_id") REFERENCES "milk_variant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
