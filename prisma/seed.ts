/**
 * Seeds the four base roles + a baseline permission set, and (if a user
 * with the given email already exists — i.e. they have signed in at least
 * once) promotes that user to SUPERADMIN.
 *
 * Run with: npm run db:seed
 * (requires SUPERADMIN_EMAIL to be set in .env to actually promote someone)
 */
import { PrismaClient } from "@prisma/client";
import { ALL_ROLES } from "../src/lib/auth/rbac";

const prisma = new PrismaClient();

const BASE_PERMISSIONS = [
  { key: "cms.manage", description: "Create, edit, and publish CMS content" },
  { key: "products.manage", description: "Create and edit ecosystem products" },
  { key: "users.manage", description: "View and manage user accounts and roles" },
  { key: "settings.manage", description: "Edit site-wide settings" },
  { key: "analytics.view", description: "View the analytics dashboard" },
];

// Which roles get which permissions, by permission key.
const ROLE_PERMISSIONS: Record<string, string[]> = {
  SUPERADMIN: BASE_PERMISSIONS.map((p) => p.key),
  ADMIN: BASE_PERMISSIONS.map((p) => p.key),
  EDITOR: ["cms.manage", "products.manage", "analytics.view"],
  USER: [],
};

async function main() {
  console.log("Seeding roles...");
  for (const name of ALL_ROLES) {
    await prisma.role.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }

  console.log("Seeding permissions...");
  for (const perm of BASE_PERMISSIONS) {
    await prisma.permission.upsert({
      where: { key: perm.key },
      update: { description: perm.description },
      create: perm,
    });
  }

  console.log("Linking roles to permissions...");
  for (const [roleName, permKeys] of Object.entries(ROLE_PERMISSIONS)) {
    const role = await prisma.role.findUniqueOrThrow({ where: { name: roleName } });
    for (const key of permKeys) {
      const permission = await prisma.permission.findUniqueOrThrow({ where: { key } });
      await prisma.rolePermission.upsert({
        where: { roleId_permissionId: { roleId: role.id, permissionId: permission.id } },
        update: {},
        create: { roleId: role.id, permissionId: permission.id },
      });
    }
  }

  const superadminEmail = process.env.SUPERADMIN_EMAIL;
  if (superadminEmail) {
    const user = await prisma.user.findUnique({ where: { email: superadminEmail } });
    if (!user) {
      console.warn(
        `\nSUPERADMIN_EMAIL (${superadminEmail}) এর জন্য কোনো ব্যবহারকারী পাওয়া যায়নি — ` +
          `প্রথমে সাইটে একবার লগইন করুন, তারপর আবার "npm run db:seed" চালান।\n`,
      );
    } else {
      const role = await prisma.role.findUniqueOrThrow({ where: { name: "SUPERADMIN" } });
      await prisma.userRole.upsert({
        where: { userId_roleId: { userId: user.id, roleId: role.id } },
        update: {},
        create: { userId: user.id, roleId: role.id },
      });
      console.log(`✓ ${superadminEmail} কে SUPERADMIN করা হয়েছে।`);
    }
  } else {
    console.log(
      "\nSUPERADMIN_EMAIL সেট করা নেই — কোনো ব্যবহারকারীকে SUPERADMIN বানানো হয়নি। " +
        ".env এ SUPERADMIN_EMAIL সেট করে আবার সিড চালান।\n",
    );
  }

  console.log("সিডিং সম্পন্ন।");
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
