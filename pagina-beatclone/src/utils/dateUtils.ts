export function getTodayDateFormatted(): string {
  const today = new Date();
  const day = String(today.getDate()).padStart(2, '0');
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const year = today.getFullYear();
  return `${day}/${month}/${year}`;
}

export function getTodayDateText(): string {
  const today = new Date();
  const day = String(today.getDate()).padStart(2, '0');
  const monthNames = [
    "janeiro", "fevereiro", "março", "abril", "maio", "junho",
    "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"
  ];
  const monthName = monthNames[today.getMonth()];
  return `${day} de ${monthName}`;
}

// Mantidos como aliases para a data atual (hoje) garantindo compatibilidade total
export function getTomorrowDateFormatted(): string {
  return getTodayDateFormatted();
}

export function getTomorrowDateText(): string {
  return getTodayDateText();
}
