/*
  Warnings:

  - You are about to drop the column `imageId` on the `category` table. All the data in the column will be lost.
  - Added the required column `image` to the `Category` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `category` DROP FOREIGN KEY `Category_imageId_fkey`;

-- AlterTable
ALTER TABLE `category` DROP COLUMN `imageId`,
    ADD COLUMN `image` VARCHAR(191) NOT NULL;
