import { relations } from "drizzle-orm/relations";
import { user, account, session, concursos, concursosGanadores } from "./schema";

export const accountRelations = relations(account, ({one}) => ({
	user: one(user, {
		fields: [account.userId],
		references: [user.id]
	}),
}));

export const userRelations = relations(user, ({many}) => ({
	accounts: many(account),
	sessions: many(session),
}));

export const sessionRelations = relations(session, ({one}) => ({
	user: one(user, {
		fields: [session.userId],
		references: [user.id]
	}),
}));

export const concursosGanadoresRelations = relations(concursosGanadores, ({one}) => ({
	concurso: one(concursos, {
		fields: [concursosGanadores.concursoId],
		references: [concursos.id]
	}),
}));

export const concursosRelations = relations(concursos, ({many}) => ({
	concursosGanadores: many(concursosGanadores),
}));