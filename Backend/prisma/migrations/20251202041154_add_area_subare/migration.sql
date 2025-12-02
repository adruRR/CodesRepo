/*
  Warnings:

  - You are about to drop the column `dificultad` on the `preguntas` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `examenes` ADD COLUMN `sub_area_id` INTEGER NULL;

-- AlterTable
ALTER TABLE `preguntas` DROP COLUMN `dificultad`;

-- CreateTable
CREATE TABLE `areas` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `areas_nombre_key`(`nombre`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `sub_areas` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(191) NOT NULL,
    `area_id` INTEGER NOT NULL,

    UNIQUE INDEX `sub_areas_nombre_key`(`nombre`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `sub_areas` ADD CONSTRAINT `sub_areas_area_id_fkey` FOREIGN KEY (`area_id`) REFERENCES `areas`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `examenes` ADD CONSTRAINT `examenes_sub_area_id_fkey` FOREIGN KEY (`sub_area_id`) REFERENCES `sub_areas`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
