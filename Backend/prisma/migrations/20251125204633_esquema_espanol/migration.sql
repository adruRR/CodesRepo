-- CreateTable
CREATE TABLE `roles` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `roles_nombre_key`(`nombre`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `usuarios` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(191) NOT NULL,
    `correo` VARCHAR(191) NOT NULL,
    `contrasena` VARCHAR(191) NOT NULL,
    `rol_id` INTEGER NOT NULL,

    UNIQUE INDEX `usuarios_correo_key`(`correo`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ciclos` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `dificultades` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `dificultades_nombre_key`(`nombre`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `categorias` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(191) NOT NULL,
    `edad_min` INTEGER NOT NULL,
    `edad_max` INTEGER NOT NULL,
    `dificultad_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `examenes` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `titulo` VARCHAR(191) NOT NULL,
    `descripcion` VARCHAR(191) NULL,
    `creado_por` INTEGER NOT NULL,
    `ciclo_id` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `preguntas` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `examen_id` INTEGER NOT NULL,
    `creada_por` INTEGER NOT NULL,
    `categoria_id` INTEGER NOT NULL,
    `titulo` VARCHAR(191) NOT NULL,
    `tipo` VARCHAR(191) NOT NULL,
    `dificultad` VARCHAR(191) NOT NULL,
    `estado` VARCHAR(191) NOT NULL,
    `explicacion` VARCHAR(191) NULL,
    `imagen_url` VARCHAR(191) NULL,
    `audio_url` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `opciones_pregunta` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `pregunta_id` INTEGER NOT NULL,
    `texto` VARCHAR(191) NULL,
    `es_correcta` BOOLEAN NOT NULL DEFAULT false,
    `imagen_url` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `intentos_examen` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `examen_id` INTEGER NOT NULL,
    `usuario_id` INTEGER NOT NULL,
    `iniciado_en` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `terminado_en` DATETIME(3) NULL,
    `puntuacion` DOUBLE NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `respuestas_usuario` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `intento_id` INTEGER NOT NULL,
    `pregunta_id` INTEGER NOT NULL,
    `opcion_id` INTEGER NULL,
    `respuesta_texto` VARCHAR(191) NULL,
    `respuesta_num` DOUBLE NULL,
    `es_correcta` BOOLEAN NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `usuarios` ADD CONSTRAINT `usuarios_rol_id_fkey` FOREIGN KEY (`rol_id`) REFERENCES `roles`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `categorias` ADD CONSTRAINT `categorias_dificultad_id_fkey` FOREIGN KEY (`dificultad_id`) REFERENCES `dificultades`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `examenes` ADD CONSTRAINT `examenes_creado_por_fkey` FOREIGN KEY (`creado_por`) REFERENCES `usuarios`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `examenes` ADD CONSTRAINT `examenes_ciclo_id_fkey` FOREIGN KEY (`ciclo_id`) REFERENCES `ciclos`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `preguntas` ADD CONSTRAINT `preguntas_examen_id_fkey` FOREIGN KEY (`examen_id`) REFERENCES `examenes`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `preguntas` ADD CONSTRAINT `preguntas_creada_por_fkey` FOREIGN KEY (`creada_por`) REFERENCES `usuarios`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `preguntas` ADD CONSTRAINT `preguntas_categoria_id_fkey` FOREIGN KEY (`categoria_id`) REFERENCES `categorias`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `opciones_pregunta` ADD CONSTRAINT `opciones_pregunta_pregunta_id_fkey` FOREIGN KEY (`pregunta_id`) REFERENCES `preguntas`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `intentos_examen` ADD CONSTRAINT `intentos_examen_examen_id_fkey` FOREIGN KEY (`examen_id`) REFERENCES `examenes`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `intentos_examen` ADD CONSTRAINT `intentos_examen_usuario_id_fkey` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `respuestas_usuario` ADD CONSTRAINT `respuestas_usuario_intento_id_fkey` FOREIGN KEY (`intento_id`) REFERENCES `intentos_examen`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `respuestas_usuario` ADD CONSTRAINT `respuestas_usuario_pregunta_id_fkey` FOREIGN KEY (`pregunta_id`) REFERENCES `preguntas`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `respuestas_usuario` ADD CONSTRAINT `respuestas_usuario_opcion_id_fkey` FOREIGN KEY (`opcion_id`) REFERENCES `opciones_pregunta`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
