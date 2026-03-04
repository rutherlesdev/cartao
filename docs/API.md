# API v1 - Cartão da Gestante

Base path: `/api/v1`

## Auth
All routes require authenticated Supabase session.

## Roles
- `admin`, `doctor`, `secretary`: full clinical write access.
- `patient`: read-only access to own data.

## Endpoints

### Patients
- `POST /patients`
- `GET /patients/:id`
- `PATCH /patients/:id`
- `POST /patients/:id/pregnancies`

### Pregnancies
- `GET /pregnancies/:id`
- `PATCH /pregnancies/:id/clinical-snapshot`
- `PUT /pregnancies/:id/history`
- `PUT /pregnancies/:id/antecedents`
- `PUT /pregnancies/:id/vaccines`
- `GET /pregnancies/:id/consultations`
- `POST /pregnancies/:id/consultations`
- `GET /pregnancies/:id/exams`
- `POST /pregnancies/:id/exams`
- `GET /pregnancies/:id/ultrasounds`
- `POST /pregnancies/:id/ultrasounds`
- `PUT /pregnancies/:id/observations`
- `GET /pregnancies/:id/medications`
- `POST /pregnancies/:id/medications`
- `GET /pregnancies/:id/card.pdf`

### Consultations
- `PATCH /consultations/:id`

### Attachments
- `POST /attachments/signed-upload`
- `POST /attachments/confirm`

## Example payloads

### `POST /patients`
```json
{
  "full_name": "Maria da Silva",
  "birth_date": "1995-05-10",
  "city": "Petrolina",
  "baby_name": "João"
}
```

### `PATCH /pregnancies/:id/clinical-snapshot`
```json
{
  "dum": "2026-01-01",
  "dpp": "2026-10-08",
  "pregnancy_type": "single",
  "pregnancy_risk": "habitual",
  "planned_pregnancy": true,
  "ig_weeks": 12,
  "ig_days": 3
}
```

### `POST /pregnancies/:id/consultations`
```json
{
  "visit_index": 1,
  "visit_date": "2026-03-01",
  "chief_complaint": "Sem queixas",
  "weight_kg": 62.4,
  "blood_pressure": "110x70",
  "diagnosis_conduct": "Manter pré-natal mensal",
  "signature_name_crm": "Dr. Exemplo - CRM/PE 12345"
}
```

### `POST /attachments/signed-upload`
```json
{
  "pregnancy_id": "UUID",
  "kind": "exam",
  "file_name": "laudo.pdf",
  "mime_type": "application/pdf"
}
```

### `POST /attachments/confirm`
```json
{
  "pregnancy_id": "UUID",
  "kind": "exam",
  "object_path": "clinic-id/pregnancy-id/exam/123-laudo.pdf",
  "file_name": "laudo.pdf",
  "mime_type": "application/pdf",
  "size_bytes": 123456
}
```
