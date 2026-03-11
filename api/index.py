from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr, field_validator
from typing import Optional
from datetime import date

app = FastAPI(docs_url="/api/docs", openapi_url="/api/openapi.json")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------------------------------------------------------
# Pydantic schemas
# ---------------------------------------------------------------------------

VALID_STYLES = [
    "dark_moody",
    "bright_airy",
    "editorial",
    "documentary",
    "fine_art",
    "classic_timeless",
]


class LeadIn(BaseModel):
    client_name: str
    client_email: str
    event_type: str
    selected_styles: list[str]
    budget: int
    event_date: str  # ISO format YYYY-MM-DD
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


class Photographer(BaseModel):
    id: str
    name: str
    styles: list[str]
    min_budget: int
    available_dates: list[str]
    rating: float


class MatchResult(BaseModel):
    photographer_name: str
    match_score: float
    styles_overlap: list[str]
    available: bool
    message: str


# ---------------------------------------------------------------------------
# Mock data
# ---------------------------------------------------------------------------

MOCK_PHOTOGRAPHERS: list[Photographer] = [
    Photographer(
        id="ph_001",
        name="Elena Voss",
        styles=["dark_moody", "editorial", "fine_art"],
        min_budget=800,
        available_dates=[
            "2026-04-12",
            "2026-04-19",
            "2026-05-03",
            "2026-05-10",
            "2026-05-17",
            "2026-06-07",
            "2026-06-14",
            "2026-06-21",
            "2026-07-05",
        ],
        rating=4.9,
    ),
    Photographer(
        id="ph_002",
        name="Marcus Chen",
        styles=["bright_airy", "documentary", "classic_timeless"],
        min_budget=600,
        available_dates=[
            "2026-04-05",
            "2026-04-19",
            "2026-04-26",
            "2026-05-10",
            "2026-05-24",
            "2026-06-07",
            "2026-06-28",
            "2026-07-12",
        ],
        rating=4.8,
    ),
    Photographer(
        id="ph_003",
        name="Sofia Ramirez",
        styles=["editorial", "bright_airy", "fine_art"],
        min_budget=500,
        available_dates=[
            "2026-04-12",
            "2026-04-26",
            "2026-05-03",
            "2026-05-17",
            "2026-05-31",
            "2026-06-14",
            "2026-06-21",
            "2026-07-05",
            "2026-07-19",
        ],
        rating=4.7,
    ),
    Photographer(
        id="ph_004",
        name="James Whitfield",
        styles=["classic_timeless", "documentary", "dark_moody"],
        min_budget=750,
        available_dates=[
            "2026-04-05",
            "2026-04-12",
            "2026-05-10",
            "2026-05-24",
            "2026-06-07",
            "2026-06-28",
            "2026-07-12",
            "2026-07-26",
        ],
        rating=4.9,
    ),
]

# Pre-qualified leads for dashboard
MOCK_LEADS = [
    {
        "id": "lead_001",
        "clientName": "Amara Johnson",
        "clientEmail": "amara@example.com",
        "eventType": "wedding",
        "selectedStyles": ["dark_moody", "editorial"],
        "budget": 3500,
        "eventDate": "2026-06-14",
        "location": "Brooklyn, NY",
        "notes": "Intimate ceremony, 80 guests. Love dramatic lighting.",
        "matchScore": 0.94,
        "status": "QUALIFIED",
        "createdAt": "2026-03-08T14:30:00Z",
    },
    {
        "id": "lead_002",
        "clientName": "David Park",
        "clientEmail": "david.p@example.com",
        "eventType": "portrait",
        "selectedStyles": ["fine_art", "editorial"],
        "budget": 1200,
        "eventDate": "2026-05-03",
        "location": "Manhattan, NY",
        "notes": "Executive headshots for a creative agency rebrand.",
        "matchScore": 0.87,
        "status": "QUALIFIED",
        "createdAt": "2026-03-09T09:15:00Z",
    },
    {
        "id": "lead_003",
        "clientName": "Priya Mehta",
        "clientEmail": "priya.m@example.com",
        "eventType": "wedding",
        "selectedStyles": ["bright_airy", "classic_timeless"],
        "budget": 5000,
        "eventDate": "2026-07-19",
        "location": "Hudson Valley, NY",
        "notes": "Outdoor garden wedding, golden hour ceremony.",
        "matchScore": 0.78,
        "status": "NEW",
        "createdAt": "2026-03-10T11:45:00Z",
    },
    {
        "id": "lead_004",
        "clientName": "Leo Fischer",
        "clientEmail": "leo.f@example.com",
        "eventType": "commercial",
        "selectedStyles": ["editorial", "dark_moody"],
        "budget": 2800,
        "eventDate": "2026-05-17",
        "location": "SoHo, NY",
        "notes": "Product shoot for luxury watch brand. Need cinematic feel.",
        "matchScore": 0.91,
        "status": "CONTACTED",
        "createdAt": "2026-03-07T16:20:00Z",
    },
]


# ---------------------------------------------------------------------------
# Matching algorithm
# ---------------------------------------------------------------------------

def compute_match_score(lead: LeadIn, photographer: Photographer) -> float:
    """
    Score 0..1 based on:
      - Style overlap   (50 %)
      - Budget fit       (25 %)
      - Date availability (25 %)
    """
    # Style overlap
    overlap = set(lead.selected_styles) & set(photographer.styles)
    style_score = len(overlap) / max(len(lead.selected_styles), 1)

    # Budget fit — 1.0 if budget >= photographer min, scaled down otherwise
    if lead.budget >= photographer.min_budget:
        budget_score = 1.0
    else:
        budget_score = lead.budget / photographer.min_budget

    # Availability
    available = lead.event_date in photographer.available_dates
    avail_score = 1.0 if available else 0.0

    score = round(style_score * 0.50 + budget_score * 0.25 + avail_score * 0.25, 2)
    return score


# ---------------------------------------------------------------------------
# Endpoints
# ---------------------------------------------------------------------------

@app.get("/api/health")
async def health():
    return {"status": "ok"}


@app.get("/api/available-dates")
async def available_dates():
    """Return the union of all photographer available dates."""
    all_dates: set[str] = set()
    for ph in MOCK_PHOTOGRAPHERS:
        all_dates.update(ph.available_dates)
    return {"dates": sorted(all_dates)}


@app.post("/api/match", response_model=list[MatchResult])
async def match(lead: LeadIn):
    """
    Receive intake form data, run matching against all photographers,
    return ranked results.
    """
    if lead.budget < 500:
        raise HTTPException(status_code=422, detail="Minimum budget is $500")

    results: list[MatchResult] = []
    for ph in MOCK_PHOTOGRAPHERS:
        score = compute_match_score(lead, ph)
        overlap = list(set(lead.selected_styles) & set(ph.styles))
        available = lead.event_date in ph.available_dates

        if score >= 0.4:
            if score >= 0.75:
                msg = f"Excellent match! {ph.name} specialises in your chosen aesthetic."
            elif score >= 0.5:
                msg = f"Good match. {ph.name} covers several of your preferred styles."
            else:
                msg = f"Partial match. {ph.name} may still be a great fit — review their portfolio."

            results.append(
                MatchResult(
                    photographer_name=ph.name,
                    match_score=score,
                    styles_overlap=overlap,
                    available=available,
                    message=msg,
                )
            )

    results.sort(key=lambda r: r.match_score, reverse=True)
    return results


@app.get("/api/leads")
async def get_leads():
    """Return mock qualified leads for the dashboard."""
    return {"leads": MOCK_LEADS}
