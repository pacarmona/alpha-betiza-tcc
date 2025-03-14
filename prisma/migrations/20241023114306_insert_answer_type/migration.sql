/*
  Warnings:

  - Added the required column `answer_type` to the `Question` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "AnswerType" AS ENUM ('TEXTUAL', 'AUDIO', 'VISUAL');

-- AlterTable
ALTER TABLE "Question" ADD COLUMN     "answer_type" "AnswerType" NOT NULL;
