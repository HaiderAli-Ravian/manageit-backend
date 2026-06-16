import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1781606348801 implements MigrationInterface {
    name = 'InitialSchema1781606348801'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "manageit"."users_role_enum" AS ENUM('USER', 'ADMIN')`);
        await queryRunner.query(`CREATE TABLE "manageit"."users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "email" character varying NOT NULL, "passwordHash" character varying NOT NULL, "name" character varying NOT NULL, "role" "manageit"."users_role_enum" NOT NULL DEFAULT 'USER', CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "manageit"."task_attachments" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "taskId" uuid NOT NULL, "fileUrl" character varying NOT NULL, "fileName" character varying NOT NULL, "fileType" character varying NOT NULL, "fileSize" integer NOT NULL, "uploadedById" uuid NOT NULL, CONSTRAINT "PK_34eb9e5133310a488eaba0be28a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_47d3c46e4edb30cdaf97ccdb8d" ON "manageit"."task_attachments"  ("taskId") `);
        await queryRunner.query(`CREATE TYPE "manageit"."tasks_status_enum" AS ENUM('PENDING', 'IN_PROGRESS', 'COMPLETED')`);
        await queryRunner.query(`CREATE TYPE "manageit"."tasks_priority_enum" AS ENUM('LOW', 'MEDIUM', 'HIGH')`);
        await queryRunner.query(`CREATE TABLE "manageit"."tasks" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "title" character varying NOT NULL, "description" text, "status" "manageit"."tasks_status_enum" NOT NULL DEFAULT 'PENDING', "priority" "manageit"."tasks_priority_enum" NOT NULL DEFAULT 'MEDIUM', "dueDate" TIMESTAMP WITH TIME ZONE, "userId" uuid NOT NULL, CONSTRAINT "PK_8d12ff38fcc62aaba2cab748772" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_f9178dd1e75d63d32464e46640" ON "manageit"."tasks"  ("userId", "createdAt") `);
        await queryRunner.query(`CREATE INDEX "IDX_834b57735f213c3c2d642baf98" ON "manageit"."tasks"  ("userId", "status") `);
        await queryRunner.query(`CREATE TYPE "manageit"."task_activities_action_enum" AS ENUM('CREATED', 'UPDATED', 'STATUS_CHANGED', 'DELETED', 'ATTACHMENT_ADDED', 'ATTACHMENT_REMOVED')`);
        await queryRunner.query(`CREATE TABLE "manageit"."task_activities" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "taskId" uuid NOT NULL, "userId" uuid NOT NULL, "action" "manageit"."task_activities_action_enum" NOT NULL, "changes" jsonb, CONSTRAINT "PK_b7b39b92ce3a5cd42cf81a0dd3a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_f76ab571dd5dac237dd32531af" ON "manageit"."task_activities"  ("taskId", "createdAt") `);
        await queryRunner.query(`ALTER TABLE "manageit"."task_attachments" ADD CONSTRAINT "FK_47d3c46e4edb30cdaf97ccdb8d8" FOREIGN KEY ("taskId") REFERENCES "manageit"."tasks"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "manageit"."task_attachments" ADD CONSTRAINT "FK_0989debb6be76703e78780d4f56" FOREIGN KEY ("uploadedById") REFERENCES "manageit"."users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "manageit"."tasks" ADD CONSTRAINT "FK_166bd96559cb38595d392f75a35" FOREIGN KEY ("userId") REFERENCES "manageit"."users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "manageit"."task_activities" ADD CONSTRAINT "FK_7ecc3aa36f9f641e05c65842157" FOREIGN KEY ("taskId") REFERENCES "manageit"."tasks"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "manageit"."task_activities" ADD CONSTRAINT "FK_92bb45529d40941b5e7ac7bc2d8" FOREIGN KEY ("userId") REFERENCES "manageit"."users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "manageit"."task_activities" DROP CONSTRAINT "FK_92bb45529d40941b5e7ac7bc2d8"`);
        await queryRunner.query(`ALTER TABLE "manageit"."task_activities" DROP CONSTRAINT "FK_7ecc3aa36f9f641e05c65842157"`);
        await queryRunner.query(`ALTER TABLE "manageit"."tasks" DROP CONSTRAINT "FK_166bd96559cb38595d392f75a35"`);
        await queryRunner.query(`ALTER TABLE "manageit"."task_attachments" DROP CONSTRAINT "FK_0989debb6be76703e78780d4f56"`);
        await queryRunner.query(`ALTER TABLE "manageit"."task_attachments" DROP CONSTRAINT "FK_47d3c46e4edb30cdaf97ccdb8d8"`);
        await queryRunner.query(`DROP INDEX "manageit"."IDX_f76ab571dd5dac237dd32531af"`);
        await queryRunner.query(`DROP TABLE "manageit"."task_activities"`);
        await queryRunner.query(`DROP TYPE "manageit"."task_activities_action_enum"`);
        await queryRunner.query(`DROP INDEX "manageit"."IDX_834b57735f213c3c2d642baf98"`);
        await queryRunner.query(`DROP INDEX "manageit"."IDX_f9178dd1e75d63d32464e46640"`);
        await queryRunner.query(`DROP TABLE "manageit"."tasks"`);
        await queryRunner.query(`DROP TYPE "manageit"."tasks_priority_enum"`);
        await queryRunner.query(`DROP TYPE "manageit"."tasks_status_enum"`);
        await queryRunner.query(`DROP INDEX "manageit"."IDX_47d3c46e4edb30cdaf97ccdb8d"`);
        await queryRunner.query(`DROP TABLE "manageit"."task_attachments"`);
        await queryRunner.query(`DROP TABLE "manageit"."users"`);
        await queryRunner.query(`DROP TYPE "manageit"."users_role_enum"`);
    }

}
