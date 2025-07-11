# Fix para AppointmentsPage.tsx

## Problemas identificados:

1. **businessHours es undefined**: El API está devolviendo un formato diferente al esperado
2. **Loop infinito**: Las funciones se re-crean en cada render
3. **Error TypeError**: No se valida si businessHours existe antes de acceder a .length

## Soluciones:

### 1. Verificar response del API
El API devuelve:
```json
{
  "working_days": [...],
  "morning_hours": "09:00 - 13:30",
  "evening_hours": "17:00 - 20:30", 
  "available_slots": ["09:00", "09:30", ...]
}
```

Pero el frontend busca `response.time_slots` que no existe.

### 2. Cambiar en loadBusinessHours:
```tsx
const response = await appointmentService.getBusinessHours();
setBusinessHours(response.available_slots || []); // Cambiar de time_slots a available_slots
```

### 3. Mejorar validación en timeSlots:
```tsx
const timeSlots = (businessHours && businessHours.length > 0) ? businessHours : [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30',
  '17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30'
];
```

### 4. Usar useCallback para las funciones:
```tsx
const validateSelectedDate = useCallback(async (selectedDate: string) => {
  // ... código existente
}, []);

const loadBookedTimes = useCallback(async (selectedDate: string) => {
  // ... código existente  
}, []);
```
