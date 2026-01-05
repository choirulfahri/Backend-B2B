import { Elysia, t } from "elysia";
import { jwt } from "@elysiajs/jwt";
import { compare } from "bcryptjs";
import { prisma } from "../db";

export const authRoutes = (app: Elysia) =>
    app
        .use(
            jwt({
                name: "jwt",
                secret: process.env.JWT_SECRET || "secret",
            })
        )
        .post(
            "/auth/login",
            async ({ body, jwt, set }) => {
                const { email, password } = body;
                const user = await prisma.user.findUnique({
                    where: { email },
                });

                if (!user) {
                    set.status = 401;
                    return { message: "Invalid credentials" };
                }

                const isMatch = await compare(password, user.password);
                if (!isMatch) {
                    set.status = 401;
                    return { message: "Invalid credentials" };
                }

                const token = await jwt.sign({
                    id: user.id,
                    email: user.email,
                });

                return {
                    token,
                    user: {
                        id: user.id,
                        email: user.email,
                        name: user.name,
                    },
                };
            },
            {
                body: t.Object({
                    email: t.String(),
                    password: t.String(),
                }),
            }
        );
