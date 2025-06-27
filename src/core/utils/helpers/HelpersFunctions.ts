export function getStatDisplayName(statName: string): string {
  const statNames: Record<string, string> = {
    'hp': 'HP',
    'attack': 'ATK',
    'defense': 'DEF',
    'special-attack': 'SP. ATK',
    'special-defense': 'SP. DEF',
    'speed': 'SPD',
  };
  return statNames[statName] || statName;
}

export function getStatColor(value: number): string {
  if (value >= 120) return '#10B981';
  if (value >= 90) return '#3B82F6'; 
  if (value >= 60) return '#F59E0B';
  if (value >= 30) return '#EF4444';
  return '#9CA3AF';
}

export function getEvolutionRequirement(evolutionDetail: any): string {
  if (evolutionDetail.min_level) {
    return `📊 Nível ${evolutionDetail.min_level}`;
  }

  if (evolutionDetail.item) {
    const itemName = evolutionDetail.item.name.replace('-', ' ');
    return `🎯 ${itemName}`;
  }

  if (evolutionDetail.trigger?.name === 'trade') {
    return '🤝 Troca';
  }

  if (evolutionDetail.min_happiness) {
    return `💝 Felicidade ${evolutionDetail.min_happiness}`;
  }

  if (evolutionDetail.time_of_day === 'day') {
    return '☀️ Durante o dia';
  }

  if (evolutionDetail.time_of_day === 'night') {
    return '🌙 Durante a noite';
  }

  return '✨ Condição especial';
}