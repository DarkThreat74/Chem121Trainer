import {
  fsrs,
  Rating,
  State,
  type Card,
  createEmptyCard,
  generatorParameters,
} from "ts-fsrs";

const params = generatorParameters({
  enable_fuzz: true,
  request_retention: 0.9,
  maximum_interval: 365,
});
const f = fsrs(params);

export { Rating, State };

export function newCard(): Card {
  return createEmptyCard(new Date());
}

export function reviewCard(
  card: Card,
  rating: Rating,
  now: Date = new Date()
): { card: Card; due: Date } {
  const result = f.repeat(card, now) as Record<Rating, { card: Card }>;
  const updated = result[rating].card;
  return { card: updated, due: new Date(updated.due) };
}

export function getDueCards(
  cards: Array<{ question_id: string; card: Card }>,
  now: Date = new Date()
): string[] {
  return cards
    .filter((c) => new Date(c.card.due) <= now)
    .sort((a, b) => new Date(a.card.due).getTime() - new Date(b.card.due).getTime())
    .map((c) => c.question_id);
}

export function cardToReviewState(card: Card, userId: string, questionId: string) {
  return {
    user_id: userId,
    question_id: questionId,
    stability: card.stability,
    difficulty: card.difficulty,
    due: new Date(card.due).toISOString(),
    reps: card.reps,
    lapses: card.lapses,
    state: card.state,
    elapsed_days: card.elapsed_days,
    scheduled_days: card.scheduled_days,
    last_review: card.last_review
      ? new Date(card.last_review).toISOString()
      : null,
  };
}

export function reviewStateToCard(state: {
  stability: number;
  difficulty: number;
  due: string;
  reps: number;
  lapses: number;
  state: number;
  elapsed_days: number;
  scheduled_days: number;
  last_review: string | null;
}): Card {
  return {
    stability: state.stability,
    difficulty: state.difficulty,
    due: new Date(state.due),
    reps: state.reps,
    lapses: state.lapses,
    state: state.state as State,
    elapsed_days: state.elapsed_days,
    scheduled_days: state.scheduled_days,
    last_review: state.last_review ? new Date(state.last_review) : undefined,
  };
}
