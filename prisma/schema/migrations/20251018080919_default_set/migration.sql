-- AlterTable
ALTER TABLE "doctorSchedules" ALTER COLUMN "isBooked" SET DEFAULT false;

-- AlterTable
ALTER TABLE "payments" ALTER COLUMN "status" SET DEFAULT 'UNPAID';
