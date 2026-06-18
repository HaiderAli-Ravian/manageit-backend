import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1781768523785 implements MigrationInterface {
    name = 'InitialSchema1781768523785'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."users_role_enum" AS ENUM('USER', 'ADMIN')`);
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "email" character varying NOT NULL, "passwordHash" character varying NOT NULL, "name" character varying NOT NULL, "role" "public"."users_role_enum" NOT NULL DEFAULT 'USER', CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "task_attachments" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "taskId" uuid NOT NULL, "fileUrl" character varying NOT NULL, "fileName" character varying NOT NULL, "fileType" character varying NOT NULL, "fileSize" integer NOT NULL, "uploadedById" uuid NOT NULL, CONSTRAINT "PK_34eb9e5133310a488eaba0be28a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_47d3c46e4edb30cdaf97ccdb8d" ON "task_attachments"  ("taskId") `);
        await queryRunner.query(`CREATE TYPE "public"."tasks_status_enum" AS ENUM('PENDING', 'IN_PROGRESS', 'COMPLETED')`);
        await queryRunner.query(`CREATE TYPE "public"."tasks_priority_enum" AS ENUM('LOW', 'MEDIUM', 'HIGH')`);
        await queryRunner.query(`CREATE TABLE "tasks" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "title" character varying NOT NULL, "description" text, "status" "public"."tasks_status_enum" NOT NULL DEFAULT 'PENDING', "priority" "public"."tasks_priority_enum" NOT NULL DEFAULT 'MEDIUM', "dueDate" TIMESTAMP WITH TIME ZONE, "userId" uuid NOT NULL, CONSTRAINT "PK_8d12ff38fcc62aaba2cab748772" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_f9178dd1e75d63d32464e46640" ON "tasks"  ("userId", "createdAt") `);
        await queryRunner.query(`CREATE INDEX "IDX_834b57735f213c3c2d642baf98" ON "tasks"  ("userId", "status") `);
        await queryRunner.query(`CREATE TYPE "public"."task_activities_action_enum" AS ENUM('CREATED', 'UPDATED', 'STATUS_CHANGED', 'DELETED', 'ATTACHMENT_ADDED', 'ATTACHMENT_REMOVED')`);
        await queryRunner.query(`CREATE TABLE "task_activities" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "taskId" uuid NOT NULL, "userId" uuid NOT NULL, "action" "public"."task_activities_action_enum" NOT NULL, "changes" jsonb, CONSTRAINT "PK_b7b39b92ce3a5cd42cf81a0dd3a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_f76ab571dd5dac237dd32531af" ON "task_activities"  ("taskId", "createdAt") `);
        await queryRunner.query(`ALTER TABLE "task_attachments" ADD CONSTRAINT "FK_47d3c46e4edb30cdaf97ccdb8d8" FOREIGN KEY ("taskId") REFERENCES "tasks"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "task_attachments" ADD CONSTRAINT "FK_0989debb6be76703e78780d4f56" FOREIGN KEY ("uploadedById") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tasks" ADD CONSTRAINT "FK_166bd96559cb38595d392f75a35" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "task_activities" ADD CONSTRAINT "FK_7ecc3aa36f9f641e05c65842157" FOREIGN KEY ("taskId") REFERENCES "tasks"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "task_activities" ADD CONSTRAINT "FK_92bb45529d40941b5e7ac7bc2d8" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "task_activities" DROP CONSTRAINT "FK_92bb45529d40941b5e7ac7bc2d8"`);
        await queryRunner.query(`ALTER TABLE "task_activities" DROP CONSTRAINT "FK_7ecc3aa36f9f641e05c65842157"`);
        await queryRunner.query(`ALTER TABLE "tasks" DROP CONSTRAINT "FK_166bd96559cb38595d392f75a35"`);
        await queryRunner.query(`ALTER TABLE "task_attachments" DROP CONSTRAINT "FK_0989debb6be76703e78780d4f56"`);
        await queryRunner.query(`ALTER TABLE "task_attachments" DROP CONSTRAINT "FK_47d3c46e4edb30cdaf97ccdb8d8"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_f76ab571dd5dac237dd32531af"`);
        await queryRunner.query(`DROP TABLE "task_activities"`);
        await queryRunner.query(`DROP TYPE "public"."task_activities_action_enum"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_834b57735f213c3c2d642baf98"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_f9178dd1e75d63d32464e46640"`);
        await queryRunner.query(`DROP TABLE "tasks"`);
        await queryRunner.query(`DROP TYPE "public"."tasks_priority_enum"`);
        await queryRunner.query(`DROP TYPE "public"."tasks_status_enum"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_47d3c46e4edb30cdaf97ccdb8d"`);
        await queryRunner.query(`DROP TABLE "task_attachments"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TYPE "public"."users_role_enum"`);
    }

}
