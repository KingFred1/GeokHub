import { relations } from "drizzle-orm/relations";
import { user, account, sessions } from "./schema";

export const accountRelations = relations(account, ({one}) => ({
	user: one(user, {
		fields: [account.userId],
		references: [user.id]
	}),
}));

export const userRelations = relations(user, ({many}) => ({
	accounts: many(account),
	sessions: many(sessions),
}));

export const sessionsRelations = relations(sessions, ({one}) => ({
	user: one(user, {
		fields: [sessions.userId],
		references: [user.id]
	}),
}));