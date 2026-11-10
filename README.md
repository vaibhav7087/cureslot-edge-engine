# cureslot-edge-engine

> Serverless edge WhatsApp telemedicine & appointment booking engine powered by Cloudflare Workers and D1 SQLite.

[![Cloudflare Workers](https://img.shields.io/badge/Cloudflare-Workers-F38020.svg)](https://workers.cloudflare.com/)
[![D1 SQLite](https://img.shields.io/badge/Database-D1%20SQLite-0051C3.svg)](https://developers.cloudflare.com/d1/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 📌 Architecture Overview

CureSlot moves appointment triage and WhatsApp bot logic from heavy cloud servers to Cloudflare's global edge network (sub-50ms latency across India).

### Key Architectural Decisions
- **Edge SQLite (Cloudflare D1):** Zero cold-start database reads/writes located within 10ms of the user.
- **Webhook Non-Blocking Queue:** Meta webhooks respond in under 200ms, offloading heavy processing to Cloudflare Queues.
- **Pydantic / Zod Schemas:** Strict type safety on all patient intents.

---

## 🛠️ Schema

```sql
CREATE TABLE clinics (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    phone TEXT NOT NULL UNIQUE
);

CREATE TABLE appointments (
    id TEXT PRIMARY KEY,
    clinic_id TEXT NOT NULL,
    patient_phone TEXT NOT NULL,
    slot_time TEXT NOT NULL,
    status TEXT DEFAULT 'PENDING'
);
```

---

## 👨‍💻 Author

**Vaibhav Kadam**  
- Portfolio: [builtbyvaibhav.bylance.in](https://builtbyvaibhav.bylance.in)  
- GitHub: [@vaibhav7087](https://github.com/vaibhav7087)
