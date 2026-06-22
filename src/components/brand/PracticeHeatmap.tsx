import { View } from 'react-native';
import { Spacing } from '@/constants/theme';
import { useColors } from '@/hooks/use-theme';
import { Text } from '@/components/ui';

/** A GitHub-style contribution grid of the last `weeks` of practice. */
export function PracticeHeatmap({ log, weeks = 13 }: { log: string[]; weeks?: number }) {
  const colors = useColors();
  const set = new Set(log);
  const total = weeks * 7;
  const start = new Date();
  start.setDate(start.getDate() - (total - 1));

  const columns: { iso: string; on: boolean }[][] = [];
  for (let w = 0; w < weeks; w++) {
    const col: { iso: string; on: boolean }[] = [];
    for (let d = 0; d < 7; d++) {
      const day = new Date(start);
      day.setDate(start.getDate() + w * 7 + d);
      const iso = day.toISOString().slice(0, 10);
      col.push({ iso, on: set.has(iso) });
    }
    columns.push(col);
  }

  return (
    <View>
      <View style={{ flexDirection: 'row', gap: 3 }}>
        {columns.map((col, ci) => (
          <View key={ci} style={{ gap: 3 }}>
            {col.map((c, ri) => (
              <View
                key={ri}
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: 3,
                  backgroundColor: c.on ? colors.primary : colors.surfaceElevated,
                  borderWidth: 1,
                  borderColor: colors.border,
                }}
              />
            ))}
          </View>
        ))}
      </View>
      <Text variant="caption" color="textMuted" style={{ marginTop: Spacing.sm }}>
        Last {weeks} weeks · {log.length} {log.length === 1 ? 'day' : 'days'} practiced
      </Text>
    </View>
  );
}
