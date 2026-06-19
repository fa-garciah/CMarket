-- CreateEnum
CREATE TYPE "RolApp" AS ENUM ('MASTER', 'USER');

-- CreateEnum
CREATE TYPE "RolComunidad" AS ENUM ('ADMIN', 'USER');

-- CreateEnum
CREATE TYPE "EstadoMembresia" AS ENUM ('PENDIENTE', 'APROBADA', 'RECHAZADA', 'BLOQUEADA');

-- CreateTable
CREATE TABLE "comunidades" (
    "idcomunidad" SERIAL NOT NULL,
    "nombre" VARCHAR(120) NOT NULL,
    "slug" VARCHAR(120) NOT NULL,
    "descripcion" TEXT,
    "codigoinvitacion" VARCHAR(100),
    "codigoexpiracion" TIMESTAMP(3),
    "fechacreacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isactive" SMALLINT NOT NULL DEFAULT 1,

    CONSTRAINT "comunidades_pkey" PRIMARY KEY ("idcomunidad")
);

-- CreateTable
CREATE TABLE "membresias_comunidad" (
    "idmembresia" SERIAL NOT NULL,
    "idusuario" INTEGER NOT NULL,
    "idcomunidad" INTEGER NOT NULL,
    "rol" "RolComunidad" NOT NULL DEFAULT 'USER',
    "estado" "EstadoMembresia" NOT NULL DEFAULT 'PENDIENTE',
    "fechacreacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fechaactualiza" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "membresias_comunidad_pkey" PRIMARY KEY ("idmembresia")
);

-- CreateTable
CREATE TABLE "usuarios" (
    "idusuario" SERIAL NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "correo" VARCHAR(225) NOT NULL,
    "telefono" VARCHAR(75) NOT NULL,
    "contrasena" VARCHAR(255) NOT NULL,
    "rolapp" "RolApp" NOT NULL DEFAULT 'USER',
    "fecharegistro" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isactive" SMALLINT NOT NULL,
    "fotousuario" BYTEA,
    "verifytoken" VARCHAR(255),
    "verifytokenexpiry" TIMESTAMP(3),

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("idusuario")
);

-- CreateTable
CREATE TABLE "producto" (
    "idproducto" SERIAL NOT NULL,
    "idusuario" INTEGER NOT NULL,
    "idcategoria" INTEGER NOT NULL,
    "iddisponibilidad" INTEGER NOT NULL,
    "nombreproducto" VARCHAR(100) NOT NULL,
    "descripcion" TEXT,
    "precio" DECIMAL(10,2) NOT NULL,
    "stock" INTEGER NOT NULL,
    "fechapublicacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isactive" SMALLINT NOT NULL,
    "fotoproducto" BYTEA,
    "fotourl" VARCHAR(500),

    CONSTRAINT "producto_pkey" PRIMARY KEY ("idproducto")
);

-- CreateTable
CREATE TABLE "publicaciones_producto" (
    "idpublicacion" SERIAL NOT NULL,
    "idproducto" INTEGER NOT NULL,
    "idcomunidad" INTEGER NOT NULL,
    "isactive" SMALLINT NOT NULL DEFAULT 1,
    "fechapublicacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "publicaciones_producto_pkey" PRIMARY KEY ("idpublicacion")
);

-- CreateTable
CREATE TABLE "categorias" (
    "idcategoria" SERIAL NOT NULL,
    "nombrecategoria" VARCHAR(50) NOT NULL,

    CONSTRAINT "categorias_pkey" PRIMARY KEY ("idcategoria")
);

-- CreateTable
CREATE TABLE "disponibilidad" (
    "iddisponibilidad" SERIAL NOT NULL,
    "nombredisponibilidad" VARCHAR(50) NOT NULL,

    CONSTRAINT "disponibilidad_pkey" PRIMARY KEY ("iddisponibilidad")
);

-- CreateTable
CREATE TABLE "metodopago" (
    "idmetodopago" SERIAL NOT NULL,
    "nombremetodopago" VARCHAR(50) NOT NULL,

    CONSTRAINT "metodopago_pkey" PRIMARY KEY ("idmetodopago")
);

-- CreateTable
CREATE TABLE "estadotransaccion" (
    "idestado" SERIAL NOT NULL,
    "estado" VARCHAR(50) NOT NULL,

    CONSTRAINT "estadotransaccion_pkey" PRIMARY KEY ("idestado")
);

-- CreateTable
CREATE TABLE "transacciones" (
    "idtransaccion" SERIAL NOT NULL,
    "idcomprador" INTEGER NOT NULL,
    "idvendedor" INTEGER NOT NULL,
    "idproducto" INTEGER NOT NULL,
    "idcomunidad" INTEGER,
    "idestado" INTEGER NOT NULL,
    "idmetodopago" INTEGER NOT NULL,
    "cantidad" INTEGER NOT NULL,
    "preciototal" DECIMAL(10,2) NOT NULL,
    "fechatransaccion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isactive" SMALLINT NOT NULL,

    CONSTRAINT "transacciones_pkey" PRIMARY KEY ("idtransaccion")
);

-- CreateTable
CREATE TABLE "valoraciones" (
    "idvaloracion" SERIAL NOT NULL,
    "idtransaccion" INTEGER NOT NULL,
    "calificacion" INTEGER NOT NULL,
    "comentario" TEXT NOT NULL,
    "fechavaloracion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "valoraciones_pkey" PRIMARY KEY ("idvaloracion")
);

-- CreateIndex
CREATE UNIQUE INDEX "comunidades_slug_key" ON "comunidades"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "comunidades_codigoinvitacion_key" ON "comunidades"("codigoinvitacion");

-- CreateIndex
CREATE UNIQUE INDEX "membresias_comunidad_idusuario_idcomunidad_key" ON "membresias_comunidad"("idusuario", "idcomunidad");

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_correo_key" ON "usuarios"("correo");

-- CreateIndex
CREATE UNIQUE INDEX "publicaciones_producto_idproducto_idcomunidad_key" ON "publicaciones_producto"("idproducto", "idcomunidad");

-- AddForeignKey
ALTER TABLE "membresias_comunidad" ADD CONSTRAINT "membresias_comunidad_idusuario_fkey" FOREIGN KEY ("idusuario") REFERENCES "usuarios"("idusuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "membresias_comunidad" ADD CONSTRAINT "membresias_comunidad_idcomunidad_fkey" FOREIGN KEY ("idcomunidad") REFERENCES "comunidades"("idcomunidad") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "producto" ADD CONSTRAINT "producto_idusuario_fkey" FOREIGN KEY ("idusuario") REFERENCES "usuarios"("idusuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "producto" ADD CONSTRAINT "producto_idcategoria_fkey" FOREIGN KEY ("idcategoria") REFERENCES "categorias"("idcategoria") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "producto" ADD CONSTRAINT "producto_iddisponibilidad_fkey" FOREIGN KEY ("iddisponibilidad") REFERENCES "disponibilidad"("iddisponibilidad") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "publicaciones_producto" ADD CONSTRAINT "publicaciones_producto_idproducto_fkey" FOREIGN KEY ("idproducto") REFERENCES "producto"("idproducto") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "publicaciones_producto" ADD CONSTRAINT "publicaciones_producto_idcomunidad_fkey" FOREIGN KEY ("idcomunidad") REFERENCES "comunidades"("idcomunidad") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transacciones" ADD CONSTRAINT "transacciones_idcomprador_fkey" FOREIGN KEY ("idcomprador") REFERENCES "usuarios"("idusuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transacciones" ADD CONSTRAINT "transacciones_idvendedor_fkey" FOREIGN KEY ("idvendedor") REFERENCES "usuarios"("idusuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transacciones" ADD CONSTRAINT "transacciones_idproducto_fkey" FOREIGN KEY ("idproducto") REFERENCES "producto"("idproducto") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transacciones" ADD CONSTRAINT "transacciones_idcomunidad_fkey" FOREIGN KEY ("idcomunidad") REFERENCES "comunidades"("idcomunidad") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transacciones" ADD CONSTRAINT "transacciones_idestado_fkey" FOREIGN KEY ("idestado") REFERENCES "estadotransaccion"("idestado") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transacciones" ADD CONSTRAINT "transacciones_idmetodopago_fkey" FOREIGN KEY ("idmetodopago") REFERENCES "metodopago"("idmetodopago") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "valoraciones" ADD CONSTRAINT "valoraciones_idtransaccion_fkey" FOREIGN KEY ("idtransaccion") REFERENCES "transacciones"("idtransaccion") ON DELETE RESTRICT ON UPDATE CASCADE;
