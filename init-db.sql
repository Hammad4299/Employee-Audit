CREATE TABLE "issue_details" (
    "id" INTEGER PRIMARY KEY AUTOINCREMENT, 
    "issue_key" TEXT NOT NULL,
    "description" TEXT
);
-- project_issues definition


CREATE TABLE "projects"
(
    "id" INTEGER PRIMARY KEY NOT NULL,
    "name" TEXT NOT NULL,
    "billable" INTEGER,
    "aliases" TEXT
);


CREATE TABLE "workspaces" (
    "id" INTEGER PRIMARY KEY AUTOINCREMENT, 
    "toggle_id" INTEGER, 
    "owner" TEXT, 
    "bill_rate" REAL
);