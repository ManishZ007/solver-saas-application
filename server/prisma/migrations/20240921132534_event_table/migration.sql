-- CreateTable
CREATE TABLE "event" (
    "id" TEXT NOT NULL,
    "title" VARCHAR(100) NOT NULL,
    "user_id" TEXT NOT NULL,
    "date_of_event" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "event_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "event_created_at_idx" ON "event"("created_at");

-- AddForeignKey
ALTER TABLE "event" ADD CONSTRAINT "event_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
