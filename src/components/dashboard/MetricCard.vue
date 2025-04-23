<template>
  <q-card flat class="metric-card text-white">
    <!-- Иконка в углу -->
    <q-icon :name="icon" size="2.5em" color="#5A9EEE" class="corner-icon" />

    <q-card-section class="q-pb-sm"> <!-- Уменьшаем нижний padding -->
      <!-- Текстовая информация -->
      <div class="text-caption text-grey-6 card-title">{{ title }} {{ unit ? `(${unit})` : '' }}</div>
      <div class="text-h5 q-my-xs value">{{ value !== null ? value : '-' }}</div>
    </q-card-section>

    <q-card-section class="q-pt-none"> <!-- Убираем верхний padding -->
      <div class="text-caption text-grey-6 description">{{ description }}</div>
    </q-card-section>

  </q-card>
</template>

<script setup lang="ts">
interface Props {
  title: string;
  value: string | number | null;
  unit?: string;
  description: string;
  icon: string;
}

defineProps<Props>();
</script>

<style scoped lang="scss">
.metric-card {
  background-color: #2B2E3B;
  border-radius: 12px;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center; // Центрируем контент по вертикали для лучшего вида
  position: relative; // Для позиционирования иконки
  padding: 16px; // Добавляем общий padding для текста
}

.corner-icon {
  position: absolute;
  top: 16px; // Отступ сверху
  right: 16px; // Отступ справа
  // opacity: 0.8; // Убираем прозрачность, иконки яркие
}

.card-title {
  // Стили заголовка
}

.value {
  font-weight: 500;
}

.description {
  // Стили описания
}

/* Убираем лишние QCardSection, т.к. используем padding на .metric-card */
.q-card__section {
  padding: 0; // Убираем стандартные падинги секций
}
.q-card__section--vert {
   padding: 0;
}

</style> 