import { days, trip } from '../src/data/trip.js';

const errors = [];
if (days.length !== 14) errors.push(`Expected 14 days, got ${days.length}`);

days.forEach((day, index) => {
  if (day.number !== index + 1) errors.push(`Day index mismatch at ${index}`);
  if (!trip.cities.some((city) => city.id === day.cityId)) errors.push(`Unknown city ${day.cityId}`);
  if (!day.items.length) errors.push(`D${day.number} has no items`);
  day.items.forEach((item) => {
    if (!Array.isArray(item.coords) || item.coords.length !== 2 || item.coords.some((value) => !Number.isFinite(value))) {
      errors.push(`Invalid coordinates for ${item.name}`);
    }
  });
});

if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}

console.log(`Trip data OK: ${days.length} days, ${days.reduce((sum, day) => sum + day.items.length, 0)} itinerary stops.`);
