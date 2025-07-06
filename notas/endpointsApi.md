# Endpoints API REST – Tienda de Novias

## Citas (Appointments)
| Método | Endpoint                        | Descripción                                                | Permisos           |
|--------|---------------------------------|------------------------------------------------------------|--------------------|
| GET    | `/api/appointments/`            | Listar todas las citas (admin), o citas propias (clienta)  | Admin/Clienta      |
| POST   | `/api/appointments/`            | Crear una cita nueva                                       | Público            |
| GET    | `/api/appointments/{id}/`       | Ver detalles de una cita                                   | Admin/Clienta      |
| PUT    | `/api/appointments/{id}/`       | Editar cita                                                | Admin/Clienta      |
| PATCH  | `/api/appointments/{id}/`       | Editar parcialmente la cita                                | Admin/Clienta      |
| DELETE | `/api/appointments/{id}/`       | Cancelar/eliminar cita                                     | Admin/Clienta      |
| POST   | `/api/appointments/check-availability/` | Comprobar si fecha/hora está disponible                   | Público            |
| POST   | `/api/appointments/{id}/confirm/`      | Confirmar cita manualmente y enviar notificación           | Admin              |
| POST   | `/api/appointments/{id}/send-reminder/`| Enviar recordatorio (WhatsApp/email según preferencia)     | Admin              |

---

## Vestidos (Dresses)
| Método | Endpoint                | Descripción                           | Permisos      |
|--------|-------------------------|---------------------------------------|---------------|
| GET    | `/api/dresses/`         | Listar todos los vestidos             | Público       |
| POST   | `/api/dresses/`         | Crear un vestido nuevo                | Admin         |
| GET    | `/api/dresses/{id}/`    | Ver detalles de un vestido            | Público       |
| PUT    | `/api/dresses/{id}/`    | Editar vestido                        | Admin         |
| PATCH  | `/api/dresses/{id}/`    | Editar parcialmente                   | Admin         |
| DELETE | `/api/dresses/{id}/`    | Eliminar vestido                      | Admin         |

---

## Novias reales / Testimonios (BrideTestimonial)
| Método | Endpoint                      | Descripción                             | Permisos      |
|--------|-------------------------------|-----------------------------------------|---------------|
| GET    | `/api/bride-testimonials/`    | Listar todos los testimonios            | Público       |
| POST   | `/api/bride-testimonials/`    | Crear un testimonio nuevo               | Admin         |
| GET    | `/api/bride-testimonials/{id}/`| Ver detalles de un testimonio           | Público       |
| PUT    | `/api/bride-testimonials/{id}/`| Editar testimonio                       | Admin         |
| PATCH  | `/api/bride-testimonials/{id}/`| Editar parcialmente                     | Admin         |
| DELETE | `/api/bride-testimonials/{id}/`| Eliminar testimonio                     | Admin         |

---

## Usuarios (User)
- Se recomienda usar los endpoints estándar de Django Rest Auth o Allauth para registro, login, logout y gestión de usuario.

---

## (Opcional) Horario (Schedule)
| Método | Endpoint                | Descripción                         | Permisos      |
|--------|-------------------------|-------------------------------------|---------------|
| GET    | `/api/schedule/`        | Consultar horario de apertura       | Público       |
| PUT    | `/api/schedule/`        | Editar horario                      | Admin         |