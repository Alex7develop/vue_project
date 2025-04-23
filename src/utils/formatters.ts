/**
 * Форматирует время в секундах в строку вида "Xd Yh" или "Yh Zm".
 * @param seconds - Время в секундах
 * @returns Отформатированная строка или '-', если входные данные некорректны
 */
export function formatUptime(seconds: number | null | undefined): string {
  if (seconds == null || seconds < 0) {
    return '-';
  }

  const days = Math.floor(seconds / (3600 * 24));
  const hours = Math.floor((seconds % (3600 * 24)) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  let result = '';
  if (days > 0) {
    result += `${days}d `;
  }
  if (hours > 0 || days > 0) { // Показываем часы, если есть дни или часы > 0
    result += `${String(hours).padStart(days > 0 ? 2 : 1, '0')}h `;
  }
  // Показываем минуты, если есть часы/дни или минуты > 0
  if (minutes > 0 || hours > 0 || days > 0) {
    result += `${String(minutes).padStart(2, '0')}m`;
  } else if (seconds > 0) {
    // Если аптайм меньше минуты, показываем секунды или "< 1m"
    result = '< 1m'; // Или можно показать секунды: `${seconds}s`
  } else {
    // Если аптайм 0 секунд
    result = '0m';
  }

  return result.trim() || '0m'; // Возвращаем результат или '0m' если аптайм был 0
}

/**
 * Форматирует дату timestamp в строку "DD Mon" (e.g., "01 Apr")
 * @param timestampSeconds - Unix timestamp в секундах
 * @returns Отформатированная строка даты
 */
export function formatDate(timestampSeconds: number): string {
  const date = new Date(timestampSeconds * 1000);
  const day = date.getDate().toString().padStart(2, '0');
  const month = date.toLocaleString('en-US', { month: 'short' }); // 'en-US' для 'Apr'
  return `${day} ${month}`;
}

// Добавьте другие форматеры при необходимости 