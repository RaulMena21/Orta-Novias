# Modelos Django para Tienda de Novias

## 1. Appointment (Cita)
Modelo para gestionar las reservas de citas, integrando confirmación automática o manual y preferencia de comunicación.

| Campo                 | Tipo           | Descripción                                                                                     |
|-----------------------|----------------|-------------------------------------------------------------------------------------------------|
| name                  | CharField      | Nombre de la clienta                                                                            |
| phone                 | CharField      | Teléfono (opcional, pero requerido si no se da email)                                           |
| email                 | EmailField     | Email (opcional, pero requerido si no se da teléfono)                                           |
| confirmation_method   | CharField      | Método de confirmación: "whatsapp" o "email"                                                    |
| date                  | DateField      | Fecha solicitada para la cita                                                                   |
| time                  | TimeField      | Hora solicitada para la cita                                                                    |
| status                | CharField      | Estado de la cita: "pending", "confirmed", "cancelled"                                          |
| comment               | TextField      | Comentario opcional de la clienta                                                               |
| auto_confirmed        | BooleanField   | Si la cita fue confirmada automáticamente o requiere validación manual                          |
| created_at            | DateTimeField  | Fecha de creación de la cita                                                                    |

**Reglas de validación:**
- Debe introducirse al menos teléfono o email, pero no ambos a la vez.
- Si elige confirmación por WhatsApp, el teléfono es obligatorio.
- Si elige confirmación por email, el email es obligatorio.

---

## 2. Dress (Vestido)
Modelo para los vestidos disponibles en la tienda.

| Campo           | Tipo         | Descripción                                  |
|-----------------|--------------|----------------------------------------------|
| name            | CharField    | Nombre o referencia del vestido              |
| description     | TextField    | Descripción breve                            |
| image           | ImageField   | Imagen principal del vestido                 |
| style           | CharField    | Estilo: clásico, bohemio, romántico, etc.    |
| available       | BooleanField | Si está disponible actualmente               |
| created_at      | DateTimeField| Fecha de creación/enlistado                  |

---

## 3. BrideTestimonial (Novia Real/Testimonio)
Modelo para mostrar clientas reales y sus testimonios.

| Campo         | Tipo         | Descripción                                           |
|---------------|--------------|-------------------------------------------------------|
| bride_name    | CharField    | Nombre de la clienta (puede ser solo el nombre)       |
| testimonial   | TextField    | Testimonio escrito                                    |
| image         | ImageField   | Foto de la clienta vestida                            |
| wedding_date  | DateField    | Fecha de la boda                                      |
| created_at    | DateTimeField| Fecha de publicación del testimonio                   |

---

## 4. User (Usuario)
Se usará el sistema de usuarios de Django, permitiendo roles básicos (admin, clienta). Puede extenderse si fuera necesario para permisos personalizados.

---

## 5. (Opcional) Horario (para gestión de agenda)
Si se desea controlar horario de apertura/cierre o días especiales.

| Campo         | Tipo         | Descripción                                  |
|---------------|--------------|----------------------------------------------|
| day_of_week   | CharField    | Día de la semana                             |
| open_time     | TimeField    | Hora de apertura                             |
| close_time    | TimeField    | Hora de cierre                               |
| closed        | BooleanField | Si la tienda está cerrada ese día            |