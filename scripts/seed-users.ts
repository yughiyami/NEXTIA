import { auth } from "@/lib/auth";
import { randomBytes } from "node:crypto";
import { createInterface } from "node:readline/promises";

const SEED_USERS = [
  { name: "Admin", email: "admin@nextia.app", password: "admin123", role: "admin" },
  { name: "Profesor Demo", email: "profe@nextia.app", password: "profe123", role: "profesor" },
  { name: "Alumno Demo", email: "alumno@nextia.app", password: "alumno123", role: "alumno" },
];

function generateId() {
  return randomBytes(16).toString("hex");
}

async function main() {
  for (const u of SEED_USERS) {
    try {
      const result = await auth.api.signUpEmail({
        body: {
          name: u.name,
          email: u.email,
          password: u.password,
          role: u.role,
        },
      });
      console.log(`✓ ${u.email.padEnd(24)} role=${u.role.padEnd(10)} id=${result.user.id}`);
    } catch (err: any) {
      if (err?.body?.code === "USER_ALREADY_EXISTS") {
        console.log(`- ${u.email.padEnd(24)} ya existe`);
      } else {
        console.error(`✗ ${u.email}:`, err?.body?.message ?? err?.message ?? err);
      }
    }
  }
}

main();
