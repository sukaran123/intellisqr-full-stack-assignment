import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class UserModel {
    static async findByUid(uid: string) {
        return prisma.user.findUnique({
            where: { uid }
        });
    }

    static async findByEmail(email: string) {
        return prisma.user.findUnique({
            where: { email }
        });
    }

    static async createUser(data: { uid: string; email: string; password: string }) {
        return prisma.user.create({
            data
        });
    }
}