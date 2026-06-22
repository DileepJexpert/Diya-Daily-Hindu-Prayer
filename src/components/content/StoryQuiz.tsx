import { useState } from 'react';
import { Pressable, View } from 'react-native';
import { Radius, Spacing } from '@/constants/theme';
import { Card, Icon, Text } from '@/components/ui';
import { useColors } from '@/hooks/use-theme';
import type { QuizQuestion } from '@/lib/content/types';

export function StoryQuiz({ questions }: { questions: QuizQuestion[] }) {
  const colors = useColors();
  const [answers, setAnswers] = useState<Record<number, number>>({});

  const answeredAll = Object.keys(answers).length === questions.length;
  const score = questions.reduce((n, q, i) => n + (answers[i] === q.answer ? 1 : 0), 0);

  return (
    <View style={{ gap: Spacing.lg }}>
      {questions.map((q, qi) => {
        const sel = answers[qi];
        const revealed = sel !== undefined;
        return (
          <Card key={qi}>
            <Text variant="subtitle">{qi + 1}. {q.q}</Text>
            <View style={{ gap: Spacing.sm, marginTop: Spacing.md }}>
              {q.options.map((opt, oi) => {
                const chosen = sel === oi;
                const correct = oi === q.answer;
                let borderColor = colors.border;
                let backgroundColor = colors.surface;
                if (revealed && correct) {
                  borderColor = colors.success;
                  backgroundColor = colors.primarySoft;
                } else if (chosen && !correct) {
                  borderColor = colors.danger;
                }
                return (
                  <Pressable
                    key={oi}
                    disabled={revealed}
                    onPress={() => setAnswers((a) => ({ ...a, [qi]: oi }))}
                    style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, padding: Spacing.md, borderRadius: Radius.md, borderWidth: 1.5, borderColor, backgroundColor }}
                  >
                    <Text variant="body" style={{ flex: 1 }}>{opt}</Text>
                    {revealed && correct && <Icon name="checkmark-circle" size={18} color="success" />}
                    {revealed && chosen && !correct && <Icon name="close-circle" size={18} color="danger" />}
                  </Pressable>
                );
              })}
            </View>
          </Card>
        );
      })}

      {answeredAll && (
        <Card elevated style={{ alignItems: 'center' }}>
          <Text variant="h2" color="primary">{score}/{questions.length}</Text>
          <Text variant="body" color="textSecondary" center style={{ marginTop: Spacing.xs }}>
            {score === questions.length ? 'Perfect! Beautifully learned 🌟' : 'Lovely effort — read it together once more!'}
          </Text>
        </Card>
      )}
    </View>
  );
}
