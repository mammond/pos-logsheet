export const calculateTimeframe = (admissionDateStr: string, enrolledDateStr: string): 'Within the Day' | 'Within 72 Hours' | 'Beyond 72 Hours' | '' => {
  if (!admissionDateStr || !enrolledDateStr) return '';

  const admissionDate = new Date(admissionDateStr);
  const enrolledDate = new Date(enrolledDateStr);

  // Reset hours to compare calendar days for simplicity, or keep full timestamp if input supports it.
  // Assuming standard YYYY-MM-DD input which defaults to 00:00 UTC
  
  const diffTime = Math.abs(enrolledDate.getTime() - admissionDate.getTime());
  const diffHours = diffTime / (1000 * 60 * 60);

  if (diffHours <= 24) {
    return 'Within the Day';
  } else if (diffHours <= 72) {
    return 'Within 72 Hours';
  } else {
    return 'Beyond 72 Hours';
  }
};

export const getTimeframeColor = (timeframe: string) => {
  switch (timeframe) {
    case 'Within the Day': return 'text-green-600 bg-green-100 border-green-200';
    case 'Within 72 Hours': return 'text-yellow-600 bg-yellow-100 border-yellow-200';
    case 'Beyond 72 Hours': return 'text-red-600 bg-red-100 border-red-200';
    default: return 'text-gray-600 bg-gray-100';
  }
};