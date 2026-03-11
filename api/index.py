from fastapi import FastAPI, HTTPException, Header
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, field_validator
from typing import Optional
import os
import hashlib
import secrets
import json

app = FastAPI(docs_url="/api/docs", openapi_url="/api/openapi.json")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------------------------------------------------------
# Config
# ---------------------------------------------------------------------------
DATABASE_URL = os.environ.get("DATABASE_URL")
JWT_SECRET = os.environ.get("JWT_SECRET", "dev-secret-change-in-production")
JWT_ALGORITHM = "HS256"
JWT_EXPIRY_HOURS = 72
SETUP_SECRET = os.environ.get("SETUP_SECRET", "lensmatch-setup-2026")

VALID_STYLES = [
    "dark_moody", "bright_airy", "editorial",
    "documentary", "fine_art", "classic_timeless",
]

# ---------------------------------------------------------------------------
# Database helpers
# ---------------------------------------------------------------------------
def get_conn():
    if not DATABASE_URL:
        return None
    import psycopg2
    import psycopg2.extras
    return psycopg2.connect(DATABASE_URL)


def query(sql: str, params: tuple = (), fetch_one=False, fetch_all=False):
    conn = get_conn()
    if not conn:
        return None
    try:
        import psycopg2.extras
        with conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cur:
            cur.execute(sql, params)
            if fetch_one:
                row = cur.fetchone()
                return dict(row) if row else None
            if fetch_all:
                return [dict(r) for r in cur.fetchall()]
            conn.commit()
            return True
    except Exception as e:
        conn.rollback()
        raise e
    finally:
        conn.close()


def execute(sql: str, params: tuple = ()):
    return query(sql, params, fetch_one=False, fetch_all=False)


def use_db() -> bool:
    return DATABASE_URL is not None


# ---------------------------------------------------------------------------
# Auth helpers
# ---------------------------------------------------------------------------
def hash_password(password: str) -> str:
    salt = secrets.token_hex(32)
    key = hashlib.pbkdf2_hmac(
        "sha256", password.encode(), salt.encode(), 100_000
    ).hex()
    return f"{salt}:{key}"


def verify_password(password: str, stored: str) -> bool:
    salt, key = stored.split(":")
    new_key = hashlib.pbkdf2_hmac(
        "sha256", password.encode(), salt.encode(), 100_000
    ).hex()
    return new_key == key


def create_token(photographer_id: str) -> str:
    import jwt as pyjwt
    from datetime import datetime, timedelta, timezone

    payload = {
        "sub": photographer_id,
        "exp": datetime.now(timezone.utc) + timedelta(hours=JWT_EXPIRY_HOURS),
        "iat": datetime.now(timezone.utc),
    }
    return pyjwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)


def decode_token(token: str) -> str:
    import jwt as pyjwt

    try:
        payload = pyjwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        return payload["sub"]
    except pyjwt.ExpiredSignatureError:
        raise HTTPException(401, "Token expired")
    except pyjwt.InvalidTokenError:
        raise HTTPException(401, "Invalid token")


def get_current_user(authorization: Optional[str] = None) -> str:
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(401, "Not authenticated")
    return decode_token(authorization.split(" ")[1])


# ---------------------------------------------------------------------------
# Pydantic schemas
# ---------------------------------------------------------------------------
class SignupIn(BaseModel):
    email: str
    password: str
    name: str

    @field_validator("password")
    @classmethod
    def password_strength(cls, v: str) -> str:
        if len(v) < 8:
            raise ValueError("Password must be at least 8 characters")
        return v


class LoginIn(BaseModel):
    email: str
    password: str


class ProfileUpdate(BaseModel):
    name: Optional[str] = None
    bio: Optional[str] = None
    styles: Optional[list[str]] = None
    min_budget: Optional[int] = None
    available_dates: Optional[list[str]] = None
    location: Optional[str] = None
    avatar_url: Optional[str] = None


class PhotoIn(BaseModel):
    url: str
    caption: Optional[str] = ""
    style: Optional[str] = ""


class LeadIn(BaseModel):
    client_name: str
    client_email: str
    event_type: str
    selected_styles: list[str]
    budget: int
    event_date: str
    location: Optional[str] = None
    notes: Optional[str] = None

    @field_validator("selected_styles", mode="before")
    @classmethod
    def validate_styles(cls, v: list[str]) -> list[str]:
        for s in v:
            if s not in VALID_STYLES:
                raise ValueError(f"Invalid style: {s}")
        return v

    @field_validator("budget")
    @classmethod
    def validate_budget(cls, v: int) -> int:
        if v < 500:
            raise ValueError("Minimum budget is $500")
        return v


class LeadStatusUpdate(BaseModel):
    status: str

    @field_validator("status")
    @classmethod
    def validate_status(cls, v: str) -> str:
        if v not in ("NEW", "QUALIFIED", "CONTACTED", "BOOKED", "DECLINED"):
            raise ValueError(f"Invalid status: {v}")
        return v


# ---------------------------------------------------------------------------
# Mock data (fallback when DATABASE_URL not set)
# ---------------------------------------------------------------------------
MOCK_PHOTOGRAPHERS = [
    {
        "id": "ph_001", "name": "Elena Voss", "email": "elena@example.com",
        "styles": ["dark_moody", "editorial", "fine_art"],
        "min_budget": 800,
        "available_dates": [
            "2026-04-12", "2026-04-19", "2026-05-03", "2026-05-10",
            "2026-05-17", "2026-06-07", "2026-06-14", "2026-06-21", "2026-07-05",
        ],
        "rating": 4.9,
    },
    {
        "id": "ph_002", "name": "Marcus Chen", "email": "marcus@example.com",
        "styles": ["bright_airy", "documentary", "classic_timeless"],
        "min_budget": 600,
        "available_dates": [
            "2026-04-05", "2026-04-19", "2026-04-26", "2026-05-10",
            "2026-05-24", "2026-06-07", "2026-06-28", "2026-07-12",
        ],
        "rating": 4.8,
    },
    {
        "id": "ph_003", "name": "Sofia Ramirez", "email": "sofia@example.com",
        "styles": ["editorial", "bright_airy", "fine_art"],
        "min_budget": 500,
        "available_dates": [
            "2026-04-12", "2026-04-26", "2026-05-03", "2026-05-17",
            "2026-05-31", "2026-06-14", "2026-06-21", "2026-07-05", "2026-07-19",
        ],
        "rating": 4.7,
    },
    {
        "id": "ph_004", "name": "James Whitfield", "email": "james@example.com",
        "styles": ["classic_timeless", "documentary", "dark_moody"],
        "min_budget": 750,
        "available_dates": [
            "2026-04-05", "2026-04-12", "2026-05-10", "2026-05-24",
            "2026-06-07", "2026-06-28", "2026-07-12", "2026-07-26",
        ],
        "rating": 4.9,
    },
]

MOCK_LEADS = [
    {
        "id": "lead_001", "clientName": "Amara Johnson",
        "clientEmail": "amara@example.com", "eventType": "wedding",
        "selectedStyles": ["dark_moody", "editorial"], "budget": 3500,
        "eventDate": "2026-06-14", "location": "Brooklyn, NY",
        "notes": "Intimate ceremony, 80 guests. Love dramatic lighting.",
        "matchScore": 0.94, "status": "QUALIFIED",
        "createdAt": "2026-03-08T14:30:00Z",
    },
    {
        "id": "lead_002", "clientName": "David Park",
        "clientEmail": "david.p@example.com", "eventType": "portrait",
        "selectedStyles": ["fine_art", "editorial"], "budget": 1200,
        "eventDate": "2026-05-03", "location": "Manhattan, NY",
        "notes": "Executive headshots for a creative agency rebrand.",
        "matchScore": 0.87, "status": "QUALIFIED",
        "createdAt": "2026-03-09T09:15:00Z",
    },
    {
        "id": "lead_003", "clientName": "Priya Mehta",
        "clientEmail": "priya.m@example.com", "eventType": "wedding",
        "selectedStyles": ["bright_airy", "classic_timeless"], "budget": 5000,
        "eventDate": "2026-07-19", "location": "Hudson Valley, NY",
        "notes": "Outdoor garden wedding, golden hour ceremony.",
        "matchScore": 0.78, "status": "NEW",
        "createdAt": "2026-03-10T11:45:00Z",
    },
    {
        "id": "lead_004", "clientName": "Leo Fischer",
        "clientEmail": "leo.f@example.com", "eventType": "commercial",
        "selectedStyles": ["editorial", "dark_moody"], "budget": 2800,
        "eventDate": "2026-05-17", "location": "SoHo, NY",
        "notes": "Product shoot for luxury watch brand. Need cinematic feel.",
        "matchScore": 0.91, "status": "CONTACTED",
        "createdAt": "2026-03-07T16:20:00Z",
    },
]


# ---------------------------------------------------------------------------
# Match algorithm
# ---------------------------------------------------------------------------
def compute_match(lead_styles, lead_budget, lead_date, ph_styles, ph_min, ph_dates):
    overlap = set(lead_styles) & set(ph_styles)
    style_score = len(overlap) / max(len(lead_styles), 1)
    budget_score = 1.0 if lead_budget >= ph_min else lead_budget / ph_min
    avail_score = 1.0 if lead_date in ph_dates else 0.0
    return round(style_score * 0.50 + budget_score * 0.25 + avail_score * 0.25, 2)


# ---------------------------------------------------------------------------
# Setup / migration endpoint
# ---------------------------------------------------------------------------
@app.post("/api/setup")
async def setup(secret: str = ""):
    if secret != SETUP_SECRET:
        raise HTTPException(403, "Invalid setup secret")
    if not use_db():
        raise HTTPException(400, "DATABASE_URL not configured")

    schema_sql = """
    CREATE EXTENSION IF NOT EXISTS pgcrypto;

    CREATE TABLE IF NOT EXISTS photographers (
        id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        name TEXT NOT NULL,
        bio TEXT DEFAULT '',
        styles TEXT[] DEFAULT '{}',
        min_budget INTEGER DEFAULT 500,
        available_dates TEXT[] DEFAULT '{}',
        location TEXT DEFAULT '',
        avatar_url TEXT DEFAULT '',
        rating FLOAT DEFAULT 5.0,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS photos (
        id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
        photographer_id TEXT NOT NULL REFERENCES photographers(id) ON DELETE CASCADE,
        url TEXT NOT NULL,
        caption TEXT DEFAULT '',
        style TEXT DEFAULT '',
        sort_order INTEGER DEFAULT 0,
        created_at TIMESTAMPTZ DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS leads (
        id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
        client_name TEXT NOT NULL,
        client_email TEXT NOT NULL,
        event_type TEXT NOT NULL,
        selected_styles TEXT[] DEFAULT '{}',
        budget INTEGER NOT NULL,
        event_date TEXT NOT NULL,
        location TEXT DEFAULT '',
        notes TEXT DEFAULT '',
        match_score FLOAT,
        status TEXT DEFAULT 'NEW',
        photographer_id TEXT REFERENCES photographers(id),
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
    );

    CREATE INDEX IF NOT EXISTS idx_photos_photographer ON photos(photographer_id);
    CREATE INDEX IF NOT EXISTS idx_leads_photographer ON leads(photographer_id);
    CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
    """
    execute(schema_sql)
    return {"status": "ok", "message": "Tables created successfully"}


# ---------------------------------------------------------------------------
# Health
# ---------------------------------------------------------------------------
@app.get("/api/health")
async def health():
    db_ok = False
    if use_db():
        try:
            result = query("SELECT 1 as ok", fetch_one=True)
            db_ok = result is not None
        except Exception:
            pass
    return {"status": "ok", "database": "connected" if db_ok else "not configured"}


# ---------------------------------------------------------------------------
# Auth endpoints
# ---------------------------------------------------------------------------
@app.post("/api/auth/signup")
async def signup(data: SignupIn):
    if not use_db():
        raise HTTPException(503, "Database not configured")

    existing = query(
        "SELECT id FROM photographers WHERE email = %s", (data.email,), fetch_one=True
    )
    if existing:
        raise HTTPException(409, "Email already registered")

    pw_hash = hash_password(data.password)
    photographer = query(
        """INSERT INTO photographers (email, password_hash, name)
           VALUES (%s, %s, %s) RETURNING id, email, name""",
        (data.email, pw_hash, data.name),
        fetch_one=True,
    )
    if not photographer:
        raise HTTPException(500, "Failed to create account")

    token = create_token(photographer["id"])
    return {
        "token": token,
        "photographer": {
            "id": photographer["id"],
            "email": photographer["email"],
            "name": photographer["name"],
        },
    }


@app.post("/api/auth/login")
async def login(data: LoginIn):
    if not use_db():
        raise HTTPException(503, "Database not configured")

    photographer = query(
        "SELECT id, email, name, password_hash FROM photographers WHERE email = %s",
        (data.email,),
        fetch_one=True,
    )
    if not photographer:
        raise HTTPException(401, "Invalid email or password")

    if not verify_password(data.password, photographer["password_hash"]):
        raise HTTPException(401, "Invalid email or password")

    token = create_token(photographer["id"])
    return {
        "token": token,
        "photographer": {
            "id": photographer["id"],
            "email": photographer["email"],
            "name": photographer["name"],
        },
    }


@app.get("/api/auth/me")
async def get_me(authorization: Optional[str] = Header(None)):
    user_id = get_current_user(authorization)

    photographer = query(
        """SELECT id, email, name, bio, styles, min_budget,
                  available_dates, location, avatar_url, rating, created_at
           FROM photographers WHERE id = %s""",
        (user_id,),
        fetch_one=True,
    )
    if not photographer:
        raise HTTPException(404, "Photographer not found")

    # Get photo count
    count = query(
        "SELECT COUNT(*) as cnt FROM photos WHERE photographer_id = %s",
        (user_id,),
        fetch_one=True,
    )

    photographer["photo_count"] = count["cnt"] if count else 0
    return {"photographer": photographer}


# ---------------------------------------------------------------------------
# Profile
# ---------------------------------------------------------------------------
@app.put("/api/profile")
async def update_profile(
    data: ProfileUpdate, authorization: Optional[str] = Header(None)
):
    user_id = get_current_user(authorization)

    updates = []
    params = []
    if data.name is not None:
        updates.append("name = %s")
        params.append(data.name)
    if data.bio is not None:
        updates.append("bio = %s")
        params.append(data.bio)
    if data.styles is not None:
        updates.append("styles = %s")
        params.append(data.styles)
    if data.min_budget is not None:
        updates.append("min_budget = %s")
        params.append(data.min_budget)
    if data.available_dates is not None:
        updates.append("available_dates = %s")
        params.append(data.available_dates)
    if data.location is not None:
        updates.append("location = %s")
        params.append(data.location)
    if data.avatar_url is not None:
        updates.append("avatar_url = %s")
        params.append(data.avatar_url)

    if not updates:
        raise HTTPException(400, "No fields to update")

    updates.append("updated_at = NOW()")
    params.append(user_id)

    sql = f"UPDATE photographers SET {', '.join(updates)} WHERE id = %s RETURNING id"
    result = query(sql, tuple(params), fetch_one=True)
    if not result:
        raise HTTPException(404, "Photographer not found")

    return {"status": "ok"}


# ---------------------------------------------------------------------------
# Photos / Portfolio
# ---------------------------------------------------------------------------
@app.get("/api/photos")
async def get_photos(authorization: Optional[str] = Header(None)):
    user_id = get_current_user(authorization)

    photos = query(
        """SELECT id, url, caption, style, sort_order, created_at
           FROM photos WHERE photographer_id = %s
           ORDER BY sort_order ASC, created_at DESC""",
        (user_id,),
        fetch_all=True,
    )
    return {"photos": photos or []}


@app.post("/api/photos")
async def add_photo(data: PhotoIn, authorization: Optional[str] = Header(None)):
    user_id = get_current_user(authorization)

    # Check limit
    count = query(
        "SELECT COUNT(*) as cnt FROM photos WHERE photographer_id = %s",
        (user_id,),
        fetch_one=True,
    )
    if count and count["cnt"] >= 20:
        raise HTTPException(400, "Maximum 20 photos allowed")

    next_order = (count["cnt"] if count else 0) + 1

    photo = query(
        """INSERT INTO photos (photographer_id, url, caption, style, sort_order)
           VALUES (%s, %s, %s, %s, %s)
           RETURNING id, url, caption, style, sort_order, created_at""",
        (user_id, data.url, data.caption or "", data.style or "", next_order),
        fetch_one=True,
    )
    return {"photo": photo}


@app.delete("/api/photos/{photo_id}")
async def delete_photo(photo_id: str, authorization: Optional[str] = Header(None)):
    user_id = get_current_user(authorization)

    result = query(
        "DELETE FROM photos WHERE id = %s AND photographer_id = %s RETURNING id",
        (photo_id, user_id),
        fetch_one=True,
    )
    if not result:
        raise HTTPException(404, "Photo not found")
    return {"status": "ok"}


# Get a specific photographer's public portfolio
@app.get("/api/photographers/{photographer_id}/photos")
async def get_photographer_photos(photographer_id: str):
    if not use_db():
        return {"photos": []}

    photos = query(
        """SELECT id, url, caption, style FROM photos
           WHERE photographer_id = %s ORDER BY sort_order ASC""",
        (photographer_id,),
        fetch_all=True,
    )
    return {"photos": photos or []}


# ---------------------------------------------------------------------------
# Available dates (public)
# ---------------------------------------------------------------------------
@app.get("/api/available-dates")
async def available_dates():
    if use_db():
        rows = query(
            "SELECT available_dates FROM photographers", fetch_all=True
        )
        if rows:
            all_dates: set[str] = set()
            for row in rows:
                if row.get("available_dates"):
                    all_dates.update(row["available_dates"])
            if all_dates:
                return {"dates": sorted(all_dates)}

    # Fallback to mock
    all_dates_mock: set[str] = set()
    for ph in MOCK_PHOTOGRAPHERS:
        all_dates_mock.update(ph["available_dates"])
    return {"dates": sorted(all_dates_mock)}


# ---------------------------------------------------------------------------
# Match endpoint (public — from intake form)
# ---------------------------------------------------------------------------
@app.post("/api/match")
async def match(lead: LeadIn):
    if lead.budget < 500:
        raise HTTPException(422, "Minimum budget is $500")

    results = []

    if use_db():
        photographers = query(
            "SELECT id, name, styles, min_budget, available_dates, rating FROM photographers",
            fetch_all=True,
        )
        if photographers:
            for ph in photographers:
                score = compute_match(
                    lead.selected_styles,
                    lead.budget,
                    lead.event_date,
                    ph.get("styles") or [],
                    ph.get("min_budget") or 500,
                    ph.get("available_dates") or [],
                )
                overlap = list(
                    set(lead.selected_styles) & set(ph.get("styles") or [])
                )
                available = lead.event_date in (ph.get("available_dates") or [])

                if score >= 0.4:
                    if score >= 0.75:
                        msg = f"Excellent match! {ph['name']} specialises in your chosen aesthetic."
                    elif score >= 0.5:
                        msg = f"Good match. {ph['name']} covers several of your preferred styles."
                    else:
                        msg = f"Partial match. {ph['name']} may still be a great fit."

                    results.append({
                        "photographer_id": ph["id"],
                        "photographer_name": ph["name"],
                        "match_score": score,
                        "styles_overlap": overlap,
                        "available": available,
                        "message": msg,
                    })

                    # Save lead linked to this photographer
                    query(
                        """INSERT INTO leads
                           (client_name, client_email, event_type, selected_styles,
                            budget, event_date, location, notes, match_score,
                            status, photographer_id)
                           VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)""",
                        (
                            lead.client_name, lead.client_email, lead.event_type,
                            lead.selected_styles, lead.budget, lead.event_date,
                            lead.location or "", lead.notes or "", score,
                            "QUALIFIED" if score >= 0.6 else "NEW",
                            ph["id"],
                        ),
                    )

            results.sort(key=lambda r: r["match_score"], reverse=True)
            return results

    # Fallback: mock matching
    for ph in MOCK_PHOTOGRAPHERS:
        score = compute_match(
            lead.selected_styles, lead.budget, lead.event_date,
            ph["styles"], ph["min_budget"], ph["available_dates"],
        )
        overlap = list(set(lead.selected_styles) & set(ph["styles"]))
        available = lead.event_date in ph["available_dates"]

        if score >= 0.4:
            if score >= 0.75:
                msg = f"Excellent match! {ph['name']} specialises in your chosen aesthetic."
            elif score >= 0.5:
                msg = f"Good match. {ph['name']} covers several of your preferred styles."
            else:
                msg = f"Partial match. {ph['name']} may still be a great fit."
            results.append({
                "photographer_name": ph["name"],
                "match_score": score,
                "styles_overlap": overlap,
                "available": available,
                "message": msg,
            })

    results.sort(key=lambda r: r["match_score"], reverse=True)
    return results


# ---------------------------------------------------------------------------
# Leads (authenticated — photographer dashboard)
# ---------------------------------------------------------------------------
@app.get("/api/leads")
async def get_leads(authorization: Optional[str] = Header(None)):
    # If no auth header or no DB, return mock leads
    if not authorization or not use_db():
        return {"leads": MOCK_LEADS}

    try:
        user_id = get_current_user(authorization)
    except HTTPException:
        return {"leads": MOCK_LEADS}

    rows = query(
        """SELECT id, client_name, client_email, event_type, selected_styles,
                  budget, event_date, location, notes, match_score, status, created_at
           FROM leads WHERE photographer_id = %s
           ORDER BY created_at DESC""",
        (user_id,),
        fetch_all=True,
    )

    if not rows:
        return {"leads": []}

    leads = []
    for r in rows:
        leads.append({
            "id": r["id"],
            "clientName": r["client_name"],
            "clientEmail": r["client_email"],
            "eventType": r["event_type"],
            "selectedStyles": r["selected_styles"] or [],
            "budget": r["budget"],
            "eventDate": r["event_date"],
            "location": r["location"],
            "notes": r["notes"],
            "matchScore": r["match_score"],
            "status": r["status"],
            "createdAt": r["created_at"].isoformat() if r.get("created_at") else "",
        })
    return {"leads": leads}


@app.put("/api/leads/{lead_id}/status")
async def update_lead_status(
    lead_id: str, data: LeadStatusUpdate,
    authorization: Optional[str] = Header(None),
):
    user_id = get_current_user(authorization)

    result = query(
        """UPDATE leads SET status = %s, updated_at = NOW()
           WHERE id = %s AND photographer_id = %s RETURNING id""",
        (data.status, lead_id, user_id),
        fetch_one=True,
    )
    if not result:
        raise HTTPException(404, "Lead not found")
    return {"status": "ok"}
