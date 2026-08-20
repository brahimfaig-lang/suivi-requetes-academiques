-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ETUDIANT', 'AGENT', 'ADMIN');

-- CreateEnum
CREATE TYPE "TypeRequete" AS ENUM ('RECLAMATION_NOTE', 'PROBLEME_INSCRIPTION', 'DEMANDE_DOCUMENT', 'AUTRE');

-- CreateEnum
CREATE TYPE "StatutRequete" AS ENUM ('SOUMISE', 'EN_COURS_DE_TRAITEMENT', 'EN_ATTENTE_DE_COMPLEMENT', 'TRAITEE', 'REJETEE');

-- CreateTable
CREATE TABLE "utilisateurs" (
    "id" SERIAL NOT NULL,
    "nom" TEXT NOT NULL,
    "prenom" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "motDePasse" TEXT NOT NULL,
    "role" "Role" NOT NULL,
    "matricule" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "utilisateurs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "requetes" (
    "id" SERIAL NOT NULL,
    "reference" TEXT NOT NULL,
    "type" "TypeRequete" NOT NULL,
    "objet" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "statut" "StatutRequete" NOT NULL DEFAULT 'SOUMISE',
    "motifRejet" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "etudiantId" INTEGER NOT NULL,
    "agentId" INTEGER,

    CONSTRAINT "requetes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "historiques" (
    "id" SERIAL NOT NULL,
    "action" TEXT NOT NULL,
    "ancienStatut" "StatutRequete",
    "nouveauStatut" "StatutRequete",
    "commentaire" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "requeteId" INTEGER NOT NULL,
    "auteurId" INTEGER NOT NULL,

    CONSTRAINT "historiques_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "utilisateurs_email_key" ON "utilisateurs"("email");

-- CreateIndex
CREATE UNIQUE INDEX "utilisateurs_matricule_key" ON "utilisateurs"("matricule");

-- CreateIndex
CREATE UNIQUE INDEX "requetes_reference_key" ON "requetes"("reference");

-- AddForeignKey
ALTER TABLE "requetes" ADD CONSTRAINT "requetes_etudiantId_fkey" FOREIGN KEY ("etudiantId") REFERENCES "utilisateurs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "requetes" ADD CONSTRAINT "requetes_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "utilisateurs"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "historiques" ADD CONSTRAINT "historiques_requeteId_fkey" FOREIGN KEY ("requeteId") REFERENCES "requetes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "historiques" ADD CONSTRAINT "historiques_auteurId_fkey" FOREIGN KEY ("auteurId") REFERENCES "utilisateurs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
