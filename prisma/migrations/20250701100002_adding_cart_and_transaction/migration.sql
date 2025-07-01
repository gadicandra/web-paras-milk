-- CreateTable
CREATE TABLE "cart" (
    "id" INTEGER NOT NULL,
    "susu_plain_250" INTEGER NOT NULL,
    "susu_plain_500" INTEGER NOT NULL,
    "susu_plain_1L" INTEGER NOT NULL,
    "susu_plain_sugar_250" INTEGER NOT NULL,
    "susu_plain_sugar_500" INTEGER NOT NULL,
    "susu_plain_sugar_1L" INTEGER NOT NULL,
    "susu_coklat_250" INTEGER NOT NULL,
    "susu_coklat_500" INTEGER NOT NULL,
    "susu_coklat_1L" INTEGER NOT NULL,
    "susu_vanilla_250" INTEGER NOT NULL,
    "susu_vanilla_500" INTEGER NOT NULL,
    "susu_vanilla_1L" INTEGER NOT NULL,
    "susu_stroberi_250" INTEGER NOT NULL,
    "susu_stroberi_500" INTEGER NOT NULL,
    "susu_stroberi_1L" INTEGER NOT NULL,
    "susu_melon_250" INTEGER NOT NULL,
    "susu_melon_500" INTEGER NOT NULL,
    "susu_melon_1L" INTEGER NOT NULL,
    "susu_kopi_250" INTEGER NOT NULL,
    "susu_kopi_500" INTEGER NOT NULL,
    "susu_kopi_1L" INTEGER NOT NULL,
    "susu_premium_kopi" INTEGER NOT NULL,
    "susu_premium_matcha" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "transaction" (
    "id" INTEGER NOT NULL,
    "susu_plain_250" INTEGER NOT NULL,
    "susu_plain_500" INTEGER NOT NULL,
    "susu_plain_1L" INTEGER NOT NULL,
    "susu_plain_sugar_250" INTEGER NOT NULL,
    "susu_plain_sugar_500" INTEGER NOT NULL,
    "susu_plain_sugar_1L" INTEGER NOT NULL,
    "susu_coklat_250" INTEGER NOT NULL,
    "susu_coklat_500" INTEGER NOT NULL,
    "susu_coklat_1L" INTEGER NOT NULL,
    "susu_vanilla_250" INTEGER NOT NULL,
    "susu_vanilla_500" INTEGER NOT NULL,
    "susu_vanilla_1L" INTEGER NOT NULL,
    "susu_stroberi_250" INTEGER NOT NULL,
    "susu_stroberi_500" INTEGER NOT NULL,
    "susu_stroberi_1L" INTEGER NOT NULL,
    "susu_melon_250" INTEGER NOT NULL,
    "susu_melon_500" INTEGER NOT NULL,
    "susu_melon_1L" INTEGER NOT NULL,
    "susu_kopi_250" INTEGER NOT NULL,
    "susu_kopi_500" INTEGER NOT NULL,
    "susu_kopi_1L" INTEGER NOT NULL,
    "susu_premium_kopi" INTEGER NOT NULL,
    "susu_premium_matcha" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "cart_id_key" ON "cart"("id");

-- CreateIndex
CREATE UNIQUE INDEX "transaction_id_key" ON "transaction"("id");
