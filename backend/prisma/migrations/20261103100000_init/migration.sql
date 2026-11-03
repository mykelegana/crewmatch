-- CreateEnum
CREATE TYPE "CrewRole" AS ENUM ('PHOTOGRAPHER', 'VIDEOGRAPHER', 'DRONE_OPERATOR', 'EDITOR', 'ASSISTANT');

-- CreateEnum
CREATE TYPE "EventStatus" AS ENUM ('INQUIRY', 'CONFIRMED', 'DONE', 'CANCELLED');

-- CreateEnum
CREATE TYPE "EventType" AS ENUM ('WEDDING', 'BIRTHDAY', 'DEBUT', 'CORPORATE', 'CHRISTENING', 'OTHER');

-- CreateEnum
CREATE TYPE "ConfirmationStatus" AS ENUM ('PENDING', 'CALLED', 'CONFIRMED', 'DECLINED', 'NO_ANSWER', 'CANCELLED');

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "clients" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "clients_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "freelancers" (
    "id" UUID NOT NULL,
    "full_name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "roles" "CrewRole"[],
    "skills" TEXT[],
    "daily_rate" DECIMAL(10,2) NOT NULL,
    "city" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "freelancers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "freelancer_unavailability" (
    "id" UUID NOT NULL,
    "freelancer_id" UUID NOT NULL,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3) NOT NULL,
    "reason" TEXT,

    CONSTRAINT "freelancer_unavailability_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "events" (
    "id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "client_id" UUID NOT NULL,
    "event_type" "EventType" NOT NULL,
    "status" "EventStatus" NOT NULL DEFAULT 'INQUIRY',
    "start_at" TIMESTAMP(3) NOT NULL,
    "end_at" TIMESTAMP(3) NOT NULL,
    "venue_name" TEXT NOT NULL,
    "venue_city" TEXT NOT NULL,
    "venue_latitude" DOUBLE PRECISION,
    "venue_longitude" DOUBLE PRECISION,
    "guest_count" INTEGER NOT NULL,
    "hours_covered" DOUBLE PRECISION NOT NULL,
    "package_name" TEXT,
    "special_requests" TEXT,
    "quoted_price" DECIMAL(12,2),
    "estimated_budget" DECIMAL(12,2),
    "actual_cost" DECIMAL(12,2),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "event_positions" (
    "id" UUID NOT NULL,
    "event_id" UUID NOT NULL,
    "role" "CrewRole" NOT NULL,
    "required_count" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "event_positions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "assignments" (
    "id" UUID NOT NULL,
    "event_id" UUID NOT NULL,
    "freelancer_id" UUID NOT NULL,
    "position_id" UUID NOT NULL,
    "status" "ConfirmationStatus" NOT NULL DEFAULT 'PENDING',
    "agreed_rate" DECIMAL(10,2) NOT NULL,
    "rating" INTEGER,
    "rating_note" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "assignments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "clients_name_idx" ON "clients"("name");

-- CreateIndex
CREATE INDEX "freelancers_city_is_active_idx" ON "freelancers"("city", "is_active");

-- CreateIndex
CREATE INDEX "freelancers_is_active_idx" ON "freelancers"("is_active");

-- CreateIndex
CREATE INDEX "freelancer_unavailability_freelancer_id_start_date_end_date_idx" ON "freelancer_unavailability"("freelancer_id", "start_date", "end_date");

-- CreateIndex
CREATE INDEX "events_client_id_status_idx" ON "events"("client_id", "status");

-- CreateIndex
CREATE INDEX "events_start_at_end_at_idx" ON "events"("start_at", "end_at");

-- CreateIndex
CREATE INDEX "events_venue_city_idx" ON "events"("venue_city");

-- CreateIndex
CREATE INDEX "event_positions_event_id_role_idx" ON "event_positions"("event_id", "role");

-- CreateIndex
CREATE INDEX "assignments_freelancer_id_status_idx" ON "assignments"("freelancer_id", "status");

-- CreateIndex
CREATE INDEX "assignments_event_id_status_idx" ON "assignments"("event_id", "status");

-- CreateIndex
CREATE UNIQUE INDEX "assignments_event_id_freelancer_id_key" ON "assignments"("event_id", "freelancer_id");

-- AddForeignKey
ALTER TABLE "freelancer_unavailability" ADD CONSTRAINT "freelancer_unavailability_freelancer_id_fkey" FOREIGN KEY ("freelancer_id") REFERENCES "freelancers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "events" ADD CONSTRAINT "events_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "clients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_positions" ADD CONSTRAINT "event_positions_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assignments" ADD CONSTRAINT "assignments_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assignments" ADD CONSTRAINT "assignments_freelancer_id_fkey" FOREIGN KEY ("freelancer_id") REFERENCES "freelancers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assignments" ADD CONSTRAINT "assignments_position_id_fkey" FOREIGN KEY ("position_id") REFERENCES "event_positions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

