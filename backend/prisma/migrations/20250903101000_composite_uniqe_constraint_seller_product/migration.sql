/*
  Warnings:

  - A unique constraint covering the columns `[productId,sellerId]` on the table `SellerProduct` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "SellerProduct_productId_sellerId_key" ON "public"."SellerProduct"("productId", "sellerId");
